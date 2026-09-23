"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Select,
  SearchableSelect,
  Textarea,
  FormField,
  RefreshCw,
  Plus,
  Settings,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account, CollectionCategory, FinancePaymentMethod } from "@/lib/finance";
import { QuickAddAccountModal } from "./quick-add-account-modal";
import { QuickAddCategoryModal } from "./quick-add-category-modal";
import { UniversalReceiptModal, type UniversalReceiptData } from "./universal-receipt-modal";

interface FamilyItem {
  id: string;
  name: string;
  familyNumber?: string | null;
}

interface MemberItem {
  id: string;
  fullName: string;
  phone?: string | null;
  familyId?: string | null;
}

interface Props {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CollectionCategory[];
  accounts?: Account[];
  paymentMethods: (FinancePaymentMethod | { id: string; name: string })[];
  families: FamilyItem[];
  members: MemberItem[];
  mahalleName: string;
}

export function RecordCollectionModal({
  slug,
  open,
  onOpenChange,
  categories: initialCategories,
  accounts: initialAccounts = [],
  paymentMethods,
  families: initialFamilies,
  members: initialMembers,
  mahalleName
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState<UniversalReceiptData | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Dynamic Lists
  const [accountList, setAccountList] = useState<Account[]>(initialAccounts);
  const [categoryList, setCategoryList] = useState<CollectionCategory[]>(initialCategories);
  const [familyList, setFamilyList] = useState<FamilyItem[]>(initialFamilies || []);
  const [memberList, setMemberList] = useState<MemberItem[]>(initialMembers || []);

  // Quick Add Sub-modals
  const [quickAccountOpen, setQuickAccountOpen] = useState(false);
  const [quickCategoryOpen, setQuickCategoryOpen] = useState(false);

  // Form State
  const [accountId, setAccountId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [familyId, setFamilyId] = useState<string>("");
  const [memberId, setMemberId] = useState<string>("");
  const [payerName, setPayerName] = useState<string>("");
  const [payerPhone, setPayerPhone] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [period, setPeriod] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");

  // Sync props to state
  useEffect(() => {
    if (initialAccounts.length > 0) setAccountList(initialAccounts);
  }, [initialAccounts]);

  useEffect(() => {
    if (initialCategories.length > 0) setCategoryList(initialCategories);
  }, [initialCategories]);

  // Filter income accounts
  const incomeAccounts = useMemo(() => {
    return accountList.filter((a) => a.type === "INCOME" || !a.type);
  }, [accountList]);

  // Filter categories by selected account (if account is selected)
  const filteredCategories = useMemo(() => {
    if (!accountId) return categoryList;
    return categoryList.filter(
      (c) => !c.incomeAccountId || c.incomeAccountId === accountId
    );
  }, [categoryList, accountId]);

  // Selected category object
  const selectedCategory = useMemo(() => {
    return categoryList.find((c) => c.id === categoryId) || null;
  }, [categoryList, categoryId]);

  const isGeneral = selectedCategory?.targetType === "GENERAL";
  const formConfig = selectedCategory?.formConfig;

  // Options for searchable selects
  const accountOptions = useMemo(() => {
    return incomeAccounts.map((a) => ({
      value: a.id,
      label: a.name,
      subLabel: a.code ? a.code : undefined,
      group: a.parentAccount?.name || (a.type === "INCOME" ? "Income / Fund Accounts" : "Accounts")
    }));
  }, [incomeAccounts]);

  const categoryOptions = useMemo(() => {
    return filteredCategories.map((c) => ({
      value: c.id,
      label: c.name,
      subLabel: c.defaultAmount
        ? `₹${Number(c.defaultAmount).toLocaleString("en-IN")}`
        : undefined,
      group: c.incomeAccount?.name || "General Collection Categories"
    }));
  }, [filteredCategories]);

  const familyOptions = useMemo(() => {
    return familyList.map((f) => ({
      value: f.id,
      label: f.name,
      subLabel: f.familyNumber ? `#${f.familyNumber}` : undefined
    }));
  }, [familyList]);

  const filteredMembers = useMemo(() => {
    if (familyId) {
      return memberList.filter((m) => String(m.familyId) === String(familyId));
    }
    return memberList;
  }, [memberList, familyId]);

  const memberOptions = useMemo(() => {
    return filteredMembers.map((m) => ({
      value: m.id,
      label: m.fullName,
      subLabel: m.phone ? m.phone : undefined
    }));
  }, [filteredMembers]);

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

  // Handlers
  function handleAccountChange(accId: string) {
    setAccountId(accId);
    // If selected category does not belong to new account, clear category
    if (categoryId) {
      const cat = categoryList.find((c) => c.id === categoryId);
      if (cat?.incomeAccountId && accId && cat.incomeAccountId !== accId) {
        setCategoryId("");
      }
    }
  }

  function handleCategoryChange(selectedId: string) {
    setCategoryId(selectedId);
    const cat = categoryList.find((c) => c.id === selectedId);
    if (cat) {
      // Auto-set parent account if not already selected
      if (cat.incomeAccountId && !accountId) {
        setAccountId(cat.incomeAccountId);
      }
      if (cat.defaultAmount != null && Number(cat.defaultAmount) > 0) {
        setAmount(String(cat.defaultAmount));
      }
      if (cat.isRecurring && !period) {
        const now = new Date();
        const monthYear = now.toLocaleString("default", { month: "long", year: "numeric" });
        setPeriod(monthYear);
      }
      if (cat.targetType === "GENERAL" && !payerName) {
        setPayerName(cat.name);
      }
    }
  }

  function handleMemberChange(selectedId: string) {
    setMemberId(selectedId);
    const m = memberList.find((x) => x.id === selectedId);
    if (m) {
      setPayerName(m.fullName);
      if (m.phone) setPayerPhone(m.phone);
      if (m.familyId && !familyId) {
        setFamilyId(m.familyId);
      }
    }
  }

  function handleFamilyChange(selectedId: string) {
    setFamilyId(selectedId);
    if (memberId) {
      const currentMember = memberList.find((x) => x.id === memberId);
      if (currentMember && String(currentMember.familyId) !== String(selectedId)) {
        setMemberId("");
      }
    }

    const f = familyList.find((x) => x.id === selectedId);
    if (f) {
      setPayerName(f.name);
    }

    if (selectedId) {
      apiClient
        .get<{ members: MemberItem[] }>(`/tenants/${slug}/members?familyId=${selectedId}&pageSize=100`)
        .then((res) => {
          if (res?.members && res.members.length > 0) {
            setMemberList((prev) => {
              const map = new Map<string, MemberItem>();
              prev.forEach((m) => map.set(m.id, m));
              res.members.forEach((m) => map.set(m.id, m));
              return Array.from(map.values());
            });
          }
        })
        .catch(() => { });
    }
  }

  // Handle Quick Add callbacks
  function handleAccountCreated(newAcc: Account) {
    setAccountList((prev) => [newAcc, ...prev]);
    setAccountId(newAcc.id);
  }

  function handleCategoryCreated(newCat: CollectionCategory) {
    setCategoryList((prev) => [newCat, ...prev]);
    handleCategoryChange(newCat.id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      toast({ title: "Please select a collection head / category", variant: "destructive" });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    const isFamilyRequired = formConfig?.requireFamily ?? (!isGeneral && (formConfig?.enableFamily !== false));
    if (isFamilyRequired && !familyId) {
      toast({ title: "Please select a family", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      let derivedType = "FAMILY";
      if (selectedCategory?.targetType === "GENERAL") {
        derivedType = "DONATION";
      } else if (selectedCategory?.code) {
        derivedType = selectedCategory.code;
      }

      const payload = {
        type: derivedType,
        categoryId: categoryId || undefined,
        familyId: familyId || undefined,
        memberId: memberId || undefined,
        donorName: payerName || (isGeneral ? "General Contributor" : undefined),
        donorPhone: payerPhone || undefined,
        amount: String(amount).trim(),
        paymentMethod,
        date: new Date(date).toISOString(),
        description: description || (period ? `${selectedCategory?.name || ""} (${period})` : undefined),
        notes: description || undefined,
        attachmentUrl: attachmentUrl || undefined
      };

      const res = await apiClient.post<any>(`/tenants/${slug}/finance/collections`, payload);
      const data = res?.data || res;
      toast({ title: "Collection recorded successfully", variant: "success" });

      const categoryName = selectedCategory?.name || "Collection";
      const familyObj = familyList.find((f) => f.id === familyId);

      if (data?.receipt) {
        setCreatedReceipt({
          receiptNumber: data.receipt.receiptNumber,
          date: new Date(data.receipt.date).toLocaleDateString("en-IN"),
          payerName: payerName || familyObj?.name || "Anonymous Donor",
          payerPhone: payerPhone || undefined,
          familyDetails: familyObj?.name,
          category: categoryName,
          title: period ? `${categoryName} (${period})` : categoryName,
          amount: String(amount),
          paymentMethod,
          mahalleName,
          notes: description
        });
        setShowReceiptModal(true);
      }

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to record collection";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl rounded-2xl p-6">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
            <div>
              <DialogTitle className="text-base font-bold">Record Collection / Inflow</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Record receipts for subscriptions, donations, and funds for {mahalleName}.
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

          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
            {/* Account (Fund) & Category Linked Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-3.5 rounded-2xl border border-border/60">
              {/* Fund Category */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Fund / Income Account
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
                  placeholder={incomeAccounts.length === 0 ? "No accounts found" : "Select an account"}
                  searchPlaceholder="Search"
                  emptyMessage="No matching accounts"
                  onAddNew={() => setQuickAccountOpen(true)}
                  addNewLabel="New Account"
                />
              </div>

              {/* Collection Category / Head */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Collection Head / Category <span className="text-destructive">*</span>
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
                  options={categoryOptions}
                  value={categoryId}
                  onChange={handleCategoryChange}
                  placeholder={
                    filteredCategories.length === 0
                      ? "No categories in this fund"
                      : "Select a category"
                  }
                  searchPlaceholder="Search"
                  emptyMessage="No categories found. Click + New Category to create one."
                  onAddNew={() => setQuickCategoryOpen(true)}
                  addNewLabel="New Category"
                />
              </div>
            </div>

            {/* Scope / Category Info Banner */}
            {selectedCategory && (
              <div className="text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground">
                  Target:{" "}
                  <strong className="text-foreground">
                    {selectedCategory.targetType === "GENERAL"
                      ? "General / Public (Donations, Hundi, Juma)"
                      : selectedCategory.targetType === "SPECIFIC_DIVISIONS"
                        ? "Specific Divisions / Wards"
                        : selectedCategory.targetType === "CATEGORY_BASED"
                          ? `Economic Category: ${selectedCategory.targetEconomicCategory || "All"}`
                          : "All Mahallu Families"}
                  </strong>
                </span>
                {selectedCategory.isRecurring && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <RefreshCw className="h-3 w-3" />
                    Recurring ({selectedCategory.recurrenceFrequency || "MONTHLY"})
                  </span>
                )}
              </div>
            )}

            {/* Family selection */}
            {formConfig?.enableFamily !== false && (
              <>
                {!isGeneral && (
                  <FormField label="Family" required={formConfig?.requireFamily ?? true}>
                    <SearchableSelect
                      options={familyOptions}
                      value={familyId}
                      onChange={handleFamilyChange}
                      placeholder={familyList.length === 0 ? "No families registered yet" : "Search & select family..."}
                      searchPlaceholder="Search family by name or #number..."
                      emptyMessage="No matching families found"
                    />
                  </FormField>
                )}

                {isGeneral && familyList.length > 0 && (
                  <FormField label="Associated Family (Optional)">
                    <SearchableSelect
                      options={familyOptions}
                      value={familyId}
                      onChange={handleFamilyChange}
                      placeholder="Select family if applicable (optional)..."
                      searchPlaceholder="Search family by name or #number..."
                      emptyMessage="No matching families found"
                    />
                  </FormField>
                )}
              </>
            )}

            {/* Member and Payer */}
            {formConfig?.enableMember !== false ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Family Member (Optional)" required={formConfig?.requireMember ?? false}>
                  <SearchableSelect
                    options={memberOptions}
                    value={memberId}
                    onChange={handleMemberChange}
                    placeholder={
                      familyId
                        ? filteredMembers.length === 0
                          ? "No members in this family"
                          : "Select family member..."
                        : "Search & select member..."
                    }
                    searchPlaceholder="Search member by name or phone..."
                    emptyMessage={
                      familyId
                        ? "No members found under this family"
                        : "No matching members found"
                    }
                    disabled={Boolean(familyId && filteredMembers.length === 0)}
                  />
                </FormField>

                <FormField label={isGeneral ? "Payer / Donor Name" : "Payer Name"} required={isGeneral}>
                  <Input
                    placeholder={isGeneral ? "e.g. Anonymous / Contributor Name" : "Full Name"}
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    required={isGeneral}
                    className="h-9 text-xs"
                  />
                </FormField>
              </div>
            ) : (
              <FormField label={isGeneral ? "Payer / Donor Name" : "Payer Name"} required={isGeneral}>
                <Input
                  placeholder={isGeneral ? "e.g. Anonymous / Contributor Name" : "Full Name"}
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  required={isGeneral}
                  className="h-9 text-xs"
                />
              </FormField>
            )}

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
                  onChange={(val) => setPaymentMethod(val || "Cash")}
                  placeholder="Select payment method..."
                  searchPlaceholder="Search payment method..."
                  clearable={false}
                />
              </FormField>
            </div>

            {/* Date & Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Receipt Date" required>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </FormField>

              {selectedCategory?.isRecurring && (
                <FormField label="Billing Month / Period">
                  <Input
                    placeholder="e.g. September 2026"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="h-9 text-xs"
                  />
                </FormField>
              )}
            </div>

            <FormField label="Description / Remarks (Optional)">
              <Textarea
                placeholder="Optional notes or references for this collection..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs resize-none"
                rows={2}
              />
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="rounded-xl text-xs h-9 bg-primary text-primary-foreground font-semibold"
              >
                {isSubmitting ? "Recording..." : "Record Collection & Issue Receipt"}
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
        defaultType="INCOME"
        onAccountCreated={handleAccountCreated}
      />

      {/* Inline Quick Add Category Modal */}
      <QuickAddCategoryModal
        slug={slug}
        open={quickCategoryOpen}
        onOpenChange={setQuickCategoryOpen}
        type="COLLECTION"
        accounts={accountList}
        defaultAccountId={accountId}
        onCollectionCategoryCreated={handleCategoryCreated}
      />

      {/* Instant Receipt Popup */}
      <UniversalReceiptModal
        open={showReceiptModal}
        onOpenChange={setShowReceiptModal}
        receipt={createdReceipt}
      />
    </>
  );
}
