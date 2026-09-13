"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { CollectionCategory, FinancePaymentMethod } from "@/lib/finance";
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
  paymentMethods: (FinancePaymentMethod | { id: string; name: string })[];
  families: FamilyItem[];
  members: MemberItem[];
  mahalleName: string;
}

export function RecordCollectionModal({
  slug,
  open,
  onOpenChange,
  categories,
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

  // Dynamic lists with client-side fallback/refresh
  const [familyList, setFamilyList] = useState<FamilyItem[]>(initialFamilies || []);
  const [memberList, setMemberList] = useState<MemberItem[]>(initialMembers || []);

  // Form State
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

  // Selected category object
  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === categoryId) || null;
  }, [categories, categoryId]);

  const isGeneral = selectedCategory?.targetType === "GENERAL";

  // Preselect first category if available
  useEffect(() => {
    if (open && !categoryId && categories.length > 0) {
      handleCategoryChange(categories[0].id);
    }
  }, [open, categoryId, categories]);

  function handleCategoryChange(selectedId: string) {
    setCategoryId(selectedId);
    const cat = categories.find((c) => c.id === selectedId);
    if (cat) {
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

  // Sync props or fetch if empty
  useEffect(() => {
    if (initialFamilies && initialFamilies.length > 0) {
      setFamilyList(initialFamilies);
    } else if (open) {
      // Fetch families on client if not available via SSR
      apiClient
        .get<{ families: FamilyItem[] }>(`/tenants/${slug}/families?page=1&pageSize=100&status=all`)
        .then((res) => {
          if (res?.families) setFamilyList(res.families);
        })
        .catch(() => {});
    }
  }, [initialFamilies, open, slug]);

  useEffect(() => {
    if (initialMembers && initialMembers.length > 0) {
      setMemberList(initialMembers);
    } else if (open) {
      apiClient
        .get<{ members: MemberItem[] }>(`/tenants/${slug}/members?page=1&pageSize=100`)
        .then((res) => {
          if (res?.members) setMemberList(res.members);
        })
        .catch(() => {});
    }
  }, [initialMembers, open, slug]);

  // Filter members when a family is selected
  const filteredMembers = useMemo(() => {
    if (familyId) {
      return memberList.filter((m) => String(m.familyId) === String(familyId));
    }
    return memberList;
  }, [memberList, familyId]);

  const familyOptions = useMemo(() => {
    return familyList.map((f) => ({
      value: f.id,
      label: f.name,
      subLabel: f.familyNumber ? `#${f.familyNumber}` : undefined
    }));
  }, [familyList]);

  const memberOptions = useMemo(() => {
    return filteredMembers.map((m) => ({
      value: m.id,
      label: m.fullName,
      subLabel: m.phone ? m.phone : undefined
    }));
  }, [filteredMembers]);

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

    // If selected member is not in the newly selected family, clear it
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

    // Proactively fetch all members for this specific family from API to ensure complete list
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
        .catch(() => {});
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      toast({ title: "Please select a collection head", variant: "destructive" });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (!isGeneral && !familyId) {
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
        notes: description || undefined
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
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Record Collection / Donation</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Unified Collection Head / Category dropdown */}
            <FormField label="Collection Head / Category" required>
              <Select value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)} required>
                <option value="">Select Collection Head...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.isRecurring ? ` (Recurring · ${c.recurrenceFrequency || "Monthly"})` : ""}
                    {c.defaultAmount ? ` — ₹${Number(c.defaultAmount).toLocaleString("en-IN")}` : ""}
                  </option>
                ))}
              </Select>
            </FormField>

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
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    🔄 Recurring ({selectedCategory.recurrenceFrequency || "MONTHLY"})
                  </span>
                )}
              </div>
            )}

            {/* If NOT General: Family selection is required */}
            {!isGeneral && (
              <FormField label="Family" required>
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

            {/* If General: Family selection is optional */}
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

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Family Member (Optional)">
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

              <FormField label="Payment Method" required>
                <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((pm) => (
                      <option key={pm.id} value={pm.name}>
                        {pm.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Cheque">Cheque</option>
                    </>
                  )}
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date" required>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </FormField>

              <FormField label={selectedCategory?.isRecurring ? "Billing Period / Month" : "Period / Month (Optional)"}>
                <Input
                  placeholder="e.g. September 2026 / Milad 1448"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Notes / Description">
              <Textarea
                placeholder="Optional notes or remarks"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSubmitting ? "Saving..." : "Save & Generate Receipt"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Instant Printable Receipt Modal */}
      <UniversalReceiptModal
        open={showReceiptModal}
        onOpenChange={setShowReceiptModal}
        receipt={createdReceipt}
      />
    </>
  );
}
