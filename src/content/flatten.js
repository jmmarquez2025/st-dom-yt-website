/**
 * Flat ↔ nested helpers for i18n override blobs.
 *
 * Overrides are stored flat — keyed by the full dotted i18n path exactly as
 * `t()` consumes it ("home.hero.title") — because the dashboard addresses one
 * field at a time and sparse diffs are one entry per changed field. i18next,
 * however, wants a nested resource tree. `unflatten()` bridges the two right
 * before `addResourceBundle`.
 *
 * Arrays (the only ones in the locale data are arrays-of-strings, e.g.
 * massTimes.examine.*.items) are stored as a whole terminal leaf, never per
 * index — so addResourceBundle's deep-overwrite replaces the list cleanly.
 */

/** Expand { "a.b.c": v } → { a: { b: { c: v } } }. Array values stay as-is. */
export function unflatten(flat) {
  const root = {};
  for (const dotted in flat) {
    if (!Object.prototype.hasOwnProperty.call(flat, dotted)) continue;
    const parts = dotted.split(".");
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof node[part] !== "object" || node[part] === null || Array.isArray(node[part])) {
        node[part] = {};
      }
      node = node[part];
    }
    node[parts[parts.length - 1]] = flat[dotted];
  }
  return root;
}

/** Read a dotted path out of a nested object. Returns undefined if absent. */
export function getByPath(obj, dotted) {
  return dotted.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
