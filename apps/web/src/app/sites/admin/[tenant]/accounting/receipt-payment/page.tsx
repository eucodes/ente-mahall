import { redirect } from "next/navigation";
import {
  PageHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getReceiptPaymentAccount } from "@/lib/finance";

export default async function ReceiptPaymentPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const data = await getReceiptPaymentAccount(slug);

  return (
    <>
      <PageHeader
        title="Receipt & Payment Account"
        description="Summary of all cash and bank inflows and outflows during the period."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Receipts Column */}
        <Card className="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-emerald-500/5">
            <CardTitle className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
              Receipts (Inflows)
            </CardTitle>
            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
              ₹{parseFloat(data?.totalReceipts || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Head of Account</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/10 font-medium">
                  <TableCell className="text-xs">Opening Cash & Bank Balance</TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    ₹{parseFloat(data?.openingBalance || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
                {data?.receipts?.map((r: any) => (
                  <TableRow key={r.accountId}>
                    <TableCell className="text-xs font-medium">{r.accountName}</TableCell>
                    <TableCell className="text-right text-xs font-mono">
                      ₹{parseFloat(r.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payments Column */}
        <Card className="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-rose-500/5">
            <CardTitle className="text-base font-semibold text-rose-800 dark:text-rose-300">
              Payments (Outflows)
            </CardTitle>
            <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-400">
              ₹{parseFloat(data?.totalPayments || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Head of Account</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.payments?.map((p: any) => (
                  <TableRow key={p.accountId}>
                    <TableCell className="text-xs font-medium">{p.accountName}</TableCell>
                    <TableCell className="text-right text-xs font-mono">
                      ₹{parseFloat(p.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/10 font-medium border-t">
                  <TableCell className="text-xs font-bold">Closing Cash & Bank Balance</TableCell>
                  <TableCell className="text-right text-xs font-mono font-bold">
                    ₹{parseFloat(data?.closingBalance || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
