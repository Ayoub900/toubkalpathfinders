import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthed } from "@/lib/auth";
import { createTrek, trekCount } from "@/lib/treks";
import { SEED_TREKS } from "@/lib/seed-data";

/**
 * Seed the database with the original trek catalogue.
 * Requires the admin cookie. By default it only seeds an empty database;
 * pass { force: true } to wipe existing treks and re-seed.
 */
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let force = false;
  try {
    const body = await req.json();
    force = Boolean(body?.force);
  } catch {
    // no body — default to non-destructive seed
  }

  const existing = await trekCount();
  if (existing > 0 && !force) {
    return NextResponse.json(
      { ok: false, skipped: true, message: `${existing} treks already exist. Pass force:true to reseed.` },
      { status: 200 }
    );
  }

  if (force) {
    await prisma.booking.deleteMany({});
    await prisma.trek.deleteMany({});
  }

  let created = 0;
  for (const trek of SEED_TREKS) {
    await createTrek(trek);
    created++;
  }

  return NextResponse.json({ ok: true, created });
}
