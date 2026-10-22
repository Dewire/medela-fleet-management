import { BiomedTabAction } from "@/features/biomed/components/biomed-tab-action";
import { AppShell } from "@/features/shell/app-shell";

/**
 * Shared chrome for the Biomed Devices and Users lists so the header and
 * tabs stay mounted when the selected tab changes.
 */
export default function BiomedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      portalRole="biomed"
      portalNav
      portalNavAction={<BiomedTabAction />}
      fill
    >
      {children}
    </AppShell>
  );
}
