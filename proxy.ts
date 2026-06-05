import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { rateLimit, type RateLimitResult } from "@/lib/rate-limit";

// Next.js 16 "proxy" convention (formerly middleware). It runs on every request
// matched below and does two things:
//   1. Applies a standard in-memory rate limit, keyed by client IP.
//   2. Gates /dashboard behind a valid signed session, redirecting to login.

// A generous global budget for normal browsing/API use...
const GLOBAL = { limit: 100, windowMs: 60_000 };
// ...and a strict budget for the login endpoint to slow password brute-forcing.
const LOGIN = { limit: 5, windowMs: 60_000 };

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "127.0.0.1";
}

function withRateHeaders(res: NextResponse, r: RateLimitResult): NextResponse {
  res.headers.set("RateLimit-Limit", String(r.limit));
  res.headers.set("RateLimit-Remaining", String(r.remaining));
  res.headers.set("RateLimit-Reset", String(r.reset));
  return res;
}

function tooManyRequests(r: RateLimitResult): NextResponse {
  const res = NextResponse.json({ error: "Too many requests" }, { status: 429 });
  res.headers.set("Retry-After", String(r.retryAfter));
  return withRateHeaders(res, r);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);

  // 1. Rate limiting — a tighter, separate bucket for the login endpoint.
  const isLogin = pathname === "/api/admin/login";
  const limit = rateLimit(
    isLogin ? `login:${ip}` : `global:${ip}`,
    isLogin ? LOGIN : GLOBAL
  );
  if (!limit.success) return tooManyRequests(limit);

  // 2. Dashboard auth gate (the login page itself stays reachable).
  if (pathname.startsWith("/dashboard") && pathname !== "/dashboard/login") {
    const ok = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!ok) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/dashboard/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return withRateHeaders(NextResponse.next(), limit);
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|uploads/).*)",
  ],
};
