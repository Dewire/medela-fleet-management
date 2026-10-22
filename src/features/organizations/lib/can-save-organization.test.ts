import { describe, expect, it } from "vitest";

import { canSaveOrganization } from "./can-save-organization";

const ready = {
  name: "City Clinic",
  city: "Oslo",
  country: "Norway",
  adminEmails: ["inga@clinic.no"],
};

describe("canSaveOrganization", () => {
  it("allows save when every required field is filled", () => {
    expect(canSaveOrganization(ready)).toBe(true);
  });

  it("ignores a blank extra admin email", () => {
    expect(canSaveOrganization({ ...ready, adminEmails: ["inga@clinic.no", "  "] })).toBe(true);
  });

  it("blocks save when the hospital name is blank", () => {
    expect(canSaveOrganization({ ...ready, name: " " })).toBe(false);
  });

  it("blocks save when the city is blank", () => {
    expect(canSaveOrganization({ ...ready, city: "" })).toBe(false);
  });

  it("blocks save when the country is blank", () => {
    expect(canSaveOrganization({ ...ready, country: "" })).toBe(false);
  });

  it("blocks save when no admin email is entered", () => {
    expect(canSaveOrganization({ ...ready, adminEmails: ["", " "] })).toBe(false);
  });

  it("blocks save when an admin email is invalid", () => {
    expect(canSaveOrganization({ ...ready, adminEmails: ["not-an-email"] })).toBe(false);
  });
});
