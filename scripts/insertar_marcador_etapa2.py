import asyncio, asyncpg, hashlib, os, time
from pathlib import Path

def load_database_url():
    values = dict(os.environ)
    root = Path(__file__).parent.parent
    for path in (root / ".env.local", root / ".env"):
        try:
            for line in path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                values.setdefault(key.strip(), value.strip().strip('"'))
        except FileNotFoundError:
            continue
    for name in ("POSTGRES_URL_NON_POOLING", "POSTGRES_PRISMA_URL", "POSTGRES_URL"):
        if values.get(name):
            return values[name]
    raise RuntimeError("Configura POSTGRES_URL_NON_POOLING o POSTGRES_URL en .env.local")


DB = load_database_url()

MARKER_ID = "aaaaaaaa-0000-0000-0000-000000000002"

def h(s): return hashlib.sha256(s.encode()).hexdigest()

async def main():
    conn = await asyncpg.connect(DB)
    now_ms = int(time.time() * 1000)

    await conn.execute("""
        INSERT INTO signatures (
            id, first_name, last_name, full_name,
            rut, email, age, country, legal_nature,
            region, commune, affiliation, message,
            consent, updates, status,
            risk_decision, risk_reasons, risk_score,
            dedupe_email_hash, dedupe_identity_hash,
            dedupe_rut_hash, dedupe_ip_email_hash,
            source_ip_hash, source_user_agent_hash, source_fingerprint_hash,
            source_submitted_at_ms, security_token_issued_at_ms,
            security_submit_time_ms, security_captcha_verified,
            security_high_protection_mode,
            created_at_ms, updated_at_ms, source_name
        ) VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8, $9,
            $10, $11, $12, $13,
            $14, $15, $16,
            $17, $18, $19,
            $20, $21,
            $22, $23,
            $24, $25, $26,
            $27, $28,
            $29, $30,
            $31,
            $32, $33, $34
        )
    """,
        MARKER_ID,
        "MARCADOR", "SISTEMA", "MARCADOR SISTEMA",
        "ETAPA2-INICIO",
        "marcador-etapa2@esmasqueunpinguino.cl",
        "0", "CL", "natural",
        "Sistema", "Sistema",
        "Marcador interno de campaña — no es una firma ciudadana",
        "Inicio de la segunda etapa de la campaña — 26 de abril de 2026. "
        "Las firmas con created_at_ms anterior a este registro corresponden a la primera etapa.",
        False, False, "marker",
        "approved", "[]", 0,
        h("MARCADOR_EMAIL_ETAPA2"), h("MARCADOR_IDENTITY_ETAPA2"),
        h("MARCADOR_RUT_ETAPA2"), h("MARCADOR_IP_ETAPA2"),
        h("MARCADOR_IP"), h("MARCADOR_UA"), h("MARCADOR_FP"),
        now_ms, now_ms,
        0, False,
        False,
        now_ms, now_ms, "internal-marker",
    )

    row = await conn.fetchrow(
        "SELECT id, full_name, status, created_at_ms FROM signatures WHERE id = $1",
        MARKER_ID,
    )
    print("✓ Marcador insertado")
    print(f"  id:          {row['id']}")
    print(f"  nombre:      {row['full_name']}")
    print(f"  status:      {row['status']}")
    print(f"  created_at:  {row['created_at_ms']} ms")
    await conn.close()

asyncio.run(main())
