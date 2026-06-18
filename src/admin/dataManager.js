/**
 * Admin Data Manager
 *
 * Export/import utilities for every admin-managed localStorage key.
 * Lets non-technical admins back up their work or move it between
 * browsers and devices with a single JSON file.
 */

import { CONTENT_SHARD_KEYS } from "../content/shards";

export const MANAGED_KEYS = [
  // Operational data sections
  "stdom_announcements",
  "stdom_bulletin_current_url",
  "stdom_bulletin_archive",
  "stdom_events",
  "stdom_schedule",
  "stdom_staff_directory",
  "stdom_ministries",
  "stdom_settings",
  // Per-page editable content (one shard per page — see src/content/shards.js).
  // Adding these here is all the sync layer (adminSync.js) needs: push,
  // auto-sync interception, pull hydration, and export/import all loop this list.
  ...CONTENT_SHARD_KEYS,
  // Per-page image swaps ({ slot: path }), per-page SEO, global branding, and
  // the navigation menu order/visibility.
  "stdom_images",
  "stdom_seo",
  "stdom_branding",
  "stdom_nav_layout",
];

// v2: backups now include the per-page content shards, not just the original
// 8 operational sections.
const EXPORT_VERSION = 2;

/**
 * Collect every admin key from localStorage into a single object.
 * Keys absent from storage are omitted.
 */
export function collect() {
  const payload = {};
  MANAGED_KEYS.forEach((k) => {
    const raw = localStorage.getItem(k);
    if (raw !== null) payload[k] = raw;
  });
  return payload;
}

/**
 * Download the current admin data as a timestamped JSON file.
 * Returns { count } — number of keys exported.
 */
export function exportAll() {
  const data = collect();
  const envelope = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    site: "st-dominic",
    data,
  };
  const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `stdom-admin-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return { count: Object.keys(data).length };
}

/**
 * Parse a backup file and write its contents into localStorage.
 * Strategy: "replace" wipes each managed key and restores from the file;
 * "merge" only writes keys that are present in the file, leaving others untouched.
 *
 * Throws on malformed input.
 */
export async function importFromFile(file, strategy = "replace") {
  const text = await file.text();
  let envelope;
  try {
    envelope = JSON.parse(text);
  } catch {
    throw new Error("File is not valid JSON.");
  }

  if (!envelope || typeof envelope !== "object" || !envelope.data) {
    throw new Error("File does not look like a St. Dominic admin backup.");
  }

  const incoming = envelope.data;
  const keys = Object.keys(incoming).filter((k) => MANAGED_KEYS.includes(k));
  if (keys.length === 0) {
    throw new Error("Backup contains no recognized admin data.");
  }

  // Write everything with the per-key auto-sync interceptor suppressed, then
  // push the touched keys in a single batch — a restore shouldn't fire one
  // POST per key (see runWithoutAutoSync in cms/adminSync.js).
  const { runWithoutAutoSync } = await import("../cms/adminSync");
  runWithoutAutoSync(
    () => {
      if (strategy === "replace") {
        MANAGED_KEYS.forEach((k) => localStorage.removeItem(k));
      }
      keys.forEach((k) => {
        localStorage.setItem(k, incoming[k]);
      });
    },
    keys
  );

  return { count: keys.length, exportedAt: envelope.exportedAt || null };
}

/**
 * Wipe every managed key. Used for "start over" resets.
 */
export function clearAll() {
  MANAGED_KEYS.forEach((k) => localStorage.removeItem(k));
}

/**
 * Count how many managed keys currently have data.
 */
export function countPopulated() {
  return MANAGED_KEYS.filter((k) => localStorage.getItem(k) !== null).length;
}
