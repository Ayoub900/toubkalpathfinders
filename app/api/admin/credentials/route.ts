import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import {
  getAdminEmail,
  updateCredentials,
  verifyCredentials,
} from "@/lib/credentials";

/** Return the current admin email so the Settings form can prefill it. */
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const email = await getAdminEmail();
  return NextResponse.json({ email });
}

/** Change the admin email and/or password. Requires the current password. */
export async function PATCH(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    email?: unknown;
    currentPassword?: unknown;
    newPassword?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const email =
    typeof body.email === "string" ? body.email.trim() : undefined;
  const newPassword =
    typeof body.newPassword === "string" && body.newPassword.length > 0
      ? body.newPassword
      : undefined;

  if (email === undefined && newPassword === undefined) {
    return NextResponse.json(
      { error: "Provide a new email or a new password" },
      { status: 400 }
    );
  }

  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  if (newPassword !== undefined && newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // Confirm the request is from someone who knows the current password.
  const currentEmail = await getAdminEmail();
  if (!currentEmail || !(await verifyCredentials(currentEmail, currentPassword))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  try {
    const updated = await updateCredentials({ email, newPassword });
    return NextResponse.json({ ok: true, email: updated.email });
  } catch (err) {
    // Most likely a duplicate email (unique constraint).
    if (typeof err === "object" && err && (err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "That email is already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not update credentials" }, { status: 500 });
  }
}
