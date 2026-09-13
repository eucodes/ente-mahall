"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Select,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account } from "@/lib/finance";

interface FinanceMarkPaidDialogProps {
  slug: string;
  resource: "dues" | "salary";
  id: string | null;
  accounts: Account[];
  onClose: () => void;
  onSuccess?: (createdVoucher: any) => void;
}

export function FinanceMarkPaidDialog({
  slug,
  resource,
  id,
  accounts,
  onClose,
  onSuccess
}: FinanceMarkPaidDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [reference, setReference] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<any>(`/tenants/${slug}/finance/${resource}/${id}/mark-paid`, {
        paymentMethod,
        reference: reference || undefined
      });
      toast({ title: "Marked as paid and journal posted", variant: "success" });
      onClose();
      if (onSuccess) {
        onSuccess(res?.data || res);
      }
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't mark that record as paid.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={id !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Settle & Reconcile Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <FormField label="Payment Method" required>
            <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </Select>
          </FormField>

          <FormField label="Reference / Cheque # (Optional)">
            <Input
              placeholder="e.g. UTR / Receipt Ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? "Processing..." : "Confirm Settlement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
