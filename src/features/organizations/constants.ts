import type { OrganizationUserRole } from "./types";

/** Display label for each hospital-side user role. */
export const ORGANIZATION_USER_ROLE_LABELS: Record<OrganizationUserRole, string> = {
  admin: "Admin",
  user: "User",
};

/** Role choices for the add-user form. User comes first so it is the default. */
export const ORGANIZATION_USER_ROLE_OPTIONS = [
  ["user", ORGANIZATION_USER_ROLE_LABELS.user],
  ["admin", ORGANIZATION_USER_ROLE_LABELS.admin],
] as const satisfies ReadonlyArray<readonly [OrganizationUserRole, string]>;
