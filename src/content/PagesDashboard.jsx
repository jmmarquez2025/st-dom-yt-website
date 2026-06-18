import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { T } from "../constants/theme";
import Icon from "../components/Icon";
import { PAGES } from "./registry";
import { makeContentStore } from "./store";
import PageEditor from "./PageEditor";
import { SANS, SERIF, INPUT } from "./fields/styles";

/** Re-renders when the viewport crosses a width threshold. */
function useNarrow(maxWidth = 860) {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(`(max-width:${maxWidth}px)`).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${maxWidth}px)`);
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [maxWidth]);
  return narrow;
}

/** A single page row in the left rail. */
function PageRow({ page, active, onClick }) {
  const overridden = useMemo(() => makeContentStore(page.shardKey).hasAny(), [page.shardKey]);
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        textAlign: "left",
        padding: "11px 14px",
        background: active ? T.stoneLight : "transparent",
        border: "none",
        borderLeft: `2px solid ${active ? T.burgundy : "transparent"}`,
        color: active ? T.softBlack : T.charcoal,
        fontFamily: SANS,
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        borderBottom: `1px solid ${T.stone}`,
      }}
    >
      <Icon name={page.icon} size={16} color={active ? T.burgundy : T.warmGray} />
      <span style={{ flex: 1 }}>{page.label}</span>
      <span
        title={overridden ? "Has custom text" : "Showing the original site text"}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: overridden ? T.gold : "transparent",
          border: overridden ? "none" : `1.5px solid ${T.stone}`,
        }}
      />
    </button>
  );
}

/**
 * Master-detail editor for every content page. Left rail lists the pages
 * (searchable, with a status dot for "has custom text"); the right pane is the
 * per-page bilingual editor. On narrow screens it collapses to a single pane.
 */
export default function PagesDashboard({ onToast }) {
  const narrow = useNarrow();
  const [selectedId, setSelectedId] = useState(narrow ? null : PAGES[0]?.id || null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? PAGES.filter((p) => p.label.toLowerCase().includes(q)) : PAGES;
  }, [query]);

  const selected = PAGES.find((p) => p.id === selectedId) || null;

  const rail = (
    <div
      style={{
        width: narrow ? "100%" : 260,
        flexShrink: 0,
        background: "#fff",
        border: `1px solid ${T.stone}`,
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        alignSelf: "flex-start",
      }}
    >
      <div style={{ padding: 12, borderBottom: `1px solid ${T.stone}` }}>
        <div style={{ position: "relative" }}>
          <Search
            size={15}
            color={T.warmGray}
            style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages…"
            aria-label="Search pages"
            style={{ ...INPUT, padding: "8px 12px 8px 32px" }}
          />
        </div>
      </div>
      <div style={{ maxHeight: narrow ? "none" : "62vh", overflowY: "auto" }}>
        {filtered.map((p) => (
          <PageRow
            key={p.id}
            page={p}
            active={p.id === selectedId}
            onClick={() => setSelectedId(p.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p style={{ padding: 16, color: T.warmGray, fontFamily: SANS, fontSize: 13, margin: 0 }}>
            No pages match “{query}”.
          </p>
        )}
      </div>
    </div>
  );

  const editorPane = selected ? (
    <div style={{ flex: 1, minWidth: 0 }}>
      <PageEditor
        key={selected.id}
        page={selected}
        onToast={onToast}
        onBack={narrow ? () => setSelectedId(null) : undefined}
      />
    </div>
  ) : (
    <div style={{ flex: 1, minWidth: 0, padding: "40px 0", color: T.warmGray, fontFamily: SANS }}>
      Select a page to edit its text.
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>
          Pages
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 14, color: T.warmGray, margin: "4px 0 0" }}>
          Edit the words on each public page, in English and Spanish. Blank a field’s Reset to
          restore the original site text.
        </p>
      </div>

      {narrow ? (
        selected ? editorPane : rail
      ) : (
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          {rail}
          {editorPane}
        </div>
      )}
    </div>
  );
}
