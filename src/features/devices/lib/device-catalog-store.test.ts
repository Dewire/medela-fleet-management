import { describe, expect, it } from "vitest";

import type { FirmwareRelease } from "@/features/firmware/types";

import type { WorldDevice } from "../types";
import { createDeviceCatalogStore } from "./device-catalog-store";

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

const releases: FirmwareRelease[] = [
  { version: "v2.3.1", date: "2025-09-04", region: "Europe", deviceType: "Freestyle Hands-free", status: "superseded", devices: 1, notes: "EU patch", uploadedBy: "Sarah Chen" },
];

describe("createDeviceCatalogStore", () => {
  it("seeds a log from the catalog", () => {
    const store = createDeviceCatalogStore([device], releases);
    expect(store.getSnapshot().logs["KF-1"]?.[0]?.version).toBe("v2.3.1");
  });

  it("applies an update and notifies subscribers", () => {
    const store = createDeviceCatalogStore([device], releases);
    let heard = 0;
    store.subscribe(() => {
      heard += 1;
    });

    const updated = store.applyUpdate(
      "KF-1",
      { version: "v2.4.0", notes: "Battery", uploadedBy: "Sarah Chen", date: "2025-12-10" },
      new Date("2026-09-10T12:00:00.000Z"),
    );

    expect(heard).toBe(1);
    expect(updated?.firmware).toBe("v2.4.0");
    expect(store.getSnapshot().devices[0]?.status).toBe("updated");
    expect(store.getSnapshot().logs["KF-1"]?.[0]?.version).toBe("v2.4.0");
  });

  it("returns null when the device is missing", () => {
    const store = createDeviceCatalogStore([device], releases);
    expect(
      store.applyUpdate("nope", { version: "v2.4.0", notes: "Battery", uploadedBy: "Sarah Chen", date: "2025-12-10" }),
    ).toBeNull();
  });

  it("registers a device with a five-digit hospital token", () => {
    const store = createDeviceCatalogStore([device], releases);
    const result = store.addDevice(
      {
        id: "KF-2",
        city: "London",
        country: "UK",
        region: "europe",
        hospital: "St Mary's Hospital",
        model: "Queen",
        organizationId: "st-marys-hospital",
      },
      () => 0,
    );

    expect(result).toMatchObject({
      ok: true,
      device: {
        id: "KF-2",
        registrationCode: "00000",
        status: "needs-update",
      },
    });
    expect(store.getSnapshot().devices).toHaveLength(2);
    expect(store.getSnapshot().logs["KF-2"]).toEqual([]);
  });

  it("rejects a duplicate device ID case-insensitively", () => {
    const store = createDeviceCatalogStore([device], releases);
    const result = store.addDevice({
      id: "kf-1",
      city: "London",
      country: "UK",
      region: "europe",
      hospital: "St Mary's Hospital",
      model: "Queen",
      organizationId: "st-marys-hospital",
    });

    expect(result).toMatchObject({ ok: false, code: "duplicate_device" });
    expect(store.getSnapshot().devices).toHaveLength(1);
  });

  it("returns an expected error when token generation is exhausted", () => {
    const existing = { ...device, registrationCode: "00000" };
    const store = createDeviceCatalogStore([existing], releases);
    const result = store.addDevice(
      {
        id: "KF-2",
        city: "London",
        country: "UK",
        region: "europe",
        hospital: "St Mary's Hospital",
        model: "Queen",
        organizationId: "st-marys-hospital",
      },
      () => 0,
    );

    expect(result).toMatchObject({ ok: false, code: "code_generation_failed" });
    expect(store.getSnapshot().devices).toHaveLength(1);
  });

  it("stores a hospital token the caller already showed", () => {
    const store = createDeviceCatalogStore([device], releases);
    const result = store.addDevice({
      id: "KF-2",
      city: "London",
      country: "UK",
      region: "europe",
      hospital: "St Mary's Hospital",
      model: "Queen",
      organizationId: "st-marys-hospital",
      registrationCode: "48291",
    });

    expect(result).toMatchObject({ ok: true, device: { registrationCode: "48291" } });
  });

  it("rejects a hospital token that is already in use", () => {
    const existing = { ...device, registrationCode: "48291" };
    const store = createDeviceCatalogStore([existing], releases);
    const result = store.addDevice({
      id: "KF-2",
      city: "London",
      country: "UK",
      region: "europe",
      hospital: "St Mary's Hospital",
      model: "Queen",
      organizationId: "st-marys-hospital",
      registrationCode: "48291",
    });

    expect(result).toMatchObject({ ok: false, code: "duplicate_code" });
    expect(store.getSnapshot().devices).toHaveLength(1);
  });
});
