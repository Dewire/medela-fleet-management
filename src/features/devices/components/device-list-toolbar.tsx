"use client";

import { describeDeviceFilters } from "@/features/devices/lib/describe-filters";
import {
  emptyDeviceFilters,
  resetDeviceFilter,
  type DeviceFilterKey,
} from "@/features/devices/lib/device-filters";
import type { DeviceFilters } from "@/features/devices/types";
import { ActiveFilterChips } from "@/features/shell/active-filter-chips";
import { SearchField } from "@/features/shell/search-field";
import { SegmentedControl } from "@/features/shell/segmented-control";

/**
 * Status is the primary triage axis, so it stays visible on the toolbar.
 */
const STATUS_SEGMENTS = [
  ["all", "All"],
  ["updated", "Updated"],
  ["needs-update", "Needs update"],
  ["failed", "Failed"],
] as const;

/**
 * Filter bar for the fleet device list: search and status segments.
 *
 * @param filters - Current filter state
 * @param onFiltersChange - Receives the full next filter state
 */
export function DeviceListToolbar({
  filters,
  onFiltersChange,
}: {
  filters: DeviceFilters;
  onFiltersChange: (next: DeviceFilters) => void;
}) {
  function update(partial: Partial<DeviceFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  return (
    <div className="flex shrink-0 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <SearchField
          value={filters.search}
          onChange={(search) => update({ search })}
          placeholder="Search ID, model"
        />
        <SegmentedControl
          value={filters.status}
          onChange={(status) => update({ status })}
          options={STATUS_SEGMENTS}
          label="Filter by status"
        />
      </div>
      <ActiveFilterChips
        filters={describeDeviceFilters(filters)}
        onRemove={(key: DeviceFilterKey) => onFiltersChange(resetDeviceFilter(filters, key))}
        onClearAll={() => onFiltersChange(emptyDeviceFilters())}
      />
    </div>
  );
}
