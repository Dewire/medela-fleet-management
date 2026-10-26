"use client";

import { useDemoDataMode } from "@/features/shell/hooks/use-demo-data-mode";
import { cn } from "@/lib/utils";

/**
 * Header switch between empty onboarding lists and the fixture catalogs.
 * First time sits on the left; Populated on the right.
 */
export function DemoDataSlider() {
  const { mode, setMode } = useDemoDataMode();
  const populated = mode === "populated";

  return (
    <div className="flex items-center gap-2.5" role="group" aria-label="Demo data">
      <button
        type="button"
        onClick={() => setMode("first-time")}
        className={cn("text-sm font-semibold", populated ? "text-brand-ink/50" : "text-brand-ink")}
      >
        First time
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={populated}
        aria-label="Populated demo data"
        onClick={() => setMode(populated ? "first-time" : "populated")}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/40",
          populated ? "bg-brand-ink" : "bg-brand-ink/25",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
            populated ? "left-0.5 translate-x-5" : "left-0.5 translate-x-0",
          )}
        />
      </button>
      <button
        type="button"
        onClick={() => setMode("populated")}
        className={cn("text-sm font-semibold", populated ? "text-brand-ink" : "text-brand-ink/50")}
      >
        Populated
      </button>
    </div>
  );
}
