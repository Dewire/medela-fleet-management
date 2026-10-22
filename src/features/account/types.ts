/** Route-scoped prototype workspace. */
export type PortalRole = "internal" | "sales" | "biomed";

/**
 * Prototype signed-in user shown in the header menu and account pages.
 */
export type AccountUser = {
  name: string;
  email: string;
  roleLabel: string;
  organization: string;
  initials: string;
  portalRole: PortalRole;
};
