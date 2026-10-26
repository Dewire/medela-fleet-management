import { z } from "zod";

/**
 * Validates a Medela staff invite at the form boundary.
 */
export const inviteStaffUserSchema = z.object({
  name: z.string().trim().min(2, "Enter the user's name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  role: z.enum(["admin", "sales", "software_update"], {
    message: "Choose Admin, Sales, or Software Update",
  }),
});

/** Validated Medela staff invite fields. */
export type InviteStaffUserInput = z.infer<typeof inviteStaffUserSchema>;
