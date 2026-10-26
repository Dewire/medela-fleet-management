"use client";

import { useEffect, useRef } from "react";

import { DeviceUpdateProgress } from "@/features/devices/components/device-update-progress";
import { useDeviceUpdateRun } from "@/features/devices/hooks/use-device-update-run";
import { noInstallableFirmwareMessage } from "@/features/devices/lib/no-installable-firmware-message";
import type { FirmwareUpdateOffer, WorldDevice } from "@/features/devices/types";
import { PrimaryActionButton } from "@/features/shell/primary-action-button";

/**
 * The one firmware a hospital can activate on this device.
 * Reuses the prototype install progress, then reports the finished offer.
 *
 * @param device - Device whose current status chooses the button label
 * @param offer - Newest Medela release for this model, or null when current
 * @param onFinished - Called once the prototype install completes
 */
export function BiomedFirmwareUpdate({
  device,
  offer,
  onFinished,
}: {
  device: WorldDevice;
  offer: FirmwareUpdateOffer | null;
  onFinished: (offer: FirmwareUpdateOffer) => void;
}) {
  const offerRef = useRef(offer);
  useEffect(() => {
    offerRef.current = offer;
  }, [offer]);
  const { phase, progress, stage, start } = useDeviceUpdateRun(() => {
    const finished = offerRef.current;
    if (finished) onFinished(finished);
  });

  if (phase === "idle" && !offer) {
    return (
      <p className="text-sm text-muted-foreground">{noInstallableFirmwareMessage(device.firmware)}</p>
    );
  }

  const startLabel = device.status === "failed" ? "Try again" : "Activate update";

  return (
    <div
      className={
        phase === "done"
          ? "rounded-xl bg-status-updated-tint px-4 py-4"
          : "rounded-xl bg-black/4 px-4 py-4"
      }
    >
      {phase === "idle" && offer ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">New firmware</p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground">{offer.version}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{offer.notes}</p>
          </div>
          <div className="flex justify-end">
            <PrimaryActionButton type="button" onClick={start} className="h-10 px-4 text-sm">
              {startLabel}
            </PrimaryActionButton>
          </div>
        </div>
      ) : null}
      {phase !== "idle" ? <DeviceUpdateProgress progress={progress} stage={stage} /> : null}
    </div>
  );
}
