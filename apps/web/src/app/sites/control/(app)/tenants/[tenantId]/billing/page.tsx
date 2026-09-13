import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getPlatformSession, getPlatformTenant } from "@/lib/platform";
import { getPlans, getTenantSubscription, getTenantInvoices, getTenantPayments } from "@/lib/billing";
import { RegisterTenantName } from "@/features/platform/tenant-name-context";
import { TenantSubscriptionEditor } from "@/features/platform/tenant-subscription-editor";
import { InvoicesPanel } from "@/features/platform/invoices-panel";
import { PaymentsPanel } from "@/features/platform/payments-panel";

export default async function TenantBillingPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const tenant = await getPlatformTenant(tenantId);
  if (!tenant) {
    notFound();
  }

  const [plans, subscription, invoices, payments] = await Promise.all([
    getPlans(),
    getTenantSubscription(tenantId),
    getTenantInvoices(tenantId),
    getTenantPayments(tenantId)
  ]);

  return (
    <>
      <RegisterTenantName name={tenant.name} />
      <PageHeader
        title={`${tenant.name} — billing`}
        description="This Mahalle's plan, subscription status, invoices, and payments. Separate from whether the Mahalle itself is active."
        actions={<Badge variant={tenant.isActive ? "success" : "outline"}>Mahalle: {tenant.isActive ? "Active" : "Suspended"}</Badge>}
      />

      <div className="mb-6">
        <Link href={`/tenants/${tenantId}`} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; Back to Mahalle settings
        </Link>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Which plan this Mahalle is on, and its billing status.</CardDescription>
          </CardHeader>
          <CardContent>
            <TenantSubscriptionEditor tenantId={tenantId} subscription={subscription} plans={plans} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoicesPanel tenantId={tenantId} invoices={invoices} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentsPanel tenantId={tenantId} payments={payments} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
