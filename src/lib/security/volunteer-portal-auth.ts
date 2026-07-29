import type { AstroCookies } from "astro";
import { securityConfig } from "./config";
import { hmacSha256Base64Url } from "./hash";

const cookieName = "volunteer_portal_session";
const sessionTtlMs = 1000 * 60 * 60 * 8;
const sessionIntent = "volunteer_portal_session";

export interface VolunteerPortalSession {
  expiresAtMs: number;
}

const serialize = (expiresAtMs: number, nonce: string) =>
  `${expiresAtMs}.${nonce}.${sessionIntent}`;

export async function createVolunteerPortalSessionCookie() {
  const expiresAtMs = Date.now() + sessionTtlMs;
  const nonce = crypto.randomUUID();
  const signature = await hmacSha256Base64Url(
    securityConfig.hashSecret,
    serialize(expiresAtMs, nonce)
  );
  return `${expiresAtMs}.${nonce}.${signature}`;
}

export async function verifyVolunteerPortalSessionCookie(
  value: string | undefined | null
): Promise<VolunteerPortalSession | null> {
  if (!value) return null;
  const [expiresRaw, nonce, signature, ...extra] = value.split(".");
  const expiresAtMs = Number(expiresRaw);

  if (
    extra.length > 0 ||
    !nonce ||
    !signature ||
    !Number.isFinite(expiresAtMs) ||
    expiresAtMs < Date.now()
  ) {
    return null;
  }

  const expected = await hmacSha256Base64Url(
    securityConfig.hashSecret,
    serialize(expiresAtMs, nonce)
  );
  if (expected !== signature) return null;
  return { expiresAtMs };
}

export async function getVolunteerPortalSessionFromCookies(cookies: AstroCookies) {
  return verifyVolunteerPortalSessionCookie(cookies.get(cookieName)?.value);
}

export function setVolunteerPortalSessionCookie(cookies: AstroCookies, value: string) {
  cookies.set(cookieName, value, {
    path: "/lista-voluntarios",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    maxAge: Math.floor(sessionTtlMs / 1000)
  });
}

export function clearVolunteerPortalSessionCookie(cookies: AstroCookies) {
  cookies.delete(cookieName, {
    path: "/lista-voluntarios"
  });
}
