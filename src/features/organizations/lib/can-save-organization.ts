import { createOrganizationSchema } from "../schemas";

/**
 * Whether the hospital form has enough filled fields to save.
 * Blank extra admin rows are ignored. One invalid or missing admin email keeps Save off.
 *
 * @param input - Current field values, including every admin email row
 * @returns true when name, city, country, and at least one admin email are valid
 */
export function canSaveOrganization(input: {
  name: string;
  city: string;
  country: string;
  adminEmails: readonly string[];
}): boolean {
  const adminEmails = input.adminEmails.flatMap((email) => {
    const trimmed = email.trim();
    return trimmed ? [trimmed] : [];
  });
  return createOrganizationSchema.safeParse({
    name: input.name,
    city: input.city,
    country: input.country,
    adminEmails,
  }).success;
}
