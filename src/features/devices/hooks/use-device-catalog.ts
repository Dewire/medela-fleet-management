"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  deviceCatalogStore,
  type RegisterDeviceResult,
} from "@/features/devices/lib/device-catalog-store";
import type {
  DeviceFirmwareLogEntry,
  FirmwareUpdateOffer,
  RegisterDeviceInput,
  WorldDevice,
} from "@/features/devices/types";

/**
 * Live fleet and install logs shared by the device list and device detail.
 */
export function useDeviceCatalog(): {
  devices: WorldDevice[];
  logs: Record<string, DeviceFirmwareLogEntry[]>;
  addDevice: (input: RegisterDeviceInput) => RegisterDeviceResult;
  applyUpdate: (deviceId: string, offer: FirmwareUpdateOffer) => WorldDevice | null;
} {
  const snapshot = useSyncExternalStore(
    deviceCatalogStore.subscribe,
    deviceCatalogStore.getSnapshot,
    deviceCatalogStore.getSnapshot,
  );
  const applyUpdate = useCallback(
    (deviceId: string, offer: FirmwareUpdateOffer) => deviceCatalogStore.applyUpdate(deviceId, offer),
    [],
  );
  const addDevice = useCallback(
    (input: RegisterDeviceInput) => deviceCatalogStore.addDevice(input),
    [],
  );

  return { devices: snapshot.devices, logs: snapshot.logs, addDevice, applyUpdate };
}
