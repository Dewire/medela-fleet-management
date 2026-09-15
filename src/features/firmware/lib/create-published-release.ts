import type { PublishFirmwareInput } from "../schemas";
import type { FirmwareRelease } from "../types";

/** Catalog default when publish no longer collects a region. */
const DEFAULT_PUBLISH_REGION = "All regions";

/**
 * Builds the release record that history and detail read after publish.
 *
 * @param input - Validated version, device type, and notes
 * @param now - Clock used for the release date; inject in tests
 * @param uploadedBy - Display name of the staff member who published
 * @returns A new active release; the input is not mutated
 */
export function createPublishedRelease(
  input: PublishFirmwareInput,
  now: Date,
  uploadedBy: string,
): FirmwareRelease {
  return {
    version: input.version,
    notes: input.notes,
    region: DEFAULT_PUBLISH_REGION,
    deviceType: input.deviceType,
    date: now.toISOString().slice(0, 10),
    status: "active",
    devices: 0,
    uploadedBy,
  };
}
