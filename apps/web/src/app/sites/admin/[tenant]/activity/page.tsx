import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader, Pagination } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getActivity } from "@/lib/activity";

const PAGE_SIZE = 30;

function describe(action: string): string {
  const [resource, verb] = action.split(".").length >= 2 ? [action.split(".").slice(0, -1).join(" "), action.split(".").pop()!] : [action, ""];
  const VERB_LABELS: Record<string, string> = {
    create: "Created",
    update: "Updated",
    delete: "Removed",
    paid: "Recorded a payment for",
    issue: "Issued a certificate for"
  };
  const label = VERB_LABELS[verb] ?? verb;
  return `${label} ${resource.replace(/-/g, " ")}`.trim();
}

export default async function ActivityPage({
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
  const result = await getActivity(slug, page, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Activity" description="A timeline of changes made across this Mahallu's records." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view activity"
              description={`Your role (${membership.role.name}) doesn't include audit.view.`}
            />
          </CardContent>
        </Card>
      ) : result.entries.length === 0 ? (
        <EmptyState title="No activity yet" description="Changes made across the app will show up here." />
      ) : (
        <div className="space-y-6">
          <ol className="space-y-1 border-l border-border pl-4">
            {result.entries.map((entry) => (
              <li key={entry.id} className="relative py-2 text-sm">
                <span className="absolute -left-[21px] top-3.5 h-2 w-2 rounded-full bg-border" aria-hidden />
                <p>
                  <span className="font-medium">{entry.actor?.fullName ?? "System"}</span> · {describe(entry.action)}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString("en-IN")}</p>
              </li>
            ))}
          </ol>
          <Pagination page={page} pageSize={PAGE_SIZE} total={result.total} hrefForPage={(p) => `/${slug}/activity?page=${p}`} />
        </div>
      )}
    </>
  );
}
