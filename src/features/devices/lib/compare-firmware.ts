const VERSION_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)$/;

/**
 * Parses a `vMAJOR.MINOR.PATCH` label into numeric parts.
 *
 * @param version - Firmware version label
 * @returns Major, minor, and patch, or null when the label is not a version
 */
export function parseFirmwareVersion(
  version: string,
): readonly [number, number, number] | null {
  const match = VERSION_PATTERN.exec(version.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/**
 * True when `candidate` is a higher version than `current`.
 * An unparseable candidate cannot win. An unparseable current label, such as
 * `Not installed`, is older than any real version.
 *
 * @param candidate - Offered firmware version
 * @param current - Version already on the device
 */
export function isNewerFirmware(candidate: string, current: string): boolean {
  const left = parseFirmwareVersion(candidate);
  const right = parseFirmwareVersion(current);
  if (!left) return false;
  if (!right) return true;
  if (left[0] !== right[0]) return left[0] > right[0];
  if (left[1] !== right[1]) return left[1] > right[1];
  return left[2] > right[2];
}
