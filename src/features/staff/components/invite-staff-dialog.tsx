"use client";

import { Mail } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/features/shell/form-field";
import { NativeSelect } from "@/features/shell/native-select";
import { PrimaryActionButton } from "@/features/shell/primary-action-button";
import { MEDELA_STAFF_ROLE_OPTIONS } from "@/features/staff/constants";
import { useStaff } from "@/features/staff/hooks/use-staff";
import { canInviteStaffUser, parseStaffInvite } from "@/features/staff/lib/can-invite-staff-user";
import { parseStaffRole } from "@/features/staff/lib/parse-staff-role";
import type { MedelaStaffRole } from "@/features/staff/types";

/**
 * Invites one Medela staff person from the Internal Users list.
 */
export function InviteStaffDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { addUser } = useStaff();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MedelaStaffRole>("admin");
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const canSend = canInviteStaffUser({ name, email, role });

  function open() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function reset() {
    setName("");
    setEmail("");
    setRole("admin");
    setError(null);
    setSentTo(null);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseStaffInvite({ name, email, role });
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }

    const result = addUser(parsed.value);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSentTo(parsed.value.email);
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-brand-teal px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark"
      >
        <Mail size={16} aria-hidden="true" />
        Invite user
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={reset}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border-0 bg-card p-0 text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_64px_rgba(0,0,0,0.18)] backdrop:bg-black/40 backdrop:backdrop-blur-lg"
      >
        {sentTo ? (
          <div className="flex flex-col gap-4 p-6">
            <h2 id={titleId} className="text-xl font-semibold text-foreground">
              Invite sent
            </h2>
            <p className="text-sm text-muted-foreground" role="status">
              Invite sent to {sentTo}.
            </p>
            <div className="flex justify-end">
              <PrimaryActionButton type="button" onClick={close}>
                Done
              </PrimaryActionButton>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-4 p-6" onSubmit={onSubmit}>
            <div>
              <h2 id={titleId} className="text-xl font-semibold text-foreground">
                Invite user
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                They will receive an email inviting them to Fleet Management.
              </p>
            </div>
            <FormField
              label="Name"
              name="name"
              placeholder="Sam Rivera"
              value={name}
              onChange={setName}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="sam.rivera@medela.com"
              value={email}
              onChange={setEmail}
            />
            <NativeSelect
              label="Role"
              name="role"
              value={role}
              onChange={(value) => setRole(parseStaffRole(value))}
              options={MEDELA_STAFF_ROLE_OPTIONS}
            />
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" className="h-11 rounded-xl px-5" onClick={close}>
                Cancel
              </Button>
              <PrimaryActionButton type="submit" disabled={!canSend}>
                Send invite
              </PrimaryActionButton>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
