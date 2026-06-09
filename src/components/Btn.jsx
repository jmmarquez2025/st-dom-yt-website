import { T } from "../constants/theme";

const base = {
  display: "inline-block",
  padding: "14px 32px",
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 1.2,
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
  borderRadius: 2,
  fontFamily: "'Source Sans 3', sans-serif",
  minHeight: 44,
};

const variants = {
  primary: { background: T.burgundy, color: T.cream, ...base },
  outline: {
    background: "transparent",
    color: T.burgundy,
    border: `2px solid ${T.burgundy}`,
    ...base,
  },
  gold: { background: T.gold, color: T.softBlack, ...base },
  light: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    ...base,
    backdropFilter: "blur(4px)",
  },
};

export default function Btn({ children, onClick, variant = "primary", style: s = {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <button
        onClick={onClick}
        className={`btn-hover btn--${variant}`}
        style={{ ...variants[variant], ...s }}
      >
        {children}
      </button>
    </div>
  );
}
