import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { deleteTrek, getTrekById, parseTrekInput, updateTrek } from "@/lib/treks";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const trek = await getTrekById(id);
  if (!trek) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ trek });
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await getTrekById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

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

  const trek = await updateTrek(id, parsed.data);
  return NextResponse.json({ trek });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await getTrekById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteTrek(id);
  return NextResponse.json({ ok: true });
}
