"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_LABEL, type Trek } from "@/lib/treks";
import { POST_CATEGORY_LABEL, formatPostDate, type Post } from "@/lib/posts";
import TrekForm from "@/components/dashboard/TrekForm";
import PostForm from "@/components/dashboard/PostForm";

export type BookingRow = {
  id: string;
  trekName: string;
  name: string;
  email: string;
  phone: string | null;
  date: string | null;
  people: number;
  message: string | null;
  status: string;
  createdAt: string;
};

export type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
};

type View = "overview" | "treks" | "bookings" | "messages" | "blog";

const VIEW_TITLE: Record<View, string> = {
  overview: "Dashboard",
  treks: "Treks",
  bookings: "Bookings",
  messages: "Messages",
  blog: "Journal",
};

/* ---------------- helpers ---------------- */

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Cheap stable bucket so avatars get a consistent lime/orange/info tone. */
function avTone(seed: string): "" | "l" | "i" {
  const n = seed.charCodeAt(0) % 3;
  return n === 0 ? "l" : n === 1 ? "i" : "";
}

const STATUS_TONE: Record<string, "ok" | "warn" | "bad"> = {
  confirmed: "ok",
  pending: "warn",
  cancelled: "bad",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
};

const INQUIRY_STATUS_TONE: Record<string, "ok" | "warn" | "bad"> = {
  new: "warn",
  replied: "ok",
  archived: "bad",
};

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.round(hr / 24);
  if (day === 1) return "Yesterday";
  if (day < 7) return `${day}d`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/** Parse the free-text booking date into a month/day chip when possible. */
function dateChip(value: string | null): { m: string; d: string } | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return {
    m: d.toLocaleDateString(undefined, { month: "short" }),
    d: d.toLocaleDateString(undefined, { day: "2-digit" }),
  };
}

