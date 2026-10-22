"use client";

import { Info } from "lucide-react";
import { Tooltip } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

const HOVER_DELAY_MS = 150;

/**
 * Info icon that reveals explanatory content on hover or keyboard focus.
 *
 * Base UI opens on focus as well as hover, so the content is not mouse-only.
 * The popup is solid rather than frosted — the same choice as the account
 * menu — because dense text over a blurred page is hard to read.
 *
 * @param label - Accessible name for the trigger, e.g. "What each role can do"
 * @param side - Which side of the trigger to place the popup on
 * @param className - Extra utilities for the popup, typically a width
 * @param container - Element that receives the popup. Pass an open dialog so the tooltip stays above its backdrop
 * @param children - Popup content
 */
export function InfoTooltip({
  label,
  side = "top",
  className,
  container,
  children,
}: {
  label: string;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  container?: React.ComponentProps<typeof Tooltip.Portal>["container"];
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        type="button"
        delay={HOVER_DELAY_MS}
        aria-label={label}
        className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
      >
        <Info size={15} aria-hidden="true" />
      </Tooltip.Trigger>
      <Tooltip.Portal container={container}>
        <Tooltip.Positioner side={side} sideOffset={8} className="z-50">
          <Tooltip.Popup
            className={cn(
              "max-w-[19rem] rounded-xl bg-white p-3.5 text-left shadow-[0_8px_40px_rgba(0,0,0,0.14)] ring-1 ring-black/10",
              className,
            )}
          >
            {children}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
