import type { AccountUser, PortalRole } from "../types";

/**
 * Prototype account fixtures keyed by portal role. Route wrappers choose the
 * active fixture; there is no real session.
 */
export const ACCOUNT_USERS: Record<PortalRole, AccountUser> = {
  internal: {
    name: "Sarah Chen",
    email: "sarah.chen@medela.com",
    roleLabel: "Medela Internal",
    organization: "Clinical Engineering",
    initials: "SC",
    portalRole: "internal",
  },
  sales: {
    name: "Maya Patel",
    email: "maya.patel@medela.com",
    roleLabel: "Medela Sales",
    organization: "Medela",
    initials: "MP",
    portalRole: "sales",
  },
  biomed: {
    name: "Alex Morgan",
    email: "alex.morgan@stmarys.example",
    roleLabel: "Biomed",
    organization: "St Mary's Hospital",
    initials: "AM",
    portalRole: "biomed",
  },
};
