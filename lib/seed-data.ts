import type { TrekInput } from "./treks";

/**
 * Seed content — enriched versions of the original hardcoded treks, now with
 * the long-form fields (description, highlights, itinerary, included) needed by
 * the trek details pages. Imported by /api/seed.
 */
export const SEED_TREKS: TrekInput[] = [
  {
    slug: "2-day-summit",
    cat: "summit",
    name: "2-Day Toubkal Summit Trek",
    blurb:
      "The classic ascent of North Africa's highest peak — for hikers after a challenging, rewarding mountain experience.",
    description:
      "The most direct route to the roof of North Africa. Starting from the Berber village of Imlil, we trek up the Mizane valley to the Toubkal refuge, then make a pre-dawn summit push to 4,167m for sunrise over the High Atlas. A focused, hard-earned adventure for fit hikers with limited time.",
    price: "€185",
    priceValue: 185,
    priceNote: "PER PERSON · GUIDED",
    duration: "2 Days",
    difficulty: "Challenging",
    featured: false,
    order: 1,
    highlights: [
      "Summit Jbel Toubkal (4,167m) at sunrise",
      "Overnight in the high-mountain Toubkal refuge",
      "Certified born-and-raised Berber guide",
      "Mule support carries the heavy kit",
    ],
    included: [
      "Certified mountain guide",
      "Refuge half-board accommodation",
      "All mountain meals & mint tea",
      "Mule porter support",
      "Imlil transfer logistics",
      "Safety & first-aid cover",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Imlil → Toubkal Refuge (3,207m)",
        detail:
          "Meet your guide in Imlil, trek up the Mizane valley past Sidi Chamharouch, and arrive at the refuge for an early dinner and rest.",
      },
      {
        day: "Day 2",
        title: "Summit push & descent",
        detail:
          "Pre-dawn start for the summit of Toubkal at sunrise, then descend all the way back to Imlil by afternoon.",
      },
    ],
  },
  {
    slug: "3-day-summit",
    cat: "summit",
    name: "3-Day Toubkal Summit Trek",
    blurb:
      "A more comfortable itinerary with extra time for acclimatisation and mountain exploration.",
    description:
      "The same iconic summit, paced for comfort. The extra day lets your body adjust to the altitude and gives time to explore the cirque around the refuge — meaning a higher summit success rate and a far more enjoyable climb.",
    price: "€245",
    priceValue: 245,
    priceNote: "PER PERSON · GUIDED",
    duration: "3 Days",
    difficulty: "Moderate+",
    featured: false,
    order: 2,
    highlights: [
      "Extra acclimatisation day for a stronger summit",
      "Sunrise summit of Jbel Toubkal (4,167m)",
      "Explore the high cirque & neighbouring peaks",
      "Higher summit success rate",
    ],
    included: [
      "Certified mountain guide",
      "Two nights refuge accommodation",
      "All mountain meals",
      "Mule porter support",
      "Transfer logistics",
      "Safety & first-aid cover",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Imlil → Toubkal Refuge",
        detail: "Gentle trek up the valley to the refuge, settling in for the night.",
      },
      {
        day: "Day 2",
        title: "Acclimatisation walk",
        detail:
          "A short ascent towards a neighbouring col to aid acclimatisation, then rest at the refuge.",
      },
      {
        day: "Day 3",
        title: "Summit & descent to Imlil",
        detail: "Pre-dawn summit push, then the full descent back to Imlil.",
      },
    ],
  },
  {
    slug: "4-day-round",
    cat: "multi",
    name: "4-Day Toubkal Round Trek",
    blurb:
      "A full circuit around the Toubkal Massif — remote valleys, mountain passes and traditional Berber villages.",
    description:
      "A loop that trades the single summit for breadth: high passes, hidden valleys and a string of Berber villages rarely seen by day-trippers. The Toubkal summit can be added as an option for those with the legs for it.",
    price: "€330",
    priceValue: 330,
    priceNote: "PER PERSON · GUIDED",
    duration: "4 Days",
    difficulty: "Moderate",
    featured: false,
    order: 3,
    highlights: [
      "Full circuit of the Toubkal Massif",
      "Cross several high mountain passes",
      "Stay in remote Berber villages",
      "Optional Toubkal summit add-on",
    ],
    included: [
      "Certified mountain guide",
      "Gîte & refuge accommodation",
      "All mountain meals",
      "Mule porter support",
      "Transfer logistics",
      "Safety & first-aid cover",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Imlil → Tacheddirt",
        detail: "Cross the Tizi n'Tamatert pass into the quiet Imenane valley.",
      },
      {
        day: "Day 2",
        title: "Tacheddirt → Azib Likemt",
        detail: "A high pass leads to a remote shepherds' pasture for the night.",
      },
      {
        day: "Day 3",
        title: "Azib Likemt → Amsouzert",
        detail: "Descend through walnut groves to a green valley village.",
      },
      {
        day: "Day 4",
        title: "Lac d'Ifni & return",
        detail: "Visit the mountain lake before transferring back to Imlil/Marrakech.",
      },
    ],
  },
  {
    slug: "5-day-berber",
    cat: "multi",
    name: "5-Day Toubkal & Berber Villages Trek",
    blurb:
      "The summit ascent combined with deeper cultural immersion through the villages around Toubkal National Park.",
    description:
      "Summit and culture in one trip. Alongside the climb of Toubkal, you'll spend time in the villages of the national park — sharing meals, mint tea and stories with families who have farmed these valleys for generations.",
    price: "€420",
    priceValue: 420,
    priceNote: "PER PERSON · GUIDED",
    duration: "5 Days",
    difficulty: "Moderate+",
    featured: false,
    order: 4,
    highlights: [
      "Summit of Jbel Toubkal (4,167m)",
      "Home-stays in Berber villages",
      "Traditional meals with local families",
      "Toubkal National Park trails",
    ],
    included: [
      "Certified mountain guide",
      "Village gîtes & refuge nights",
      "All meals including village home-cooking",
      "Mule porter support",
      "Transfer logistics",
      "Safety & first-aid cover",
    ],
    itinerary: [
      { day: "Day 1", title: "Imlil & around", detail: "Arrival, village walk and briefing." },
      { day: "Day 2", title: "Imlil → Toubkal Refuge", detail: "Trek up the Mizane valley." },
      { day: "Day 3", title: "Summit day", detail: "Sunrise summit, descend to the refuge." },
      { day: "Day 4", title: "Refuge → village", detail: "Descend to a Berber village home-stay." },
      { day: "Day 5", title: "Villages & return", detail: "Explore the valley villages, return to Marrakech." },
    ],
  },
  {
    slug: "6-day-camping",
    cat: "multi",
    name: "6-Day Toubkal Trek & Wild Camping",
    blurb:
      "A true mountain adventure — the summit ascent plus multiple days trekking and camping in remote locations beneath the stars.",
    description:
      "For those who want the mountains all to themselves. We combine the Toubkal summit with multiple nights of wild camping in remote corners of the massif — far from refuges, falling asleep under some of the clearest night skies anywhere.",
    price: "€510",
    priceValue: 510,
    priceNote: "PER PERSON · GUIDED",
    duration: "6 Days",
    difficulty: "Challenging",
    featured: false,
    order: 5,
    highlights: [
      "Summit of Jbel Toubkal (4,167m)",
      "Multiple nights wild camping",
      "Remote, refuge-free valleys",
      "Incredible High Atlas night skies",
    ],
    included: [
      "Certified mountain guide & camp crew",
      "Full camping equipment & tents",
      "All meals cooked at camp",
      "Mule porter support",
      "Transfer logistics",
      "Safety & first-aid cover",
    ],
    itinerary: [
      { day: "Day 1", title: "Imlil → first camp", detail: "Trek into the massif to the first wild camp." },
      { day: "Day 2", title: "Toward the refuge", detail: "Cross a high pass; camp beneath the peaks." },
      { day: "Day 3", title: "Summit day", detail: "Sunrise summit of Toubkal." },
      { day: "Day 4", title: "Remote valley camp", detail: "Descend into a hidden valley for the night." },
      { day: "Day 5", title: "Lac d'Ifni", detail: "Camp by the mountain lake." },
      { day: "Day 6", title: "Return", detail: "Final descent and transfer back." },
    ],
  },
  {
    slug: "trail-running",
    cat: "running",
    name: "Trail Running Adventures",
    blurb:
      "High-altitude trail-running experiences for runners chasing technical terrain, mountain challenges and spectacular scenery.",
    description:
      "Bespoke high-altitude running on the High Atlas's best trails. Whether you're training for an ultra or chasing fast summits, we design routes around your goals with guides who run these mountains themselves.",
    price: "Custom",
    priceValue: null,
    priceNote: "BY ITINERARY · GUIDED",
    duration: "Flexible",
    difficulty: "Technical",
    featured: false,
    order: 6,
    highlights: [
      "Routes designed around your goals",
      "Technical high-altitude terrain",
      "Guides who run the mountains daily",
      "Fast-and-light support",
    ],
    included: [
      "Specialist running guide",
      "Custom route planning",
      "Support logistics",
      "Accommodation as required",
      "Safety & first-aid cover",
    ],
    itinerary: [
      {
        day: "Bespoke",
        title: "Built around you",
        detail:
          "Every trail-running itinerary is planned one-to-one — tell us your distance, vert and dates and we'll shape the trip.",
      },
    ],
  },
  {
    slug: "15-day-traverse",
    cat: "signature",
    name: "15-Day Grand Toubkal Traverse",
    blurb:
      "Our signature expedition. A complete crossing of the Toubkal Massif from east to west — through remote valleys, isolated Berber communities, high passes and hidden trails.",
    description:
      "Our flagship expedition and one of the most comprehensive trekking journeys in the High Atlas. A full east-to-west crossing of the Toubkal Massif over two weeks — summits, hidden valleys, isolated communities and high passes, fully supported from start to finish.",
    price: "€1,450",
    priceValue: 1450,
    priceNote: "PER PERSON · FULLY SUPPORTED",
    duration: "15 Days",
    difficulty: "Expedition",
    featured: true,
    order: 0,
    highlights: [
      "Complete east-to-west massif crossing",
      "Multiple summits including Toubkal",
      "Isolated Berber communities",
      "Fully supported expedition logistics",
    ],
    included: [
      "Expedition guide & full crew",
      "All accommodation & camps",
      "All meals throughout",
      "Mule & porter support",
      "All transfers",
      "Safety, comms & first-aid cover",
    ],
    itinerary: [
      {
        day: "Days 1–4",
        title: "Eastern approach",
        detail: "Begin the crossing through the eastern valleys and passes.",
      },
      {
        day: "Days 5–9",
        title: "Central massif & Toubkal",
        detail: "The high heart of the range, including the Toubkal summit.",
      },
      {
        day: "Days 10–15",
        title: "Western descent",
        detail: "Cross the western passes and descend out of the range.",
      },
    ],
  },
];
