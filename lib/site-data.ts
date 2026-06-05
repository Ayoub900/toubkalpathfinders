/* ============================================================
   TOUBKAL PATHFINDERS — content model
   Single source of truth for treks, FAQs and reviews so the
   rendered UI and the JSON-LD structured data never diverge.
   ============================================================ */

export const SITE = {
  name: "Toubkal Pathfinders",
  tagline: "High Atlas Mountain Specialists",
  description:
    "Locally owned Mount Toubkal trekking specialists in the High Atlas of Morocco. Born-and-raised Berber guides, summit treks, multi-day expeditions and trail running — organised direct, no middlemen.",
  url: "https://www.toubkalpathfinders.com",
  locale: "en_US",
  region: "High Atlas, Morocco",
  email: "hello@toubkalpathfinders.com",
  /** E.164 contact number — replace with the real business line. */
  telephone: "+212600000000",
  ratingValue: 4.9,
  reviewCount: 327,
  foundingDate: "2014",
  founder: "Toubkal Pathfinders",
  priceRange: "€€",
  currenciesAccepted: "EUR, MAD, USD, GBP",
  languages: ["English", "French", "Arabic", "Berber (Tamazight)"],
  /**
   * Trek base village in the Toubkal foothills. Coordinates are the real
   * location of Imlil, the gateway to Mount Toubkal National Park — used
   * for LocalBusiness geo signals and to anchor the brand for AI engines.
   */
  address: {
    locality: "Imlil",
    region: "Marrakesh-Safi",
    country: "MA",
    postalCode: "42152",
  },
  geo: { lat: 31.1357, lng: -7.9192 },
  /** Public profiles for sameAs entity reconciliation. Fill in real URLs;
   *  empty values are filtered out before they reach structured data. */
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    tripadvisor: "",
    linkedin: "",
  } as Record<string, string>,
} as const;

/**
 * Mount Toubkal itself — a real, citable geographic entity. Exposed so the
 * structured-data graph can describe the mountain (elevation, location) the
 * way AI answer engines and map/knowledge panels expect.
 */
export const TOUBKAL = {
  name: "Mount Toubkal",
  alternateName: "Jbel Toubkal",
  /** Summit elevation in metres — North Africa's highest peak. */
  elevation: 4167,
  geo: { lat: 31.0606, lng: -7.9145 },
  description:
    "Mount Toubkal (4,167 m) is the highest peak in North Africa and the Arab world, rising above the Toubkal National Park in the High Atlas of Morocco.",
} as const;

/** Resolved list of public profile URLs (empties removed) for sameAs. */
export const SAME_AS: string[] = Object.values(SITE.social).filter(Boolean);

export type TrekCategory = "summit" | "multi" | "running" | "signature";

export interface Trek {
  id: string;
  cat: TrekCategory;
  name: string;
  blurb: string;
  /** Display price string, e.g. "€185" or "Custom" */
  price: string;
  /** Numeric price for structured data; null when bespoke */
  priceValue: number | null;
  priceNote: string;
  /** Placeholder tone for the textured media block */
  tone?: "" | "lime-ph" | "orange-ph" | "dark-ph";
  phTag: string;
  badges: { label: string; tone?: "orange" }[];
  metaChips: { label: string; tone?: "lime" | "orange" | "ink" }[];
  cta: string;
  /** Marks the wide signature card */
  feat?: boolean;
  /** reveal stagger delay class */
  delay?: "" | "d1" | "d2";
}

