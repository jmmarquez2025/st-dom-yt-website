import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUp, ArrowDown, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { T } from "../constants/theme";
import { NAV_TOP_KEYS } from "../components/navItems";
import { getNavLayout, setNavLayout } from "./navLayout";
import { notifyI18nChange } from "./applyOverrides";
import { SERIF, SANS, primaryBtn } from "./fields/styles";

/**
 * Reorder and show/hide the top-level navigation menu items. Routes are fixed
 * in code; this only changes which top-level entries appear and in what order.
 */
export default function NavLayoutEditor({ onToast }) {
  const { t } = useTranslation();
  const [order, setOrder] = useState(() => {
    const saved = getNavLayout().order;
    // Start from the saved order, then append any new keys not yet listed.
    const merged = saved.filter((k) => NAV_TOP_KEYS.includes(k));
    for (const k of NAV_TOP_KEYS) if (!merged.includes(k)) merged.push(k);
    return merged;
  });
  const [hidden, setHidden] = useState(() => new Set(getNavLayout().hidden));
  const [dirty, setDirty] = useState(false);

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setDirty(true);
  };

  const toggle = (key) => {
    const next = new Set(hidden);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setHidden(next);
    setDirty(true);
  };

  const save = () => {
    setNavLayout(order, Array.from(hidden));
    notifyI18nChange();
    setDirty(false);
    onToast?.({ message: "Menu order saved", type: "success" });
  };

  return (
    <div style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: "var(--radius-card)", padding: 24, marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: T.softBlack, margin: 0 }}>
          Menu order &amp; visibility
        </h3>
        <button onClick={save} disabled={!dirty} style={primaryBtn(dirty)}>
          <Save size={15} /> Save order
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {order.map((key, i) => {
          const isHidden = hidden.has(key);
          return (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: i < order.length - 1 ? `1px solid ${T.stone}` : "none",
                opacity: isHidden ? 0.5 : 1,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" style={{ background: "none", border: "none", padding: 1, cursor: i === 0 ? "default" : "pointer", color: i === 0 ? T.stoneLight : T.warmGray }}>
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label="Move down" style={{ background: "none", border: "none", padding: 1, cursor: i === order.length - 1 ? "default" : "pointer", color: i === order.length - 1 ? T.stoneLight : T.warmGray }}>
                  <ArrowDown size={14} />
                </button>
              </div>
              <span style={{ flex: 1, fontFamily: SANS, fontSize: 15, color: T.charcoal }}>
                {t(`nav.${key}`)}
              </span>
              <button
                onClick={() => toggle(key)}
                title={isHidden ? "Hidden — click to show" : "Visible — click to hide"}
                style={{ background: "none", border: "none", cursor: "pointer", color: isHidden ? T.warmGray : "#2E7D32", padding: 4 }}
              >
                {isHidden ? <ToggleLeft size={22} /> : <ToggleRight size={22} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
