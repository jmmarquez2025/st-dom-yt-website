import { describe, it, expect } from "vitest";
import { getLiturgicalSeason, SEASONS } from "./liturgical";

describe("SEASONS", () => {
  it("exposes the expected season keys", () => {
    expect(Object.keys(SEASONS)).toEqual(
      expect.arrayContaining([
        "advent",
        "christmas",
        "lent",
        "triduum",
        "easter",
        "ordinary",
      ])
    );
  });
});

describe("getLiturgicalSeason", () => {
  it("returns a season object with the expected shape", () => {
    const s = getLiturgicalSeason(new Date(2026, 0, 15));
    expect(s).toHaveProperty("key");
    expect(s).toHaveProperty("color");
    expect(s).toHaveProperty("accent");
    expect(s).toHaveProperty("name");
    expect(typeof s.key).toBe("string");
  });

  it("identifies Christmas season around Dec 26", () => {
    const s = getLiturgicalSeason(new Date(2025, 11, 26));
    expect(s.key.toLowerCase()).toMatch(/christmas/);
  });

  it("identifies Christmas season in early January (before Jan 13)", () => {
    const s = getLiturgicalSeason(new Date(2026, 0, 5));
    expect(s).toBe(SEASONS.christmas);
  });

  it("identifies Lent in March 2024 (Ash Wed Feb 14, Easter Mar 31)", () => {
    const s = getLiturgicalSeason(new Date(2024, 2, 15));
    expect(s).toBe(SEASONS.lent);
  });

  it("identifies Easter season shortly after Easter Sunday 2025 (Apr 20)", () => {
    const s = getLiturgicalSeason(new Date(2025, 3, 27));
    expect(s).toBe(SEASONS.easter);
  });

  it("identifies Ordinary Time mid-summer", () => {
    const s = getLiturgicalSeason(new Date(2026, 6, 15));
    expect(s).toBe(SEASONS.ordinary);
  });

  it("defaults to a Date when called without arguments", () => {
    const s = getLiturgicalSeason();
    expect(s).toHaveProperty("key");
    expect(typeof s.color).toBe("string");
  });
});
