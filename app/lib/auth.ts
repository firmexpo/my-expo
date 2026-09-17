const SESSION_COOKIE = "firm_expo_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function hexEncode(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexDecode(hex: string): ArrayBuffer {
  const bytes = hex.match(/.{1,2}/g) ?? [];
  const buffer = new ArrayBuffer(bytes.length);
  const view = new Uint8Array(buffer);
  bytes.forEach((b, i) => {
    view[i] = parseInt(b, 16);
  });
  return buffer;
}

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function requireSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your .env file."
    );
  }
  return secret;
}

/** Creates a signed, expiring session token to store in a cookie. */
export async function createSessionToken(): Promise<string> {
  const secret = requireSecret();
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  return `${payload}.${hexEncode(signature)}`;
}

/** Verifies a session token's signature and expiry. */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;

  let secret: string;
  try {
    secret = requireSecret();
  } catch {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [role, expiresStr, signatureHex] = parts;
  if (role !== "admin") return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  try {
    const key = await getKey(secret);
    const payload = `${role}.${expiresStr}`;
    return await crypto.subtle.verify(
      "HMAC",
      key,
      hexDecode(signatureHex),
      encoder.encode(payload)
    );
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
