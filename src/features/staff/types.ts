/** Access level for a Medela staff account on the Internal Users list. */
export type MedelaStaffRole = "admin" | "sales" | "software_update";

/**
 * A Medela employee invited to Fleet Management.
 */
export type MedelaStaffUser = {
  id: string;
  name: string;
  email: string;
  role: MedelaStaffRole;
};
