"use client";

import { useCallback, useSyncExternalStore } from "react";

import { staffStore, type StaffStoreResult } from "../lib/staff-store";
import type { InviteStaffUserInput } from "../schemas";
import type { MedelaStaffUser } from "../types";

/**
 * Live Medela staff directory shared by Internal Users.
 */
export function useStaff(): {
  users: MedelaStaffUser[];
  addUser: (input: InviteStaffUserInput) => StaffStoreResult<MedelaStaffUser>;
} {
  const users = useSyncExternalStore(staffStore.subscribe, staffStore.getSnapshot, staffStore.getSnapshot);
  const addUser = useCallback((input: InviteStaffUserInput) => staffStore.addUser(input), []);

  return { users, addUser };
}
