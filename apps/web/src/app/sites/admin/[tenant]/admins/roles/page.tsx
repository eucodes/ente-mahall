import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getRoles, getPermissionCatalogue } from "@/lib/roles";
import { RolesTable } from "@/features/tenants/roles-table";

export default async function RolesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [roles, categories] = await Promise.all([getRoles(slug), getPermissionCatalogue(slug)]);

  return (
    <>
      <PageHeader
        title="Roles"
        description="Default and custom roles, and the permissions each one grants."
        actions={
          <Link href={`/${slug}/admins`} className="text-sm font-medium text-primary hover:underline">
            ← Users
          </Link>
        }
      />

      {roles === null || categories === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to manage roles"
              description={`Your role (${membership.role.name}) doesn't include roles.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <RolesTable slug={slug} roles={roles} categories={categories} />
      )}
    </>
  );
}
