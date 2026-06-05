const MOUNTAIN_FACTS = [
  "Highest mountain in North Africa",
  "Located within Toubkal National Park",
  "Accessible throughout the year",
  "Suitable for beginners & experienced hikers",
  "Rich Berber cultural heritage",
];

export default function MeetMountain() {
  return (
    <section
      className="section"
      id="mountain"
      style={{ background: "var(--paper-2)" }}
      data-screen-label="Meet the Mountain"
    >
      <div className="wrap mountain">
        <div className="visual reveal">
          <div className="ph">
            <span className="ph-tag">▲ Mount Toubkal massif · summit ridge at dawn</span>
          </div>
          <div className="alt-badge">
            <b>4,167m</b>
            <span>Highest peak in North Africa</span>
          </div>
        </div>
        <div className="reveal d1">
          <span className="kicker">MEET THE MOUNTAIN</span>
          <h2 className="h-1" style={{ margin: "18px 0 20px" }}>
            Mount Toubkal
          </h2>
          <p className="lead">
            Rising above the High Atlas, Toubkal is the highest peak in North
            Africa and one of the most rewarding treks on earth — dramatic
            landscapes, traditional Berber villages, high passes and
            spectacular summit views.
          </p>
          <ul className="facts">
            {MOUNTAIN_FACTS.map((fact) => (
              <li key={fact}>
                <span className="tick" aria-hidden="true">
                  ✓
                </span>{" "}
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
