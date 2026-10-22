import { describe, expect, it } from "vitest";

import { isNewerFirmware, parseFirmwareVersion } from "./compare-firmware";

describe("parseFirmwareVersion", () => {
  it("parses a v-prefixed label", () => {
    expect(parseFirmwareVersion("v2.4.0")).toEqual([2, 4, 0]);
  });

  it("parses a label without the v prefix", () => {
    expect(parseFirmwareVersion("2.3.1")).toEqual([2, 3, 1]);
  });

  it("returns null for a non-version string", () => {
    expect(parseFirmwareVersion("latest")).toBeNull();
  });
});

describe("isNewerFirmware", () => {
  it("returns true when the candidate is a higher patch", () => {
    expect(isNewerFirmware("v2.3.1", "v2.3.0")).toBe(true);
  });

  it("returns false when the versions are equal", () => {
    expect(isNewerFirmware("v2.4.0", "v2.4.0")).toBe(false);
  });

  it("returns false when the candidate cannot be parsed", () => {
    expect(isNewerFirmware("nightly", "v2.4.0")).toBe(false);
  });

  it("treats a real version as newer than a device with no firmware", () => {
    expect(isNewerFirmware("v2.4.0", "Not installed")).toBe(true);
  });

  it("does not treat a missing install as newer than a real version", () => {
    expect(isNewerFirmware("Not installed", "v2.4.0")).toBe(false);
  });
});
