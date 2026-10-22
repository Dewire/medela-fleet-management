import { describe, expect, it } from "vitest";

import { canSendHospitalInvite, parseHospitalInvite } from "./can-send-hospital-invite";

describe("canSendHospitalInvite", () => {
  it("returns true for a valid email and either role", () => {
    expect(canSendHospitalInvite({ email: "sam@hospital.org", role: "user" })).toBe(true);
    expect(canSendHospitalInvite({ email: "sam@hospital.org", role: "admin" })).toBe(true);
  });

  it("returns false when the email is blank or invalid", () => {
    expect(canSendHospitalInvite({ email: "  ", role: "user" })).toBe(false);
    expect(canSendHospitalInvite({ email: "not-an-email", role: "admin" })).toBe(false);
  });

  it("returns false when the role is not Admin or User", () => {
    expect(canSendHospitalInvite({ email: "sam@hospital.org", role: "owner" })).toBe(false);
  });
});

describe("parseHospitalInvite", () => {
  it("normalises the email and keeps the role", () => {
    expect(parseHospitalInvite({ email: " Sam@Hospital.org ", role: "admin" })).toEqual({
      ok: true,
      value: { email: "sam@hospital.org", role: "admin" },
    });
  });

  it("returns a message when the email cannot be used", () => {
    expect(parseHospitalInvite({ email: "sam", role: "user" })).toMatchObject({
      ok: false,
      message: "Enter a valid email address",
    });
  });
});
