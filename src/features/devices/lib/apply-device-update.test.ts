import { describe, expect, it } from "vitest";

import type { DeviceFirmwareLogEntry, WorldDevice } from "../types";
import { applyDeviceFirmwareUpdate } from "./apply-device-update";

const device: WorldDevice = {
  id: "KF-1",
  city: "Berlin",
  country: "Germany",
  region: "europe",
  status: "needs-update",
  hospital: "Charité",
  firmware: "v2.3.1",
  model: "Freestyle Hands-free",
};

const log: DeviceFirmwareLogEntry[] = [
  { version: "v2.3.1", installedOn: "2025-09-04", notes: "EU patch", uploadedBy: "Tobias Keller" },
];

const offer = {
  version: "v2.4.0",
  notes: "Battery optimisation",
  uploadedBy: "Sarah Chen",
  date: "2025-12-10",
};

describe("applyDeviceFirmwareUpdate", () => {
  it("sets the device current and prepends the new install", () => {
    const result = applyDeviceFirmwareUpdate(device, log, offer, new Date("2026-09-10T12:00:00.000Z"));

    expect(result.device).toMatchObject({ firmware: "v2.4.0", status: "updated" });
    expect(result.log[0]).toEqual({
      version: "v2.4.0",
      installedOn: "2026-09-10",
      notes: "Battery optimisation",
      uploadedBy: "Sarah Chen",
    });
    expect(result.log).toHaveLength(2);
  });

  it("leaves the device unchanged when it already has that version", () => {
    const current = { ...device, firmware: "v2.4.0", status: "updated" as const };
    const result = applyDeviceFirmwareUpdate(current, log, offer, new Date("2026-09-10T12:00:00.000Z"));

    expect(result.device).toEqual(current);
    expect(result.log).toEqual(log);
  });

  it("does not mutate the original device or log", () => {
    applyDeviceFirmwareUpdate(device, log, offer, new Date("2026-09-10T12:00:00.000Z"));
    expect(device.firmware).toBe("v2.3.1");
    expect(log).toHaveLength(1);
  });
});
