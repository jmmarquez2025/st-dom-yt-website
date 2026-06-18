import { describe, it, expect } from "vitest";
import { unflatten, getByPath } from "./flatten";

describe("unflatten", () => {
  it("expands dotted keys into a nested tree", () => {
    expect(unflatten({ "home.hero.title": "Hi" })).toEqual({
      home: { hero: { title: "Hi" } },
    });
  });

  it("merges sibling keys without clobbering each other", () => {
    expect(
      unflatten({ "a.b": 1, "a.c": 2, "a.d.e": 3 })
    ).toEqual({ a: { b: 1, c: 2, d: { e: 3 } } });
  });

  it("keeps array values as a single terminal leaf", () => {
    const out = unflatten({ "massTimes.examine.c1.items": ["one", "two"] });
    expect(out).toEqual({ massTimes: { examine: { c1: { items: ["one", "two"] } } } });
    expect(Array.isArray(out.massTimes.examine.c1.items)).toBe(true);
  });

  it("handles empty input", () => {
    expect(unflatten({})).toEqual({});
  });
});

describe("getByPath", () => {
  const tree = { home: { hero: { title: "Hi" }, list: [1, 2] } };
  it("reads a nested value", () => {
    expect(getByPath(tree, "home.hero.title")).toBe("Hi");
  });
  it("returns undefined for a missing path", () => {
    expect(getByPath(tree, "home.nope.gone")).toBeUndefined();
  });
  it("reads an array leaf", () => {
    expect(getByPath(tree, "home.list")).toEqual([1, 2]);
  });
});
