import type { APIRoute } from "astro";
import { isSecurityConfigured, isServerStorageConfigured, securityConfig } from "../../../lib/security/config";
import { hashWithSecret } from "../../../lib/security/hash";
import { logSecurityEvent } from "../../../lib/security/logging";
import { securityMessages } from "../../../lib/security/messages";
import { verifyPassword } from "../../../lib/security/password";
import { enforceRateLimit } from "../../../lib/security/rate-limit";
import { getClientIp, isAllowedOrigin } from "../../../lib/security/request";
import {
  clearVolunteerPortalSessionCookie,
  createVolunteerPortalSessionCookie,
  setVolunteerPortalSessionCookie
} from "../../../lib/security/volunteer-portal-auth";
import { getVolunteerPortalCredential } from "../../../lib/security/volunteer-storage";

export const prerender = false;

const redirect = (location: string) =>
  new Response(null, {
    status: 303,
    headers: {
      location,
      "cache-control": "no-store"
    }
  });

export const POST: APIRoute = async ({ request, cookies, url }) => {
  if (!isSecurityConfigured || !isServerStorageConfigured) {
    return redirect("/lista-voluntarios?error=config");
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  const contentType = request.headers.get("content-type") ?? "";
  if (
    contentLength > 4096 ||
    (!contentType.includes("application/x-www-form-urlencoded") &&
      !contentType.includes("multipart/form-data")) ||
    !isAllowedOrigin(request)
  ) {
    clearVolunteerPortalSessionCookie(cookies);
    return redirect("/lista-voluntarios?error=invalid");
  }

  const ip = getClientIp(request.headers);
  const ipHash = await hashWithSecret(securityConfig.hashSecret, "volunteer-portal-ip", ip);
  const rateLimit = await enforceRateLimit(
    "volunteer_portal_login_ip",
    ipHash,
    securityConfig.rateLimits.volunteerPortalLoginIp,
    { route: url.pathname, action: "volunteer_portal_login" }
  );

  if (!rateLimit.allowed) {
    logSecurityEvent({
      route: url.pathname,
      action: "volunteer_portal_login",
      decision: "block",
      reasonCodes: ["rate_limited"],
      hashedIp: ipHash,
      metadata: rateLimit.counts
    });
    clearVolunteerPortalSessionCookie(cookies);
    return redirect("/lista-voluntarios?error=rate_limited");
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const honeypot = String(formData.get("company") ?? "").trim();
  const credential = await getVolunteerPortalCredential();
  const validLength = password.length >= 8 && password.length <= 128;
  const valid =
    !honeypot &&
    validLength &&
    credential?.active === true &&
    (await verifyPassword(password, {
      salt: credential.passwordSalt,
      hash: credential.passwordHash,
      iterations: credential.passwordIterations
    }));

  if (!valid) {
    logSecurityEvent({
      route: url.pathname,
      action: "volunteer_portal_login",
      decision: "block",
      reasonCodes: [honeypot ? "honeypot_filled" : "invalid_credentials"],
      hashedIp: ipHash
    });
    clearVolunteerPortalSessionCookie(cookies);
    return redirect(
      `/lista-voluntarios?error=${encodeURIComponent(
        securityMessages.volunteerPortalInvalidCredentials
      )}`
    );
  }

  const session = await createVolunteerPortalSessionCookie();
  setVolunteerPortalSessionCookie(cookies, session);
  logSecurityEvent({
    route: url.pathname,
    action: "volunteer_portal_login",
    decision: "allow",
    reasonCodes: ["authenticated"],
    hashedIp: ipHash
  });
  return redirect("/lista-voluntarios");
};
