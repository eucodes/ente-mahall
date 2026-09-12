import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAccounts, getVouchers } from "@/lib/finance";
import { getMembers } from "@/lib/members";
import { RegisterTable } from "@/features/tenants/register-table";
import type { RegisterColumnConfig, RegisterFieldConfig, RegisterRecord } from "@/features/tenants/register-types";

const PAGE_SIZE = 100;

const COLUMNS: RegisterColumnConfig[] = [
  { header: "Voucher #", key: "voucherNumber" },
  { header: "Type", key: "type" },
  { header: "Account", key: "accountName" },
  { header: "Date", key: "date", format: "date" },
  { header: "Amount", key: "amount" },
  { header: "Party", key: "partyName" }
];

export default async function VouchersPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [result, accounts, membersResult] = await Promise.all([
    getVouchers(slug, 1, PAGE_SIZE),
    getAccounts(slug),
    getMembers(slug, 1, PAGE_SIZE)
  ]);

  if (result === null || accounts === null) {
    return (
      <>
        <PageHeader title="Vouchers" description="Every receipt and payment, categorized against an account." />
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

  const fields: RegisterFieldConfig[] = [
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { value: "RECEIPT", label: "Receipt (money in)" },
        { value: "PAYMENT", label: "Payment (money out)" }
      ]
    },
    {
      name: "accountId",
      label: "Account",
      type: "select",
      required: true,
      options: accounts.map((a) => ({ value: a.id, label: `${a.name} (${a.type})` }))
    },
    {
      name: "memberId",
      label: "Member",
      type: "select",
      hint: "Optional",
      options: (membersResult?.members ?? []).map((m) => ({ value: m.id, label: m.fullName }))
    },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "amount", label: "Amount", required: true },
    { name: "partyName", label: "Payer/payee name" },
    { name: "paymentMethod", label: "Payment method", hint: "e.g. Cash, UPI, Cheque" },
    { name: "description", label: "Description", type: "textarea", fullWidth: true }
  ];

  const records: RegisterRecord[] = result.vouchers.map((v) => ({
    ...v,
    accountName: v.account.name,
    memberName: v.member?.fullName ?? null
  }));

  return (
    <>
      <PageHeader title="Vouchers" description="Every receipt and payment, categorized against an account." />
      <RegisterTable
        slug={slug}
        resource="finance/vouchers"
        records={records}
        columns={COLUMNS}
        fields={fields}
        labelKey="voucherNumber"
        dialogTitle={{ create: "Add a voucher", edit: "Edit voucher" }}
        emptyTitle="No vouchers yet"
        emptyDescription="Add the first one above."
      />
    </>
  );
}
