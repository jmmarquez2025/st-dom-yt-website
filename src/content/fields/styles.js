/**
 * Shared style primitives for the content editors. Promoted from the existing
 * EventComposer / SettingsDashboard objects so every new field shares one
 * source — and reconciled to the crisp radius scale (var(--radius-card)=4px)
 * instead of the ad-hoc 8/10px those older files used.
 */
import { T } from "../../constants/theme";

export const SANS = "'Source Sans 3', sans-serif";
export const SERIF = "'Cormorant Garamond', serif";

export const INPUT = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: SANS,
  border: `1.5px solid ${T.stone}`,
  borderRadius: "var(--radius-card)",
  outline: "none",
  background: "#fff",
  color: T.charcoal,
  boxSizing: "border-box",
};

export const TEXTAREA = {
  ...INPUT,
  lineHeight: 1.55,
  resize: "vertical",
  minHeight: 84,
};

export const LABEL = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: T.warmGray,
  marginBottom: 6,
  fontFamily: SANS,
};

export const CARD = {
  background: "#fff",
  border: `1px solid ${T.stone}`,
  borderRadius: "var(--radius-card)",
  padding: 24,
};

/** Quiet inline EN/ES marker that sits beside a field input. */
export const LANG_CHIP = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: T.warmGray,
  fontFamily: SANS,
};

/** Burgundy primary button; pass dirty=false to get the muted disabled look. */
export function primaryBtn(dirty = true) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 20px",
    background: dirty ? T.burgundy : T.stone,
    color: dirty ? "#fff" : T.warmGray,
    border: "none",
    borderRadius: "var(--radius-card)",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: SANS,
    cursor: dirty ? "pointer" : "default",
  };
}
