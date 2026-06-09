import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SEARCH_INDEX, searchPages } from "./searchIndex";

// vitest runs with cwd at the project root
const appSource = readFileSync(resolve(process.cwd(), "src/App.jsx"), "utf8");
const ROUTE_PATHS = [...appSource.matchAll(/<Route path="([^"]+)"/g)].map(
  (m) => m[1]
);

describe("search index", () => {
  it("every index path is a real route in App.jsx", () => {
    const dead = SEARCH_INDEX.filter((e) => !ROUTE_PATHS.includes(e.path));
    expect(
      dead.map((e) => e.path),
      "search results pointing at routes that do not exist"
    ).toEqual([]);
  });

  it("entries have title, description, and at least one keyword", () => {
    for (const entry of SEARCH_INDEX) {
      expect(entry.title, entry.path).toBeTruthy();
      expect(entry.description, entry.path).toBeTruthy();
      expect(entry.keywords?.length, entry.path).toBeGreaterThan(0);
    }
  });

  it("finds core pages by obvious queries", () => {
    expect(searchPages("mass")[0].path).toBe("/mass-times");
    expect(searchPages("confession").some((r) => r.path === "/mass-times")).toBe(true);
    expect(searchPages("donate").some((r) => r.path === "/give")).toBe(true);
    expect(searchPages("wedding").some((r) => r.path === "/sacraments/marriage")).toBe(true);
  });

  it("returns nothing for sub-2-character queries", () => {
    expect(searchPages("m")).toEqual([]);
    expect(searchPages("")).toEqual([]);
  });
});
