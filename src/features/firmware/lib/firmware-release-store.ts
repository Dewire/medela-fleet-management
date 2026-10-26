import { listFirmwareReleases } from "../repositories/firmware-repository";
import type { PublishFirmwareInput } from "../schemas";
import type { FirmwareRelease } from "../types";
import { createPublishedRelease } from "./create-published-release";

/**
 * In-memory firmware catalog so publish, history, and detail share one list.
 * There is no server: this lives in the module and resets on a full reload.
 *
 * @param initial - Starting releases; omit to seed from the fixture catalog
 */
export function createFirmwareReleaseStore(
  initial: readonly FirmwareRelease[] = listFirmwareReleases(),
) {
  let releases = initial.map((release) => ({ ...release }));
  const listeners = new Set<() => void>();

  function emit() {
    for (const listener of listeners) listener();
  }

  return {
    /**
     * Current catalog. Callers must not mutate the array.
     */
    getSnapshot(): FirmwareRelease[] {
      return releases;
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
     * Replaces the catalog. Used by the First time / Populated header switch.
     *
     * @param next - Releases that should become the live catalog
     */
    replace(next: readonly FirmwareRelease[]): void {
      releases = next.map((release) => ({ ...release }));
      emit();
    },

    /**
     * Prepends a published release and notifies subscribers.
     *
     * @param input - Validated publish-form fields
     * @param uploadedBy - Display name of the staff member who published
     * @param now - Clock for the release date; inject in tests
     */
    publish(
      input: PublishFirmwareInput,
      uploadedBy: string,
      now: Date = new Date(),
    ): FirmwareRelease {
      const release = createPublishedRelease(input, now, uploadedBy);
      releases = [release, ...releases];
      emit();
      return release;
    },
  };
}

export const firmwareReleaseStore = createFirmwareReleaseStore();
