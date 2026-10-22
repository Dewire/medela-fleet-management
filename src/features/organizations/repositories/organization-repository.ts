import { ORGANIZATIONS } from "../data/organizations";
import type { Organization } from "../types";

/**
 * Returns cloned organisation fixtures for the in-memory catalog.
 */
export function listOrganizations(): Organization[] {
  return ORGANIZATIONS.map((organization) => ({
    ...organization,
    users: organization.users.map((user) => ({ ...user })),
  }));
}
