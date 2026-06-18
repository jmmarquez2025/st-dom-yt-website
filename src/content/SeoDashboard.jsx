import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { PAGES } from "./registry";
import { getSeoForPage, setSeoForPage } from "./seo";
import { notifyI18nChange } from "./applyOverrides";
import ImagePicker from "./ImagePicker";
import { INPUT, TEXTAREA, LABEL, SERIF, SANS, primaryBtn } from "./fields/styles";

const SITE = CONFIG.siteUrl.replace(/\/$/, "");

/**
 * Per-page SEO editor: bilingual <title> and meta description plus a share
 * image, with a live search-result preview. Blank fields keep the page's
 * built-in title/description, so editing is opt-in (and finally bilingual).
 */
export default function SeoDashboard({ onToast }) {
  const [pageId, setPageId] = useState(PAGES[0].id);
  const [form, setForm] = useState(() => getSeoForPage(PAGES[0].id));
  const [dirty, setDirty] = useState(false);
  const [picking, setPicking] = useState(false);

  const page = PAGES.find((p) => p.id === pageId);

  useEffect(() => {
    setForm(getSeoForPage(pageId));
    setDirty(false);
  }, [pageId]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  };

  const save = () => {
    setSeoForPage(pageId, form);
    notifyI18nChange();
    setDirty(false);
    onToast?.({ message: `SEO saved for ${page.label}`, type: "success" });
  };

  const previewUrl = `${SITE}${page.route}`.replace(/\/$/, "") || SITE;

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>
          Search &amp; Social (SEO)
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 14, color: T.warmGray, margin: "4px 0 0", maxWidth: 720 }}>
          The title and description search engines and social shares show for each page. Leave a
          field blank to keep the page’s built-in wording.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <label style={{ ...LABEL, marginBottom: 0 }}>Page</label>
        <select value={pageId} onChange={(e) => setPageId(e.target.value)} style={{ ...INPUT, width: "auto", minWidth: 220 }}>
          {PAGES.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        <button onClick={save} disabled={!dirty} style={{ ...primaryBtn(dirty), marginLeft: "auto" }}>
          <Save size={16} /> Save changes
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <div>
          <label style={LABEL}>Title — English</label>
          <input value={form.titleEn || ""} onChange={(e) => set("titleEn", e.target.value)} placeholder="Uses the page’s built-in title" style={INPUT} />
        </div>
        <div>
          <label style={LABEL}>Title — Spanish</label>
          <input value={form.titleEs || ""} onChange={(e) => set("titleEs", e.target.value)} placeholder="Falls back to English" style={INPUT} />
        </div>
        <div>
          <label style={LABEL}>Description — English</label>
          <textarea value={form.descEn || ""} onChange={(e) => set("descEn", e.target.value)} placeholder="Uses the page’s built-in description" rows={3} style={TEXTAREA} />
        </div>
        <div>
          <label style={LABEL}>Description — Spanish</label>
          <textarea value={form.descEs || ""} onChange={(e) => set("descEs", e.target.value)} placeholder="Falls back to English" rows={3} style={TEXTAREA} />
        </div>
      </div>

      {/* Share image */}
      <div style={{ marginTop: 20 }}>
        <label style={LABEL}>Social share image (Open Graph)</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 160, aspectRatio: "16 / 10", borderRadius: "var(--radius-card)", border: `1px solid ${T.stone}`, overflow: "hidden", background: T.stoneLight, flexShrink: 0 }}>
            {form.image && <img src={form.image} alt="Share preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setPicking(true)} style={{ padding: "9px 16px", background: "#fff", border: `1px solid ${T.stone}`, borderRadius: "var(--radius-card)", color: T.charcoal, fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Choose image
            </button>
            {form.image && (
              <button onClick={() => set("image", "")} style={{ background: "none", border: "none", color: T.warmGray, fontFamily: SANS, fontSize: 13, cursor: "pointer" }}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Google snippet preview */}
      <div style={{ marginTop: 28 }}>
        <label style={LABEL}>Search result preview</label>
        <div style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: "var(--radius-card)", padding: "16px 20px", maxWidth: 600 }}>
          <div style={{ color: "#1a0dab", fontSize: 18, fontFamily: "arial, sans-serif", lineHeight: 1.3, marginBottom: 2 }}>
            {(form.titleEn || `${page.label} — built-in title`)} — St. Dominic Catholic Church
          </div>
          <div style={{ color: "#006621", fontSize: 13, fontFamily: "arial, sans-serif", marginBottom: 4 }}>{previewUrl}</div>
          <div style={{ color: "#545454", fontSize: 13.5, fontFamily: "arial, sans-serif", lineHeight: 1.5 }}>
            {form.descEn || "Uses the page’s built-in description until you set one here."}
          </div>
        </div>
      </div>

      {picking && (
        <ImagePicker
          onPick={(path) => { set("image", path); setPicking(false); }}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}
