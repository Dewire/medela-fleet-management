import { describe, expect, it } from "vitest";

import { countryForCity, suggestCountries, suggestPlaces } from "./places";

describe("suggestPlaces", () => {
  it("returns no cities for a blank search", () => {
    expect(suggestPlaces("  ")).toEqual([]);
  });

  it("matches a city regardless of case", () => {
    expect(suggestPlaces("lond").map((place) => place.city)).toEqual(["London"]);
  });

  it("hides suggestions when the city is already complete", () => {
    expect(suggestPlaces("London")).toEqual([]);
  });

  it("returns no cities when nothing matches", () => {
    expect(suggestPlaces("zzzz")).toEqual([]);
  });
});

describe("suggestCountries", () => {
  it("matches a country from a partial name", () => {
    expect(suggestCountries("ger")).toEqual(["Germany"]);
  });

  it("hides suggestions when the country is already complete", () => {
    expect(suggestCountries("UK")).toEqual([]);
  });

  it("returns no countries for a blank search", () => {
    expect(suggestCountries("")).toEqual([]);
  });
});

describe("countryForCity", () => {
  it("returns the country for a known city", () => {
    expect(countryForCity("  paris ")).toBe("France");
  });

  it("keeps unicode letters in the city name", () => {
    expect(countryForCity("Zürich")).toBe("Switzerland");
  });

  it("returns null when the city is unknown", () => {
    expect(countryForCity("Nowhere")).toBeNull();
  });
});
