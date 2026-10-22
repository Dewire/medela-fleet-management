import type { Organization, OrganizationUser } from "../types";

/** One hospital user plus the hospital they belong to. */
export type HospitalDirectoryEntry = {
  user: OrganizationUser;
  hospitalName: string;
};

/**
 * Flattens every hospital directory into one list, sorted by name.
 *
 * @param organizations - Hospitals and their users
 * @returns People across hospitals, A to Z by name
 */
export function listHospitalDirectory(
  organizations: readonly Organization[],
): HospitalDirectoryEntry[] {
  return organizations
    .flatMap((organization) =>
      organization.users.map((user) => ({
        user,
        hospitalName: organization.name,
      })),
    )
    .sort((left, right) =>
      left.user.name.localeCompare(right.user.name, undefined, { sensitivity: "base" }),
    );
}
