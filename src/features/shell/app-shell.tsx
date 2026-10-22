import { AppHeader } from "@/features/shell/app-header";
import { FleetNavTabs } from "@/features/shell/fleet-nav-tabs";
import { PortalNavTabs } from "@/features/shell/portal-nav-tabs";
import type { PortalRole } from "@/features/account/types";
import {
  appShellContentClass,
  shouldLockAppShell,
  type AppShellVariant,
} from "@/features/shell/lib/app-shell-layout";
type AppShellProps = {
  children: React.ReactNode;
  portalRole?: PortalRole;
  title?: React.ReactNode;
  subtitle?: string;
  headerAction?: React.ReactNode;
  variant?: AppShellVariant;
  /**
   * Lock the page to the viewport so chrome (header, title) stays put and a
   * child list can scroll in the remaining height.
   */
  fill?: boolean;
  /**
   * Render Devices / Firmware history / Upload firmware above the page so
   * the tab bar stays in one place across those three screens.
   */
  fleetNav?: boolean;
  /** Render the active Sales or Biomed workspace navigation. */
  portalNav?: boolean;
  /** Control rendered at the trailing edge of the portal tab bar. */
  portalNavAction?: React.ReactNode;
};

/**
 * Authenticated chrome: frosted toolbar, large title, optional form column.
 */
export function AppShell({
  children,
  portalRole = "internal",
  title,
  subtitle,
  headerAction,
  variant = "default",
  fill = false,
  fleetNav = false,
  portalNav = false,
  portalNavAction,
}: AppShellProps) {
  const lockViewport = shouldLockAppShell(fill, fleetNav);

  return (
    <div className={lockViewport ? "flex h-dvh flex-col overflow-hidden bg-background" : "min-h-screen bg-background"}>
      <AppHeader role={portalRole} />
      <main
        className={
          lockViewport
            ? "mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-8 pt-6 pb-4"
            : "mx-auto max-w-[1440px] px-8 py-10"
        }
      >
        {fleetNav ? <FleetNavTabs /> : null}
        {portalNav && portalRole !== "internal" ? (
          <PortalNavTabs role={portalRole} action={portalNavAction} />
        ) : null}
        {(title || subtitle || headerAction) && (
          <div className={`flex shrink-0 items-end justify-between gap-4 ${lockViewport ? "mb-4" : "mb-8"}`}>
            <div>
              {title ? (
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
              ) : null}
              {subtitle ? <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {headerAction}
          </div>
        )}
        <div className={appShellContentClass(variant, lockViewport)}>
          {children}
        </div>
      </main>
    </div>
  );
}
