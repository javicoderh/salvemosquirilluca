import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { isUniqueViolation } from "../../lib/db/postgres";
import { verifyCaptchaToken } from "../../lib/security/captcha";
import { isSecurityConfigured, isServerStorageConfigured, securityConfig } from "../../lib/security/config";
import { verifyFormToken } from "../../lib/security/form-token";
import { hashWithSecret } from "../../lib/security/hash";
import { emitSecurityMetric, logSecurityEvent } from "../../lib/security/logging";
import { securityMessages } from "../../lib/security/messages";
import { enforceRateLimit } from "../../lib/security/rate-limit";
import { getClientIp, getUserAgent, isAllowedOrigin } from "../../lib/security/request";
import { scoreSignatureRisk } from "../../lib/security/risk-score";
import { isTokenUsed, markTokenUsed } from "../../lib/security/token-store";
import {
  storeVolunteerSubmission,
  volunteerSubmissionExists
} from "../../lib/security/volunteer-storage";
import {
  looksLikePromptInjection,
  parseVolunteerPayload
} from "../../lib/validation/volunteer-schema";

export const prerender = false;

const suspiciousUserAgentPattern = /(curl|wget|python|httpclient|scrapy|aiohttp|bot|headless)/i;

const jsonResponse = (status: number, body: Record<string, unknown>, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers
    }
  });

