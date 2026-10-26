import { addOrganizationUserSchema } from "../schemas";

/**
 * Whether the add-user form has a name and a valid email.
 * New people on this form are always stored as admins.
 *
 * @param input - Current name and email
 * @returns true when name and email would pass the add-user schema
 */
export function canAddOrganizationUser(input: {
  name: string;
  email: string;
}): boolean {
  return addOrganizationUserSchema.safeParse({ ...input, role: "admin" }).success;
}
