"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { InviteDirectoryUserDialog } from "@/features/organizations/components/invite-directory-user-dialog";
import {
  ORGANIZATION_USER_ROLE_LABELS,
  ORGANIZATION_USER_ROLE_OPTIONS,
} from "@/features/organizations/constants";
import { useOrganizations } from "@/features/organizations/hooks/use-organizations";
import { listHospitalDirectory } from "@/features/organizations/lib/list-hospital-directory";
import type { OrganizationUser, OrganizationUserRole } from "@/features/organizations/types";
import { GroupedList, GroupedListEmpty } from "@/features/shell/grouped-list";
import { InfoTooltip } from "@/features/shell/info-tooltip";
import { cn } from "@/lib/utils";

/**
 * Every hospital-side user, for Medela Internal staff.
 */
export function InternalUserList() {
  const { organizations, setUserRole } = useOrganizations();
  const rows = listHospitalDirectory(organizations);
  const [error, setError] = useState<string | null>(null);

  function changeRole(organizationId: string, userId: string, role: OrganizationUserRole) {
    const result = setUserRole(organizationId, userId, role);
    setError(result.ok ? null : result.message);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GroupedList
        scroll
        header={
          <div className="flex items-start justify-between gap-4 border-b border-black/6 px-5 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Hospital users</h2>
                <InfoTooltip label="About hospital users" side="right">
                  <p className="text-sm text-foreground">
                    Invite other members of a hospital team to this platform so they have access to device updates and details.
                  </p>
                </InfoTooltip>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">You are an admin for Medela.</p>
              {error ? (
                <p role="alert" className="mt-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </div>
            <InviteDirectoryUserDialog />
          </div>
        }
      >
        {rows.length === 0 ? (
          <GroupedListEmpty>No users yet</GroupedListEmpty>
        ) : (
          rows.map(({ user, hospitalName }) => (
            <UserRow
              key={user.id}
              user={user}
              hospitalName={hospitalName}
              onRoleChange={(role) => changeRole(user.organizationId, user.id, role)}
            />
          ))
        )}
      </GroupedList>
    </div>
  );
}

function UserRow({
  user,
  hospitalName,
  onRoleChange,
}: {
  user: OrganizationUser;
  hospitalName: string;
  onRoleChange: (role: OrganizationUserRole) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-[15px] font-semibold tracking-tight text-foreground">{user.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {user.email} · {hospitalName}
        </p>
      </div>
      {user.role === "admin" ? (
        <RoleTag role="admin" />
      ) : (
        <RoleSelect name={user.name} role={user.role} onChange={onRoleChange} />
      )}
    </div>
  );
}

function RoleTag({ role }: { role: OrganizationUserRole }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        role === "admin"
          ? "border-brand-yellow-dark/40 bg-brand-yellow-tint text-brand-ink"
          : "border-black/10 bg-black/[0.03] text-muted-foreground",
      )}
    >
      {ORGANIZATION_USER_ROLE_LABELS[role]}
    </span>
  );
}

function RoleSelect({
  name,
  role,
  onChange,
}: {
  name: string;
  role: OrganizationUserRole;
  onChange: (role: OrganizationUserRole) => void;
}) {
  return (
    <label className="relative shrink-0">
      <span className="sr-only">Role for {name}</span>
      <select
        value={role}
        onChange={(event) => onChange(event.target.value === "admin" ? "admin" : "user")}
        className="appearance-none rounded-full border border-black/10 bg-black/[0.03] py-0.5 pr-6 pl-2.5 text-xs font-medium text-muted-foreground"
      >
        {ORGANIZATION_USER_ROLE_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2"
      />
    </label>
  );
}
