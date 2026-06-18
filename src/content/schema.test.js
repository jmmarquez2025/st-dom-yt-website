import { describe, it, expect } from "vitest";
import { PAGES, CHROME } from "./registry";
import { getSchema } from "./schema";
import { schemaKeys } from "./schema/_helpers";
import en from "../locales/en.json";

const ALL = [...PAGES, ...CHROME];

// Leaf keys of a namespace, treating a string-array as ONE leaf (the editor
// edits the whole list at once), matching how the schema/override layer works.
function leafKeys(node, prefix, out) {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    for (const k of Object.keys(node)) leafKeys(node[k], prefix ? `${prefix}.${k}` : k, out);
  } else {
    out.push(prefix);
  }
  return out;
}

describe("page schemas", () => {
  for (const p of ALL) {
    it(`${p.id}: schema covers exactly its i18n namespace, no typos`, () => {
      const schema = getSchema(p.id, p.ns);
      expect(schema, `no schema for ${p.id}`).toBeTruthy();

      const fieldKeys = schemaKeys(schema).sort();
      const nsKeys = leafKeys(en[p.ns], p.ns, []).sort();

      // No duplicate fields.
      expect(new Set(fieldKeys).size).toBe(fieldKeys.length);
      // Every schema key exists in the locale (catches hand-curated typos)…
      const unknown = fieldKeys.filter((k) => !nsKeys.includes(k));
      expect(unknown, `keys not in en.${p.ns}`).toEqual([]);
      // …and every editable leaf is covered (nothing silently un-editable).
      const missing = nsKeys.filter((k) => !fieldKeys.includes(k));
      expect(missing, `leaves not covered by ${p.id} schema`).toEqual([]);
    });
  }
});
