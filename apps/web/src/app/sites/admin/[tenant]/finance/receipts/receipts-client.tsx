"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormField,
  Textarea,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Printer,
  XCircle,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { UniversalReceiptModal, type UniversalReceiptData } from "@/features/finance/universal-receipt-modal";
import type { FinanceReceipt } from "@/lib/finance";

interface Props {
  slug: string;
  mahalleName: string;
  initialReceipts: FinanceReceipt[];
}

export function ReceiptsClient({ slug, mahalleName, initialReceipts }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeReceipt, setActiveReceipt] = useState<UniversalReceiptData | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Cancel dialog
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<FinanceReceipt | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const filteredReceipts = initialReceipts.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.receiptNumber.toLowerCase().includes(term) ||
      (r.receivedFrom || "").toLowerCase().includes(term) ||
      (r.categoryName || "").toLowerCase().includes(term)
    );
  });

  function handleViewReceipt(r: FinanceReceipt) {
    const catName = r.categoryName || r.collection?.type || "Official Receipt";
    setActiveReceipt({
      receiptNumber: r.receiptNumber,
      date: new Date(r.date).toLocaleDateString("en-IN"),
      payerName: r.receivedFrom || "Anonymous Donor",
      payerPhone: undefined,
      familyDetails: undefined,
      category: catName,
      title: catName,
      amount: String(r.amount),
      paymentMethod: r.paymentMethod,
      mahalleName,
      notes: r.status === "CANCELLED" ? `CANCELLED: ${r.cancelledReason || "Void"}` : undefined
    });
    setReceiptModalOpen(true);
  }

  function openCancelDialog(r: FinanceReceipt) {
    setCancelTarget(r);
    setCancelReason("");
    setCancelModalOpen(true);
  }

  async function handleConfirmCancel(e: React.FormEvent) {
    e.preventDefault();
    if (!cancelTarget) return;
    if (!cancelReason.trim()) {
      toast({ title: "Please state a cancellation reason", variant: "destructive" });
      return;
    }

    setIsCancelling(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/receipts/${cancelTarget.id}/cancel`, {
        reason: cancelReason
      });
      toast({ title: "Receipt cancelled successfully", variant: "success" });
      setCancelModalOpen(false);
      setCancelTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to cancel receipt";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search receipt #, payer name, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80"
        />
      </div>

      <Card className="rounded-2xl border border-border/80 shadow-sm">
        <CardContent className="p-0">
          {filteredReceipts.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No receipts found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payer / Member</TableHead>
                    <TableHead>Category / Purpose</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {r.receiptNumber}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {r.receivedFrom}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px]">
                          {r.categoryName || r.collection?.type || "Direct"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.paymentMethod || "Cash"}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          variant={r.status === "ACTIVE" ? "secondary" : "destructive"}
                          className="text-[10px]"
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        ₹{parseFloat(r.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewReceipt(r)}
                            className="h-7 px-2 text-xs gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Printer className="h-3 w-3" />
                            Print
                          </Button>
                          {r.status === "ACTIVE" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openCancelDialog(r)}
                              className="h-7 px-2 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <XCircle className="h-3 w-3" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Receipt Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Cancel Receipt {cancelTarget?.receiptNumber}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConfirmCancel} className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Cancelling a receipt marks it as void and leaves a traceable audit log. State the clear reason below:
            </p>
            <FormField label="Reason for Cancellation" required>
              <Textarea
                placeholder="e.g. Duplicate entry, Wrong amount entered"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                required
                rows={3}
              />
            </FormField>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCancelModalOpen(false)}>
                Go Back
              </Button>
              <Button type="submit" disabled={isCancelling} variant="destructive">
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <UniversalReceiptModal
        open={receiptModalOpen}
        onOpenChange={setReceiptModalOpen}
        receipt={activeReceipt}
      />
    </div>
  );
}
