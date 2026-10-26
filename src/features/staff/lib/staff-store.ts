import { STAFF_USERS } from "../data/staff";
import type { InviteStaffUserInput } from "../schemas";
import type { MedelaStaffUser } from "../types";

/** Expected staff-directory failure codes. */
export type StaffStoreErrorCode = "duplicate_email";

/** Success or expected failure from a staff write. */
export type StaffStoreResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: StaffStoreErrorCode; message: string };

function cloneStaff(users: readonly MedelaStaffUser[]): MedelaStaffUser[] {
  return users.map((user) => ({ ...user }));
}

function nextStaffNumber(users: readonly MedelaStaffUser[]): number {
  return users.reduce((highest, user) => {
    const match = /^staff-(\d+)$/.exec(user.id);
    const number = match ? Number(match[1]) : 0;
    return number > highest ? number : highest;
  }, 0) + 1;
}

/**
 * Creates an in-memory Medela staff directory.
 *
 * @param initial - Initial people; omit to use fixtures
 */
export function createStaffStore(initial: readonly MedelaStaffUser[] = STAFF_USERS) {
  let users = cloneStaff(initial);
  let cached = users;
  let nextId = nextStaffNumber(users);
  const listeners = new Set<() => void>();

  function emit() {
    cached = users;
    for (const listener of listeners) listener();
  }

  return {
    getSnapshot(): MedelaStaffUser[] {
      return cached;
    },

    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    /**
     * Replaces the directory. Used by the First time / Populated header switch.
     *
     * @param next - People that should become the live catalog
     */
    replace(next: readonly MedelaStaffUser[]): void {
      users = cloneStaff(next);
      nextId = nextStaffNumber(users);
      emit();
    },

    /**
     * Adds one Medela staff person when the email is unused.
     *
     * @param input - Name, email, and role already validated
     */
    addUser(input: InviteStaffUserInput): StaffStoreResult<MedelaStaffUser> {
      const duplicate = users.some((user) => user.email === input.email);
      if (duplicate) {
        return {
          ok: false,
          code: "duplicate_email",
          message: "A user with this email already exists",
        };
      }

      const user: MedelaStaffUser = {
        id: `staff-${nextId++}`,
        name: input.name,
        email: input.email,
        role: input.role,
      };
      users = [...users, user];
      emit();
      return { ok: true, value: user };
    },
  };
}

/** Shared in-memory Medela staff directory for Internal Users. */
export const staffStore = createStaffStore();
