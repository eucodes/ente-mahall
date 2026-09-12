import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getPlatformSession, getPlatformTenant, getTenantRoles } from "@/lib/platform";
import { TenantStatusActions } from "@/features/platform/tenant-status-actions";
import { RolePermissionsEditor } from "@/features/platform/role-permissions-editor";

export default async function PlatformTenantDetailPage({
  params
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const [tenant, roles] = await Promise.all([getPlatformTenant(tenantId), getTenantRoles(tenantId)]);
  if (!tenant) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={tenant.name}
        description={`${tenant.slug} · ${tenant.memberCount} member${tenant.memberCount === 1 ? "" : "s"}`}
        actions={<Badge variant={tenant.isActive ? "success" : "outline"}>{tenant.isActive ? "Active" : "Suspended"}</Badge>}
      />

      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; All Mahalles
        </Link>
        <TenantStatusActions tenantId={tenant.id} slug={tenant.slug} isActive={tenant.isActive} afterDeleteHref="/" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>This Mahalle&apos;s dashboard</CardTitle>
          <CardDescription>
            Members, families, events, announcements, programs, and administrators — the same
            operational data this Mahalle&apos;s own admins see.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href={`/tenants/${tenant.id}/dashboard`}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Open dashboard &rarr;
          </Link>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What this Mahalle&apos;s roles can do</CardTitle>
          <CardDescription>
            This is the platform overriding tenant configuration — separate from, and taking
            precedence over, whatever this Mahalle&apos;s own OWNER has set up. Only SUPER_ADMIN
            can save changes here.
          </CardDescription>
        </CardHeader>
      </Card>

      {roles === null ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Couldn&apos;t load roles.</CardContent>
        </Card>
      ) : (
        <RolePermissionsEditor tenantId={tenant.id} roles={roles} />
      )}
    </>
  );
}
