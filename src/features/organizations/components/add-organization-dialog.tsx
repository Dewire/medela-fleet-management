"use client";

import { Plus, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/features/shell/form-field";
import { InfoTooltip } from "@/features/shell/info-tooltip";
import { PrimaryActionButton } from "@/features/shell/primary-action-button";

import { LocationSearchField } from "./location-search-field";
import { useOrganizations } from "../hooks/use-organizations";
import { canSaveOrganization } from "../lib/can-save-organization";
import {
  ADMIN_EMAIL_FIELD,
  parseCreateOrganizationForm,
} from "../lib/parse-create-organization";
import { countryForCity, suggestCountries, suggestPlaces } from "../lib/places";

const INITIAL_ADMIN_ROW = "admin-1";

type AdminRow = { id: string; email: string };

/**
 * Opens a modal where Sales records a hospital account and its admins
 * without leaving the organisation list.
 */
export function AddOrganizationDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nextRowId = useRef(1);
  const titleId = useId();
  const router = useRouter();
  const { addOrganization } = useOrganizations();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [adminRows, setAdminRows] = useState<AdminRow[]>([{ id: INITIAL_ADMIN_ROW, email: "" }]);
  const canSave = canSaveOrganization({
    name,
    city,
    country,
    adminEmails: adminRows.map((row) => row.email),
  });

  function open() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setError(null);
    dialog.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function resetForm() {
    setError(null);
    setName("");
    setCity("");
    setCountry("");
    setAdminRows([{ id: INITIAL_ADMIN_ROW, email: "" }]);
    nextRowId.current = 1;
  }

  function changeCity(next: string) {
    setCity(next);
    const match = countryForCity(next);
    if (match) setCountry(match);
  }

  function addAdminRow() {
    nextRowId.current += 1;
    setAdminRows((rows) => [...rows, { id: `admin-${nextRowId.current}`, email: "" }]);
  }

  function removeAdminRow(rowId: string) {
    setAdminRows((rows) => rows.filter((row) => row.id !== rowId));
  }

  function changeAdminEmail(rowId: string, email: string) {
    setAdminRows((rows) => rows.map((row) => (row.id === rowId ? { ...row, email } : row)));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseCreateOrganizationForm(new FormData(event.currentTarget));
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }

    const result = addOrganization(parsed.data);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    close();
    router.push(`/sales/organizations/${result.value.id}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center rounded-xl bg-brand-yellow px-5 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-yellow-dark"
      >
        Add organisation
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={resetForm}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border-0 bg-card p-0 text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_64px_rgba(0,0,0,0.18)] backdrop:bg-black/40 backdrop:backdrop-blur-lg"
      >
        <form
          ref={formRef}
          className="flex flex-col gap-5 p-6"
          onSubmit={onSubmit}
        >
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-foreground">
              Add hospital
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Record the hospital account from the sales record.
            </p>
          </div>
          <FormField
            label="Hospital name"
            name="name"
            placeholder="St Mary's Hospital"
            value={name}
            onChange={setName}
          />
          <LocationSearchField
            label="City"
            name="city"
            value={city}
            placeholder="Search city"
            options={suggestPlaces(city).map((place) => ({
              label: `${place.city}, ${place.country}`,
              value: place.city,
            }))}
            onChange={changeCity}
            onSelect={changeCity}
          />
          <LocationSearchField
            label="Country"
            name="country"
            value={country}
            placeholder="Search country"
            options={suggestCountries(country).map((option) => ({ label: option, value: option }))}
            onChange={setCountry}
            onSelect={setCountry}
          />
          <fieldset className="flex flex-col gap-3">
            <legend className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              Admin
              <InfoTooltip
                label="Admin invitation"
                side="right"
                container={dialogRef}
              >
                <p className="text-sm text-foreground">
                  An email will be sent inviting them to Fleet Management.
                </p>
              </InfoTooltip>
            </legend>
            <p className="text-sm text-muted-foreground">Add hospital-side admin. At least one is required.</p>
            {adminRows.map((row, index) => (
              <div key={row.id} className="flex items-center gap-2">
                <Input
                  name={ADMIN_EMAIL_FIELD}
                  type="email"
                  autoComplete="off"
                  placeholder="name@hospital.org"
                  aria-label={`Admin email ${index + 1}`}
                  value={row.email}
                  onChange={(event) => changeAdminEmail(row.id, event.target.value)}
                  className="h-auto flex-1 rounded-[6px] bg-white px-3 py-2.5 placeholder:text-muted-foreground"
                />
                {adminRows.length > 1 ? (
                  <button
                    type="button"
                    aria-label={`Remove admin email ${index + 1}`}
                    onClick={() => removeAdminRow(row.id)}
                    className="flex size-11 shrink-0 items-center justify-center rounded-[6px] text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              onClick={addAdminRow}
              className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-foreground"
            >
              <Plus size={16} aria-hidden="true" />
              Add another email
            </button>
          </fieldset>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" className="h-11 rounded-xl px-5" onClick={close}>
              Cancel
            </Button>
            <PrimaryActionButton type="submit" disabled={!canSave}>
              Save
            </PrimaryActionButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
