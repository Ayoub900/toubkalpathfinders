import { SITE, TOUBKAL, SAME_AS, TREKS, FAQS, REVIEWS } from "@/lib/site-data";

/**
 * Rich structured data for SEO & GEO (generative-engine optimisation).
 * Emitted once in <head> as a single JSON-LD graph so search engines,
 * knowledge panels and AI answer engines can resolve the business as a
 * coherent entity: the locally-owned travel agency (with geo, contact and
 * social signals), the mountain it operates on, its catalogue of treks,
 * the FAQ, and customer reviews/rating.
 */
export default function JsonLd() {
  // Mount Toubkal as a first-class geographic entity. Giving AI engines a
  // citable place (name, elevation, coordinates) anchors every answer about
  // "where/what is Toubkal" to this site's structured data.
  const mountain = {
    "@type": "Mountain",
    "@id": `${SITE.url}/#toubkal`,
    name: TOUBKAL.name,
    alternateName: TOUBKAL.alternateName,
    description: TOUBKAL.description,
    elevation: { "@type": "QuantitativeValue", value: TOUBKAL.elevation, unitCode: "MTR" },
    geo: {
      "@type": "GeoCoordinates",
      latitude: TOUBKAL.geo.lat,
      longitude: TOUBKAL.geo.lng,
    },
    containedInPlace: {
      "@type": "Place",
      name: "Toubkal National Park, High Atlas, Morocco",
    },
  };

  const org = {
    "@type": "TravelAgency",
    "@id": `${SITE.url}/#org`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
    logo: `${SITE.url}/logo.png`,
    image: `${SITE.url}/logo.png`,
    email: SITE.email,
    telephone: SITE.telephone,
    foundingDate: SITE.foundingDate,
    priceRange: SITE.priceRange,
    currenciesAccepted: SITE.currenciesAccepted,
    availableLanguage: SITE.languages,
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: { "@id": `${SITE.url}/#toubkal` },
    knowsAbout: [
      "Mount Toubkal",
      "High Atlas trekking",
      "Trail running Morocco",
      "Berber culture",
      "Sustainable tourism",
      "High-altitude acclimatisation",
    ],
    // A machine-readable catalogue of what the agency offers — strong signal
    // for both rich results and AI summaries of "what can I book here".
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Toubkal Treks & Adventures",
      itemListElement: TREKS.map((trek) => ({
        "@type": "Offer",
        name: trek.name,
        category: trek.cat,
        ...(trek.priceValue !== null
          ? { price: trek.priceValue, priceCurrency: "EUR" }
          : {}),
        availability: "https://schema.org/InStock",
        url: `${SITE.url}/treks`,
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.ratingValue,
      reviewCount: SITE.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en",
    publisher: { "@id": `${SITE.url}/#org` },
  };

  const trekList = {
    "@type": "ItemList",
    name: "Toubkal Treks & Adventures",
    itemListElement: TREKS.map((trek, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "TouristTrip",
        name: trek.name,
        description: trek.blurb,
        touristType: "Hikers, trekkers and trail runners",
        provider: { "@id": `${SITE.url}/#org` },
        itinerary: { "@id": `${SITE.url}/#toubkal` },
        ...(trek.priceValue !== null
          ? {
              offers: {
                "@type": "Offer",
                price: trek.priceValue,
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: `${SITE.url}/#adventures`,
              },
            }
          : {}),
      },
    })),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE.url}/#faq`,
    // speakable marks the Q&A as safe to read aloud — a hint for voice
    // assistants and AI answer engines surfacing concise responses.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".faq-q", ".faq-a"],
    },
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const reviews = REVIEWS.map((r) => ({
    "@type": "Review",
    itemReviewed: { "@id": `${SITE.url}/#org` },
    reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
    author: { "@type": "Person", name: r.name },
    reviewBody: r.quote,
  }));

  const graph = {
    "@context": "https://schema.org",
    "@graph": [org, mountain, website, trekList, faqPage, ...reviews],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
