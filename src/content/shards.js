/**
 * Content shard keys — derived from the page registry so the key list and the
 * registry can never drift apart. These are spread into MANAGED_KEYS
 * (src/admin/dataManager.js) and mirrored server-side in cms/admin-cms.gs, so
 * they ride the existing localStorage ↔ Google-Sheet sync for free.
 *
 * Each shard holds one page's bilingual overrides as a single JSON cell:
 *   { v: 1, updatedAt, en: { "<dotted i18n key>": "…" }, es: { … } }
 * Sharding per page keeps every cell well under the ~50,000-char Google Sheets
 * cell limit (the largest measured page shard is ~24k combined EN+ES).
 */

import { PAGES, CHROME } from "./registry";

export const CONTENT_SHARD_KEYS = [...PAGES, ...CHROME].map((p) => p.shardKey);

/** True when `key` is one of the per-page content shard keys. */
export function isContentShardKey(key) {
  return CONTENT_SHARD_KEYS.includes(key);
}
