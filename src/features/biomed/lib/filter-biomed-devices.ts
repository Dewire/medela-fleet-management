import { filterWorldDevices } from "@/features/devices/lib/filter-devices";
import type { WorldDevice } from "@/features/devices/types";
import { ALL_FILTER_VALUE } from "@/lib/filters";

/** Search text and status for the Biomed device list. */
export type BiomedDeviceFilters = {
  search: string;
  status: string;
};

/**
 * Returns hospital devices matching the search and status.
 * An empty search and status `"all"` leave the list unfiltered. Search looks
 * at device ID and model. Registration order is oldest first; the list shows
 * the newest device first.
 *
 * @param devices - Hospital devices, oldest first
 * @param filters - Current search and status
 * @returns Matching devices, newest first
 */
export function filterBiomedDevices(
  devices: readonly WorldDevice[],
  filters: BiomedDeviceFilters,
): WorldDevice[] {
  return filterWorldDevices([...devices].reverse(), {
    search: filters.search,
    status: filters.status || ALL_FILTER_VALUE,
  });
}
