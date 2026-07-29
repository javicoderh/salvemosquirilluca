import postgres from "postgres";

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL;
const password = process.env.VOLUNTEER_PORTAL_PASSWORD ?? "";

if (!connectionString) {
  throw new Error("Falta POSTGRES_URL o una conexión equivalente.");
}

if (password.length < 8 || password.length > 128) {
  throw new Error("VOLUNTEER_PORTAL_PASSWORD debe tener entre 8 y 128 caracteres.");
}

const toBase64Url = (bytes) =>
  Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const iterations = 210_000;
const saltBytes = crypto.getRandomValues(new Uint8Array(16));
const keyMaterial = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(password),
  "PBKDF2",
  false,
  ["deriveBits"]
);
const derived = await crypto.subtle.deriveBits(
  {
    name: "PBKDF2",
    hash: "SHA-256",
    salt: saltBytes,
    iterations
  },
  keyMaterial,
  256
);
const passwordHash = toBase64Url(new Uint8Array(derived));
const passwordSalt = toBase64Url(saltBytes);

const sql = postgres(connectionString, {
  prepare: false,
  connect_timeout: 15,
  max: 1,
  ssl: "require"
});

try {
  const now = Date.now();
  await sql`
    insert into volunteer_portal_credentials (
      credential_key, password_hash, password_salt, password_iterations,
      active, created_at_ms, updated_at_ms
    ) values (
      'volunteer-list', ${passwordHash},
      ${passwordSalt}, ${iterations}, true, ${now}, ${now}
    )
    on conflict (credential_key) do update set
      password_hash = excluded.password_hash,
      password_salt = excluded.password_salt,
      password_iterations = excluded.password_iterations,
      active = true,
      updated_at_ms = excluded.updated_at_ms
  `;

  const rows = await sql`
    select password_hash, password_salt, password_iterations, active
    from volunteer_portal_credentials
    where credential_key = 'volunteer-list'
    limit 1
  `;
  const stored = rows[0];
  if (
    !stored?.active ||
    stored.password_hash !== passwordHash ||
    stored.password_salt !== passwordSalt ||
    Number(stored.password_iterations) !== iterations
  ) {
    throw new Error("No se pudo verificar la credencial almacenada.");
  }

  console.log("Credencial de lista de voluntarios actualizada como hash PBKDF2.");
} finally {
  await sql.end({ timeout: 5 });
}
