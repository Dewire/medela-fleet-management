import { describe, expect, it } from "vitest";

import { canAddOrganizationUser } from "./can-add-organization-user";

const ready = {
  name: "Alex Morgan",
  email: "alex@hospital.org",
  role: "user",
};

describe("canAddOrganizationUser", () => {
  it("allows add when name, email, and role are filled", () => {
    expect(canAddOrganizationUser(ready)).toBe(true);
  });

  it("allows an admin role", () => {
    expect(canAddOrganizationUser({ ...ready, role: "admin" })).toBe(true);
  });

  it("blocks add when the name is blank", () => {
    expect(canAddOrganizationUser({ ...ready, name: " " })).toBe(false);
  });

  it("blocks add when the email is blank", () => {
    expect(canAddOrganizationUser({ ...ready, email: "" })).toBe(false);
  });

  it("blocks add when the email is invalid", () => {
    expect(canAddOrganizationUser({ ...ready, email: "not-an-email" })).toBe(false);
  });

  it("blocks add when the role is missing", () => {
    expect(canAddOrganizationUser({ ...ready, role: "" })).toBe(false);
  });
});