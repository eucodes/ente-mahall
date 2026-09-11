import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, Pagination } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAnnouncements, type Announcement } from "@/lib/business-resources";
import { SimpleCreateForm } from "@/features/tenants/simple-create-form";
import { SimpleResourceTable } from "@/features/tenants/simple-resource-table";

const PAGE_SIZE = 20;

export default async function AnnouncementsPage({
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
  const result = await getAnnouncements(slug, page, PAGE_SIZE);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Announcements &middot; {membership.tenant.name}</h1>
        <Link href={`/${slug}`} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; Back
        </Link>
      </div>

      {result === null ? (
        <EmptyState
          title="You don't have permission to view announcements"
          description={`Your role (${membership.role.name}) doesn't include announcements.view.`}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Post an announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SimpleCreateForm
              slug={slug}
              resource="announcements"
              successMessage="Announcement posted"
              fields={[
                { name: "title", label: "Title", required: true },
                { name: "body", label: "Body", type: "textarea", required: true }
              ]}
              extraFields={{ publish: true }}
            />
            {result.items.length === 0 && page === 1 ? (
              <EmptyState title="No announcements yet" />
            ) : (
              <>
                <SimpleResourceTable<Announcement>
                  slug={slug}
                  resource="announcements"
                  headers={["Title", "Status"]}
                  rows={result.items.map((a) => ({
                    item: a,
                    label: a.title,
                    cells: [
                      <span key="title" className="font-medium">{a.title}</span>,
                      <Badge key="status" variant={a.publishedAt ? "success" : "outline"}>
                        {a.publishedAt ? "Published" : "Draft"}
                      </Badge>
                    ]
                  }))}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={result.total}
                  hrefForPage={(p) => `/${slug}/announcements?page=${p}`}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
