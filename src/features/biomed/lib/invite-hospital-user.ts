import type {
  OrganizationStoreResult,
} from "@/features/organizations/lib/organization-store";
import type { AddOrganizationUserInput } from "@/features/organizations/schemas";
import type { Organization, OrganizationUser } from "@/features/organizations/types";

import { BIOMED_ORGANIZATION } from "../constants";
import { bareBiomedHospital } from "./bare-biomed-hospital";

/** Store methods the first hospital invite needs. */
export type HospitalInviteStore = {
  getSnapshot: () => readonly Organization[];
  ensureOrganization: (organization: Organization) => Organization;
  addUser: (
    organizationId: string,
    input: AddOrganizationUserInput,
  ) => OrganizationStoreResult<OrganizationUser>;
};

/**
 * Invites one person to the Biomed hospital, creating a bare St Mary's
 * first when the directory has none.
 *
 * @param input - Name, email, and role already validated
 * @param store - Organisation catalog
 * @param now - Clock used only when the hospital has to be created
 * @returns The added user, or the store's expected failure
 */
export function inviteHospitalUser(
  input: AddOrganizationUserInput,
  store: HospitalInviteStore,
  now: Date = new Date(),
): OrganizationStoreResult<OrganizationUser> {
  const existing = store.getSnapshot().find((item) => item.id === BIOMED_ORGANIZATION.id);
  if (!existing) {
    store.ensureOrganization(bareBiomedHospital(now));
  }
  return store.addUser(BIOMED_ORGANIZATION.id, input);
}
