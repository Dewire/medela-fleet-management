import { z } from "zod";

/**
 * Validates organisation creation at the form boundary.
 */
const adminEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid admin email");

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2, "Enter the hospital name"),
  city: z.string().trim().min(2, "Enter the hospital city"),
  country: z.string().trim().min(2, "Enter the hospital country"),
  adminEmails: z
    .array(adminEmailSchema)
    .min(1, "Add at least one admin email")
    .superRefine((emails, context) => {
      const seen = new Set<string>();
      for (const email of emails) {
        if (seen.has(email)) {
          context.addIssue({
            code: "custom",
            message: "Each admin email must be unique",
          });
          return;
        }
        seen.add(email);
      }
    }),
});

/**
 * Validates a directory user before assigning them to an organisation.
 */
export const addOrganizationUserSchema = z.object({
  name: z.string().trim().min(2, "Enter the user's name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  role: z.enum(["admin", "user"], { message: "Choose Admin or User" }),
});

/** Validated organisation creation fields. */
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

/** Validated organisation-user fields. */
export type AddOrganizationUserInput = z.infer<typeof addOrganizationUserSchema>;
