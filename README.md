# Toubkal Pathfinders

Marketing site for a Mount Toubkal trekking specialist in the High Atlas of
Morocco. Built from the Claude Design handoff (`Toubkal Pathfinders.html`) as a
**Next.js 16 App Router** app, with **performance and SEO** as the primary goals.

## Stack

- **Next.js 16 (App Router, Turbopack)** — every route is statically prerendered (SSG).
- **TypeScript**, React 19.
- **`next/font`** — Archivo / Hanken Grotesk / Space Mono are self-hosted at
  build time (no render-blocking Google Fonts request), with `display: swap`.
- Plain CSS design system in `app/globals.css` (ported 1:1 from the design).

## Performance & SEO notes

- **Static rendering**: the home page ships as static HTML — all copy, treks,
  reviews and FAQ answers are in the markup and crawlable without JS.
- **Minimal client JS**: interactivity is split into small client "islands"
  (nav/drawer, trek filter, FAQ accordion, stat counters, scroll reveal). The
  rest of the page is React Server Components.
- **Progressive enhancement**: animations are gated behind a `js` class set
  before first paint and disabled under `prefers-reduced-motion`. Content is
  fully visible if JS never runs.
- **Structured data**: a single JSON-LD graph (`TravelAgency`, `WebSite`,
  `ItemList` of treks with offers, `FAQPage`, customer `Review`s +
  `AggregateRating`) — see `components/JsonLd.tsx`.
- **Metadata API**: title template, description, keywords, canonical, Open
  Graph and Twitter cards in `app/layout.tsx`, plus `robots.ts` and `sitemap.ts`.
- Images served through `next/image`; the logo is `priority` in the nav.

Content lives in one place — `lib/site-data.ts` — so the rendered UI and the
structured data can never drift apart.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (statically prerenders /)
npm run start    # serve the production build
```

## Project structure

```
app/
  layout.tsx      # fonts, metadata, JSON-LD, js-class bootstrap
  page.tsx        # home page — static sections + client islands
  globals.css     # design system
  robots.ts / sitemap.ts
components/        # SiteNav, AdventuresSection, Faq, EcoStats, Reveal, JsonLd
lib/site-data.ts  # treks, FAQs, reviews, site constants
public/           # logo.png, mark.png (favicon)
```

> Imagery uses textured placeholder blocks with labels (e.g. "▲ summit ridge at
> dawn"), matching the design. Drop in real photos via `next/image` to finish.

> Before going live, set the real production URL in `lib/site-data.ts` (`SITE.url`).
