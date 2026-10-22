import { BiomedDeviceDetail } from "@/features/biomed/components/biomed-device-detail";
import { AppShell } from "@/features/shell/app-shell";

export default async function BiomedDevicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell portalRole="biomed" title="Device">
      <BiomedDeviceDetail deviceId={decodeURIComponent(id)} />
    </AppShell>
  );
}
