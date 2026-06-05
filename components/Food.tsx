export default function Food() {
  return (
    <section className="section" data-screen-label="Food & Hospitality">
      <div className="wrap food">
        <div className="gallery reveal">
          <div className="ph orange-ph">
            <span className="ph-tag">▲ tagine in the refuge</span>
          </div>
          <div className="ph">
            <span className="ph-tag">▲ mint tea</span>
          </div>
          <div className="ph lime-ph">
            <span className="ph-tag">▲ trail lunch</span>
          </div>
        </div>
        <div className="reveal d1">
          <span className="kicker">FOOD &amp; HOSPITALITY</span>
          <h2 className="h-1" style={{ margin: "18px 0 20px" }}>
            Mountain meals,
            <br />
            made with care.
          </h2>
          <p className="lead">
            Good food is part of every adventure. Our local cook team prepares
            fresh meals using local ingredients wherever possible — whether
            you&apos;re in a refuge, a guesthouse, a village home or a
            campsite.
          </p>
          <div className="diet">
            <span className="chip lime">Moroccan breakfasts</span>
            <span className="chip lime">Fresh trail lunches</span>
            <span className="chip lime">Hearty evening meals</span>
            <span className="chip">Seasonal fruit &amp; snacks</span>
            <span className="chip">Mint tea &amp; coffee</span>
            <span className="chip orange">Vegetarian</span>
            <span className="chip orange">Vegan</span>
            <span className="chip orange">Gluten-free</span>
            <span className="chip">Custom diets on request</span>
          </div>
        </div>
      </div>
    </section>
  );
}
