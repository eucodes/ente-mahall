import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getCommitteePosts } from "@/lib/committee";
import { getMembers } from "@/lib/members";
import { CommitteeRoster } from "@/features/tenants/committee-roster";

const PAGE_SIZE = 100;

export default async function CommitteePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [posts, membersResult] = await Promise.all([getCommitteePosts(slug), getMembers(slug, 1, PAGE_SIZE)]);

  return (
    <>
      <PageHeader
        title="Committee"
        description="The current committee roster."
        actions={
          <Link href={`/${slug}/committee/meetings`} className="text-sm font-medium text-primary hover:underline">
            View meetings →
          </Link>
        }
      />

      {posts === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view the committee"
              description={`Your role (${membership.role.name}) doesn't include committee.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <CommitteeRoster slug={slug} posts={posts} members={membersResult?.members ?? []} />
      )}
    </>
  );
}
