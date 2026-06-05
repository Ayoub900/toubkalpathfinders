import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { createTrek, getTreks, parseTrekInput } from "@/lib/treks";

export async function GET() {
  const authed = await isAuthed();
  const treks = await getTreks({ includeUnpublished: authed });
  return NextResponse.json({ treks });
}

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseTrekInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const trek = await createTrek(parsed.data);
  return NextResponse.json({ trek }, { status: 201 });
}
