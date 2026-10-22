import { InternalUserList } from "@/features/organizations/components/internal-user-list";
import { AppShell } from "@/features/shell/app-shell";

export default function InternalUsersPage() {
  return (
    <AppShell fill fleetNav>
      <InternalUserList />
    </AppShell>
  );
}
