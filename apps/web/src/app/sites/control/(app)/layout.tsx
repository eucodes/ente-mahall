import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AppShell,
  Avatar,
  Badge,
  Building,
  CreditCard,
  FileText,
  Home,
  LayoutGrid,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Users
} from "@mahalle/ui";
import { getSession, redirectToLogin } from "@/lib/session";
import { getPlatformSession } from "@/lib/platform";
import { LogoutButton } from "@/features/auth/logout-button";
import { ControlBreadcrumbs } from "@/features/platform/control-breadcrumbs";
import { ControlTopbarActions } from "@/features/platform/control-topbar-actions";
import { TenantNameProvider } from "@/features/platform/tenant-name-context";
import { IdleTimeoutProvider } from "@/features/auth/idle-timeout-provider";

export default async function ControlPlaneLayout({ children }: { children: ReactNode }) {
  const user = await getSession();
  if (!user) {
    return await redirectToLogin();
  }

  const platformSession = await getPlatformSession();

  const navItems = [
    { label: "Overview", href: "/", icon: <Home />, exact: true },
    { label: "Fleet & Mahalles", href: "/tenants", icon: <Building /> },
    { label: "User Access & Accounts", href: "/users", icon: <Users /> },
    { label: "Platform Roles", href: "/roles", icon: <ShieldCheck /> },
    { label: "Platform Analytics", href: "/analytics", icon: <LayoutGrid /> },
    { label: "Plans & Billing", href: "/plans", icon: <CreditCard /> },
    { label: "System Settings", href: "/settings", icon: <Settings /> },
    { label: "Audit Stream", href: "/audit-logs", icon: <ScrollText /> }
  ];


  return (
    <IdleTimeoutProvider redirectUrl="/login?reason=inactivity">
      <TenantNameProvider>
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
          topbarActions={
            <ControlTopbarActions
              fullName={user.fullName}
              email={user.email}
              role={platformSession?.role ?? "Platform staff"}
            />
          }
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
          <ControlBreadcrumbs />
          {children}
        </AppShell>
      </TenantNameProvider>
    </IdleTimeoutProvider>
  );
}
