import Link from "next/link";
import Image from "next/image";
import {
  POST_CATEGORY_LABEL,
  formatPostDate,
  postTone,
  type Post,
} from "@/lib/posts";

/**
 * Blog card. `feature` renders the wide hero-style variant; `priority` opts the
 * cover image into eager loading for above-the-fold cards (LCP).
 */
export default function PostCard({
  post,
  feature = false,
  priority = false,
}: {
  post: Post;
  feature?: boolean;
  priority?: boolean;
}) {
  const tone = post.coverImage ? "" : postTone(post);
  const phClass = `ph${tone ? ` ${tone}` : ""}`;

  return (
    <article className={`post-card${feature ? " feat" : ""}`}>
      <Link href={`/blog/${post.slug}`} className="post-media" aria-hidden="true" tabIndex={-1}>
        <div className={phClass}>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              fill
              className="imgreal"
              sizes={feature ? "(max-width:900px) 100vw, 50vw" : "(max-width:680px) 100vw, (max-width:1080px) 50vw, 33vw"}
              priority={priority}
            />
          ) : (
            <span className="ph-tag">◆ {POST_CATEGORY_LABEL[post.category] || "Journal"}</span>
          )}
        </div>
        {post.featured && feature && <span className="sticker post-sticker">★ FEATURED</span>}
      </Link>
      <div className="post-body">
        <div className="post-meta">
          <span className="chip lime">{POST_CATEGORY_LABEL[post.category] || post.category}</span>
          <span className="post-dot">·</span>
          <time dateTime={new Date(post.publishedAt).toISOString()}>
            {formatPostDate(post.publishedAt)}
          </time>
          <span className="post-dot">·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <div className="post-foot">
          <span className="post-author">{post.author}</span>
          <Link href={`/blog/${post.slug}`} className="go">
            Read <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
