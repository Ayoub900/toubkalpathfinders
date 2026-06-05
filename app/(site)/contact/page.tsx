import type { Metadata } from "next";
import { SITE } from "@/lib/site-data";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Toubkal Pathfinders — locally owned Mount Toubkal trekking specialists in Imlil, High Atlas, Morocco. Ask about treks, dates or a custom itinerary.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { email, telephone, address, languages, region } = SITE;
  const telHref = `tel:${telephone.replace(/\s+/g, "")}`;

  return (
    <main className="page">
      <section className="page-head">
        <div className="wrap">
          <span className="kicker reveal">GET IN TOUCH</span>
          <h1 className="h-1 reveal d1" style={{ margin: "18px 0 18px" }}>
            Talk to the team
            <br />
            on the mountain.
          </h1>
          <p className="lead reveal d2">
            We&apos;re a small, locally owned team based in Imlil — the gateway to Mount
            Toubkal. Whether you&apos;re ready to book or just weighing up your options,
            we&apos;re happy to help plan your trek.
          </p>
        </div>
      </section>

      <section className="section td-body" style={{ paddingTop: "clamp(24px,4vw,48px)" }}>
        <div className="wrap td-body-grid">
          <div className="td-main">
            <div className="reveal td-block">
              <span className="kicker">CONTACT DETAILS</span>
              <h2 className="h-2" style={{ margin: "14px 0 24px" }}>
                Reach us directly
              </h2>
              <ul className="td-included">
                <li>
                  <span className="td-check">✉</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
                <li>
                  <span className="td-check">☎</span>
                  <a href={telHref}>{telephone}</a>
                </li>
                <li>
                  <span className="td-check">◎</span>
                  {address.locality}, {region}
                </li>
                <li>
                  <span className="td-check">◇</span>
                  We speak {languages.join(", ")}
                </li>
              </ul>
            </div>

            <div className="reveal td-block">
              <span className="kicker">RESPONSE TIME</span>
              <h2 className="h-2" style={{ margin: "14px 0 14px" }}>
                When to expect a reply
              </h2>
              <p className="muted" style={{ fontSize: 15, lineHeight: 1.7 }}>
                We typically reply to messages within one business day. During peak
                season our guides are often on the trail — if your trip is time-sensitive,
                calling or messaging us directly is the fastest way to reach the team.
              </p>
            </div>
          </div>

          <aside className="td-aside">
            <div className="td-sticky">
              <ContactForm />
            </div>
          </aside>
        </div>
      </section>

      <Reveal />
    </main>
  );
}
