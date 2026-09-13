import { redirect } from "next/navigation";
import {
  PageHeader,
  Card,
  CardContent,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  CheckCircle2,
  AlertCircle
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getTrialBalance } from "@/lib/finance";

export default async function TrialBalancePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const data = await getTrialBalance(slug);

  return (
    <>
      <PageHeader
        title="Trial Balance"
        description="Verification of arithmetic accuracy of double-entry ledger postings."
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data?.isBalanced ? (
              <Badge variant="secondary" className="gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Trial Balance is Balanced (Debit = Credit)
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Unbalanced Postings Detected
              </Badge>
            )}
          </div>
        </div>

        <Card className="rounded-2xl border border-border/80 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Debit (₹)</TableHead>
                    <TableHead className="text-right">Credit (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.rows?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-xs text-muted-foreground">
                        No transactions recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.rows?.map((row: any) => (
                      <TableRow key={row.accountId}>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {row.accountCode || "—"}
                        </TableCell>
                        <TableCell className="text-xs font-medium">{row.accountName}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px]">{row.accountType}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono">
                          {parseFloat(row.debit) > 0 ? `₹${parseFloat(row.debit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono">
                          {parseFloat(row.credit) > 0 ? `₹${parseFloat(row.credit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {/* Totals */}
                  <TableRow className="bg-muted/40 font-bold border-t-2">
                    <TableCell colSpan={3} className="text-xs font-semibold">Total</TableCell>
                    <TableCell className="text-right text-xs font-mono">
                      ₹{parseFloat(data?.totalDebit || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono">
                      ₹{parseFloat(data?.totalCredit || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
