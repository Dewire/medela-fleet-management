import { describe, expect, it } from "vitest";

import { parseStaffRole } from "./parse-staff-role";

describe("parseStaffRole", () => {
  it("keeps Sales and Software Update", () => {
    expect(parseStaffRole("sales")).toBe("sales");
    expect(parseStaffRole("software_update")).toBe("software_update");
  });

  it("returns Admin for Admin and for an unknown value", () => {
    expect(parseStaffRole("admin")).toBe("admin");
    expect(parseStaffRole("user")).toBe("admin");
  });
});
