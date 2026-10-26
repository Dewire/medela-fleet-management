import { describe, expect, it } from "vitest";

import { canManageHospitalUsers } from "./can-manage-hospital-users";

const fixture = "alex.morgan@stmarys.example";
const users = [
  { email: "alex.morgan@stmarys.example", role: "admin" as const },
  { email: "priya.nair@stmarys.example", role: "user" as const },
];

describe("canManageHospitalUsers", () => {
  it("returns true when the email belongs to an admin", () => {
    expect(canManageHospitalUsers(users, "Alex.Morgan@stmarys.example", fixture)).toBe(true);
  });

  it("returns true for the fixture when the directory is empty", () => {
    expect(canManageHospitalUsers([], fixture, fixture)).toBe(true);
  });

  it("returns true for the fixture when they are not in the directory yet", () => {
    expect(
      canManageHospitalUsers(
        [{ email: "priya.nair@stmarys.example", role: "user" }],
        fixture,
        fixture,
      ),
    ).toBe(true);
  });

  it("returns false when the email belongs to a regular user", () => {
    expect(canManageHospitalUsers(users, "priya.nair@stmarys.example", fixture)).toBe(false);
  });

  it("returns false for a blank email", () => {
    expect(canManageHospitalUsers([], "  ", fixture)).toBe(false);
  });
});
