import { useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { T } from "../../constants/theme";
import { INPUT, TEXTAREA, LABEL, LANG_CHIP, SANS } from "./styles";

/** Auto-growing textarea for `rich` fields. */
function AutoTextarea(props) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [props.value]);
  return <textarea ref={ref} {...props} />;
}

// list fields store a string[]; the editor presents one item per line.
const toText = (v) => (Array.isArray(v) ? v.join("\n") : v ?? "");

/** One language column inside a field (the EN or ES half). */
function LangInput({ lang, type, value, placeholder, onChange }) {
  const isList = type === "list";
  const common = {
    value: toText(value),
    placeholder: toText(placeholder),
    onChange: (e) => onChange(isList ? e.target.value.split("\n") : e.target.value),
    "aria-label": `${lang.toUpperCase()} value`,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={LANG_CHIP}>
        {lang}
        {isList ? " · one item per line" : ""}
      </span>
      {type === "rich" || isList ? (
        <AutoTextarea {...common} rows={isList ? 4 : 3} style={TEXTAREA} />
      ) : (
        <input type="text" {...common} style={INPUT} />
      )}
    </div>
  );
}

/**
 * A single editable field, English + Spanish side by side. The visible value
 * is the effective copy (override if set, else the shipped default), so the
 * editor reads the real words. When the Spanish half is blank it shows the
 * English value as a greyed placeholder to make a translation gap obvious.
 */
export default function PageField({ field, en, es, enDefault, esDefault, overridden, onChange, onReset }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <label style={{ ...LABEL, marginBottom: 8 }}>{field.label}</label>
        {overridden && (
          <button
            type="button"
            onClick={onReset}
            title="Reset to the original site text"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              color: T.warmGray,
              fontSize: 12,
              fontFamily: SANS,
              cursor: "pointer",
              padding: "2px 4px",
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
        }}
      >
        <LangInput
          lang="en"
          type={field.type}
          value={en}
          placeholder={enDefault}
          onChange={(v) => onChange("en", v)}
        />
        <LangInput
          lang="es"
          type={field.type}
          value={es}
          placeholder={es === "" && en ? `${en}  ·  falls back to English` : esDefault}
          onChange={(v) => onChange("es", v)}
        />
      </div>
    </div>
  );
}
