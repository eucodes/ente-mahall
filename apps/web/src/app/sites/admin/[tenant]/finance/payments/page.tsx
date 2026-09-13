import { redirect } from "next/navigation";
import { PageHeader, Card, CardContent, EmptyState, Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getVouchers } from "@/lib/finance";

export default async function PaymentsPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const res = await getVouchers(slug, 1, 100, "type=PAYMENT");
  const payments = res?.vouchers ?? [];

  return (
    <>
      <PageHeader
        title="Payments & Disbursements"
        description="Comprehensive register of all expenses and cash/bank disbursements."
      />

      <Card className="rounded-2xl border border-border/80 shadow-sm">
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No payment transactions recorded yet. Payments are generated when expense vouchers are marked as paid.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Voucher #</TableHead>
                    <TableHead>Payee / Party</TableHead>
                    <TableHead>Account / Category</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(p.date).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-semibold">
                        {p.voucherNumber || "—"}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {p.payeeName || p.partyName || p.member?.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-foreground">{p.account.name}</div>
                        {p.expenseCategory && (
                          <span className="text-[10px] text-muted-foreground block">{p.expenseCategory.name}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.paymentMethod || "Cash"}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          variant={p.status === "PAID" ? "secondary" : p.status === "CANCELLED" ? "destructive" : "outline"}
                          className="text-[10px]"
                        >
                          {p.status || "PAID"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-semibold text-rose-600 dark:text-rose-400">
                        -₹{parseFloat(p.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
