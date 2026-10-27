import { listFirmwareReleases } from "@/features/firmware/repositories/firmware-repository";
import type { FirmwareRelease } from "@/features/firmware/types";

import { listWorldDevices } from "../repositories/device-repository";
import type {
  DeviceFirmwareLogEntry,
  FirmwareUpdateOffer,
  RegisterDeviceInput,
  WorldDevice,
} from "../types";
import { applyDeviceFirmwareUpdate } from "./apply-device-update";
import { buildDeviceFirmwareLog } from "./device-firmware-log";
import {
  generateRegistrationCode,
  isRegistrationCode,
  REGISTRATION_CODE_EXAMPLE,
} from "./generate-registration-code";

export type DeviceCatalogSnapshot = {
  devices: WorldDevice[];
  logs: Record<string, DeviceFirmwareLogEntry[]>;
};

/** Expected device-registration failure codes. */
export type RegisterDeviceErrorCode =
  | "duplicate_device"
  | "duplicate_code"
  | "invalid_code"
  | "code_generation_failed";

/** Result of adding one device to the prototype catalog. */
export type RegisterDeviceResult =
  | { ok: true; device: WorldDevice }
  | { ok: false; code: RegisterDeviceErrorCode; message: string };

/**
 * Live fleet plus per-device install logs so detail and the list stay aligned.
 * Resets on a full reload.
 *
 * @param initialDevices - Starting fleet
 * @param initialReleases - Catalog used to seed each device's log
 */
export function createDeviceCatalogStore(
  initialDevices: readonly WorldDevice[] = listWorldDevices(),
  initialReleases: readonly FirmwareRelease[] = listFirmwareReleases(),
) {
  let devices = initialDevices.map((device) => ({ ...device }));
  let logs: Record<string, DeviceFirmwareLogEntry[]> = Object.fromEntries(
    devices.map((device) => [device.id, buildDeviceFirmwareLog(device, initialReleases)]),
  );
  let cached: DeviceCatalogSnapshot = { devices, logs };
  const listeners = new Set<() => void>();

  function emit() {
    cached = { devices, logs };
    for (const listener of listeners) listener();
  }

  return {
    getSnapshot(): DeviceCatalogSnapshot {
      return cached;
    },

    /**
     * Subscribe to catalog changes. Returns an unsubscribe function.
     */
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    /**
     * Replaces the fleet and rebuilds install logs. Used by the First time /
     * Populated header switch.
     *
     * @param nextDevices - Devices that should become the live fleet
     * @param nextReleases - Catalog used to seed each device's log
     */
    replace(
      nextDevices: readonly WorldDevice[],
      nextReleases: readonly FirmwareRelease[] = initialReleases,
    ): void {
      devices = nextDevices.map((device) => ({ ...device }));
      logs = Object.fromEntries(
        devices.map((device) => [device.id, buildDeviceFirmwareLog(device, nextReleases)]),
      );
      emit();
    },

    /**
     * Registers a device and keeps a hospital token.
     * A code supplied by the caller is stored as shown. Otherwise a new
     * `EU-K7M2Q9XR4DP` token is generated.
     *
     * @param input - Device identity plus its organisation context
     * @param random - Random source used only when no token is supplied
     */
    addDevice(
      input: RegisterDeviceInput,
      random: () => number = Math.random,
    ): RegisterDeviceResult {
      const duplicate = devices.some(
        (device) => device.id.toLowerCase() === input.id.toLowerCase(),
      );
      if (duplicate) {
        return {
          ok: false,
          code: "duplicate_device",
          message: "A device with this ID already exists",
        };
      }

      const existingCodes = new Set(
        devices.flatMap((device) =>
          device.registrationCode ? [device.registrationCode] : [],
        ),
      );
      const registrationCode = resolveRegistrationCode(input.registrationCode, existingCodes, random);
      if (!registrationCode.ok) return registrationCode;

      const device: WorldDevice = {
        ...input,
        status: "needs-update",
        firmware: "Not installed",
        registrationCode: registrationCode.value,
      };
      devices = [...devices, device];
      logs = { ...logs, [device.id]: [] };
      emit();
      return { ok: true, device };
    },

    /**
     * Applies a finished OTA to one device.
     *
     * @returns The updated device, or null when the id is unknown
     */
    applyUpdate(
      deviceId: string,
      offer: FirmwareUpdateOffer,
      now: Date = new Date(),
    ): WorldDevice | null {
      const current = devices.find((device) => device.id === deviceId);
      if (!current) return null;

      const result = applyDeviceFirmwareUpdate(current, logs[deviceId] ?? [], offer, now);
      devices = devices.map((device) => (device.id === deviceId ? result.device : device));
      logs = { ...logs, [deviceId]: result.log };
      emit();
      return result.device;
    },
  };
}

function resolveRegistrationCode(
  provided: string | undefined,
  existing: ReadonlySet<string>,
  random: () => number,
): { ok: true; value: string } | Exclude<RegisterDeviceResult, { ok: true }> {
  if (provided !== undefined) {
    if (!isRegistrationCode(provided)) {
      return {
        ok: false,
        code: "invalid_code",
        message: `Hospital token must look like ${REGISTRATION_CODE_EXAMPLE}`,
      };
    }
    if (existing.has(provided)) {
      return {
        ok: false,
        code: "duplicate_code",
        message: "This hospital token is already in use",
      };
    }
    return { ok: true, value: provided };
  }

  const generated = generateRegistrationCode(existing, random);
  if (!generated) {
    return {
      ok: false,
      code: "code_generation_failed",
      message: "Could not generate a hospital token. Try again.",
    };
  }
  return { ok: true, value: generated };
}

export const deviceCatalogStore = createDeviceCatalogStore();
