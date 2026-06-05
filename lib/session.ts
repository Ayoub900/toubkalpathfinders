/**
 * Stateless, signed session tokens for the admin gate.
 *
 * A token is `${payload}.${signature}` where `payload` is a base64url-encoded
 * JSON blob holding an expiry, and `signature` is an HMAC-SHA256 of that payload
 * keyed with SESSION_SECRET. This is the standard signed-cookie pattern: the
 * cookie no longer carries (a reversible encoding of) the password, it cannot be
 * forged without the secret, and it expires on its own.
 *
 * Everything here uses the Web Crypto API and btoa/atob so it runs unchanged in
 * both the Node.js route handlers and the Edge proxy (middleware). It must NOT
 * import `next/headers`, which is server-component only.
 */

export const SESSION_COOKIE = "pf_session";

/** How long a freshly minted session stays valid. */
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  // Prefer a dedicated secret; fall back to the dashboard password so the app
  // still works if only that is configured (dev). Production should set
  // SESSION_SECRET to a long random value.
  return process.env.SESSION_SECRET ?? process.env.DASHBOARD_PASSWORD ?? "";
}

// --- base64url helpers (Edge + Node compatible) -----------------------------

function bytesToBinary(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return s;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  return btoa(bytesToBinary(bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function strToBase64Url(str: string): string {
  return bytesToBase64Url(new TextEncoder().encode(str));
}

function base64UrlToStr(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// --- HMAC --------------------------------------------------------------------

async function hmac(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return bytesToBase64Url(new Uint8Array(sig));
}

/** Constant-time string comparison (avoids leaking match position via timing). */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

// --- public API --------------------------------------------------------------

/** Mint a signed session token valid for SESSION_TTL_SECONDS. */
export async function createSession(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = strToBase64Url(JSON.stringify({ exp }));
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

/** Verify a token's signature and expiry. Safe to call with undefined. */
export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = await hmac(payload);
  if (!timingSafeEqual(sig, expected)) return false;

  try {
    const { exp } = JSON.parse(base64UrlToStr(payload)) as { exp?: unknown };
    if (typeof exp !== "number") return false;
    if (exp < Math.floor(Date.now() / 1000)) return false;
  } catch {
    return false;
  }
  return true;
}

/** Timing-safe password check against DASHBOARD_PASSWORD. */
export async function checkPassword(input: string): Promise<boolean> {
  const pw = process.env.DASHBOARD_PASSWORD ?? "";
  if (!pw) return false;
  // Compare HMACs so the comparison time is independent of input length/content.
  const [a, b] = await Promise.all([hmac(input), hmac(pw)]);
  return timingSafeEqual(a, b);
}
