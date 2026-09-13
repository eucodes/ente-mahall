"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  Plus,
  Folder,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account, AccountType } from "@/lib/finance";

interface Props {
  slug: string;
  initialAccounts: Account[];
}

export function AccountsClient({ slug, initialAccounts }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<AccountType>("ASSET");
  const [parentId, setParentId] = useState("");
  const [description, setDescription] = useState("");

  const accountsByType: Record<string, Account[]> = {
    ASSET: initialAccounts.filter((a) => a.type === "ASSET"),
    LIABILITY: initialAccounts.filter((a) => a.type === "LIABILITY"),
    EQUITY: initialAccounts.filter((a) => a.type === "EQUITY"),
    INCOME: initialAccounts.filter((a) => a.type === "INCOME"),
    EXPENSE: initialAccounts.filter((a) => a.type === "EXPENSE")
  };

  function openCreateModal(defaultType?: AccountType, defaultParent?: string) {
    setEditingId(null);
    setName("");
    setCode("");
    setType(defaultType || "ASSET");
    setParentId(defaultParent || "");
    setDescription("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Please enter account name", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await apiClient.patch(`/tenants/${slug}/finance/accounts/${editingId}`, {
          name,
          code: code || undefined,
          description: description || undefined,
          parentId: parentId || undefined
        });
        toast({ title: "Account updated successfully", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/finance/accounts`, {
          name,
          code: code || undefined,
          type,
          parentId: parentId || undefined,
          description: description || undefined
        });
        toast({ title: "Account created successfully", variant: "success" });
      }
      setModalOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to save account";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Standard hierarchical Chart of Accounts (Assets, Liabilities, Equity, Income, Expenses).
        </div>
        <Button onClick={() => openCreateModal()} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {(["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"] as AccountType[]).map((groupType) => {
          const list = accountsByType[groupType] || [];
          return (
            <Card key={groupType} className="rounded-2xl border border-border/80 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {groupType}
                  </Badge>
                  <span>({list.length} accounts)</span>
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openCreateModal(groupType)}
                  className="h-7 text-xs text-emerald-600"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
              </CardHeader>
              <CardContent className="space-y-1">
                {list.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">No accounts under {groupType}.</p>
                ) : (
                  list.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/40 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {acc.code ? (
                          <span className="font-mono text-muted-foreground font-semibold">
                            {acc.code}
                          </span>
                        ) : (
                          <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className="font-medium text-foreground">{acc.name}</span>
                        {acc.isSystem && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0">
                            System
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Account Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Account" : "Create Chart of Account"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField label="Account Name" required>
              <Input
                placeholder="e.g. Mosque Renovation Fund"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Account Code">
                <Input
                  placeholder="e.g. 1010"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormField>

              <FormField label="Account Type" required>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value as AccountType)}
                  disabled={editingId !== null}
                >
                  <option value="ASSET">ASSET</option>
                  <option value="LIABILITY">LIABILITY</option>
                  <option value="EQUITY">EQUITY</option>
                  <option value="INCOME">INCOME</option>
                  <option value="EXPENSE">EXPENSE</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Parent Account (Optional)">
              <Select value={parentId} onChange={(e) => setParentId(e.target.value)}>
                <option value="">None (Top Level)</option>
                {initialAccounts
                  .filter((a) => a.type === type && a.id !== editingId)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code ? `${a.code} - ` : ""}{a.name}
                    </option>
                  ))}
              </Select>
            </FormField>

            <FormField label="Description">
              <Textarea
                placeholder="Account purpose / note..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSubmitting ? "Saving..." : "Save Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
