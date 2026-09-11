import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader, Pagination } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getEvents, type MahalleEvent } from "@/lib/business-resources";
import { SimpleCreateForm } from "@/features/tenants/simple-create-form";
import { SimpleResourceTable } from "@/features/tenants/simple-resource-table";

const PAGE_SIZE = 20;

export default async function EventsPage({
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
  const result = await getEvents(slug, page, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Events" description="Scheduled Mahalle events." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view events"
              description={`Your role (${membership.role.name}) doesn't include events.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add an event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SimpleCreateForm
              slug={slug}
              resource="events"
              successMessage="Event added"
              fields={[
                { name: "title", label: "Title", required: true },
                { name: "startsAt", label: "Starts at", type: "datetime-local", required: true },
                { name: "location", label: "Location" },
                { name: "description", label: "Description", type: "textarea" }
              ]}
            />
            {result.items.length === 0 && page === 1 ? (
              <EmptyState title="No events yet" />
            ) : (
              <>
                <SimpleResourceTable<MahalleEvent>
                  slug={slug}
                  resource="events"
                  headers={["Title", "When", "Location"]}
                  rows={result.items.map((e) => ({
                    item: e,
                    label: e.title,
                    cells: [
                      <span key="title" className="font-medium">{e.title}</span>,
                      new Date(e.startsAt).toLocaleString(),
                      e.location ?? "—"
                    ]
                  }))}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={result.total}
                  hrefForPage={(p) => `/${slug}/events?page=${p}`}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
