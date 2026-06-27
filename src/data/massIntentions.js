/**
 * Mass Intentions — shared model, policy, and pure helpers.
 *
 * This module holds everything that BOTH the public request form and the Staff
 * Dashboard need, with no side effects (no network, no storage) so it can be
 * unit-tested directly. The token-gated read/update API lives in
 * src/mass-intentions-admin/store.js.
 *
 * Canon-law note: a Mass intention is a request that a Mass be offered for a
 * person or cause. The "offering" is a voluntary donation (Canon 948), never a
 * price. Every accepted intention should be fulfilled within a year (Canon 953).
 */

import { CONFIG } from "../constants/config";

/* ── Enumerations (labelKey resolves through i18n) ── */
export const INTENTION_TYPES = [
  { value: "deceased", labelKey: "massIntentions.typeDeceased" },
  { value: "living", labelKey: "massIntentions.typeLiving" },
  { value: "thanksgiving", labelKey: "massIntentions.typeThanksgiving" },
  { value: "healing", labelKey: "massIntentions.typeHealing" },
  { value: "special", labelKey: "massIntentions.typeSpecial" },
];

export const ANNOUNCEMENT_PREFS = [
  { value: "public", labelKey: "massIntentions.announcePublic" },
  { value: "private", labelKey: "massIntentions.announcePrivate" },
];

// The Mass the requester would prefer (the office assigns the exact slot).
export const MASS_PREFERENCES = [
  { value: "any", labelKey: "massIntentions.massAny" },
  { value: "weekday", labelKey: "massIntentions.massWeekday" },
  { value: "saturdayVigil", labelKey: "massIntentions.massVigil" },
  { value: "sunday", labelKey: "massIntentions.massSunday" },
  { value: "sundayEspanol", labelKey: "massIntentions.massSundayEspanol" },
];

// Full lifecycle. `transferred` covers Canon 954 reassignment to another priest.
export const STATUSES = [
  "pending",
  "approved",
  "scheduled",
  "fulfilled",
  "transferred",
  "rejected",
  "archived",
];

export const ACTIVE_STATUSES = ["pending", "approved", "scheduled", "transferred"];

// Once fulfilled (or archived/rejected), the record is locked from edits.
export const LOCKED_STATUSES = ["fulfilled", "archived", "rejected"];

/* ── Parish policy — soft defaults the office can tune ── */
export const POLICY = {
  suggestedOffering: CONFIG.massIntentionSuggestedOffering, // display only
  advanceWindowMonths: 12, // how far ahead a date may be requested
  annualLimitPerRequester: 5, // soft cap, flagged not blocked
  fulfillmentDeadlineDays: 365, // Canon 953
};

/* ── Pure helpers ── */

function pad(n) {
  return String(n).padStart(2, "0");
}

function toIsoDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Date-stamped, collision-resistant id, e.g. "2026-06-27-k3p9xq". */
export function generateId() {
  return `${toIsoDate(new Date())}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Canon 953: an accepted intention should be fulfilled within a year.
 * Computed in UTC so the stored deadline is deterministic regardless of the
 * server/browser timezone.
 */
export function computeDeadline(createdAtIso) {
  const base = createdAtIso ? new Date(createdAtIso) : new Date();
  const d = new Date(
    Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate())
  );
  d.setUTCDate(d.getUTCDate() + POLICY.fulfillmentDeadlineDays);
  return d.toISOString().slice(0, 10);
}

export function isLocked(intention) {
  return !!intention && LOCKED_STATUSES.includes(intention.status);
}

/** True when an active intention has passed its fulfillment deadline. */
export function isOverdue(intention, now = new Date()) {
  if (!intention || !intention.fulfillmentDeadline) return false;
  if (LOCKED_STATUSES.includes(intention.status)) return false;
  return intention.fulfillmentDeadline < toIsoDate(now);
}

/** Filter a list by status. Pseudo-statuses: "all", "active", "overdue". */
export function filterByStatus(list, status, now = new Date()) {
  const arr = list || [];
  if (!status || status === "all") return [...arr];
  if (status === "active") return arr.filter((i) => ACTIVE_STATUSES.includes(i.status));
  if (status === "overdue") return arr.filter((i) => isOverdue(i, now));
  return arr.filter((i) => i.status === status);
}

/** Is a requested date inside [today, today + advanceWindowMonths]? */
export function withinAdvanceWindow(dateStr, now = new Date()) {
  if (!dateStr) return true; // "first available" / unspecified is always allowed
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (d < today) return false;
  const max = new Date(today);
  max.setMonth(max.getMonth() + POLICY.advanceWindowMonths);
  return d <= max;
}

/** Count this requester's intentions in the calendar year of `now`. */
export function countForRequesterThisYear(list, email, now = new Date()) {
  if (!email) return 0;
  const yr = now.getFullYear();
  const e = email.trim().toLowerCase();
  return (list || []).filter(
    (i) =>
      (i.requesterEmail || "").trim().toLowerCase() === e &&
      i.createdAt &&
      new Date(i.createdAt).getFullYear() === yr
  ).length;
}

/* ── CSV export (pure) ── */

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function csvRows(rows) {
  return rows.map((r) => r.map(csvCell).join(",")).join("\n");
}

/**
 * Bulletin-ready list: scheduled/fulfilled intentions the requester agreed to
 * announce publicly. Private intentions are deliberately excluded.
 */
export function toBulletinCsv(list) {
  const rows = [["Date", "Time", "For", "Type", "Requested By"]];
  (list || [])
    .filter(
      (i) =>
        i.announcementPreference !== "private" &&
        (i.status === "scheduled" || i.status === "fulfilled")
    )
    .sort((a, b) => (a.assignedDate || "").localeCompare(b.assignedDate || ""))
    .forEach((i) =>
      rows.push([
        i.assignedDate || "",
        i.assignedTime || "",
        i.personName || "",
        i.intentionType || "",
        i.requesterName || "",
      ])
    );
  return csvRows(rows);
}

/** Full canonical register for the bishop's audit (Canon 958). */
export function toAuditCsv(list) {
  const rows = [
    [
      "Acceptance Date",
      "For",
      "Type",
      "Requested By",
      "Email",
      "Offering Received",
      "Assigned Date",
      "Assigned Time",
      "Celebrant",
      "Status",
      "Fulfillment Date",
      "Notes",
    ],
  ];
  (list || []).forEach((i) =>
    rows.push([
      (i.createdAt || "").slice(0, 10),
      i.personName || "",
      i.intentionType || "",
      i.requesterName || "",
      i.requesterEmail || "",
      i.offeringReceived || "",
      i.assignedDate || "",
      i.assignedTime || "",
      i.celebrantName || i.celebrantId || "",
      i.status || "",
      i.fulfillmentDate || "",
      i.internalNotes || i.notes || "",
    ])
  );
  return csvRows(rows);
}
