/** Access level for a hospital-side user. Admins manage the hospital account. */
export type OrganizationUserRole = "admin" | "user";

/**
 * A directory user assigned to one customer organisation.
 */
export type OrganizationUser = {
  id: string;
  name: string;
  email: string;
  role: OrganizationUserRole;
  organizationId: string;
};

/**
 * Sales person recorded as the creator of an organisation.
 */
export type OrganizationCreator = {
  name: string;
  initials: string;
  /** Email and team, shown under the name. */
  detail: string;
  /** Calendar date the organisation was created, `YYYY-MM-DD`. */
  createdOn: string;
};

/**
 * Customer organisation managed by Medela Sales.
 */
export type Organization = {
  id: string;
  name: string;
  city: string;
  country: string;
  users: OrganizationUser[];
  createdBy: OrganizationCreator;
};
