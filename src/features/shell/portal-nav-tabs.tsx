"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { PortalRole } from "@/features/account/types";
import { useBiomedNavDeviceCount } from "@/features/shell/hooks/use-fleet-nav-device-count";
import {
  getPortalTabs,
  resolvePortalTab,
} from "@/features/shell/lib/portal-tabs";
import { cn } from "@/lib/utils";

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
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  isSelected
                    ? "text-foreground after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {role === "biomed" && tab.id === "devices" && deviceCount !== undefined ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-sm font-semibold tabular-nums",
                      isSelected ? "bg-black/5 text-foreground" : "bg-black/5 text-muted-foreground",
                    )}
                    aria-label={deviceCountLabel}
                  >
                    {deviceCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
        {action ? <div className="mb-2 shrink-0">{action}</div> : null}
      </div>
    </nav>
  );
}
