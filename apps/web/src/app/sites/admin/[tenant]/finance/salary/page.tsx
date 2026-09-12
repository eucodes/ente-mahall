import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAccounts, getSalaryRecords } from "@/lib/finance";
import { SimpleCreateForm } from "@/features/tenants/simple-create-form";
import { FinanceSalaryTable } from "@/features/tenants/finance-salary-table";

const PAGE_SIZE = 100;

export default async function SalaryPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [result, accounts] = await Promise.all([getSalaryRecords(slug, 1, PAGE_SIZE), getAccounts(slug)]);

  if (result === null || accounts === null) {
    return (
      <>
        <PageHeader title="Salary" description="Staff salary obligations, reconciled against payment vouchers." />
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view finance"
              description={`Your role (${membership.role.name}) doesn't include finance.view.`}
            />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Salary" description="Staff salary obligations, reconciled against payment vouchers." />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add a salary record</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCreateForm
              slug={slug}
              resource="finance/salary"
              successMessage="Salary record added"
              fields={[
                { name: "staffName", label: "Staff name", required: true },
                { name: "month", label: "Month", required: true, type: "text" },
                { name: "amount", label: "Amount", required: true }
              ]}
            />
          </CardContent>
        </Card>
        <FinanceSalaryTable slug={slug} records={result.records} accounts={accounts} />
      </div>
    </>
  );
}
