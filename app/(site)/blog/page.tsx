import type { Metadata } from "next";
import { SITE } from "@/lib/site-data";
import { getPosts } from "@/lib/posts";
import BlogIndex from "@/components/blog/BlogIndex";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Toubkal Journal — Trekking Guides & Trail Stories",
  description:
    "Field notes from the High Atlas: Mount Toubkal trekking guides, seasonal advice, training tips, conservation stories and news from our born-and-raised Berber team.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "The Toubkal Journal",
    description:
      "Trekking guides, trail stories, training tips and conservation notes from the High Atlas of Morocco.",
    url: `${SITE.url}/blog`,
  },
};

// Posts change rarely — serve a cached static render and revalidate hourly
// for fast, SEO-friendly delivery (incremental static regeneration).
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="page">
      <section className="page-head">
        <div className="wrap">
          <span className="kicker reveal">THE TOUBKAL JOURNAL</span>
          <h1 className="h-1 reveal d1" style={{ margin: "18px 0 18px" }}>
            Notes from the
            <br />
            High Atlas.
          </h1>
          <p className="lead reveal d2">
            Trekking guides, seasonal advice, training tips and stories from the trail —
            written by the born-and-raised Berber team who guide every step.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(24px,4vw,48px)" }}>
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="blog-empty">
              The journal is just getting started — check back soon for trail notes and guides.
            </p>
          ) : (
            <BlogIndex posts={posts} />
          )}
        </div>
      </section>

      <Reveal />
    </main>
  );
}
