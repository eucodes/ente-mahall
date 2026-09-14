import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import {
  getHealthSupportStats,
  getHealthSupportMembers,
  getHealthSupportFamilies
} from "@/lib/health-support";
import { HealthSupportClient } from "./health-support-client";

const PAGE_SIZE = 100;

export default async function TenantHealthSupportPage({
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

  const [stats, membersResult, familiesResult] = await Promise.all([
    getHealthSupportStats(slug),
    getHealthSupportMembers(slug, { page: 1, pageSize: PAGE_SIZE }),
    getHealthSupportFamilies(slug, { page: 1, pageSize: PAGE_SIZE })
  ]);

  if (membersResult === null) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Health & Support"
          description="Confidential Mahallu healthcare registry, disability support, and community welfare aid."
        />
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="Restricted Access"
              description={`Healthcare records are confidential. Your role (${membership.role.name}) does not have health.view permission.`}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <HealthSupportClient
      slug={slug}
      initialStats={stats}
      initialMembers={membersResult.members}
      initialFamilies={familiesResult?.families ?? []}
      totalMembers={membersResult.total}
    />
  );
}
