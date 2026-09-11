import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Avatar,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ListChecks,
  Megaphone,
  PageHeader,
  ShieldCheck,
  StatCard,
  UsersRound,
  Users,
  type StatCardTone
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getMembers } from "@/lib/members";
import { getAnnouncements, getEvents, getFamilies, getPrograms } from "@/lib/business-resources";

const STATS: { title: string; href: string; icon: typeof Users; tone: StatCardTone }[] = [
  { title: "Members", href: "members", icon: Users, tone: "violet" },
  { title: "Families", href: "families", icon: UsersRound, tone: "blue" },
  { title: "Events", href: "events", icon: Calendar, tone: "green" },
  { title: "Announcements", href: "announcements", icon: Megaphone, tone: "teal" },
  { title: "Programs", href: "programs", icon: ListChecks, tone: "default" }
];

const TODAY = new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

export default async function TenantAdminHomePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  const [membersResult, familiesResult, eventsResult, announcementsResult, programsResult] = await Promise.all([
    getMembers(slug, 1, 5),
    getFamilies(slug, 1, 1),
    getEvents(slug, 1, 5),
    getAnnouncements(slug, 1, 1),
    getPrograms(slug, 1, 1)
  ]);

  const counts: Record<string, number | null> = {
    members: membersResult?.total ?? null,
    families: familiesResult?.total ?? null,
    events: eventsResult?.total ?? null,
    announcements: announcementsResult?.total ?? null,
    programs: programsResult?.total ?? null
  };

  return (
    <>
      <PageHeader title={`Welcome back, ${user.fullName.split(" ")[0]}`} description={`${membership.role.name} at ${membership.tenant.name} · ${TODAY}`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STATS.map((stat) => (
          <Link key={stat.href} href={`/${slug}/${stat.href}`}>
            <StatCard
              label={stat.title}
              value={counts[stat.href] ?? "—"}
              icon={<stat.icon />}
              tone={stat.tone}
            />
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent members</CardTitle>
            <Link href={`/${slug}/members`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {!membersResult ? (
              <EmptyState title="Not available" description="You don't have permission to view members." />
            ) : membersResult.members.length === 0 ? (
              <EmptyState title="No members yet" />
            ) : (
              <ul className="divide-y divide-border">
                {membersResult.members.map((member) => (
                  <li key={member.id} className="flex items-center gap-3 py-2.5">
                    <Avatar name={member.fullName} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{member.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.family?.name ?? member.phone ?? "—"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Upcoming events</CardTitle>
            <Link href={`/${slug}/events`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {!eventsResult ? (
              <EmptyState title="Not available" description="You don't have permission to view events." />
            ) : eventsResult.items.length === 0 ? (
              <EmptyState title="No events yet" />
            ) : (
              <ul className="space-y-3">
                {eventsResult.items.map((event) => (
                  <li key={event.id} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-[10px] font-semibold uppercase leading-none text-primary">
                      <span>{new Date(event.startsAt).toLocaleDateString(undefined, { month: "short" })}</span>
                      <span className="text-sm">{new Date(event.startsAt).getDate()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{event.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{event.location ?? "No location set"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Link href={`/${slug}/admins`} className="group mt-4 block">
        <Card className="transition-shadow group-hover:shadow-md">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Administrators</p>
                <p className="text-sm text-muted-foreground">Add, re-role, or remove the people who help run this Mahalle.</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </CardContent>
        </Card>
      </Link>
    </>
  );
}
