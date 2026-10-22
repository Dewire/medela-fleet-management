import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Panel } from "@/features/shell/panel";
import { cn } from "@/lib/utils";

/**
 * Settings-style grouped list surface.
 *
 * @param header - Optional title, actions, or filters above the rows. Stays
 *   put when `scroll` is on so only the rows move.
 * @param footer - Optional count or hint under the rows
 * @param scroll - When true, rows scroll inside the panel and the footer stays
 *   visible. Use on `AppShell fill` pages so only the list moves.
 */
export function GroupedList({
  children,
  header,
  footer,
  scroll = false,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
}) {
  return (
    <Panel className={cn("overflow-hidden", scroll && "flex min-h-0 flex-1 flex-col")}>
      {header ? <div className="shrink-0">{header}</div> : null}
      <div className={cn("divide-y divide-black/6", scroll && "min-h-0 flex-1 overflow-y-auto")}>
        {children}
      </div>
      {footer ? (
        <div className="shrink-0 border-t border-black/6 px-5 py-3 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </Panel>
  );
}

/**
 * Full-row hit target: title, secondary line, trailing chip, chevron.
 *
 * @param className - Extra row styles, such as a highlight for a new record
 * @param onClick - Called when the row is pressed, before navigation
 */
export function GroupedListRow({
  href,
  title,
  subtitle,
  trailing,
  className,
  onClick,
}: {
  href: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-black/[0.03]",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="text-[15px] font-semibold tracking-tight text-foreground">{title}</div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {trailing}
        <ChevronRight size={16} className="text-muted-foreground/60" />
      </div>
    </Link>
  );
}

/**
 * Empty grouped-list placeholder.
 */
export function GroupedListEmpty({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-12 text-center text-sm text-muted-foreground">{children}</p>;
}
