import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_LABEL,
  getTrekBySlug,
  parseItinerary,
  trekTone,
} from "@/lib/treks";
import { SITE } from "@/lib/site-data";
import BookingForm from "@/components/BookingForm";
import TrekJsonLd from "@/components/TrekJsonLd";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trek = await getTrekBySlug(slug);
  if (!trek || !trek.published) {
    return { title: "Trek not found", robots: { index: false, follow: false } };
  }

  const description = trek.description || trek.blurb;
  const url = `/treks/${trek.slug}`;
  // OG/Twitter images must be absolute; uploaded paths are site-relative.
  const image = trek.image
    ? trek.image.startsWith("http")
      ? trek.image
      : `${SITE.url}${trek.image}`
    : `${SITE.url}/logo.webp`;

  return {
    title: trek.name,
    description,
    keywords: [
      trek.name,
      `${CATEGORY_LABEL[trek.cat] || trek.cat} Toubkal trek`,
      "Mount Toubkal",
      "High Atlas trekking",
      "Morocco trekking",
      ...(trek.duration ? [`${trek.duration} Toubkal trek`] : []),
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: trek.name,
      description,
      url: `${SITE.url}${url}`,
      images: [{ url: image, alt: trek.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: trek.name,
      description,
      images: [image],
    },
  };
}

export default async function TrekDetailPage({ params }: Props) {
  const { slug } = await params;
  const trek = await getTrekBySlug(slug);
  if (!trek || !trek.published) notFound();

  const itinerary = parseItinerary(trek.itinerary);
  const tone = trek.image ? "" : trekTone(trek);
  const heroPhClass = `ph${tone ? ` ${tone}` : ""}`;

  return (
    <main className="page">
      <TrekJsonLd trek={trek} />
      <article className="trek-detail">
        {/* ---------- hero ---------- */}
        <section className="td-hero">
          <div className="wrap">
            <Link href="/treks" className="td-back">
              ← All treks
            </Link>
            <div className="td-hero-grid">
              <div className="td-hero-copy reveal">
                <div className="meta-row" style={{ marginBottom: 16 }}>
                  <span className="chip lime">{CATEGORY_LABEL[trek.cat] || trek.cat}</span>
                  {trek.duration && <span className="chip">{trek.duration}</span>}
                  {trek.difficulty && (
                    <span className="chip orange">{trek.difficulty}</span>
                  )}
                </div>
                <h1 className="h-1">{trek.name}</h1>
                <p className="lead" style={{ marginTop: 18 }}>
                  {trek.description || trek.blurb}
                </p>
                <div className="td-hero-foot">
                  <div className="price">
                    <b>{trek.price}</b>
                    <span>{trek.priceNote}</span>
                  </div>
                  <a href="#book" className="btn btn-lime">
                    Book this trek <span className="arrow">→</span>
                  </a>
                </div>
              </div>
              <div className="td-hero-media reveal d1">
                <div className={heroPhClass}>
                  {trek.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={trek.image} alt={trek.name} className="imgreal" />
                  ) : (
                    <span className="ph-tag">▲ {trek.duration || trek.name}</span>
                  )}
                </div>
                {trek.featured && (
                  <span className="sticker td-sticker">★ SIGNATURE EXPEDITION</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- body ---------- */}
        <section className="section td-body">
          <div className="wrap td-body-grid">
            <div className="td-main">
              {trek.highlights.length > 0 && (
                <div className="reveal td-block">
                  <span className="kicker">TRIP HIGHLIGHTS</span>
                  <ul className="td-highlights">
                    {trek.highlights.map((h) => (
                      <li key={h}>
                        <span className="td-hl-dot">▲</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {itinerary.length > 0 && (
                <div className="reveal td-block">
                  <span className="kicker">DAY BY DAY</span>
                  <h2 className="h-2" style={{ margin: "14px 0 24px" }}>
                    The itinerary
                  </h2>
                  <ol className="td-itinerary">
                    {itinerary.map((d, i) => (
                      <li key={i} className="td-itin-item">
                        <div className="td-itin-day">{d.day || `Day ${i + 1}`}</div>
                        <div className="td-itin-content">
                          <h3>{d.title}</h3>
                          {d.detail && <p>{d.detail}</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {trek.included.length > 0 && (
                <div className="reveal td-block">
                  <span className="kicker">WHAT&apos;S INCLUDED</span>
                  <ul className="td-included">
                    {trek.included.map((inc) => (
                      <li key={inc}>
                        <span className="td-check">✓</span> {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {trek.gallery.length > 0 && (
                <div className="reveal td-block">
                  <span className="kicker">GALLERY</span>
                  <div className="td-gallery">
                    {trek.gallery.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt={trek.name} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="td-aside">
              <div className="td-sticky">
                <BookingForm trekId={trek.id} trekName={trek.name} />
              </div>
            </aside>
          </div>
        </section>
      </article>

      <Reveal />
    </main>
  );
}
