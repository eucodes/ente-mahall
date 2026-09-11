import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader, Pagination } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getFamilies, type Family } from "@/lib/business-resources";
import { SimpleCreateForm } from "@/features/tenants/simple-create-form";
import { SimpleResourceTable } from "@/features/tenants/simple-resource-table";

const PAGE_SIZE = 20;

export default async function FamiliesPage({
  params,
  searchParams
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const result = await getFamilies(slug, page, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Families" description="Household units within the Mahalle." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view families"
              description={`Your role (${membership.role.name}) doesn't include families.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add a family</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SimpleCreateForm
              slug={slug}
              resource="families"
              successMessage="Family added"
              fields={[
                { name: "name", label: "Family name", required: true },
                { name: "address", label: "Address" },
                { name: "phone", label: "Phone" }
              ]}
            />
            {result.items.length === 0 && page === 1 ? (
              <EmptyState title="No families yet" />
            ) : (
              <>
                <SimpleResourceTable<Family>
                  slug={slug}
                  resource="families"
                  headers={["Name", "Address", "Phone"]}
                  rows={result.items.map((f) => ({
                    item: f,
                    label: f.name,
                    cells: [<span key="name" className="font-medium">{f.name}</span>, f.address ?? "—", f.phone ?? "—"]
                  }))}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={result.total}
                  hrefForPage={(p) => `/${slug}/families?page=${p}`}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
