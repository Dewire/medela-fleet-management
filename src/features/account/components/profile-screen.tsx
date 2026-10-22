import { AccountAvatar } from "@/features/account/components/account-avatar";
import { getAccountUser } from "@/features/account/lib/current-user";
import type { PortalRole } from "@/features/account/types";
import { BackLink } from "@/features/shell/back-link";
import { DefinitionList } from "@/features/shell/definition-list";
import { Panel } from "@/features/shell/panel";

/**
 * Read-only profile for a prototype portal user.
 *
 * @param homeHref - Where the back link returns
 * @param role - Portal whose fixture identity should be displayed
 */
export function ProfileScreen({
  homeHref,
  role = "internal",
}: {
  homeHref: string;
  role?: PortalRole;
}) {
  const user = getAccountUser(role);

  return (
    <>
      <BackLink href={homeHref} label="Overview" />
      <div className="max-w-xl">
        <Panel className="p-6">
          <div className="mb-5 flex items-center gap-4">
            <AccountAvatar initials={user.initials} size="lg" />
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-foreground">{user.name}</h2>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DefinitionList
            rows={[
              ["Name", user.name],
              ["Email", user.email],
              ["Role", user.roleLabel],
              ["Organization", user.organization],
            ]}
          />
        </Panel>
      </div>
    </>
  );
}
