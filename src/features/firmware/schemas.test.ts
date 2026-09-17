import { describe, expect, it } from "vitest";

import { publishFirmwareSchema } from "./schemas";

describe("publishFirmwareSchema", () => {
  it("accepts a version, device type, and notes", () => {
    const result = publishFirmwareSchema.safeParse({
      version: "v2.5.0",
      deviceType: "Symphony",
      notes: "Notes",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a blank version", () => {
    const result = publishFirmwareSchema.safeParse({
      version: "   ",
      deviceType: "Symphony",
      notes: "Notes",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Enter a version label");
    }
  });

  it("accepts Queen as a device type", () => {
    const result = publishFirmwareSchema.safeParse({
      version: "v2.5.0",
      deviceType: "Queen",
      notes: "Notes",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a missing device type", () => {
    const result = publishFirmwareSchema.safeParse({
      version: "v2.5.0",
      deviceType: "",
      notes: "Notes",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Select a device type");
    }
  });

  it("rejects a device type that is not in the catalog", () => {
    const result = publishFirmwareSchema.safeParse({
      version: "v2.5.0",
      deviceType: "Unknown Pump",
      notes: "Notes",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Select a device type");
    }
  });

  it("rejects blank notes", () => {
    const result = publishFirmwareSchema.safeParse({
      version: "v2.5.0",
      deviceType: "Symphony",
      notes: "   ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Enter release notes");
    }
  });
});
