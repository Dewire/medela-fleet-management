import { describe, expect, it } from "vitest";

import { createDeviceCatalogStore } from "@/features/devices/lib/device-catalog-store";
import { listWorldDevices } from "@/features/devices/repositories/device-repository";
import { createFirmwareReleaseStore } from "@/features/firmware/lib/firmware-release-store";
import { listFirmwareReleases } from "@/features/firmware/repositories/firmware-repository";
import { createOrganizationStore } from "@/features/organizations/lib/organization-store";
import { listOrganizations } from "@/features/organizations/repositories/organization-repository";
import { STAFF_USERS } from "@/features/staff/data/staff";
import { createStaffStore } from "@/features/staff/lib/staff-store";

import { applyDemoDataMode } from "./demo-data-mode";

function catalogsFromFixtures() {
  return {
    devices: createDeviceCatalogStore(listWorldDevices(), listFirmwareReleases()),
    firmware: createFirmwareReleaseStore(listFirmwareReleases()),
    organizations: createOrganizationStore(listOrganizations()),
    staff: createStaffStore(STAFF_USERS),
  };
}

describe("applyDemoDataMode", () => {
  it("empties every catalog for first time", () => {
    const catalogs = catalogsFromFixtures();

    applyDemoDataMode("first-time", catalogs);

    expect(catalogs.devices.getSnapshot().devices).toEqual([]);
    expect(catalogs.firmware.getSnapshot()).toEqual([]);
    expect(catalogs.organizations.getSnapshot()).toEqual([]);
    expect(catalogs.staff.getSnapshot()).toEqual([]);
  });

  it("restores fixture catalogs for populated", () => {
    const catalogs = {
      devices: createDeviceCatalogStore([], []),
      firmware: createFirmwareReleaseStore([]),
      organizations: createOrganizationStore([]),
      staff: createStaffStore([]),
    };

    applyDemoDataMode("populated", catalogs);

    expect(catalogs.devices.getSnapshot().devices).toEqual(listWorldDevices());
    expect(catalogs.firmware.getSnapshot()).toEqual(listFirmwareReleases());
    expect(catalogs.organizations.getSnapshot()).toEqual(listOrganizations());
    expect(catalogs.staff.getSnapshot()).toEqual(STAFF_USERS);
  });
});
