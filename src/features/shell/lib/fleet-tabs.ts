/** The top-level fleet screens linked from the overview tabs. */
export type FleetTab = "devices" | "history" | "upload" | "users";

/** Path each tab opens. */
export const FLEET_TAB_HREFS = {
  devices: "/internal",
  history: "/internal/firmware",
  upload: "/internal/firmware/upload",
  users: "/internal/users",
} as const;

/**
 * Which fleet tab the current path belongs to.
 *
 * Upload is checked first because it lives under `/internal/firmware`.
 * Users is checked next so it is not treated as Devices.
 * Device detail and account routes fall through to `devices` so a stray
 * render of the tabs still has a selected item.
 *
 * @param pathname - Current URL path, without the query string
 */
export function resolveFleetTab(pathname: string): FleetTab {
  if (pathname.startsWith("/internal/firmware/upload")) return "upload";
  if (pathname.startsWith("/internal/firmware")) return "history";
  if (pathname.startsWith("/internal/users")) return "users";
  return "devices";
}
