"use client";

import { useState } from "react";
import { CATEGORIES, type Trek, type ItineraryDay, parseItinerary } from "@/lib/treks";
import ImageUploader from "@/components/dashboard/ImageUploader";

type FormState = {
  name: string;
  slug: string;
  cat: string;
  price: string;
  priceValue: string;
  priceNote: string;
  duration: string;
  difficulty: string;
  blurb: string;
  description: string;
  highlights: string;
  included: string;
  image: string | null;
  gallery: string[];
  itinerary: ItineraryDay[];
  featured: boolean;
  published: boolean;
  order: string;
};

function fromTrek(t: Trek | null): FormState {
  return {
    name: t?.name ?? "",
    slug: t?.slug ?? "",
    cat: t?.cat ?? "summit",
    price: t?.price ?? "",
    priceValue: t?.priceValue != null ? String(t.priceValue) : "",
    priceNote: t?.priceNote ?? "PER PERSON · GUIDED",
    duration: t?.duration ?? "",
    difficulty: t?.difficulty ?? "",
    blurb: t?.blurb ?? "",
    description: t?.description ?? "",
    highlights: (t?.highlights ?? []).join("\n"),
    included: (t?.included ?? []).join("\n"),
    image: t?.image ?? null,
    gallery: t?.gallery ?? [],
    itinerary: t ? parseItinerary(t.itinerary) : [],
    featured: t?.featured ?? false,
    published: t?.published ?? true,
    order: t?.order != null ? String(t.order) : "0",
  };
}

