/**
 * Auto-schema builder
 * ───────────────────
 * Derives an editor field schema straight from a page's i18n namespace, so
 * every page is editable without hand-listing hundreds of keys. A hand-curated
 * schema (e.g. ./home.js) takes precedence when present; everything else falls
 * back here.
 *
 *  - one GROUP per second-level key (about.history.* → "History" group)
 *  - one FIELD per leaf string / string-array
 *  - type inferred: array → "list", long/multiline → "rich", else "text"
 *
 * Reads the bundled en.json (immutable — see src/content/defaults.js), so the
 * keys it emits are guaranteed to exist.
 */

import en from "../../locales/en.json";

/** "ctaVisit" → "Cta Visit", "p1" → "Paragraph 1", "req1.title" → "Req1 Title". */
function humanize(seg) {
  return seg
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .replace(/\bp(\d+)\b/gi, "Paragraph $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferType(value) {
  if (Array.isArray(value)) return "list";
  const s = String(value);
  if (s.includes("\n") || s.length > 90) return "rich";
  return "text";
}

/** Collect every leaf under `obj` as { path, value }, relative to `obj`. */
function leaves(obj, prefix, out) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) leaves(v, path, out);
    else out.push({ path, value: v });
  }
  return out;
}

export function buildSchema(ns) {
  const root = en[ns];
  if (!root || typeof root !== "object") return { groups: [] };

  const groups = [];
  const general = [];

  for (const key of Object.keys(root)) {
    const v = root[key];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const fields = leaves(v, "", []).map(({ path, value }) => ({
        key: `${ns}.${key}.${path}`,
        label: humanize(path.split(".").join(" ")),
        type: inferType(value),
      }));
      groups.push({ title: humanize(key), fields });
    } else {
      general.push({ key: `${ns}.${key}`, label: humanize(key), type: inferType(v) });
    }
  }

  // Loose top-level strings (no sub-object) lead the form under "General".
  if (general.length) groups.unshift({ title: "General", fields: general });
  return { groups };
}
