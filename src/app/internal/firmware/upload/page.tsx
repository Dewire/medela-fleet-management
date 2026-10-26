import { UploadFirmwareForm } from "@/features/firmware/components/upload-firmware-form";
import { AppShell } from "@/features/shell/app-shell";
import { BackLink } from "@/features/shell/back-link";
import { resolveUploadReturn } from "@/features/shell/lib/fleet-tabs";

export default async function UploadFirmwarePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const back = resolveUploadReturn(from);

  return (
    <AppShell variant="form">
      <BackLink href={back.href} label={back.label} />
      <UploadFirmwareForm />
    </AppShell>
  );
}
