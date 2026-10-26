import { describe, expect, it, vi } from "vitest";

import { createOrganizationStore } from "@/features/organizations/lib/organization-store";

import { BIOMED_ORGANIZATION } from "../constants";
import { inviteHospitalUser } from "./invite-hospital-user";

const invite = {
  name: "Priya Nair",
  email: "priya.nair@stmarys.example",
  role: "user" as const,
};

describe("inviteHospitalUser", () => {
  it("creates a bare St Mary's hospital then adds the invited person", () => {
    const store = createOrganizationStore([]);
    const result = inviteHospitalUser(invite, store, new Date(2026, 9, 26));

    expect(result).toMatchObject({
      ok: true,
      value: { email: "priya.nair@stmarys.example", role: "user" },
    });
    expect(store.getSnapshot()).toEqual([
      expect.objectContaining({
        id: BIOMED_ORGANIZATION.id,
        name: BIOMED_ORGANIZATION.name,
        city: BIOMED_ORGANIZATION.city,
        country: BIOMED_ORGANIZATION.country,
      }),
    ]);
    expect(store.getSnapshot()[0]?.users).toHaveLength(1);
  });

  it("adds to the existing hospital without creating another", () => {
    const store = createOrganizationStore([]);
    inviteHospitalUser(invite, store);
    const ensureOrganization = vi.spyOn(store, "ensureOrganization");

    const result = inviteHospitalUser(
      { name: "James Okafor", email: "james.okafor@stmarys.example", role: "admin" },
      store,
    );

    expect(ensureOrganization).not.toHaveBeenCalled();
    expect(result.ok).toBe(true);
    expect(store.getSnapshot()).toHaveLength(1);
    expect(store.getSnapshot()[0]?.users).toHaveLength(2);
  });
});
