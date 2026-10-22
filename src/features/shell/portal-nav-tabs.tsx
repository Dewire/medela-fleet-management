"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { PortalRole } from "@/features/account/types";
import { BIOMED_ORGANIZATION } from "@/features/biomed/constants";
import { useOrganizations } from "@/features/organizations/hooks/use-organizations";
import { useBiomedNavDeviceCount } from "@/features/shell/hooks/use-fleet-nav-device-count";
import {
  getPortalTabs,
  resolvePortalTab,
} from "@/features/shell/lib/portal-tabs";
import { tabCountClass, tabLinkClass } from "@/features/shell/lib/tab-link-class";

/**
 * Horizontal navigation for Sales and Biomed workspaces.
 *
 * @param role - Non-Internal portal whose tabs should be shown
 * @param action - Optional control aligned to the trailing edge of the tab bar
 */
export function PortalNavTabs({
  role,
  action,
}: {
  role: Exclude<PortalRole, "internal">;
  action?: React.ReactNode;
}) {
  const pathname = usePathname();
  const selected = resolvePortalTab(role, pathname);
  const { count: deviceCount, label: deviceCountLabel } = useBiomedNavDeviceCount();
  const { organizations } = useOrganizations();
  const hospitalUsers = organizations.find((item) => item.id === BIOMED_ORGANIZATION.id)?.users;
  const userCount = hospitalUsers?.length;
  const userCountLabel = userCount === 1 ? "1 user" : `${userCount ?? 0} users`;
  const organizationCount = organizations.length;
  const organizationCountLabel =
    organizationCount === 1 ? "1 organisation" : `${organizationCount} organisations`;

  return (
    <nav aria-label={`${role} sections`} className="mb-4 shrink-0">
      <div className="flex items-end justify-between gap-4 border-b border-black/6">
        <div role="tablist" className="flex items-center gap-1">
          {getPortalTabs(role).map((tab) => {
            const isSelected = tab.id === selected;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                role="tab"
                aria-selected={isSelected}
                className={tabLinkClass(isSelected)}
              >
                {tab.label}
                {role === "sales" && tab.id === "organizations" ? (
                  <TabCount
                    count={organizationCount}
                    label={organizationCountLabel}
                    selected={isSelected}
                  />
                ) : null}
                {role === "biomed" && tab.id === "devices" && deviceCount !== undefined ? (
                  <TabCount
                    count={deviceCount}
                    label={deviceCountLabel ?? `${deviceCount} devices`}
                    selected={isSelected}
                  />
                ) : null}
                {role === "biomed" && tab.id === "users" && userCount !== undefined ? (
                  <TabCount count={userCount} label={userCountLabel} selected={isSelected} />
                ) : null}
              </Link>
            );
          })}
        </div>
        <div className="mb-2 flex h-11 shrink-0 items-center">{action}</div>
      </div>
    </nav>
  );
}

function TabCount({
  count,
  label,
  selected,
}: {
  count: number;
  label: string;
  selected: boolean;
}) {
  return (
    <span
      className={tabCountClass(selected)}
      aria-label={label}
    >
      {count}
    </span>
  );
}
