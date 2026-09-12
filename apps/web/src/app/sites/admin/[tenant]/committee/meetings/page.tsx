import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getCommitteeMeetings, getCommitteePosts } from "@/lib/committee";
import { CommitteeMeetings } from "@/features/tenants/committee-meetings";

const PAGE_SIZE = 100;

export default async function CommitteeMeetingsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [result, posts] = await Promise.all([getCommitteeMeetings(slug, 1, PAGE_SIZE), getCommitteePosts(slug)]);

  return (
    <>
      <PageHeader
        title="Committee meetings"
        description="Meetings, minutes, and decisions."
        actions={
          <Link href={`/${slug}/committee`} className="text-sm font-medium text-primary hover:underline">
            ← Roster
          </Link>
        }
      />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view the committee"
              description={`Your role (${membership.role.name}) doesn't include committee.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <CommitteeMeetings slug={slug} meetings={result.meetings} posts={posts ?? []} />
      )}
    </>
  );
}
