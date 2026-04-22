import type { Context } from "https://edge.netlify.com/";

/**
 * admin-v2-guard — gate for /admin-v2/* static assets (.jsx source, data, etc.).
 *
 * Security model: decode-only JWT check, NOT cryptographic signature verification.
 *
 * Why this is acceptable on Netlify Personal plan:
 * - nf_jwt is HttpOnly + Secure + SameSite=Lax. Client-side JavaScript cannot
 *   read or set it; only Netlify Identity's login endpoint issues it.
 * - Real signature verification happens downstream in Netlify Functions
 *   (e.g. admin-sales.js) via context.clientContext.identity, which Netlify
 *   populates only after verifying the JWT. Any endpoint that returns real
 *   customer or order data is gated there, not here.
 * - This Edge Function's job is to block the realistic threat — a `curl` of
 *   /admin-v2/src/data.jsx by an unauthenticated client — not to be the last
 *   line of defense for sensitive data.
 *
 * On upgrade to Netlify Pro: delete this file and replace with a role-based
 * redirect in netlify.toml ([[redirects]] with Role = ["admin"]).
 *
 * Allow-listed paths (shell, index.html, styles.css) are configured in
 * netlify.toml via `excludedPath` so Identity widget can render pre-login.
 */

interface JWTPayload {
  exp?: number;
  app_metadata?: { roles?: string[] };
}

function decodeJWT(token: string): JWTPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(padded)) as JWTPayload;
  } catch {
    return null;
  }
}

export default async (req: Request, context: Context) => {
  const path = new URL(req.url).pathname;
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookieNames = cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter(Boolean);
  const token = context.cookies.get("nf_jwt");

  // DEBUG (temporary): diagnose post-login redirect loop on deploy preview.
  // Remove once diagnosis is complete. Does not log the token itself.
  console.log("[admin-v2-guard] request", {
    path,
    hasCookieHeader: cookieHeader.length > 0,
    cookieNames,
    hasNfJwt: !!token,
  });

  if (!token) {
    return Response.redirect(new URL("/admin-v2/", req.url), 302);
  }

  const payload = decodeJWT(token);
  if (!payload) {
    console.log("[admin-v2-guard] jwt decode failed");
    return new Response("Invalid session", { status: 401 });
  }

  console.log("[admin-v2-guard] payload shape", {
    payloadKeys: Object.keys(payload),
    appMetadataKeys: payload.app_metadata ? Object.keys(payload.app_metadata) : null,
    roles: payload.app_metadata?.roles ?? null,
  });

  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp <= now) {
    return Response.redirect(new URL("/admin-v2/", req.url), 302);
  }

  const roles = payload.app_metadata?.roles ?? [];
  if (!roles.includes("admin")) {
    return new Response("403 Forbidden — admin role required", { status: 403 });
  }
};
