"use client";

import { useEffect, useRef, useState } from "react";

import {
  DEVICE_UPDATE_DURATION_MS,
  updateProgressAt,
  updateStageAt,
  type DeviceUpdateStage,
} from "@/features/devices/lib/update-progress";

export type DeviceUpdatePhase = "idle" | "running" | "done";

const TICK_MS = 100;

/**
 * Runs the prototype OTA progress. Completes in `DEVICE_UPDATE_DURATION_MS`
 * (compressed from a multi-minute install) then calls `onComplete` once.
 *
 * @param onComplete - Invoked when progress reaches 100%
 */
export function useDeviceUpdateRun(onComplete: () => void): {
  phase: DeviceUpdatePhase;
  progress: number;
  stage: DeviceUpdateStage;
  start: () => void;
} {
  const [phase, setPhase] = useState<DeviceUpdatePhase>("idle");
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (phase !== "running") return;

    const startedAt = Date.now();
    const tick = window.setInterval(() => {
      const next = updateProgressAt(Date.now() - startedAt, DEVICE_UPDATE_DURATION_MS);
      setProgress(next);
      if (next >= 1) {
        window.clearInterval(tick);
        setPhase("done");
        onCompleteRef.current();
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(tick);
    };
  }, [phase]);

  function start() {
    setProgress(0);
    setPhase("running");
  }

  return { phase, progress, stage: updateStageAt(progress), start };
}
