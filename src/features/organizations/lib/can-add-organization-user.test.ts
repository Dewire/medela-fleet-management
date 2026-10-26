import { describe, expect, it } from "vitest";

import { canAddOrganizationUser } from "./can-add-organization-user";

const ready = {
  name: "Alex Morgan",
  email: "alex@hospital.org",
};

describe("canAddOrganizationUser", () => {
  it("allows add when name and email are filled", () => {
    expect(canAddOrganizationUser(ready)).toBe(true);
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
});
