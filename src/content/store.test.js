import { describe, it, expect, beforeEach } from "vitest";
import { makeContentStore } from "./store";

const KEY = "stdom_content_test";

describe("makeContentStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty override maps when nothing is stored", () => {
    const store = makeContentStore(KEY);
    expect(store.getOverrides()).toEqual({ en: {}, es: {} });
    expect(store.hasAny()).toBe(false);
  });

  it("sets and reads a field per language", () => {
    const store = makeContentStore(KEY);
    store.setField("en", "home.hero.title", "Welcome");
    store.setField("es", "home.hero.title", "Bienvenidos");
    expect(store.getOverrides()).toEqual({
      en: { "home.hero.title": "Welcome" },
      es: { "home.hero.title": "Bienvenidos" },
    });
    expect(store.hasAny()).toBe(true);
  });

  it("persists an envelope with version + timestamp", () => {
    makeContentStore(KEY).setField("en", "a.b", "x");
    const env = JSON.parse(localStorage.getItem(KEY));
    expect(env.v).toBe(1);
    expect(typeof env.updatedAt).toBe("string");
    expect(env.en).toEqual({ "a.b": "x" });
  });

  it("removes the shard key entirely when the last override is removed (stays sparse)", () => {
    const store = makeContentStore(KEY);
    store.setField("en", "a.b", "x");
    store.removeField("en", "a.b");
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(store.hasAny()).toBe(false);
  });

  it("setAll replaces both language maps", () => {
    const store = makeContentStore(KEY);
    store.setField("en", "old.key", "stale");
    store.setAll({ "new.key": "fresh" }, { "new.key": "nuevo" });
    expect(store.getOverrides()).toEqual({
      en: { "new.key": "fresh" },
      es: { "new.key": "nuevo" },
    });
  });

  it("does not throw and reads as empty on a corrupt blob", () => {
    localStorage.setItem(KEY, "{not json");
    const store = makeContentStore(KEY);
    expect(store.getOverrides()).toEqual({ en: {}, es: {} });
  });
});
