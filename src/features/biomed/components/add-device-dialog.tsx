"use client";

import { useEffect, useId, useRef, useState } from "react";

import { useDeviceCatalog } from "@/features/devices/hooks/use-device-catalog";
import { generateRegistrationCode } from "@/features/devices/lib/generate-registration-code";
import type { RegisterDeviceResult } from "@/features/devices/lib/device-catalog-store";
import type { RegisterDeviceInput, WorldDevice } from "@/features/devices/types";

import { CodeStep, ConnectingStep, FailedStep, SuccessStep } from "./add-device-steps";
import { BIOMED_ORGANIZATION, CONNECTION_CHECK_MS } from "../constants";
import { simulateDeviceConnection } from "../lib/simulate-device-connection";

type Step = "code" | "connecting" | "success" | "failed";

const MAX_ID_ATTEMPTS = 3;

const STEP_HEADINGS: Record<Step, { eyebrow: string; subtitle: string }> = {
  code: { eyebrow: "Step 1 of 2", subtitle: "Connect the device to St Mary's Hospital." },
  connecting: { eyebrow: "Step 2 of 2", subtitle: "Waiting for the device to respond." },
  success: { eyebrow: "Complete", subtitle: "The device is registered to St Mary's Hospital." },
  failed: { eyebrow: "Step 2 of 2", subtitle: "The device did not complete the connection." },
};

/**
 * Opens a modal that shows a hospital token, then simulates the device
 * checking that token through the cloud.
 */
export function AddDeviceDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { devices, addDevice } = useDeviceCatalog();
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState<string | null>(null);
  const [added, setAdded] = useState<WorldDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkId, setCheckId] = useState(0);

  useEffect(() => {
    if (step !== "connecting" || !code) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      const settled = settleConnection(code, addDevice);
      setError(settled.error);
      setAdded(settled.device);
      setStep(settled.step);
    }, CONNECTION_CHECK_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [addDevice, checkId, code, step]);

  function open() {
    const existing = new Set(
      devices.flatMap((device) => (device.registrationCode ? [device.registrationCode] : [])),
    );
    setCode(generateRegistrationCode(existing));
    setAdded(null);
    setError(null);
    setStep("code");
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function reset() {
    setCode(null);
    setAdded(null);
    setError(null);
    setStep("code");
  }

  function verify() {
    setError(null);
    setStep("connecting");
    setCheckId((current) => current + 1);
  }

  const heading = STEP_HEADINGS[step];

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center rounded-xl bg-brand-yellow px-5 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-yellow-dark"
      >
        Add device
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={reset}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(30rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border-0 bg-card p-0 text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_64px_rgba(0,0,0,0.18)] backdrop:bg-black/40 backdrop:backdrop-blur-lg"
      >
        <header className="border-b border-black/6 px-6 pt-6 pb-5">
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {heading.eyebrow}
          </p>
          <h2 id={titleId} className="mt-1 text-xl font-semibold text-foreground">
            Add device
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{heading.subtitle}</p>
        </header>
        {step === "code" ? <CodeStep code={code} onNext={verify} onCancel={close} /> : null}
        {step === "connecting" ? <ConnectingStep code={code} onCancel={close} /> : null}
        {step === "success" && added ? <SuccessStep device={added} onDone={close} /> : null}
        {step === "failed" ? <FailedStep message={error} onRetry={verify} onClose={close} /> : null}
      </dialog>
    </>
  );
}

function settleConnection(
  code: string,
  addDevice: (input: RegisterDeviceInput) => RegisterDeviceResult,
): { step: "success" | "failed"; device: WorldDevice | null; error: string | null } {
  for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt += 1) {
    const outcome = simulateDeviceConnection();
    if (!outcome.ok) return { step: "failed", device: null, error: null };
    const result = addDevice({
      id: outcome.id,
      model: outcome.model,
      registrationCode: code,
      organizationId: BIOMED_ORGANIZATION.id,
      hospital: BIOMED_ORGANIZATION.name,
      city: BIOMED_ORGANIZATION.city,
      country: BIOMED_ORGANIZATION.country,
      region: BIOMED_ORGANIZATION.region,
    });
    if (result.ok) return { step: "success", device: result.device, error: null };
    if (result.code !== "duplicate_device") {
      return { step: "failed", device: null, error: result.message };
    }
  }
  return { step: "failed", device: null, error: "Could not assign a device ID. Try again." };
}
