import { describe, expect, it } from "vitest";

import { canInviteStaffUser, parseStaffInvite } from "./can-invite-staff-user";

const ready = {
  name: "Sam Rivera",
  email: "sam.rivera@medela.com",
  role: "sales",
};

describe("canInviteStaffUser", () => {
  it("returns true for a valid name, email, and each role", () => {
    expect(canInviteStaffUser(ready)).toBe(true);
    expect(canInviteStaffUser({ ...ready, role: "admin" })).toBe(true);
    expect(canInviteStaffUser({ ...ready, role: "software_update" })).toBe(true);
  });

  it("returns false when the name is blank or too short", () => {
    expect(canInviteStaffUser({ ...ready, name: "  " })).toBe(false);
    expect(canInviteStaffUser({ ...ready, name: "S" })).toBe(false);
  });

  it("returns false when the email is invalid", () => {
    expect(canInviteStaffUser({ ...ready, email: "sam" })).toBe(false);
  });

  it("returns false when the role is not a Medela staff role", () => {
    expect(canInviteStaffUser({ ...ready, role: "user" })).toBe(false);
  });
});

describe("parseStaffInvite", () => {
  it("trims the name and normalises the email", () => {
    expect(
      parseStaffInvite({
        name: "  Sam Rivera  ",
        email: " Sam.Rivera@Medela.com ",
        role: "admin",
      }),
    ).toEqual({
      ok: true,
      value: { name: "Sam Rivera", email: "sam.rivera@medela.com", role: "admin" },
    });
  });

  it("returns a message when the name is missing", () => {
    expect(parseStaffInvite({ ...ready, name: " " })).toMatchObject({
      ok: false,
      message: "Enter the user's name",
    });
  });
});
