/**
 * Device status values used across the fleet portal.
 * Amber = pending update, green = current, red = last update failed.
 */
export type DeviceStatus = "needs-update" | "updated" | "failed";

/**
 * A fleet device used on the internal device table.
 */
export type WorldDevice = {
  id: string;
  city: string;
  country: string;
  region: string;
  status: DeviceStatus;
  hospital: string;
  firmware: string;
  model: string;
  /** Customer organisation that registered the device, when known. */
  organizationId?: string;
  /** Hospital token in `EU-K7M2Q9XR4DP` format, issued during prototype registration. */
  registrationCode?: string;
};

/**
 * Complete device payload accepted by the in-memory catalog.
 * `registrationCode` is set when the caller already showed that token.
 */
export type RegisterDeviceInput = Omit<WorldDevice, "status" | "firmware" | "registrationCode"> & {
  registrationCode?: string;
};

/**
 * Filter values for the internal device table.
 */
export type DeviceFilters = {
  status: string;
  search: string;
};

/** One past or current firmware install on a single device. */
export type DeviceFirmwareLogEntry = {
  version: string;
  installedOn: string;
  notes: string;
  uploadedBy: string;
};

/** The firmware a device should receive next. */
export type FirmwareUpdateOffer = {
  version: string;
  notes: string;
  uploadedBy: string;
  /** Publish date of the release, `YYYY-MM-DD`. */
  date: string;
};
