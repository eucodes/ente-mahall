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
import { getBalanceSheet } from "@/lib/finance";

export default async function BalanceSheetPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const data = await getBalanceSheet(slug);

  return (
    <>
      <PageHeader
        title="Balance Sheet"
        description="Statement of financial position detailing Assets, Liabilities, and Reserves & Surplus."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Assets */}
        <Card className="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-blue-500/5">
            <CardTitle className="text-base font-semibold text-blue-800 dark:text-blue-300">
              Assets
            </CardTitle>
            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
              ₹{parseFloat(data?.totalAssets || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Head</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.assets?.map((asset: any) => (
                  <TableRow key={asset.accountId}>
                    <TableCell className="text-xs font-medium">{asset.accountName}</TableCell>
                    <TableCell className="text-right text-xs font-mono">
                      ₹{parseFloat(asset.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/10 font-bold border-t">
                  <TableCell className="text-xs">Total Assets</TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    ₹{parseFloat(data?.totalAssets || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Liabilities & Equity */}
        <Card className="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-violet-500/5">
            <CardTitle className="text-base font-semibold text-violet-800 dark:text-violet-300">
              Liabilities & Reserves / Equity
            </CardTitle>
            <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-400">
              ₹{parseFloat(data?.totalLiabilitiesAndEquity || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Head</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/10 font-semibold">
                  <TableCell colSpan={2} className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Liabilities
                  </TableCell>
                </TableRow>
                {data?.liabilities?.map((l: any) => (
                  <TableRow key={l.accountId}>
                    <TableCell className="text-xs font-medium pl-4">{l.accountName}</TableCell>
                    <TableCell className="text-right text-xs font-mono">
                      ₹{parseFloat(l.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="bg-muted/10 font-semibold">
                  <TableCell colSpan={2} className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Equity & Accumulated Surplus
                  </TableCell>
                </TableRow>
                {data?.equity?.map((eq: any) => (
                  <TableRow key={eq.accountId}>
                    <TableCell className="text-xs font-medium pl-4">{eq.accountName}</TableCell>
                    <TableCell className="text-right text-xs font-mono">
                      ₹{parseFloat(eq.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="text-xs font-medium pl-4">Net Surplus (Current Period)</TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    ₹{parseFloat(data?.netSurplus || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>

                <TableRow className="bg-muted/10 font-bold border-t">
                  <TableCell className="text-xs">Total Liabilities & Equity</TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    ₹{parseFloat(data?.totalLiabilitiesAndEquity || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
