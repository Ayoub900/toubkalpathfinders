const MARQUEE = [
  "SUMMIT TREKS",
  "TRAIL RUNNING",
  "BERBER VILLAGES",
  "WILD CAMPING",
  "GRAND TRAVERSE",
  "MOUNTAIN PASSES",
];

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...MARQUEE, ...MARQUEE].map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
}
