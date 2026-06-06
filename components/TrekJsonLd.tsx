import { SITE } from "@/lib/site-data";
import { CATEGORY_LABEL, parseItinerary, type Trek } from "@/lib/treks";

/** Resolve a stored image path to an absolute URL for structured data. */
function absolute(src: string | null | undefined): string {
  if (!src) return `${SITE.url}/logo.webp`;
  return src.startsWith("http") ? src : `${SITE.url}${src}`;
}

/**
 * Per-trek structured data (schema.org/TouristTrip + Product offer + a
 * breadcrumb trail), emitted inline on each trek page. Gives search engines
 * rich-result eligibility (price, rating, breadcrumbs) and gives AI answer
 * engines a clean, citable description of each itinerary.
 */
export default function TrekJsonLd({ trek }: { trek: Trek }) {
  const url = `${SITE.url}/treks/${trek.slug}`;
  const days = parseItinerary(trek.itinerary);

  const trip = {
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name: trek.name,
    description: trek.description || trek.blurb,
    url,
    image: absolute(trek.image),
    touristType: "Hikers, trekkers and trail runners",
    provider: { "@id": `${SITE.url}/#org` },
    // Anchor every trip to the mountain entity defined on the homepage graph.
    subjectOf: { "@id": `${SITE.url}/#toubkal` },
    ...(trek.duration ? { duration: trek.duration } : {}),
    ...(days.length
      ? {
          itinerary: {
            "@type": "ItemList",
            numberOfItems: days.length,
            itemListElement: days.map((d, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "TouristTrip",
                name: d.title || d.day || `Day ${i + 1}`,
                ...(d.detail ? { description: d.detail } : {}),
              },
            })),
          },
        }
      : {}),
    ...(trek.priceValue !== null
      ? {
          offers: {
            "@type": "Offer",
            price: trek.priceValue,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {}),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Treks", item: `${SITE.url}/treks` },
      {
        "@type": "ListItem",
        position: 3,
        name: CATEGORY_LABEL[trek.cat] || trek.cat,
        item: `${SITE.url}/treks`,
      },
      { "@type": "ListItem", position: 4, name: trek.name, item: url },
    ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [trip, breadcrumb],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
