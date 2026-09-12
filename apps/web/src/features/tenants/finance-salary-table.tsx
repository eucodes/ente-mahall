"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, ConfirmDialog, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Trash, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account, SalaryRecord } from "@/lib/finance";
import { FinanceMarkPaidDialog } from "./finance-mark-paid-dialog";

export function FinanceSalaryTable({ slug, records, accounts }: { slug: string; records: SalaryRecord[]; accounts: Account[] }) {
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
      const message = err instanceof ApiError ? err.message : "Couldn't remove that record.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
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
            <TableHead>Staff</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.staffName}</TableCell>
              <TableCell>{record.month}</TableCell>
              <TableCell className="tabular-nums">₹{record.amount}</TableCell>
              <TableCell>
                <Badge variant={record.status === "PAID" ? "secondary" : "outline"}>{record.status[0] + record.status.slice(1).toLowerCase()}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {record.status === "PENDING" && (
                    <Button variant="outline" size="sm" onClick={() => setPayId(record.id)}>
                      Pay
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(record)}>
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
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
        open={payId !== null}
        onOpenChange={(open) => !open && setPayId(null)}
        accounts={accounts}
        title="Record salary payment"
      />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.staffName ?? "this record"}?`}
        description="This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
