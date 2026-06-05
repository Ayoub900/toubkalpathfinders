"use client";

import { useMemo, useState } from "react";
import { POST_CATEGORIES, type Post } from "@/lib/posts";
import PostCard from "@/components/blog/PostCard";

const FILTERS = [
  { label: "All ◇", value: "all" as const },
  ...POST_CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
];

/**
 * Client-side category filter + text search over the already-loaded posts.
 * The full list is server-rendered for SEO; this only narrows what's shown.
 */
export default function BlogIndex({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (active !== "all" && p.category !== active) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, active, query]);

  // The featured post only headlines the unfiltered, unsearched view.
  const showFeature = active === "all" && !query.trim();
  const feature = showFeature ? filtered.find((p) => p.featured) ?? null : null;
  const rest = feature ? filtered.filter((p) => p.id !== feature.id) : filtered;

  return (
    <>
      <div className="blog-controls reveal d1">
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-btn${active === f.value ? " active" : ""}`}
              onClick={() => setActive(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="blog-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search the journal…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the journal"
          />
        </label>
      </div>

      {feature && (
        <div className="blog-feature" style={{ marginTop: 32 }}>
          <PostCard post={feature} feature priority />
        </div>
      )}

      {rest.length > 0 ? (
        <div className="post-grid" style={{ marginTop: feature ? 22 : 32 }}>
          {rest.map((post, i) => (
            <PostCard key={post.id} post={post} priority={!feature && i < 3} />
          ))}
        </div>
      ) : (
        !feature && (
          <p className="blog-empty">
            Nothing here yet — try another category or{" "}
            <button className="blog-empty-reset" onClick={() => { setActive("all"); setQuery(""); }}>
              clear filters
            </button>
            .
          </p>
        )
      )}
    </>
  );
}
