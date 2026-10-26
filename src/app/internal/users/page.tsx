import { AppShell } from "@/features/shell/app-shell";
import { MedelaUserList } from "@/features/staff/components/medela-user-list";

export default function InternalUsersPage() {
  return (
    <AppShell fill fleetNav>
      <MedelaUserList />
    </AppShell>
  );
}
