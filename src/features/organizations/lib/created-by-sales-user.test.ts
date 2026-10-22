import { describe, expect, it } from "vitest";

import { createdBySalesUser, formatLocalDate } from "./created-by-sales-user";

describe("createdBySalesUser", () => {
  it("attributes the organisation to the sales account", () => {
    expect(createdBySalesUser(new Date(2026, 9, 22))).toEqual({
      name: "Maya Patel",
      initials: "MP",
      detail: "maya.patel@medela.com · Medela",
      createdOn: "2026-10-22",
    });
  });
});

describe("formatLocalDate", () => {
  it("pads a single-digit month and day", () => {
    expect(formatLocalDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("keeps the local calendar day at the end of the year", () => {
    expect(formatLocalDate(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});