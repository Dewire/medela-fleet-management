import { ProfileScreen } from "@/features/account/components/profile-screen";
import { AppShell } from "@/features/shell/app-shell";

export default function SalesProfilePage() {
  return (
    <AppShell
      portalRole="sales"
      title="Profile"
      subtitle="Your account details"
    >
      <ProfileScreen homeHref="/sales" role="sales" />
    </AppShell>
  );
}
