import { describe, expect, it } from "vitest";
import { sundayMass, dailyMass, confession, adoration } from "../data/schedule";
import { buildMassTimesSchema } from "./seoSchema";

describe("buildMassTimesSchema", () => {
  it("builds recurring event schema from current schedule data", () => {
    const schema = buildMassTimesSchema(
      { sundayMass, dailyMass, confession, adoration },
      "https://jmmarquez2025.github.io/st-dom-yt-website",
      new Date(2026, 4, 18, 9, 0)
    );

    expect(schema.url).toBe("https://jmmarquez2025.github.io/st-dom-yt-website/mass-times");
    expect(schema.event.length).toBeGreaterThan(8);
    expect(schema.event[0]).toMatchObject({
      "@type": "Event",
      eventStatus: "https://schema.org/EventScheduled",
      eventSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P1W",
      },
    });
    expect(schema.event.some((event) => event.inLanguage === "es")).toBe(true);
  });
});
