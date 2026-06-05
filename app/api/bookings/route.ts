import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthed } from "@/lib/auth";
import { getTrekById } from "@/lib/treks";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const trekId = typeof body.trekId === "string" ? body.trekId : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const peopleNum = Number(body.people);
  const people = Number.isFinite(peopleNum) && peopleNum > 0 ? Math.round(peopleNum) : 1;

  if (!name) return NextResponse.json({ error: "Your name is required" }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });

  const trek = await getTrekById(trekId);
  if (!trek)
    return NextResponse.json({ error: "Unknown trek" }, { status: 400 });

  const booking = await prisma.booking.create({
    data: {
      trekId: trek.id,
      trekName: trek.name,
      name,
      email,
      phone: phone || null,
      date: date || null,
      people,
      message: message || null,
    },
  });

  return NextResponse.json({ ok: true, booking }, { status: 201 });
}
