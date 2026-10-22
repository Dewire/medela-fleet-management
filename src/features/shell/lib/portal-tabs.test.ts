import { describe, expect, it } from "vitest";

import { getPortalTabs, resolvePortalTab } from "./portal-tabs";

describe("getPortalTabs", () => {
  it("keeps Sales focused on organisations", () => {
    expect(getPortalTabs("sales")).toEqual([
      { id: "organizations", label: "Organisations", href: "/sales" },
    ]);
  });

  it("keeps Biomed focused on devices", () => {
    expect(getPortalTabs("biomed")).toEqual([
      { id: "devices", label: "Devices", href: "/biomed" },
    ]);
  });
});

describe("resolvePortalTab", () => {
  it("keeps Devices selected on the Biomed registration route", () => {
    expect(resolvePortalTab("biomed", "/biomed/devices/new")).toBe("devices");
  });

  it("selects Devices for the Biomed overview", () => {
    expect(resolvePortalTab("biomed", "/biomed")).toBe("devices");
  });

  it("selects Organisations for Sales detail routes", () => {
    expect(resolvePortalTab("sales", "/sales/organizations/hospital-one")).toBe(
      "organizations",
    );
  });
});
