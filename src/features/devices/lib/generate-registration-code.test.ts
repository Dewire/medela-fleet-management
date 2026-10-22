import { describe, expect, it } from "vitest";

import { generateRegistrationCode } from "./generate-registration-code";

describe("generateRegistrationCode", () => {
  it("returns exactly five digits", () => {
    expect(generateRegistrationCode(new Set(), () => 0.5)).toBe("55555");
  });

  it("pads a low digit so the code stays five characters", () => {
    expect(generateRegistrationCode(new Set(), () => 0)).toBe("00000");
  });

  it("retries when the generated code already exists", () => {
    const values = [
      ...Array(5).fill(0),
      ...Array(5).fill(0.999),
    ];
    let index = 0;
    const code = generateRegistrationCode(
      new Set(["00000"]),
      () => values[index++] ?? 0.999,
    );

    expect(code).toBe("99999");
  });

  it("returns null when every attempt collides", () => {
    const code = generateRegistrationCode(new Set(["00000"]), () => 0, 2);
    expect(code).toBeNull();
  });
});
