import Link from "next/link";

import { AccountMenu } from "@/features/account/components/account-menu";
import { getPortalHrefs } from "@/features/account/lib/current-user";
import type { PortalRole } from "@/features/account/types";
import { MedelaLogo } from "@/features/brand/components/medela-logo";
import { DemoDataSlider } from "@/features/shell/demo-data-slider";

/**
 * Brand-yellow toolbar: lockup on the left, account menu on the right.
 *
 * Yellow is a fill colour, so the lockup stays `text-brand-ink` — white type
 * on this yellow would vanish.
 *
 * @param role - Portal whose home and account links should be used
 */
export function AppHeader({ role = "internal" }: { role?: PortalRole }) {
  const hrefs = getPortalHrefs(role);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-yellow-dark/40 bg-brand-yellow">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-8">
        <Link href={hrefs.home}>
          <MedelaLogo className="h-[22px] text-brand-ink" />
        </Link>
        <div className="flex items-center gap-4">
          <DemoDataSlider />
          <AccountMenu role={role} />
        </div>
      </div>
    </header>
  );
}
