import { getAccountUser } from "@/features/account/lib/current-user";

import type { OrganizationCreator } from "../types";

/**
 * Attributes an organisation to the Medela Sales prototype user.
 *
 * @param createdOn - Local calendar date the organisation was created
 * @returns Person and date for the authorised card
 */
export function createdBySalesUser(createdOn: Date): OrganizationCreator {
  const sales = getAccountUser("sales");
  return {
    name: sales.name,
    initials: sales.initials,
    detail: `${sales.email} · ${sales.organization}`,
    createdOn: formatLocalDate(createdOn),
  };
}

/**
 * Formats a date as a local calendar day.
 *
 * @param date - Instant to read in the runtime timezone
 * @returns `YYYY-MM-DD`
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
