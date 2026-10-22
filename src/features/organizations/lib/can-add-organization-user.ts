import { addOrganizationUserSchema } from "../schemas";

/**
 * Whether the add-user form has a name, a valid email, and a role.
 *
 * @param input - Current name, email, and role
 * @returns true when every field would pass the add-user schema
 */
export function canAddOrganizationUser(input: {
  name: string;
  email: string;
  role: string;
}): boolean {
  return addOrganizationUserSchema.safeParse(input).success;
}
