import { cn } from "@/lib/utils";

/**
 * Shared selected and idle styles for portal and fleet section tabs.
 *
 * @param selected - Whether this tab is the current section
 */
export function tabLinkClass(selected: boolean): string {
  return cn(
    "relative flex items-center gap-2 rounded-t-lg px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
    selected
      ? "bg-brand-yellow-tint text-brand-ink after:absolute after:right-2 after:bottom-0 after:left-2 after:h-1 after:rounded-full after:bg-brand-yellow-dark"
      : "text-muted-foreground hover:bg-black/[0.03] hover:text-foreground",
  );
}

/**
 * Count pill that sits beside a section tab label.
 *
 * @param selected - Whether the parent tab is current
 */
export function tabCountClass(selected: boolean): string {
  return cn(
    "rounded-full px-2 py-0.5 text-sm font-semibold tabular-nums",
    selected ? "bg-brand-ink text-white" : "bg-black/5 text-muted-foreground",
  );
}
