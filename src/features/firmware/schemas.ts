import { z } from "zod";

import { PUBLISH_DEVICE_TYPES } from "./lib/publish-device-types";

/**
 * Publish-form fields at the system boundary. Version, device type, and notes
 * are required; region and schedule are not collected on this form.
 */
export const publishFirmwareSchema = z.object({
  version: z.string().trim().min(1, "Enter a version label"),
  deviceType: z
    .string()
    .trim()
    .min(1, "Select a device type")
    .refine((value) => (PUBLISH_DEVICE_TYPES as readonly string[]).includes(value), {
      message: "Select a device type",
    }),
  notes: z.string().trim().min(1, "Enter release notes"),
});

/** Validated publish-form input. */
export type PublishFirmwareInput = z.infer<typeof publishFirmwareSchema>;
