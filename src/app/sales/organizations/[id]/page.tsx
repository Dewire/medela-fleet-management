import { OrganizationDetail } from "@/features/organizations/components/organization-detail";
import { AppShell } from "@/features/shell/app-shell";

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell portalRole="sales" title="Organisation">
      <OrganizationDetail organizationId={decodeURIComponent(id)} />
    </AppShell>
  );
}
