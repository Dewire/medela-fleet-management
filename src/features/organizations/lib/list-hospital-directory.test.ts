import { describe, expect, it } from "vitest";

import type { Organization } from "../types";
import { listHospitalDirectory } from "./list-hospital-directory";

const organizations: Organization[] = [
  hospital("one", "Hospital One", [
    { id: "user-2", name: "Priya Nair", email: "priya@one.org", role: "user" },
    { id: "user-1", name: "Alex Morgan", email: "alex@one.org", role: "admin" },
  ]),
  hospital("two", "Hospital Two", [
    { id: "user-3", name: "James Okafor", email: "james@two.org", role: "user" },
  ]),
];

describe("listHospitalDirectory", () => {
  it("returns an empty list when no hospital has users", () => {
    expect(listHospitalDirectory([hospital("empty", "Empty", [])])).toEqual([]);
  });

  it("includes the hospital name on each person", () => {
    const rows = listHospitalDirectory(organizations);
    expect(rows.find((row) => row.user.id === "user-3")).toMatchObject({
      hospitalName: "Hospital Two",
    });
  });

  it("orders people A to Z by name", () => {
    expect(listHospitalDirectory(organizations).map((row) => row.user.name)).toEqual([
      "Alex Morgan",
      "James Okafor",
      "Priya Nair",
    ]);
  });
});

function hospital(
  id: string,
  name: string,
  users: Array<{ id: string; name: string; email: string; role: "admin" | "user" }>,
): Organization {
  return {
    id,
    name,
    city: "London",
    country: "UK",
    createdBy: {
      name: "Maya Patel",
      initials: "MP",
      detail: "maya.patel@medela.com · Medela",
      createdOn: "2026-01-01",
    },
    users: users.map((user) => ({ ...user, organizationId: id })),
  };
}
