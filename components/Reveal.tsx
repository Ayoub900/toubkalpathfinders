"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement scroll reveal.
 * Renders nothing — observes any `.reveal` element already in the
 * server-rendered DOM and flips it to `.in` as it enters the viewport.
 * Content is fully present without JS; this only adds the entrance motion.
 */
export default function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => io.observe(el));

    // Anything already on screen (incl. bottom-aligned hero) reveals at once.
    document.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("in");
        io.unobserve(el);
      }
    });
    // Hero reveals immediately so it never flashes empty.
    document
      .querySelectorAll<HTMLElement>(".hero .reveal")
      .forEach((el) => {
        el.classList.add("in");
        io.unobserve(el);
      });

    return () => io.disconnect();
  }, []);

  return null;
}
