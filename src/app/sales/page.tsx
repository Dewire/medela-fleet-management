import { AddOrganizationDialog } from "@/features/organizations/components/add-organization-dialog";
import { OrganizationList } from "@/features/organizations/components/organization-list";
import { AppShell } from "@/features/shell/app-shell";

export default function SalesDashboardPage() {
  return (
    <AppShell
      portalRole="sales"
      portalNav
      portalNavAction={<AddOrganizationDialog />}
      fill
    >
      <OrganizationList />
    </AppShell>
  );
}
