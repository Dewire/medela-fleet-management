"use client";

import { GroupedList, GroupedListEmpty } from "@/features/shell/grouped-list";
import { InfoTooltip } from "@/features/shell/info-tooltip";
import { InviteStaffDialog } from "@/features/staff/components/invite-staff-dialog";
import { MEDELA_STAFF_ROLE_LABELS } from "@/features/staff/constants";
import { useStaff } from "@/features/staff/hooks/use-staff";
import { listStaffUsers } from "@/features/staff/lib/list-staff-users";
import type { MedelaStaffRole, MedelaStaffUser } from "@/features/staff/types";
import { cn } from "@/lib/utils";

/**
 * Medela staff directory for Internal Users.
 */
export function MedelaUserList() {
  const { users } = useStaff();
  const rows = listStaffUsers(users);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GroupedList
        scroll
        header={
          <div className="flex items-start justify-between gap-4 border-b border-black/6 px-5 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Medela Users</h2>
                <InfoTooltip label="About Medela users" side="right">
                  <p className="text-sm text-foreground">
                    Invite other Medela teammates so they can manage devices, organisations, or firmware.
                  </p>
                </InfoTooltip>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">You are an admin for Medela.</p>
            </div>
            <InviteStaffDialog />
          </div>
        }
      >
        {rows.length === 0 ? (
          <GroupedListEmpty>No users yet</GroupedListEmpty>
        ) : (
          rows.map((user) => <UserRow key={user.id} user={user} />)
        )}
      </GroupedList>
    </div>
  );
}

function UserRow({ user }: { user: MedelaStaffUser }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-[15px] font-semibold tracking-tight text-foreground">{user.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <RoleTag role={user.role} />
    </div>
  );
}

function RoleTag({ role }: { role: MedelaStaffRole }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        role === "admin"
          ? "border-brand-yellow-dark/40 bg-brand-yellow-tint text-brand-ink"
          : "border-black/10 bg-black/[0.03] text-muted-foreground",
      )}
    >
      {MEDELA_STAFF_ROLE_LABELS[role]}
    </span>
  );
}
