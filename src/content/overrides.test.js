import { describe, it, expect, beforeEach } from "vitest";
import { setSeoForPage, resolveSeo, getSeoForPage } from "./seo";
import { setImage, resetImage, applyImageOverrides, currentImage, originalImage } from "./images";
import { setBranding, resetBranding, contrastRatio, originalColor } from "./branding";
import { PHOTOS } from "../constants/photos";
import { T } from "../constants/theme";

beforeEach(() => localStorage.clear());

describe("SEO overrides", () => {
  it("resolves per-language with EN fallback, and only for known routes", () => {
    setSeoForPage("about", { titleEn: "Our Story", descEn: "About us" });
    expect(resolveSeo("/about", "en").title).toBe("Our Story");
    // ES title blank → falls back to EN
    expect(resolveSeo("/about", "es").title).toBe("Our Story");
    // Unknown route → no override
    expect(resolveSeo("/nope", "en")).toEqual({});
  });

  it("keeps the shard sparse (blank fields dropped)", () => {
    setSeoForPage("about", { titleEn: "X", titleEs: "", descEn: "", descEs: "", image: "" });
    expect(getSeoForPage("about")).toEqual({ titleEn: "X" });
  });
});

describe("image overrides", () => {
  it("swaps a slot in PHOTOS and reverts on reset", () => {
    const orig = originalImage("aboutHero");
    setImage("aboutHero", "https://example.com/x.jpg");
    expect(currentImage("aboutHero")).toBe("https://example.com/x.jpg");
    applyImageOverrides();
    expect(PHOTOS.aboutHero).toBe("https://example.com/x.jpg");
    resetImage("aboutHero");
    expect(PHOTOS.aboutHero).toBe(orig);
  });
});

describe("branding overrides", () => {
  it("mutates the T object and reverts on reset", () => {
    const orig = originalColor("burgundy");
    setBranding({ burgundy: "#0A5C36" });
    expect(T.burgundy).toBe("#0A5C36");
    resetBranding();
    expect(T.burgundy).toBe(orig);
  });

  it("computes a sane WCAG contrast ratio", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 1);
  });
});
