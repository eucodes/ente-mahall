import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getAllTenants, getAuditLogs, getPlatformSession } from "@/lib/platform";
import { AuditLogsExplorer } from "@/features/platform/audit-logs-explorer";

const PAGE_SIZE = 25;

export default async function AuditLogsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string; action?: string; tenantId?: string }>;
}) {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const { page: pageParam, search, action, tenantId } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [tenants, { entries, total }] = await Promise.all([
    getAllTenants(),
    getAuditLogs(page, PAGE_SIZE, { search, action, tenantId })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs &amp; Compliance Stream"
        description="Immutable, append-only security log recording every administrative action across the entire cluster."
      />
      <AuditLogsExplorer
        entries={entries}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        tenants={tenants}
        currentSearch={search}
        currentAction={action}
        currentTenantId={tenantId}
      />
    </div>
  );
}
