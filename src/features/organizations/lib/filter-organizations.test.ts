import { describe, expect, it } from "vitest";

import type { Organization } from "../types";
import { filterOrganizations } from "./filter-organizations";

const organisations: Organization[] = [
  hospital("addenbrookes", "Addenbrooke's Hospital", "Cambridge", "UK"),
  hospital("charite", "Charité", "Berlin", "Germany"),
  hospital("st-marys", "St Mary's Hospital", "London", "UK"),
];

describe("filterOrganizations", () => {
  it("returns every organisation when the search is blank", () => {
    const rows = filterOrganizations(organisations, { search: "  ", sort: "recent" });
    expect(rows).toHaveLength(organisations.length);
  });

  it("matches a hospital name regardless of case", () => {
    const rows = filterOrganizations(organisations, { search: "mary", sort: "name" });
    expect(rows.map((row) => row.id)).toEqual(["st-marys"]);
  });

  it("matches a city", () => {
    const rows = filterOrganizations(organisations, { search: "berlin", sort: "name" });
    expect(rows.map((row) => row.id)).toEqual(["charite"]);
  });

  it("keeps unicode letters in the hospital name", () => {
    const rows = filterOrganizations(organisations, { search: "charité", sort: "name" });
    expect(rows.map((row) => row.id)).toEqual(["charite"]);
  });

  it("orders hospitals A to Z", () => {
    const rows = filterOrganizations(organisations, { search: "", sort: "name" });
    expect(rows.map((row) => row.id)).toEqual(["addenbrookes", "charite", "st-marys"]);
  });

  it("orders hospitals newest first", () => {
    const rows = filterOrganizations(organisations, { search: "", sort: "recent" });
    expect(rows.map((row) => row.id)).toEqual(["st-marys", "charite", "addenbrookes"]);
  });

  it("returns nothing when the search matches no hospital", () => {
    const rows = filterOrganizations(organisations, { search: "tokyo", sort: "name" });
    expect(rows).toEqual([]);
  });
});

function hospital(id: string, name: string, city: string, country: string): Organization {
  return {
    id,
    name,
    city,
    country,
    users: [],
    createdBy: {
      name: "Maya Patel",
      initials: "MP",
      detail: "maya.patel@medela.com · Medela",
      createdOn: "2026-01-01",
    },
  };
}
