import type { PortalRole } from "@/features/account/types";

/** One role-specific portal navigation item. */
export type PortalTab = {
  id: string;
  label: string;
  href: string;
};

const PORTAL_TABS: Record<Exclude<PortalRole, "internal">, readonly PortalTab[]> = {
  sales: [
    { id: "organizations", label: "Organisations", href: "/sales" },
  ],
  biomed: [{ id: "devices", label: "Devices", href: "/biomed" }],
};

/**
 * Returns navigation items for a non-Internal portal.
 *
 * @param role - Sales or Biomed portal
 * @returns Stable role-specific navigation items
 */
export function getPortalTabs(
  role: Exclude<PortalRole, "internal">,
): readonly PortalTab[] {
  return PORTAL_TABS[role];
}

/**
 * Resolves the selected navigation item for a role and path.
 *
 * @param role - Sales or Biomed portal
 * @param pathname - Current URL path
 * @returns Selected tab id
 */
export function resolvePortalTab(
  role: Exclude<PortalRole, "internal">,
  pathname: string,
): string {
  if (role === "biomed" && pathname.startsWith("/biomed")) return "devices";
  return role === "sales" ? "organizations" : "devices";
}
