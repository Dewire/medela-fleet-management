import { parseFirmwareVersion } from "./compare-firmware";

/** Shown when a real version is already current. */
export const LATEST_FIRMWARE_MESSAGE = "This device is on the latest firmware.";

/** Shown when nothing can be installed, including an empty catalog. */
export const NO_FIRMWARE_PACKAGE_MESSAGE = "No firmware is available to install.";

/**
 * Copy for the update card when there is no package to offer.
 * A device is only "on the latest firmware" when it already has a real
 * version. `Not installed` stays a needs-update state.
 *
 * @param currentFirmware - Version label on the device
 * @returns Latest-firmware copy, or the no-package copy
 */
export function noInstallableFirmwareMessage(currentFirmware: string): string {
  return parseFirmwareVersion(currentFirmware)
    ? LATEST_FIRMWARE_MESSAGE
    : NO_FIRMWARE_PACKAGE_MESSAGE;
}
