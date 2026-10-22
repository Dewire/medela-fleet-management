import { z } from "zod";

const inviteHospitalUserSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  role: z.enum(["admin", "user"], { message: "Choose Admin or User" }),
});

/** Email and role collected by the Biomed invite dialog. */
export type HospitalInviteInput = z.infer<typeof inviteHospitalUserSchema>;

/**
 * Whether the invite can be sent.
 *
 * @param input - Current email and role
 * @returns true when the email is valid and the role is Admin or User
 */
export function canSendHospitalInvite(input: { email: string; role: string }): boolean {
  return inviteHospitalUserSchema.safeParse(input).success;
}

/**
 * Validates an invite at the form boundary.
 *
 * @param input - Current email and role
 * @returns The normalised invite, or the first validation message
 */
export function parseHospitalInvite(input: {
  email: string;
  role: string;
}): { ok: true; value: HospitalInviteInput } | { ok: false; message: string } {
  const parsed = inviteHospitalUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the invite" };
  }
  return { ok: true, value: parsed.data };
}
