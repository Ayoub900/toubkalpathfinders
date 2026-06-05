import type { Metadata } from "next";
import { getTreks } from "@/lib/treks";
import TrekFilterGrid from "@/components/TrekFilterGrid";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Toubkal Treks & Expeditions",
  description:
    "Browse every Mount Toubkal trek and High Atlas expedition — summit pushes, multi-day circuits, Berber village treks, wild camping and trail running, guided by born-and-raised Berber teams.",
  alternates: { canonical: "/treks" },
};

// Always reflect the latest catalogue from the database.
export const dynamic = "force-dynamic";

export default async function TreksPage() {
  const treks = await getTreks();

  return (
    <main className="page">
      <section className="page-head">
        <div className="wrap">
          <span className="kicker reveal">ALL ADVENTURES</span>
          <h1 className="h-1 reveal d1" style={{ margin: "18px 0 18px" }}>
            Every trail to Toubkal
            <br />
            and beyond.
          </h1>
          <p className="lead reveal d2">
            From a fast two-day summit push to our fifteen-day Grand Traverse — choose the
            line that fits your legs, your time and your appetite for the High Atlas.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(24px,4vw,48px)" }}>
        <div className="wrap">
          <TrekFilterGrid treks={treks} />
        </div>
      </section>

      <Reveal />
    </main>
  );
}
