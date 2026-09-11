import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell, Avatar, Badge, Building, Home, ScrollText, ShieldCheck, Sparkles } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getPlatformSession } from "@/lib/platform";
import { LogoutButton } from "@/features/auth/logout-button";

export default async function ControlPlaneLayout({ children }: { children: ReactNode }) {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();

  const navItems = [
    { label: "Overview", href: "/", icon: <Home />, exact: true },
    { label: "All Mahalles", href: "/tenants", icon: <Building /> },
    { label: "Audit logs", href: "/audit-logs", icon: <ScrollText /> }
  ];

  return (
    <AppShell
      navItems={navItems}
      brand={
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight tracking-tight">MahalleOS</p>
            <p className="truncate text-[10px] font-semibold uppercase leading-tight tracking-wider text-muted-foreground">
              Control plane
            </p>
          </div>
        </Link>
      }
      topbarTitle={
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Root access
          </Badge>
          <span className="text-sm text-muted-foreground">Every action here is audited.</span>
        </div>
      }
      topbarActions={<span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>}
      sidebarFooter={
        <div className="space-y-1 border-t border-border pt-4">
          <div className="flex items-center gap-3 rounded-xl px-1 py-1">
            <Avatar name={user.fullName} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">{user.fullName}</p>
              <p className="truncate text-xs leading-tight text-muted-foreground">
                {platformSession?.role ?? "Platform staff"}
              </p>
            </div>
          </div>
          <LogoutButton
            redirectTo="/login"
            variant="ghost"
            showIcon
            className="w-full justify-start px-1 text-muted-foreground hover:text-foreground"
          />
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
