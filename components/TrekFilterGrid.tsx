"use client";

import { useMemo, useRef, useState } from "react";
import { CATEGORIES, type Trek, type TrekCategory } from "@/lib/treks";
import TrekCardItem from "@/components/TrekCardItem";

const FILTERS: { label: string; filter: TrekCategory | "all" }[] = [
  { label: "All ◇", filter: "all" },
  ...CATEGORIES.map((c) => ({ label: c.label, filter: c.value })),
];

export default function TrekFilterGrid({ treks }: { treks: Trek[] }) {
  const [active, setActive] = useState<TrekCategory | "all">("all");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFav = (id: string) =>
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onFilter = (f: TrekCategory | "all") => {
    setActive(f);
    requestAnimationFrame(() => {
      gridRef.current?.querySelectorAll<HTMLElement>(".trek").forEach((card) => {
        if (card.style.display !== "none") {
          card.classList.remove("in");
          requestAnimationFrame(() => card.classList.add("in"));
        }
      });
    });
  };

  const visibleCount = useMemo(
    () => treks.filter((t) => active === "all" || t.cat === active).length,
    [treks, active]
  );

  return (
    <>
      <div className="filters reveal d1" id="filters">
        {FILTERS.map((f) => (
          <button
            key={f.filter}
            className={`filter-btn${active === f.filter ? " active" : ""}`}
            data-filter={f.filter}
            onClick={() => onFilter(f.filter)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="trek-grid" ref={gridRef} style={{ marginTop: 32 }}>
        {treks.map((trek) => (
          <TrekCardItem
            key={trek.id}
            trek={trek}
            visible={active === "all" || trek.cat === active}
            faved={favs.has(trek.id)}
            onFav={() => toggleFav(trek.id)}
          />
        ))}
      </div>

      {visibleCount === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono)",
            padding: "40px 0",
          }}
        >
          No treks in this category yet —{" "}
          <a href="#contact" style={{ color: "var(--lime-3)", textDecoration: "underline" }}>
            ask our team
          </a>
          .
        </p>
      )}
    </>
  );
}
