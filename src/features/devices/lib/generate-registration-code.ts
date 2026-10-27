/** Region prefix shown on every prototype hospital token. */
export const REGISTRATION_CODE_PREFIX = "EU";

/** Alphanumeric body after `EU-`. */
export const REGISTRATION_CODE_BODY_LENGTH = 11;

/** Letters and digits used in a generated token body. */
export const REGISTRATION_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Example token used in copy and validation messages. */
export const REGISTRATION_CODE_EXAMPLE = "EU-K7M2Q9XR4DP";

const MAX_TOKEN_ATTEMPTS = 20;

const REGISTRATION_CODE_PATTERN = new RegExp(
  `^${REGISTRATION_CODE_PREFIX}-[${REGISTRATION_CODE_ALPHABET}]{${REGISTRATION_CODE_BODY_LENGTH}}$`,
);

/**
 * Whether a value is a hospital token in the `EU-K7M2Q9XR4DP` format.
 *
 * @param value - Candidate token
 * @returns true when the value is `EU-` plus 11 A–Z / 0–9 characters
 */
export function isRegistrationCode(value: string): boolean {
  return REGISTRATION_CODE_PATTERN.test(value);
}

/**
 * Generates a unique hospital token in the `EU-K7M2Q9XR4DP` format.
 *
 * @param existing - Codes that cannot be reused
 * @param random - Random source, injectable for deterministic tests
 * @param maxAttempts - Collision limit before returning null
 * @returns A unique `EU-` token, or null when attempts are exhausted
 */
export function generateRegistrationCode(
  existing: ReadonlySet<string>,
  random: () => number = Math.random,
  maxAttempts = MAX_TOKEN_ATTEMPTS,
): string | null {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const body = Array.from({ length: REGISTRATION_CODE_BODY_LENGTH }, () => {
      const index = Math.min(
        REGISTRATION_CODE_ALPHABET.length - 1,
        Math.floor(random() * REGISTRATION_CODE_ALPHABET.length),
      );
      return REGISTRATION_CODE_ALPHABET[index];
    }).join("");
    const code = `${REGISTRATION_CODE_PREFIX}-${body}`;
    if (!existing.has(code)) return code;
  }
  return null;
}
