/**
 * Catalog models staff can target when publishing firmware.
 * Values match `device.model` so device-update matching stays exact.
 */
export const PUBLISH_DEVICE_TYPES = [
  "Freestyle Hands-free",
  "Symphony",
  "Swing Maxi",
] as const;

/** A device type the publish form may store on a release. */
export type PublishDeviceType = (typeof PUBLISH_DEVICE_TYPES)[number];

/**
 * Native-select options for the publish form. The empty first row forces an
 * explicit choice instead of silently submitting the first model.
 */
export const PUBLISH_DEVICE_TYPE_OPTIONS: ReadonlyArray<readonly [string, string]> = [
  ["", "Select device type"],
  ...PUBLISH_DEVICE_TYPES.map((type) => [type, type] as const),
];
