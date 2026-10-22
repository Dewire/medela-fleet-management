import type { OrganizationUser } from "@/features/organizations/types";

/**
 * Whether an email belongs to an admin in this hospital directory.
 *
 * @param users - People already assigned to the hospital
 * @param email - Account email to look up; comparison ignores case
 * @returns true when that person is an admin
 */
export function isHospitalAdmin(
  users: readonly Pick<OrganizationUser, "email" | "role">[],
  email: string,
): boolean {
  const normalized = email.trim().toLowerCase();
  return users.some(
    (user) => user.email.toLowerCase() === normalized && user.role === "admin",
  );
}
