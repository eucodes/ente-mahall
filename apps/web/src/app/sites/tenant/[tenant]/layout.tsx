import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Building } from "@mahalle/ui";
import { getPublicTenant } from "@/lib/tenants";
import { getMemberSession } from "@/lib/member-session";
import { LogoutButton } from "@/features/auth/logout-button";

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
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building className="h-4 w-4" />
            </div>
            <span className="truncate font-semibold tracking-tight">{tenant.name}</span>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Member site
            </Badge>
          </Link>
          {member && (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">{member.fullName}</span>
              <LogoutButton redirectTo="/login" endpoint={logoutEndpoint} />
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
