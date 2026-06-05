const TEAM = [
  {
    name: "Brahim",
    role: "Founder & Lead Guide",
    bio: "Grew up in the shadow of Toubkal; started Pathfinders to keep guiding work local.",
    delay: "",
  },
  {
    name: "Youssef",
    role: "Senior Mountain Guide",
    bio: "Certified high-altitude guide with 200+ Toubkal summits behind him.",
    delay: "d1",
  },
  {
    name: "Khadija",
    role: "Operations & Logistics",
    bio: "Keeps every refuge, mule and meal exactly where it needs to be.",
    delay: "d2",
  },
  {
    name: "Hassan",
    role: "Cook & Support Crew",
    bio: "The reason dinner in the refuge tastes better than dinner at home.",
    delay: "d3",
  },
];

export default function Team() {
  return (
    <section className="section" id="team" data-screen-label="Team">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="kicker">MEET OUR TEAM</span>
          <h2 className="h-1" style={{ margin: "18px 0 18px" }}>
            Local people.
            <br />
            Real mountain experience.
          </h2>
          <p className="lead">
            The Pathfinders crew was born in these valleys. Here are a few of
            the faces you&apos;ll trek with.
          </p>
        </div>
        <div className="team-grid">
          {TEAM.map((m) => (
            <div className={`member reveal${m.delay ? ` ${m.delay}` : ""}`} key={m.name}>
              <div className="ph">
                <span className="ph-tag">▲ {m.role.toLowerCase()} portrait</span>
              </div>
              <div className="info">
                <h4>{m.name}</h4>
                <div className="role">{m.role}</div>
                <p>{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
