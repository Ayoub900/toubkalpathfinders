import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-data";

/**
 * Web app manifest — improves installability and gives search engines a
 * canonical name/theme/icon set for the PWA-style listing.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#15170E",
    theme_color: "#15170E",
    categories: ["travel", "sports", "lifestyle"],
    lang: "en",
    icons: [
      { src: "/mark.png", sizes: "any", type: "image/png" },
      { src: "/mark.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
