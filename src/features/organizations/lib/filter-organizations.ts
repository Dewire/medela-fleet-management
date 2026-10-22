import type { Organization } from "../types";

/** How the organisation list is ordered. */
export type OrganizationSort = "name" | "recent";

/** Search text and sort for the organisation list. */
export type OrganizationListFilters = {
  search: string;
  sort: OrganizationSort;
};

/**
 * Returns organisations matching the search, in the requested order.
 * An empty search leaves the directory unfiltered. Search looks at hospital
 * name, city, and country. The input order is creation order, oldest first,
 * which "recent" reverses.
 *
 * @param organizations - Directory to filter, oldest first
 * @param filters - Current search and sort
 * @returns Matching organisations in display order
 */
export function filterOrganizations(
  organizations: readonly Organization[],
  filters: OrganizationListFilters,
): Organization[] {
  const search = filters.search.trim().toLowerCase();
  const matches = search
    ? organizations.filter((organization) => matchesSearch(organization, search))
    : [...organizations];
  return sortOrganizations(matches, filters.sort);
}

function sortOrganizations(
  organizations: readonly Organization[],
  sort: OrganizationSort,
): Organization[] {
  if (sort === "recent") return [...organizations].reverse();
  return [...organizations].sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
  );
}

function matchesSearch(organization: Organization, search: string): boolean {
  return [organization.name, organization.city, organization.country].some((value) =>
    value.toLowerCase().includes(search),
  );
}
