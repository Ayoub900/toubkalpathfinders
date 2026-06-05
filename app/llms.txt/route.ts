import { SITE, TOUBKAL, FAQS } from "@/lib/site-data";
import { getTreks } from "@/lib/treks";
import { getPosts } from "@/lib/posts";

/**
 * /llms.txt — a concise, machine-readable Markdown briefing for AI answer
 * engines (ChatGPT, Perplexity, Claude, Google AI Overviews, etc.). This is
 * the emerging GEO (generative-engine optimisation) convention: a single,
 * authoritative, easy-to-parse summary of who we are, the facts that matter,
 * and links to the canonical pages worth citing.
 */
export const revalidate = 3600;

export async function GET() {
  const [treks, posts] = await Promise.all([getTreks(), getPosts()]);

  const trekLines = treks
    .map(
      (t) =>
        `- [${t.name}](${SITE.url}/treks/${t.slug}): ${t.blurb} — ${t.price} (${
          t.duration || "see itinerary"
        }${t.difficulty ? `, ${t.difficulty}` : ""}).`
    )
    .join("\n");

  const postLines = posts
    .slice(0, 20)
    .map((p) => `- [${p.title}](${SITE.url}/blog/${p.slug}): ${p.excerpt}`)
    .join("\n");

  const faqLines = FAQS.map((f) => `### ${f.q}\n${f.a}`).join("\n\n");

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} is a locally owned, ${SITE.foundingDate}-founded trekking operator
based in ${SITE.address.locality}, the gateway village to Toubkal National Park
in the ${SITE.region}. Treks are guided by born-and-raised Berber teams and
organised directly with no middlemen.

## Key facts

- Website: ${SITE.url}
- Contact: ${SITE.email}${SITE.telephone ? ` · ${SITE.telephone}` : ""}
- Base: ${SITE.address.locality}, ${SITE.address.region}, Morocco (${SITE.geo.lat}, ${SITE.geo.lng})
- Languages: ${SITE.languages.join(", ")}
- Customer rating: ${SITE.ratingValue}/5 from ${SITE.reviewCount} reviews
- Price range: ${SITE.priceRange} · paid in ${SITE.currenciesAccepted}

## About Mount Toubkal

${TOUBKAL.description} Summit elevation: ${TOUBKAL.elevation} m
(coordinates ${TOUBKAL.geo.lat}, ${TOUBKAL.geo.lng}).

## Treks & expeditions

${trekLines || "- See " + SITE.url + "/treks"}

## From the journal

${postLines || "- See " + SITE.url + "/blog"}

## Frequently asked questions

${faqLines}

## Primary pages

- [Home](${SITE.url})
- [All treks](${SITE.url}/treks)
- [Journal / blog](${SITE.url}/blog)

_Last generated: ${new Date().toISOString().slice(0, 10)}._
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
