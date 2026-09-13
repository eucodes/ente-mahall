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
  TableCell,
  Badge,
  Button
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAccounts, getGeneralLedger } from "@/lib/finance";
import Link from "next/link";

export default async function LedgerPage({
  params,
  searchParams
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ accountId?: string }>;
}) {
  const { tenant: slug } = await params;
  const { accountId } = await searchParams;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const accounts = (await getAccounts(slug)) ?? [];
  const selectedAccountId = accountId || accounts[0]?.id;

  const ledgerData = selectedAccountId
    ? await getGeneralLedger(slug, selectedAccountId)
    : null;

  return (
    <>
      <PageHeader
        title="General Ledger"
        description="Detailed ledger statement of accounts with running balances."
      />

      <div className="space-y-6">
        {/* Account Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {accounts.map((acc) => {
            const isSelected = acc.id === selectedAccountId;
            return (
              <Button
                key={acc.id}
                asChild
                size="sm"
                variant={isSelected ? "secondary" : "outline"}
                className="rounded-xl text-xs"
              >
                <Link href={`/${slug}/accounting/ledger?accountId=${acc.id}`}>
                  {acc.code ? `${acc.code} - ` : ""}{acc.name}
                </Link>
              </Button>
            );
          })}
        </div>

        {ledgerData ? (
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  {ledgerData.account?.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Type: {ledgerData.account?.type} | Code: {ledgerData.account?.code || "—"}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Closing Balance</span>
                <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  ₹{parseFloat(ledgerData.closingBalance || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Entry #</TableHead>
                      <TableHead>Particulars</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Running Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/20 font-medium">
                      <TableCell colSpan={3} className="text-xs">Opening Balance</TableCell>
                      <TableCell className="text-right text-xs">—</TableCell>
                      <TableCell className="text-right text-xs">—</TableCell>
                      <TableCell className="text-right text-xs font-mono">
                        ₹{parseFloat(ledgerData.openingBalance || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                    {ledgerData.entries?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-xs text-muted-foreground">
                          No transactions recorded for this account.
                        </TableCell>
                      </TableRow>
                    ) : (
                      ledgerData.entries?.map((entry: any) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(entry.date).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell className="text-xs font-mono font-medium">
                            {entry.entryNumber}
                          </TableCell>
                          <TableCell className="text-xs">{entry.description}</TableCell>
                          <TableCell className="text-right text-xs font-mono">
                            {parseFloat(entry.debit) > 0 ? `₹${parseFloat(entry.debit).toLocaleString("en-IN")}` : "—"}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono">
                            {parseFloat(entry.credit) > 0 ? `₹${parseFloat(entry.credit).toLocaleString("en-IN")}` : "—"}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono font-semibold">
                            ₹{parseFloat(entry.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-muted-foreground">Please select an account to view its ledger.</p>
        )}
      </div>
    </>
  );
}
