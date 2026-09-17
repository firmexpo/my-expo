import { timingSafeEqual } from "crypto";

/**
 * Checks a request against a named secret-key env var. These endpoints
 * live outside /api/admin/*, so they are NOT covered by the cookie-based
 * admin session check in proxy.ts — this is their only gate, so treat
 * the env vars as real secrets (long, random, rotated if ever exposed).
 *
 * Accepts either header:
 *   x-api-key: <key>
 *   Authorization: Bearer <key>
 */
export function checkApiKey(request: Request, envVarName: string): boolean {
  const expected = process.env[envVarName];
  if (!expected) {
    // Fail closed: an unconfigured secret means the endpoint is disabled,
    // not "open".
    return false;
  }

  const header = request.headers.get("x-api-key");
  const auth = request.headers.get("authorization");
  const provided = header || (auth?.startsWith("Bearer ") ? auth.slice(7) : null);
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function unauthorizedResponse() {
  return Response.json(
    { ok: false, message: "Unauthorized. Provide a valid API key." },
    { status: 401 }
  );
}
