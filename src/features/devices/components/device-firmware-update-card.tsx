"use client";

import { useEffect, useRef, useState } from "react";

import { DeviceFirmwareVersionSelect } from "@/features/devices/components/device-firmware-version-select";
import { DeviceUpdateProgress } from "@/features/devices/components/device-update-progress";
import { useDeviceUpdateRun } from "@/features/devices/hooks/use-device-update-run";
import type { FirmwareUpdateOffer, WorldDevice } from "@/features/devices/types";
import { PrimaryActionButton } from "@/features/shell/primary-action-button";

/**
 * Update action that sits inside the device card: version list, details, start.
 *
 * @param device - Device being updated
 * @param offers - Installable packages, newest first
 * @param onFinished - Called once the prototype install completes
 */
export function DeviceFirmwareUpdateCard({
  device,
  offers,
  onFinished,
}: {
  device: WorldDevice;
  offers: FirmwareUpdateOffer[];
  onFinished: (offer: FirmwareUpdateOffer) => void;
}) {
  const [selectedVersion, setSelectedVersion] = useState(offers[0]?.version ?? "");
  const selected = offers.find((offer) => offer.version === selectedVersion) ?? offers[0] ?? null;
  const selectedRef = useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  const { phase, progress, stage, start } = useDeviceUpdateRun(() => {
    const finished = selectedRef.current;
    if (finished) onFinished(finished);
  });

  const startLabel = device.status === "failed" ? "Retry update" : "Start update";

  if (phase === "idle" && !selected) {
    return (
      <p className="text-sm text-muted-foreground">This device is on the latest firmware.</p>
    );
  }

  return (
    <div
      className={
        phase === "done"
          ? "rounded-xl bg-status-updated-tint px-4 py-4"
          : "rounded-xl bg-black/4 px-4 py-4"
      }
    >
      {phase === "idle" && selected ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-muted-foreground">Available update</p>
          <div className="flex items-end justify-between gap-3">
            <DeviceFirmwareVersionSelect
              offers={offers}
              value={selected.version}
              onChange={setSelectedVersion}
              selected={selected}
            />
            <PrimaryActionButton type="button" onClick={start} className="h-10 shrink-0 px-4 text-sm">
              {startLabel}
            </PrimaryActionButton>
          </div>
        </div>
      ) : null}
      {phase !== "idle" ? <DeviceUpdateProgress progress={progress} stage={stage} /> : null}
    </div>
  );
}
