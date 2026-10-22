import { listOrganizations } from "../repositories/organization-repository";
import type {
  AddOrganizationUserInput,
  CreateOrganizationInput,
} from "../schemas";
import type { Organization, OrganizationUser } from "../types";

import { createdBySalesUser } from "./created-by-sales-user";
import { displayNameFromEmail } from "./display-name-from-email";
import { wouldLeaveWithoutAdmin } from "./would-leave-without-admin";

/** Expected organisation-directory failure codes. */
export type OrganizationStoreErrorCode =
  | "duplicate_organization"
  | "duplicate_email"
  | "admin_required"
  | "last_admin"
  | "admin_locked"
  | "organization_not_found"
  | "user_not_found";

/** Success or expected failure from an organisation write. */
export type OrganizationStoreResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: OrganizationStoreErrorCode; message: string };

/**
 * Creates an in-memory organisation catalog.
 *
 * @param initial - Initial organisations; omit to use fixtures
 * @param now - Clock used for the created-on date of a new organisation
 */
export function createOrganizationStore(
  initial: readonly Organization[] = listOrganizations(),
  now: () => Date = () => new Date(),
) {
  let organizations = cloneOrganizations(initial);
  const unseenIds = new Set<string>();
  let cached = organizations;
  let cachedUnseen = unseenIds;
  let nextOrganizationId = organizations.length + 1;
  let nextUserId = organizations.reduce((count, organization) => count + organization.users.length, 0) + 1;
  const listeners = new Set<() => void>();

  function emit() {
    cached = organizations;
    cachedUnseen = new Set(unseenIds);
    for (const listener of listeners) listener();
  }

  return {
    getSnapshot(): Organization[] {
      return cached;
    },

    /**
     * Organisations added in this session that have not been opened yet.
     */
    getUnseenSnapshot(): ReadonlySet<string> {
      return cachedUnseen;
    },

    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    addOrganization(
      input: CreateOrganizationInput,
    ): OrganizationStoreResult<Organization> {
      const duplicate = organizations.some(
        (organization) => organization.name.toLowerCase() === input.name.toLowerCase(),
      );
      if (duplicate) {
        return {
          ok: false,
          code: "duplicate_organization",
          message: "An organisation with this name already exists",
        };
      }

      const adminFailure = adminEmailFailure(input.adminEmails, organizations);
      if (adminFailure) return adminFailure;

      const organizationId = `${slugify(input.name)}-${nextOrganizationId++}`;
      const users = input.adminEmails.map((email) =>
        createAdminUser(email, organizationId, nextUserId++),
      );
      const organization: Organization = {
        id: organizationId,
        name: input.name,
        city: input.city,
        country: input.country,
        users,
        createdBy: createdBySalesUser(now()),
      };
      organizations = [...organizations, organization];
      unseenIds.add(organization.id);
      emit();
      return { ok: true, value: organization };
    },

    /**
     * Clears the new-organisation highlight after the row is opened once.
     *
     * @param organizationId - Organisation the user opened
     */
    acknowledgeOrganization(organizationId: string) {
      if (!unseenIds.delete(organizationId)) return;
      emit();
    },

    addUser(
      organizationId: string,
      input: AddOrganizationUserInput,
    ): OrganizationStoreResult<OrganizationUser> {
      const organization = organizations.find((item) => item.id === organizationId);
      if (!organization) {
        return {
          ok: false,
          code: "organization_not_found",
          message: "This organisation no longer exists",
        };
      }

      const duplicate = organizations.some((item) =>
        item.users.some((user) => user.email.toLowerCase() === input.email.toLowerCase()),
      );
      if (duplicate) {
        return {
          ok: false,
          code: "duplicate_email",
          message: "A user with this email already exists",
        };
      }

      const user: OrganizationUser = {
        id: `user-${nextUserId++}`,
        name: input.name,
        email: input.email,
        role: input.role,
        organizationId,
      };
      organizations = organizations.map((item) =>
        item.id === organizationId
          ? { ...item, users: [...item.users, user] }
          : item,
      );
      emit();
      return { ok: true, value: user };
    },

    /**
     * Changes one hospital user's Admin or User role.
     *
     * @param organizationId - Hospital that owns the user
     * @param userId - Directory user to update
     * @param role - Role they should have
     */
    setUserRole(
      organizationId: string,
      userId: string,
      role: OrganizationUser["role"],
    ): OrganizationStoreResult<OrganizationUser> {
      const organization = organizations.find((item) => item.id === organizationId);
      if (!organization) {
        return {
          ok: false,
          code: "organization_not_found",
          message: "This organisation no longer exists",
        };
      }

      const current = organization.users.find((user) => user.id === userId);
      if (!current) {
        return {
          ok: false,
          code: "user_not_found",
          message: "This user is not at this hospital",
        };
      }
      if (current.role === role) return { ok: true, value: current };
      if (current.role === "admin") {
        return {
          ok: false,
          code: "admin_locked",
          message: "An admin's role cannot be changed",
        };
      }
      if (wouldLeaveWithoutAdmin(organization.users, userId, role)) {
        return {
          ok: false,
          code: "last_admin",
          message: "The hospital must keep at least one admin",
        };
      }

      const updated = { ...current, role };
      organizations = organizations.map((item) =>
        item.id === organizationId
          ? {
              ...item,
              users: item.users.map((user) => (user.id === userId ? updated : user)),
            }
          : item,
      );
      emit();
      return { ok: true, value: updated };
    },
  };
}

function adminEmailFailure(
  emails: readonly string[],
  organizations: readonly Organization[],
): OrganizationStoreResult<never> | null {
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

function createAdminUser(
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

function cloneOrganizations(initial: readonly Organization[]): Organization[] {
  return initial.map((organization) => ({
    ...organization,
    users: organization.users.map((user) => ({ ...user })),
    createdBy: { ...organization.createdBy },
  }));
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "organization";
}

/** Shared in-memory organisation directory for Sales screens. */
export const organizationStore = createOrganizationStore();
