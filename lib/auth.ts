import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Re-export the session primitives so route handlers have a single auth import.
export {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSession,
  verifySession,
} from "@/lib/session";

/** Server-side auth check (Server Components / Route Handlers). */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}
