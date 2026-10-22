"use client";

import { useState } from "react";

import { BIOMED_ORGANIZATION } from "@/features/biomed/constants";
import { StatusChip } from "@/features/devices/components/status-chip";
import { useDeviceCatalog } from "@/features/devices/hooks/use-device-catalog";
import { devicesForOrganization } from "@/features/devices/lib/devices-for-organization";
import {
  GroupedList,
  GroupedListEmpty,
  GroupedListRow,
} from "@/features/shell/grouped-list";
import { usePublishBiomedNavDeviceCount } from "@/features/shell/hooks/use-fleet-nav-device-count";
import { ALL_FILTER_VALUE } from "@/lib/filters";

import { filterBiomedDevices, type BiomedDeviceFilters } from "../lib/filter-biomed-devices";
import { BiomedDeviceListToolbar } from "./biomed-device-list-toolbar";

const EMPTY_FILTERS: BiomedDeviceFilters = {
  search: "",
  status: ALL_FILTER_VALUE,
};

/**
 * Devices registered to the Biomed hospital. Search and status sit in the same
 * card as the rows, and the rows fill the leftover viewport height. The
 * Devices tab count is the visible row count.
 */
export function BiomedDeviceList() {
  const { devices } = useDeviceCatalog();
  const [filters, setFilters] = useState<BiomedDeviceFilters>(EMPTY_FILTERS);
  const hospitalDevices = devicesForOrganization(devices, BIOMED_ORGANIZATION.id);
  const rows = filterBiomedDevices(hospitalDevices, filters);
  const filtering = filters.search.trim() !== "" || filters.status !== ALL_FILTER_VALUE;
  const deviceCountLabel = filtering
    ? `${rows.length} of ${hospitalDevices.length} devices match the filters`
    : `${hospitalDevices.length} devices`;

  usePublishBiomedNavDeviceCount(rows.length, deviceCountLabel);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GroupedList
        scroll
        header={
          <div className="border-b border-black/6 px-5 py-3">
            <BiomedDeviceListToolbar filters={filters} onFiltersChange={setFilters} />
          </div>
        }
      >
        {rows.length === 0 ? (
          <GroupedListEmpty>{filtering ? "No devices match" : "No devices yet"}</GroupedListEmpty>
        ) : (
          rows.map((device) => (
            <GroupedListRow
              key={device.id}
              href={`/biomed/devices/${encodeURIComponent(device.id)}`}
              title={device.id}
              subtitle={device.model}
              trailing={<StatusChip status={device.status} />}
            />
          ))
        )}
      </GroupedList>
    </div>
  );
}
