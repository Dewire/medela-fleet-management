import type { FirmwareRelease } from "@/features/firmware/types";

import type { FirmwareUpdateOffer, WorldDevice } from "../types";
import { isNewerFirmware } from "./compare-firmware";

const ALL_DEVICE_TYPES = "All device types";

/**
 * Firmware packages this device can install: same device type, not recalled,
 * and not the version already on the device. Newest first.
 *
 * @param device - Device with a current firmware and model
 * @param releases - Published firmware catalog
 */
export function availableFirmwareUpdates(
  device: Pick<WorldDevice, "firmware" | "model">,
  releases: readonly FirmwareRelease[],
): FirmwareUpdateOffer[] {
  const seen = new Set<string>();
  const offers: FirmwareUpdateOffer[] = [];

  const ranked = releases
    .filter((release) => isInstallableOn(release, device))
    .sort(byNewestVersion);

  for (const release of ranked) {
    if (seen.has(release.version)) continue;
    seen.add(release.version);
    offers.push({
      version: release.version,
      notes: release.notes,
      uploadedBy: release.uploadedBy,
      date: release.date,
    });
  }

  return offers;
}

function isInstallableOn(
  release: FirmwareRelease,
  device: Pick<WorldDevice, "firmware" | "model">,
): boolean {
  return (
    release.status !== "recalled" &&
    release.version !== device.firmware &&
    (release.deviceType === device.model || release.deviceType === ALL_DEVICE_TYPES)
  );
}

function byNewestVersion(left: FirmwareRelease, right: FirmwareRelease): number {
  if (isNewerFirmware(left.version, right.version)) return -1;
  if (isNewerFirmware(right.version, left.version)) return 1;
  return 0;
}
