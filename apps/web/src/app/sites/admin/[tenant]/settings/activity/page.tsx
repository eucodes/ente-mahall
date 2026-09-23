import { redirect } from "next/navigation";
import { Avatar, Cog, PageHeader, Pagination, SettingsSection } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getActivity, type ActivityEntry } from "@/lib/activity";

const PAGE_SIZE = 30;

const VERB_LABELS: Record<string, string> = {
  create: "created",
  update: "updated",
  delete: "removed",
  paid: "recorded a payment for",
  issue: "issued a certificate for"
};

function words(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .toLowerCase();
}

function describe(action: string): string {
  const parts = action.split(".");
  if (parts.length < 2) return words(action);
  const verb = parts.pop() ?? "";
  const resource = words(parts.join(" "));
  return `${VERB_LABELS[verb] ?? words(verb)} ${resource}`.trim();
}

function groupByDay(entries: ActivityEntry[]): [string, ActivityEntry[]][] {
  const groups = new Map<string, ActivityEntry[]>();
  for (const entry of entries) {
    const day = new Date(entry.createdAt).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    groups.set(day, [...(groups.get(day) ?? []), entry]);
  }
  return [...groups.entries()];
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
    <div className="max-w-5xl space-y-6">
      <PageHeader title="Activity log" description="Every change made across this Mahallu's records, newest first." />

      {result === null ? (
        <SettingsSection
          title="You don't have access to the activity log"
          description={`Your role (${membership.role.name}) doesn't include audit.view.`}
        />
      ) : result.entries.length === 0 ? (
        <SettingsSection title="No activity yet" description="Changes made across the app will show up here." />
      ) : (
        <>
          {groupByDay(result.entries).map(([day, entries]) => (
            <SettingsSection
              key={day}
              title={day}
              description={`${entries.length} change${entries.length === 1 ? "" : "s"}`}
              flush
            >
              <ol className="divide-y divide-border/60">
                {entries.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3 px-6 py-3.5">
                    {entry.actor ? (
                      <Avatar name={entry.actor.fullName} size="sm" className="mt-0.5" />
                    ) : (
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Cog className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{entry.actor?.fullName ?? "System"}</span>{" "}
                        <span className="text-muted-foreground">{describe(entry.action)}</span>
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground/80">{entry.action}</p>
                    </div>
                    <time dateTime={entry.createdAt} className="shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                    </time>
                  </li>
                ))}
              </ol>
            </SettingsSection>
          ))}
          <Pagination page={page} pageSize={PAGE_SIZE} total={result.total} hrefForPage={(p) => `/${slug}/activity?page=${p}`} />
        </>
      )}
    </div>
  );
}
