"use client";

import Link from "next/link";
import { CATEGORY_LABEL, trekTone, type Trek } from "@/lib/treks";

export default function TrekCardItem({
  trek,
  faved,
  onFav,
  visible,
}: {
  trek: Trek;
  faved: boolean;
  onFav: () => void;
  visible: boolean;
}) {
  const tone = trek.image ? "" : trekTone(trek);
  const phClass = `ph${tone ? ` ${tone}` : ""}`;
  const articleClass = `trek${trek.featured ? " feat" : ""} reveal`;
  const phTag = trek.duration || CATEGORY_LABEL[trek.cat] || trek.cat;
  const href = `/treks/${trek.slug}`;

  const badges = [
    trek.duration ? { label: trek.duration.toUpperCase() } : null,
    trek.difficulty ? { label: trek.difficulty.toUpperCase(), tone: "orange" as const } : null,
  ].filter(Boolean) as { label: string; tone?: "orange" }[];

  return (
    <article
      className={articleClass}
      data-cat={trek.cat}
      style={visible ? undefined : { display: "none" }}
    >
      <div className="media">
        <Link href={href} className={phClass} aria-label={trek.name}>
          {trek.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={trek.image} alt={trek.name} className="imgreal" />
          ) : null}
          <span className="ph-tag">▲ {phTag}</span>
        </Link>
        {trek.featured ? (
          <div className="badges">
            <span className="sticker">★ SIGNATURE EXPEDITION</span>
          </div>
        ) : (
          <>
            <div className="badges">
              {badges.map((b) => (
                <span className={`chip${b.tone ? ` ${b.tone}` : ""}`} key={b.label}>
                  {b.label}
                </span>
              ))}
            </div>
            <button
              className="fav"
              aria-label={faved ? "Saved" : "Save"}
              aria-pressed={faved}
              onClick={onFav}
              style={faved ? { color: "var(--orange)" } : undefined}
            >
              ♥
            </button>
          </>
        )}
      </div>
      <div className="body">
        <div className="meta-row">
          <span className="chip lime">{CATEGORY_LABEL[trek.cat] || trek.cat}</span>
        </div>
        <h3>{trek.name}</h3>
        <p>{trek.blurb}</p>
        <div className="foot">
          <div className="price">
            <b>{trek.price}</b>
            <span>{trek.priceNote}</span>
          </div>
          {trek.featured ? (
            <Link href={href} className="btn btn-orange">
              View trek <span className="arrow">→</span>
            </Link>
          ) : (
            <Link href={href} className="go">
              View trek <span className="arrow">→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
