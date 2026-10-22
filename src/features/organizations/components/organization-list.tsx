"use client";

import { useState } from "react";

import {
  GroupedList,
  GroupedListEmpty,
  GroupedListRow,
} from "@/features/shell/grouped-list";

import { useOrganizations } from "../hooks/use-organizations";
import {
  filterOrganizations,
  type OrganizationListFilters,
} from "../lib/filter-organizations";
import { OrganizationListToolbar } from "./organization-list-toolbar";

const EMPTY_FILTERS: OrganizationListFilters = {
  search: "",
  sort: "recent",
};

/**
 * Sales directory of customer organisations. Search and sort sit in the
 * same card as the rows, and the rows fill the leftover viewport height.
 */
export function OrganizationList() {
  const { organizations, unseenIds, acknowledgeOrganization } = useOrganizations();
  const [filters, setFilters] = useState<OrganizationListFilters>(EMPTY_FILTERS);
  const rows = filterOrganizations(organizations, filters);
  const searching = filters.search.trim() !== "";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GroupedList
        scroll
        header={
          <div className="border-b border-black/6 px-5 py-3">
            <OrganizationListToolbar filters={filters} onFiltersChange={setFilters} />
          </div>
        }
      >
        {rows.length === 0 ? (
          <GroupedListEmpty>
            {searching ? "No organisations match" : "No organisations yet"}
          </GroupedListEmpty>
        ) : (
          rows.map((organization) => (
            <GroupedListRow
              key={organization.id}
              href={`/sales/organizations/${organization.id}`}
              title={organization.name}
              subtitle={`${organization.city}, ${organization.country}`}
              trailing={<UserCountChip count={organization.users.length} />}
              className={
                unseenIds.has(organization.id)
                  ? "bg-brand-yellow-tint hover:bg-brand-yellow/30"
                  : undefined
              }
              onClick={() => acknowledgeOrganization(organization.id)}
            />
          ))
        )}
      </GroupedList>
    </div>
  );
}

/**
 * Trailing count on an organisation row, in the same slot as a device status chip.
 *
 * @param count - Hospital-side users on the organisation
 */
function UserCountChip({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-0.5 text-xs font-medium text-foreground">
      <span className="size-1.5 rounded-full bg-foreground/40" aria-hidden="true" />
      {count === 1 ? "1 user" : `${count} users`}
    </span>
  );
}