export default function TrekForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: Trek | null;
  onSaved: (trek: Trek) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<FormState>(() => fromTrek(initial));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [galleryBusy, setGalleryBusy] = useState(false);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setF((prev) => ({ ...prev, [key]: val }));

  const updateItin = (i: number, key: keyof ItineraryDay, val: string) =>
    setF((prev) => {
      const next = [...prev.itinerary];
      next[i] = { ...next[i], [key]: val };
      return { ...prev, itinerary: next };
    });

  const addItin = () =>
    set("itinerary", [...f.itinerary, { day: "", title: "", detail: "" }]);

  const removeItin = (i: number) =>
    set("itinerary", f.itinerary.filter((_, idx) => idx !== i));

  async function addGalleryImage(file: File) {
    setGalleryBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) set("gallery", [...f.gallery, json.url]);
    } finally {
      setGalleryBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const payload = {
      name: f.name,
      slug: f.slug || undefined,
      cat: f.cat,
      price: f.price,
      priceValue: f.priceValue === "" ? null : Number(f.priceValue),
      priceNote: f.priceNote,
      duration: f.duration,
      difficulty: f.difficulty,
      blurb: f.blurb,
      description: f.description,
      highlights: f.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      included: f.included.split("\n").map((s) => s.trim()).filter(Boolean),
      image: f.image,
      gallery: f.gallery,
      itinerary: f.itinerary,
      featured: f.featured,
      published: f.published,
      order: Number(f.order) || 0,
    };

    const url = initial ? `/api/treks/${initial.id}` : "/api/treks";
    const method = initial ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: json?.error || "Save failed" });
        setSaving(false);
        return;
      }
      setMsg({ kind: "ok", text: "Saved" });
      onSaved(json.trek);
    } catch {
      setMsg({ kind: "err", text: "Network error" });
      setSaving(false);
    }
  }

  return (
    <form className="dash-form" onSubmit={onSubmit}>
      <h2>Basics</h2>

      <div className="field">
        <label htmlFor="tf-name">Name *</label>
        <input id="tf-name" value={f.name} onChange={(e) => set("name", e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="tf-slug">Slug</label>
        <input
          id="tf-slug"
          value={f.slug}
          placeholder="auto from name"
          onChange={(e) => set("slug", e.target.value)}
        />
        <span className="dash-hint">URL: /treks/{f.slug || "auto"}</span>
      </div>

      <div className="field">
        <label htmlFor="tf-cat">Category *</label>
        <select id="tf-cat" value={f.cat} onChange={(e) => set("cat", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="tf-order">Sort order</label>
        <input
          id="tf-order"
          type="number"
          value={f.order}
          onChange={(e) => set("order", e.target.value)}
        />
        <span className="dash-hint">Lower numbers appear first.</span>
      </div>

      <div className="field">
        <label htmlFor="tf-duration">Duration</label>
        <input
          id="tf-duration"
          value={f.duration}
          placeholder="e.g. 2 Days"
          onChange={(e) => set("duration", e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="tf-difficulty">Difficulty</label>
        <input
          id="tf-difficulty"
          value={f.difficulty}
          placeholder="e.g. Challenging"
          onChange={(e) => set("difficulty", e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="tf-price">Price label *</label>
        <input
          id="tf-price"
          value={f.price}
          placeholder="€185 or Custom"
          onChange={(e) => set("price", e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="tf-pv">Price value (number)</label>
        <input
          id="tf-pv"
          type="number"
          value={f.priceValue}
          placeholder="185"
          onChange={(e) => set("priceValue", e.target.value)}
        />
        <span className="dash-hint">Leave blank for bespoke pricing.</span>
      </div>
      <div className="field full">
        <label htmlFor="tf-pn">Price note</label>
        <input id="tf-pn" value={f.priceNote} onChange={(e) => set("priceNote", e.target.value)} />
      </div>

      <h2>Copy</h2>
      <div className="field full">
        <label htmlFor="tf-blurb">Short blurb (cards) *</label>
        <textarea
          id="tf-blurb"
          rows={2}
          value={f.blurb}
          onChange={(e) => set("blurb", e.target.value)}
          required
        />
      </div>
      <div className="field full">
        <label htmlFor="tf-desc">Full description (detail page)</label>
        <textarea
          id="tf-desc"
          rows={4}
          value={f.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="field full">
        <label htmlFor="tf-hl">Highlights (one per line)</label>
        <textarea
          id="tf-hl"
          rows={4}
          value={f.highlights}
          onChange={(e) => set("highlights", e.target.value)}
        />
      </div>
      <div className="field full">
        <label htmlFor="tf-inc">What&apos;s included (one per line)</label>
        <textarea
          id="tf-inc"
          rows={4}
          value={f.included}
          onChange={(e) => set("included", e.target.value)}
        />
      </div>

      <h2>Images</h2>
      <ImageUploader value={f.image} onChange={(url) => set("image", url)} />

      <div className="field full">
        <label>Gallery</label>
        <div className="td-gallery" style={{ marginTop: 4 }}>
          {f.gallery.map((src) => (
            <div key={src} style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={{ borderRadius: 12, aspectRatio: "4/3", objectFit: "cover", width: "100%" }} />
              <button
                type="button"
                className="icon-btn danger"
                style={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => set("gallery", f.gallery.filter((g) => g !== src))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <label
          className="icon-btn"
          style={{ marginTop: 12, display: "inline-block", cursor: "pointer" }}
        >
          {galleryBusy ? "Uploading…" : "+ Add gallery image"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addGalleryImage(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <h2>Itinerary</h2>
      <div className="field full itin-builder">
        {f.itinerary.map((d, i) => (
          <div className="itin-row" key={i}>
            <input
              placeholder="Day 1"
              value={d.day}
              onChange={(e) => updateItin(i, "day", e.target.value)}
            />
            <div className="col-detail">
              <input
                placeholder="Title"
                value={d.title}
                onChange={(e) => updateItin(i, "title", e.target.value)}
              />
              <textarea
                placeholder="Detail"
                rows={2}
                value={d.detail}
                onChange={(e) => updateItin(i, "detail", e.target.value)}
              />
            </div>
            <button type="button" className="icon-btn danger" onClick={() => removeItin(i)}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="icon-btn" onClick={addItin} style={{ alignSelf: "flex-start" }}>
          + Add day
        </button>
      </div>

      <h2>Visibility</h2>
      <div className="field check-row">
        <input
          id="tf-featured"
          type="checkbox"
          checked={f.featured}
          onChange={(e) => set("featured", e.target.checked)}
        />
        <label htmlFor="tf-featured">Featured (wide signature card)</label>
      </div>
      <div className="field check-row">
        <input
          id="tf-published"
          type="checkbox"
          checked={f.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        <label htmlFor="tf-published">Published (visible on the site)</label>
      </div>

      <div className="form-foot">
        {msg && <span className={`form-msg ${msg.kind}`}>{msg.text}</span>}
        <button type="button" className="icon-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-lime" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save changes" : "Create trek"}
        </button>
      </div>
    </form>
  );
}
