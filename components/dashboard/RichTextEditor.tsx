"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight rich-text editor built on contentEditable + execCommand.
 * Zero dependencies (no editor bundle shipped) and emits semantic HTML that
 * the public blog renders directly. The editor is uncontrolled — we seed the
 * DOM once from `value` and report changes up via onChange, so the caret never
 * jumps on re-render.
 */

type Cmd = { label: string; title: string; run: (e: Editor) => void; isHeading?: string };

interface Editor {
  exec: (command: string, value?: string) => void;
  insertHtml: (html: string) => void;
}

const TOOLBAR: Cmd[] = [
  { label: "B", title: "Bold", run: (e) => e.exec("bold") },
  { label: "I", title: "Italic", run: (e) => e.exec("italic") },
  { label: "U", title: "Underline", run: (e) => e.exec("underline") },
  { label: "H2", title: "Heading", run: (e) => e.exec("formatBlock", "h2"), isHeading: "h2" },
  { label: "H3", title: "Subheading", run: (e) => e.exec("formatBlock", "h3"), isHeading: "h3" },
  { label: "¶", title: "Paragraph", run: (e) => e.exec("formatBlock", "p") },
  { label: "“ ”", title: "Quote", run: (e) => e.exec("formatBlock", "blockquote") },
  { label: "• List", title: "Bullet list", run: (e) => e.exec("insertUnorderedList") },
  { label: "1. List", title: "Numbered list", run: (e) => e.exec("insertOrderedList") },
  { label: "⎯", title: "Divider", run: (e) => e.insertHtml("<hr>") },
  { label: "✕ Clear", title: "Clear formatting", run: (e) => e.exec("removeFormat") },
];

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Seed the editor DOM once on mount (and when switching to a different post).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editor: Editor = {
    exec(command, val) {
      ref.current?.focus();
      document.execCommand(command, false, val);
      emit();
    },
    insertHtml(html) {
      ref.current?.focus();
      document.execCommand("insertHTML", false, html);
      emit();
    },
  };

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function addLink() {
    const url = window.prompt("Link URL (https://…)");
    if (!url) return;
    const safe = /^(https?:|mailto:|\/)/i.test(url) ? url : `https://${url}`;
    editor.exec("createLink", safe);
  }

  async function insertImage(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) {
        setError(json?.error || "Image upload failed");
        return;
      }
      editor.insertHtml(
        `<figure><img src="${json.url}" alt="" loading="lazy" /></figure><p><br></p>`
      );
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rte">
      <div className="rte-toolbar">
        {TOOLBAR.map((c) => (
          <button
            key={c.title}
            type="button"
            className="rte-btn"
            title={c.title}
            // Keep the editor selection while clicking the toolbar.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => c.run(editor)}
          >
            {c.label}
          </button>
        ))}
        <button
          type="button"
          className="rte-btn"
          title="Insert link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={addLink}
        >
          🔗 Link
        </button>
        <label className="rte-btn" title="Insert image" style={{ cursor: "pointer" }}>
          {uploading ? "Uploading…" : "🖼 Image"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) insertImage(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div
        ref={ref}
        className="rte-area prose"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder="Write your story…"
      />

      {error && <span className="form-msg err" style={{ marginTop: 8 }}>{error}</span>}
    </div>
  );
}
