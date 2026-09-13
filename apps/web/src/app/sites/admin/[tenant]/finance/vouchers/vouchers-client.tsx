"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
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
  Plus,
  Check,
  Send,
  Ban,
  DollarSign,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Voucher, Account, ExpenseCategory, FinancePaymentMethod, FinanceBankAccount } from "@/lib/finance";

interface Props {
  slug: string;
  initialVouchers: Voucher[];
  accounts: Account[];
  expenseCategories: ExpenseCategory[];
  paymentMethods: FinancePaymentMethod[];
  bankAccounts: FinanceBankAccount[];
}

export function VouchersClient({
  slug,
  initialVouchers,
  accounts,
  expenseCategories,
  paymentMethods,
  bankAccounts
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pay Dialog
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<Voucher | null>(null);
  const [payMethod, setPayMethod] = useState("Cash");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [payRef, setPayRef] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Cancel Dialog
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Voucher | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Form State
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [bankAccountId, setBankAccountId] = useState("");
  const [description, setDescription] = useState("");
  const [showAdvancedAccount, setShowAdvancedAccount] = useState(false);

  const expenseAccounts = accounts.filter((a) => a.type === "EXPENSE" || a.type === "ASSET" || a.type === "LIABILITY");

  function handleCategoryChange(catId: string) {
    setExpenseCategoryId(catId);
    const cat = expenseCategories.find((c) => c.id === catId);
    if (cat?.expenseAccountId) {
      setAccountId(cat.expenseAccountId);
    }
  }

  async function handleCreateVoucher(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    const resolvedAccountId = accountId || expenseAccounts[0]?.id || accounts[0]?.id;
    if (!resolvedAccountId) {
      toast({ title: "Please select an account", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/vouchers`, {
        type: "PAYMENT",
        accountId: resolvedAccountId,
        expenseCategoryId: expenseCategoryId || undefined,
        payeeName: payeeName || undefined,
        amount: String(amount).trim(),
        date: new Date(date).toISOString(),
        paymentMethod,
        bankAccountId: bankAccountId || undefined,
        description: description || undefined
      });
      toast({ title: "Expense voucher recorded", variant: "success" });
      setModalOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create voucher";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function openCancelDialog(v: Voucher) {
    setCancelTarget(v);
    setCancelReason("");
    setCancelModalOpen(true);
  }

  async function handleConfirmCancel(e: React.FormEvent) {
    e.preventDefault();
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/vouchers/${cancelTarget.id}/cancel`, {
        reason: cancelReason.trim() || "Cancelled by administrator"
      });
      toast({ title: "Voucher cancelled successfully", variant: "success" });
      setCancelModalOpen(false);
      setCancelTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to cancel voucher";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsCancelling(false);
    }
  }

  async function handleAction(voucherId: string, action: "submit" | "approve" | "cancel") {
    if (action === "cancel") {
      const v = initialVouchers.find((item) => item.id === voucherId);
      if (v) {
        openCancelDialog(v);
        return;
      }
    }
    try {
      await apiClient.post(`/tenants/${slug}/finance/vouchers/${voucherId}/${action}`, action === "cancel" ? { reason: "Cancelled by administrator" } : {});
      toast({ title: `Voucher ${action}d successfully`, variant: "success" });
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : `Failed to ${action} voucher`;
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  }

  function openPayDialog(v: Voucher) {
    setPayTarget(v);
    setPayMethod(v.paymentMethod || "Cash");
    setSelectedBankId(v.bankAccount?.id || "");
    setPayRef("");
    setPayModalOpen(true);
  }

  async function handleConfirmPay(e: React.FormEvent) {
    e.preventDefault();
    if (!payTarget) return;

    setIsPaying(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/vouchers/${payTarget.id}/pay`, {
        paymentMethod: payMethod,
        bankAccountId: selectedBankId || undefined,
        reference: payRef || undefined
      });
      toast({ title: "Voucher marked as paid & posted to Journal", variant: "success" });
      setPayModalOpen(false);
      setPayTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to process payment";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Track expenses from requisition, committee review, approval, to cash/bank payment.
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="h-4 w-4" />
          Create Expense Voucher
        </Button>
      </div>

      <Card className="rounded-2xl border border-border/80 shadow-sm">
        <CardContent className="p-0">
          {initialVouchers.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No expense vouchers created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voucher #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payee / Party</TableHead>
                    <TableHead>Account / Category</TableHead>
                    <TableHead>Workflow Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialVouchers.map((v) => {
                    const status = v.status || "DRAFT";
                    return (
                      <TableRow key={v.id}>
                        <TableCell className="font-mono text-xs font-semibold">
                          {v.voucherNumber || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(v.date).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          {v.payeeName || v.partyName || "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="font-medium text-foreground">{v.account?.name}</div>
                          {v.expenseCategory && (
                            <span className="text-[10px] text-muted-foreground block">{v.expenseCategory.name}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge
                            variant={
                              status === "APPROVED" || status === "PAID"
                                ? "secondary"
                                : status === "SUBMITTED"
                                ? "outline"
                                : status === "CANCELLED"
                                ? "destructive"
                                : "outline"
                            }
                            className="text-[10px]"
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono font-semibold text-rose-600 dark:text-rose-400">
                          ₹{parseFloat(v.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {status === "DRAFT" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAction(v.id, "submit")}
                                className="h-7 px-2 text-xs gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Send className="h-3 w-3" />
                                Submit
                              </Button>
                            )}
                            {status === "SUBMITTED" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAction(v.id, "approve")}
                                className="h-7 px-2 text-xs gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              >
                                <Check className="h-3 w-3" />
                                Approve
                              </Button>
                            )}
                            {status === "APPROVED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openPayDialog(v)}
                                className="h-7 px-2 text-xs gap-1 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                              >
                                <DollarSign className="h-3 w-3" />
                                Pay
                              </Button>
                            )}
                            {status !== "PAID" && status !== "CANCELLED" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openCancelDialog(v)}
                                className="h-7 px-2 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              >
                                <Ban className="h-3 w-3" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Voucher Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Record Expense Voucher</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateVoucher} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Expense Category" required>
                <Select
                  value={expenseCategoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                >
                  <option value="">Select Category...</option>
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Payee / Vendor" required>
                <Input
                  placeholder="e.g. Electric Board, Merchant, Staff"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Amount (₹)" required>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Date" required>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Proposed Payment Method">
                <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  {paymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.name}>
                      {pm.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            {paymentMethod.toLowerCase().includes("bank") && bankAccounts.length > 0 && (
              <FormField label="Bank Account">
                <Select value={bankAccountId} onChange={(e) => setBankAccountId(e.target.value)}>
                  <option value="">Select Bank...</option>
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bankName} - {b.accountName} ({b.accountNumber})
                    </option>
                  ))}
                </Select>
              </FormField>
            )}

            <FormField label="Description / Purpose">
              <Textarea
                placeholder="Details of expense..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </FormField>

            {/* Optional Advanced Accounting Override */}
            <div className="pt-1">
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                onClick={() => setShowAdvancedAccount(!showAdvancedAccount)}
              >
                {showAdvancedAccount ? "− Hide accounting ledger head" : "+ Specific ledger account (Advanced)"}
              </button>
              {showAdvancedAccount && (
                <div className="mt-2">
                  <FormField label="Ledger Account">
                    <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                      {expenseAccounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.type})
                        </option>
                      ))}
                    </Select>
                  </FormField>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSubmitting ? "Recording..." : "Record Expense (Draft)"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pay Voucher Dialog */}
      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Disburse Payment - {payTarget?.voucherNumber}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConfirmPay} className="space-y-4 pt-2">
            <div className="p-3 bg-muted/40 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payee:</span>
                <span className="font-semibold">{payTarget?.payeeName || payTarget?.partyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account:</span>
                <span>{payTarget?.account?.name}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-400">
                <span>Amount:</span>
                <span>₹{parseFloat(payTarget?.amount || "0").toLocaleString("en-IN")}</span>
              </div>
            </div>

            <FormField label="Payment Method" required>
              <Select value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                {paymentMethods.map((pm) => (
                  <option key={pm.id} value={pm.name}>
                    {pm.name}
                  </option>
                ))}
              </Select>
            </FormField>

            {payMethod.toLowerCase().includes("bank") && bankAccounts.length > 0 && (
              <FormField label="Bank Account" required>
                <Select value={selectedBankId} onChange={(e) => setSelectedBankId(e.target.value)} required>
                  <option value="">Select Bank...</option>
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bankName} - {b.accountName} ({b.accountNumber})
                    </option>
                  ))}
                </Select>
              </FormField>
            )}

            <FormField label="Reference / Cheque #">
              <Input
                placeholder="UTR / Cheque number / Transaction Ref"
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setPayModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPaying} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isPaying ? "Processing..." : "Confirm & Post Journal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Voucher Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Cancel Voucher {cancelTarget?.voucherNumber}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConfirmCancel} className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Cancelling an expense voucher marks it as void and reverses any balance entries if already processed. State the reason below:
            </p>
            <FormField label="Reason for Cancellation (Optional)">
              <Textarea
                placeholder="e.g. Duplicate voucher, Incorrect amount or payee"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
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
    </div>
  );
}
