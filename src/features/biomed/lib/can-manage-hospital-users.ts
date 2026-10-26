import type { OrganizationUser } from "@/features/organizations/types";

import { isHospitalAdmin } from "./is-hospital-admin";

/**
 * Whether this account can open the hospital Users list and invite.
 * The Biomed fixture stays allowed when the hospital is missing or they
 * are not in the directory yet, so First time onboarding is not locked.
 *
 * @param users - People already assigned to the hospital
 * @param email - Account email to look up; comparison ignores case
 * @param fixtureEmail - Signed-in Biomed fixture email
 * @returns true when that person may manage users
 */
export function canManageHospitalUsers(
  users: readonly Pick<OrganizationUser, "email" | "role">[],
  email: string,
  fixtureEmail: string,
): boolean {
  if (isHospitalAdmin(users, email)) return true;
  const normalized = email.trim().toLowerCase();
  const fixture = fixtureEmail.trim().toLowerCase();
  if (normalized === "" || normalized !== fixture) return false;
  return !users.some((user) => user.email.toLowerCase() === normalized);
}
