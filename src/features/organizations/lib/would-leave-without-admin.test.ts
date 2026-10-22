import { describe, expect, it } from "vitest";

import { wouldLeaveWithoutAdmin } from "./would-leave-without-admin";

const users = [
  { id: "user-1", role: "admin" as const },
  { id: "user-2", role: "user" as const },
];

describe("wouldLeaveWithoutAdmin", () => {
  it("returns false when promoting someone to admin", () => {
    expect(wouldLeaveWithoutAdmin(users, "user-2", "admin")).toBe(false);
  });

  it("returns false when another admin remains", () => {
    const twoAdmins = [...users, { id: "user-3", role: "admin" as const }];
    expect(wouldLeaveWithoutAdmin(twoAdmins, "user-1", "user")).toBe(false);
  });

  it("returns true when the only admin would become a user", () => {
    expect(wouldLeaveWithoutAdmin(users, "user-1", "user")).toBe(true);
  });
});
