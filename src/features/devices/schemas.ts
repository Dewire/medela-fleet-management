import { z } from "zod";

import { PUBLISH_DEVICE_TYPES } from "@/features/firmware/lib/publish-device-types";

/**
 * Biomed device-registration fields at the form boundary.
 */
export const registerDeviceSchema = z.object({
  id: z
    .string()
    .trim()
    .min(3, "Enter a device ID")
    .max(40, "Device ID must be 40 characters or fewer"),
  model: z
    .string()
    .trim()
    .refine(
      (value) => (PUBLISH_DEVICE_TYPES as readonly string[]).includes(value),
      "Select a device model",
    ),
});

/** Validated fields entered by a Biomed user. */
export type RegisterDeviceFormInput = z.infer<typeof registerDeviceSchema>;
