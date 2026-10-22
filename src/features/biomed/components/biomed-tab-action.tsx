"use client";

import { usePathname } from "next/navigation";

import { AddDeviceDialog } from "@/features/biomed/components/add-device-dialog";
import { resolvePortalTab } from "@/features/shell/lib/portal-tabs";

/**
 * Tab-bar action for the Biomed list layout. Only Devices shows Add device
 * so Users does not grow a second yellow button; the slot height stays put.
 */
export function BiomedTabAction() {
  const pathname = usePathname();
  if (resolvePortalTab("biomed", pathname) !== "devices") return null;
  return <AddDeviceDialog />;
}
