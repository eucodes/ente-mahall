import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader, StatCard } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAccounts, getFinanceSummary } from "@/lib/finance";
import { SimpleCreateForm } from "@/features/tenants/simple-create-form";
import { SimpleResourceTable } from "@/features/tenants/simple-resource-table";
import type { Account } from "@/lib/finance";

export default async function FinanceOverviewPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [accounts, summary] = await Promise.all([getAccounts(slug), getFinanceSummary(slug)]);

  return (
    <>
      <PageHeader title="Finance" description="Chart of accounts and the Mahallu's overall cash position." />

      {accounts === null || summary === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view finance"
              description={`Your role (${membership.role.name}) doesn't include finance.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total income" value={`₹${summary.totalIncome}`} tone="green" />
            <StatCard label="Total expense" value={`₹${summary.totalExpense}`} tone="blue" />
            <StatCard label="Net position" value={`₹${summary.netPosition}`} tone="violet" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add an account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SimpleCreateForm
                slug={slug}
                resource="finance/accounts"
                successMessage="Account added"
                fields={[
                  { name: "name", label: "Name", required: true },
                  {
                    name: "type",
                    label: "Type",
                    type: "select",
                    required: true,
                    options: [
                      { value: "INCOME", label: "Income" },
                      { value: "EXPENSE", label: "Expense" },
                      { value: "ASSET", label: "Asset" },
                      { value: "LIABILITY", label: "Liability" }
                    ]
                  }
                ]}
              />
              {accounts.length === 0 ? (
                <EmptyState title="No accounts yet" />
              ) : (
                <SimpleResourceTable<Account>
                  slug={slug}
                  resource="finance/accounts"
                  headers={["Name", "Type"]}
                  rows={accounts.map((account) => ({
                    item: account,
                    label: account.name,
                    cells: [<span key="name" className="font-medium">{account.name}</span>, account.type]
                  }))}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
