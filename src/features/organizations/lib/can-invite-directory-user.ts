import { z } from "zod";

const directoryInviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  role: z.enum(["admin", "user"], { message: "Choose Admin or User" }),
  organizationId: z.string().trim().min(1, "Choose a hospital"),
});

/** Invite collected by the Internal hospital-users dialog. */
export type DirectoryInviteInput = z.infer<typeof directoryInviteSchema>;

/**
 * Whether Internal can send a hospital invite.
 *
 * @param input - Current email, role, and hospital
 * @returns true when every field is valid
 */
export function canInviteDirectoryUser(input: {
  email: string;
  role: string;
  organizationId: string;
}): boolean {
  return directoryInviteSchema.safeParse(input).success;
}

/**
 * Validates an Internal invite at the form boundary.
 *
 * @param input - Current email, role, and hospital
 * @returns The normalised invite, or the first validation message
 */
export function parseDirectoryInvite(input: {
  email: string;
  role: string;
  organizationId: string;
}): { ok: true; value: DirectoryInviteInput } | { ok: false; message: string } {
  const parsed = directoryInviteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the invite" };
  }
  return { ok: true, value: parsed.data };
}
