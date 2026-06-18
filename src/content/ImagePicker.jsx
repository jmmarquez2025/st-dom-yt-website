import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { T } from "../constants/theme";
import { LIBRARY } from "./images";
import { INPUT, LABEL, SERIF, SANS, primaryBtn } from "./fields/styles";

/**
 * Modal image picker: choose from the existing site photo library (keeps the
 * responsive webp pipeline intact) or paste an external URL (loads, but
 * un-optimised). Calls onPick(path) with the chosen value.
 */
export default function ImagePicker({ onPick, onClose }) {
  const [tab, setTab] = useState("library");
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState(null);

  const tabBtn = (key, text) => (
    <button
      onClick={() => setTab(key)}
      style={{
        padding: "8px 4px",
        marginRight: 20,
        background: "none",
        border: "none",
        borderBottom: `2px solid ${tab === key ? T.burgundy : "transparent"}`,
        color: tab === key ? T.burgundy : T.warmGray,
        fontWeight: tab === key ? 600 : 400,
        fontFamily: SANS,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,23,20,0.55)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.warmWhite,
          borderRadius: "var(--radius-modal)",
          width: "min(820px, 100%)",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 12px 48px rgba(0,0,0,0.24)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: `1px solid ${T.stone}`,
          }}
        >
          <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: T.softBlack, margin: 0 }}>
            Choose an image
          </h3>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: T.warmGray }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "12px 24px 0", borderBottom: `1px solid ${T.stone}` }}>
          {tabBtn("library", "Photo library")}
          {tabBtn("url", "Paste a URL")}
        </div>

        <div style={{ padding: 24, overflowY: "auto" }}>
          {tab === "library" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 14,
              }}
            >
              {LIBRARY.map((img) => {
                const isSel = selected === img.src;
                return (
                  <button
                    key={img.slot}
                    onClick={() => setSelected(img.src)}
                    title={img.label}
                    style={{
                      position: "relative",
                      padding: 0,
                      border: `2px solid ${isSel ? T.burgundy : T.stone}`,
                      borderRadius: "var(--radius-card)",
                      overflow: "hidden",
                      cursor: "pointer",
                      background: "#fff",
                      aspectRatio: "16 / 10",
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    {isSel && (
                      <span
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          background: T.burgundy,
                          color: "#fff",
                          borderRadius: "50%",
                          width: 22,
                          height: 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <label style={LABEL}>Image URL</label>
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setSelected(e.target.value.trim() || null);
                }}
                placeholder="https://…/photo.jpg"
                style={INPUT}
              />
              <p style={{ fontSize: 13, color: T.warmGray, fontFamily: SANS, marginTop: 10 }}>
                External images aren’t size-optimised and may load slower.
              </p>
              {url.trim() && (
                <img
                  src={url.trim()}
                  alt="Preview"
                  style={{ marginTop: 14, maxWidth: "100%", maxHeight: 200, borderRadius: "var(--radius-card)", border: `1px solid ${T.stone}` }}
                />
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: "16px 24px", borderTop: `1px solid ${T.stone}` }}>
          <button
            onClick={onClose}
            style={{ padding: "10px 18px", background: "none", border: `1px solid ${T.stone}`, borderRadius: "var(--radius-card)", color: T.charcoal, fontFamily: SANS, fontSize: 14, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={() => selected && onPick(selected)}
            style={primaryBtn(!!selected)}
          >
            Use this image
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
