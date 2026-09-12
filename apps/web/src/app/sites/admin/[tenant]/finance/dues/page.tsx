import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAccounts, getDues } from "@/lib/finance";
import { getMembers } from "@/lib/members";
import { SimpleCreateForm } from "@/features/tenants/simple-create-form";
import { FinanceDuesTable } from "@/features/tenants/finance-dues-table";

const PAGE_SIZE = 100;

export default async function DuesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [result, accounts, membersResult] = await Promise.all([getDues(slug, 1, PAGE_SIZE), getAccounts(slug), getMembers(slug, 1, PAGE_SIZE)]);

  if (result === null || accounts === null) {
    return (
      <>
        <PageHeader title="Dues" description="Amounts owed by members, reconciled against payment vouchers." />
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
      <PageHeader title="Dues" description="Amounts owed by members, reconciled against payment vouchers." />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add a due</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCreateForm
              slug={slug}
              resource="finance/dues"
              successMessage="Due added"
              fields={[
                {
                  name: "memberId",
                  label: "Member",
                  type: "select",
                  required: true,
                  options: (membersResult?.members ?? []).map((m) => ({ value: m.id, label: m.fullName }))
                },
                { name: "title", label: "Title", required: true },
                { name: "amount", label: "Amount", required: true },
                { name: "dueDate", label: "Due date", type: "date", required: true }
              ]}
            />
          </CardContent>
        </Card>
        <FinanceDuesTable slug={slug} dues={result.dues} accounts={accounts} />
      </div>
    </>
  );
}
