import { describe, expect, it, vi } from "vitest";

vi.mock("../config", () => ({
  securityConfig: {
    hashSecret: "volunteer-portal-session-test-secret"
  }
}));

import {
  createVolunteerPortalSessionCookie,
  verifyVolunteerPortalSessionCookie
} from "../volunteer-portal-auth";

describe("volunteer portal session", () => {
  it("accepts a newly signed session", async () => {
    const cookie = await createVolunteerPortalSessionCookie();
    const session = await verifyVolunteerPortalSessionCookie(cookie);

    expect(session).not.toBeNull();
    expect(session?.expiresAtMs).toBeGreaterThan(Date.now());
  });

  it("rejects a tampered session", async () => {
    const cookie = await createVolunteerPortalSessionCookie();
    const tampered = `${cookie.slice(0, -1)}${cookie.endsWith("a") ? "b" : "a"}`;

    await expect(verifyVolunteerPortalSessionCookie(tampered)).resolves.toBeNull();
  });

  it("rejects malformed values", async () => {
    await expect(verifyVolunteerPortalSessionCookie("invalid")).resolves.toBeNull();
    await expect(verifyVolunteerPortalSessionCookie(null)).resolves.toBeNull();
  });
});
