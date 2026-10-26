import { inviteStaffUserSchema, type InviteStaffUserInput } from "../schemas";

/**
 * Whether Internal can send a Medela staff invite.
 *
 * @param input - Current name, email, and role
 * @returns true when every field is valid
 */
export function canInviteStaffUser(input: {
  name: string;
  email: string;
  role: string;
}): boolean {
  return inviteStaffUserSchema.safeParse(input).success;
}

/**
 * Validates a Medela staff invite at the form boundary.
 *
 * @param input - Current name, email, and role
 * @returns The normalised invite, or the first validation message
 */
export function parseStaffInvite(input: {
  name: string;
  email: string;
  role: string;
}): { ok: true; value: InviteStaffUserInput } | { ok: false; message: string } {
  const parsed = inviteStaffUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the invite" };
  }
  return { ok: true, value: parsed.data };
}
