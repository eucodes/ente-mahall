import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import {
  getAuditLogs,
  getPlatformSession,
  getPlatformTenant
} from "@/lib/platform";
import { getTenantFeatures } from "@/lib/features";
import {
  getPlans,
  getTenantInvoices,
  getTenantPayments,
  getTenantSubscription
} from "@/lib/billing";
import { RegisterTenantName } from "@/features/platform/tenant-name-context";
import { TenantCommandCenter } from "@/features/platform/tenant-command-center";

export default async function PlatformTenantDetailPage({
  params
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const [tenant, tenantFeatures, plans, subscription, invoices, payments, { entries: auditLogs }] =
    await Promise.all([
      getPlatformTenant(tenantId),
      getTenantFeatures(tenantId),
      getPlans(),
      getTenantSubscription(tenantId),
      getTenantInvoices(tenantId),
      getTenantPayments(tenantId),
      getAuditLogs(1, 15, { tenantId })
    ]);

  if (!tenant) {
    notFound();
  }

  return (
    <>
      <RegisterTenantName name={tenant.name} />
      <TenantCommandCenter
        tenant={tenant}
        tenantFeatures={tenantFeatures}
        plans={plans}
        subscription={subscription}
        invoices={invoices}
        payments={payments}
        auditLogs={auditLogs}
        actorName={user.fullName}
      />
    </>
  );
}
