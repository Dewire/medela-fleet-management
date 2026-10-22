"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { PortalRole } from "@/features/account/types";
import { AuthHeading } from "@/features/shell/auth-heading";
import { AuthShell } from "@/features/shell/auth-shell";

/**
 * Prototype portal picker. Each button opens a role-specific route without a
 * real identity handshake.
 */
export function MedelaLoginForm() {
  const router = useRouter();

  function onSignIn(role: PortalRole) {
    router.push(role === "internal" ? "/internal" : `/${role}`);
  }

  return (
    <AuthShell>
      <AuthHeading title="Sign in" subtitle="Choose a profile to open its workspace." />
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="brand"
          className="h-11 w-full rounded-xl text-[15px] font-semibold"
          onClick={() => onSignIn("internal")}
        >
          Medela Internal
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl text-[15px] font-semibold"
          onClick={() => onSignIn("sales")}
        >
          Medela Sales
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl text-[15px] font-semibold"
          onClick={() => onSignIn("biomed")}
        >
          Biomed
        </Button>
      </div>
    </AuthShell>
  );
}
