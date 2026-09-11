import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, Pagination } from "@mahalle/ui";
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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Families &middot; {membership.tenant.name}</h1>
        <Link href={`/${slug}`} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; Back
        </Link>
      </div>

      {result === null ? (
        <EmptyState
          title="You don't have permission to view families"
          description={`Your role (${membership.role.name}) doesn't include families.view.`}
        />
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
    </main>
  );
}
