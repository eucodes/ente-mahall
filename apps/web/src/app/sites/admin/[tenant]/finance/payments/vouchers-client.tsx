"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  SearchableSelect,
  Checkbox,
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
  Pencil,
  Trash2,
  Settings,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Voucher, Account, ExpenseCategory, FinancePaymentMethod, FinanceBankAccount } from "@/lib/finance";
import { QuickAddAccountModal } from "@/features/finance/quick-add-account-modal";
import { QuickAddCategoryModal } from "@/features/finance/quick-add-category-modal";

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
  accounts: initialAccounts,
  expenseCategories: initialExpenseCategories,
  paymentMethods,
  bankAccounts
}: Props) {
  const router = useRouter();
  const { toast } = useToast();

  // Dynamic Lists
  const [accountList, setAccountList] = useState<Account[]>(initialAccounts);
  const [categoryList, setCategoryList] = useState<ExpenseCategory[]>(initialExpenseCategories);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Add Sub-modals
  const [quickAccountOpen, setQuickAccountOpen] = useState(false);
  const [quickCategoryOpen, setQuickCategoryOpen] = useState(false);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Single Delete
  const [deleteTarget, setDeleteTarget] = useState<Voucher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Multi-Select & Bulk Delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Filter Expense Accounts
  const expenseAccounts = useMemo(() => {
    return accountList.filter((a) => a.type === "EXPENSE" || !a.type);
  }, [accountList]);

  // Add Form State
  const [accountId, setAccountId] = useState(expenseAccounts[0]?.id || "");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [bankAccountId, setBankAccountId] = useState("");
  const [description, setDescription] = useState("");

  // Edit Form State
  const [editAccountId, setEditAccountId] = useState("");
  const [editExpenseCategoryId, setEditExpenseCategoryId] = useState("");
  const [editPayeeName, setEditPayeeName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("Cash");
  const [editBankAccountId, setEditBankAccountId] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Filtered categories for Add modal
  const filteredAddCategories = useMemo(() => {
    if (!accountId) return categoryList;
    return categoryList.filter(
      (c) => !c.expenseAccountId || c.expenseAccountId === accountId
    );
  }, [categoryList, accountId]);

  // Filtered categories for Edit modal
  const filteredEditCategories = useMemo(() => {
    if (!editAccountId) return categoryList;
    return categoryList.filter(
      (c) => !c.expenseAccountId || c.expenseAccountId === editAccountId
    );
  }, [categoryList, editAccountId]);

  // Searchable select options
  const accountOptions = useMemo(() => {
    return expenseAccounts.map((a) => ({
      value: a.id,
      label: a.name,
      subLabel: a.code || undefined,
      group: a.parentAccount?.name || (a.type === "EXPENSE" ? "Expense Accounts" : "Accounts")
    }));
  }, [expenseAccounts]);

  const addCategoryOptions = useMemo(() => {
    return filteredAddCategories.map((c) => ({
      value: c.id,
      label: c.name,
      subLabel: undefined,
      group: c.expenseAccount?.name || "General Expense Heads"
    }));
  }, [filteredAddCategories]);

  const editCategoryOptions = useMemo(() => {
    return filteredEditCategories.map((c) => ({
      value: c.id,
      label: c.name,
      subLabel: undefined,
      group: c.expenseAccount?.name || "General Expense Heads"
    }));
  }, [filteredEditCategories]);

  const paymentMethodOptions = useMemo(() => {
    if (paymentMethods.length > 0) {
      return paymentMethods.map((pm) => ({
        value: pm.name,
        label: pm.name
      }));
    }
    return [
      { value: "Cash", label: "Cash" },
      { value: "Bank Transfer", label: "Bank Transfer" },
      { value: "UPI", label: "UPI" },
      { value: "Cheque", label: "Cheque" }
    ];
  }, [paymentMethods]);

  const bankAccountOptions = useMemo(() => {
    return bankAccounts.map((b) => ({
      value: b.id,
      label: `${b.bankName} - ${b.accountName}`,
      subLabel: `••••${b.accountNumber.slice(-4)}`
    }));
  }, [bankAccounts]);

  // Main table filtering
  const filteredVouchers = initialVouchers.filter((v) => {
    const vCatId = v.expenseCategoryId || v.expenseCategory?.id;
    if (categoryFilter !== "ALL" && vCatId !== categoryFilter) return false;
    if (accountFilter !== "ALL") {
      const vAccId = v.accountId || (v as any).expenseAccount?.id;
      const cat = categoryList.find((c) => c.id === vCatId);
      if (vAccId !== accountFilter && cat?.expenseAccountId !== accountFilter) {
        return false;
      }
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const payee = (v.payeeName || v.partyName || v.member?.fullName || "").toLowerCase();
      const num = (v.voucherNumber || "").toLowerCase();
      const desc = (v.description || "").toLowerCase();
      if (!payee.includes(term) && !num.includes(term) && !desc.includes(term)) return false;
    }
    return true;
  });

  const totalAmount = filteredVouchers.reduce((acc, v) => acc + parseFloat(v.amount || "0"), 0);

  // Multi-select handlers
  const allSelected = filteredVouchers.length > 0 && selectedIds.length === filteredVouchers.length;

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(filteredVouchers.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  }

  function handleToggleRow(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Account / Category handlers for Add modal
  function handleAccountChange(accId: string) {
    setAccountId(accId);
    if (expenseCategoryId) {
      const cat = categoryList.find((c) => c.id === expenseCategoryId);
      if (cat?.expenseAccountId && accId && cat.expenseAccountId !== accId) {
        setExpenseCategoryId("");
      }
    }
  }

  function handleCategoryChange(catId: string) {
    setExpenseCategoryId(catId);
    const cat = categoryList.find((c) => c.id === catId);
    if (cat?.expenseAccountId && !accountId) {
      setAccountId(cat.expenseAccountId);
    }
  }

  // Account / Category handlers for Edit modal
  function handleEditAccountChange(accId: string) {
    setEditAccountId(accId);
    if (editExpenseCategoryId) {
      const cat = categoryList.find((c) => c.id === editExpenseCategoryId);
      if (cat?.expenseAccountId && accId && cat.expenseAccountId !== accId) {
        setEditExpenseCategoryId("");
      }
    }
  }

  function handleEditCategoryChange(catId: string) {
    setEditExpenseCategoryId(catId);
    const cat = categoryList.find((c) => c.id === catId);
    if (cat?.expenseAccountId && !editAccountId) {
      setEditAccountId(cat.expenseAccountId);
    }
  }

  // Quick Add Callbacks
  function handleAccountCreated(newAcc: Account) {
    setAccountList((prev) => [newAcc, ...prev]);
    setAccountId(newAcc.id);
  }

  function handleCategoryCreated(newCat: ExpenseCategory) {
    setCategoryList((prev) => [newCat, ...prev]);
    handleCategoryChange(newCat.id);
  }

  function openEditModal(v: Voucher) {
    setEditingVoucher(v);
    const vCatId = v.expenseCategoryId || v.expenseCategory?.id || "";
    setEditExpenseCategoryId(vCatId);
    const cat = categoryList.find((c) => c.id === vCatId);
    setEditAccountId(v.accountId || cat?.expenseAccountId || "");
    setEditPayeeName(v.payeeName || v.partyName || "");
    setEditAmount(String(v.amount || ""));
    setEditDate(v.date ? new Date(v.date).toISOString().split("T")[0] : "");
    setEditPaymentMethod(v.paymentMethod || "Cash");
    setEditBankAccountId(v.bankAccountId || "");
    setEditDescription(v.description || "");
    setEditModalOpen(true);
  }

  async function handleRecordExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (!accountId) {
      toast({ title: "Please select an expense account", variant: "destructive" });
      return;
    }

    const needsBank = paymentMethod === "Bank Transfer" || paymentMethod === "UPI" || paymentMethod === "Cheque";
    if (needsBank && !bankAccountId) {
      toast({ title: "Please select a bank account for disbursement", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/vouchers`, {
        type: "PAYMENT",
        voucherSubtype: "EXPENSE",
        status: "PAID",
        accountId,
        expenseCategoryId: expenseCategoryId || undefined,
        payeeName: payeeName.trim() || undefined,
        partyName: payeeName.trim() || undefined,
        amount: String(amount).trim(),
        date: new Date(date).toISOString(),
        paymentMethod,
        bankAccountId: bankAccountId || undefined,
        description: description.trim() || undefined
      });

      toast({ title: "Expense recorded successfully", variant: "success" });
      setModalOpen(false);
      setPayeeName("");
      setAmount("");
      setDescription("");
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to record expense";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateVoucher(e: React.FormEvent) {
    e.preventDefault();
    if (!editingVoucher) return;
    if (!editAmount || parseFloat(editAmount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    try {
      await apiClient.patch(`/tenants/${slug}/finance/vouchers/${editingVoucher.id}`, {
        accountId: editAccountId || undefined,
        expenseCategoryId: editExpenseCategoryId || undefined,
        payeeName: editPayeeName.trim() || undefined,
        amount: String(editAmount).trim(),
        date: editDate ? new Date(editDate).toISOString() : undefined,
        paymentMethod: editPaymentMethod,
        bankAccountId: editBankAccountId || undefined,
        description: editDescription.trim() || undefined
      });
      toast({ title: "Expense updated successfully", variant: "success" });
      setEditModalOpen(false);
      setEditingVoucher(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to update expense";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteSingle() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/tenants/${slug}/finance/vouchers/${deleteTarget.id}`);
      toast({ title: "Expense deleted successfully", variant: "success" });
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete expense";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/vouchers/bulk-delete`, { ids: selectedIds });
      toast({ title: `${selectedIds.length} expenses deleted`, variant: "success" });
      setSelectedIds([]);
      setBulkDeleteOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to bulk delete expenses";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsBulkDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search payee, voucher #, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 h-9 text-xs"
          />

          {/* Account Filter */}
          {expenseAccounts.length > 0 && (
            <Select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-44 h-9 text-xs"
            >
              <option value="ALL">All Expense Accounts</option>
              {expenseAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </Select>
          )}

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-44 h-9 text-xs"
          >
            <option value="ALL">All Categories</option>
            {categoryList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
              className="gap-1.5 rounded-xl text-xs h-9"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}

          {/* Quick Settings Button */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl text-xs h-9"
          >
            <Link href={`/${slug}/settings/finance`}>
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </Button>

          <Button
            onClick={() => setModalOpen(true)}
            className="gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold h-9"
          >
            <Plus className="h-4 w-4" />
            Record Expense
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <Card className="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold">
            Payments Made ({filteredVouchers.length})
          </CardTitle>
          <div className="text-sm font-semibold font-mono text-rose-600 dark:text-rose-400">
            Total Spent: ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredVouchers.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No expense records found matching the selected criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Voucher #</TableHead>
                    <TableHead>Payee / Party</TableHead>
                    <TableHead>Expense Head / Account</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVouchers.map((v) => {
                    const isChecked = selectedIds.includes(v.id);
                    const matchedCat = categoryList.find(
                      (c) => c.id === (v.expenseCategoryId || v.expenseCategory?.id)
                    );
                    const accName = v.account?.name || matchedCat?.expenseAccount?.name;

                    return (
                      <TableRow key={v.id} className={isChecked ? "bg-muted/40" : undefined}>
                        <TableCell className="w-10">
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleToggleRow(v.id)}
                          />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(v.date).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold">
                          {v.voucherNumber || "—"}
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          <div>
                            <span>{v.payeeName || v.partyName || v.member?.fullName || "—"}</span>
                            {v.description && (
                              <span className="text-[10px] text-muted-foreground block truncate max-w-xs">
                                {v.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-col gap-0.5">
                            <Badge variant="outline" className="text-[10px] w-fit">
                              {v.expenseCategory?.name || matchedCat?.name || "General Expense"}
                            </Badge>
                            {accName && (
                              <span className="text-[10px] text-muted-foreground">
                                Account: {accName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {v.paymentMethod || "Cash"}
                          {v.bankAccount && (
                            <span className="text-[10px] block font-mono">
                              {v.bankAccount.bankName}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                          ₹{parseFloat(v.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => openEditModal(v)}
                              title="Edit Expense"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              onClick={() => setDeleteTarget(v)}
                              title="Delete Expense"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
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

      {/* Record Expense Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
            <div>
              <DialogTitle className="text-base font-bold">Record Expense / Payment</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Disburse payment against an expense head and account.
              </p>
            </div>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-lg"
            >
              <Link href={`/${slug}/settings/finance`} target="_blank">
                <Settings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </Link>
            </Button>
          </DialogHeader>

          <form onSubmit={handleRecordExpense} className="space-y-4 pt-3">
            {/* Account & Category Linked Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-3.5 rounded-2xl border border-border/60">
              {/* Expense Account */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Expense Account <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setQuickAccountOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Quick Add
                  </button>
                </div>
                <SearchableSelect
                  options={accountOptions}
                  value={accountId}
                  onChange={handleAccountChange}
                  placeholder="Select an account"
                  searchPlaceholder="Search"
                  emptyMessage="No accounts found"
                  onAddNew={() => setQuickAccountOpen(true)}
                  addNewLabel="New Account"
                />
              </div>

              {/* Expense Category / Head */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Expense Head / Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setQuickCategoryOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Quick Add
                  </button>
                </div>
                <SearchableSelect
                  options={addCategoryOptions}
                  value={expenseCategoryId}
                  onChange={handleCategoryChange}
                  placeholder={
                    filteredAddCategories.length === 0
                      ? "No heads in this account"
                      : "Select an expense category"
                  }
                  searchPlaceholder="Search"
                  emptyMessage="No categories found. Click + New Category to create one."
                  onAddNew={() => setQuickCategoryOpen(true)}
                  addNewLabel="New Category"
                />
              </div>
            </div>

            {/* Payee Name */}
            <FormField label="Payee / Vendor / Recipient Name" required>
              <Input
                placeholder="e.g. KSEB, Hardware Store, Staff Name, Contractor"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </FormField>

            {/* Amount & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Amount (₹)" required>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="h-9 text-xs font-mono font-semibold"
                />
              </FormField>

              <FormField label="Payment Method" required>
                <SearchableSelect
                  options={paymentMethodOptions}
                  value={paymentMethod}
                  onChange={(val) => {
                    const mode = val || "Cash";
                    setPaymentMethod(mode);
                    if (mode !== "Bank Transfer" && mode !== "UPI" && mode !== "Cheque") {
                      setBankAccountId("");
                    }
                  }}
                  placeholder="Select payment method..."
                  searchPlaceholder="Search payment method..."
                  clearable={false}
                />
              </FormField>
            </div>

            {/* Bank Account Selection */}
            {(paymentMethod === "Bank Transfer" || paymentMethod === "UPI" || paymentMethod === "Cheque") && (
              <FormField label="Disbursed From Bank Account" required>
                <SearchableSelect
                  options={bankAccountOptions}
                  value={bankAccountId}
                  onChange={setBankAccountId}
                  placeholder="Select Bank Account..."
                  searchPlaceholder="Search bank account..."
                  emptyMessage="No bank accounts configured in settings"
                />
              </FormField>
            )}

            {/* Date */}
            <FormField label="Payment Date" required>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </FormField>

            {/* Description */}
            <FormField label="Notes / Description (Optional)">
              <Textarea
                placeholder="Details of the bill, invoice or payment remarks..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="text-xs resize-none"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="rounded-xl text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                {isSubmitting ? "Saving..." : "Record & Disburse Expense"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2 border-b border-border/60">
            <DialogTitle className="text-base font-bold">Edit Expense Record</DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Modify account, category, payee, or amount for this voucher.
            </p>
          </DialogHeader>

          <form onSubmit={handleUpdateVoucher} className="space-y-4 pt-3">
            {/* Account & Category Linked Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-3.5 rounded-2xl border border-border/60">
              <FormField label="Expense Account" required>
                <SearchableSelect
                  options={accountOptions}
                  value={editAccountId}
                  onChange={handleEditAccountChange}
                  placeholder="Select an account"
                  searchPlaceholder="Search"
                  emptyMessage="No accounts found"
                />
              </FormField>

              <FormField label="Expense Head / Category">
                <SearchableSelect
                  options={editCategoryOptions}
                  value={editExpenseCategoryId}
                  onChange={handleEditCategoryChange}
                  placeholder="Select expense category..."
                  searchPlaceholder="Search"
                  emptyMessage="No categories found"
                />
              </FormField>
            </div>

            <FormField label="Payee / Vendor / Recipient Name" required>
              <Input
                placeholder="e.g. KSEB, Hardware Store, Staff Name"
                value={editPayeeName}
                onChange={(e) => setEditPayeeName(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Amount (₹)" required>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  required
                  className="h-9 text-xs font-mono font-semibold"
                />
              </FormField>

              <FormField label="Payment Method" required>
                <SearchableSelect
                  options={paymentMethodOptions}
                  value={editPaymentMethod}
                  onChange={(val) => {
                    const mode = val || "Cash";
                    setEditPaymentMethod(mode);
                    if (mode !== "Bank Transfer" && mode !== "UPI" && mode !== "Cheque") {
                      setEditBankAccountId("");
                    }
                  }}
                  placeholder="Select payment method..."
                  searchPlaceholder="Search payment method..."
                  clearable={false}
                />
              </FormField>
            </div>

            {(editPaymentMethod === "Bank Transfer" || editPaymentMethod === "UPI" || editPaymentMethod === "Cheque") && (
              <FormField label="Disbursed From Bank Account" required>
                <SearchableSelect
                  options={bankAccountOptions}
                  value={editBankAccountId}
                  onChange={setEditBankAccountId}
                  placeholder="Select Bank Account..."
                  searchPlaceholder="Search bank account..."
                  emptyMessage="No bank accounts configured"
                />
              </FormField>
            )}

            <FormField label="Date" required>
              <Input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </FormField>

            <FormField label="Notes / Description">
              <Textarea
                placeholder="Details of the bill, invoice or payment remarks..."
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="text-xs resize-none"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditModalOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUpdating}
                className="rounded-xl text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Inline Quick Add Account Modal */}
      <QuickAddAccountModal
        slug={slug}
        open={quickAccountOpen}
        onOpenChange={setQuickAccountOpen}
        defaultType="EXPENSE"
        onAccountCreated={handleAccountCreated}
      />

      {/* Inline Quick Add Expense Category Modal */}
      <QuickAddCategoryModal
        slug={slug}
        open={quickCategoryOpen}
        onOpenChange={setQuickCategoryOpen}
        type="EXPENSE"
        accounts={accountList}
        defaultAccountId={accountId}
        onExpenseCategoryCreated={handleCategoryCreated}
      />

      {/* Single Delete Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Expense Record
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-muted-foreground">
            <p>
              Are you sure you want to delete voucher <strong>{deleteTarget?.voucherNumber}</strong>?
            </p>
            {deleteTarget && (
              <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1">
                <div><strong>Amount:</strong> ₹{parseFloat(deleteTarget.amount).toLocaleString("en-IN")}</div>
                <div><strong>Payee:</strong> {deleteTarget.payeeName || deleteTarget.partyName || "—"}</div>
                <div><strong>Date:</strong> {new Date(deleteTarget.date).toLocaleDateString("en-IN")}</div>
              </div>
            )}
            <p className="text-xs text-rose-600 dark:text-rose-400">
              This will automatically reverse the linked ledger entry and restore account balances.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteSingle}
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Bulk Delete Expenses
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-muted-foreground">
            <p>
              Are you sure you want to permanently delete <strong>{selectedIds.length}</strong> selected expense records?
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              All linked accounting ledger entries for these vouchers will be reversed and account balances restored. This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isBulkDeleting}
              onClick={handleBulkDelete}
            >
              {isBulkDeleting ? "Deleting..." : `Delete ${selectedIds.length} Records`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
