import { describe, expect, it } from "vitest";

import type { DeviceFilters, WorldDevice } from "../types";
import { filterWorldDevices, hasActiveDeviceFilters } from "./filter-devices";

const devices: WorldDevice[] = [
  {
    id: "KF-1",
    city: "Berlin",
    country: "Germany",
    region: "europe",
    status: "needs-update",
    hospital: "Charité — NICU Ward 3",
    firmware: "v2.3.1",
    model: "Symphony",
  },
  {
    id: "KF-2",
    city: "Tokyo",
    country: "Japan",
    region: "asia-pacific",
    status: "updated",
    hospital: "Tokyo University Hospital",
    firmware: "v2.4.0",
    model: "Swing Maxi",
  },
];

const openFilters: DeviceFilters = {
  status: "all",
  search: "",
};

describe("filterWorldDevices", () => {
  it("returns every device when all filters are default", () => {
    expect(filterWorldDevices(devices, openFilters)).toHaveLength(2);
  });

  it("returns only devices with the selected status", () => {
    const result = filterWorldDevices(devices, { ...openFilters, status: "updated" });
    expect(result.map((device) => device.id)).toEqual(["KF-2"]);
  });

  it("returns an empty list when no device matches the search", () => {
    const result = filterWorldDevices(devices, { ...openFilters, search: "zzz" });
    expect(result).toEqual([]);
  });

  it("matches a device ID through search", () => {
    const result = filterWorldDevices(devices, { ...openFilters, search: "kf-1" });
    expect(result.map((device) => device.id)).toEqual(["KF-1"]);
  });

  it("matches a model name through search", () => {
    const result = filterWorldDevices(devices, { ...openFilters, search: "swing" });
    expect(result.map((device) => device.id)).toEqual(["KF-2"]);
  });

  it("does not match a city name", () => {
    const result = filterWorldDevices(devices, { ...openFilters, search: "berlin" });
    expect(result).toEqual([]);
  });

  it("does not match a hospital name", () => {
    const result = filterWorldDevices(devices, { ...openFilters, search: "charité" });
    expect(result).toEqual([]);
  });
});

describe("hasActiveDeviceFilters", () => {
  it("returns false for the default filter set", () => {
    expect(hasActiveDeviceFilters(openFilters)).toBe(false);
  });

  it("returns true when search has non-whitespace text", () => {
    expect(hasActiveDeviceFilters({ ...openFilters, search: " berlin " })).toBe(true);
  });

  it("returns true when a status is selected", () => {
    expect(hasActiveDeviceFilters({ ...openFilters, status: "failed" })).toBe(true);
  });
});
