import { describe, expect, it } from "vitest";

import { PUBLISH_DEVICE_TYPES, PUBLISH_DEVICE_TYPE_OPTIONS } from "./publish-device-types";

describe("PUBLISH_DEVICE_TYPE_OPTIONS", () => {
  it("starts with an empty placeholder so staff must choose a type", () => {
    expect(PUBLISH_DEVICE_TYPE_OPTIONS[0]).toEqual(["", "Select device type"]);
  });

  it("lists each catalog model as a value and label", () => {
    expect(PUBLISH_DEVICE_TYPE_OPTIONS.slice(1)).toEqual(
      PUBLISH_DEVICE_TYPES.map((type) => [type, type]),
    );
  });

  it("does not include a fleet-wide catch-all type", () => {
    expect(PUBLISH_DEVICE_TYPE_OPTIONS.map(([value]) => value)).not.toContain("All device types");
  });
});
