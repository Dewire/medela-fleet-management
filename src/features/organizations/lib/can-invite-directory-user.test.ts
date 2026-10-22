import { describe, expect, it } from "vitest";

import { canInviteDirectoryUser, parseDirectoryInvite } from "./can-invite-directory-user";

describe("canInviteDirectoryUser", () => {
  it("returns true when email, role, and hospital are set", () => {
    expect(
      canInviteDirectoryUser({
        email: "sam@hospital.org",
        role: "user",
        organizationId: "st-marys-hospital",
      }),
    ).toBe(true);
  });

  it("returns false when the hospital is missing", () => {
    expect(
      canInviteDirectoryUser({ email: "sam@hospital.org", role: "user", organizationId: "" }),
    ).toBe(false);
  });

  it("returns false when the email is invalid", () => {
    expect(
      canInviteDirectoryUser({
        email: "sam",
        role: "admin",
        organizationId: "st-marys-hospital",
      }),
    ).toBe(false);
  });
});

describe("parseDirectoryInvite", () => {
  it("normalises the email and keeps the hospital", () => {
    expect(
      parseDirectoryInvite({
        email: " Sam@Hospital.org ",
        role: "admin",
        organizationId: "st-marys-hospital",
      }),
    ).toEqual({
      ok: true,
      value: {
        email: "sam@hospital.org",
        role: "admin",
        organizationId: "st-marys-hospital",
      },
    });
  });
});
