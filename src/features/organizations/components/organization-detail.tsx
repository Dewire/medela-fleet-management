"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { BackLink } from "@/features/shell/back-link";
import { DefinitionList } from "@/features/shell/definition-list";
import { FormField } from "@/features/shell/form-field";
import { Panel } from "@/features/shell/panel";
import { PrimaryActionButton } from "@/features/shell/primary-action-button";
import { SignOffCard } from "@/features/shell/sign-off-card";
import { parseFormData } from "@/lib/parse-form";

import { ORGANIZATION_USER_ROLE_LABELS } from "../constants";
import { useOrganizations } from "../hooks/use-organizations";
import { canAddOrganizationUser } from "../lib/can-add-organization-user";
import { addOrganizationUserSchema } from "../schemas";
import type { Organization, OrganizationUser } from "../types";

/**
 * Sales view of one hospital, laid out like a device detail: identity card, then people.
 *
 * @param organizationId - Organisation selected by the route
 */
export function OrganizationDetail({
  organizationId,
}: {
  organizationId: string;
}) {
  const { organizations, acknowledgeOrganization } = useOrganizations();
  useEffect(() => {
    acknowledgeOrganization(organizationId);
  }, [acknowledgeOrganization, organizationId]);
  const organization = organizations.find((item) => item.id === organizationId);

  if (!organization) {
    return (
      <>
        <BackLink href="/sales" label="Back to Organisations" />
        <p className="text-sm text-muted-foreground">This organisation was not found.</p>
      </>
    );
  }

  return (
    <>
      <BackLink href="/sales" label="Back to Organisations" />
      <div className="flex max-w-xl flex-col gap-8">
        <HospitalSummary organization={organization} />
        <HospitalUsers organization={organization} />
        <SignOffCard
          title="Created by"
          description="This organisation was created by the person shown below."
          person={{
            name: organization.createdBy.name,
            initials: organization.createdBy.initials,
            detail: organization.createdBy.detail,
          }}
          badge="Authorised"
          footer={`Created on ${organization.createdBy.createdOn}`}
        />
      </div>
    </>
  );
}

/**
 * Hospital name and location, in the same card pattern as a device identity.
 *
 * @param organization - Hospital currently on screen
 */
function HospitalSummary({ organization }: { organization: Organization }) {
  return (
    <Panel className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-foreground">{organization.name}</h2>
      <DefinitionList
        rows={[
          ["City", organization.city],
          ["Country", organization.country],
        ]}
      />
    </Panel>
  );
}

/**
 * Everyone at the hospital with Fleet Management access, tagged as Admin.
 *
 * @param organization - Hospital currently on screen
 */
function HospitalUsers({ organization }: { organization: Organization }) {
  return (
    <Panel className="overflow-hidden py-0">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Hospital-side users</h3>
        <AddUserDialog organizationId={organization.id} />
      </div>
      {organization.users.length === 0 ? (
        <p className="border-t border-black/6 px-5 py-8 text-sm text-muted-foreground">
          No users yet.
        </p>
      ) : (
        <ul className="divide-y divide-black/6 border-t border-black/6">
          {organization.users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

/**
 * One hospital-side admin: name and email on the left, Admin tag on the right.
 *
 * @param user - Directory user on this hospital
 */
function UserRow({ user }: { user: OrganizationUser }) {
  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{user.name}</p>
        <a
          href={`mailto:${user.email}`}
          className="mt-1 block truncate text-sm text-muted-foreground hover:underline"
        >
          {user.email}
        </a>
      </div>
      <RoleTag />
    </li>
  );
}

/**
 * Everyone on this list is an admin. The yellow tint matches other Admin chips.
 */
function RoleTag() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-brand-yellow-dark/40 bg-brand-yellow-tint px-2.5 py-0.5 text-xs font-medium text-brand-ink">
      {ORGANIZATION_USER_ROLE_LABELS.admin}
    </span>
  );
}

/**
 * Opens the hospital-user form without leaving the people list.
 *
 * @param organizationId - Hospital that receives the new user
 */
function AddUserDialog({ organizationId }: { organizationId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { addUser } = useOrganizations();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const canAdd = canAddOrganizationUser({ name, email });

  function open() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setError(null);
    dialog.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("role", "admin");
    const parsed = parseFormData(formData, addOrganizationUserSchema);
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }

    const result = addUser(organizationId, parsed.data);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    close();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="shrink-0 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-yellow-dark"
      >
        Add admin
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => {
          setError(null);
          setName("");
          setEmail("");
        }}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] rounded-2xl border-0 bg-card p-0 text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_64px_rgba(0,0,0,0.18)] backdrop:bg-black/40 backdrop:backdrop-blur-lg"
      >
        <form className="flex flex-col gap-4 p-6" onSubmit={onSubmit}>
          <AddUserFields
            titleId={titleId}
            error={error}
            name={name}
            email={email}
            canAdd={canAdd}
            onNameChange={setName}
            onEmailChange={setEmail}
            onCancel={close}
          />
        </form>
      </dialog>
    </>
  );
}

/**
 * Fields for inviting one hospital-side user.
 *
 * @param titleId - Id of the dialog heading
 * @param error - Validation or store message, when the last submit failed
 * @param name - Current name
 * @param email - Current email
 * @param canAdd - Whether name and email are filled well enough to submit
 * @param onNameChange - Receives the new name
 * @param onEmailChange - Receives the new email
 * @param onCancel - Closes the dialog without saving
 */
function AddUserFields({
  titleId,
  error,
  name,
  email,
  canAdd,
  onNameChange,
  onEmailChange,
  onCancel,
}: {
  titleId: string;
  error: string | null;
  name: string;
  email: string;
  canAdd: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div>
        <h2 id={titleId} className="text-xl font-semibold text-foreground">
          Add hospital-side user
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          They receive an email inviting them to Fleet Management.
        </p>
      </div>
      <FormField label="Name" name="name" placeholder="Alex Morgan" value={name} onChange={onNameChange} />
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="alex@hospital.org"
        value={email}
        onChange={onEmailChange}
      />
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" className="h-11 rounded-xl px-5" onClick={onCancel}>
          Cancel
        </Button>
        <PrimaryActionButton type="submit" disabled={!canAdd}>
          Add admin
        </PrimaryActionButton>
      </div>
    </>
  );
}
