"use client";

import { useRef, useState } from "react";

export default function ImageUploader({
  value,
  onChange,
  label = "Cover image",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "Upload failed");
        return;
      }
      onChange(json.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="field full">
      <label>{label}</label>
      <div className="uploader">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="uploader-preview" />
        ) : (
          <div className="uploader-preview empty">No image</div>
        )}
        <div className="uploader-btns">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          {value && (
            <button
              type="button"
              className="icon-btn danger"
              onClick={() => onChange(null)}
              disabled={uploading}
            >
              Remove
            </button>
          )}
          {error && <span className="form-msg err">{error}</span>}
        </div>
      </div>
    </div>
  );
}
