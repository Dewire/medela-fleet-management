import { deviceCatalogStore } from "@/features/devices/lib/device-catalog-store";
import type { WorldDevice } from "@/features/devices/types";
import { listWorldDevices } from "@/features/devices/repositories/device-repository";
import { firmwareReleaseStore } from "@/features/firmware/lib/firmware-release-store";
import type { FirmwareRelease } from "@/features/firmware/types";
import { listFirmwareReleases } from "@/features/firmware/repositories/firmware-repository";
import { organizationStore } from "@/features/organizations/lib/organization-store";
import type { Organization } from "@/features/organizations/types";
import { listOrganizations } from "@/features/organizations/repositories/organization-repository";
import { STAFF_USERS } from "@/features/staff/data/staff";
import { staffStore } from "@/features/staff/lib/staff-store";
import type { MedelaStaffUser } from "@/features/staff/types";
import {
  biomedNavCountStore,
  fleetNavCountStore,
} from "@/features/shell/lib/fleet-nav-count-store";

/** Whether lists show onboarding emptiness or the fixture catalogs. */
export type DemoDataMode = "first-time" | "populated";

const DEFAULT_MODE: DemoDataMode = "populated";

/** Catalogs the First time / Populated switch resets together. */
export type DemoDataCatalogs = {
  devices: {
    replace: (
      devices: readonly WorldDevice[],
      releases?: readonly FirmwareRelease[],
    ) => void;
  };
  firmware: { replace: (releases: readonly FirmwareRelease[]) => void };
  organizations: { replace: (organizations: readonly Organization[]) => void };
  staff: { replace: (users: readonly MedelaStaffUser[]) => void };
};

const defaultCatalogs: DemoDataCatalogs = {
  devices: deviceCatalogStore,
  firmware: firmwareReleaseStore,
  organizations: organizationStore,
  staff: staffStore,
};

let mode: DemoDataMode = DEFAULT_MODE;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/**
 * Applies a demo-data mode to the live catalogs.
 * First time empties them. Populated restores the fixture lists.
 * In-session adds are discarded.
 *
 * @param next - Mode to switch to
 * @param catalogs - Stores to reset; omit to use the app singletons
 */
export function applyDemoDataMode(
  next: DemoDataMode,
  catalogs: DemoDataCatalogs = defaultCatalogs,
): void {
  if (next === "first-time") {
    catalogs.devices.replace([]);
    catalogs.firmware.replace([]);
    catalogs.organizations.replace([]);
    catalogs.staff.replace([]);
    return;
  }

  const releases = listFirmwareReleases();
  catalogs.devices.replace(listWorldDevices(), releases);
  catalogs.firmware.replace(releases);
  catalogs.organizations.replace(listOrganizations());
  catalogs.staff.replace(STAFF_USERS);
}

/**
 * Current First time / Populated selection.
 */
export function getDemoDataMode(): DemoDataMode {
  return mode;
}

/**
 * Subscribe to demo-mode changes. Returns an unsubscribe function.
 */
export function subscribeDemoDataMode(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Switches demo mode, resets the catalogs, and notifies the header slider.
 *
 * @param next - Mode the slider selected
 */
export function setDemoDataMode(next: DemoDataMode): void {
  if (next === mode) return;
  mode = next;
  applyDemoDataMode(next);
  const deviceCount = next === "first-time" ? 0 : undefined;
  const deviceLabel = next === "first-time" ? "0 devices" : undefined;
  fleetNavCountStore.set(deviceCount, deviceLabel);
  biomedNavCountStore.set(deviceCount, deviceLabel);
  emit();
}
