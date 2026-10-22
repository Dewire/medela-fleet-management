import type { WorldDevice } from "../types";

/**
 * Returns devices registered to one customer organisation.
 *
 * @param devices - Complete live device catalog
 * @param organizationId - Organisation whose devices should be returned
 * @returns Devices carrying the requested organisation ID
 */
export function devicesForOrganization(
  devices: readonly WorldDevice[],
  organizationId: string,
): WorldDevice[] {
  return devices.filter((device) => device.organizationId === organizationId);
}
