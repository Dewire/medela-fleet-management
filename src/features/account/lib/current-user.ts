import { ACCOUNT_USERS } from "../data/users";
import type { AccountUser, PortalRole } from "../types";

/** Sign-in form. Log out returns here because there is no session to clear. */
export const SIGN_OUT_HREF = "/login/medela";

/** Routes owned by one prototype portal. */
export type PortalHrefs = {
  home: string;
  profile: string;
};

const PORTAL_HREFS: Record<PortalRole, PortalHrefs> = {
  internal: { home: "/internal", profile: "/internal/profile" },
  sales: { home: "/sales", profile: "/sales/profile" },
  biomed: { home: "/biomed", profile: "/biomed/profile" },
};

/**
 * Returns the fixture identity for a prototype portal.
 *
 * @param role - Portal whose account should be displayed
 * @returns Account fixture for the requested role
 */
export function getAccountUser(role: PortalRole = "internal"): AccountUser {
  return ACCOUNT_USERS[role];
}

/**
 * Returns home and profile links for a prototype portal.
 *
 * @param role - Portal whose links should be returned
 * @returns Stable links for the portal
 */
export function getPortalHrefs(role: PortalRole = "internal"): PortalHrefs {
  return PORTAL_HREFS[role];
}
