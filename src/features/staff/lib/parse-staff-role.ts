import type { MedelaStaffRole } from "../types";

/**
 * Maps a select value to a Medela staff role.
 * Unknown values fall back to Admin so the form stays on a valid option.
 *
 * @param value - Option value from the role select
 */
export function parseStaffRole(value: string): MedelaStaffRole {
  if (value === "sales" || value === "software_update") return value;
  return "admin";
}
