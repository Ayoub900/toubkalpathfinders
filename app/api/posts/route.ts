import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { createPost, getPosts, parsePostInput } from "@/lib/posts";

export async function GET() {
  const authed = await isAuthed();
  const posts = await getPosts({ includeUnpublished: authed });
  return NextResponse.json({ posts });
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

  const parsed = parsePostInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const post = await createPost(parsed.data);
  return NextResponse.json({ post }, { status: 201 });
}
