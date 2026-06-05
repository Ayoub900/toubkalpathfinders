import Link from "next/link";
import { type Trek } from "@/lib/treks";
import TrekFilterGrid from "@/components/TrekFilterGrid";

export default function AdventuresSection({ treks }: { treks: Trek[] }) {
  return (
    <section className="section" id="adventures" data-screen-label="Featured Adventures">
      <div className="wrap">
        <div className="adv-head">
          <div className="section-head reveal" style={{ marginBottom: 0 }}>
            <span className="kicker">FEATURED ADVENTURES</span>
            <h2 className="h-1" style={{ margin: "18px 0 0" }}>
              Pick your line
              <br />
              to the summit.
            </h2>
          </div>
          <Link href="/treks" className="btn btn-ghost reveal d1">
            Browse all treks <span className="arrow">→</span>
          </Link>
        </div>

        {treks.length > 0 ? (
          <TrekFilterGrid treks={treks} />
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              fontFamily: "var(--mono)",
              padding: "40px 0",
            }}
          >
            No treks published yet — add them in the{" "}
            <Link href="/dashboard" style={{ color: "var(--lime-3)", textDecoration: "underline" }}>
              dashboard
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
