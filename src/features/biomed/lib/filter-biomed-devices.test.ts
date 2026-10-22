import { describe, expect, it } from "vitest";

import type { DeviceStatus, WorldDevice } from "@/features/devices/types";

import { filterBiomedDevices } from "./filter-biomed-devices";

const devices: WorldDevice[] = [
  device("KF-2024-01421", "Symphony", "needs-update"),
  device("KF-2023-00512", "Queen", "updated"),
  device("KF-2024-00931", "Freestyle Hands-free", "failed"),
];

describe("filterBiomedDevices", () => {
  it("returns every device newest first when nothing is filtered", () => {
    const rows = filterBiomedDevices(devices, { search: "  ", status: "all" });
    expect(rows.map((row) => row.id)).toEqual([
      "KF-2024-00931",
      "KF-2023-00512",
      "KF-2024-01421",
    ]);
  });

  it("matches a device id regardless of case", () => {
    const rows = filterBiomedDevices(devices, { search: "00931", status: "all" });
    expect(rows.map((row) => row.id)).toEqual(["KF-2024-00931"]);
  });

  it("matches a model", () => {
    const rows = filterBiomedDevices(devices, { search: "symphony", status: "all" });
    expect(rows.map((row) => row.id)).toEqual(["KF-2024-01421"]);
  });

  it("does not match a city", () => {
    const rows = filterBiomedDevices(devices, { search: "london", status: "all" });
    expect(rows).toEqual([]);
  });

  it("keeps only devices with the selected status", () => {
    const rows = filterBiomedDevices(devices, { search: "", status: "updated" });
    expect(rows.map((row) => row.id)).toEqual(["KF-2023-00512"]);
  });

  it("returns nothing when the status matches no device", () => {
    const updatedOnly = devices.filter((item) => item.status === "updated");
    const rows = filterBiomedDevices(updatedOnly, { search: "", status: "failed" });
    expect(rows).toEqual([]);
  });
});

function device(id: string, model: string, status: DeviceStatus): WorldDevice {
  return {
    id,
    model,
    city: "London",
    country: "UK",
    region: "europe",
    status,
    hospital: "St Mary's Hospital",
    firmware: "Not installed",
  };
}
