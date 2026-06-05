export default function Hero() {
  return (
    <header className="hero magazine" id="top" data-screen-label="Hero">
      <div className="hero-stripe" aria-hidden="true"></div>
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <span className="kicker reveal">HIGH ATLAS · MOROCCO</span>
          <h1 className="h-mega reveal d1">
            Find your
            <br />
            line up the <span className="o">High Atlas.</span>
          </h1>
          <p className="sub reveal d2">
            Toubkal specialists. Local guides. Real mountains — no middlemen,
            no compromises.
          </p>
          <div className="hero-actions reveal d3">
            <a href="#adventures" className="btn btn-lime">
              Explore Treks <span className="arrow">→</span>
            </a>
            <a href="#team" className="btn btn-dark">
              Our Team
            </a>
          </div>
          <span className="sticker hero-sticker">★ 100% LOCAL</span>
        </div>
        <div className="hero-photo reveal d2">
          <div className="ph orange-ph">
            <span className="ph-tag">▲ trekkers on the pass</span>
          </div>
          <div className="hero-minicard reveal d3">
            <div className="t">2-Day Summit Trek</div>
            <div className="d">CLASSIC ASCENT · GUIDED</div>
            <div className="p">
              <b>€185</b>
              <a href="#adventures" className="go">
                View <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
