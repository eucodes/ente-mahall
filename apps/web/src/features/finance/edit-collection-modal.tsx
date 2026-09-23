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
  SearchableSelect,
  Textarea,
  FormField,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account, FinanceCollection, CollectionCategory, FinancePaymentMethod } from "@/lib/finance";

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
  collection: FinanceCollection | null;
  categories: CollectionCategory[];
  accounts?: Account[];
  paymentMethods: (FinancePaymentMethod | { id: string; name: string })[];
  families: FamilyItem[];
  members: MemberItem[];
}

export function EditCollectionModal({
  slug,
  open,
  onOpenChange,
  collection,
  categories,
  accounts = [],
  paymentMethods,
  families,
  members
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [accountId, setAccountId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [familyId, setFamilyId] = useState<string>("");
  const [memberId, setMemberId] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");

  const incomeAccounts = useMemo(() => {
    return accounts.filter((a) => a.type === "INCOME" || !a.type);
  }, [accounts]);

  useEffect(() => {
    if (collection) {
      const catId = collection.categoryId || "";
      setCategoryId(catId);
      const cat = categories.find((c) => c.id === catId);
      setAccountId(cat?.incomeAccountId || "");
      setFamilyId(collection.familyId || "");
      setMemberId(collection.memberId || "");
      setDonorName(collection.donorName || "");
      setDonorPhone(collection.donorPhone || "");
      setAmount(collection.amount ? String(collection.amount) : "");
      setPaymentMethod(collection.paymentMethod || "Cash");
      setDate(collection.date ? new Date(collection.date).toISOString().split("T")[0] : "");
      setDescription(collection.description || "");
      setNotes(collection.notes || "");
      setAttachmentUrl(collection.attachmentUrl || "");
    }
  }, [collection, categories]);

  const filteredCategories = useMemo(() => {
    if (!accountId) return categories;
    return categories.filter((c) => !c.incomeAccountId || c.incomeAccountId === accountId);
  }, [categories, accountId]);

  const accountOptions = useMemo(() => {
    return incomeAccounts.map((a) => ({
      value: a.id,
      label: a.name,
      subLabel: a.code || undefined,
      group: a.parentAccount?.name || (a.type === "INCOME" ? "Income / Fund Accounts" : "Accounts")
    }));
  }, [incomeAccounts]);

  const categoryOptions = useMemo(() => {
    return filteredCategories.map((c) => ({
      value: c.id,
      label: c.name,
      subLabel: undefined,
      group: c.incomeAccount?.name || "General Collection Categories"
    }));
  }, [filteredCategories]);

  const familyOptions = useMemo(() => {
    return families.map((f) => ({
      value: f.id,
      label: f.name,
      subLabel: f.familyNumber ? `#${f.familyNumber}` : undefined
    }));
  }, [families]);

  const filteredMembers = useMemo(() => {
    if (!familyId) return members;
    return members.filter((m) => String(m.familyId) === String(familyId));
  }, [members, familyId]);

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

  function handleAccountChange(accId: string) {
    setAccountId(accId);
    if (categoryId) {
      const cat = categories.find((c) => c.id === categoryId);
      if (cat?.incomeAccountId && accId && cat.incomeAccountId !== accId) {
        setCategoryId("");
      }
    }
  }

  function handleCategoryChange(selectedId: string) {
    setCategoryId(selectedId);
    const cat = categories.find((c) => c.id === selectedId);
    if (cat?.incomeAccountId && !accountId) {
      setAccountId(cat.incomeAccountId);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!collection) return;
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.patch(`/tenants/${slug}/finance/collections/${collection.id}`, {
        categoryId: categoryId || undefined,
        familyId: familyId || undefined,
        memberId: memberId || undefined,
        donorName: donorName || undefined,
        donorPhone: donorPhone || undefined,
        amount: String(amount).trim(),
        paymentMethod,
        date: date ? new Date(date).toISOString() : undefined,
        description: description || undefined,
        notes: notes || undefined,
        attachmentUrl: attachmentUrl || undefined
      });

      toast({ title: "Collection updated successfully", variant: "success" });
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to update collection";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl p-6">
        <DialogHeader className="pb-2 border-b border-border/60">
          <DialogTitle className="text-base font-bold">Edit Collection Record</DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Modify details, category, or payment information for this receipt.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {/* Account & Category Linked Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-3.5 rounded-2xl border border-border/60">
            <FormField label="Fund / Income Account">
              <SearchableSelect
                options={accountOptions}
                value={accountId}
                onChange={handleAccountChange}
                placeholder={incomeAccounts.length === 0 ? "No accounts found" : "Select an account"}
                searchPlaceholder="Search"
                emptyMessage="No accounts found"
              />
            </FormField>

            <FormField label="Collection Head / Category" required>
              <SearchableSelect
                options={categoryOptions}
                value={categoryId}
                onChange={handleCategoryChange}
                placeholder="Select category..."
                searchPlaceholder="Search"
                emptyMessage="No matching categories"
              />
            </FormField>
          </div>

          {/* Family & Member */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Family (Optional)">
              <SearchableSelect
                options={familyOptions}
                value={familyId}
                onChange={setFamilyId}
                placeholder="Select family..."
                searchPlaceholder="Search family..."
                emptyMessage="No matching families found"
              />
            </FormField>

            <FormField label="Family Member (Optional)">
              <SearchableSelect
                options={memberOptions}
                value={memberId}
                onChange={setMemberId}
                placeholder="Select member..."
                searchPlaceholder="Search member..."
                emptyMessage="No members found"
              />
            </FormField>
          </div>

          {/* Donor Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Payer / Donor Name">
              <Input
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Full Name / Donor"
                className="h-9 text-xs"
              />
            </FormField>

            <FormField label="Donor Phone (Optional)">
              <Input
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="h-9 text-xs"
              />
            </FormField>
          </div>

          {/* Amount & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Amount (₹)" required>
              <Input
                type="number"
                step="any"
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

          {/* Date */}
          <FormField label="Receipt Date" required>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="h-9 text-xs"
            />
          </FormField>

          {/* Description */}
          <FormField label="Description / Remarks">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description..."
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