export const TREKS: Trek[] = [
  {
    id: "2-day-summit",
    cat: "summit",
    name: "2-Day Toubkal Summit Trek",
    blurb:
      "The classic ascent of North Africa's highest peak — for hikers after a challenging, rewarding mountain experience.",
    price: "€185",
    priceValue: 185,
    priceNote: "PER PERSON · GUIDED",
    tone: "lime-ph",
    phTag: "classic summit push",
    badges: [{ label: "2 DAYS" }, { label: "CHALLENGING", tone: "orange" }],
    metaChips: [{ label: "SUMMIT", tone: "lime" }],
    cta: "View trek",
    delay: "",
  },
  {
    id: "3-day-summit",
    cat: "summit",
    name: "3-Day Toubkal Summit Trek",
    blurb:
      "A more comfortable itinerary with extra time for acclimatisation and mountain exploration.",
    price: "€245",
    priceValue: 245,
    priceNote: "PER PERSON · GUIDED",
    tone: "",
    phTag: "refuge to summit",
    badges: [{ label: "3 DAYS" }, { label: "MODERATE+" }],
    metaChips: [{ label: "SUMMIT", tone: "lime" }],
    cta: "View trek",
    delay: "d1",
  },
  {
    id: "4-day-round",
    cat: "multi",
    name: "4-Day Toubkal Round Trek",
    blurb:
      "A full circuit around the Toubkal Massif — remote valleys, mountain passes and traditional Berber villages.",
    price: "€330",
    priceValue: 330,
    priceNote: "PER PERSON · GUIDED",
    tone: "orange-ph",
    phTag: "massif circuit",
    badges: [{ label: "4 DAYS" }, { label: "CIRCUIT" }],
    metaChips: [{ label: "MULTI-DAY", tone: "orange" }],
    cta: "View trek",
    delay: "d2",
  },
  {
    id: "5-day-berber",
    cat: "multi",
    name: "5-Day Toubkal & Berber Villages Trek",
    blurb:
      "The summit ascent combined with deeper cultural immersion through the villages around Toubkal National Park.",
    price: "€420",
    priceValue: 420,
    priceNote: "PER PERSON · GUIDED",
    tone: "",
    phTag: "Berber village life",
    badges: [{ label: "5 DAYS" }, { label: "CULTURE", tone: "orange" }],
    metaChips: [{ label: "MULTI-DAY", tone: "orange" }],
    cta: "View trek",
    delay: "",
  },
  {
    id: "6-day-camping",
    cat: "multi",
    name: "6-Day Toubkal Trek & Wild Camping",
    blurb:
      "A true mountain adventure — the summit ascent plus multiple days trekking and camping in remote locations beneath the stars.",
    price: "€510",
    priceValue: 510,
    priceNote: "PER PERSON · GUIDED",
    tone: "lime-ph",
    phTag: "wild camp under the stars",
    badges: [{ label: "6 DAYS" }, { label: "WILD CAMPING", tone: "orange" }],
    metaChips: [{ label: "MULTI-DAY", tone: "orange" }],
    cta: "View trek",
    delay: "d1",
  },
  {
    id: "trail-running",
    cat: "running",
    name: "Trail Running Adventures",
    blurb:
      "High-altitude trail-running experiences for runners chasing technical terrain, mountain challenges and spectacular scenery.",
    price: "Custom",
    priceValue: null,
    priceNote: "BY ITINERARY · GUIDED",
    tone: "dark-ph",
    phTag: "high-altitude trail run",
    badges: [{ label: "RUNNING" }, { label: "TECHNICAL", tone: "orange" }],
    metaChips: [{ label: "TRAIL RUNNING", tone: "ink" }],
    cta: "Enquire",
    delay: "d2",
  },
  {
    id: "15-day-traverse",
    cat: "signature",
    name: "15-Day Grand Toubkal Traverse",
    blurb:
      "Our signature expedition. A complete crossing of the Toubkal Massif from east to west — through remote valleys, isolated Berber communities, high passes and hidden trails. One of the most comprehensive trekking journeys in the High Atlas.",
    price: "€1,450",
    priceValue: 1450,
    priceNote: "PER PERSON · FULLY SUPPORTED",
    tone: "dark-ph",
    phTag: "Grand Traverse · east-to-west crossing",
    badges: [],
    metaChips: [
      { label: "15 DAYS", tone: "lime" },
      { label: "EXPEDITION", tone: "orange" },
      { label: "EAST → WEST" },
    ],
    cta: "Plan the traverse",
    feat: true,
    delay: "",
  },
];