function fmtMoney(n: number): string {
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`;
  return `€${Math.round(n)}`;
}

export default function DashboardApp({
  initialTreks,
  initialBookings,
  initialPosts,
  initialInquiries,
}: {
  initialTreks: Trek[];
  initialBookings: BookingRow[];
  initialPosts: Post[];
  initialInquiries: InquiryRow[];
}) {
  const router = useRouter();
  const [view, setView] = useState<View>("overview");
  const [treks, setTreks] = useState<Trek[]>(initialTreks);
  const [bookings, setBookings] = useState<BookingRow[]>(initialBookings);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [inquiries, setInquiries] = useState<InquiryRow[]>(initialInquiries);
  const [editing, setEditing] = useState<Trek | "new" | null>(null);
  const [editingPost, setEditingPost] = useState<Post | "new" | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedingPosts, setSeedingPosts] = useState(false);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const newInquiryCount = inquiries.filter((i) => i.status === "new").length;

  function go(v: View) {
    setView(v);
    setEditing(null);
    setEditingPost(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/dashboard/login");
    router.refresh();
  }

  function onSaved(saved: Trek) {
    setTreks((prev) => {
      const exists = prev.some((t) => t.id === saved.id);
      const next = exists ? prev.map((t) => (t.id === saved.id ? saved : t)) : [...prev, saved];
      return next.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          a.order - b.order ||
          a.name.localeCompare(b.name)
      );
    });
    setEditing(null);
  }

  async function deleteTrek(t: Trek) {
    if (!confirm(`Delete "${t.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/treks/${t.id}`, { method: "DELETE" });
    if (res.ok) setTreks((prev) => prev.filter((x) => x.id !== t.id));
    else alert("Delete failed");
  }

  async function seed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.created) {
        const tr = await fetch("/api/treks").then((r) => r.json());
        setTreks(tr.treks ?? []);
      } else if (json.skipped) {
        alert(json.message);
      }
    } finally {
      setSeeding(false);
    }
  }

  function onPostSaved(saved: Post) {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      const next = exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [...prev, saved];
      return next.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          a.order - b.order ||
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
    setEditingPost(null);
  }

  async function deletePost(p: Post) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/posts/${p.id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((x) => x.id !== p.id));
    else alert("Delete failed");
  }

  async function seedPosts() {
    setSeedingPosts(true);
    try {
      const res = await fetch("/api/posts/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.created) {
        const pr = await fetch("/api/posts").then((r) => r.json());
        setPosts(pr.posts ?? []);
      } else if (json.skipped) {
        alert(json.message);
      }
    } finally {
      setSeedingPosts(false);
    }
  }

  async function setBookingStatus(b: BookingRow, status: string) {
    const res = await fetch(`/api/bookings/${b.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings((prev) => prev.map((x) => (x.id === b.id ? { ...x, status } : x)));
    }
  }

  async function deleteBooking(b: BookingRow) {
    if (!confirm(`Delete enquiry from ${b.name}?`)) return;
    const res = await fetch(`/api/bookings/${b.id}`, { method: "DELETE" });
    if (res.ok) setBookings((prev) => prev.filter((x) => x.id !== b.id));
  }

  async function setInquiryStatus(i: InquiryRow, status: string) {
    const res = await fetch(`/api/inquiries/${i.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setInquiries((prev) => prev.map((x) => (x.id === i.id ? { ...x, status } : x)));
    }
  }

  async function deleteInquiry(i: InquiryRow) {
    if (!confirm(`Delete message from ${i.name}?`)) return;
    const res = await fetch(`/api/inquiries/${i.id}`, { method: "DELETE" });
    if (res.ok) setInquiries((prev) => prev.filter((x) => x.id !== i.id));
  }

  const crumbTail = editing
    ? editing === "new"
      ? "New trek"
      : "Edit trek"
    : editingPost
    ? editingPost === "new"
      ? "New post"
      : "Edit post"
    : VIEW_TITLE[view];

  return (
    <div className="adm">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="sb">
        <div className="sb-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mark.png" alt="" />
          <div>
            <div className="bt">Pathfinders</div>
            <div className="bs">Operations Console</div>
          </div>
        </div>
        <nav className="sb-scroll">
          <div className="sb-group">Main</div>
          <button
            className={`sb-link${view === "overview" ? " active" : ""}`}
            onClick={() => go("overview")}
          >
            <span className="ic">▦</span>
            <span className="lbl">Dashboard</span>
          </button>
          <div className="sb-group">Manage</div>
          <button
            className={`sb-link${view === "treks" ? " active" : ""}`}
            onClick={() => go("treks")}
          >
            <span className="ic">▲</span>
            <span className="lbl">Treks</span>
            <span className="soon">{treks.length}</span>
          </button>
          <button
            className={`sb-link${view === "bookings" ? " active" : ""}`}
            onClick={() => go("bookings")}
          >
            <span className="ic">◆</span>
            <span className="lbl">Bookings</span>
            {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
          </button>
          <button
            className={`sb-link${view === "blog" ? " active" : ""}`}
            onClick={() => go("blog")}
          >
            <span className="ic">✎</span>
            <span className="lbl">Journal</span>
            <span className="soon">{posts.length}</span>
          </button>
          <button
            className={`sb-link${view === "messages" ? " active" : ""}`}
            onClick={() => go("messages")}
          >
            <span className="ic">✉</span>
            <span className="lbl">Messages</span>
            {newInquiryCount > 0 ? (
              <span className="badge">{newInquiryCount}</span>
            ) : (
              <span className="soon">{inquiries.length}</span>
            )}
          </button>
          <div className="sb-group">Insights</div>
          <span className="sb-link stub" title="Coming soon">
            <span className="ic">◇</span>
            <span className="lbl">Reports</span>
            <span className="soon">Soon</span>
          </span>
        </nav>
        <div className="sb-foot">
          <button className="sb-user" onClick={logout} title="Log out">
            <span className="av">P</span>
            <div>
              <div className="nm">Pathfinders Admin</div>
              <div className="rl">OPERATIONS LEAD</div>
            </div>
            <span className="cog">⎋</span>
          </button>
        </div>
      </aside>

      {/* ===================== MAIN ===================== */}
      <div className="main">
        <header className="topbar">
          <div className="tb-title">
            <div className="crumbs">
              <span>Console</span> / <b>{crumbTail}</b>
            </div>
            <h1>{VIEW_TITLE[view]}</h1>
          </div>
          <div className="tb-spacer" />
          <label className="search">
            <span style={{ color: "var(--muted-d)" }}>⌕</span>
            <input placeholder="Search bookings, customers, treks…" />
            <span className="k">⌘K</span>
          </label>
          <button className="tb-icon" aria-label="Notifications" onClick={() => go("bookings")}>
            ◔{pendingCount > 0 && <span className="dot" />}
          </button>
        </header>

        <main className="content">
          {view === "overview" && (
            <Overview
              treks={treks}
              bookings={bookings}
              pendingCount={pendingCount}
              onGoBookings={() => go("bookings")}
              onGoTreks={() => go("treks")}
            />
          )}

          {view === "treks" && (
            <TreksView
              treks={treks}
              editing={editing}
              setEditing={setEditing}
              onSaved={onSaved}
              onDelete={deleteTrek}
              onSeed={seed}
              seeding={seeding}
            />
          )}

          {view === "bookings" && (
            <BookingsView
              bookings={bookings}
              onStatus={setBookingStatus}
              onDelete={deleteBooking}
            />
          )}

          {view === "messages" && (
            <MessagesView
              inquiries={inquiries}
              onStatus={setInquiryStatus}
              onDelete={deleteInquiry}
            />
          )}

          {view === "blog" && (
            <BlogView
              posts={posts}
              editing={editingPost}
              setEditing={setEditingPost}
              onSaved={onPostSaved}
              onDelete={deletePost}
              onSeed={seedPosts}
              seeding={seedingPosts}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- overview ---------------- */

function Overview({
  treks,
  bookings,
  pendingCount,
  onGoBookings,
  onGoTreks,
}: {
  treks: Trek[];
  bookings: BookingRow[];
  pendingCount: number;
  onGoBookings: () => void;
  onGoTreks: () => void;
}) {
  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const priceByName = new Map(treks.map((t) => [t.name, t.priceValue ?? 0]));
    const revenue = confirmed.reduce(
      (sum, b) => sum + (priceByName.get(b.trekName) ?? 0) * Math.max(1, b.people),
      0
    );
    const published = treks.filter((t) => t.published).length;
    return {
      total: bookings.length,
      confirmed: confirmed.length,
      revenue,
      published,
      drafts: treks.length - published,
    };
  }, [bookings, treks]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => b.status !== "cancelled" && dateChip(b.date))
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
        .slice(0, 5),
    [bookings]
  );

  const recent = bookings.slice(0, 5);
  const enquiries = bookings.filter((b) => b.message).slice(0, 4);

  return (
    <>
      <div className="page-head">
        <div className="ph-l">
          <div className="k">{today}</div>
          <h2>Good morning.</h2>
          <div className="sub">
            {stats.total} booking{stats.total === 1 ? "" : "s"} on record ·{" "}
            {pendingCount} awaiting confirmation · {stats.published} live trek
            {stats.published === 1 ? "" : "s"}.
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={onGoBookings}>
            ↓ Bookings
          </button>
          <button className="btn btn-lime" onClick={onGoTreks}>
            + New trek
          </button>
        </div>
      </div>

      {/* KPIs */}
      <section className="kpis">
        <div className="kpi">
          <div className="top">
            <span className="lab">Bookings · total</span>
            <span className="ic">◆</span>
          </div>
          <div className="val">{stats.total}</div>
          <div className="delta up">
            ● {stats.confirmed} confirmed <span className="since" />
          </div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Revenue · confirmed</span>
            <span className="ic">€</span>
          </div>
          <div className="val">{fmtMoney(stats.revenue)}</div>
          <div className="delta up">
            ▲ booked value <span className="since" />
          </div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Treks live</span>
            <span className="ic">▲</span>
          </div>
          <div className="val">
            {stats.published}
            <small> / {treks.length}</small>
          </div>
          <div className="delta up">
            ● {stats.drafts} draft{stats.drafts === 1 ? "" : "s"} <span className="since" />
          </div>
        </div>
        <div className={`kpi${pendingCount > 0 ? " o" : ""}`}>
          <div className="top">
            <span className="lab">Pending</span>
            <span className="ic">⌚</span>
          </div>
          <div className="val">{pendingCount}</div>
          <div className={`delta ${pendingCount > 0 ? "down" : "up"}`}>
            ● awaiting reply <span className="since" />
          </div>
        </div>
      </section>

      <div className="dash-grid">
        {/* LEFT */}
        <div className="stack">
          {/* Upcoming departures */}
          <section className="card">
            <div className="card-head">
              <h3>Upcoming departures</h3>
              <button className="lnk" onClick={onGoBookings}>
                All bookings →
              </button>
            </div>
            {upcoming.length === 0 ? (
              <div className="adm-empty">No dated departures scheduled yet.</div>
            ) : (
              <div className="list">
                {upcoming.map((b) => {
                  const chip = dateChip(b.date)!;
                  const tone = STATUS_TONE[b.status] ?? "warn";
                  return (
                    <div className="li" key={b.id}>
                      <div className="datechip">
                        <div className="m">{chip.m}</div>
                        <div className="d">{chip.d}</div>
                      </div>
                      <div className="li-body">
                        <div className="t">{b.trekName}</div>
                        <div className="meta">
                          <span>◎ {b.name}</span>
                          <span>
                            ◆ {b.people} pax
                          </span>
                        </div>
                      </div>
                      <div className="li-end">
                        <span className={`st ${tone}`}>{STATUS_LABEL[b.status] ?? b.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recent bookings */}
          <section className="card">
            <div className="card-head">
              <h3>Recent bookings</h3>
              <button className="lnk" onClick={onGoBookings}>
                All bookings →
              </button>
            </div>
            {recent.length === 0 ? (
              <div className="adm-empty">No booking enquiries yet.</div>
            ) : (
              <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Trek</th>
                    <th>Departs</th>
                    <th className="right">Group</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className="cell-cust">
                          <span className={`av-sm ${avTone(b.name)}`}>{initials(b.name)}</span>
                          <div>
                            <div className="strong">{b.name}</div>
                            <div className="sub">{b.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{b.trekName}</td>
                      <td className="mono" style={{ fontSize: "12.5px" }}>
                        {b.date || "—"}
                      </td>
                      <td className="right price">{b.people}</td>
                      <td>
                        <span className={`st ${STATUS_TONE[b.status] ?? "warn"}`}>
                          {STATUS_LABEL[b.status] ?? b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT */}
        <div className="stack">
          {/* Enquiries */}
          <section className="card">
            <div className="card-head">
              <h3>Latest enquiries</h3>
              <button className="lnk" onClick={onGoBookings}>
                Open bookings →
              </button>
            </div>
            {enquiries.length === 0 ? (
              <div className="adm-empty">No messages from customers yet.</div>
            ) : (
              <div className="list">
                {enquiries.map((b) => (
                  <button
                    className={`msg-li${b.status === "pending" ? " unread" : ""}`}
                    key={b.id}
                    onClick={onGoBookings}
                  >
                    <span className={`av-sm ${avTone(b.name)}`}>{initials(b.name)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="who">
                        <span className="nm">{b.name}</span>
                        <span className="tm">{relativeTime(b.createdAt)}</span>
                      </div>
                      <div className="subj">{b.trekName}</div>
                      <div className="snip">{b.message}</div>
                      <span className={`mtag ${STATUS_TONE[b.status] ?? "warn"}`}>
                        {STATUS_LABEL[b.status] ?? b.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Active treks */}
          <section className="card">
            <div className="card-head">
              <h3>Active treks</h3>
              <button className="lnk" onClick={onGoTreks}>
                Manage →
              </button>
            </div>
            {treks.length === 0 ? (
              <div className="adm-empty">No treks yet.</div>
            ) : (
              <div className="tbl-scroll">
              <table className="tbl">
                <tbody>
                  {treks.slice(0, 6).map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="strong">{t.name}</div>
                        <div className="sub">{CATEGORY_LABEL[t.cat] || t.cat}</div>
                      </td>
                      <td className="right price">{t.price}</td>
                      <td style={{ width: "1%" }}>
                        <span className={`st ${t.published ? "ok" : "done"}`}>
                          {t.published ? "Live" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

/* ---------------- treks view ---------------- */

function TreksView({
  treks,
  editing,
  setEditing,
  onSaved,
  onDelete,
  onSeed,
  seeding,
}: {
  treks: Trek[];
  editing: Trek | "new" | null;
  setEditing: (v: Trek | "new" | null) => void;
  onSaved: (t: Trek) => void;
  onDelete: (t: Trek) => void;
  onSeed: () => void;
  seeding: boolean;
}) {
  if (editing) {
    return (
      <>
        <div className="page-head">
          <div className="ph-l">
            <div className="k">{editing === "new" ? "Catalogue" : "Edit"}</div>
            <h2>{editing === "new" ? "New trek" : "Edit trek"}</h2>
            <div className="sub">
              {editing === "new"
                ? "Add a new adventure to the catalogue."
                : editing.name}
            </div>
          </div>
          <div className="page-actions">
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>
              ← Back to list
            </button>
          </div>
        </div>
        <TrekForm
          initial={editing === "new" ? null : editing}
          onSaved={onSaved}
          onCancel={() => setEditing(null)}
        />
      </>
    );
  }

  const published = treks.filter((t) => t.published).length;
  const featured = treks.filter((t) => t.featured).length;

  return (
    <>
      <div className="page-head">
        <div className="ph-l">
          <div className="k">Catalogue</div>
          <h2>Treks</h2>
          <div className="sub">Create, edit and publish the adventures shown on the site.</div>
        </div>
        <div className="page-actions">
          {treks.length === 0 && (
            <button className="btn btn-ghost" onClick={onSeed} disabled={seeding}>
              {seeding ? "Seeding…" : "Seed sample treks"}
            </button>
          )}
          <button className="btn btn-lime" onClick={() => setEditing("new")}>
            + New trek
          </button>
        </div>
      </div>

      <section className="kpis">
        <div className="kpi">
          <div className="top">
            <span className="lab">Total treks</span>
            <span className="ic">▲</span>
          </div>
          <div className="val">{treks.length}</div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Published</span>
            <span className="ic">◎</span>
          </div>
          <div className="val">{published}</div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Drafts</span>
            <span className="ic">◇</span>
          </div>
          <div className="val">{treks.length - published}</div>
        </div>
        <div className="kpi o">
          <div className="top">
            <span className="lab">Featured</span>
            <span className="ic">★</span>
          </div>
          <div className="val">{featured}</div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>All treks</h3>
        </div>
        {treks.length === 0 ? (
          <div className="adm-empty">
            No treks yet. Click “Seed sample treks” to import the original catalogue, or “New
            trek” to start fresh.
          </div>
        ) : (
          <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th></th>
                <th>Trek</th>
                <th>Category</th>
                <th className="right">Price</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {treks.map((t) => (
                <tr key={t.id}>
                  <td style={{ width: "1%" }}>
                    {t.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.image} alt="" className="thumb" />
                    ) : (
                      <div className="thumb empty">▲</div>
                    )}
                  </td>
                  <td>
                    <div className="strong">{t.name}</div>
                    <div className="sub mono">/treks/{t.slug}</div>
                  </td>
                  <td>{CATEGORY_LABEL[t.cat] || t.cat}</td>
                  <td className="right price">{t.price}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span className={`st ${t.published ? "ok" : "done"}`}>
                        {t.published ? "Published" : "Draft"}
                      </span>
                      {t.featured && <span className="st warn">Featured</span>}
                    </div>
                  </td>
                  <td>
                    <div className="row-acts">
                      <a
                        className="row-btn"
                        href={`/treks/${t.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                      <button className="row-btn" onClick={() => setEditing(t)}>
                        Edit
                      </button>
                      <button className="row-btn danger" onClick={() => onDelete(t)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>
    </>
  );
}

/* ---------------- bookings view ---------------- */

function BookingsView({
  bookings,
  onStatus,
  onDelete,
}: {
  bookings: BookingRow[];
  onStatus: (b: BookingRow, status: string) => void;
  onDelete: (b: BookingRow) => void;
}) {
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  return (
    <>
      <div className="page-head">
        <div className="ph-l">
          <div className="k">Enquiries</div>
          <h2>Bookings</h2>
          <div className="sub">Enquiries submitted through the trek booking forms.</div>
        </div>
      </div>

      <section className="kpis">
        <div className="kpi">
          <div className="top">
            <span className="lab">Total</span>
            <span className="ic">◆</span>
          </div>
          <div className="val">{bookings.length}</div>
        </div>
        <div className={`kpi${pending > 0 ? " o" : ""}`}>
          <div className="top">
            <span className="lab">Pending</span>
            <span className="ic">⌚</span>
          </div>
          <div className="val">{pending}</div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Confirmed</span>
            <span className="ic">◎</span>
          </div>
          <div className="val">{confirmed}</div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Cancelled</span>
            <span className="ic">✕</span>
          </div>
          <div className="val">{cancelled}</div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>All bookings</h3>
        </div>
        {bookings.length === 0 ? (
          <div className="adm-empty">No booking enquiries yet.</div>
        ) : (
          <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Trek</th>
                <th className="right">Group</th>
                <th>Preferred date</th>
                <th>Received</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="cell-cust">
                      <span className={`av-sm ${avTone(b.name)}`}>{initials(b.name)}</span>
                      <div>
                        <div className="strong">{b.name}</div>
                        <div className="sub mono">{b.email}</div>
                        {b.phone && <div className="sub mono">{b.phone}</div>}
                      </div>
                    </div>
                    {b.message && (
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--muted)",
                          marginTop: 8,
                          whiteSpace: "normal",
                          maxWidth: 320,
                        }}
                      >
                        “{b.message}”
                      </div>
                    )}
                  </td>
                  <td>{b.trekName}</td>
                  <td className="right price">{b.people}</td>
                  <td className="mono" style={{ fontSize: "12.5px" }}>
                    {b.date || "—"}
                  </td>
                  <td className="mono" style={{ fontSize: "12.5px" }}>
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => onStatus(b, e.target.value)}
                      className={`st ${STATUS_TONE[b.status] ?? "warn"}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="row-acts">
                      <a className="row-btn" href={`mailto:${b.email}`}>
                        Email
                      </a>
                      <button className="row-btn danger" onClick={() => onDelete(b)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>
    </>
  );
}

/* ---------------- messages view ---------------- */

function MessagesView({
  inquiries,
  onStatus,
  onDelete,
}: {
  inquiries: InquiryRow[];
  onStatus: (i: InquiryRow, status: string) => void;
  onDelete: (i: InquiryRow) => void;
}) {
  const fresh = inquiries.filter((i) => i.status === "new").length;
  const replied = inquiries.filter((i) => i.status === "replied").length;
  const archived = inquiries.filter((i) => i.status === "archived").length;

  return (
    <>
      <div className="page-head">
        <div className="ph-l">
          <div className="k">Inbox</div>
          <h2>Messages</h2>
          <div className="sub">Enquiries submitted through the Contact Us page.</div>
        </div>
      </div>

      <section className="kpis">
        <div className="kpi">
          <div className="top">
            <span className="lab">Total</span>
            <span className="ic">✉</span>
          </div>
          <div className="val">{inquiries.length}</div>
        </div>
        <div className={`kpi${fresh > 0 ? " o" : ""}`}>
          <div className="top">
            <span className="lab">New</span>
            <span className="ic">●</span>
          </div>
          <div className="val">{fresh}</div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Replied</span>
            <span className="ic">◎</span>
          </div>
          <div className="val">{replied}</div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Archived</span>
            <span className="ic">✕</span>
          </div>
          <div className="val">{archived}</div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>All messages</h3>
        </div>
        {inquiries.length === 0 ? (
          <div className="adm-empty">No messages from the contact page yet.</div>
        ) : (
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <div className="cell-cust">
                        <span className={`av-sm ${avTone(i.name)}`}>{initials(i.name)}</span>
                        <div>
                          <div className="strong">{i.name}</div>
                          <div className="sub mono">{i.email}</div>
                          {i.phone && <div className="sub mono">{i.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {i.subject && <div className="strong">{i.subject}</div>}
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--muted)",
                          marginTop: i.subject ? 4 : 0,
                          whiteSpace: "normal",
                          maxWidth: 360,
                        }}
                      >
                        “{i.message}”
                      </div>
                    </td>
                    <td className="mono" style={{ fontSize: "12.5px" }}>
                      {new Date(i.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        value={i.status}
                        onChange={(e) => onStatus(i, e.target.value)}
                        className={`st ${INQUIRY_STATUS_TONE[i.status] ?? "warn"}`}
                      >
                        <option value="new">New</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td>
                      <div className="row-acts">
                        <a
                          className="row-btn"
                          href={`mailto:${i.email}${
                            i.subject ? `?subject=${encodeURIComponent("Re: " + i.subject)}` : ""
                          }`}
                        >
                          Reply
                        </a>
                        <button className="row-btn danger" onClick={() => onDelete(i)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

/* ---------------- blog view ---------------- */

function BlogView({
  posts,
  editing,
  setEditing,
  onSaved,
  onDelete,
  onSeed,
  seeding,
}: {
  posts: Post[];
  editing: Post | "new" | null;
  setEditing: (v: Post | "new" | null) => void;
  onSaved: (p: Post) => void;
  onDelete: (p: Post) => void;
  onSeed: () => void;
  seeding: boolean;
}) {
  if (editing) {
    return (
      <>
        <div className="page-head">
          <div className="ph-l">
            <div className="k">{editing === "new" ? "Journal" : "Edit"}</div>
            <h2>{editing === "new" ? "New post" : "Edit post"}</h2>
            <div className="sub">
              {editing === "new"
                ? "Write a new article for the journal."
                : editing.title}
            </div>
          </div>
          <div className="page-actions">
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>
              ← Back to list
            </button>
          </div>
        </div>
        <PostForm
          initial={editing === "new" ? null : editing}
          onSaved={onSaved}
          onCancel={() => setEditing(null)}
        />
      </>
    );
  }

  const published = posts.filter((p) => p.published).length;
  const featured = posts.filter((p) => p.featured).length;

  return (
    <>
      <div className="page-head">
        <div className="ph-l">
          <div className="k">Journal</div>
          <h2>Blog posts</h2>
          <div className="sub">Write, edit and publish the articles shown on the journal.</div>
        </div>
        <div className="page-actions">
          {posts.length === 0 && (
            <button className="btn btn-ghost" onClick={onSeed} disabled={seeding}>
              {seeding ? "Seeding…" : "Seed sample posts"}
            </button>
          )}
          <button className="btn btn-lime" onClick={() => setEditing("new")}>
            + New post
          </button>
        </div>
      </div>

      <section className="kpis">
        <div className="kpi">
          <div className="top">
            <span className="lab">Total posts</span>
            <span className="ic">✎</span>
          </div>
          <div className="val">{posts.length}</div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Published</span>
            <span className="ic">◎</span>
          </div>
          <div className="val">{published}</div>
        </div>
        <div className="kpi">
          <div className="top">
            <span className="lab">Drafts</span>
            <span className="ic">◇</span>
          </div>
          <div className="val">{posts.length - published}</div>
        </div>
        <div className="kpi o">
          <div className="top">
            <span className="lab">Featured</span>
            <span className="ic">★</span>
          </div>
          <div className="val">{featured}</div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>All posts</h3>
        </div>
        {posts.length === 0 ? (
          <div className="adm-empty">
            No posts yet. Click “Seed sample posts” to import a few starter articles, or “New
            post” to start fresh.
          </div>
        ) : (
          <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th></th>
                <th>Post</th>
                <th>Category</th>
                <th>Published</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td style={{ width: "1%" }}>
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt="" className="thumb" />
                    ) : (
                      <div className="thumb empty">✎</div>
                    )}
                  </td>
                  <td>
                    <div className="strong">{p.title}</div>
                    <div className="sub mono">/blog/{p.slug}</div>
                  </td>
                  <td>{POST_CATEGORY_LABEL[p.category] || p.category}</td>
                  <td className="mono" style={{ fontSize: "12.5px" }}>
                    {formatPostDate(p.publishedAt)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span className={`st ${p.published ? "ok" : "done"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                      {p.featured && <span className="st warn">Featured</span>}
                    </div>
                  </td>
                  <td>
                    <div className="row-acts">
                      <a
                        className="row-btn"
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                      <button className="row-btn" onClick={() => setEditing(p)}>
                        Edit
                      </button>
                      <button className="row-btn danger" onClick={() => onDelete(p)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>
    </>
  );
}
