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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Checkbox,
  useToast,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Layers,
  Wallet,
  ArrowRight
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type {
  Account,
  CollectionCategory,
  ExpenseCategory,
  FinanceCollection,
  Voucher
} from "@/lib/finance";

interface Props {
  slug: string;
  mahalleName: string;
  accounts: Account[];
  collectionCategories: CollectionCategory[];
  expenseCategories: ExpenseCategory[];
  collections: FinanceCollection[];
  vouchers: Voucher[];
}

export function BulkUpdateClient({
  slug,
  mahalleName,
  accounts,
  collectionCategories,
  expenseCategories,
  collections,
  vouchers
}: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [moduleType, setModuleType] = useState<"COLLECTIONS" | "VOUCHERS">("COLLECTIONS");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAccount, setFilterAccount] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Bulk action state
  const [targetAccount, setTargetAccount] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter records based on selection
  const records = useMemo(() => {
    if (moduleType === "COLLECTIONS") {
      return collections.filter((c) => {
        if (filterCategory !== "ALL" && c.categoryId !== filterCategory) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const party = (c.donorName || c.member?.fullName || c.family?.name || "").toLowerCase();
          const doc = (c.receipt?.receiptNumber || c.collectionNumber || "").toLowerCase();
          if (!party.includes(term) && !doc.includes(term)) return false;
        }
        return true;
      });
    } else {
      return vouchers.filter((v) => {
        if (filterAccount !== "ALL" && v.accountId !== filterAccount) return false;
        if (filterCategory !== "ALL" && (v.expenseCategoryId || (v as any).expenseCategory?.id) !== filterCategory) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const party = (v.payeeName || v.partyName || "").toLowerCase();
          const doc = (v.voucherNumber || "").toLowerCase();
          if (!party.includes(term) && !doc.includes(term)) return false;
        }
        return true;
      });
    }
  }, [moduleType, collections, vouchers, filterAccount, filterCategory, searchTerm]);

  const allSelected = records.length > 0 && selectedIds.length === records.length;

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(records.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  }

  function handleToggleRow(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleApplyBulkUpdate() {
    if (selectedIds.length === 0) {
      toast({ title: "Please select at least one record to update", variant: "destructive" });
      return;
    }

    if (!targetCategory && !targetAccount) {
      toast({ title: "Please select a target category or account to apply", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    try {
      if (moduleType === "COLLECTIONS") {
        await Promise.all(
          selectedIds.map((id) =>
            apiClient.patch(`/tenants/${slug}/finance/collections/${id}`, {
              categoryId: targetCategory || undefined
            })
          )
        );
      } else {
        await Promise.all(
          selectedIds.map((id) =>
            apiClient.patch(`/tenants/${slug}/finance/vouchers/${id}`, {
              accountId: targetAccount || undefined,
              expenseCategoryId: targetCategory || undefined
            })
          )
        );
      }

      toast({
        title: "Bulk update applied",
        description: `Successfully updated ${selectedIds.length} ${moduleType.toLowerCase()} records.`,
        variant: "success"
      });
      setSelectedIds([]);
      setTargetAccount("");
      setTargetCategory("");
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to apply bulk update";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Bulk Update Records
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Batch reassign accounts, fund categories, or classification for multiple transactions at once.
          </p>
        </div>

        {/* Module Switcher */}
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => {
              setModuleType("COLLECTIONS");
              setSelectedIds([]);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              moduleType === "COLLECTIONS"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Collections ({collections.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setModuleType("VOUCHERS");
              setSelectedIds([]);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              moduleType === "VOUCHERS"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Payment Vouchers ({vouchers.length})
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-in fade-in-0">
          <div className="flex items-center gap-3">
            <span className="h-7 px-2.5 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center">
              {selectedIds.length} Selected
            </span>
            <span className="text-xs font-medium text-blue-950 dark:text-blue-200">
              Apply new category or account to selected {moduleType.toLowerCase()}:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {moduleType === "VOUCHERS" && (
              <Select
                value={targetAccount}
                onChange={(e) => setTargetAccount(e.target.value)}
                className="h-8 text-xs min-w-[180px] bg-background"
              >
                <option value="">Choose Target Account...</option>
                {accounts.filter((a) => a.type === "EXPENSE" || !a.type).map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Select>
            )}

            <Select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              className="h-8 text-xs min-w-[200px] bg-background"
            >
              <option value="">Choose Target Category / Head...</option>
              {moduleType === "COLLECTIONS"
                ? collectionCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                : expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
            </Select>

            <Button
              size="sm"
              onClick={handleApplyBulkUpdate}
              disabled={isUpdating || (!targetCategory && !targetAccount)}
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs"
            >
              {isUpdating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              <span>{isUpdating ? "Updating..." : "Update Selected"}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${moduleType.toLowerCase()} by party or number...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-input/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1.5 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 text-xs min-w-[160px]"
          >
            <option value="ALL">All Categories</option>
            {moduleType === "COLLECTIONS"
              ? collectionCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
              : expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Doc Number
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Party / Beneficiary
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Current Category
                </TableHead>
                <TableHead className="text-right pr-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Amount (₹)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((rec: any) => {
                const isSelected = selectedIds.includes(rec.id);
                const party = rec.donorName || rec.member?.fullName || rec.family?.name || rec.payeeName || rec.partyName || "—";
                const doc = rec.receipt?.receiptNumber || rec.collectionNumber || rec.voucherNumber || "—";
                const catName = rec.category?.name || rec.expenseCategory?.name || "General";

                return (
                  <TableRow
                    key={rec.id}
                    className={`transition-colors ${isSelected ? "bg-blue-50/50 dark:bg-blue-950/30" : "hover:bg-muted/50"}`}
                  >
                    <TableCell className="pl-4 py-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleToggleRow(rec.id)}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3">
                      {rec.date ? new Date(rec.date).toLocaleDateString("en-IN") : "—"}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-medium py-3">
                      {doc}
                    </TableCell>
                    <TableCell className="text-xs font-semibold py-3 text-foreground">
                      {party}
                    </TableCell>
                    <TableCell className="text-xs py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-foreground">
                        {catName}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-5 text-xs font-mono font-bold py-3 text-foreground">
                      ₹{Number(rec.amount || 0).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                );
              })}

              {records.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    No transactions found to update.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
