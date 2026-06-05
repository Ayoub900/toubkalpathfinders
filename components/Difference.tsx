const INCLUDED = [
  "Certified mountain guides",
  "Refuge & accommodation",
  "Local mule support",
  "Freshly prepared meals",
  "Transport logistics",
  "Safety assistance",
  "Local expertise throughout",
];

export default function Difference() {
  return (
    <section className="section dark" data-screen-label="The Difference">
      <div className="wrap diff">
        <div className="reveal">
          <span className="kicker">THE PATHFINDERS DIFFERENCE</span>
          <h2 className="h-1" style={{ margin: "18px 0 20px" }}>
            Organised direct.
            <br />
            No middlemen.
          </h2>
          <p className="lead">
            Every trek is organised directly by our local team — no
            intermediaries, no markup, no lost-in-translation. Just mountain
            people running mountain trips.
          </p>
          <div className="incl-grid">
            {INCLUDED.map((item) => (
              <div className="incl" key={item}>
                <span className="ic" aria-hidden="true">
                  ✓
                </span>{" "}
                {item}
              </div>
            ))}
            <div
              className="incl"
              style={{
                borderColor: "var(--lime)",
                background: "rgba(127,190,46,.1)",
              }}
            >
              <span className="ic" aria-hidden="true">
                ★
              </span>{" "}
              All-in, no surprises
            </div>
          </div>
        </div>
        <div className="visual reveal d1">
          <div className="ph dark-ph">
            <span className="ph-tag">▲ guide &amp; mule team on the trail</span>
          </div>
        </div>
      </div>
    </section>
  );
}
