import { useState } from "react";
import { Save, AlertTriangle } from "lucide-react";
import { T } from "../constants/theme";
import { BRAND_TOKENS, originalColor, getBranding, setBranding, resetBranding, contrastRatio, getSiteNames, setSiteNames } from "./branding";
import { notifyI18nChange } from "./applyOverrides";
import { SERIF, SANS, INPUT, LABEL, primaryBtn } from "./fields/styles";

const isHex = (v) => /^#([0-9a-f]{6})$/i.test(v);

export default function BrandingDashboard({ onToast }) {
  const [colors, setColors] = useState(() => {
    const ov = getBranding().colors;
    const init = {};
    for (const tk of BRAND_TOKENS) init[tk.key] = ov[tk.key] || originalColor(tk.key);
    return init;
  });
  const [names, setNames] = useState(() => getSiteNames());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dirty, setDirty] = useState(false);

  const set = (key, v) => {
    setColors((c) => ({ ...c, [key]: v }));
    setDirty(true);
  };

  const setName = (k, v) => {
    setNames((n) => ({ ...n, [k]: v }));
    setDirty(true);
  };

  const save = () => {
    // Only persist valid hex values.
    const valid = {};
    for (const tk of BRAND_TOKENS) if (isHex(colors[tk.key])) valid[tk.key] = colors[tk.key];
    setBranding(valid);
    setSiteNames(names);
    notifyI18nChange();
    setDirty(false);
    onToast?.({ message: "Branding saved", type: "success" });
  };

  const resetAll = () => {
    if (!window.confirm("Reset all brand colors to the original palette?")) return;
    resetBranding();
    const init = {};
    for (const tk of BRAND_TOKENS) init[tk.key] = originalColor(tk.key);
    setColors(init);
    notifyI18nChange();
    setDirty(false);
    onToast?.({ message: "Brand colors reset to default", type: "success" });
  };

  const burgundy = isHex(colors.burgundy) ? colors.burgundy : "#6B1D2A";
  const gold = isHex(colors.gold) ? colors.gold : "#C5A55A";
  const btnContrast = contrastRatio(burgundy, "#FFFFFF");
  const aa = btnContrast >= 4.5;

  const Row = ({ tk }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{ flex: 1 }}>
        <label style={{ ...LABEL, marginBottom: 4 }}>{tk.label}</label>
      </div>
      <input
        type="color"
        value={isHex(colors[tk.key]) ? colors[tk.key] : "#000000"}
        onChange={(e) => set(tk.key, e.target.value)}
        aria-label={`${tk.label} swatch`}
        style={{ width: 44, height: 36, border: `1px solid ${T.stone}`, borderRadius: "var(--radius-control)", background: "#fff", cursor: "pointer", padding: 2 }}
      />
      <input
        value={colors[tk.key] || ""}
        onChange={(e) => set(tk.key, e.target.value)}
        spellCheck={false}
        style={{ ...INPUT, width: 120, fontFamily: "monospace" }}
      />
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>Branding</h2>
          <p style={{ fontFamily: SANS, fontSize: 14, color: T.warmGray, margin: "4px 0 0", maxWidth: 680 }}>
            The site’s brand colors. Spacing, fonts, and corner styles are locked to keep the layout consistent.
          </p>
        </div>
        <button onClick={save} disabled={!dirty} style={primaryBtn(dirty)}>
          <Save size={16} /> Save changes
        </button>
      </div>

      {/* Site name */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 28 }}>
        <div>
          <label style={LABEL}>Church name (footer)</label>
          <input value={names.full} onChange={(e) => setName("full", e.target.value)} placeholder="St. Dominic Catholic Church" style={INPUT} />
        </div>
        <div>
          <label style={LABEL}>Short name (header logo)</label>
          <input value={names.nav} onChange={(e) => setName("nav", e.target.value)} placeholder="St. Dominic" style={INPUT} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 1fr) minmax(260px, 1fr)", gap: 32, alignItems: "start" }}>
        {/* Controls */}
        <div>
          {BRAND_TOKENS.filter((t) => !t.advanced).map((tk) => <Row key={tk.key} tk={tk} />)}

          <button
            onClick={() => setShowAdvanced((s) => !s)}
            style={{ background: "none", border: "none", color: T.burgundy, fontFamily: SANS, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "6px 0", marginBottom: 8 }}
          >
            {showAdvanced ? "Hide" : "Show"} advanced colors
          </button>
          {showAdvanced && BRAND_TOKENS.filter((t) => t.advanced).map((tk) => <Row key={tk.key} tk={tk} />)}

          {/* Contrast meter */}
          <div style={{ marginTop: 14, fontFamily: SANS, fontSize: 13, color: T.warmGray }}>
            Button text contrast:{" "}
            <strong style={{ color: aa ? "#2E7D32" : T.error }}>
              {btnContrast.toFixed(1)}:1 {aa ? "· AA ✓" : "· Low — may be hard to read"}
            </strong>
          </div>

          <button onClick={resetAll} style={{ marginTop: 16, background: "none", border: "none", color: T.warmGray, fontFamily: SANS, fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
            Reset all colors to the original palette
          </button>
        </div>

        {/* Live preview */}
        <div style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: "var(--radius-card)", padding: 24 }}>
          <div style={{ textTransform: "uppercase", letterSpacing: 1.5, fontSize: 12, fontWeight: 600, color: gold, fontFamily: SANS, marginBottom: 8 }}>
            Preview
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: burgundy, margin: "0 0 8px" }}>
            St. Dominic Catholic Church
          </h3>
          <p style={{ fontFamily: SANS, fontSize: 14, color: T.charcoal, lineHeight: 1.6, margin: "0 0 16px" }}>
            A sample of headings, accents, and a button in your chosen colors.
          </p>
          <span style={{ display: "inline-block", padding: "4px 11px", borderRadius: "var(--radius-control)", background: `${gold}22`, color: T.charcoal, fontSize: 12, fontFamily: SANS, marginBottom: 16 }}>
            Sample chip
          </span>
          <div>
            <button style={{ padding: "10px 20px", background: burgundy, color: "#fff", border: "none", borderRadius: "var(--radius-control)", fontFamily: SANS, fontSize: 14, fontWeight: 600 }}>
              Plan Your Visit
            </button>
          </div>
        </div>
      </div>

      {/* Build-time caveat */}
      <div style={{ marginTop: 28, display: "flex", gap: 10, background: `${T.gold}14`, border: `1px solid ${T.gold}55`, borderRadius: "var(--radius-card)", padding: "14px 18px", maxWidth: 760 }}>
        <AlertTriangle size={18} color={T.goldText} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: SANS, fontSize: 13, color: T.charcoal, lineHeight: 1.6, margin: 0 }}>
          A color change updates the live site immediately, but a few items are fixed at build time
          and won’t change until the site is rebuilt: the browser-tab icon (favicon), the phone
          app/PWA theme color, and the image shown when a page is shared on social media.
        </p>
      </div>
    </div>
  );
}
