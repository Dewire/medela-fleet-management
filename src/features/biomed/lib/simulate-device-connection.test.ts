import { describe, expect, it } from "vitest";

import { PUBLISH_DEVICE_TYPES } from "@/features/firmware/lib/publish-device-types";

import { simulateDeviceConnection } from "./simulate-device-connection";

describe("simulateDeviceConnection", () => {
  it("fails when the random value is below one in four", () => {
    expect(simulateDeviceConnection(() => 0, 2026)).toEqual({ ok: false });
    expect(simulateDeviceConnection(() => 0.249, 2026)).toEqual({ ok: false });
  });

  it("assigns a year-stamped id and the first model on a low success roll", () => {
    const values = [0.25, 0, 0, 0, 0, 0, 0];
    let index = 0;

    expect(simulateDeviceConnection(() => values[index++] ?? 0, 2026)).toEqual({
      ok: true,
      id: "KF-2026-00000",
      model: PUBLISH_DEVICE_TYPES[0],
    });
  });

  it("pads the device id and picks the last model from a high roll", () => {
    const values = [0.99, 0.999, 0.999, 0.999, 0.999, 0.999, 0.999];
    let index = 0;

    expect(simulateDeviceConnection(() => values[index++] ?? 0, 2026)).toEqual({
      ok: true,
      id: "KF-2026-99999",
      model: PUBLISH_DEVICE_TYPES[PUBLISH_DEVICE_TYPES.length - 1],
    });
  });
});
