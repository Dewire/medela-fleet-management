import type { MedelaStaffRole } from "./types";

/** Display label for each Medela staff role. */
export const MEDELA_STAFF_ROLE_LABELS: Record<MedelaStaffRole, string> = {
  admin: "Admin",
  sales: "Sales",
  software_update: "Software Update",
};

/** Role choices for the Internal invite form, in the order they appear. */
export const MEDELA_STAFF_ROLE_OPTIONS = [
  ["admin", MEDELA_STAFF_ROLE_LABELS.admin],
  ["sales", MEDELA_STAFF_ROLE_LABELS.sales],
  ["software_update", MEDELA_STAFF_ROLE_LABELS.software_update],
] as const satisfies ReadonlyArray<readonly [MedelaStaffRole, string]>;
