import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader, Pagination } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getPrograms, type Program } from "@/lib/business-resources";
import { SimpleCreateForm } from "@/features/tenants/simple-create-form";
import { SimpleResourceTable } from "@/features/tenants/simple-resource-table";

const PAGE_SIZE = 20;

export default async function ProgramsPage({
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
  const result = await getPrograms(slug, page, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Programs" description="Ongoing Mahalle initiatives." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view programs"
              description={`Your role (${membership.role.name}) doesn't include programs.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add a program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SimpleCreateForm
              slug={slug}
              resource="programs"
              successMessage="Program added"
              fields={[
                { name: "name", label: "Program name", required: true },
                { name: "description", label: "Description", type: "textarea" }
              ]}
            />
            {result.items.length === 0 && page === 1 ? (
              <EmptyState title="No programs yet" />
            ) : (
              <>
                <SimpleResourceTable<Program>
                  slug={slug}
                  resource="programs"
                  headers={["Name", "Description"]}
                  rows={result.items.map((p) => ({
                    item: p,
                    label: p.name,
                    cells: [<span key="name" className="font-medium">{p.name}</span>, p.description ?? "—"]
                  }))}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={result.total}
                  hrefForPage={(p) => `/${slug}/programs?page=${p}`}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
