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

export interface VolunteerPortalCredential {
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  active: boolean;
}

export interface VolunteerListItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  reason: string;
  consent: boolean;
  status: "accepted" | "flagged";
  createdAtMs: number;
}

export interface VolunteerListResult {
  items: VolunteerListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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

export async function getVolunteerPortalCredential(): Promise<VolunteerPortalCredential | null> {
  if (!isPostgresAvailable) return null;

  const rows = await withPostgres((sql) => sql`
    select password_hash, password_salt, password_iterations, active
    from volunteer_portal_credentials
    where credential_key = 'volunteer-list'
    limit 1
  `);
  const row = rows[0];
  if (!row) return null;

  return {
    passwordHash: String(row.password_hash ?? ""),
    passwordSalt: String(row.password_salt ?? ""),
    passwordIterations: Number(row.password_iterations ?? 0),
    active: Boolean(row.active)
  };
}

export async function listVolunteerSubmissions(params: {
  search?: string;
  status?: "accepted" | "flagged" | "all";
  page?: number;
  pageSize?: number;
} = {}): Promise<VolunteerListResult> {
  if (!isPostgresAvailable) {
    return { items: [], total: 0, page: 1, pageSize: 100, totalPages: 1 };
  }

  const search = (params.search ?? "").trim().slice(0, 120);
  const status = params.status ?? "all";
  const page = Math.max(1, Math.floor(params.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 100)));
  const offset = (page - 1) * pageSize;
  const searchPattern = `%${search}%`;

  const [countRows, rows] = await Promise.all([
    withPostgres((sql) => sql`
      select count(*)::int as total
      from volunteer_submissions
      where (
        ${search === ""}
        or full_name ilike ${searchPattern}
        or email ilike ${searchPattern}
        or phone ilike ${searchPattern}
      )
      and (${status === "all"} or status = ${status})
    `),
    withPostgres((sql) => sql`
      select id, full_name, email, phone, reason, consent, status, created_at_ms
      from volunteer_submissions
      where (
        ${search === ""}
        or full_name ilike ${searchPattern}
        or email ilike ${searchPattern}
        or phone ilike ${searchPattern}
      )
      and (${status === "all"} or status = ${status})
      order by created_at_ms desc
      limit ${pageSize}
      offset ${offset}
    `)
  ]);

  const total = Number(countRows[0]?.total ?? 0);
  return {
    items: rows.map((row) => ({
      id: String(row.id),
      fullName: String(row.full_name ?? ""),
      email: String(row.email ?? ""),
      phone: String(row.phone ?? ""),
      reason: String(row.reason ?? ""),
      consent: Boolean(row.consent),
      status: row.status === "flagged" ? "flagged" : "accepted",
      createdAtMs: Number(row.created_at_ms ?? 0)
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
}
