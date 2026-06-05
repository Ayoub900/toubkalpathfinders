import { REVIEWS } from "@/lib/site-data";

export default function Reviews() {
  return (
    <section
      className="section"
      id="reviews"
      style={{ background: "var(--paper-2)" }}
      data-screen-label="Reviews"
    >
      <div className="wrap">
        <div className="section-head reveal">
          <span className="kicker">REVIEWS &amp; TESTIMONIALS</span>
          <h2 className="h-1" style={{ margin: "18px 0 0" }}>
            Loved by hundreds
            <br />
            of hikers.
          </h2>
        </div>
        <div className="rev-grid">
          {REVIEWS.map((r) => (
            <div
              className={`review${r.big ? " big" : ""} reveal${
                r.delay ? ` ${r.delay}` : ""
              }`}
              key={r.name}
            >
              <div className="stars" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <p>&ldquo;{r.quote}&rdquo;</p>
              <div className="who">
                <div className="av" aria-hidden="true">
                  {r.initial}
                </div>
                <div>
                  <b>{r.name}</b>
                  <span>{r.meta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
