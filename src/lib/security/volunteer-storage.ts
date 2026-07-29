import { isPostgresAvailable, withPostgres } from "../db/postgres";
import type { NormalizedVolunteer } from "../validation/volunteer-schema";
import { securityConfig } from "./config";
import { countCollectionDocuments, createDocument } from "./firestore-rest";
import type { RiskDecision } from "./risk-score";

export interface StoredVolunteerInput {
  volunteer: NormalizedVolunteer;
  status: "accepted" | "flagged";
  riskDecision: RiskDecision;
  riskReasons: string[];
  riskScore: number;
  emailHash: string;
  source: {
    ipHash: string;
    userAgentHash: string;
    fingerprintHash: string;
    submittedAtMs: number;
    originHost: string | null;
  };
  metadata: {
    tokenIssuedAtMs: number;
    submitTimeMs: number;
    captchaVerified: boolean;
    highProtectionMode: boolean;
  };
}

export async function volunteerSubmissionExists(emailHash: string) {
  if (isPostgresAvailable) {
    const rows = await withPostgres((sql) => sql`
      select exists(
        select 1
        from volunteer_submissions
        where dedupe_email_hash = ${emailHash}
      ) as exists
    `);
    return Boolean(rows[0]?.exists);
  }

  const count = await countCollectionDocuments(securityConfig.collections.volunteerSubmissions, [
    { field: "dedupeEmailHash", op: "EQUAL", value: emailHash }
  ]);
  return count > 0;
}

export async function storeVolunteerSubmission(input: StoredVolunteerInput) {
  const now = Date.now();
  const id = crypto.randomUUID();

  if (isPostgresAvailable) {
    await withPostgres((sql) => sql`
      insert into volunteer_submissions (
        id, full_name, email, phone, reason, consent, status,
        risk_decision, risk_reasons, risk_score, dedupe_email_hash,
        source_ip_hash, source_user_agent_hash, source_fingerprint_hash,
        source_origin_host, source_submitted_at_ms,
        security_token_issued_at_ms, security_submit_time_ms,
        security_captcha_verified, security_high_protection_mode,
        created_at_ms, updated_at_ms
      ) values (
        ${id}, ${input.volunteer.fullName}, ${input.volunteer.email},
        ${input.volunteer.phone}, ${input.volunteer.reason}, ${input.volunteer.consent},
        ${input.status}, ${input.riskDecision}, ${JSON.stringify(input.riskReasons)}::jsonb,
        ${input.riskScore}, ${input.emailHash}, ${input.source.ipHash},
        ${input.source.userAgentHash}, ${input.source.fingerprintHash},
        ${input.source.originHost}, ${input.source.submittedAtMs},
        ${input.metadata.tokenIssuedAtMs}, ${input.metadata.submitTimeMs},
        ${input.metadata.captchaVerified}, ${input.metadata.highProtectionMode},
        ${now}, ${now}
      )
    `);
    return id;
  }

  await createDocument(`${securityConfig.collections.volunteerSubmissions}/${id}`, {
    id,
    fullName: input.volunteer.fullName,
    email: input.volunteer.email,
    phone: input.volunteer.phone,
    reason: input.volunteer.reason,
    consent: input.volunteer.consent,
    status: input.status,
    riskDecision: input.riskDecision,
    riskReasons: input.riskReasons,
    riskScore: input.riskScore,
    dedupeEmailHash: input.emailHash,
    source: input.source,
    security: input.metadata,
    createdAtMs: now,
    updatedAtMs: now
  });

  return id;
}
