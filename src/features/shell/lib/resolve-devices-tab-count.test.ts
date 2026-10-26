import { describe, expect, it } from "vitest";

import { resolveDevicesTabCount } from "./resolve-devices-tab-count";

describe("resolveDevicesTabCount", () => {
  it("uses the list count when the device list has published one", () => {
    expect(resolveDevicesTabCount(4, 12)).toBe(4);
  });

  it("uses the catalog size when the list has not published a count", () => {
    expect(resolveDevicesTabCount(undefined, 12)).toBe(12);
  });

  it("keeps a published zero so an empty first-time list stays at 0", () => {
    expect(resolveDevicesTabCount(0, 0)).toBe(0);
  });
});
