import { createdBySalesUser } from "@/features/organizations/lib/created-by-sales-user";
import type { Organization } from "@/features/organizations/types";

import { BIOMED_ORGANIZATION } from "../constants";

/**
 * Empty St Mary's row so a First time invite has a hospital to write to.
 *
 * @param now - Clock for the created-on date
 * @returns Hospital with no directory users
 */
export function bareBiomedHospital(now: Date = new Date()): Organization {
  return {
    id: BIOMED_ORGANIZATION.id,
    name: BIOMED_ORGANIZATION.name,
    city: BIOMED_ORGANIZATION.city,
    country: BIOMED_ORGANIZATION.country,
    users: [],
    createdBy: createdBySalesUser(now),
  };
}
