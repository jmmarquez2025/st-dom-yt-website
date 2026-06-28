/**
 * Presentation helpers shared by the Mass Intentions dashboard components.
 * Pure — no i18n, no side effects (label text is resolved in the components).
 */
import { T } from "../constants/theme";

export const STATUS_COLORS = {
  pending: { bg: "#f3f4f6", color: "#6b7280" },
  approved: { bg: T.chipGoldBg, color: T.goldText },
  scheduled: { bg: "#e8f0fe", color: "#1a56db" },
  fulfilled: { bg: "#e6f9ee", color: "#1a7d42" },
  transferred: { bg: "#f3e8ff", color: "#6b21a8" },
  rejected: { bg: "#fef2f2", color: "#b91c1c" },
  archived: { bg: "#f3f4f6", color: "#6b7280" },
};

export function statusStyle(status) {
  return STATUS_COLORS[status] || STATUS_COLORS.pending;
}

/** Format a YYYY-MM-DD date or a full ISO timestamp as e.g. "Jul 12, 2026". */
export function formatDate(d) {
  if (!d) return "—";
  const iso = d.length === 10 ? `${d}T00:00:00` : d;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
