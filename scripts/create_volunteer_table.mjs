import postgres from "postgres";

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("Falta POSTGRES_URL o una conexión equivalente.");
}

const sql = postgres(connectionString, {
  prepare: false,
  connect_timeout: 15,
  max: 1,
  ssl: "require"
});

try {
  await sql.begin(async (tx) => {
    await tx`
      create table if not exists volunteer_submissions (
        id uuid primary key,
        full_name text not null,
        email text not null,
        phone text not null,
        reason text not null,
        consent boolean not null,
        status text not null,
        risk_decision text not null,
        risk_reasons jsonb not null default '[]'::jsonb,
        risk_score integer not null,
        dedupe_email_hash text not null unique,
        source_ip_hash text not null,
        source_user_agent_hash text not null,
        source_fingerprint_hash text not null,
        source_origin_host text,
        source_submitted_at_ms bigint not null,
        security_token_issued_at_ms bigint not null,
        security_submit_time_ms bigint not null,
        security_captcha_verified boolean not null,
        security_high_protection_mode boolean not null,
        created_at_ms bigint not null,
        updated_at_ms bigint not null
      )
    `;
    await tx`
      create index if not exists volunteer_submissions_status_created_idx
      on volunteer_submissions (status, created_at_ms desc)
    `;
    await tx`
      create table if not exists volunteer_portal_credentials (
        credential_key text primary key,
        password_hash text not null,
        password_salt text not null,
        password_iterations integer not null,
        active boolean not null default true,
        created_at_ms bigint not null,
        updated_at_ms bigint not null
      )
    `;
  });

  const columns = await sql`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'volunteer_submissions'
    order by ordinal_position
  `;

  if (columns.length !== 22) {
    throw new Error(`Esquema inesperado: se encontraron ${columns.length} columnas.`);
  }

  const credentialTable = await sql`
    select exists(
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = 'volunteer_portal_credentials'
    ) as exists
  `;

  if (!credentialTable[0]?.exists) {
    throw new Error("No se pudo verificar volunteer_portal_credentials.");
  }

  console.log(`volunteer_submissions lista (${columns.length} columnas) y credenciales preparadas.`);
} finally {
  await sql.end({ timeout: 5 });
}
