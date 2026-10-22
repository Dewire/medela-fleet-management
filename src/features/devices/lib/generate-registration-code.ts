const TOKEN_LENGTH = 5;
const DIGIT_COUNT = 10;
const MAX_TOKEN_ATTEMPTS = 20;

/**
 * Generates a unique five-digit hospital token.
 *
 * @param existing - Codes that cannot be reused
 * @param random - Random source, injectable for deterministic tests
 * @param maxAttempts - Collision limit before returning null
 * @returns A unique code from `00000` to `99999`, or null when attempts are exhausted
 */
export function generateRegistrationCode(
  existing: ReadonlySet<string>,
  random: () => number = Math.random,
  maxAttempts = MAX_TOKEN_ATTEMPTS,
): string | null {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const code = Array.from({ length: TOKEN_LENGTH }, () => {
      const digit = Math.min(DIGIT_COUNT - 1, Math.floor(random() * DIGIT_COUNT));
      return String(digit);
    }).join("");
    if (!existing.has(code)) return code;
  }
  return null;
}
