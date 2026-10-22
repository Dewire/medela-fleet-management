import { PUBLISH_DEVICE_TYPES } from "@/features/firmware/lib/publish-device-types";

/** Share of simulated checks that fail. */
export const CONNECTION_FAILURE_RATE = 0.25;

const TOKEN_LENGTH = 5;
const DIGIT_COUNT = 10;

/** Outcome of one simulated cloud check. */
export type DeviceConnectionOutcome =
  | { ok: true; id: string; model: (typeof PUBLISH_DEVICE_TYPES)[number] }
  | { ok: false };

/**
 * Decides whether a prototype cloud check succeeds and, on success, the
 * device id and model the pump would report.
 *
 * @param random - Random source. Values below {@link CONNECTION_FAILURE_RATE} fail.
 * @param year - Year stamped into the device id
 * @returns A failure, or a new id shaped like `KF-2026-#####` and a publishable model
 */
export function simulateDeviceConnection(
  random: () => number = Math.random,
  year: number = new Date().getFullYear(),
): DeviceConnectionOutcome {
  if (random() < CONNECTION_FAILURE_RATE) return { ok: false };

  const suffix = Array.from({ length: TOKEN_LENGTH }, () => {
    const digit = Math.min(DIGIT_COUNT - 1, Math.floor(random() * DIGIT_COUNT));
    return String(digit);
  }).join("");
  const index = Math.min(
    PUBLISH_DEVICE_TYPES.length - 1,
    Math.floor(random() * PUBLISH_DEVICE_TYPES.length),
  );

  return {
    ok: true,
    id: `KF-${year}-${suffix}`,
    model: PUBLISH_DEVICE_TYPES[index] ?? PUBLISH_DEVICE_TYPES[0],
  };
}
