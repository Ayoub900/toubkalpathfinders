import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  POST_CATEGORY_LABEL,
  formatPostDate,
  getPostBySlug,
  getPosts,
  getRelatedPosts,
  postTone,
} from "@/lib/posts";
import { CATEGORY_LABEL, getTreks } from "@/lib/treks";
import { SITE } from "@/lib/site-data";
import BlogJsonLd from "@/components/blog/BlogJsonLd";
import PostCard from "@/components/blog/PostCard";
import Reveal from "@/components/Reveal";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

// Pre-render every published post at build time for instant, cacheable loads.
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) return { title: "Post not found" };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const url = `/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE.url}${url}`,
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const related = await getRelatedPosts(post);

  // Sidebar cross-links: a few recent reads (any category) + featured treks.
  const [allPosts, allTreks] = await Promise.all([getPosts(), getTreks()]);
  const morePosts = allPosts.filter((p) => p.id !== post.id).slice(0, 4);
  const sideTreks = allTreks.slice(0, 3);

  const tone = post.coverImage ? "" : postTone(post);
  const heroPhClass = `ph${tone ? ` ${tone}` : ""}`;

  return (
    <main className="page">
      <BlogJsonLd post={post} />
      <article className="post-detail">
        {/* ---------- hero ---------- */}
        <section className="pd-hero">
          <div className="wrap">
            <Link href="/blog" className="td-back">
              ← The Journal
            </Link>
            <div className="pd-hero-head reveal">
              <div className="post-meta">
                <span className="chip lime">
                  {POST_CATEGORY_LABEL[post.category] || post.category}
                </span>
                <span className="post-dot">·</span>
                <time dateTime={new Date(post.publishedAt).toISOString()}>
                  {formatPostDate(post.publishedAt)}
                </time>
                <span className="post-dot">·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h1 className="h-1">{post.title}</h1>
              <p className="lead">{post.excerpt}</p>
              <div className="pd-byline">
                <span className="pd-avatar" aria-hidden="true">
                  {post.author.trim().charAt(0).toUpperCase()}
                </span>
                <div>
                  <div className="pd-author">{post.author}</div>
                  <div className="pd-author-role">High Atlas Mountain Specialists</div>
                </div>
              </div>
            </div>
          </div>

          {post.coverImage && (
            <div className="wrap">
              <div className="pd-cover reveal d1">
                <div className={heroPhClass}>
                  <Image
                    src={post.coverImage}
                    alt={post.coverAlt || post.title}
                    fill
                    className="imgreal"
                    sizes="(max-width:1100px) 100vw, 1040px"
                    priority
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ---------- body ---------- */}
        <section className="section pd-body">
          <div className="wrap pd-body-grid">
            <div
              className="prose reveal"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <aside className="pd-aside">
              <div className="pd-sticky">
                {post.tags.length > 0 && (
                  <div className="pd-tags">
                    <span className="kicker">TAGGED</span>
                    <div className="pd-tag-list">
                      {post.tags.map((t) => (
                        <span className="chip" key={t}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pd-cta">
                  <h3>Ready for the real thing?</h3>
                  <p>Turn the reading into a summit. Explore our guided Toubkal treks.</p>
                  <Link href="/treks" className="btn btn-lime" style={{ justifyContent: "center" }}>
                    Browse treks <span className="arrow">→</span>
                  </Link>
                </div>

                {morePosts.length > 0 && (
                  <div className="pd-side-block">
                    <span className="kicker">MORE READS</span>
                    <ul className="pd-links">
                      {morePosts.map((p) => (
                        <li key={p.id}>
                          <Link href={`/blog/${p.slug}`} className="pd-link">
                            <span className="pd-link-tag">
                              {POST_CATEGORY_LABEL[p.category] || p.category}
                            </span>
                            <span className="pd-link-title">{p.title}</span>
                            <span className="pd-link-meta">{p.readingMinutes} min read</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {sideTreks.length > 0 && (
                  <div className="pd-side-block">
                    <span className="kicker">GUIDED TREKS</span>
                    <ul className="pd-links">
                      {sideTreks.map((t) => (
                        <li key={t.id}>
                          <Link href={`/treks/${t.slug}`} className="pd-link">
                            <span className="pd-link-tag">{CATEGORY_LABEL[t.cat] || t.cat}</span>
                            <span className="pd-link-title">{t.name}</span>
                            <span className="pd-link-meta">
                              {t.duration ? `${t.duration} · ` : ""}
                              {t.price}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* ---------- related ---------- */}
        {related.length > 0 && (
          <section className="section pd-related" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="section-head" style={{ marginBottom: 28 }}>
                <span className="kicker reveal">KEEP READING</span>
                <h2 className="h-2 reveal d1" style={{ marginTop: 14 }}>
                  More from the journal
                </h2>
              </div>
              <div className="post-grid">
                {related.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Reveal />
    </main>
  );
}
