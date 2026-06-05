import EcoStats from "@/components/EcoStats";

const COMMITMENTS = [
  {
    n: "01",
    t: "Local employment",
    p: "Guiding work that stays in the High Atlas, with families who call it home.",
  },
  {
    n: "02",
    t: "Muleteers & mountain families",
    p: "Direct support for the people who move our expeditions.",
  },
  {
    n: "03",
    t: "Local guesthouse partnerships",
    p: "We book village-run stays, not faceless chains.",
  },
  {
    n: "04",
    t: "Environmental awareness",
    p: "Leave-no-trace ethics taught and practised on every trip.",
  },
  {
    n: "05",
    t: "Responsible waste management",
    p: "We pack it in, we pack it out — every time.",
  },
  {
    n: "06",
    t: "Community-based tourism",
    p: "Initiatives shaped by the communities they serve.",
  },
];

export default function Sustainable() {
  return (
    <section
      className="section dark sustain"
      id="sustain"
      data-screen-label="Sustainable Morocco"
    >
      <div className="bg-word" aria-hidden="true">
        SUSTAINABLE
      </div>
      <div className="wrap">
        <div className="section-head reveal" style={{ maxWidth: 680 }}>
          <span className="kicker">SUSTAINABLE MOROCCO</span>
          <h2 className="h-1" style={{ margin: "18px 0 18px" }}>
            More than
            <br />
            a trek.
          </h2>
          <p className="lead">
            We operate under the Sustainable Morocco initiative — responsible
            tourism that creates real benefits for local communities while
            protecting mountain environments.
          </p>
        </div>
        <div className="sustain-grid">
          <ul className="commit reveal">
            {COMMITMENTS.map((c) => (
              <li key={c.n}>
                <span className="n">{c.n}</span>
                <div>
                  <b>{c.t}</b>
                  <p>{c.p}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="reveal d1">
            <div
              className="ph lime-ph"
              style={{ aspectRatio: "1", minHeight: 300, marginBottom: 22 }}
            >
              <span className="ph-tag">▲ village partnership in the valley</span>
            </div>
            <EcoStats />
          </div>
        </div>
      </div>
    </section>
  );
}
