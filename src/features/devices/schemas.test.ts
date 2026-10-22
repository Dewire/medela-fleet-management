import { describe, expect, it } from "vitest";

import { registerDeviceSchema } from "./schemas";

describe("registerDeviceSchema", () => {
  it("accepts a known model and trimmed device ID", () => {
    expect(
      registerDeviceSchema.parse({
        id: "  KF-2026-00001 ",
        model: "Queen",
      }),
    ).toEqual({ id: "KF-2026-00001", model: "Queen" });
  });

  it("rejects an empty device ID", () => {
    const result = registerDeviceSchema.safeParse({
      id: "",
      model: "Queen",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a model outside the device catalog", () => {
    const result = registerDeviceSchema.safeParse({
      id: "KF-2026-00001",
      model: "Unknown Pump",
    });
    expect(result.success).toBe(false);
  });
});
