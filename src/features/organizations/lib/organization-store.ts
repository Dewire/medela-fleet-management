import { listOrganizations } from "../repositories/organization-repository";
import type {
  AddOrganizationUserInput,
  CreateOrganizationInput,
} from "../schemas";
import type { Organization, OrganizationUser } from "../types";

import { createdBySalesUser } from "./created-by-sales-user";
import {
  adminEmailFailure,
  cloneOrganizations,
  createAdminUser,
  nextUserNumber,
  slugify,
} from "./organization-store-helpers";
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
  let nextUserId = nextUserNumber(organizations);
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

    /**
     * Replaces the directory. Used by the First time / Populated header switch.
     * Clears unseen highlights and recounts ids.
     *
     * @param next - Organisations that should become the live catalog
     */
    replace(next: readonly Organization[]): void {
      organizations = cloneOrganizations(next);
      unseenIds.clear();
      nextOrganizationId = organizations.length + 1;
      nextUserId = nextUserNumber(organizations);
      emit();
    },

    /**
     * Inserts a hospital when that id is not already in the directory.
     *
     * @param organization - Hospital to keep, including a chosen id
     * @returns The existing row, or the inserted copy
     */
    ensureOrganization(organization: Organization): Organization {
      const existing = organizations.find((item) => item.id === organization.id);
      if (existing) return existing;
      organizations = [...organizations, ...cloneOrganizations([organization])];
      nextUserId = nextUserNumber(organizations);
      emit();
      return organizations[organizations.length - 1] ?? organization;
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

/** Shared in-memory organisation directory for Sales screens. */
export const organizationStore = createOrganizationStore();
