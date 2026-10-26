import { describe, expect, it } from "vitest";

import type { FirmwareRelease } from "../types";
import { createFirmwareReleaseStore } from "./firmware-release-store";

const seed: FirmwareRelease[] = [
  { version: "v2.4.0", date: "2025-12-10", region: "All regions", deviceType: "Symphony", status: "active", devices: 10, notes: "Battery", uploadedBy: "Sarah Chen" },
];

describe("createFirmwareReleaseStore", () => {
  it("starts with the given catalog", () => {
    const store = createFirmwareReleaseStore(seed);
    expect(store.getSnapshot()).toHaveLength(1);
  });

  it("prepends a published release", () => {
    const store = createFirmwareReleaseStore(seed);
    let heard = 0;
    store.subscribe(() => {
      heard += 1;
    });

    const published = store.publish(
      {
        version: "v2.5.0",
        deviceType: "Symphony",
        notes: "New radio",
      },
      "Sarah Chen",
      new Date("2026-09-10T08:00:00.000Z"),
    );

    expect(heard).toBe(1);
    expect(published.uploadedBy).toBe("Sarah Chen");
    expect(published.version).toBe("v2.5.0");
    expect(store.getSnapshot()[0]).toEqual(published);
    expect(store.getSnapshot()).toHaveLength(2);
  });

  it("replaces the catalog", () => {
    const store = createFirmwareReleaseStore(seed);
    store.replace([]);

    expect(store.getSnapshot()).toEqual([]);

    store.replace(seed);

    expect(store.getSnapshot()).toEqual(seed);
  });

  it("does not notify a listener after unsubscribe", () => {
    const store = createFirmwareReleaseStore(seed);
    let heard = 0;
    const stop = store.subscribe(() => {
      heard += 1;
    });

    stop();
    store.publish(
      { version: "v2.5.1", deviceType: "Symphony", notes: "Patch" },
      "Sarah Chen",
      new Date("2026-09-10T08:00:00.000Z"),
    );

    expect(heard).toBe(0);
  });
});
