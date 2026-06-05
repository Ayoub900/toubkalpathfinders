"use client";

import { useEffect, useRef } from "react";

interface Stat {
  count: number;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { count: 100, suffix: "%", label: "Local crew" },
  { count: 0, label: "Trace left behind" },
  { count: 12, suffix: "+", label: "Partner villages" },
];

export default function EcoStats() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nums = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("b[data-count]") ?? []
    );
    if (!nums.length) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const finalText = (el: HTMLElement) =>
      `${el.dataset.count}${el.dataset.suffix || ""}`;

    if (reduce || !("IntersectionObserver" in window)) {
      nums.forEach((el) => (el.textContent = finalText(el)));
      return;
    }

    const animate = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.count || "0");
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      let start: number | null = null;
      const step = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="eco-stats" ref={rootRef}>
      {STATS.map((s) => (
        <div className="s" key={s.label}>
          <b data-count={s.count} {...(s.suffix ? { "data-suffix": s.suffix } : {})}>
            0{s.suffix || ""}
          </b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
