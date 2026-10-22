"use client";

import { SearchField } from "@/features/shell/search-field";
import { SegmentedControl } from "@/features/shell/segmented-control";

import type { OrganizationListFilters, OrganizationSort } from "../lib/filter-organizations";

const SORT_OPTIONS = [
  ["name", "A–Z"],
  ["recent", "Most recent"],
] as const satisfies ReadonlyArray<readonly [OrganizationSort, string]>;

/**
 * Filter bar for the organisation list: search and sort.
 *
 * @param filters - Current search and sort
 * @param onFiltersChange - Receives the full next filter state
 */
export function OrganizationListToolbar({
  filters,
  onFiltersChange,
}: {
  filters: OrganizationListFilters;
  onFiltersChange: (next: OrganizationListFilters) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchField
        value={filters.search}
        onChange={(search) => onFiltersChange({ ...filters, search })}
        placeholder="Search hospital, city"
      />
      <SegmentedControl
        value={filters.sort}
        onChange={(sort) => onFiltersChange({ ...filters, sort: sort as OrganizationSort })}
        options={SORT_OPTIONS}
        label="Sort organisations"
      />
    </div>
  );
}
