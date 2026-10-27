import { describe, expect, it } from "vitest";

import type { WorldDevice } from "../types";
import { devicesForOrganization } from "./devices-for-organization";

const devices: WorldDevice[] = [
  {
    id: "KF-1",
    city: "London",
    country: "UK",
    region: "europe",
    status: "needs-update",
    hospital: "St Mary's Hospital",
    firmware: "Not installed",
    model: "Queen",
    organizationId: "st-marys-hospital",
    registrationCode: "EU-K7M2Q9XR4DP",
  },
  {
    id: "KF-2",
    city: "Berlin",
    country: "Germany",
    region: "europe",
    status: "updated",
    hospital: "Charité",
    firmware: "v2.4.0",
    model: "Symphony",
  },
];

describe("devicesForOrganization", () => {
  it("returns devices registered to the requested organisation", () => {
    expect(devicesForOrganization(devices, "st-marys-hospital")).toEqual([
      devices[0],
    ]);
  });

  it("returns an empty list when no registered device matches", () => {
    expect(devicesForOrganization(devices, "missing")).toEqual([]);
  });

  it("does not mutate the catalog", () => {
    devicesForOrganization(devices, "st-marys-hospital");
    expect(devices).toHaveLength(2);
  });
});
