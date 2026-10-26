import { describe, expect, it } from "vitest";

import type { MedelaStaffUser } from "../types";
import { listStaffUsers } from "./list-staff-users";

const people: MedelaStaffUser[] = [
  { id: "staff-2", name: "Maya Patel", email: "maya@medela.com", role: "sales" },
  { id: "staff-1", name: "Sarah Chen", email: "sarah@medela.com", role: "admin" },
  { id: "staff-3", name: "Tobias Keller", email: "tobias@medela.com", role: "software_update" },
];

describe("listStaffUsers", () => {
  it("returns an empty list when the directory is empty", () => {
    expect(listStaffUsers([])).toEqual([]);
  });

  it("orders people A to Z by name", () => {
    expect(listStaffUsers(people).map((user) => user.name)).toEqual([
      "Maya Patel",
      "Sarah Chen",
      "Tobias Keller",
    ]);
  });

  it("does not mutate the input", () => {
    const original = people.map((user) => user.id);
    listStaffUsers(people);
    expect(people.map((user) => user.id)).toEqual(original);
  });
});
