"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { Textarea } from "@/components/ui/textarea";
import { getAccountUser } from "@/features/account/lib/current-user";
import { useFirmwareReleases } from "@/features/firmware/hooks/use-firmware-releases";
import { PUBLISH_DEVICE_TYPE_OPTIONS } from "@/features/firmware/lib/publish-device-types";
import { signOffPersonFromName } from "@/features/firmware/lib/sign-off-person";
import { publishFirmwareSchema } from "@/features/firmware/schemas";
import { FormField } from "@/features/shell/form-field";
import { NativeSelect } from "@/features/shell/native-select";
import { Panel } from "@/features/shell/panel";
import { PrimaryActionButton } from "@/features/shell/primary-action-button";
import { SignOffCard } from "@/features/shell/sign-off-card";
import { parseFormData } from "@/lib/parse-form";

/**
 * Firmware publish form: file dropzone, device type, and release notes.
 */
export function UploadFirmwareForm() {
  const router = useRouter();
  const { publish } = useFirmwareReleases();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseFormData(new FormData(event.currentTarget), publishFirmwareSchema);
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }
    publish(parsed.data);
    router.push("/internal/firmware");
  }

  return (
    <>
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <Panel className="p-6">
          <h3 className="mb-4 font-semibold text-foreground">Firmware File</h3>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              setFileName(event.dataTransfer.files[0]?.name ?? "firmware.bin");
            }}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 transition-colors ${
              dragging ? "border-primary bg-secondary" : "border-border bg-muted"
            }`}
          >
            <Upload className="text-muted-foreground" size={28} />
            {fileName ? (
              <p className="text-sm font-medium text-foreground">{fileName}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Drag firmware file here, or{" "}
                  <span className="cursor-pointer font-medium text-primary hover:underline">Browse</span>
                </p>
                <p className="text-xs text-muted-foreground">.bin, .img, .hex — max 500 MB</p>
              </>
            )}
          </div>
        </Panel>

        <Panel className="p-6">
          <h3 className="mb-4 font-semibold text-foreground">Release Details</h3>
          <div className="flex flex-col gap-4">
            <FormField label="Version label" name="version" placeholder="v2.4.0" />
            <NativeSelect
              label="Device type"
              name="deviceType"
              defaultValue=""
              required
              options={PUBLISH_DEVICE_TYPE_OPTIONS}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground" htmlFor="notes">
                Release notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Describe what changed in this firmware release…"
                className="resize-none rounded-[6px] bg-white placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </Panel>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <PrimaryActionButton type="submit" className="self-start px-8">
          Publish Update
        </PrimaryActionButton>
      </form>
      <SignOffCard
        title="Sign-off"
        description="By publishing this release, your name will be recorded as the person who uploaded it."
        person={signOffPersonFromName(getAccountUser().name)}
        badge="Authorised"
        footer={
          <>
            Sign-off timestamp will be recorded as:{" "}
            <span className="font-mono">{new Date().toISOString().replace("T", " ").slice(0, 19)} UTC</span>
          </>
        }
      />
    </>
  );
}
