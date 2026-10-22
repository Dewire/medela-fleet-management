/**
 * Builds a directory display name from an email's local part.
 *
 * @param email - Address to read; the domain is ignored
 * @returns Title-cased words split on dots, underscores, and hyphens, or "Admin" when the local part has no letters or digits
 */
export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local
    .split(/[._-]+/)
    .filter((word) => /\p{L}|\p{N}/u.test(word));
  if (words.length === 0) return "Admin";
  return words.map(titleCaseWord).join(" ");
}

function titleCaseWord(word: string): string {
  return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase();
}
