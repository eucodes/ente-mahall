import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AppShell,
  Badge,
  Calendar,
  Megaphone,
  Home,
  ListChecks,
  ShieldCheck,
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
    { label: "Overview", href: base, icon: <Home className="h-4 w-4" />, exact: true },
    { label: "Members", href: `${base}/members`, icon: <Users className="h-4 w-4" /> },
    { label: "Families", href: `${base}/families`, icon: <UsersRound className="h-4 w-4" /> },
    { label: "Events", href: `${base}/events`, icon: <Calendar className="h-4 w-4" /> },
    { label: "Announcements", href: `${base}/announcements`, icon: <Megaphone className="h-4 w-4" /> },
    { label: "Programs", href: `${base}/programs`, icon: <ListChecks className="h-4 w-4" /> },
    { label: "Administrators", href: `${base}/admins`, icon: <ShieldCheck className="h-4 w-4" /> }
  ];

  return (
    <AppShell
      navItems={navItems}
      brand={
        <Link href={base} className="flex min-w-0 items-center gap-2">
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
        <>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-tight">{user.fullName}</p>
            <p className="text-xs leading-tight text-muted-foreground">{membership.role.name}</p>
          </div>
          <LogoutButton redirectTo="/login" />
        </>
      }
      sidebarFooter={
        <Link href="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          &larr; All Mahalles
        </Link>
      }
    >
      {children}
    </AppShell>
  );
}
