import { parseSignaturePayload, type NormalizedSignature } from "../validation/signature-schema";

type FallbackRecord = NormalizedSignature & { createdAtMs: number };

const records: FallbackRecord[] = [];

export const isQuirillucaFallbackEnabled = true;

export function registerFallbackSignature(raw: Record<string, unknown>) {
  const signature = parseSignaturePayload(raw);
  const duplicate = records.some(
    (item) => item.normalized.email === signature.normalized.email || item.normalized.rut === signature.normalized.rut
  );
  if (duplicate) throw new Error("fallback-duplicate");
  records.push({ ...signature, createdAtMs: Date.now() });
  return signature;
}

export function getFallbackSignatureCount() {
  return {
    count: records.length,
    chileanCount: records.filter((item) => item.country.toLowerCase() === "chile").length,
    foreignCount: records.filter((item) => item.country.toLowerCase() !== "chile").length
  };
}
