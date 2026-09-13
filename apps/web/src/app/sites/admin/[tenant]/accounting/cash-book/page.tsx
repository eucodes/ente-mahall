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
      <PageHeader title="Cash Book" description="Every cash movement in chronological order, with a running balance." />

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
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Opening Balance" value={`₹${result.openingBalance || "0.00"}`} tone="default" />
            <StatCard label="Total Cash Inflows" value={`₹${result.totalReceipts || "0.00"}`} tone="green" />
            <StatCard label="Closing Cash Balance" value={`₹${result.closingBalance || "0.00"}`} tone="violet" />
          </div>

          {result.rows.length === 0 ? (
            <EmptyState title="No transactions yet" description="Cash vouchers will appear here once recorded." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Voucher / Ref</TableHead>
                    <TableHead>Particulars</TableHead>
                    <TableHead className="text-right">Receipts (Dr)</TableHead>
                    <TableHead className="text-right">Payments (Cr)</TableHead>
                    <TableHead className="text-right">Running Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.map((row, idx) => {
                    const date = row.voucher?.date || row.date || "";
                    const ref = row.voucher?.voucherNumber || row.entryNumber || row.reference || "—";
                    const desc = row.voucher?.description || row.description || row.voucher?.partyName || row.voucher?.account?.name || "—";
                    const isReceipt = row.voucher ? row.voucher.type === "RECEIPT" : !!row.receipts;
                    const amount = row.voucher ? row.voucher.amount : (row.receipts || row.payments || "0");

                    return (
                      <TableRow key={row.id || row.voucher?.id || idx}>
                        <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                          {date ? new Date(date).toLocaleDateString("en-IN") : "—"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{ref}</TableCell>
                        <TableCell className="text-xs">{desc}</TableCell>
                        <TableCell className="text-right text-xs font-mono text-emerald-600">
                          {isReceipt ? `+₹${parseFloat(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono text-rose-600">
                          {!isReceipt ? `-₹${parseFloat(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs font-mono">
                          ₹{parseFloat(row.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
