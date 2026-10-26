import { describe, expect, it } from "vitest";

import type { Organization } from "../types";
import { createOrganizationStore } from "./organization-store";

const seed: Organization[] = [
  {
    id: "hospital-one",
    name: "Hospital One",
    city: "Berlin",
    country: "Germany",
    createdBy: {
      name: "Maya Patel",
      initials: "MP",
      detail: "maya.patel@medela.com · Medela",
      createdOn: "2026-01-01",
    },
    users: [
      {
        id: "user-1",
        name: "Alex Morgan",
        email: "alex@hospital.org",
        role: "admin",
        organizationId: "hospital-one",
      },
    ],
  },
];

describe("createOrganizationStore", () => {
  it("adds an organisation and notifies subscribers", () => {
    const store = createOrganizationStore(seed);
    let notifications = 0;
    store.subscribe(() => {
      notifications += 1;
    });

    const result = store.addOrganization({
      name: "Hôpital Necker",
      city: "Paris",
      country: "France",
      adminEmails: ["marie.curie@necker.fr"],
    });

    expect(result.ok).toBe(true);
    expect(store.getSnapshot()).toHaveLength(2);
    expect(store.getSnapshot()[1]).toMatchObject({
      city: "Paris",
      country: "France",
    });
    expect(store.getSnapshot()[1]?.id).toMatch(/^hopital-necker-/);
    expect(notifications).toBe(1);
  });

  it("rejects a duplicate organisation name case-insensitively", () => {
    const store = createOrganizationStore(seed);
    const result = store.addOrganization({
      name: "hospital one",
      city: "Munich",
      country: "Germany",
      adminEmails: ["new.admin@hospital.org"],
    });

    expect(result).toMatchObject({ ok: false, code: "duplicate_organization" });
    expect(store.getSnapshot()).toHaveLength(1);
  });

  it("adds a user to the selected organisation", () => {
    const store = createOrganizationStore(seed);
    const result = store.addUser("hospital-one", {
      name: "Priya Nair",
      email: "priya@hospital.org",
      role: "user",
    });

    expect(result.ok).toBe(true);
    expect(store.getSnapshot()[0]?.users).toHaveLength(2);
  });

  it("keeps the role chosen for a new user", () => {
    const store = createOrganizationStore(seed);
    const result = store.addUser("hospital-one", {
      name: "Priya Nair",
      email: "priya@hospital.org",
      role: "admin",
    });

    expect(result).toMatchObject({ ok: true, value: { role: "admin" } });
  });

  it("rejects an email already used by another directory user", () => {
    const store = createOrganizationStore(seed);
    const result = store.addUser("hospital-one", {
      name: "Other Alex",
      email: "ALEX@HOSPITAL.ORG",
      role: "user",
    });

    expect(result).toMatchObject({ ok: false, code: "duplicate_email" });
  });

  it("stores one directory user for each admin email", () => {
    const store = createOrganizationStore(seed);
    const result = store.addOrganization({
      name: "City Clinic",
      city: "Oslo",
      country: "Norway",
      adminEmails: ["  Inga.Berg@Clinic.NO "],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.users).toEqual([
      expect.objectContaining({
        name: "Inga Berg",
        email: "inga.berg@clinic.no",
        role: "admin",
        organizationId: result.value.id,
      }),
    ]);
  });

  it("does not add the organisation when an admin email is already in use", () => {
    const store = createOrganizationStore(seed);
    const result = store.addOrganization({
      name: "City Clinic",
      city: "Oslo",
      country: "Norway",
      adminEmails: ["ALEX@HOSPITAL.ORG"],
    });

    expect(result).toMatchObject({ ok: false, code: "duplicate_email" });
    expect(store.getSnapshot()).toHaveLength(1);
  });

  it("rejects two identical admin emails on the same hospital", () => {
    const store = createOrganizationStore(seed);
    const result = store.addOrganization({
      name: "City Clinic",
      city: "Oslo",
      country: "Norway",
      adminEmails: ["inga@clinic.no", "inga@clinic.no"],
    });

    expect(result).toMatchObject({ ok: false, code: "duplicate_email" });
    expect(store.getSnapshot()).toHaveLength(1);
  });

  it("rejects a hospital with no admin email", () => {
    const store = createOrganizationStore(seed);
    const result = store.addOrganization({
      name: "City Clinic",
      city: "Oslo",
      country: "Norway",
      adminEmails: [],
    });

    expect(result).toMatchObject({ ok: false, code: "admin_required" });
    expect(store.getSnapshot()).toHaveLength(1);
  });

  it("highlights a new organisation until it is opened", () => {
    const store = createOrganizationStore(seed);
    const created = store.addOrganization({
      name: "City Clinic",
      city: "Oslo",
      country: "Norway",
      adminEmails: ["inga@clinic.no"],
    });

    expect(created.ok).toBe(true);
    if (!created.ok) return;
    expect(store.getUnseenSnapshot().has(created.value.id)).toBe(true);
    expect(store.getUnseenSnapshot().has("hospital-one")).toBe(false);

    store.acknowledgeOrganization(created.value.id);
    expect(store.getUnseenSnapshot().has(created.value.id)).toBe(false);
  });

  it("records the sales user and the local creation date", () => {
    const store = createOrganizationStore(seed, () => new Date(2026, 9, 22));
    const result = store.addOrganization({
      name: "City Clinic",
      city: "Oslo",
      country: "Norway",
      adminEmails: ["inga@clinic.no"],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.createdBy).toEqual({
      name: "Maya Patel",
      initials: "MP",
      detail: "maya.patel@medela.com · Medela",
      createdOn: "2026-10-22",
    });
  });

  it("replaces the directory and clears unseen highlights", () => {
    const store = createOrganizationStore(seed);
    store.addOrganization({
      name: "Hôpital Necker",
      city: "Paris",
      country: "France",
      adminEmails: ["marie.curie@necker.fr"],
    });

    store.replace([]);

    expect(store.getSnapshot()).toEqual([]);
    expect(store.getUnseenSnapshot().size).toBe(0);
  });

  it("keeps an existing hospital when ensuring the same id", () => {
    const store = createOrganizationStore(seed);
    const ensured = store.ensureOrganization({
      ...seed[0]!,
      name: "Other Name",
    });

    expect(ensured.name).toBe("Hospital One");
    expect(store.getSnapshot()).toHaveLength(1);
  });

  it("inserts a hospital when that id is missing", () => {
    const store = createOrganizationStore([]);
    const ensured = store.ensureOrganization(seed[0]!);

    expect(ensured.id).toBe("hospital-one");
    expect(store.getSnapshot()).toHaveLength(1);
  });

  it("returns an expected error when the organisation is missing", () => {
    const store = createOrganizationStore(seed);
    const result = store.addUser("missing", {
      name: "Priya Nair",
      email: "priya@hospital.org",
      role: "user",
    });

    expect(result).toMatchObject({ ok: false, code: "organization_not_found" });
  });

  it("promotes a directory user to admin", () => {
    const store = createOrganizationStore(seed);
    store.addUser("hospital-one", {
      name: "Priya Nair",
      email: "priya@hospital.org",
      role: "user",
    });
    const priya = store.getSnapshot()[0]?.users.find((user) => user.email === "priya@hospital.org");

    const result = store.setUserRole("hospital-one", priya?.id ?? "", "admin");

    expect(result).toMatchObject({ ok: true, value: { role: "admin" } });
  });

  it("does not change an admin's role", () => {
    const store = createOrganizationStore(seed);
    store.addUser("hospital-one", {
      name: "Priya Nair",
      email: "priya@hospital.org",
      role: "admin",
    });
    const result = store.setUserRole("hospital-one", "user-1", "user");

    expect(result).toMatchObject({ ok: false, code: "admin_locked" });
    expect(store.getSnapshot()[0]?.users[0]?.role).toBe("admin");
  });

  it("returns an expected error when the user is missing", () => {
    const store = createOrganizationStore(seed);
    expect(store.setUserRole("hospital-one", "missing", "user")).toMatchObject({
      ok: false,
      code: "user_not_found",
    });
  });
});
