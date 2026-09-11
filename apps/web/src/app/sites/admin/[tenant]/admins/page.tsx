import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAdmins } from "@/lib/admins";
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

  const admins = await getAdmins(slug);

  return (
    <>
      <PageHeader title="Administrators" description="The people who help run this Mahalle." />

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
            <CardTitle>Add an administrator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AddAdminForm slug={slug} />
            <AdminsTable slug={slug} admins={admins} currentUserId={user.id} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
