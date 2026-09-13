import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAdmins } from "@/lib/admins";
import { getRoles } from "@/lib/roles";
import { AddAdminForm, AdminsTable } from "@/features/tenants/admins-table";

export default async function TenantAdminsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  const [admins, roles] = await Promise.all([getAdmins(slug), getRoles(slug)]);
  const assignableRoles = (roles ?? []).filter((r) => r.isActive);

  return (
    <>
      <PageHeader
        title="Users"
        description="The people who help run this Mahalle, and the role each one holds."
        actions={
          <Link href={`/${slug}/admins/roles`} className="text-sm font-medium text-primary hover:underline">
            Manage roles →
          </Link>
        }
      />

      {admins === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to manage administrators"
              description={`Your role (${membership.role.name}) doesn't include admins.view. Ask an owner or administrator of this Mahalle.`}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add a user</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AddAdminForm slug={slug} roles={assignableRoles} />
            <AdminsTable slug={slug} admins={admins} roles={assignableRoles} currentUserId={user.id} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
