import type { ParseFormResult } from "@/lib/parse-form";

import { createOrganizationSchema, type CreateOrganizationInput } from "../schemas";

/** Form control name shared by every admin email input. */
export const ADMIN_EMAIL_FIELD = "adminEmail";

/**
 * Reads a hospital form, drops blank admin rows, and validates the rest.
 *
 * Blank extra rows are ignored so an unused "add another email" field does
 * not block save. At least one non-blank address is still required.
 *
 * @param formData - Submitted hospital form
 * @returns Parsed hospital and admin emails, or the first validation message
 */
export function parseCreateOrganizationForm(
  formData: FormData,
): ParseFormResult<CreateOrganizationInput> {
  const adminEmails = formData.getAll(ADMIN_EMAIL_FIELD).flatMap((value) => {
    if (typeof value !== "string") return [];
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  });
  const result = createOrganizationSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    country: formData.get("country"),
    adminEmails,
  });

  if (result.success) return { ok: true, data: result.data };

  const firstIssue = result.error.issues[0];
  return {
    ok: false,
    message: firstIssue?.message ?? "Check the form and try again",
  };
}
