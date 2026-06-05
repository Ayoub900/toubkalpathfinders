import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-data";

/**
 * Crawler policy. We keep private surfaces (admin dashboard, API, uploads
 * listing) out of the index, while explicitly welcoming both classic search
 * crawlers and AI answer-engine crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended, etc.) — the GEO stance is that AI engines *should* read
 * and cite us. The /llms.txt briefing is the canonical entry point for them.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/dashboard", "/dashboard/", "/api/", "/uploads/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Generative-engine crawlers — same access as everyone else, named
      // explicitly so the intent is unambiguous and future-proof.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Bingbot",
          "Amazonbot",
          "CCBot",
        ],
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
