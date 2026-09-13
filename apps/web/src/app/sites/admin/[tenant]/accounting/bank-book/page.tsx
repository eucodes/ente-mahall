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
  Button,
  Building2
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getBankAccounts, getBankBook } from "@/lib/finance";
import Link from "next/link";

export default async function BankBookPage({
  params,
  searchParams
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ bankAccountId?: string }>;
}) {
  const { tenant: slug } = await params;
  const { bankAccountId } = await searchParams;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const bankAccounts = (await getBankAccounts(slug)) ?? [];
  const selectedBankId = bankAccountId || bankAccounts[0]?.id;

  const bankBookData = selectedBankId
    ? await getBankBook(slug, selectedBankId)
    : null;

  return (
    <>
      <PageHeader
        title="Bank Book"
        description="Bank account transactions and running book balances for reconciliations."
      />

      <div className="space-y-6">
        {/* Bank Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {bankAccounts.map((b) => {
            const isSelected = b.id === selectedBankId;
            return (
              <Button
                key={b.id}
                asChild
                size="sm"
                variant={isSelected ? "secondary" : "outline"}
                className="rounded-xl text-xs gap-1.5"
              >
                <Link href={`/${slug}/accounting/bank-book?bankAccountId=${b.id}`}>
                  <Building2 className="h-3.5 w-3.5" />
                  {b.bankName} - {b.accountName} ({b.accountNumber})
                </Link>
              </Button>
            );
          })}
        </div>

        {bankBookData ? (
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  {bankBookData.bankAccount?.bankName} - {bankBookData.bankAccount?.accountName}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  A/C: {bankBookData.bankAccount?.accountNumber} | IFSC: {bankBookData.bankAccount?.ifsc || "—"}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Closing Bank Balance</span>
                <span className="text-base font-bold font-mono text-blue-700 dark:text-blue-400">
                  ₹{parseFloat(bankBookData.closingBalance || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Entry / Cheque #</TableHead>
                      <TableHead>Particulars</TableHead>
                      <TableHead className="text-right">Deposits (Dr)</TableHead>
                      <TableHead className="text-right">Withdrawals (Cr)</TableHead>
                      <TableHead className="text-right">Running Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/20 font-medium">
                      <TableCell colSpan={3} className="text-xs">Opening Balance</TableCell>
                      <TableCell className="text-right text-xs">—</TableCell>
                      <TableCell className="text-right text-xs">—</TableCell>
                      <TableCell className="text-right text-xs font-mono">
                        ₹{parseFloat(bankBookData.openingBalance || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                    {bankBookData.entries?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-xs text-muted-foreground">
                          No transactions recorded for this bank account.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bankBookData.entries?.map((entry: any) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(entry.date).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell className="text-xs font-mono font-medium">
                            {entry.reference || entry.entryNumber || "—"}
                          </TableCell>
                          <TableCell className="text-xs">{entry.description}</TableCell>
                          <TableCell className="text-right text-xs font-mono text-emerald-600">
                            {parseFloat(entry.debit) > 0 ? `+₹${parseFloat(entry.debit).toLocaleString("en-IN")}` : "—"}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono text-rose-600">
                            {parseFloat(entry.credit) > 0 ? `-₹${parseFloat(entry.credit).toLocaleString("en-IN")}` : "—"}
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
          <p className="text-sm text-muted-foreground">No bank accounts configured. Set up bank accounts in Settings &gt; Finance.</p>
        )}
      </div>
    </>
  );
}
