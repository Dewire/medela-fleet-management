/** Devices-tab badge shared by the list and the fleet tabs. */
export type FleetNavDeviceCount = {
  count: number | undefined;
  label: string | undefined;
};

const EMPTY_COUNT: FleetNavDeviceCount = { count: undefined, label: undefined };

/**
 * In-memory badge for the Devices tab. The device list writes the visible
 * row count; `FleetNavTabs` reads it so the tabs can live in AppShell.
 *
 * @param initial - Starting badge; omit to hide the count
 */
export function createFleetNavCountStore(initial: FleetNavDeviceCount = EMPTY_COUNT) {
  let snapshot: FleetNavDeviceCount = initial;
  const listeners = new Set<() => void>();

  function emit() {
    for (const listener of listeners) listener();
  }

  return {
    /**
     * Current badge. Callers must not mutate the object.
     */
    getSnapshot(): FleetNavDeviceCount {
      return snapshot;
    },

    /**
     * Subscribe to badge changes. Returns an unsubscribe function.
     */
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    /**
     * Publishes a new badge. Pass `undefined` count to hide it.
     *
     * @param count - Visible device count, or undefined to hide
     * @param label - Accessible description of that count
     */
    set(count: number | undefined, label?: string): void {
      snapshot = { count, label };
      emit();
    },
  };
}

export const fleetNavCountStore = createFleetNavCountStore();

/** Biomed Devices-tab badge. Kept apart from the internal fleet badge. */
export const biomedNavCountStore = createFleetNavCountStore();
