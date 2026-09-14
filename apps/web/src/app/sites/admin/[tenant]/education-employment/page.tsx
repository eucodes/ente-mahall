import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import {
  getEducationEmploymentStats,
  getEducationEmploymentMembers
} from "@/lib/education-employment";
import { EducationEmploymentClient } from "./education-employment-client";

const PAGE_SIZE = 100;

export default async function TenantEducationEmploymentPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  const [stats, membersResult] = await Promise.all([
    getEducationEmploymentStats(slug),
    getEducationEmploymentMembers(slug, { page: 1, pageSize: PAGE_SIZE })
  ]);

  if (membersResult === null) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Education & Employment"
          description="Mahallu education profiles, skills bank, and employment registry."
        />
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view education and employment records"
              description={`Your role (${membership.role.name}) does not include education.view.`}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <EducationEmploymentClient
      slug={slug}
      initialStats={stats}
      initialMembers={membersResult.members}
      total={membersResult.total}
    />
  );
}
