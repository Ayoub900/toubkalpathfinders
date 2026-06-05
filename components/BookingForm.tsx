"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function BookingForm({
  trekId,
  trekName,
}: {
  trekId: string;
  trekName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, trekId }),
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
      <div className="booking-card booking-success" id="book">
        <div className="booking-tick">✓</div>
        <h3>Enquiry received</h3>
        <p>
          Thanks — we&apos;ve logged your interest in the{" "}
          <strong>{trekName}</strong>. Our team will email you shortly to confirm dates and
          details.
        </p>
        <button className="btn btn-ghost" onClick={() => setStatus("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="booking-card" id="book">
      <span className="kicker">REQUEST A DEPARTURE</span>
      <h3 className="h-2" style={{ margin: "12px 0 6px" }}>
        Book this trek
      </h3>
      <p className="muted" style={{ marginBottom: 22, fontSize: 15 }}>
        Tell us your dates and group size — we organise direct, with no middlemen.
      </p>

      <form className="booking-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="bf-name">Full name *</label>
          <input id="bf-name" name="name" type="text" required autoComplete="name" />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="bf-email">Email *</label>
            <input id="bf-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="bf-phone">Phone</label>
            <input id="bf-phone" name="phone" type="tel" autoComplete="tel" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="bf-date">Preferred date</label>
            <input id="bf-date" name="date" type="date" />
          </div>
          <div className="field">
            <label htmlFor="bf-people">Group size</label>
            <input id="bf-people" name="people" type="number" min={1} defaultValue={2} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="bf-message">Anything else?</label>
          <textarea
            id="bf-message"
            name="message"
            rows={3}
            placeholder="Experience level, fitness, special requests…"
          />
        </div>

        {status === "error" && <p className="booking-error">{error}</p>}

        <button
          type="submit"
          className="btn btn-lime"
          style={{ justifyContent: "center", width: "100%" }}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send enquiry"}{" "}
          <span className="arrow">→</span>
        </button>
        <p className="booking-fineprint">
          No payment now. We&apos;ll confirm availability and the next steps by email.
        </p>
      </form>
    </div>
  );
}
