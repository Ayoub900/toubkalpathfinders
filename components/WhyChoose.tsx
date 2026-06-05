const WHY = [
  {
    num: "01",
    ic: "▲",
    title: "Local Mountain Experts",
    body: "Our guides, muleteers, cooks & support crew were all born and raised in the High Atlas Mountains.",
    delay: "",
  },
  {
    num: "02",
    ic: "◎",
    title: "Toubkal Specialists",
    body: "We focus exclusively on Toubkal and its surrounding mountain region — nothing else.",
    delay: "d1",
  },
  {
    num: "03",
    ic: "❋",
    title: "Sustainable Tourism",
    body: "Operating under Sustainable Morocco — supporting local communities & responsible travel.",
    delay: "d2",
  },
  {
    num: "04",
    ic: "◆",
    title: "Small Groups & Private",
    body: "Personalised experiences with a strong focus on safety, comfort and quality.",
    delay: "d3",
  },
];

export default function WhyChoose() {
  return (
    <section className="section" data-screen-label="Why Choose">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="kicker">WHY PATHFINDERS</span>
          <h2 className="h-1">
            Not a Morocco tour operator.
            <br />
            Toubkal <span style={{ color: "var(--orange)" }}>specialists.</span>
          </h2>
          <p className="lead">
            We don&apos;t dabble in everything. Our entire team lives and works
            in the High Atlas year-round — so every trek runs on real mountain
            knowledge.
          </p>
        </div>
        <div className="why-grid">
          {WHY.map((f) => (
            <div className={`feature reveal${f.delay ? ` ${f.delay}` : ""}`} key={f.num}>
              <div className="corner"></div>
              <div className="num">{f.num}</div>
              <div className="ic" aria-hidden="true">
                {f.ic}
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
