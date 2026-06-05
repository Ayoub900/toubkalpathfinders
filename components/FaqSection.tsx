import Faq from "@/components/Faq";

export default function FaqSection() {
  return (
    <section className="section" id="faq" data-screen-label="FAQ">
      <div className="wrap faq-wrap">
        <div className="reveal faq-intro">
          <span className="kicker">PLANNING YOUR TREK</span>
          <h2 className="h-1" style={{ margin: "18px 0 18px" }}>
            Good to
            <br />
            know.
          </h2>
          <p className="lead">
            Everything you need before you lace up. Still unsure? Our team
            answers personally.
          </p>
          <a href="#contact" className="btn btn-dark" style={{ marginTop: 24 }}>
            Ask a question <span className="arrow">→</span>
          </a>
        </div>
        <Faq />
      </div>
    </section>
  );
}
