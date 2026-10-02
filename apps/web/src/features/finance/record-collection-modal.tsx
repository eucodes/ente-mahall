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
  Badge,
  Input,
  Select,
  SearchableSelect,
  Textarea,
  FormField,
  RefreshCw,
  Plus,
  Settings,
  AlertCircle,
  CheckCircle2,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account, CollectionCategory, FinancePaymentMethod, FinanceFund, DynamicFormFieldConfig } from "@/lib/finance";
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
  funds?: FinanceFund[];
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
  funds = [],
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
  const [fundId, setFundId] = useState<string>("");
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
  const [customFields, setCustomFields] = useState<Record<string, any>>({});

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

  // Filter categories by selected account or fund
  const filteredCategories = useMemo(() => {
    let list = categoryList;
    if (fundId) {
      list = list.filter((c) => !c.fundId || c.fundId === fundId);
    }
    if (accountId) {
      list = list.filter((c) => !c.incomeAccountId || c.incomeAccountId === accountId);
    }
    return list;
  }, [categoryList, accountId, fundId]);

  // Selected category object
  const selectedCategory = useMemo(() => {
    return categoryList.find((c) => c.id === categoryId) || null;
  }, [categoryList, categoryId]);

  const isGeneral = selectedCategory?.targetType === "GENERAL";
  const formConfig = selectedCategory?.formConfig;

  // Options for searchable selects
  const categoryOptions = useMemo(() => {
    return categoryList.map((c) => ({
      value: c.id,
      label: c.name,
      subLabel: c.defaultAmount
        ? `₹${Number(c.defaultAmount).toLocaleString("en-IN")}`
        : undefined,
      group: c.fund?.name || c.incomeAccount?.name || "General Collection Categories"
    }));
  }, [categoryList]);

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
  function handleFundChange(fId: string) {
    setFundId(fId);
    if (categoryId) {
      const cat = categoryList.find((c) => c.id === categoryId);
      if (cat?.fundId && fId && cat.fundId !== fId) {
        setCategoryId("");
      }
    }
  }

  function handleAccountChange(accId: string) {
    setAccountId(accId);
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
      // Auto-set fund if category has one
      if (cat.fundId) {
        setFundId(cat.fundId);
      }
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
      // Initialize default values for dynamic fields if any
      const initialFields: Record<string, any> = {};
      if (cat.formConfig?.fields) {
        for (const f of cat.formConfig.fields) {
          if (f.defaultValue !== undefined && f.defaultValue !== null) {
            initialFields[f.id] = f.defaultValue;
          }
        }
      }
      setCustomFields(initialFields);
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
        fundId: fundId || selectedCategory?.fundId || undefined,
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
        attachmentUrl: attachmentUrl || undefined,
        customFields: Object.keys(customFields).length > 0 ? customFields : undefined
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
            {/* Collection Category / Head Section */}
            <div className="bg-muted/20 p-3.5 rounded-2xl border border-border/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Collection Head / Category <span className="text-destructive">*</span>
                </label>
              </div>
              <SearchableSelect
                options={categoryOptions}
                value={categoryId}
                onChange={handleCategoryChange}
                placeholder={
                  categoryList.length === 0
                    ? "No categories found"
                    : "Select a collection category..."
                }
                searchPlaceholder="Search category..."
                emptyMessage="No categories found. Click + Quick Add to create one."
                onAddNew={() => setQuickCategoryOpen(true)}
                addNewLabel="New Category"
              />
            </div>

            {/* Scope / Category & Posting Status Preview Banner */}
            {selectedCategory && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-muted-foreground">
                    Target:{" "}
                    <strong className="text-foreground">
                      {selectedCategory.targetType === "GENERAL" || selectedCategory.targetType === "NO_TARGET"
                        ? "General Public / Open"
                        : selectedCategory.targetType === "SPECIFIC_DIVISIONS" || selectedCategory.targetType === "DIVISION_BASED"
                          ? "Specific Divisions / Wards"
                          : selectedCategory.targetType === "CATEGORY_BASED" || selectedCategory.targetType === "MEMBER_BASED"
                            ? `Member / Category: ${selectedCategory.targetEconomicCategory || "All"}`
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

                {/* Posting Status Preview */}
                <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-muted-foreground text-[11px]">Ledger Posting:</span>
                  <div>
                    {selectedCategory.incomeAccount ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        COA: {selectedCategory.incomeAccount.name} (Auto-posted)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full" title="No Chart of Accounts mapping. Transaction will remain UNPOSTED.">
                        <AlertCircle className="h-3 w-3" />
                        COA: Unmapped (Recorded as UNPOSTED)
                      </span>
                    )}
                  </div>
                </div>
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

            {/* Dynamic Form Custom Fields (Requirement 3: 12 field types) */}
            {formConfig?.fields && formConfig.fields.filter((f) => f.enabled !== false).length > 0 && (
              <div className="space-y-3 pt-3 pb-2 border-t border-dashed border-border/80">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <span>Category Custom Fields</span>
                  <span className="text-[10px] lowercase font-normal">({formConfig.fields.filter((f) => f.enabled !== false).length} fields configured)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {formConfig.fields
                    .filter((f) => f.enabled !== false)
                    .map((field) => {
                      const fVal = customFields[field.id] ?? field.defaultValue ?? "";

                      if (field.type === "checkbox") {
                        return (
                          <div key={field.id} className="flex items-center gap-2 pt-2 sm:col-span-2">
                            <input
                              type="checkbox"
                              id={`dyn_${field.id}`}
                              checked={Boolean(fVal)}
                              onChange={(e) =>
                                setCustomFields((prev) => ({ ...prev, [field.id]: e.target.checked }))
                              }
                              className="h-4 w-4 rounded border-border text-primary cursor-pointer"
                            />
                            <label htmlFor={`dyn_${field.id}`} className="text-xs font-medium cursor-pointer">
                              {field.label} {field.required && <span className="text-destructive">*</span>}
                            </label>
                          </div>
                        );
                      }

                      if (field.type === "radio") {
                        return (
                          <div key={field.id} className="sm:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-foreground block">
                              {field.label} {field.required && <span className="text-destructive">*</span>}
                            </label>
                            <div className="flex flex-wrap gap-4 pt-0.5">
                              {(field.options || []).map((opt) => (
                                <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`dyn_${field.id}`}
                                    value={opt}
                                    checked={fVal === opt}
                                    onChange={() => setCustomFields((prev) => ({ ...prev, [field.id]: opt }))}
                                    className="cursor-pointer text-primary"
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      if (field.type === "multiselect") {
                        const currentArr = Array.isArray(fVal) ? fVal : [];
                        return (
                          <div key={field.id} className="sm:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-foreground block">
                              {field.label} {field.required && <span className="text-destructive">*</span>}
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {(field.options || []).map((opt) => {
                                const isSel = currentArr.includes(opt);
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      const next = isSel
                                        ? currentArr.filter((x: string) => x !== opt)
                                        : [...currentArr, opt];
                                      setCustomFields((prev) => ({ ...prev, [field.id]: next }));
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-xs border font-medium transition-all ${
                                      isSel
                                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                        : "bg-muted/40 text-foreground border-border hover:bg-muted/70"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (field.type === "select") {
                        return (
                          <FormField key={field.id} label={field.label} required={field.required}>
                            <Select
                              value={String(fVal)}
                              onChange={(e) =>
                                setCustomFields((prev) => ({ ...prev, [field.id]: e.target.value }))
                              }
                              className="h-9 text-xs"
                            >
                              <option value="">{field.placeholder || "Select option..."}</option>
                              {(field.options || []).map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Select>
                          </FormField>
                        );
                      }

                      if (field.type === "member") {
                        return (
                          <FormField key={field.id} label={field.label} required={field.required}>
                            <SearchableSelect
                              options={memberOptions}
                              value={String(fVal)}
                              onChange={(val) =>
                                setCustomFields((prev) => ({ ...prev, [field.id]: val }))
                              }
                              placeholder={field.placeholder || "Select member..."}
                              searchPlaceholder="Search member..."
                            />
                          </FormField>
                        );
                      }

                      if (field.type === "family") {
                        return (
                          <FormField key={field.id} label={field.label} required={field.required}>
                            <SearchableSelect
                              options={familyOptions}
                              value={String(fVal)}
                              onChange={(val) =>
                                setCustomFields((prev) => ({ ...prev, [field.id]: val }))
                              }
                              placeholder={field.placeholder || "Select family..."}
                              searchPlaceholder="Search family..."
                            />
                          </FormField>
                        );
                      }

                      if (field.type === "description") {
                        return (
                          <div key={field.id} className="sm:col-span-2">
                            <FormField label={field.label} required={field.required}>
                              <Textarea
                                placeholder={field.placeholder || `Enter ${field.label}...`}
                                value={String(fVal)}
                                onChange={(e) =>
                                  setCustomFields((prev) => ({ ...prev, [field.id]: e.target.value }))
                                }
                                rows={2}
                                className="text-xs resize-none"
                              />
                            </FormField>
                          </div>
                        );
                      }

                      if (field.type === "date") {
                        return (
                          <FormField key={field.id} label={field.label} required={field.required}>
                            <Input
                              type="date"
                              value={String(fVal)}
                              onChange={(e) =>
                                setCustomFields((prev) => ({ ...prev, [field.id]: e.target.value }))
                              }
                              className="h-9 text-xs"
                            />
                          </FormField>
                        );
                      }

                      if (field.type === "number" || field.type === "amount") {
                        return (
                          <FormField key={field.id} label={field.label} required={field.required}>
                            <Input
                              type="number"
                              step={field.type === "amount" ? "any" : "1"}
                              placeholder={field.placeholder || (field.type === "amount" ? "0.00" : "0")}
                              value={String(fVal)}
                              onChange={(e) =>
                                setCustomFields((prev) => ({ ...prev, [field.id]: e.target.value }))
                              }
                              className="h-9 text-xs font-mono"
                            />
                          </FormField>
                        );
                      }

                      // Default to text / file
                      return (
                        <FormField key={field.id} label={field.label} required={field.required}>
                          <Input
                            type="text"
                            placeholder={field.placeholder || `Enter ${field.label}`}
                            value={String(fVal)}
                            onChange={(e) =>
                              setCustomFields((prev) => ({ ...prev, [field.id]: e.target.value }))
                            }
                            className="h-9 text-xs"
                          />
                        </FormField>
                      );
                    })}
                </div>
              </div>
            )}

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
