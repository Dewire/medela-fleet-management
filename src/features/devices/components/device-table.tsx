"use client";

import { useState } from "react";

import { DeviceListEmpty } from "@/features/devices/components/device-list-empty";
import { DeviceListToolbar } from "@/features/devices/components/device-list-toolbar";
import { StatusChip } from "@/features/devices/components/status-chip";
import { useDeviceCatalog } from "@/features/devices/hooks/use-device-catalog";
import {
  emptyDeviceFilters,
  resetDeviceFilter,
  type DeviceFilterKey,
} from "@/features/devices/lib/device-filters";
import { filterWorldDevices, hasActiveDeviceFilters } from "@/features/devices/lib/filter-devices";
import type { DeviceFilters } from "@/features/devices/types";
import { usePublishFleetNavDeviceCount } from "@/features/shell/hooks/use-fleet-nav-device-count";
import { GroupedList, GroupedListEmpty, GroupedListRow } from "@/features/shell/grouped-list";

/**
 * Grouped fleet list for Medela staff. Filters and rows share the card so
 * only the rows scroll. The Devices tab count is the visible row count.
 *
 * @param initialStatus - Status preselected by the route, e.g. `failed`
 */
export function DeviceTable({ initialStatus }: { initialStatus: string }) {
  const { devices } = useDeviceCatalog();
  const [filters, setFilters] = useState<DeviceFilters>(() => emptyDeviceFilters(initialStatus));

  const rows = filterWorldDevices(devices, filters);
  const active = hasActiveDeviceFilters(filters);
  const deviceCountLabel = active
    ? `${rows.length} of ${devices.length} devices match the filters`
    : `${devices.length} devices`;

  usePublishFleetNavDeviceCount(rows.length, deviceCountLabel);

  function relax(key: DeviceFilterKey) {
    setFilters((current) => resetDeviceFilter(current, key));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GroupedList
        scroll
        header={
          <div className="border-b border-black/6 px-5 py-3">
            <DeviceListToolbar
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        }
        footer={
          <span role="status">
            {`Showing ${rows.length} of ${devices.length} devices${active ? " · filtered" : ""}`}
          </span>
        }
      >
        {devices.length === 0 ? (
          <GroupedListEmpty>No devices yet</GroupedListEmpty>
        ) : rows.length === 0 ? (
          <DeviceListEmpty
            devices={devices}
            filters={filters}
            onRelax={relax}
            onClearAll={() => setFilters(emptyDeviceFilters())}
          />
        ) : (
          rows.map((device) => (
            <GroupedListRow
              key={device.id}
              href={`/internal/devices/${device.id}`}
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
