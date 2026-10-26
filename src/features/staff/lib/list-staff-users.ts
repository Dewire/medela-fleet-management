import type { MedelaStaffUser } from "../types";

/**
 * Copies the staff directory and sorts it A to Z by name.
 *
 * @param users - People currently in the catalog
 * @returns A new array ordered by name
 */
export function listStaffUsers(users: readonly MedelaStaffUser[]): MedelaStaffUser[] {
  return [...users].sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
  );
}
