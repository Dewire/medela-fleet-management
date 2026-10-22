/** A city that can fill the hospital form, with the country it belongs to. */
export type Place = {
  city: string;
  country: string;
};

const SUGGESTION_LIMIT = 6;

/**
 * Cities offered in the hospital form. Choosing one fills the country too.
 */
const PLACES: readonly Place[] = [
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Barcelona", country: "Spain" },
  { city: "Berlin", country: "Germany" },
  { city: "Birmingham", country: "UK" },
  { city: "Brussels", country: "Belgium" },
  { city: "Cambridge", country: "UK" },
  { city: "Copenhagen", country: "Denmark" },
  { city: "Dublin", country: "Ireland" },
  { city: "Edinburgh", country: "UK" },
  { city: "Frankfurt", country: "Germany" },
  { city: "Geneva", country: "Switzerland" },
  { city: "Hamburg", country: "Germany" },
  { city: "Helsinki", country: "Finland" },
  { city: "Lisbon", country: "Portugal" },
  { city: "London", country: "UK" },
  { city: "Lyon", country: "France" },
  { city: "Madrid", country: "Spain" },
  { city: "Manchester", country: "UK" },
  { city: "Milan", country: "Italy" },
  { city: "Munich", country: "Germany" },
  { city: "Oslo", country: "Norway" },
  { city: "Paris", country: "France" },
  { city: "Prague", country: "Czechia" },
  { city: "Rome", country: "Italy" },
  { city: "Rotterdam", country: "Netherlands" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Vienna", country: "Austria" },
  { city: "Warsaw", country: "Poland" },
  { city: "Zürich", country: "Switzerland" },
];

const COUNTRIES = [...new Set(PLACES.map((place) => place.country))].sort((left, right) =>
  left.localeCompare(right),
);

/**
 * City matches for a search. An exact city hides the list because the field is already filled.
 *
 * @param query - Text typed into the city field
 * @returns Up to six places, or none when the query is blank or already a known city
 */
export function suggestPlaces(query: string): Place[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  if (countryForCity(query)) return [];
  return PLACES.filter((place) => place.city.toLowerCase().includes(needle)).slice(0, SUGGESTION_LIMIT);
}

/**
 * Country matches for a search. An exact country hides the list.
 *
 * @param query - Text typed into the country field
 * @returns Up to six country names
 */
export function suggestCountries(query: string): string[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const matches = COUNTRIES.filter((country) => country.toLowerCase().includes(needle));
  if (matches.length === 1 && matches[0]?.toLowerCase() === needle) return [];
  return matches.slice(0, SUGGESTION_LIMIT);
}

/**
 * Country for a known city, ignoring surrounding spaces and letter case.
 *
 * @param city - City name typed or chosen
 * @returns Matching country, or null when the city is not in the catalog
 */
export function countryForCity(city: string): string | null {
  const needle = city.trim().toLowerCase();
  return PLACES.find((place) => place.city.toLowerCase() === needle)?.country ?? null;
}
