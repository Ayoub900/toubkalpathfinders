/**
 * Database-backed admin credentials (email + password) for the dashboard gate.
 *
 * The single admin account lives in the `AdminUser` collection so both the email
 * and password can be changed at runtime from the dashboard Settings panel. On
 * first use, if no account exists yet, one is bootstrapped from the
 * DASHBOARD_EMAIL / DASHBOARD_PASSWORD environment variables so existing
 * deployments keep working without a manual migration step.
 *
 * Passwords are stored as salted PBKDF2-SHA256 hashes (never plaintext). These
 * helpers run only in Node.js route handlers, so they may use prisma directly.
 */

import { prisma } from "@/lib/prisma";

const PBKDF2_ITERATIONS = 100_000;
const KEY_LEN_BITS = 256;

// --- password hashing --------------------------------------------------------

async function deriveBits(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    KEY_LEN_BITS
  );
  return new Uint8Array(bits);
}

/** Hash a plaintext password into a self-describing `pbkdf2$iter$salt$hash` string. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveBits(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${Buffer.from(salt).toString("base64")}$${Buffer.from(
    hash
  ).toString("base64")}`;
}

/** Constant-time byte comparison. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
  return mismatch === 0;
}

/** Verify a plaintext password against a stored `pbkdf2$...` hash. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;
  const salt = new Uint8Array(Buffer.from(parts[2], "base64"));
  const expected = new Uint8Array(Buffer.from(parts[3], "base64"));
  const actual = await deriveBits(password, salt, iterations);
  return timingSafeEqual(actual, expected);
}

// --- account access ----------------------------------------------------------

type Admin = { id: string; email: string; passwordHash: string };

/**
 * Return the single admin account, creating it from environment variables the
 * first time if the collection is empty. Returns null only when no account
 * exists and no bootstrap env vars are configured.
 */
export async function ensureAdmin(): Promise<Admin | null> {
  const existing = await prisma.adminUser.findFirst();
  if (existing) return existing;

  const email = process.env.DASHBOARD_EMAIL?.trim();
  const password = process.env.DASHBOARD_PASSWORD;
  if (!email || !password) return null;

  return prisma.adminUser.create({
    data: { email: email.toLowerCase(), passwordHash: await hashPassword(password) },
  });
}

/** Current admin email, or null if no account is configured. */
export async function getAdminEmail(): Promise<string | null> {
  const admin = await ensureAdmin();
  return admin?.email ?? null;
}

/** Check an email + password pair against the stored account (timing-safe). */
export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const admin = await ensureAdmin();
  if (!admin) return false;
  if (email.trim().toLowerCase() !== admin.email.toLowerCase()) {
    // Still run a hash to keep timing roughly constant for unknown emails.
    await verifyPassword(password, admin.passwordHash);
    return false;
  }
  return verifyPassword(password, admin.passwordHash);
}

/**
 * Update the admin email and/or password. Caller must have already verified the
 * current password. At least one of `email` / `newPassword` should be provided.
 */
export async function updateCredentials(input: {
  email?: string;
  newPassword?: string;
}): Promise<Admin> {
  const admin = await ensureAdmin();
  if (!admin) throw new Error("No admin account to update");

  const data: { email?: string; passwordHash?: string } = {};
  if (input.email != null) data.email = input.email.trim().toLowerCase();
  if (input.newPassword) data.passwordHash = await hashPassword(input.newPassword);

  return prisma.adminUser.update({ where: { id: admin.id }, data });
}
