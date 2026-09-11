import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "@mahalle/ui";
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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Administrators &middot; {membership.tenant.name}</h1>
        <Link href={`/${slug}`} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; Back
        </Link>
      </div>

      {admins === null ? (
        <EmptyState
          title="You don't have permission to manage administrators"
          description={`Your role (${membership.role.name}) doesn't include admins.view. Ask an owner or administrator of this Mahalle.`}
        />
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
    </main>
  );
}
