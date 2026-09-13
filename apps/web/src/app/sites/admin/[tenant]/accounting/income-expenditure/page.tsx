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
  TrendingUp,
  TrendingDown
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getIncomeExpenditure } from "@/lib/finance";

export default async function IncomeExpenditurePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const data = await getIncomeExpenditure(slug);
  const netSurplus = parseFloat(data?.netSurplus || "0");
  const isSurplus = netSurplus >= 0;

  return (
    <>
      <PageHeader
        title="Income & Expenditure Account"
        description="Operating revenues versus operational expenses determining net surplus or deficit."
      />

      <div className="space-y-6">
        {/* Banner */}
        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
          isSurplus
            ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800"
            : "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800"
        }`}>
          <div className="flex items-center gap-3">
            {isSurplus ? (
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-rose-600" />
            )}
            <div>
              <h3 className="font-semibold text-sm">
                {isSurplus ? "Net Operating Surplus" : "Net Operating Deficit"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Total Inflows: ₹{parseFloat(data?.totalIncome || "0").toLocaleString("en-IN")} | Total Outflows: ₹{parseFloat(data?.totalExpenditure || "0").toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className={`text-xl font-bold font-mono ${isSurplus ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
            ₹{Math.abs(netSurplus).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Income Column */}
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">Income (Revenues)</CardTitle>
              <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                ₹{parseFloat(data?.totalIncome || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.income?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-6 text-xs text-muted-foreground">
                        No income accounts recorded.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.income?.map((inc: any) => (
                      <TableRow key={inc.accountId}>
                        <TableCell className="text-xs font-medium">{inc.accountName}</TableCell>
                        <TableCell className="text-right text-xs font-mono">
                          ₹{parseFloat(inc.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Expenditure Column */}
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">Expenditure (Expenses)</CardTitle>
              <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-400">
                ₹{parseFloat(data?.totalExpenditure || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.expenditure?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-6 text-xs text-muted-foreground">
                        No expenditure accounts recorded.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.expenditure?.map((exp: any) => (
                      <TableRow key={exp.accountId}>
                        <TableCell className="text-xs font-medium">{exp.accountName}</TableCell>
                        <TableCell className="text-right text-xs font-mono">
                          ₹{parseFloat(exp.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
