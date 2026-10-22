"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  biomedNavCountStore,
  fleetNavCountStore,
  type FleetNavDeviceCount,
} from "@/features/shell/lib/fleet-nav-count-store";

/**
 * Live Devices-tab badge so the list can update a count rendered in AppShell.
 */
export function useFleetNavDeviceCount(): FleetNavDeviceCount {
  return useSyncExternalStore(
    fleetNavCountStore.subscribe,
    fleetNavCountStore.getSnapshot,
    fleetNavCountStore.getSnapshot,
  );
}

/**
 * Publishes the visible device count to the fleet tabs.
 * The last value stays after unmount so the badge does not vanish on other tabs.
 *
 * @param count - Visible row count
 * @param label - Accessible description of that count
 */
export function usePublishFleetNavDeviceCount(count: number, label: string): void {
  useEffect(() => {
    fleetNavCountStore.set(count, label);
  }, [count, label]);
}

/**
 * Live Devices-tab badge for the Biomed portal.
 */
export function useBiomedNavDeviceCount(): FleetNavDeviceCount {
  return useSyncExternalStore(
    biomedNavCountStore.subscribe,
    biomedNavCountStore.getSnapshot,
    biomedNavCountStore.getSnapshot,
  );
}

/**
 * Publishes the visible Biomed device count to the portal Devices tab.
 *
 * @param count - Visible row count
 * @param label - Accessible description of that count
 */
export function usePublishBiomedNavDeviceCount(count: number, label: string): void {
  useEffect(() => {
    biomedNavCountStore.set(count, label);
  }, [count, label]);
}
