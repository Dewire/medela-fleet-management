import { describe, expect, it } from "vitest";

import {
  generateRegistrationCode,
  isRegistrationCode,
  REGISTRATION_CODE_EXAMPLE,
} from "./generate-registration-code";

describe("isRegistrationCode", () => {
  it("accepts the published example format", () => {
    expect(isRegistrationCode(REGISTRATION_CODE_EXAMPLE)).toBe(true);
  });

  it("rejects a five-digit leftover", () => {
    expect(isRegistrationCode("87496")).toBe(false);
  });

  it("rejects a body that is the wrong length", () => {
    expect(isRegistrationCode("EU-K7M2Q9XR4D")).toBe(false);
  });
});

describe("generateRegistrationCode", () => {
  it("returns EU- plus eleven alphabet characters", () => {
    const code = generateRegistrationCode(new Set(), () => 0);
    expect(code).toBe("EU-AAAAAAAAAAA");
    expect(isRegistrationCode(code ?? "")).toBe(true);
  });

  it("uses the last alphabet character when random is high", () => {
    expect(generateRegistrationCode(new Set(), () => 0.999)).toBe("EU-99999999999");
  });

  it("retries when the generated code already exists", () => {
    const values = [...Array(11).fill(0), ...Array(11).fill(0.999)];
    let index = 0;
    const code = generateRegistrationCode(
      new Set(["EU-AAAAAAAAAAA"]),
      () => values[index++] ?? 0.999,
    );

    expect(code).toBe("EU-99999999999");
  });

  it("returns null when every attempt collides", () => {
    const code = generateRegistrationCode(new Set(["EU-AAAAAAAAAAA"]), () => 0, 2);
    expect(code).toBeNull();
  });
});
