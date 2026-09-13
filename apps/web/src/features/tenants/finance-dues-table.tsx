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
  Printer,
  DollarSign,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account, Due } from "@/lib/finance";
import { FinanceMarkPaidDialog } from "./finance-mark-paid-dialog";
import { DuesReceiptModal } from "../finance/dues-receipt-modal";

const STATUS_TONE: Record<Due["status"], "outline" | "secondary" | "destructive"> = {
  PENDING: "outline",
  PAID: "secondary",
  WAIVED: "destructive"
};

export function FinanceDuesTable({
  slug,
  dues,
  accounts,
  mahalleName = "Mahall"
}: {
  slug: string;
  dues: Due[];
  accounts: Account[];
  mahalleName?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [payId, setPayId] = useState<string | null>(null);
  const [viewReceipt, setViewReceipt] = useState<Due | null>(null);
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
            <TableHead>Member / Family</TableHead>
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
              <TableCell className="font-medium text-xs">
                <div>{due.member?.fullName || "—"}</div>
                {due.family && (
                  <span className="text-[10px] text-muted-foreground block">
                    Family: {due.family.name}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{due.title}</TableCell>
              <TableCell className="text-xs font-mono font-semibold">
                ₹{parseFloat(due.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {new Date(due.dueDate).toLocaleDateString("en-IN")}
              </TableCell>
              <TableCell className="text-xs">
                <Badge variant={STATUS_TONE[due.status]} className="text-[10px] capitalize">
                  {due.status.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {due.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPayId(due.id)}
                      className="h-7 px-2 text-xs gap-1 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                    >
                      <DollarSign className="h-3 w-3" />
                      Settle
                    </Button>
                  )}
                  {due.status === "PAID" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setViewReceipt(due)}
                      className="h-7 px-2 text-xs gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <Printer className="h-3 w-3" />
                      Receipt
                    </Button>
                  )}
                  {due.status !== "PAID" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRemoveTarget(due)}
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
        resource="dues"
        id={payId}
        accounts={accounts}
        onClose={() => setPayId(null)}
      />

      {viewReceipt && (
        <DuesReceiptModal
          open={viewReceipt !== null}
          onOpenChange={(open) => !open && setViewReceipt(null)}
          receipt={{
            receiptNumber: `REC-DUE-${viewReceipt.id.slice(-6).toUpperCase()}`,
            date: new Date().toLocaleDateString("en-IN"),
            memberFullName: viewReceipt.member?.fullName || "Member",
            memberPhone: viewReceipt.member?.phone,
            familyName: viewReceipt.family?.name,
            houseNumber: viewReceipt.family?.house?.displayNumber,
            title: viewReceipt.title,
            amount: viewReceipt.amount,
            mahalleName,
            receivedBy: "Mahall Accounts"
          }}
        />
      )}

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remove this due?"
        description={`This will delete the due of ₹${removeTarget?.amount} for ${removeTarget?.member?.fullName}.`}
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
