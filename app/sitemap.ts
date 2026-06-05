import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-data";
import { getTreks } from "@/lib/treks";
import { getPosts } from "@/lib/posts";

// Revalidate the sitemap hourly so new treks/posts surface to crawlers.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treks, posts] = await Promise.all([getTreks(), getPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE.url}/treks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/blog`,
      lastModified: posts[0]?.updatedAt ?? new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const trekRoutes: MetadataRoute.Sitemap = treks.map((t) => ({
    url: `${SITE.url}/treks/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...trekRoutes, ...postRoutes];
}
