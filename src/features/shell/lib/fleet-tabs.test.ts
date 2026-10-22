import { describe, expect, it } from "vitest";

import { resolveFleetTab } from "./fleet-tabs";

describe("resolveFleetTab", () => {
  it("selects Devices on the fleet overview", () => {
    expect(resolveFleetTab("/internal")).toBe("devices");
  });

  it("selects Firmware history on the history list", () => {
    expect(resolveFleetTab("/internal/firmware")).toBe("history");
  });

  it("selects Upload firmware on the publish form", () => {
    expect(resolveFleetTab("/internal/firmware/upload")).toBe("upload");
  });

  it("does not treat a firmware detail path as the upload tab", () => {
    expect(resolveFleetTab("/internal/firmware/v2.4.0")).toBe("history");
  });

  it("selects Users on the hospital directory", () => {
    expect(resolveFleetTab("/internal/users")).toBe("users");
  });

  it("falls back to Devices on other internal paths", () => {
    expect(resolveFleetTab("/internal/profile")).toBe("devices");
  });
});
