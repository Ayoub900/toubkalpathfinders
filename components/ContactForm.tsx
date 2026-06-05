"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="booking-card booking-success" id="contact-form">
        <div className="booking-tick">✓</div>
        <h3>Message received</h3>
        <p>
          Thanks for reaching out — our team in Imlil will get back to you by email
          shortly. For anything urgent, call us directly on the number listed.
        </p>
        <button className="btn btn-ghost" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="booking-card" id="contact-form">
      <span className="kicker">SEND US A MESSAGE</span>
      <h3 className="h-2" style={{ margin: "12px 0 6px" }}>
        Get in touch
      </h3>
      <p className="muted" style={{ marginBottom: 22, fontSize: 15 }}>
        Questions about a trek, dates or a custom itinerary? Tell us what you have in
        mind — we organise direct, with no middlemen.
      </p>

      <form className="booking-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="cf-name">Full name *</label>
          <input id="cf-name" name="name" type="text" required autoComplete="name" />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="cf-email">Email *</label>
            <input id="cf-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="cf-phone">Phone</label>
            <input id="cf-phone" name="phone" type="tel" autoComplete="tel" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="cf-subject">Subject</label>
          <input
            id="cf-subject"
            name="subject"
            type="text"
            placeholder="e.g. 4-Day Round Trek in October"
          />
        </div>
        <div className="field">
          <label htmlFor="cf-message">Message *</label>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            required
            placeholder="Tell us about your group, dates, experience level or any questions…"
          />
        </div>

        {status === "error" && <p className="booking-error">{error}</p>}

        <button
          type="submit"
          className="btn btn-lime"
          style={{ justifyContent: "center", width: "100%" }}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send message"}{" "}
          <span className="arrow">→</span>
        </button>
        <p className="booking-fineprint">
          We typically reply within one business day.
        </p>
      </form>
    </div>
  );
}
