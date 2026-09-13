"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Trash,
  DollarSign,
  Check,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account, SalaryRecord } from "@/lib/finance";
import { FinanceMarkPaidDialog } from "./finance-mark-paid-dialog";

export function FinanceSalaryTable({
  slug,
  records,
  accounts
}: {
  slug: string;
  records: SalaryRecord[];
  accounts: Account[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [payId, setPayId] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<SalaryRecord | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/finance/salary/${removeTarget.id}`);
      toast({ title: "Removed", variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that salary record.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      await apiClient.post(`/tenants/${slug}/finance/salary/${id}/approve`, {});
      toast({ title: "Salary record approved", variant: "success" });
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to approve salary";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  }

  if (records.length === 0) {
    return <EmptyState title="No salary records yet" description="Add the first one above." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Name</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Basic / Allowances</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((rec) => (
            <TableRow key={rec.id}>
              <TableCell className="font-medium text-xs">{rec.staffName}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{rec.month}</TableCell>
              <TableCell className="text-xs">
                <div>₹{parseFloat(rec.basicSalary || rec.amount).toLocaleString("en-IN")}</div>
                {rec.allowances && parseFloat(rec.allowances) > 0 && (
                  <span className="text-[10px] text-emerald-600 font-medium">
                    +₹{parseFloat(rec.allowances).toLocaleString("en-IN")} alw
                  </span>
                )}
              </TableCell>
              <TableCell className="text-xs">
                {rec.deductions && parseFloat(rec.deductions) > 0 ? (
                  <span className="text-rose-600 font-medium">
                    -₹{parseFloat(rec.deductions).toLocaleString("en-IN")}
                  </span>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="text-xs font-mono font-bold text-foreground">
                ₹{parseFloat(rec.netSalary || rec.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-xs">
                <Badge
                  variant={rec.status === "PAID" ? "secondary" : "outline"}
                  className="text-[10px]"
                >
                  {rec.status === "PAID" ? "PAID" : rec.approvalStatus || rec.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {rec.approvalStatus === "PENDING" && rec.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleApprove(rec.id)}
                      className="h-7 px-2 text-xs gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <Check className="h-3 w-3" />
                      Approve
                    </Button>
                  )}
                  {rec.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPayId(rec.id)}
                      className="h-7 px-2 text-xs gap-1 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                    >
                      <DollarSign className="h-3 w-3" />
                      Pay
                    </Button>
                  )}
                  {rec.status !== "PAID" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRemoveTarget(rec)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FinanceMarkPaidDialog
        slug={slug}
        resource="salary"
        id={payId}
        accounts={accounts}
        onClose={() => setPayId(null)}
      />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remove this salary record?"
        description={`This will delete the obligation of ₹${removeTarget?.netSalary || removeTarget?.amount} for ${removeTarget?.staffName}.`}
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