function getOriginHost(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

export const POST: APIRoute = async ({ request, url }) => {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

  if (!isSecurityConfigured || !isServerStorageConfigured) {
    return jsonResponse(503, { ok: false, message: securityMessages.genericFailure });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > securityConfig.maxPayloadBytes) {
    return jsonResponse(413, { ok: false, message: securityMessages.invalidSubmission });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (
    !contentType.includes("multipart/form-data") &&
    !contentType.includes("application/x-www-form-urlencoded")
  ) {
    return jsonResponse(415, { ok: false, message: securityMessages.invalidSubmission });
  }

  const ip = getClientIp(request.headers);
  const userAgent = getUserAgent(request.headers);
  const ipHash = await hashWithSecret(securityConfig.hashSecret, "ip", ip);
  const userAgentHash = await hashWithSecret(securityConfig.hashSecret, "ua", userAgent);
  const fingerprintHash = await hashWithSecret(
    securityConfig.hashSecret,
    "volunteer-fp",
    ip,
    userAgent.slice(0, 120),
    request.headers.get("accept-language") ?? ""
  );

  const [ipRateLimit, fingerprintRateLimit] = await Promise.all([
    enforceRateLimit(
      "volunteer_post_ip",
      ipHash,
      securityConfig.rateLimits.volunteerPostIp,
      { route: url.pathname, action: "volunteer_post" }
    ),
    enforceRateLimit(
      "volunteer_post_fingerprint",
      fingerprintHash,
      securityConfig.rateLimits.volunteerPostFingerprint,
      { route: url.pathname, action: "volunteer_post" }
    )
  ]);

  if (!ipRateLimit.allowed || !fingerprintRateLimit.allowed) {
    const retryAfter = Math.max(
      ipRateLimit.retryAfterSeconds,
      fingerprintRateLimit.retryAfterSeconds,
      60
    );
    logSecurityEvent({
      route: url.pathname,
      action: "volunteer_post",
      decision: "block",
      reasonCodes: ["rate_limited"],
      hashedIp: ipHash,
      hashedUserAgent: userAgentHash,
      hashedFingerprint: fingerprintHash,
      requestId,
      metadata: {
        ipCounts: ipRateLimit.counts,
        fingerprintCounts: fingerprintRateLimit.counts
      }
    });
    await emitSecurityMetric("volunteer.rate_limited", 1, { route: url.pathname });

    return jsonResponse(
      429,
      { ok: false, message: securityMessages.rateLimited },
      { "retry-after": String(retryAfter) }
    );
  }

  const formData = await request.formData();
  const honeypot = String(formData.get("company") ?? "").trim();
  const issuedAtMs = Number(formData.get("issued_at_ms") ?? "0");
  const nonce = String(formData.get("form_nonce") ?? "");
  const token = String(formData.get("form_token") ?? "");
  const captchaToken = String(formData.get("captcha_token") ?? "");
  const tokenValid =
    Number.isFinite(issuedAtMs) &&
    nonce.length > 0 &&
    token.length > 0 &&
    (await verifyFormToken({ issuedAtMs, nonce, intent: "volunteer_submit" }, token));
  const submitTimeMs = Date.now() - issuedAtMs;

  if (
    !tokenValid ||
    submitTimeMs < 0 ||
    submitTimeMs > securityConfig.maxTokenAgeMs ||
    (await isTokenUsed(nonce))
  ) {
    return jsonResponse(400, { ok: false, message: securityMessages.invalidSubmission });
  }

  try {
    const volunteer = parseVolunteerPayload({
      fullName: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      reason: formData.get("reason"),
      consent: formData.get("consent") === "on"
    });
    const emailHash = await hashWithSecret(
      securityConfig.hashSecret,
      "volunteer-email",
      volunteer.normalized.email
    );
    const duplicateDetected = await volunteerSubmissionExists(emailHash);
    const invalidOrigin = !isAllowedOrigin(request);
    const suspiciousUserAgent = suspiciousUserAgentPattern.test(userAgent);
    const captcha = await verifyCaptchaToken(captchaToken, ip);
    const promptInjectionSuspected = looksLikePromptInjection(volunteer.reason);
    const risk = scoreSignatureRisk({
      submitTimeMs,
      minSubmitTimeMs: securityConfig.minSubmitTimeMs,
      honeypotFilled: Boolean(honeypot),
      invalidOrigin,
      suspiciousUserAgent,
      duplicateDetected,
      repeatedIpCooldownHit: Number(ipRateLimit.counts.window ?? 0) > 1,
      ipBurstCount: Number(ipRateLimit.counts.burst ?? 0),
      fingerprintBurstCount: Number(fingerprintRateLimit.counts.burst ?? 0),
      captchaVerified: captcha.verified,
      highProtectionMode: securityConfig.highProtectionMode,
      promptInjectionSuspected
    });

    if (duplicateDetected) {
      logSecurityEvent({
        route: url.pathname,
        action: "volunteer_post",
        decision: "block",
        reasonCodes: ["duplicate_volunteer"],
        hashedIp: ipHash,
        hashedUserAgent: userAgentHash,
        hashedFingerprint: fingerprintHash,
        requestId
      });
      return jsonResponse(409, {
        ok: false,
        duplicate: true,
        message: securityMessages.volunteerDuplicate
      });
    }

    if (risk.decision === "block") {
      logSecurityEvent({
        route: url.pathname,
        action: "volunteer_post",
        decision: "block",
        reasonCodes: risk.reasonCodes,
        hashedIp: ipHash,
        hashedUserAgent: userAgentHash,
        hashedFingerprint: fingerprintHash,
        requestId,
        metadata: { submitTimeMs }
      });
      await emitSecurityMetric("volunteer.blocked", 1, { route: url.pathname });
      return jsonResponse(400, { ok: false, message: securityMessages.invalidSubmission });
    }

    const submittedAtMs = Date.now();
    const status = risk.decision === "flag" ? "flagged" : "accepted";

    await storeVolunteerSubmission({
      volunteer,
      status,
      riskDecision: risk.decision,
      riskReasons: risk.reasonCodes,
      riskScore: risk.score,
      emailHash,
      source: {
        ipHash,
        userAgentHash,
        fingerprintHash,
        submittedAtMs,
        originHost: getOriginHost(request)
      },
      metadata: {
        tokenIssuedAtMs: issuedAtMs,
        submitTimeMs,
        captchaVerified: captcha.verified,
        highProtectionMode: securityConfig.highProtectionMode
      }
    });

    await markTokenUsed(nonce, securityConfig.maxTokenAgeMs);
    await emitSecurityMetric("volunteer.accepted", 1, { route: url.pathname, status });
    logSecurityEvent({
      route: url.pathname,
      action: "volunteer_post",
      decision: risk.decision,
      reasonCodes: risk.reasonCodes,
      hashedIp: ipHash,
      hashedUserAgent: userAgentHash,
      hashedFingerprint: fingerprintHash,
      requestId,
      metadata: { status }
    });

    return jsonResponse(200, {
      ok: true,
      status,
      message:
        status === "flagged"
          ? securityMessages.volunteerReview
          : securityMessages.volunteerSuccess
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return jsonResponse(409, {
        ok: false,
        duplicate: true,
        message: securityMessages.volunteerDuplicate
      });
    }

    if (error instanceof ZodError) {
      return jsonResponse(400, {
        ok: false,
        message: securityMessages.invalidSubmission,
        fieldErrors: error.flatten().fieldErrors
      });
    }

    console.error(error);
    return jsonResponse(500, { ok: false, message: securityMessages.genericFailure });
  }
};
