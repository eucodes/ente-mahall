"use client";

import { useState } from "react";
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
import type { Account, AccountType } from "@/lib/finance";

interface Props {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: AccountType;
  onAccountCreated?: (account: Account) => void;
}

export function QuickAddAccountModal({
  slug,
  open,
  onOpenChange,
  defaultType = "INCOME",
  onAccountCreated
}: Props) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<AccountType>(defaultType);
  const [description, setDescription] = useState("");
  const [openingBalance, setOpeningBalance] = useState("0");

  function handleOpenChange(val: boolean) {
    if (val) {
      setType(defaultType);
      setName("");
      setCode("");
      setDescription("");
      setOpeningBalance("0");
    }
    onOpenChange(val);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Please enter an account name", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post<{ account: Account }>(`/tenants/${slug}/finance/accounts`, {
        name: name.trim(),
        code: code.trim() || undefined,
        type,
        description: description.trim() || undefined,
        openingBalance: openingBalance || "0"
      });

      toast({
        title: "Account created successfully",
        description: `Account "${name}" is now available for transactions.`
      });

      if (res?.account && onAccountCreated) {
        onAccountCreated(res.account);
      }

      handleOpenChange(false);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to create account";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-base font-bold">
            Quick Add {type === "INCOME" ? "Fund Category" : "Expense Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Account Name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "INCOME" ? "e.g. Masjid Renovation Fund" : "e.g. Utilities & Power"}
              className="h-9 text-xs"
              required
              autoFocus
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Account Type" required>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
                className="h-9 text-xs"
              >
                <option value="INCOME">Income (Inflows / Fund)</option>
                <option value="EXPENSE">Expense (Outflows)</option>
                <option value="ASSET">Asset (Cash / Bank / Property)</option>
                <option value="LIABILITY">Liability (Payable / Loan)</option>
              </Select>
            </FormField>

            <FormField label="Account Code (Optional)">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. INC-001"
                className="h-9 text-xs"
              />
            </FormField>
          </div>

          <FormField label="Description (Optional)">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief purpose or scope of this account..."
              className="text-xs resize-none"
              rows={2}
            />
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
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
              {isSubmitting ? "Creating..." : "Save Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
