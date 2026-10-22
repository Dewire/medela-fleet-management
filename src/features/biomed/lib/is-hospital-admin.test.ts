import { describe, expect, it } from "vitest";

import { isHospitalAdmin } from "./is-hospital-admin";

const users = [
  { email: "alex.morgan@stmarys.example", role: "admin" as const },
  { email: "priya.nair@stmarys.example", role: "user" as const },
];

describe("isHospitalAdmin", () => {
  it("returns true when the email belongs to an admin", () => {
    expect(isHospitalAdmin(users, "Alex.Morgan@stmarys.example")).toBe(true);
  });

  it("returns false when the email belongs to a regular user", () => {
    expect(isHospitalAdmin(users, "priya.nair@stmarys.example")).toBe(false);
  });

  it("returns false when the email is not in the directory", () => {
    expect(isHospitalAdmin(users, "missing@stmarys.example")).toBe(false);
  });

  it("returns false for a blank email", () => {
    expect(isHospitalAdmin(users, "  ")).toBe(false);
  });
});
