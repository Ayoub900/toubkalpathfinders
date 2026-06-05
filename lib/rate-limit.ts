/**
 * Minimal in-memory, fixed-window rate limiter.
 *
 * Keyed by an arbitrary string (typically client IP, optionally namespaced per
 * endpoint). State lives in a module-level Map, so it is per-process and resets
 * on restart — fine for a single instance and explicitly the "in memory"
 * behaviour requested. For multi-instance deployments swap the store for Redis.
 */

export interface RateLimitOptions {
  /** Max requests allowed within the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Epoch seconds at which the current window resets. */
  reset: number;
  /** Seconds until reset (handy for the Retry-After header). */
  retryAfter: number;
}

interface Entry {
  count: number;
  resetAt: number; // epoch ms
}

const store = new Map<string, Entry>();

let lastCleanup = 0;
const CLEANUP_INTERVAL_MS = 60_000;

/** Drop expired entries occasionally so the Map can't grow without bound. */
function maybeCleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  maybeCleanup(now);

  let entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + opts.windowMs };
    store.set(key, entry);
  }

  entry.count += 1;

  const remaining = Math.max(0, opts.limit - entry.count);
  const reset = Math.ceil(entry.resetAt / 1000);
  return {
    success: entry.count <= opts.limit,
    limit: opts.limit,
    remaining,
    reset,
    retryAfter: Math.max(0, Math.ceil((entry.resetAt - now) / 1000)),
  };
}
