import { getAccountUser } from "@/features/account/lib/current-user";

import type { Organization, OrganizationCreator, OrganizationUser } from "../types";

/**
 * Seed customer organisations for the Sales prototype.
 * Listed oldest first so "Most recent" can reverse this order.
 */
export const ORGANIZATIONS: Organization[] = [
  hospital("addenbrookes-hospital", "Addenbrooke's Hospital", "Cambridge", "UK", "2025-03-12", [
    person("user-4", "Helen Brooks", "helen.brooks@addenbrookes.example", "admin"),
  ]),
  hospital("queen-elizabeth-hospital", "Queen Elizabeth Hospital", "Birmingham", "UK", "2025-05-02", [
    person("user-5", "Omar Farouk", "omar.farouk@qeh.example", "admin"),
    person("user-6", "Grace Adeyemi", "grace.adeyemi@qeh.example", "user"),
  ]),
  hospital("erasmus-mc", "Erasmus MC", "Rotterdam", "Netherlands", "2025-06-18", [
    person("user-7", "Sanne de Vries", "sanne.devries@erasmus.example", "admin"),
  ]),
  hospital("hospital-clinic", "Hospital Clínic", "Barcelona", "Spain", "2025-07-09", []),
  hospital("rigshospitalet", "Rigshospitalet", "Copenhagen", "Denmark", "2025-08-21", [
    person("user-8", "Maja Nielsen", "maja.nielsen@rigshospitalet.example", "admin"),
  ]),
  hospital("oslo-university-hospital", "Oslo University Hospital", "Oslo", "Norway", "2025-09-30", [
    person("user-9", "Inga Berg", "inga.berg@oslo.example", "admin"),
    person("user-10", "Lars Holm", "lars.holm@oslo.example", "user"),
  ]),
  hospital("akh-wien", "AKH Wien", "Vienna", "Austria", "2025-11-14", [
    person("user-11", "Anna Berger", "anna.berger@akhwien.example", "admin"),
  ]),
  hospital("karolinska", "Karolinska University Hospital", "Stockholm", "Sweden", "2026-01-08", [
    person("user-12", "Erik Lindgren", "erik.lindgren@karolinska.example", "user"),
  ]),
  hospital("hopital-necker", "Hôpital Necker", "Paris", "France", "2026-03-19", [
    person("user-13", "Camille Bernard", "camille.bernard@necker.example", "admin"),
  ]),
  hospital("charite", "Charité", "Berlin", "Germany", "2026-06-04", [
    person("user-14", "Lena Hoffmann", "lena.hoffmann@charite.example", "admin"),
  ]),
  hospital("st-marys-hospital", "St Mary's Hospital", "London", "UK", "2026-09-15", [
    person("user-1", "Alex Morgan", "alex.morgan@stmarys.example", "admin"),
    person("user-2", "Priya Nair", "priya.nair@stmarys.example", "user"),
    person("user-3", "James Okafor", "james.okafor@stmarys.example", "user"),
  ]),
];

function hospital(
  id: string,
  name: string,
  city: string,
  country: string,
  createdOn: string,
  users: Array<Omit<OrganizationUser, "organizationId">>,
): Organization {
  return {
    id,
    name,
    city,
    country,
    users: users.map((user) => ({ ...user, organizationId: id })),
    createdBy: salesCreator(createdOn),
  };
}

function salesCreator(createdOn: string): OrganizationCreator {
  const sales = getAccountUser("sales");
  return {
    name: sales.name,
    initials: sales.initials,
    detail: `${sales.email} · ${sales.organization}`,
    createdOn,
  };
}

function person(
  id: string,
  name: string,
  email: string,
  role: OrganizationUser["role"],
): Omit<OrganizationUser, "organizationId"> {
  return { id, name, email, role };
}
