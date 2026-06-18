import { describe, it, expect } from "vitest";
import { PAGES, CHROME } from "./registry";
import { CONTENT_SHARD_KEYS, isContentShardKey } from "./shards";
import en from "../locales/en.json";
import es from "../locales/es.json";

const ALL = [...PAGES, ...CHROME];

// Google Sheets caps a single cell at 50,000 chars. We guard at 45,000 to
// leave headroom for the envelope + future per-page image URLs.
const CELL_BUDGET = 45000;

function flatten(node, prefix, acc) {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    for (const k of Object.keys(node)) {
      flatten(node[k], prefix ? `${prefix}.${k}` : k, acc);
    }
  } else {
    acc[prefix] = node; // strings and array-of-strings leaves
  }
  return acc;
}

describe("content registry ↔ shard wiring", () => {
  it("derives one shard key per page and chrome entry", () => {
    expect(CONTENT_SHARD_KEYS.length).toBe(ALL.length);
  });

  it("every shard key is unique and prefixed stdom_content_", () => {
    const seen = new Set();
    for (const p of ALL) {
      expect(p.shardKey).toMatch(/^stdom_content_[a-z0-9_]+$/);
      expect(seen.has(p.shardKey)).toBe(false);
      seen.add(p.shardKey);
      expect(isContentShardKey(p.shardKey)).toBe(true);
    }
  });

  it("every page has id, label, ns, icon and route", () => {
    for (const p of ALL) {
      expect(p.id).toBeTruthy();
      expect(p.label).toBeTruthy();
      expect(p.ns).toBeTruthy();
      expect(p.icon).toBeTruthy();
      expect(p.route).toBeTruthy();
    }
  });

  it("every page's i18n namespace exists in both locales", () => {
    for (const p of ALL) {
      expect(en[p.ns], `en.json missing "${p.ns}"`).toBeDefined();
      expect(es[p.ns], `es.json missing "${p.ns}"`).toBeDefined();
    }
  });

  // Worst case: an editor overrides every string on the page in both
  // languages. The resulting shard must still fit one Google Sheets cell.
  it("a fully-overridden shard stays under the cell budget for every page", () => {
    for (const p of ALL) {
      const enFlat = flatten(en[p.ns], p.ns, {});
      const esFlat = flatten(es[p.ns], p.ns, {});
      const envelope = {
        v: 1,
        updatedAt: "2026-06-18T00:00:00.000Z",
        en: enFlat,
        es: esFlat,
      };
      const size = JSON.stringify(envelope).length;
      expect(size, `${p.shardKey} worst-case shard is ${size} chars`).toBeLessThan(CELL_BUDGET);
    }
  });
});
