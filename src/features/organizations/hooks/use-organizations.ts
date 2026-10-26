"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  organizationStore,
  type OrganizationStoreResult,
} from "../lib/organization-store";
import type {
  AddOrganizationUserInput,
  CreateOrganizationInput,
} from "../schemas";
import type { Organization, OrganizationUser, OrganizationUserRole } from "../types";

/**
 * Live organisation directory shared by Sales screens.
 */
export function useOrganizations(): {
  organizations: Organization[];
  addOrganization: (
    input: CreateOrganizationInput,
  ) => OrganizationStoreResult<Organization>;
  addUser: (
    organizationId: string,
    input: AddOrganizationUserInput,
  ) => OrganizationStoreResult<OrganizationUser>;
  setUserRole: (
    organizationId: string,
    userId: string,
    role: OrganizationUserRole,
  ) => OrganizationStoreResult<OrganizationUser>;
  ensureOrganization: (organization: Organization) => Organization;
  unseenIds: ReadonlySet<string>;
  acknowledgeOrganization: (organizationId: string) => void;
} {
  const organizations = useSyncExternalStore(
    organizationStore.subscribe,
    organizationStore.getSnapshot,
    organizationStore.getSnapshot,
  );
  const unseenIds = useSyncExternalStore(
    organizationStore.subscribe,
    organizationStore.getUnseenSnapshot,
    organizationStore.getUnseenSnapshot,
  );
  const addOrganization = useCallback(
    (input: CreateOrganizationInput) => organizationStore.addOrganization(input),
    [],
  );
  const addUser = useCallback(
    (organizationId: string, input: AddOrganizationUserInput) =>
      organizationStore.addUser(organizationId, input),
    [],
  );
  const setUserRole = useCallback(
    (organizationId: string, userId: string, role: OrganizationUserRole) =>
      organizationStore.setUserRole(organizationId, userId, role),
    [],
  );
  const acknowledgeOrganization = useCallback(
    (organizationId: string) => organizationStore.acknowledgeOrganization(organizationId),
    [],
  );
  const ensureOrganization = useCallback(
    (organization: Organization) => organizationStore.ensureOrganization(organization),
    [],
  );

  return {
    organizations,
    addOrganization,
    addUser,
    setUserRole,
    ensureOrganization,
    unseenIds,
    acknowledgeOrganization,
  };
}
