import { describe, expect, it } from "vitest";

import { createPublishedRelease } from "./create-published-release";

const input = {
  version: "v2.5.0",
  deviceType: "Symphony",
  notes: "Connectivity fix",
} as const;

describe("createPublishedRelease", () => {
  it("stores version, device type, and notes on the release", () => {
    const release = createPublishedRelease(
      input,
      new Date("2026-09-10T12:00:00.000Z"),
      "Sarah Chen",
    );

    expect(release).toMatchObject({
      version: "v2.5.0",
      notes: "Connectivity fix",
      region: "All regions",
      deviceType: "Symphony",
      date: "2026-09-10",
      status: "active",
      devices: 0,
      uploadedBy: "Sarah Chen",
    });
  });

  it("keeps a different catalog model when that is the chosen type", () => {
    const release = createPublishedRelease(
      { ...input, deviceType: "Swing Maxi" },
      new Date("2026-09-10T12:00:00.000Z"),
      "Sarah Chen",
    );

    expect(release.deviceType).toBe("Swing Maxi");
  });

  it("does not copy extra fields from the input", () => {
    const release = createPublishedRelease(
      input,
      new Date("2026-09-10T12:00:00.000Z"),
      "Sarah Chen",
    );
    expect(release).not.toHaveProperty("hospital");
  });
});
