"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const TREK_LINKS = [
  { label: "2-Day Summit Trek", note: "4,167m", slug: "2-day-summit" },
  { label: "3-Day Summit Trek", note: "+ acclim.", slug: "3-day-summit" },
  { label: "4-Day Round Trek", note: "circuit", slug: "4-day-round" },
  { label: "5-Day Berber Villages", note: "culture", slug: "5-day-berber" },
  { label: "6-Day Camping Expedition", note: "wild", slug: "6-day-camping" },
  { label: "15-Day Grand Traverse", note: "signature", slug: "15-day-traverse" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
        <div className="wrap nav-inner">
          <Link href="/" aria-label="Toubkal Pathfinders home">
            <Image
              src="/logo.png"
              alt="Toubkal Pathfinders"
              className="logo"
              width={932}
              height={356}
              priority
              sizes="120px"
            />
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <div className="has-drop">
              <Link href="/treks">Toubkal Treks ▾</Link>
              <div className="drop">
                {TREK_LINKS.map((t) => (
                  <Link href={`/treks/${t.slug}`} key={t.label}>
                    {t.label} <span className="d">{t.note}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/treks/trail-running">Trail Running</Link>
            <Link href="/blog">Journal</Link>
            <a href="/#mountain">The Mountain</a>
            <a href="/#sustain">Sustainable</a>
            <a href="/#team">About</a>
            <a href="/#faq">Plan</a>
          </div>
          <div className="nav-cta">
            <Link href="/contact" className="btn btn-lime">
              Contact Our Team <span className="arrow">→</span>
            </Link>
            <button
              className="burger"
              id="burger"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`drawer${drawerOpen ? " open" : ""}`} id="drawer">
        <button className="close" aria-label="Close menu" onClick={closeDrawer}>
          ×
        </button>
        <Link href="/" onClick={closeDrawer}>Home</Link>
        <Link href="/treks" onClick={closeDrawer}>Toubkal Treks</Link>
        <Link href="/treks/trail-running" onClick={closeDrawer}>Trail Running</Link>
        <Link href="/blog" onClick={closeDrawer}>Journal</Link>
        <a href="/#mountain" onClick={closeDrawer}>The Mountain</a>
        <a href="/#sustain" onClick={closeDrawer}>Sustainable Morocco</a>
        <a href="/#team" onClick={closeDrawer}>About Us</a>
        <a href="/#reviews" onClick={closeDrawer}>Reviews</a>
        <a href="/#faq" onClick={closeDrawer}>Plan Your Trek</a>
        <div className="drawer-cta">
          <Link
            href="/treks"
            className="btn btn-lime"
            style={{ justifyContent: "center" }}
            onClick={closeDrawer}
          >
            Explore Treks <span className="arrow">→</span>
          </Link>
          <Link
            href="/contact"
            className="btn btn-ghost"
            style={{ justifyContent: "center" }}
            onClick={closeDrawer}
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </>
  );
}
