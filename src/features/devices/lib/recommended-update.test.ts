import { describe, expect, it } from "vitest";

import type { FirmwareRelease } from "@/features/firmware/types";

import { recommendedFirmwareUpdate } from "./recommended-update";

const releases: FirmwareRelease[] = [
  { version: "v2.4.0", date: "2025-12-10", region: "All regions", deviceType: "Freestyle Hands-free", status: "active", devices: 10, notes: "Battery optimisation", uploadedBy: "Sarah Chen" },
  { version: "v2.5.0", date: "2026-01-01", region: "All regions", deviceType: "Symphony", status: "active", devices: 4, notes: "Symphony only", uploadedBy: "Sarah Chen" },
  { version: "v2.6.0", date: "2026-02-01", region: "All regions", deviceType: "Freestyle Hands-free", status: "recalled", devices: 0, notes: "Do not deploy", uploadedBy: "Sarah Chen" },
  { version: "v2.3.1", date: "2025-09-04", region: "Europe", deviceType: "Freestyle Hands-free", status: "superseded", devices: 8, notes: "EU patch", uploadedBy: "Sarah Chen" },
];

const freestyle = { firmware: "v2.3.1", model: "Freestyle Hands-free" };

describe("recommendedFirmwareUpdate", () => {
  it("offers the active newer package for the device type", () => {
    expect(recommendedFirmwareUpdate(freestyle, releases)).toEqual({
      version: "v2.4.0",
      notes: "Battery optimisation",
      uploadedBy: "Sarah Chen",
      date: "2025-12-10",
    });
  });

  it("returns null when the device is already current", () => {
    expect(recommendedFirmwareUpdate({ ...freestyle, firmware: "v2.4.0" }, releases)).toBeNull();
  });

  it("skips a recalled package even when it is the only newer one", () => {
    expect(
      recommendedFirmwareUpdate({ firmware: "v2.4.0", model: "Freestyle Hands-free" }, [releases[2]!]),
    ).toBeNull();
  });

  it("offers the newest package when the device has no firmware installed", () => {
    expect(recommendedFirmwareUpdate({ ...freestyle, firmware: "Not installed" }, releases)).toEqual({
      version: "v2.4.0",
      notes: "Battery optimisation",
      uploadedBy: "Sarah Chen",
      date: "2025-12-10",
    });
  });

  it("does not offer a package for a different device type", () => {
    expect(recommendedFirmwareUpdate(freestyle, [releases[1]!])).toBeNull();
  });
});
