import { describe, expect, it } from "vitest";

import { parseCreateOrganizationForm } from "./parse-create-organization";

function hospitalForm(emails: string[]): FormData {
  const formData = new FormData();
  formData.set("name", " St Mary's ");
  formData.set("city", "London");
  formData.set("country", "UK");
  for (const email of emails) formData.append("adminEmail", email);
  return formData;
}

describe("parseCreateOrganizationForm", () => {
  it("keeps a filled admin email and ignores a blank extra row", () => {
    const result = parseCreateOrganizationForm(
      hospitalForm([" Alex@Hospital.ORG ", "   "]),
    );

    expect(result).toEqual({
      ok: true,
      data: {
        name: "St Mary's",
        city: "London",
        country: "UK",
        adminEmails: ["alex@hospital.org"],
      },
    });
  });

  it("rejects the form when every admin email is blank", () => {
    const result = parseCreateOrganizationForm(hospitalForm([" ", ""]));

    expect(result).toEqual({
      ok: false,
      message: "Add at least one admin email",
    });
  });

  it("rejects an invalid admin email", () => {
    const result = parseCreateOrganizationForm(hospitalForm(["not-an-email"]));

    expect(result).toEqual({
      ok: false,
      message: "Enter a valid admin email",
    });
  });
});
