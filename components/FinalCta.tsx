import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="section dark cta" id="contact" data-screen-label="Final CTA">
      <div className="cta-ridge" aria-hidden="true"></div>
      <div className="wrap inner">
        <span className="kicker reveal" style={{ justifyContent: "center" }}>
          READY WHEN YOU ARE
        </span>
        <h2 className="h-mega reveal d1">
          Your Toubkal
          <br />
          adventure
          <br />
          <span style={{ color: "var(--orange)" }}>starts here.</span>
        </h2>
        <p className="lead reveal d2" style={{ color: "#CFCBB8" }}>
          Join hundreds of hikers who&apos;ve discovered the Atlas Mountains
          with our local team. Tell us your dates and we&apos;ll build the trek
          around you.
        </p>
        <div className="cta-actions reveal d3">
          <a href="#adventures" className="btn btn-lime">
            View Treks <span className="arrow">→</span>
          </a>
          <Link href="/contact" className="btn btn-ghost">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
