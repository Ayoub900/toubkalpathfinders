"use client";

import { useState } from "react";
import { POST_CATEGORIES, slugify, type Post } from "@/lib/posts";
import ImageUploader from "@/components/dashboard/ImageUploader";
import RichTextEditor from "@/components/dashboard/RichTextEditor";

type FormState = {
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string;
  coverImage: string | null;
  coverAlt: string;
  metaTitle: string;
  metaDescription: string;
  featured: boolean;
  published: boolean;
  order: string;
};

function fromPost(p: Post | null): FormState {
  return {
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    category: p?.category ?? "guides",
    author: p?.author ?? "Toubkal Pathfinders",
    excerpt: p?.excerpt ?? "",
    content: p?.content ?? "",
    tags: (p?.tags ?? []).join(", "),
    coverImage: p?.coverImage ?? null,
    coverAlt: p?.coverAlt ?? "",
    metaTitle: p?.metaTitle ?? "",
    metaDescription: p?.metaDescription ?? "",
    featured: p?.featured ?? false,
    published: p?.published ?? true,
    order: p?.order != null ? String(p.order) : "0",
  };
}

export default function PostForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: Post | null;
  onSaved: (post: Post) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<FormState>(() => fromPost(initial));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setF((prev) => ({ ...prev, [key]: val }));

  const previewSlug = f.slug ? slugify(f.slug) : slugify(f.title) || "auto";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const payload = {
      title: f.title,
      slug: f.slug || undefined,
      category: f.category,
      author: f.author,
      excerpt: f.excerpt,
      content: f.content,
      tags: f.tags.split(",").map((s) => s.trim()).filter(Boolean),
      coverImage: f.coverImage,
      coverAlt: f.coverAlt,
      metaTitle: f.metaTitle,
      metaDescription: f.metaDescription,
      featured: f.featured,
      published: f.published,
      order: Number(f.order) || 0,
    };

    const url = initial ? `/api/posts/${initial.id}` : "/api/posts";
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
      onSaved(json.post);
    } catch {
      setMsg({ kind: "err", text: "Network error" });
      setSaving(false);
    }
  }

  return (
    <form className="dash-form" onSubmit={onSubmit}>
      <h2>Basics</h2>

      <div className="field full">
        <label htmlFor="pf-title">Title *</label>
        <input
          id="pf-title"
          value={f.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="pf-slug">Slug</label>
        <input
          id="pf-slug"
          value={f.slug}
          placeholder="auto from title"
          onChange={(e) => set("slug", e.target.value)}
        />
        <span className="dash-hint">URL: /blog/{previewSlug}</span>
      </div>
      <div className="field">
        <label htmlFor="pf-cat">Category *</label>
        <select id="pf-cat" value={f.category} onChange={(e) => set("category", e.target.value)}>
          {POST_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="pf-author">Author</label>
        <input
          id="pf-author"
          value={f.author}
          onChange={(e) => set("author", e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="pf-order">Sort order</label>
        <input
          id="pf-order"
          type="number"
          value={f.order}
          onChange={(e) => set("order", e.target.value)}
        />
        <span className="dash-hint">Lower numbers appear first.</span>
      </div>

      <div className="field full">
        <label htmlFor="pf-tags">Tags (comma separated)</label>
        <input
          id="pf-tags"
          value={f.tags}
          placeholder="seasons, planning, summit"
          onChange={(e) => set("tags", e.target.value)}
        />
      </div>

      <div className="field full">
        <label htmlFor="pf-excerpt">Excerpt</label>
        <textarea
          id="pf-excerpt"
          rows={2}
          value={f.excerpt}
          placeholder="Auto-generated from the content when left blank."
          onChange={(e) => set("excerpt", e.target.value)}
        />
        <span className="dash-hint">Used on cards and as the meta description fallback.</span>
      </div>

      <h2>Content</h2>
      <div className="field full">
        <label>Article body *</label>
        <RichTextEditor value={f.content} onChange={(html) => set("content", html)} />
      </div>

      <h2>Cover image</h2>
      <ImageUploader value={f.coverImage} onChange={(url) => set("coverImage", url)} label="Cover image" />
      <div className="field full">
        <label htmlFor="pf-alt">Cover alt text</label>
        <input
          id="pf-alt"
          value={f.coverAlt}
          placeholder="Describe the image for accessibility & SEO"
          onChange={(e) => set("coverAlt", e.target.value)}
        />
      </div>

      <h2>SEO</h2>
      <div className="field full">
        <label htmlFor="pf-mt">Meta title</label>
        <input
          id="pf-mt"
          value={f.metaTitle}
          placeholder="Defaults to the post title"
          onChange={(e) => set("metaTitle", e.target.value)}
        />
      </div>
      <div className="field full">
        <label htmlFor="pf-md">Meta description</label>
        <textarea
          id="pf-md"
          rows={2}
          value={f.metaDescription}
          placeholder="Defaults to the excerpt"
          onChange={(e) => set("metaDescription", e.target.value)}
        />
        <span className="dash-hint">Aim for 150–160 characters.</span>
      </div>

      <h2>Visibility</h2>
      <div className="field check-row">
        <input
          id="pf-featured"
          type="checkbox"
          checked={f.featured}
          onChange={(e) => set("featured", e.target.checked)}
        />
        <label htmlFor="pf-featured">Featured (headlines the journal)</label>
      </div>
      <div className="field check-row">
        <input
          id="pf-published"
          type="checkbox"
          checked={f.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        <label htmlFor="pf-published">Published (visible on the site)</label>
      </div>

      <div className="form-foot">
        {msg && <span className={`form-msg ${msg.kind}`}>{msg.text}</span>}
        <button type="button" className="icon-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-lime" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save changes" : "Create post"}
        </button>
      </div>
    </form>
  );
}
