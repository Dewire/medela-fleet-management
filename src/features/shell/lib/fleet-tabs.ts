/** The top-level fleet screens linked from the overview tabs. */
export type FleetTab = "devices" | "history" | "users";

/** Path each tab opens. */
export const FLEET_TAB_HREFS = {
  devices: "/internal",
  history: "/internal/firmware",
  users: "/internal/users",
} as const;

/** Publish form. Opened from the yellow action, not from a tab. */
export const FLEET_UPLOAD_HREF = "/internal/firmware/upload";

const UPLOAD_RETURN_LABELS: Record<FleetTab, string> = {
  devices: "Back to Devices",
  history: "Back to Firmware history",
  users: "Back to Users",
};

/**
 * Whether the yellow Upload firmware action belongs on this fleet tab.
 * Users is a staff directory, so the button stays off that view.
 *
 * @param tab - Currently selected fleet tab
 */
export function showsUploadFirmware(tab: FleetTab): boolean {
  return tab !== "users";
}

/**
 * Publish-form URL that remembers which fleet tab opened it.
 *
 * @param from - Tab the yellow button was pressed on
 */
export function uploadFirmwareHref(from: FleetTab): string {
  return `${FLEET_UPLOAD_HREF}?from=${from}`;
}

/**
 * Where the publish-form back link should go.
 * Unknown or missing `from` returns Devices.
 *
 * @param from - `from` query value on the upload route
 */
export function resolveUploadReturn(from: string | null | undefined): {
  href: string;
  label: string;
} {
  const tab: FleetTab = from === "history" || from === "users" ? from : "devices";
  return { href: FLEET_TAB_HREFS[tab], label: UPLOAD_RETURN_LABELS[tab] };
}

/**
 * Which fleet tab the current path belongs to.
 *
 * Users is checked first so it is not treated as Devices.
 * The publish form is not a tab; if this runs on that path it follows
 * firmware history because the URL lives under `/internal/firmware`.
 * Device detail and account routes fall through to `devices` so a stray
 * render of the tabs still has a selected item.
 *
 * @param pathname - Current URL path, without the query string
 */
export function resolveFleetTab(pathname: string): FleetTab {
  if (pathname.startsWith("/internal/users")) return "users";
  if (pathname.startsWith("/internal/firmware")) return "history";
  return "devices";
}
