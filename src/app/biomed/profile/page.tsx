import { ProfileScreen } from "@/features/account/components/profile-screen";
import { AppShell } from "@/features/shell/app-shell";

export default function BiomedProfilePage() {
  return (
    <AppShell
      portalRole="biomed"
      title="Profile"
      subtitle="Your account details"
    >
      <ProfileScreen homeHref="/biomed" role="biomed" />
    </AppShell>
  );
}
