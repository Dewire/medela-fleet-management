import { describe, expect, it } from "vitest";

import {
  LATEST_FIRMWARE_MESSAGE,
  NO_FIRMWARE_PACKAGE_MESSAGE,
  noInstallableFirmwareMessage,
} from "./no-installable-firmware-message";

describe("noInstallableFirmwareMessage", () => {
  it("calls a parseable version current", () => {
    expect(noInstallableFirmwareMessage("v2.4.0")).toBe(LATEST_FIRMWARE_MESSAGE);
  });

  it("does not call Not installed current", () => {
    expect(noInstallableFirmwareMessage("Not installed")).toBe(NO_FIRMWARE_PACKAGE_MESSAGE);
  });

  it("does not call an unparseable label current", () => {
    expect(noInstallableFirmwareMessage("nightly")).toBe(NO_FIRMWARE_PACKAGE_MESSAGE);
  });
});
