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
        <PageHeader title="Staff Salary Register" description="Staff salary obligations, allowances, deductions, and payment disbursement." />
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
      <PageHeader title="Staff Salary Register" description="Staff salary obligations, allowances, deductions, and payment disbursement." />
      <div className="space-y-6">
        <Card className="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Add Salary Obligation</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCreateForm
              slug={slug}
              resource="finance/salary"
              successMessage="Salary obligation recorded"
              fields={[
                { name: "staffName", label: "Staff Name / Designation", required: true },
                { name: "month", label: "Month (e.g. Sep 2026)", required: true, type: "text" },
                { name: "basicSalary", label: "Basic Salary (₹)", required: true },
                { name: "allowances", label: "Allowances (₹)", hint: "Optional add-ons" },
                { name: "deductions", label: "Deductions (₹)", hint: "Optional deductions" }
              ]}
            />
          </CardContent>
        </Card>
        <FinanceSalaryTable slug={slug} records={result.records} accounts={accounts} />
      </div>
    </>
  );
}
