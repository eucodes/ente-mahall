import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, Badge, Sparkles, Building, Calendar } from "@mahalle/ui";
import { getPublicTenant } from "@/lib/tenants";
import { getMemberSession } from "@/lib/member-session";
import { LogoutButton } from "@/features/auth/logout-button";
import { HijriDateBadge } from "@/features/navigation/hijri-date-badge";

export default async function TenantSiteLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const [tenant, member] = await Promise.all([getPublicTenant(slug), getMemberSession(slug)]);

  if (!tenant) {
    notFound();
  }

  const logoutEndpoint = `/tenants/${encodeURIComponent(slug)}/member-auth/logout`;

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href={`/`} className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-tight text-foreground">{tenant.name}</span>
              <span className="block truncate text-[11px] font-medium text-muted-foreground">Citizen Member Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <HijriDateBadge />
            {member && (
              <div className="flex items-center gap-3 pl-2 border-l border-border/60">
                <div className="hidden sm:flex items-center gap-2">
                  <Avatar name={member.fullName} size="sm" />
                  <span className="text-xs font-semibold text-foreground">{member.fullName}</span>
                </div>
                <LogoutButton redirectTo="/login" endpoint={logoutEndpoint} variant="secondary" />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">{children}</div>
      </main>

      <footer className="border-t border-border/60 bg-card py-6 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {tenant.name} · Powered by Ente Mahall Civic Tech</p>
      </footer>
    </div>
  );
}
