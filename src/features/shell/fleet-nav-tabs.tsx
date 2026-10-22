"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useFirmwareReleases } from "@/features/firmware/hooks/use-firmware-releases";
import { useOrganizations } from "@/features/organizations/hooks/use-organizations";
import { listHospitalDirectory } from "@/features/organizations/lib/list-hospital-directory";
import { useFleetNavDeviceCount } from "@/features/shell/hooks/use-fleet-nav-device-count";
import { FLEET_TAB_HREFS, resolveFleetTab, type FleetTab } from "@/features/shell/lib/fleet-tabs";
import { tabCountClass, tabLinkClass } from "@/features/shell/lib/tab-link-class";

const TABS: ReadonlyArray<{ id: FleetTab; label: string; href: string }> = [
  { id: "devices", label: "Devices", href: FLEET_TAB_HREFS.devices },
  { id: "history", label: "Firmware history", href: FLEET_TAB_HREFS.history },
  { id: "upload", label: "Upload firmware", href: FLEET_TAB_HREFS.upload },
  { id: "users", label: "Users", href: FLEET_TAB_HREFS.users },
];

/**
 * Horizontal tabs for the fleet screens. The Devices tab reads the
 * visible device count from the shared store so it follows list filters.
 */
export function FleetNavTabs() {
  const pathname = usePathname();
  const current = resolveFleetTab(pathname);
  const { count: deviceCount, label: deviceCountLabel } = useFleetNavDeviceCount();
  const { organizations } = useOrganizations();
  const { releases } = useFirmwareReleases();
  const userCount = listHospitalDirectory(organizations).length;
  const userCountLabel = userCount === 1 ? "1 user" : `${userCount} users`;
  const releaseCount = releases.length;
  const releaseCountLabel = releaseCount === 1 ? "1 release" : `${releaseCount} releases`;

  return (
    <nav aria-label="Fleet sections" className="mb-4 shrink-0">
      <div
        role="tablist"
        className="flex items-center gap-1 border-b border-black/6"
      >
        {TABS.map((tab) => {
          const selected = tab.id === current;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              role="tab"
              aria-selected={selected}
              className={tabLinkClass(selected)}
            >
              {tab.label}
              {tab.id === "devices" && deviceCount !== undefined ? (
                <TabCount count={deviceCount} label={deviceCountLabel ?? `${deviceCount} devices`} selected={selected} />
              ) : null}
              {tab.id === "history" ? (
                <TabCount count={releaseCount} label={releaseCountLabel} selected={selected} />
              ) : null}
              {tab.id === "users" ? (
                <TabCount count={userCount} label={userCountLabel} selected={selected} />
              ) : null}
            </Link>
          );
        })}
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
