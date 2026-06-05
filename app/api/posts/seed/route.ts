import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthed } from "@/lib/auth";
import { createPost, postCount } from "@/lib/posts";
import { SEED_POSTS } from "@/lib/blog-seed-data";

/**
 * Seed the database with sample journal posts.
 * Requires the admin cookie. By default it only seeds an empty blog;
 * pass { force: true } to wipe existing posts and re-seed.
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

  const existing = await postCount();
  if (existing > 0 && !force) {
    return NextResponse.json(
      {
        ok: false,
        skipped: true,
        message: `${existing} posts already exist. Pass force:true to reseed.`,
      },
      { status: 200 }
    );
  }

  if (force) {
    await prisma.post.deleteMany({});
  }

  let created = 0;
  for (const post of SEED_POSTS) {
    await createPost(post);
    created++;
  }

  return NextResponse.json({ ok: true, created });
}
