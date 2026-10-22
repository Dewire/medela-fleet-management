import { describe, expect, it } from "vitest";

import {
  addOrganizationUserSchema,
  createOrganizationSchema,
} from "./schemas";

describe("createOrganizationSchema", () => {
  it("trims hospital name, city, and country", () => {
    expect(
      createOrganizationSchema.parse({
        name: "  St Mary's  ",
        city: " London ",
        country: " UK ",
        adminEmails: [" Alex@Hospital.ORG "],
      }),
    ).toEqual({
      name: "St Mary's",
      city: "London",
      country: "UK",
      adminEmails: ["alex@hospital.org"],
    });
  });

  it("rejects a blank hospital name", () => {
    const result = createOrganizationSchema.safeParse({
      name: " ",
      city: "London",
      country: "UK",
      adminEmails: ["alex@hospital.org"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing city", () => {
    const result = createOrganizationSchema.safeParse({
      name: "St Mary's",
      city: "",
      country: "UK",
      adminEmails: ["alex@hospital.org"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a hospital with no admin email", () => {
    const result = createOrganizationSchema.safeParse({
      name: "St Mary's",
      city: "London",
      country: "UK",
      adminEmails: [],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.message).toBe("Add at least one admin email");
  });

  it("rejects a repeated admin email", () => {
    const result = createOrganizationSchema.safeParse({
      name: "St Mary's",
      city: "London",
      country: "UK",
      adminEmails: ["alex@hospital.org", "ALEX@hospital.org"],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.message).toBe("Each admin email must be unique");
  });

  it("rejects an invalid admin email", () => {
    const result = createOrganizationSchema.safeParse({
      name: "St Mary's",
      city: "London",
      country: "UK",
      adminEmails: ["not-an-email"],
    });
    expect(result.success).toBe(false);
  });
});

describe("addOrganizationUserSchema", () => {
  it("normalizes a valid user email", () => {
    expect(
      addOrganizationUserSchema.parse({
        name: "Alex Morgan",
        email: " ALEX@HOSPITAL.ORG ",
        role: "user",
      }),
    ).toEqual({ name: "Alex Morgan", email: "alex@hospital.org", role: "user" });
  });

  it("rejects an invalid email", () => {
    const result = addOrganizationUserSchema.safeParse({
      name: "Alex Morgan",
      email: "not-an-email",
      role: "user",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a role other than admin or user", () => {
    const result = addOrganizationUserSchema.safeParse({
      name: "Alex Morgan",
      email: "alex@hospital.org",
      role: "owner",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.message).toBe("Choose Admin or User");
  });
});
