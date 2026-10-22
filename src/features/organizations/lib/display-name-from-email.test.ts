import { describe, expect, it } from "vitest";

import { displayNameFromEmail } from "./display-name-from-email";

describe("displayNameFromEmail", () => {
  it("title-cases words split from the local part", () => {
    expect(displayNameFromEmail("alex.morgan@hospital.org")).toBe("Alex Morgan");
  });

  it("keeps unicode letters in the local part", () => {
    expect(displayNameFromEmail("josé_nair@hospital.org")).toBe("José Nair");
  });

  it("returns Admin when the local part has no letters or digits", () => {
    expect(displayNameFromEmail("---@hospital.org")).toBe("Admin");
  });
});
