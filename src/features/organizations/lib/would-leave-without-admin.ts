import type { OrganizationUserRole } from "../types";

/**
 * Whether assigning this role would leave the hospital with no admin.
 *
 * @param users - Current hospital directory
 * @param userId - Person whose role would change
 * @param nextRole - Role they would receive
 * @returns true when no other admin would remain
 */
export function wouldLeaveWithoutAdmin(
  users: readonly { id: string; role: OrganizationUserRole }[],
  userId: string,
  nextRole: OrganizationUserRole,
): boolean {
  if (nextRole === "admin") return false;
  return !users.some((user) => user.id !== userId && user.role === "admin");
}
