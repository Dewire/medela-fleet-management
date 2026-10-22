import { AddDeviceDialog } from "@/features/biomed/components/add-device-dialog";
import { BiomedDeviceList } from "@/features/biomed/components/biomed-device-list";
import { AppShell } from "@/features/shell/app-shell";

export default function BiomedDashboardPage() {
  return (
    <AppShell
      portalRole="biomed"
      portalNav
      portalNavAction={<AddDeviceDialog />}
      fill
    >
      <BiomedDeviceList />
    </AppShell>
  );
}
