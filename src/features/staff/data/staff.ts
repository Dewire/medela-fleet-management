import type { MedelaStaffUser } from "../types";

/**
 * Seeded Medela staff for the Internal Users list.
 * Matches the Internal and Sales account fixtures, plus a firmware publisher.
 */
export const STAFF_USERS: MedelaStaffUser[] = [
  {
    id: "staff-1",
    name: "Sarah Chen",
    email: "sarah.chen@medela.com",
    role: "admin",
  },
  {
    id: "staff-2",
    name: "Maya Patel",
    email: "maya.patel@medela.com",
    role: "sales",
  },
  {
    id: "staff-3",
    name: "Tobias Keller",
    email: "tobias.keller@medela.com",
    role: "software_update",
  },
];
