import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { BillingUsage } from "@/features/billing/billing-usage";

export default async function BillingUsagePage({
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

  const tenant = membership.tenant;

  return (
    <BillingUsage
      slug={slug}
      tenantName={tenant.name}
    />
  );
}