export const FILTERS: { label: string; filter: TrekCategory | "all" }[] = [
  { label: "All ◇", filter: "all" },
  { label: "Summit", filter: "summit" },
  { label: "Multi-Day", filter: "multi" },
  { label: "Trail Running", filter: "running" },
  { label: "Signature", filter: "signature" },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "How difficult is Mount Toubkal?",
    a: "Toubkal is a non-technical trek — no climbing skills are needed in the main season. It is, however, a genuine high-altitude effort with long ascents. Reasonable fitness goes a long way, and our pacing is built around acclimatisation.",
  },
  {
    q: "What is the best season?",
    a: "Spring (April–June) and autumn (September–November) offer the most comfortable conditions. Summer is hot but clear; winter ascents are spectacular and require crampons, ice axe and winter experience — all of which we can arrange.",
  },
  {
    q: "Do I need previous trekking experience?",
    a: "No previous high-altitude experience is required for our summit treks. We welcome motivated first-timers — the longer itineraries simply build in more time to acclimatise and enjoy the mountains.",
  },
  {
    q: "What equipment is required?",
    a: "Sturdy boots, layered clothing, a warm jacket, sun protection and a daypack cover the basics. We send a full personalised packing list once your trek is booked.",
  },
  {
    q: "Can equipment be rented?",
    a: "Yes. Boots, poles, sleeping bags and winter gear (crampons, ice axe) can all be rented locally and arranged by our team in advance.",
  },
  {
    q: "How does altitude affect hikers?",
    a: "Above 3,000m some people feel mild effects. Our itineraries are paced to acclimatise gradually, our guides are trained to monitor everyone, and the longer treks reduce altitude risk further.",
  },
  {
    q: "Private versus group treks?",
    a: "Both. Join a small scheduled group, or book a fully private departure on your own dates with your own guide — same local quality, your own pace.",
  },
  {
    q: "What is included in the price?",
    a: "Certified guiding, refuge/accommodation, mule support, all mountain meals, transport logistics and full safety support. We're transparent on what's in and what's not — no surprises.",
  },
  {
    q: "What should I pack?",
    a: "A personalised packing list comes with every booking, tuned to your trek and season — so you carry exactly what you need and nothing you don't.",
  },
];

export interface Review {
  initial: string;
  quote: string;
  name: string;
  meta: string;
  big?: boolean;
  delay?: "" | "d1" | "d2";
}

export const REVIEWS: Review[] = [
  {
    initial: "S",
    quote:
      "Reaching the summit at sunrise with a team that genuinely belongs to these mountains — it's a completely different experience. Unforgettable.",
    name: "Sophie L.",
    meta: "2-DAY SUMMIT · FRANCE",
    big: true,
    delay: "",
  },
  {
    initial: "M",
    quote:
      "The food alone was worth it. Fresh tagine in a refuge at 3,200m? Yes please. Guides were endlessly patient.",
    name: "Marcus T.",
    meta: "5-DAY BERBER VILLAGES · UK",
    delay: "d1",
  },
  {
    initial: "A",
    quote:
      "Did the Grand Traverse and it changed how I see trekking. Remote, raw, perfectly organised. Worth every day.",
    name: "Anja K.",
    meta: "15-DAY TRAVERSE · GERMANY",
    delay: "d2",
  },
  {
    initial: "D",
    quote:
      "As a trail runner I was blown away by the terrain. Technical, wild and the local knowledge was next level.",
    name: "Diego R.",
    meta: "TRAIL RUNNING · SPAIN",
    delay: "",
  },
  {
    initial: "P",
    quote:
      "First time at altitude and I felt safe the whole way. They read the mountain like a book.",
    name: "Priya S.",
    meta: "3-DAY SUMMIT · INDIA",
    delay: "d1",
  },
  {
    initial: "J",
    quote:
      "Sleeping under the stars on the camping trek, sharing mint tea with the crew. This is how travel should feel.",
    name: "Jonas E.",
    meta: "6-DAY CAMPING · SWEDEN",
    delay: "d2",
  },
];
