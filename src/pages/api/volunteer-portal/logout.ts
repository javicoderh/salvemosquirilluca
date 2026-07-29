import type { APIRoute } from "astro";
import { clearVolunteerPortalSessionCookie } from "../../../lib/security/volunteer-portal-auth";

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  clearVolunteerPortalSessionCookie(cookies);
  return new Response(null, {
    status: 303,
    headers: {
      location: "/lista-voluntarios",
      "cache-control": "no-store"
    }
  });
};
