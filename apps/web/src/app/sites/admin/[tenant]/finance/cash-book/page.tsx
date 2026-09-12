import { redirect } from "next/navigation";
import { Badge, Card, CardContent, EmptyState, PageHeader, StatCard, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getCashBook } from "@/lib/finance";

export default async function CashBookPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getCashBook(slug);

  return (
    <>
      <PageHeader title="Cash book" description="Every cash movement in chronological order, with a running balance." />

      {result === null ? (
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
          <StatCard label="Closing balance" value={`₹${result.closingBalance}`} tone="violet" />

          {result.rows.length === 0 ? (
            <EmptyState title="No transactions yet" description="Vouchers will appear here once recorded." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Voucher #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.map(({ voucher, balance }) => (
                    <TableRow key={voucher.id}>
                      <TableCell className="text-muted-foreground">{new Date(voucher.date).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell>{voucher.voucherNumber ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant={voucher.type === "RECEIPT" ? "secondary" : "outline"}>{voucher.type === "RECEIPT" ? "Receipt" : "Payment"}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{voucher.account.name}</TableCell>
                      <TableCell className="text-muted-foreground">{voucher.description ?? voucher.partyName ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {voucher.type === "RECEIPT" ? "+" : "-"}₹{voucher.amount}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">₹{balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
