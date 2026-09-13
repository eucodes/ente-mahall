import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { BillingPayments } from "@/features/billing/billing-payments";

export default async function BillingPaymentsPage({
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
    <BillingPayments
      slug={slug}
      tenantName={tenant.name}
    />
  );
}
