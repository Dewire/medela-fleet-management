import { describe, expect, it } from "vitest";

import { canSendHospitalInvite, parseHospitalInvite } from "./can-send-hospital-invite";

const ready = { name: "Sam Rivera", email: "sam@hospital.org", role: "user" };

describe("canSendHospitalInvite", () => {
  it("returns true for a valid name, email, and either role", () => {
    expect(canSendHospitalInvite(ready)).toBe(true);
    expect(canSendHospitalInvite({ ...ready, role: "admin" })).toBe(true);
  });

  it("returns false when the name is blank or too short", () => {
    expect(canSendHospitalInvite({ ...ready, name: "  " })).toBe(false);
    expect(canSendHospitalInvite({ ...ready, name: "S" })).toBe(false);
  });

  it("returns false when the email is blank or invalid", () => {
    expect(canSendHospitalInvite({ ...ready, email: "  " })).toBe(false);
    expect(canSendHospitalInvite({ ...ready, email: "not-an-email" })).toBe(false);
  });

  it("returns false when the role is not Admin or User", () => {
    expect(canSendHospitalInvite({ ...ready, role: "owner" })).toBe(false);
  });
});

describe("parseHospitalInvite", () => {
  it("trims the name and normalises the email", () => {
    expect(
      parseHospitalInvite({ name: "  Sam Rivera  ", email: " Sam@Hospital.org ", role: "admin" }),
    ).toEqual({
      ok: true,
      value: { name: "Sam Rivera", email: "sam@hospital.org", role: "admin" },
    });
  });

  it("returns a message when the name is missing", () => {
    expect(parseHospitalInvite({ ...ready, name: " " })).toMatchObject({
      ok: false,
      message: "Enter the user's name",
    });
  });

  it("returns a message when the email cannot be used", () => {
    expect(parseHospitalInvite({ ...ready, email: "sam" })).toMatchObject({
      ok: false,
      message: "Enter a valid email address",
    });
  });
});
