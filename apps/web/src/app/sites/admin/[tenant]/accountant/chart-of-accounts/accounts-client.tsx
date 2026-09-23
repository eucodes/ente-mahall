"use client";

import { useState, useMemo } from "react";
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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Plus,
  Lock,
  Search,
  Pencil,
  ChevronDown,
  Folder,
  Layers,
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

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<AccountType>("ASSET");
  const [parentId, setParentId] = useState("");
  const [description, setDescription] = useState("");

  // Map parent accounts for lookup
  const accountMap = useMemo(() => {
    const map = new Map<string, Account>();
    initialAccounts.forEach((acc) => map.set(acc.id, acc));
    return map;
  }, [initialAccounts]);

  // Filtered Accounts list based on category & search query
  const filteredAccounts = useMemo(() => {
    return initialAccounts.filter((acc) => {
      // Category filter
      if (selectedFilter !== "ALL") {
        if (selectedFilter === "SYSTEM") {
          if (!acc.isSystem) return false;
        } else if (acc.type !== selectedFilter) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = acc.name.toLowerCase().includes(q);
        const codeMatch = acc.code?.toLowerCase().includes(q) ?? false;
        const descMatch = acc.description?.toLowerCase().includes(q) ?? false;
        const parentMatch = acc.parentAccount?.name.toLowerCase().includes(q) ?? false;
        return nameMatch || codeMatch || descMatch || parentMatch;
      }

      return true;
    });
  }, [initialAccounts, selectedFilter, searchQuery]);

  // Accounts counts breakdown
  const categoryCounts = useMemo(() => {
    return {
      ALL: initialAccounts.length,
      ASSET: initialAccounts.filter((a) => a.type === "ASSET").length,
      LIABILITY: initialAccounts.filter((a) => a.type === "LIABILITY").length,
      EQUITY: initialAccounts.filter((a) => a.type === "EQUITY").length,
      INCOME: initialAccounts.filter((a) => a.type === "INCOME").length,
      EXPENSE: initialAccounts.filter((a) => a.type === "EXPENSE").length,
      SYSTEM: initialAccounts.filter((a) => a.isSystem).length
    };
  }, [initialAccounts]);

  function openCreateModal(defaultType?: AccountType, defaultParent?: string) {
    setEditingId(null);
    setName("");
    setCode("");
    setType(defaultType || "ASSET");
    setParentId(defaultParent || "");
    setDescription("");
    setModalOpen(true);
  }

  function openEditModal(account: Account) {
    setEditingId(account.id);
    setName(account.name);
    setCode(account.code || "");
    setType(account.type);
    setParentId(account.parentAccountId || account.parentAccount?.id || "");
    setDescription(account.description || "");
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

  const getTypeBadge = (accountType: AccountType) => {
    switch (accountType) {
      case "ASSET":
        return (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 font-semibold text-[11px]">
            Asset
          </Badge>
        );
      case "LIABILITY":
        return (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 font-semibold text-[11px]">
            Liability
          </Badge>
        );
      case "EQUITY":
        return (
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 font-semibold text-[11px]">
            Equity
          </Badge>
        );
      case "INCOME":
        return (
          <Badge variant="secondary" className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20 font-semibold text-[11px]">
            Income
          </Badge>
        );
      case "EXPENSE":
        return (
          <Badge variant="secondary" className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 font-semibold text-[11px]">
            Expense
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px]">
            {accountType}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header Control Bar (Structured after reference layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/80 shadow-2xs">
        {/* Left: View Filter Dropdown & Category Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground shrink-0">Filter:</span>
            <Select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="h-9 text-xs font-semibold rounded-xl bg-background border-border min-w-[160px]"
            >
              <option value="ALL">All Accounts ({categoryCounts.ALL})</option>
              <option value="ASSET">Assets ({categoryCounts.ASSET})</option>
              <option value="LIABILITY">Liabilities ({categoryCounts.LIABILITY})</option>
              <option value="EQUITY">Equity ({categoryCounts.EQUITY})</option>
              <option value="INCOME">Income ({categoryCounts.INCOME})</option>
              <option value="EXPENSE">Expenses ({categoryCounts.EXPENSE})</option>
              <option value="SYSTEM">System Accounts ({categoryCounts.SYSTEM})</option>
            </Select>
          </div>

          {/* Quick Category Pills */}
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-border/60">
            {(["ALL", "ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedFilter === cat
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat === "ALL" ? "All" : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search & Create New Account */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="relative flex-1 sm:w-64">
            <Input
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leadingIcon={<Search className="h-4 w-4 text-muted-foreground" />}
              className="h-9 text-xs rounded-xl pr-3"
            />
          </div>
          <Button
            onClick={() => openCreateModal()}
            className="h-9 px-3.5 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>New Account</span>
          </Button>
        </div>
      </div>

      {/* Main Accounts Table (Unified Structure matching reference) */}
      <Card className="rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-b border-border/70">
              <TableHead className="w-10 text-center py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                #
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Account Name
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Account Code
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Account Type
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Parent Account Name
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </TableHead>
              <TableHead className="w-16 text-right py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Folder className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-xs font-semibold text-foreground">No accounts found matching your filter.</p>
                    {searchQuery || selectedFilter !== "ALL" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedFilter("ALL");
                        }}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        Reset filters
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCreateModal()}
                        className="text-xs gap-1.5 rounded-xl mt-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Create first account
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAccounts.map((acc) => {
                const parentAcc = acc.parentAccount || (acc.parentAccountId ? accountMap.get(acc.parentAccountId) : null);
                return (
                  <TableRow
                    key={acc.id}
                    className="group hover:bg-muted/40 transition-colors border-b border-border/50 text-xs"
                  >
                    {/* Status / Lock Icon Column */}
                    <TableCell className="text-center py-3">
                      {acc.isSystem ? (
                        <span title="System control account (Managed by application system)">
                          <Lock className="h-3.5 w-3.5 mx-auto text-amber-600/80 dark:text-amber-400" />
                        </span>
                      ) : (
                        <Folder className="h-3.5 w-3.5 mx-auto text-muted-foreground/60 group-hover:text-emerald-600 transition-colors" />
                      )}
                    </TableCell>

                    {/* Account Name */}
                    <TableCell className="py-3 font-semibold text-foreground">
                      <button
                        type="button"
                        onClick={() => openEditModal(acc)}
                        className="text-left font-bold text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2"
                      >
                        <span>{acc.name}</span>
                        {acc.isSystem && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-normal">
                            System
                          </span>
                        )}
                      </button>
                    </TableCell>

                    {/* Account Code */}
                    <TableCell className="py-3 font-mono text-muted-foreground font-medium">
                      {acc.code ? acc.code : <span className="text-muted-foreground/40">—</span>}
                    </TableCell>

                    {/* Account Type */}
                    <TableCell className="py-3">
                      {getTypeBadge(acc.type)}
                    </TableCell>

                    {/* Parent Account Name */}
                    <TableCell className="py-3 text-muted-foreground">
                      {parentAcc ? (
                        <span className="inline-flex items-center gap-1 font-medium text-foreground">
                          {parentAcc.code && <span className="font-mono text-[11px] text-muted-foreground">{parentAcc.code} -</span>}
                          <span>{parentAcc.name}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </TableCell>

                    {/* Description */}
                    <TableCell className="py-3 text-muted-foreground max-w-xs truncate">
                      {acc.description ? (
                        <span title={acc.description}>{acc.description}</span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(acc)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                        title="Edit account details"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Account Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingId ? "Edit Account" : "Create Chart of Account"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField label="Account Name" required>
              <Input
                placeholder="e.g., Cash in Hand, Hundi Collection..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Account Code">
                <Input
                  placeholder="e.g., 1010, 2010..."
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
                <option value="">None (Top Level Account)</option>
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
                placeholder="Account purpose or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                {isSubmitting ? "Saving..." : editingId ? "Update Account" : "Save Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
