import { describe, expect, it } from "vitest";

import {
  SIGN_OUT_HREF,
  getAccountUser,
  getPortalHrefs,
} from "./current-user";

describe("account hrefs", () => {
  it("keeps profile under the internal portal", () => {
    expect(getPortalHrefs("internal")).toEqual({
      home: "/internal",
      profile: "/internal/profile",
    });
  });

  it("returns role-specific homes and profiles", () => {
    expect(getPortalHrefs("sales").home).toBe("/sales");
    expect(getPortalHrefs("biomed").profile).toBe("/biomed/profile");
  });

  it("returns log out to Medela sign-in", () => {
    expect(SIGN_OUT_HREF).toBe("/login/medela");
  });
});

describe("getAccountUser", () => {
  it("returns the Medela staff fixture", () => {
    expect(getAccountUser().email).toBe("sarah.chen@medela.com");
  });

  it("returns the requested portal fixture", () => {
    expect(getAccountUser("sales").roleLabel).toBe("Medela Sales");
    expect(getAccountUser("biomed").organization).toBe("St Mary's Hospital");
  });
});
