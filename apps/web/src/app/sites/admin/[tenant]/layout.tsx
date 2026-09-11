import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AppShell,
  Avatar,
  Badge,
  Calendar,
  Megaphone,
  Home,
  ListChecks,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Users
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { LogoutButton } from "@/features/auth/logout-button";

export default async function TenantAdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  const base = `/${slug}`;
  const navItems = [
    { label: "Overview", href: base, icon: <Home />, exact: true },
    { label: "Members", href: `${base}/members`, icon: <Users /> },
    { label: "Families", href: `${base}/families`, icon: <UsersRound /> },
    { label: "Events", href: `${base}/events`, icon: <Calendar /> },
    { label: "Announcements", href: `${base}/announcements`, icon: <Megaphone /> },
    { label: "Programs", href: `${base}/programs`, icon: <ListChecks /> },
    { label: "Administrators", href: `${base}/admins`, icon: <ShieldCheck /> }
  ];

  return (
    <AppShell
      navItems={navItems}
      brand={
        <Link href={base} className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="truncate font-semibold tracking-tight">{membership.tenant.name}</span>
        </Link>
      }
      topbarTitle={
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Admin</Badge>
          <span className="truncate text-sm font-medium text-muted-foreground">{membership.tenant.name}</span>
        </div>
      }
      topbarActions={
        <Link href="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          &larr; All Mahalles
        </Link>
      }
      sidebarFooter={
        <div className="space-y-1 border-t border-border pt-4">
          <div className="flex items-center gap-3 rounded-xl px-1 py-1">
            <Avatar name={user.fullName} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">{user.fullName}</p>
              <p className="truncate text-xs leading-tight text-muted-foreground">{membership.role.name}</p>
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
