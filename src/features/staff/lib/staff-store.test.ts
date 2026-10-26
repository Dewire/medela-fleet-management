import { describe, expect, it } from "vitest";

import { STAFF_USERS } from "../data/staff";
import { createStaffStore } from "./staff-store";

const invite = {
  name: "Sam Rivera",
  email: "sam.rivera@medela.com",
  role: "sales" as const,
};

describe("createStaffStore", () => {
  it("starts with the seeded Medela staff", () => {
    expect(createStaffStore().getSnapshot()).toEqual(STAFF_USERS);
  });

  it("adds a person with the chosen role", () => {
    const store = createStaffStore([]);
    const result = store.addUser(invite);

    expect(result).toMatchObject({
      ok: true,
      value: { name: "Sam Rivera", email: "sam.rivera@medela.com", role: "sales" },
    });
    expect(store.getSnapshot()).toHaveLength(1);
  });

  it("rejects an email already used in the directory", () => {
    const store = createStaffStore(STAFF_USERS);
    const result = store.addUser({
      name: "Other Sarah",
      email: "sarah.chen@medela.com",
      role: "admin",
    });

    expect(result).toMatchObject({ ok: false, code: "duplicate_email" });
    expect(store.getSnapshot()).toHaveLength(STAFF_USERS.length);
  });

  it("replace empties the directory and later adds start a new id sequence", () => {
    const store = createStaffStore(STAFF_USERS);
    store.replace([]);

    expect(store.getSnapshot()).toEqual([]);
    expect(store.addUser(invite)).toMatchObject({
      ok: true,
      value: { id: "staff-1" },
    });
  });
});
