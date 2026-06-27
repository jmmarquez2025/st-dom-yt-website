import { describe, it, expect } from "vitest";
import {
  computeDeadline,
  isOverdue,
  isLocked,
  filterByStatus,
  withinAdvanceWindow,
  countForRequesterThisYear,
  toBulletinCsv,
  toAuditCsv,
  POLICY,
} from "./massIntentions";

const NOW = new Date("2026-06-27T12:00:00Z");

describe("computeDeadline", () => {
  it("adds the policy deadline (365 days) to the acceptance date", () => {
    expect(computeDeadline("2026-06-27T00:00:00Z")).toBe("2027-06-27");
    expect(POLICY.fulfillmentDeadlineDays).toBe(365);
  });
});

describe("isOverdue / isLocked", () => {
  it("flags an active intention past its deadline", () => {
    expect(isOverdue({ status: "scheduled", fulfillmentDeadline: "2026-06-01" }, NOW)).toBe(true);
    expect(isOverdue({ status: "pending", fulfillmentDeadline: "2026-12-01" }, NOW)).toBe(false);
  });
  it("never flags fulfilled/archived/rejected (they are locked)", () => {
    expect(isOverdue({ status: "fulfilled", fulfillmentDeadline: "2020-01-01" }, NOW)).toBe(false);
    expect(isLocked({ status: "fulfilled" })).toBe(true);
    expect(isLocked({ status: "scheduled" })).toBe(false);
  });
});

describe("filterByStatus", () => {
  const list = [
    { status: "pending" },
    { status: "scheduled", fulfillmentDeadline: "2026-06-01" },
    { status: "fulfilled" },
  ];
  it("supports real statuses, 'all', 'active', and 'overdue'", () => {
    expect(filterByStatus(list, "pending")).toHaveLength(1);
    expect(filterByStatus(list, "all")).toHaveLength(3);
    expect(filterByStatus(list, "active")).toHaveLength(2);
    expect(filterByStatus(list, "overdue", NOW)).toHaveLength(1);
  });
});

describe("withinAdvanceWindow", () => {
  it("allows blank, rejects past, rejects beyond the window", () => {
    expect(withinAdvanceWindow("", NOW)).toBe(true);
    expect(withinAdvanceWindow("2026-06-26", NOW)).toBe(false); // yesterday
    expect(withinAdvanceWindow("2026-09-01", NOW)).toBe(true); // within 12mo
    expect(withinAdvanceWindow("2027-08-01", NOW)).toBe(false); // > 12mo
    expect(withinAdvanceWindow("not-a-date", NOW)).toBe(false);
  });
});

describe("countForRequesterThisYear", () => {
  const list = [
    { requesterEmail: "Maria@x.com", createdAt: "2026-02-01T00:00:00Z" },
    { requesterEmail: "maria@x.com", createdAt: "2026-05-01T00:00:00Z" },
    { requesterEmail: "maria@x.com", createdAt: "2025-05-01T00:00:00Z" }, // prior year
    { requesterEmail: "other@x.com", createdAt: "2026-05-01T00:00:00Z" },
  ];
  it("counts case-insensitively within the calendar year only", () => {
    expect(countForRequesterThisYear(list, "maria@x.com", NOW)).toBe(2);
    expect(countForRequesterThisYear(list, "", NOW)).toBe(0);
  });
});

describe("toBulletinCsv", () => {
  const list = [
    { status: "scheduled", announcementPreference: "public", assignedDate: "2026-07-12", assignedTime: "10:30 AM", personName: "José Garcia", intentionType: "deceased", requesterName: "Maria" },
    { status: "scheduled", announcementPreference: "private", assignedDate: "2026-07-12", personName: "Secret", intentionType: "living", requesterName: "Ann" },
    { status: "pending", announcementPreference: "public", personName: "NotYet", intentionType: "special", requesterName: "Bob" },
  ];
  it("includes only public scheduled/fulfilled rows", () => {
    const csv = toBulletinCsv(list);
    expect(csv).toContain("José Garcia");
    expect(csv).not.toContain("Secret"); // private excluded
    expect(csv).not.toContain("NotYet"); // pending excluded
  });
});

describe("toAuditCsv", () => {
  it("includes every row and quotes cells with commas", () => {
    const csv = toAuditCsv([
      { createdAt: "2026-06-27T00:00:00Z", personName: "A, Jr.", status: "pending", requesterEmail: "a@x.com" },
    ]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(2); // header + 1
    expect(csv).toContain('"A, Jr."');
    expect(csv).toContain("a@x.com");
  });
});
