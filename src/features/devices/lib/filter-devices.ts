import { ALL_FILTER_VALUE as ALL } from "@/lib/filters";

import type { DeviceFilters, WorldDevice } from "../types";

/**
 * Returns devices matching status and search. Search looks at ID and model.
 * `"all"` and an empty search are treated as no-ops so the default view is
 * the full fleet.
 *
 * @param devices - Fleet devices to filter
 * @param filters - Status and free-text search
 * @returns Devices that satisfy every non-default filter
 */
export function filterWorldDevices(
  devices: WorldDevice[],
  filters: DeviceFilters,
): WorldDevice[] {
  const search = filters.search.trim().toLowerCase();

  return devices.filter((device) => {
    if (filters.status !== ALL && device.status !== filters.status) return false;
    if (search && !matchesSearch(device, search)) return false;
    return true;
  });
}

/**
 * True when any filter is more specific than the default "show all" state.
 */
export function hasActiveDeviceFilters(filters: DeviceFilters): boolean {
  return filters.status !== ALL || filters.search.trim() !== "";
}

function matchesSearch(device: WorldDevice, search: string): boolean {
  return (
    device.id.toLowerCase().includes(search) ||
    device.model.toLowerCase().includes(search)
  );
}
