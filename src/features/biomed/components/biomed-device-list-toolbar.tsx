"use client";

import { SearchField } from "@/features/shell/search-field";
import { SegmentedControl } from "@/features/shell/segmented-control";

import type { BiomedDeviceFilters } from "../lib/filter-biomed-devices";

const STATUS_SEGMENTS = [
  ["all", "All"],
  ["updated", "Updated"],
  ["needs-update", "Needs update"],
  ["failed", "Failed"],
] as const;

/**
 * Filter bar for the Biomed device list: search and status.
 *
 * @param filters - Current search and status
 * @param onFiltersChange - Receives the full next filter state
 */
export function BiomedDeviceListToolbar({
  filters,
  onFiltersChange,
}: {
  filters: BiomedDeviceFilters;
  onFiltersChange: (next: BiomedDeviceFilters) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchField
        value={filters.search}
        onChange={(search) => onFiltersChange({ ...filters, search })}
        placeholder="Search ID, model"
      />
      <SegmentedControl
        value={filters.status}
        onChange={(status) => onFiltersChange({ ...filters, status })}
        options={STATUS_SEGMENTS}
        label="Filter by status"
      />
    </div>
  );
}
