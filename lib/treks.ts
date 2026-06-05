import { prisma } from "./prisma";
import type { Trek } from "@prisma/client";

export type { Trek };

/** A single leg of a trek itinerary (stored in the `itinerary` Json field). */
export interface ItineraryDay {
  day: string;
  title: string;
  detail: string;
}

export type TrekCategory = "summit" | "multi" | "running" | "signature";

export const CATEGORIES: { value: TrekCategory; label: string }[] = [
  { value: "summit", label: "Summit" },
  { value: "multi", label: "Multi-Day" },
  { value: "running", label: "Trail Running" },
  { value: "signature", label: "Signature" },
];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);

/** Placeholder tone used when a trek has no uploaded image. */
const TONE_BY_CAT: Record<string, string> = {
  summit: "lime-ph",
  multi: "orange-ph",
  running: "dark-ph",
  signature: "dark-ph",
};

export function trekTone(t: Pick<Trek, "cat">): string {
  return TONE_BY_CAT[t.cat] ?? "";
}

export function parseItinerary(value: unknown): ItineraryDay[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (d): d is ItineraryDay =>
      !!d && typeof d === "object" && "title" in (d as object)
  );
}

/* ---------------- queries ---------------- */

export async function getTreks(opts?: { includeUnpublished?: boolean }) {
  return prisma.trek.findMany({
    where: opts?.includeUnpublished ? undefined : { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getTrekBySlug(slug: string) {
  return prisma.trek.findUnique({ where: { slug } });
}

export async function getTrekById(id: string) {
  return prisma.trek.findUnique({ where: { id } });
}

export async function trekCount() {
  return prisma.trek.count();
}

/* ---------------- mutations ---------------- */

export interface TrekInput {
  slug?: string;
  cat: string;
  name: string;
  blurb: string;
  description?: string | null;
  price: string;
  priceValue?: number | null;
  priceNote: string;
  duration?: string | null;
  difficulty?: string | null;
  image?: string | null;
  gallery?: string[];
  highlights?: string[];
  included?: string[];
  itinerary?: ItineraryDay[];
  featured?: boolean;
  published?: boolean;
  order?: number;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "trek";
  let candidate = root;
  let n = 1;
  // Loop until we find a slug not used by another document.
  // (Trek counts are small, so this is cheap.)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.trek.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${root}-${++n}`;
  }
}

export async function createTrek(input: TrekInput) {
  const slug = await uniqueSlug(input.slug || input.name);
  return prisma.trek.create({
    data: {
      slug,
      cat: input.cat,
      name: input.name,
      blurb: input.blurb,
      description: input.description ?? null,
      price: input.price,
      priceValue: input.priceValue ?? null,
      priceNote: input.priceNote,
      duration: input.duration ?? null,
      difficulty: input.difficulty ?? null,
      image: input.image ?? null,
      gallery: input.gallery ?? [],
      highlights: input.highlights ?? [],
      included: input.included ?? [],
      itinerary: (input.itinerary ?? []) as object,
      featured: input.featured ?? false,
      published: input.published ?? true,
      order: input.order ?? 0,
    },
  });
}

export async function updateTrek(id: string, input: TrekInput) {
  const slug = input.slug ? await uniqueSlug(input.slug, id) : undefined;
  return prisma.trek.update({
    where: { id },
    data: {
      ...(slug ? { slug } : {}),
      cat: input.cat,
      name: input.name,
      blurb: input.blurb,
      description: input.description ?? null,
      price: input.price,
      priceValue: input.priceValue ?? null,
      priceNote: input.priceNote,
      duration: input.duration ?? null,
      difficulty: input.difficulty ?? null,
      image: input.image ?? null,
      gallery: input.gallery ?? [],
      highlights: input.highlights ?? [],
      included: input.included ?? [],
      itinerary: (input.itinerary ?? []) as object,
      featured: input.featured ?? false,
      published: input.published ?? true,
      order: input.order ?? 0,
    },
  });
}

export async function deleteTrek(id: string) {
  return prisma.trek.delete({ where: { id } });
}

/* ---------------- request parsing ---------------- */

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    // Allow newline- or comma-separated text from form textareas.
    return value
      .split(/[\n,]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Validate & normalise an incoming JSON body into a TrekInput.
 * Returns either the parsed input or a human-readable error string.
 */
export function parseTrekInput(
  body: unknown
): { ok: true; data: TrekInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid body" };
  }
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const cat = typeof b.cat === "string" ? b.cat.trim() : "";
  const blurb = typeof b.blurb === "string" ? b.blurb.trim() : "";
  const price = typeof b.price === "string" ? b.price.trim() : "";

  if (!name) return { ok: false, error: "Name is required" };
  if (!["summit", "multi", "running", "signature"].includes(cat))
    return { ok: false, error: "Invalid category" };
  if (!blurb) return { ok: false, error: "Blurb is required" };
  if (!price) return { ok: false, error: "Price is required" };

  const priceValueRaw = b.priceValue;
  let priceValue: number | null = null;
  if (priceValueRaw !== null && priceValueRaw !== undefined && priceValueRaw !== "") {
    const n = Number(priceValueRaw);
    priceValue = Number.isFinite(n) ? Math.round(n) : null;
  }

  let itinerary: ItineraryDay[] = [];
  if (Array.isArray(b.itinerary)) {
    itinerary = (b.itinerary as unknown[])
      .map((d) => {
        const o = (d ?? {}) as Record<string, unknown>;
        return {
          day: String(o.day ?? "").trim(),
          title: String(o.title ?? "").trim(),
          detail: String(o.detail ?? "").trim(),
        };
      })
      .filter((d) => d.title || d.detail);
  }

  return {
    ok: true,
    data: {
      slug: typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : name,
      cat,
      name,
      blurb,
      description:
        typeof b.description === "string" && b.description.trim()
          ? b.description.trim()
          : null,
      price,
      priceValue,
      priceNote:
        typeof b.priceNote === "string" && b.priceNote.trim()
          ? b.priceNote.trim()
          : "PER PERSON · GUIDED",
      duration:
        typeof b.duration === "string" && b.duration.trim() ? b.duration.trim() : null,
      difficulty:
        typeof b.difficulty === "string" && b.difficulty.trim()
          ? b.difficulty.trim()
          : null,
      image: typeof b.image === "string" && b.image.trim() ? b.image.trim() : null,
      gallery: toStringArray(b.gallery),
      highlights: toStringArray(b.highlights),
      included: toStringArray(b.included),
      itinerary,
      featured: Boolean(b.featured),
      published: b.published === undefined ? true : Boolean(b.published),
      order: Number.isFinite(Number(b.order)) ? Number(b.order) : 0,
    },
  };
}
