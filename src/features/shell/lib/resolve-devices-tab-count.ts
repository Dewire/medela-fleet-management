/**
 * Devices-tab badge when the list has not published a visible count yet.
 *
 * The list writes a filtered count after it mounts. Firmware history and
 * Users never mount that list, so the catalog size is used instead.
 *
 * @param published - Visible row count from the device list, when it has run
 * @param catalogSize - Devices currently in the fleet catalog
 * @returns The list count, or the catalog size when none has been published
 */
export function resolveDevicesTabCount(
  published: number | undefined,
  catalogSize: number,
): number {
  return published ?? catalogSize;
}
