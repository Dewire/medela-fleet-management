import type { Organization, OrganizationUser } from "../types";

import { displayNameFromEmail } from "./display-name-from-email";

/**
 * Next user-number after every directory person already in the catalog.
 */
export function nextUserNumber(organizations: readonly Organization[]): number {
  return organizations.reduce((count, organization) => count + organization.users.length, 0) + 1;
}

/**
 * Deep-copies organisations so store writes do not mutate fixtures.
 */
export function cloneOrganizations(initial: readonly Organization[]): Organization[] {
  return initial.map((organization) => ({
    ...organization,
    users: organization.users.map((user) => ({ ...user })),
    createdBy: { ...organization.createdBy },
  }));
}

/**
 * URL-safe id fragment from a hospital name.
 */
export function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "organization";
}

/**
 * Admin row created from an email on the add-organisation form.
 */
export function createAdminUser(
  email: string,
  organizationId: string,
  userNumber: number,
): OrganizationUser {
  const normalized = email.trim().toLowerCase();
  return {
    id: `user-${userNumber}`,
    name: displayNameFromEmail(normalized),
    email: normalized,
    role: "admin",
    organizationId,
  };
}

/**
 * Expected failure when admin emails are missing, duplicated, or already used.
 */
export function adminEmailFailure(
  emails: readonly string[],
  organizations: readonly Organization[],
): { ok: false; code: "admin_required" | "duplicate_email"; message: string } | null {
  if (emails.length === 0) {
    return {
      ok: false,
      code: "admin_required",
      message: "Add at least one admin email",
    };
  }

  const normalized = emails.map((email) => email.trim().toLowerCase());
  if (new Set(normalized).size !== normalized.length) {
    return {
      ok: false,
      code: "duplicate_email",
      message: "Each admin email must be unique",
    };
  }

  const taken = organizations.some((organization) =>
    organization.users.some((user) => normalized.includes(user.email.toLowerCase())),
  );
  if (taken) {
    return {
      ok: false,
      code: "duplicate_email",
      message: "A user with this email already exists",
    };
  }

  return null;
}
