/**
 * Tiny builders for page field schemas. A schema is a list of groups, each a
 * titled set of fields. Every `key` is the FULL dotted i18n path exactly as
 * `t()` consumes it — it doubles as the override storage key and the default
 * lookup key.
 *
 *   type: "text"   single-line input   (titles, labels, CTAs)
 *   type: "rich"   auto-growing area   (paragraphs, descriptions)
 *   type: "list"   string-array editor (e.g. examination-of-conscience bullets)
 */

export const text = (key, label) => ({ key, label, type: "text" });
export const rich = (key, label) => ({ key, label, type: "rich" });
export const list = (key, label) => ({ key, label, type: "list" });
export const group = (title, fields) => ({ title, fields });

/** All dotted keys a schema references (used by editors and guards). */
export function schemaKeys(schema) {
  return schema.groups.flatMap((g) => g.fields.map((f) => f.key));
}
