import { SITE } from "@/lib/site-data";
import { htmlToText, type Post } from "@/lib/posts";

/**
 * Per-article structured data (schema.org/BlogPosting) plus a breadcrumb
 * trail, emitted inline on each post page for rich search results.
 */
export default function BlogJsonLd({ post }: { post: Post }) {
  const url = `${SITE.url}/blog/${post.slug}`;
  const image = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE.url}${post.coverImage}`
    : `${SITE.url}/logo.webp`;

  const blogPosting = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    articleBody: htmlToText(post.content),
    image,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    wordCount: htmlToText(post.content).split(/\s+/).filter(Boolean).length,
    keywords: post.tags.join(", "),
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: post.author, url: SITE.url },
    publisher: { "@id": `${SITE.url}/#org` },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [blogPosting, breadcrumb],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
