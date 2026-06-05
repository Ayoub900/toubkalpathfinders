import { prisma } from "./prisma";
import type { Post } from "@prisma/client";
import { sanitizeHtml, htmlToText, readingMinutes } from "./sanitize";

export type { Post };
export { htmlToText } from "./sanitize";

export type PostCategory =
  | "guides"
  | "stories"
  | "conservation"
  | "training"
  | "news";

export const POST_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: "guides", label: "Trekking Guides" },
  { value: "stories", label: "Trail Stories" },
  { value: "conservation", label: "Conservation" },
  { value: "training", label: "Training & Prep" },
  { value: "news", label: "News" },
];

export const POST_CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  POST_CATEGORIES.map((c) => [c.value, c.label])
);

const VALID_CATEGORIES = new Set(POST_CATEGORIES.map((c) => c.value));

/** Placeholder tone used on cards/heroes when a post has no cover image. */
const TONE_BY_CAT: Record<string, string> = {
  guides: "lime-ph",
  stories: "orange-ph",
  conservation: "lime-ph",
  training: "dark-ph",
  news: "",
};

export function postTone(p: Pick<Post, "category">): string {
  return TONE_BY_CAT[p.category] ?? "";
}

/* ---------------- queries ---------------- */

export async function getPosts(opts?: { includeUnpublished?: boolean }) {
  return prisma.post.findMany({
    where: opts?.includeUnpublished ? undefined : { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

export async function postCount() {
  return prisma.post.count();
}

/** Newest published posts sharing a category, excluding the current one. */
export async function getRelatedPosts(post: Post, take = 3) {
  return prisma.post.findMany({
    where: {
      published: true,
      category: post.category,
      id: { not: post.id },
    },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

/* ---------------- mutations ---------------- */

export interface PostInput {
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  coverImage?: string | null;
  coverAlt?: string | null;
  author?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  featured?: boolean;
  published?: boolean;
  order?: number;
  publishedAt?: Date;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "post";
  let candidate = root;
  let n = 1;
  // Blog volume is small, so a sequential probe is cheap and predictable.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${root}-${++n}`;
  }
}

/** Build the persisted data shape shared by create & update. */
function toData(input: PostInput) {
  const content = sanitizeHtml(input.content);
  return {
    title: input.title,
    excerpt: input.excerpt,
    content,
    category: input.category,
    tags: input.tags ?? [],
    coverImage: input.coverImage ?? null,
    coverAlt: input.coverAlt ?? null,
    author: input.author?.trim() || "Toubkal Pathfinders",
    readingMinutes: readingMinutes(content),
    metaTitle: input.metaTitle ?? null,
    metaDescription: input.metaDescription ?? null,
    featured: input.featured ?? false,
    published: input.published ?? true,
    order: input.order ?? 0,
  };
}

export async function createPost(input: PostInput) {
  const slug = await uniqueSlug(input.slug || input.title);
  return prisma.post.create({
    data: {
      slug,
      ...toData(input),
      publishedAt: input.publishedAt ?? new Date(),
    },
  });
}

export async function updatePost(id: string, input: PostInput) {
  const slug = input.slug ? await uniqueSlug(input.slug, id) : undefined;
  return prisma.post.update({
    where: { id },
    data: {
      ...(slug ? { slug } : {}),
      ...toData(input),
      ...(input.publishedAt ? { publishedAt: input.publishedAt } : {}),
    },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}

/* ---------------- request parsing ---------------- */

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optStr(value: unknown): string | null {
  const s = str(value);
  return s ? s : null;
}

/**
 * Validate & normalise an incoming JSON body into a PostInput.
 * Excerpt and reading time are auto-derived from the content when omitted.
 */
export function parsePostInput(
  body: unknown
): { ok: true; data: PostInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid body" };
  }
  const b = body as Record<string, unknown>;

  const title = str(b.title);
  const category = str(b.category);
  const content = typeof b.content === "string" ? b.content : "";

  if (!title) return { ok: false, error: "Title is required" };
  if (!VALID_CATEGORIES.has(category as PostCategory))
    return { ok: false, error: "Invalid category" };
  if (htmlToText(content).length < 1)
    return { ok: false, error: "Content is required" };

  // Auto-derive an excerpt from the body when the author leaves it blank.
  let excerpt = str(b.excerpt);
  if (!excerpt) {
    excerpt = htmlToText(content).slice(0, 180).trim();
    if (excerpt.length === 180) excerpt += "…";
  }

  let publishedAt: Date | undefined;
  if (typeof b.publishedAt === "string" && b.publishedAt.trim()) {
    const d = new Date(b.publishedAt);
    if (!Number.isNaN(d.getTime())) publishedAt = d;
  }

  return {
    ok: true,
    data: {
      slug: str(b.slug) || title,
      title,
      excerpt,
      content,
      category,
      tags: toStringArray(b.tags),
      coverImage: optStr(b.coverImage),
      coverAlt: optStr(b.coverAlt),
      author: optStr(b.author),
      metaTitle: optStr(b.metaTitle),
      metaDescription: optStr(b.metaDescription),
      featured: Boolean(b.featured),
      published: b.published === undefined ? true : Boolean(b.published),
      order: Number.isFinite(Number(b.order)) ? Number(b.order) : 0,
      publishedAt,
    },
  };
}

/* ---------------- formatting helpers ---------------- */

export function formatPostDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
