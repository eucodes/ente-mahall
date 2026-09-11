import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell, Badge, Building, Home, ScrollText, Sparkles } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/features/auth/logout-button";

export default async function ControlPlaneLayout({ children }: { children: ReactNode }) {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const navItems = [
    { label: "Overview", href: "/", icon: <Home className="h-4 w-4" />, exact: true },
    { label: "Audit logs", href: "/audit-logs", icon: <ScrollText className="h-4 w-4" /> }
  ];

  return (
    <AppShell
      accent="destructive"
      navItems={navItems}
      brand={
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive text-destructive-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">Control</span>
        </Link>
      }
      topbarTitle={
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1.5">
            <Building className="h-3.5 w-3.5" /> Platform control plane
          </Badge>
        </div>
      }
      topbarActions={
        <>
          <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
          <LogoutButton redirectTo="/login" />
        </>
      }
    >
      {children}
    </AppShell>
  );
}
