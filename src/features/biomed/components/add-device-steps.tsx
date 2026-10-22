"use client";

import { CheckCircle2, Loader2, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WorldDevice } from "@/features/devices/types";
import { PrimaryActionButton } from "@/features/shell/primary-action-button";

const SECONDARY_BUTTON_CLASS = "h-11 rounded-xl px-5";

const CODE_INSTRUCTIONS = [
  "On the device, open the Wi-Fi connection screen.",
  "Enter the code and connect to Wi-Fi.",
  "Press Next step to continue.",
] as const;

const RETRY_INSTRUCTIONS = [
  "Check the device is connected to Wi-Fi.",
  "Press Try again to reuse the same code.",
] as const;

/**
 * First step: the hospital token and how to enter it on the device.
 *
 * @param code - Token issued for this attempt, or null when none could be issued
 */
export function CodeStep({
  code,
  onNext,
  onCancel,
}: {
  code: string | null;
  onNext: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <StepBody>
        {code ? (
          <TokenPanel code={code} />
        ) : (
          <p className="text-sm text-destructive" role="alert">
            Could not issue a hospital token. Close and try again.
          </p>
        )}
        <InstructionList instructions={CODE_INSTRUCTIONS} />
      </StepBody>
      <StepFooter>
        <Button type="button" variant="outline" className={SECONDARY_BUTTON_CLASS} onClick={onCancel}>
          Cancel
        </Button>
        <PrimaryActionButton type="button" onClick={onNext} disabled={!code}>
          Next step
        </PrimaryActionButton>
      </StepFooter>
    </>
  );
}

/** Second step: the simulated cloud check is running. */
export function ConnectingStep({ code, onCancel }: { code: string | null; onCancel: () => void }) {
  return (
    <>
      <StepBody>
        <StatusMessage
          icon={<Loader2 className="size-7 animate-spin text-brand-ink" aria-hidden="true" />}
          iconClassName="bg-brand-yellow-tint"
          title="Verifying the code"
          description={`The device is checking code ${code ?? ""} through the cloud connection.`}
        />
      </StepBody>
      <StepFooter>
        <Button type="button" variant="outline" className={SECONDARY_BUTTON_CLASS} onClick={onCancel}>
          Cancel
        </Button>
      </StepFooter>
    </>
  );
}

/** Final step after a successful check. The device is already on the list. */
export function SuccessStep({ device, onDone }: { device: WorldDevice; onDone: () => void }) {
  return (
    <>
      <StepBody>
        <StatusMessage
          icon={<CheckCircle2 className="size-7 text-emerald-600" aria-hidden="true" />}
          iconClassName="bg-emerald-50"
          title="Device added"
          description="The device is now on your list."
        />
        <dl className="flex flex-col divide-y divide-black/6 rounded-xl border border-black/8 text-sm">
          <ResultRow label="Device ID" value={device.id} />
          <ResultRow label="Model" value={device.model} />
          <ResultRow label="Hospital token" value={device.registrationCode ?? ""} mono />
        </dl>
      </StepBody>
      <StepFooter>
        <PrimaryActionButton type="button" onClick={onDone}>
          Done
        </PrimaryActionButton>
      </StepFooter>
    </>
  );
}

/** Final step after a failed check. Retrying reuses the same code. */
export function FailedStep({
  message,
  onRetry,
  onClose,
}: {
  message: string | null;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <StepBody>
        <StatusMessage
          icon={<WifiOff className="size-7 text-destructive" aria-hidden="true" />}
          iconClassName="bg-destructive/10"
          title="Connection failed"
          description={message ?? "The device could not verify the code."}
          alert
        />
        <InstructionList instructions={RETRY_INSTRUCTIONS} />
      </StepBody>
      <StepFooter>
        <Button type="button" variant="outline" className={SECONDARY_BUTTON_CLASS} onClick={onClose}>
          Close
        </Button>
        <PrimaryActionButton type="button" onClick={onRetry}>
          Try again
        </PrimaryActionButton>
      </StepFooter>
    </>
  );
}

function StepBody({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-6 px-6 py-6">{children}</div>;
}

function InstructionList({ instructions }: { instructions: readonly string[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {instructions.map((instruction, index) => (
        <li key={instruction} className="flex items-start gap-3 text-sm text-foreground">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-semibold text-brand-ink">
            {index + 1}
          </span>
          <span className="pt-0.5">{instruction}</span>
        </li>
      ))}
    </ol>
  );
}

function StepFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end gap-3 border-t border-black/6 bg-black/[0.02] px-6 py-4">
      {children}
    </div>
  );
}

function TokenPanel({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-brand-yellow-tint px-4 py-6">
      <p className="text-xs font-semibold tracking-[0.12em] text-brand-ink/70 uppercase">
        Hospital token
      </p>
      <div className="flex gap-2.5" aria-label={`Hospital token ${code}`}>
        {code.split("").map((digit, index) => (
          <span
            key={`${code}-${index}`}
            aria-hidden="true"
            className="flex h-16 w-13 items-center justify-center rounded-xl border border-black/8 bg-card text-3xl font-semibold text-foreground tabular-nums shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          >
            {digit}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusMessage({
  icon,
  iconClassName,
  title,
  description,
  alert = false,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  alert?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center" role={alert ? "alert" : "status"}>
      <span className={`flex size-14 items-center justify-center rounded-full ${iconClassName}`}>{icon}</span>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ResultRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`font-medium text-foreground ${mono ? "tracking-[0.12em] tabular-nums" : ""}`}>{value}</dd>
    </div>
  );
}
