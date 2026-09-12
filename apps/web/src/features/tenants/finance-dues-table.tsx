"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, ConfirmDialog, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Trash, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account, Due } from "@/lib/finance";
import { FinanceMarkPaidDialog } from "./finance-mark-paid-dialog";

const STATUS_TONE: Record<Due["status"], "outline" | "secondary" | "destructive"> = {
  PENDING: "outline",
  PAID: "secondary",
  WAIVED: "destructive"
};

export function FinanceDuesTable({ slug, dues, accounts }: { slug: string; dues: Due[]; accounts: Account[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [payId, setPayId] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Due | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/finance/dues/${removeTarget.id}`);
      toast({ title: "Removed", variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that due.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  if (dues.length === 0) {
    return <EmptyState title="No dues recorded yet" description="Add the first one above." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dues.map((due) => (
            <TableRow key={due.id}>
              <TableCell className="font-medium">{due.member.fullName}</TableCell>
              <TableCell>{due.title}</TableCell>
              <TableCell className="tabular-nums">₹{due.amount}</TableCell>
              <TableCell className="text-muted-foreground">{new Date(due.dueDate).toLocaleDateString("en-IN")}</TableCell>
              <TableCell>
                <Badge variant={STATUS_TONE[due.status]}>{due.status[0] + due.status.slice(1).toLowerCase()}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {due.status === "PENDING" && (
                    <Button variant="outline" size="sm" onClick={() => setPayId(due.id)}>
                      Pay
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(due)}>
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
        resource="dues"
        id={payId}
        open={payId !== null}
        onOpenChange={(open) => !open && setPayId(null)}
        accounts={accounts}
        title="Record due payment"
      />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.title ?? "this due"}?`}
        description="This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
