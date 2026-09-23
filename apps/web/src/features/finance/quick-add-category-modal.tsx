"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Select,
  Textarea,
  FormField,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account, CollectionCategory, ExpenseCategory } from "@/lib/finance";

interface Props {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "COLLECTION" | "EXPENSE";
  accounts: Account[];
  defaultAccountId?: string;
  onCollectionCategoryCreated?: (cat: CollectionCategory) => void;
  onExpenseCategoryCreated?: (cat: ExpenseCategory) => void;
}

export function QuickAddCategoryModal({
  slug,
  open,
  onOpenChange,
  type,
  accounts,
  defaultAccountId,
  onCollectionCategoryCreated,
  onExpenseCategoryCreated
}: Props) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [accountId, setAccountId] = useState(defaultAccountId || "");
  const [description, setDescription] = useState("");

  // Collection-specific fields
  const [targetType, setTargetType] = useState<string>("ALL_FAMILIES");
  const [defaultAmount, setDefaultAmount] = useState<string>("");
  const [isSubscription, setIsSubscription] = useState<boolean>(false);

  const relevantAccounts = accounts.filter((a) =>
    type === "COLLECTION" ? a.type === "INCOME" : a.type === "EXPENSE"
  );

  useEffect(() => {
    if (open) {
      setName("");
      setCode("");
      setDescription("");
      setDefaultAmount("");
      setIsSubscription(false);
      setTargetType("ALL_FAMILIES");
      setAccountId(defaultAccountId || relevantAccounts[0]?.id || "");
    }
  }, [open, defaultAccountId, type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Please enter a category name", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      if (type === "COLLECTION") {
        const res = await apiClient.post<{ category: CollectionCategory }>(
          `/tenants/${slug}/finance/settings/collection-categories`,
          {
            name: name.trim(),
            code: code.trim() || undefined,
            description: description.trim() || undefined,
            incomeAccountId: accountId || undefined,
            targetType,
            defaultAmount: defaultAmount ? Number(defaultAmount) : undefined,
            isSubscription,
            isRecurring: isSubscription,
            isActive: true
          }
        );

        toast({
          title: "Collection Category created",
          description: `Category "${name}" created under ${relevantAccounts.find((a) => a.id === accountId)?.name || "Account"}.`
        });

        if (res?.category && onCollectionCategoryCreated) {
          onCollectionCategoryCreated(res.category);
        }
      } else {
        const res = await apiClient.post<{ category: ExpenseCategory }>(
          `/tenants/${slug}/finance/settings/expense-categories`,
          {
            name: name.trim(),
            code: code.trim() || undefined,
            description: description.trim() || undefined,
            expenseAccountId: accountId || undefined,
            isActive: true
          }
        );

        toast({
          title: "Expense Head created",
          description: `Expense category "${name}" created successfully.`
        });

        if (res?.category && onExpenseCategoryCreated) {
          onExpenseCategoryCreated(res.category);
        }
      }

      onOpenChange(false);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to create category";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-base font-bold">
            Quick Add {type === "COLLECTION" ? "Collection Head / Category" : "Expense Head / Category"}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {type === "COLLECTION"
              ? "Create a new collection category linked to an Income Account."
              : "Create a new expense classification head under an Expense Account."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Parent Account / Fund" required>
            <Select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="h-9 text-xs"
              required
            >
              <option value="" disabled>Select parent account...</option>
              {relevantAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} {acc.code ? `(${acc.code})` : ""}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Category Name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "COLLECTION" ? "e.g. Monthly Mahallu Chanda, Friday Collection" : "e.g. Electricity, Water, Maintenance"}
              className="h-9 text-xs"
              required
              autoFocus
            />
          </FormField>

          {type === "COLLECTION" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Target & Scope">
                  <Select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="h-9 text-xs"
                  >
                    <option value="ALL_FAMILIES">All Families</option>
                    <option value="GENERAL">General Public / Donation</option>
                    <option value="CATEGORY_BASED">Category Based (A/B/C)</option>
                    <option value="SPECIFIC_DIVISIONS">Specific Divisions</option>
                  </Select>
                </FormField>

                <FormField label="Default Amount (₹)">
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    value={defaultAmount}
                    onChange={(e) => setDefaultAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="h-9 text-xs"
                  />
                </FormField>
              </div>
            </>
          )}

          <FormField label="Description (Optional)">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description or purpose of this category..."
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
              {isSubmitting ? "Creating..." : "Save Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
