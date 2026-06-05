import type { PostInput } from "./posts";

/**
 * Sample journal posts so the blog isn't empty on first run.
 * Imported by /api/posts/seed. Content is plain semantic HTML — the same shape
 * the rich-text editor produces.
 */
export const SEED_POSTS: PostInput[] = [
  {
    slug: "best-season-to-climb-mount-toubkal",
    title: "The Best Season to Climb Mount Toubkal",
    category: "guides",
    tags: ["seasons", "planning", "summit"],
    author: "Brahim — Lead Guide",
    featured: true,
    order: 1,
    excerpt:
      "Spring snowmelt, summer heat, autumn clarity or a full winter ascent — here's how each season reshapes a Toubkal trek, and which one fits the trip you have in mind.",
    coverAlt: "Sunrise light on the Toubkal summit ridge",
    content: `
      <p>Mount Toubkal is climbable all year — but the mountain you meet changes completely with the season. Picking the right window is the single biggest decision in planning your trek, so let's walk through each one.</p>
      <h2>Spring (April – June)</h2>
      <p>Our favourite season. The lower valleys turn green, walnut trees come into leaf, and the high snowline retreats week by week. Early spring still demands crampons near the summit; by June the standard route is usually clear.</p>
      <ul>
        <li>Comfortable daytime temperatures on the approach</li>
        <li>Dramatic snow on the upper slopes into May</li>
        <li>Wildflowers through the Berber villages</li>
      </ul>
      <h2>Summer (July – August)</h2>
      <p>The most reliable window for a snow-free summit, but the valleys get hot. We start early, rest through midday, and carry extra water. Clear skies make for endless ridge-line views.</p>
      <h2>Autumn (September – November)</h2>
      <blockquote>If you want the crispest air and the best photography light of the year, come in October.</blockquote>
      <p>Stable weather, thinning crowds and that hard, clean mountain light. A superb time for the longer circuits and the Grand Traverse.</p>
      <h2>Winter (December – March)</h2>
      <p>A serious, beautiful undertaking. Crampons, ice axe and winter experience are essential — all of which we arrange and guide. The reward is a silent, white High Atlas almost to yourself.</p>
      <p>Whichever season calls to you, talk to us first: we'll match the route and the dates to your fitness and your appetite for snow.</p>
    `,
  },
  {
    slug: "what-to-pack-for-a-toubkal-trek",
    title: "What to Pack for a Toubkal Trek: A Guide's Checklist",
    category: "training",
    tags: ["gear", "packing", "preparation"],
    author: "Fatima — Operations",
    order: 2,
    excerpt:
      "The exact kit our guides want to see in your bag — and the heavy mistakes first-timers make. A field-tested packing list for two days to two weeks on the mountain.",
    coverAlt: "Trekking boots and a packed daypack on a refuge terrace",
    content: `
      <p>Good kit makes a hard day feel easy and a cold night feel safe. After thousands of guided days on Toubkal, here is the list we actually hand our trekkers.</p>
      <h2>On your feet</h2>
      <p>Sturdy, broken-in B1 boots are non-negotiable. New boots are the number-one cause of blisters we see. Pack two pairs of proper trekking socks.</p>
      <h2>Layers, not bulk</h2>
      <ul>
        <li>Base layer (merino or synthetic — never cotton)</li>
        <li>Insulating mid-layer fleece</li>
        <li>Warm down or synthetic jacket for the summit dawn</li>
        <li>Waterproof shell, top and bottoms</li>
      </ul>
      <h2>The summit-day extras</h2>
      <p>Headtorch, warm hat, gloves, sun protection and a one-litre water bottle minimum. The pre-dawn push is the coldest hour of the trip — dress for it.</p>
      <blockquote>Mule support carries the heavy kit between camps, so you only ever walk with a light daypack. Pack accordingly.</blockquote>
      <p>We send a personalised, season-tuned packing list with every booking — this is the foundation it builds on.</p>
    `,
  },
  {
    slug: "leave-no-trace-in-the-high-atlas",
    title: "Leave No Trace in the High Atlas",
    category: "conservation",
    tags: ["sustainability", "berber", "responsible-travel"],
    author: "Toubkal Pathfinders",
    order: 3,
    excerpt:
      "Tourism can lift mountain communities or erode them. Here's how we keep our footprint light — and how every trekker who joins us helps protect Toubkal National Park.",
    coverAlt: "A Berber village beneath the snow-capped Atlas peaks",
    content: `
      <p>Toubkal National Park is a living landscape — home to Berber villages that have farmed these valleys for centuries. Protecting it is not an add-on to what we do; it is the whole point of doing it locally.</p>
      <h2>Local first, always</h2>
      <p>Every guide, cook and muleteer on our trips is born and raised in these mountains. Money from your trek stays in the valley, supporting families directly rather than distant operators.</p>
      <h2>Carry it in, carry it out</h2>
      <ul>
        <li>All waste returns with us — nothing is left or burned on the trail</li>
        <li>We cook on gas, never on scarce mountain wood</li>
        <li>Group sizes stay small to limit trail erosion</li>
      </ul>
      <h2>Water and the villages</h2>
      <p>We use refill points responsibly and respect the irrigation channels that villages depend on. Small choices, repeated across thousands of trekkers, decide whether this place thrives.</p>
      <p>Travel with us and you are part of that decision — for the better.</p>
    `,
  },
];
