"use client";

import { useState } from "react";

import { useFirmwareReleases } from "@/features/firmware/hooks/use-firmware-releases";
import { filterFirmwareReleases, hasActiveFirmwareSearch } from "@/features/firmware/lib/filter-releases";
import { FirmwareHistorySubtitle } from "@/features/firmware/components/firmware-history-subtitle";
import { GroupedList, GroupedListEmpty, GroupedListRow } from "@/features/shell/grouped-list";
import { SearchField } from "@/features/shell/search-field";

/**
 * Grouped firmware history for Medela staff. Rows show release notes and who
 * uploaded the package.
 */
export function FirmwareHistoryTable() {
  const { releases } = useFirmwareReleases();
  const [search, setSearch] = useState("");
  const rows = filterFirmwareReleases(releases, search);
  const active = hasActiveFirmwareSearch(search);

  return (
    <GroupedList
      scroll
      header={
        <div className="border-b border-black/6 px-5 py-3">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search version, notes, or uploader"
          />
        </div>
      }
      footer={
        <span role="status">
          {`Showing ${rows.length} of ${releases.length} releases${active ? " · filtered" : ""}`}
        </span>
      }
    >
      {releases.length === 0 ? (
        <GroupedListEmpty>No releases yet</GroupedListEmpty>
      ) : rows.length === 0 ? (
        <GroupedListEmpty>No releases match</GroupedListEmpty>
      ) : (
        rows.map((release, index) => (
          <GroupedListRow
            key={`${release.version}-${release.deviceType}-${index}`}
            href={`/internal/firmware/${release.version}?deviceType=${encodeURIComponent(release.deviceType)}`}
            title={release.version}
            subtitle={
              <FirmwareHistorySubtitle notes={release.notes} uploadedBy={release.uploadedBy} />
            }
          />
        ))
      )}
    </GroupedList>
  );
}
