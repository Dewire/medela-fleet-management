import { describe, expect, it } from "vitest";

import type { WorldDevice } from "../types";
import { emptyDeviceFilters } from "./device-filters";
import { suggestFilterRelaxation } from "./suggest-filter-relaxation";

function makeDevice(overrides: Partial<WorldDevice> & { id: string }): WorldDevice {
  return {
    city: "Berlin",
    country: "Germany",
    region: "europe",
    status: "updated",
    hospital: "Charité",
    firmware: "v2.4.0",
    model: "Symphony",
    ...overrides,
  };
}

const devices: WorldDevice[] = [
  makeDevice({ id: "KF-1", status: "needs-update" }),
  makeDevice({ id: "KF-2", city: "Tokyo", status: "updated" }),
  makeDevice({ id: "KF-3", city: "Munich", status: "updated" }),
];

const openFilters = emptyDeviceFilters();

describe("suggestFilterRelaxation", () => {
  it("returns null when no filter is active", () => {
    expect(suggestFilterRelaxation(devices, openFilters)).toBeNull();
  });

  it("suggests clearing status when that status matches nothing", () => {
    const result = suggestFilterRelaxation(devices, {
      ...openFilters,
      status: "failed",
    });

    expect(result).toEqual({ key: "status", facetLabel: "Status", count: 3 });
  });

  it("picks the removal that reveals the most devices", () => {
    const result = suggestFilterRelaxation(devices, {
      ...openFilters,
      status: "failed",
      search: "KF-2",
    });

    // Clearing status leaves KF-2; clearing search still matches none.
    expect(result).toEqual({ key: "status", facetLabel: "Status", count: 1 });
  });

  it("breaks a tie in favour of the less intentional filter", () => {
    const result = suggestFilterRelaxation(devices, {
      ...openFilters,
      status: "needs-update",
      search: "KF-2",
    });

    expect(result?.key).toBe("status");
    expect(result?.count).toBe(1);
  });

  it("returns null when no single removal reveals anything", () => {
    const result = suggestFilterRelaxation(devices, {
      ...openFilters,
      status: "failed",
      search: "zzz",
    });

    expect(result).toBeNull();
  });

  it("returns null for an empty fleet", () => {
    expect(suggestFilterRelaxation([], { ...openFilters, status: "failed" })).toBeNull();
  });
});
