"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useDeviceCatalog } from "@/features/devices/hooks/use-device-catalog";
import { useFirmwareReleases } from "@/features/firmware/hooks/use-firmware-releases";
import { useFleetNavDeviceCount } from "@/features/shell/hooks/use-fleet-nav-device-count";
import { useStaff } from "@/features/staff/hooks/use-staff";
import {
  FLEET_TAB_HREFS,
  resolveFleetTab,
  showsUploadFirmware,
  uploadFirmwareHref,
  type FleetTab,
} from "@/features/shell/lib/fleet-tabs";
import { resolveDevicesTabCount } from "@/features/shell/lib/resolve-devices-tab-count";
import { tabCountClass, tabLinkClass } from "@/features/shell/lib/tab-link-class";

const TABS: ReadonlyArray<{ id: FleetTab; label: string; href: string }> = [
  { id: "devices", label: "Devices", href: FLEET_TAB_HREFS.devices },
  { id: "history", label: "Firmware history", href: FLEET_TAB_HREFS.history },
  { id: "users", label: "Users", href: FLEET_TAB_HREFS.users },
];

/**
 * Horizontal tabs for the fleet screens, with Upload firmware on the
 * trailing edge of Devices and Firmware history. The slot stays on Users
 * so the bar does not jump.
 */
export function FleetNavTabs() {
  const pathname = usePathname();
  const current = resolveFleetTab(pathname);
  const publishedDeviceCount = useFleetNavDeviceCount();
  const { devices } = useDeviceCatalog();
  const { users } = useStaff();
  const { releases } = useFirmwareReleases();
  const deviceCount = resolveDevicesTabCount(publishedDeviceCount.count, devices.length);
  const deviceCountLabel =
    publishedDeviceCount.label ??
    (deviceCount === 1 ? "1 device" : `${deviceCount} devices`);
  const userCount = users.length;
  const userCountLabel = userCount === 1 ? "1 user" : `${userCount} users`;
  const releaseCount = releases.length;
  const releaseCountLabel = releaseCount === 1 ? "1 release" : `${releaseCount} releases`;

  return (
    <nav aria-label="Fleet sections" className="mb-4 shrink-0">
      <div className="flex items-end justify-between gap-4 border-b border-black/6">
        <div role="tablist" className="flex items-center gap-1">
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
                {tab.id === "devices" ? (
                  <TabCount
                    count={deviceCount}
                    label={deviceCountLabel}
                    selected={selected}
                  />
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
        <div className="mb-2 flex h-11 shrink-0 items-center">
          {showsUploadFirmware(current) ? (
            <Link
              href={uploadFirmwareHref(current)}
              className="inline-flex items-center rounded-xl bg-brand-yellow px-5 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-yellow-dark"
            >
              Upload firmware
            </Link>
          ) : null}
        </div>
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
