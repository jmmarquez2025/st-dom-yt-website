import { T } from "../constants/theme";

/**
 * Presentational form helpers for the Mass Intention request form.
 * Stateless — they take values/handlers from the parent form.
 */

/** Radio group styled to match the editorial floating-label form chrome. */
export function RadioGroup({ legend, name, value, onChange, options }) {
  return (
    <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
      <legend
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.5,
          fontVariantCaps: "all-small-caps",
          color: T.warmGray,
          marginBottom: 10,
        }}
      >
        {legend}
      </legend>
      <div style={{ display: "grid", gap: 8 }}>
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                border: `1.5px solid ${checked ? T.burgundy : T.stone}`,
                borderRadius: "var(--radius-control)",
                background: checked ? "rgba(107,29,42,0.04)" : "#fff",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
                fontSize: 15,
                color: T.softBlack,
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                style={{ accentColor: T.burgundy, width: 18, height: 18 }}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Small uppercase section heading used between field groups. */
export function GroupHeading({ children }) {
  return (
    <h3
      style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        color: T.burgundy,
        margin: "8px 0 2px",
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      {children}
    </h3>
  );
}

/** Shared white card chrome for the form and success panels. */
export const cardStyle = {
  background: "#fff",
  borderRadius: "var(--radius-card)",
  padding: "40px 36px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.05)",
  border: "1px solid rgba(232,226,216,0.6)",
};
