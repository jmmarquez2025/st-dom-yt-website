import { describe, it, expect } from "vitest";
import en from "./en.json";
import es from "./es.json";

/**
 * Locale parity guard: en.json and es.json must expose exactly the same key
 * tree. Any copy change that touches one file without the other fails here,
 * so translation drift is caught at commit time instead of in production.
 */
function keyPaths(node, prefix = "") {
  if (Array.isArray(node)) {
    return node.flatMap((item, i) => keyPaths(item, `${prefix}[${i}]`));
  }
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k)
    );
  }
  return [prefix];
}

describe("locale parity", () => {
  it("en.json and es.json have identical key sets", () => {
    const enKeys = keyPaths(en).sort();
    const esKeys = keyPaths(es).sort();

    const missingInEs = enKeys.filter((k) => !esKeys.includes(k));
    const missingInEn = esKeys.filter((k) => !enKeys.includes(k));

    expect(missingInEs, "keys present in en.json but missing in es.json").toEqual([]);
    expect(missingInEn, "keys present in es.json but missing in en.json").toEqual([]);
    expect(esKeys.length).toBe(enKeys.length);
  });

  it("no leaf value is an empty string", () => {
    const empties = (locale) =>
      keyPaths(locale).filter((path) => {
        const value = path
          .replace(/\[(\d+)\]/g, ".$1")
          .split(".")
          .reduce((acc, k) => acc?.[k], locale);
        return typeof value === "string" && value.trim() === "";
      });
    expect(empties(en, "en")).toEqual([]);
    expect(empties(es, "es")).toEqual([]);
  });
});
