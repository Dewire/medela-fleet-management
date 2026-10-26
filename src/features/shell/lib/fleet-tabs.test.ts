import { describe, expect, it } from "vitest";

import {
  resolveFleetTab,
  resolveUploadReturn,
  showsUploadFirmware,
  uploadFirmwareHref,
} from "./fleet-tabs";

describe("resolveFleetTab", () => {
  it("selects Devices on the fleet overview", () => {
    expect(resolveFleetTab("/internal")).toBe("devices");
  });

  it("selects Firmware history on the history list", () => {
    expect(resolveFleetTab("/internal/firmware")).toBe("history");
  });

  it("does not treat the publish form as its own tab", () => {
    expect(resolveFleetTab("/internal/firmware/upload")).toBe("history");
  });

  it("selects Firmware history on a release detail path", () => {
    expect(resolveFleetTab("/internal/firmware/v2.4.0")).toBe("history");
  });

  it("selects Users on the hospital directory", () => {
    expect(resolveFleetTab("/internal/users")).toBe("users");
  });

  it("falls back to Devices on other internal paths", () => {
    expect(resolveFleetTab("/internal/profile")).toBe("devices");
  });
});

describe("showsUploadFirmware", () => {
  it("shows the button on Devices and Firmware history", () => {
    expect(showsUploadFirmware("devices")).toBe(true);
    expect(showsUploadFirmware("history")).toBe(true);
  });

  it("hides the button on Users", () => {
    expect(showsUploadFirmware("users")).toBe(false);
  });
});

describe("uploadFirmwareHref", () => {
  it("records the tab that opened the publish form", () => {
    expect(uploadFirmwareHref("history")).toBe("/internal/firmware/upload?from=history");
  });
});

describe("resolveUploadReturn", () => {
  it("returns Firmware history when that tab opened the form", () => {
    expect(resolveUploadReturn("history")).toEqual({
      href: "/internal/firmware",
      label: "Back to Firmware history",
    });
  });

  it("returns Users when that tab opened the form", () => {
    expect(resolveUploadReturn("users")).toEqual({
      href: "/internal/users",
      label: "Back to Users",
    });
  });

  it("returns Devices when from is missing or unknown", () => {
    expect(resolveUploadReturn(undefined)).toEqual({
      href: "/internal",
      label: "Back to Devices",
    });
    expect(resolveUploadReturn("nope")).toEqual({
      href: "/internal",
      label: "Back to Devices",
    });
  });
});
