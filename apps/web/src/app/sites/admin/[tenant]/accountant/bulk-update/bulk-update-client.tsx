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
  Building2,
  ArrowRight,
  FolderPlus,
  Settings,
  Scale,
  Sparkles,
  Tag
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type {
  Account,
  AccountType,
  CollectionCategory,
  ExpenseCategory,
  FinanceCollection,
  FinanceFund,
  Voucher
} from "@/lib/finance";

interface Props {
  slug: string;
  mahalleName: string;
  funds?: FinanceFund[];
  accounts: Account[];
  collectionCategories: CollectionCategory[];
  expenseCategories: ExpenseCategory[];
  collections: FinanceCollection[];
  vouchers: Voucher[];
}

type MainTab = "CATEGORIES" | "ACCOUNTS" | "TRANSACTIONS";

export function BulkUpdateClient({
  slug,
  mahalleName,
  funds = [],
  accounts,
  collectionCategories,
  expenseCategories,
  collections,
  vouchers
}: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<MainTab>("CATEGORIES");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Tab 1: Categories State
  const [categoryKind, setCategoryKind] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [filterFund, setFilterFund] = useState("ALL");
  const [targetCategoryFund, setTargetCategoryFund] = useState("");
  const [targetCategoryType, setTargetCategoryType] = useState("");
  const [targetChartAccount, setTargetChartAccount] = useState("");
  const [targetStatus, setTargetStatus] = useState<"ACTIVE" | "INACTIVE" | "">("");

  // Tab 2: Chart of Accounts State
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("ALL");
  const [targetAccountFund, setTargetAccountFund] = useState("");
  const [targetAccountType, setTargetAccountType] = useState<AccountType | "">("");
  const [targetParentAccount, setTargetParentAccount] = useState("");
  const [targetAccountStatus, setTargetAccountStatus] = useState<"ACTIVE" | "INACTIVE" | "">("");

  // Tab 3: Transactions State
  const [txModuleType, setTxModuleType] = useState<"COLLECTIONS" | "VOUCHERS">("COLLECTIONS");
  const [txFilterCategory, setTxFilterCategory] = useState("ALL");
  const [txTargetFund, setTxTargetFund] = useState("");
  const [txTargetCategory, setTxTargetCategory] = useState("");
  const [txTargetAccount, setTxTargetAccount] = useState("");

  // 1. Combined Categories list
  const allCategories = useMemo(() => {
    const list: {
      id: string;
      name: string;
      code?: string | null;
      kind: "INCOME" | "EXPENSE";
      fundId?: string | null;
      fundName?: string;
      targetType?: string;
      isRecurring?: boolean;
      isSubscription?: boolean;
      chartAccountId?: string | null;
      chartAccountName?: string;
      isActive: boolean;
    }[] = [];

    for (const c of collectionCategories) {
      const fundObj = funds.find((f) => f.id === c.fundId);
      list.push({
        id: c.id,
        name: c.name,
        code: c.code,
        kind: "INCOME",
        fundId: c.fundId,
        fundName: fundObj?.name || "General Fund",
        targetType: c.targetType || "ALL_FAMILIES",
        isRecurring: c.isRecurring,
        isSubscription: c.isSubscription,
        chartAccountId: c.incomeAccountId,
        chartAccountName: c.incomeAccount?.name || "—",
        isActive: c.isActive
      });
    }

    for (const e of expenseCategories) {
      const fundObj = funds.find((f) => f.id === e.fundId);
      list.push({
        id: e.id,
        name: e.name,
        code: e.code,
        kind: "EXPENSE",
        fundId: e.fundId,
        fundName: fundObj?.name || "General Fund",
        targetType: "GENERAL",
        isRecurring: false,
        isSubscription: false,
        chartAccountId: e.expenseAccountId,
        chartAccountName: e.expenseAccount?.name || "—",
        isActive: e.isActive
      });
    }

    return list;
  }, [collectionCategories, expenseCategories, funds]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return allCategories.filter((c) => {
      if (categoryKind !== "ALL" && c.kind !== categoryKind) return false;
      if (filterFund !== "ALL" && (c.fundId || "default") !== filterFund) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = c.name.toLowerCase().includes(term);
        const matchCode = (c.code || "").toLowerCase().includes(term);
        if (!matchName && !matchCode) return false;
      }
      return true;
    });
  }, [allCategories, categoryKind, filterFund, searchTerm]);

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((a) => {
      if (accountTypeFilter !== "ALL" && a.type !== accountTypeFilter) return false;
      if (filterFund !== "ALL" && (a.fundId || "default") !== filterFund) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = a.name.toLowerCase().includes(term);
        const matchCode = (a.code || "").toLowerCase().includes(term);
        if (!matchName && !matchCode) return false;
      }
      return true;
    });
  }, [accounts, accountTypeFilter, filterFund, searchTerm]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (txModuleType === "COLLECTIONS") {
      return collections.filter((c) => {
        if (txFilterCategory !== "ALL" && c.categoryId !== txFilterCategory) return false;
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
        if (txFilterCategory !== "ALL" && (v.expenseCategoryId || (v as any).expenseCategory?.id) !== txFilterCategory) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const party = (v.payeeName || v.partyName || "").toLowerCase();
          const doc = (v.voucherNumber || "").toLowerCase();
          if (!party.includes(term) && !doc.includes(term)) return false;
        }
        return true;
      });
    }
  }, [txModuleType, collections, vouchers, txFilterCategory, searchTerm]);

  // Current active records list based on tab
  const currentList = useMemo(() => {
    if (activeTab === "CATEGORIES") return filteredCategories;
    if (activeTab === "ACCOUNTS") return filteredAccounts;
    return filteredTransactions;
  }, [activeTab, filteredCategories, filteredAccounts, filteredTransactions]);

  const allSelected = currentList.length > 0 && selectedIds.length === currentList.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentList.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Switch tabs & clear selections
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setSelectedIds([]);
    setSearchTerm("");
  };

  // Execute Bulk Action for Categories
  const handleExecuteCategoryBulkUpdate = async () => {
    if (selectedIds.length === 0) return;
    if (!targetCategoryFund && !targetCategoryType && !targetChartAccount && !targetStatus) {
      toast({ title: "Please select at least one field to update", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    try {
      // Split selected categories by income / expense
      for (const id of selectedIds) {
        const cat = allCategories.find((c) => c.id === id);
        if (!cat) continue;

        const isIncome = cat.kind === "INCOME";
        const endpoint = isIncome
          ? `/tenants/${encodeURIComponent(slug)}/finance/settings/collection-categories/${encodeURIComponent(id)}`
          : `/tenants/${encodeURIComponent(slug)}/finance/settings/expense-categories/${encodeURIComponent(id)}`;

        const payload: Record<string, any> = {};
        if (targetCategoryFund) payload.fundId = targetCategoryFund === "NONE" ? null : targetCategoryFund;
        if (targetStatus) payload.isActive = targetStatus === "ACTIVE";

        if (isIncome) {
          if (targetCategoryType) {
            if (targetCategoryType === "SUBSCRIPTION") {
              payload.isSubscription = true;
              payload.isRecurring = true;
            } else if (targetCategoryType === "RECURRING") {
              payload.isRecurring = true;
              payload.isSubscription = false;
            } else if (targetCategoryType === "ONE_TIME") {
              payload.isRecurring = false;
              payload.isSubscription = false;
            } else {
              payload.targetType = targetCategoryType;
            }
          }
          if (targetChartAccount) {
            payload.incomeAccountId = targetChartAccount === "NONE" ? null : targetChartAccount;
          }
        } else {
          if (targetChartAccount) {
            payload.expenseAccountId = targetChartAccount === "NONE" ? null : targetChartAccount;
          }
        }

        await apiClient.patch(endpoint, payload);
      }

      toast({
        title: "Categories Updated Successfully",
        description: `Updated ${selectedIds.length} categories with chosen configuration.`
      });
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      toast({
        title: "Bulk Update Failed",
        description: err instanceof ApiError ? err.message : "An error occurred during update.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Execute Bulk Action for Chart of Accounts
  const handleExecuteAccountBulkUpdate = async () => {
    if (selectedIds.length === 0) return;
    if (!targetAccountFund && !targetAccountType && !targetParentAccount && !targetAccountStatus) {
      toast({ title: "Please select at least one field to update", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    try {
      for (const id of selectedIds) {
        const payload: Record<string, any> = {};
        if (targetAccountFund) payload.fundId = targetAccountFund === "NONE" ? null : targetAccountFund;
        if (targetAccountType) payload.type = targetAccountType;
        if (targetParentAccount) payload.parentAccountId = targetParentAccount === "NONE" ? null : targetParentAccount;
        if (targetAccountStatus) payload.isActive = targetAccountStatus === "ACTIVE";

        await apiClient.patch(
          `/tenants/${encodeURIComponent(slug)}/finance/accounts/${encodeURIComponent(id)}`,
          payload
        );
      }

      toast({
        title: "Chart of Accounts Updated",
        description: `Updated ${selectedIds.length} ledger accounts successfully.`
      });
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      toast({
        title: "Bulk Update Failed",
        description: err instanceof ApiError ? err.message : "An error occurred during update.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Execute Bulk Action for Transactions
  const handleExecuteTransactionBulkUpdate = async () => {
    if (selectedIds.length === 0) return;
    if (!txTargetFund && !txTargetCategory && !txTargetAccount) {
      toast({ title: "Please select at least one field to update", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    try {
      for (const id of selectedIds) {
        const endpoint =
          txModuleType === "COLLECTIONS"
            ? `/tenants/${encodeURIComponent(slug)}/finance/collections/${encodeURIComponent(id)}`
            : `/tenants/${encodeURIComponent(slug)}/finance/vouchers/${encodeURIComponent(id)}`;

        const payload: Record<string, any> = {};
        if (txTargetFund) payload.fundId = txTargetFund === "NONE" ? null : txTargetFund;
        if (txTargetCategory) {
          if (txModuleType === "COLLECTIONS") payload.categoryId = txTargetCategory;
          else payload.expenseCategoryId = txTargetCategory;
        }
        if (txTargetAccount) payload.accountId = txTargetAccount;

        await apiClient.patch(endpoint, payload);
      }

      toast({
        title: "Transactions Updated",
        description: `Reclassified ${selectedIds.length} records successfully.`
      });
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      toast({
        title: "Bulk Update Failed",
        description: err instanceof ApiError ? err.message : "An error occurred during update.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60 dark:bg-slate-950/40">
      {/* Top Header */}
      <div className="bg-background border-b border-border px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Bulk Update Tool
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              Accountant Center
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Batch configure public categories, Chart of Accounts ledgers, and historic transaction allocations for {mahalleName}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => handleTabChange("CATEGORIES")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "CATEGORIES"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Public Categories ({allCategories.length})
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("ACCOUNTS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "ACCOUNTS"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Chart of Accounts ({accounts.length})
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("TRANSACTIONS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "TRANSACTIONS"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Transactions
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* TAB 1: CATEGORIES BULK UPDATE */}
        {activeTab === "CATEGORIES" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-background p-4 rounded-xl border border-border">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                  <Input
                    placeholder="Search category name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs bg-muted/30"
                  />
                </div>

                <Select
                  value={categoryKind}
                  onChange={(e) => setCategoryKind(e.target.value as any)}
                  className="h-8 text-xs min-w-[130px]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="INCOME">Collections (Inflow)</option>
                  <option value="EXPENSE">Expenses (Outflow)</option>
                </Select>

                <Select
                  value={filterFund}
                  onChange={(e) => setFilterFund(e.target.value)}
                  className="h-8 text-xs min-w-[140px]"
                >
                  <option value="ALL">All Funds</option>
                  {funds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="text-xs text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{filteredCategories.length}</strong> categories
              </div>
            </div>

            {/* Batch Action Floating Panel */}
            {selectedIds.length > 0 && (
              <Card className="border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 shadow-md">
                <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-6 px-2.5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {selectedIds.length}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Categories Selected for Bulk Update
                    </span>
                  </div>

                  {/* Action Inputs */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Reassign Fund */}
                    <Select
                      value={targetCategoryFund}
                      onChange={(e) => setTargetCategoryFund(e.target.value)}
                      className="h-8 text-xs bg-background min-w-[140px]"
                    >
                      <option value="">Move to Fund...</option>
                      {funds.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </Select>

                    {/* Change Category Scope / Type */}
                    <Select
                      value={targetCategoryType}
                      onChange={(e) => setTargetCategoryType(e.target.value)}
                      className="h-8 text-xs bg-background min-w-[140px]"
                    >
                      <option value="">Set Scope / Type...</option>
                      <option value="ALL_FAMILIES">All Families</option>
                      <option value="SPECIFIC_DIVISIONS">Specific Divisions</option>
                      <option value="CATEGORY_BASED">Category Based</option>
                      <option value="GENERAL">General Public</option>
                      <option value="SUBSCRIPTION">Monthly Subscription</option>
                      <option value="RECURRING">Recurring Period</option>
                      <option value="ONE_TIME">One-time Collection</option>
                    </Select>

                    {/* Link to Chart of Accounts */}
                    <Select
                      value={targetChartAccount}
                      onChange={(e) => setTargetChartAccount(e.target.value)}
                      className="h-8 text-xs bg-background min-w-[160px]"
                    >
                      <option value="">Map Chart of Accounts...</option>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.type})
                        </option>
                      ))}
                    </Select>

                    {/* Set Status */}
                    <Select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value as any)}
                      className="h-8 text-xs bg-background min-w-[110px]"
                    >
                      <option value="">Set Status...</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </Select>

                    <Button
                      size="sm"
                      onClick={handleExecuteCategoryBulkUpdate}
                      disabled={isUpdating}
                      className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg gap-1.5"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Apply Updates</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories Table */}
            <Card className="border border-border shadow-xs overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="w-12 pl-4">
                        <Checkbox
                          checked={allSelected}
                          onChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Public Category Name
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-36">
                        Inflow / Outflow
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-44">
                        Assigned Fund
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-44">
                        Public Scope / Type
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-48">
                        Chart of Accounts Mapping
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider text-right pr-4 w-24">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border">
                    {filteredCategories.map((cat) => {
                      const isSelected = selectedIds.includes(cat.id);
                      return (
                        <TableRow
                          key={cat.id}
                          onClick={() => toggleSelect(cat.id)}
                          className={`group hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer ${
                            isSelected ? "bg-blue-50/60 dark:bg-blue-950/40" : ""
                          }`}
                        >
                          <TableCell className="pl-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleSelect(cat.id)}
                            />
                          </TableCell>

                          {/* Category Name & Code */}
                          <TableCell className="py-3 font-semibold text-xs text-foreground">
                            <div className="flex items-center gap-2">
                              <span>{cat.name}</span>
                              {cat.code && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-muted text-muted-foreground">
                                  {cat.code}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* Kind Badge */}
                          <TableCell className="py-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                cat.kind === "INCOME"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              }`}
                            >
                              {cat.kind === "INCOME" ? "Collection" : "Expense"}
                            </span>
                          </TableCell>

                          {/* Assigned Fund */}
                          <TableCell className="py-3 text-xs font-medium text-foreground/90 flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span>{cat.fundName}</span>
                          </TableCell>

                          {/* Public Scope / Behavior */}
                          <TableCell className="py-3 text-xs text-muted-foreground">
                            {cat.kind === "INCOME" ? (
                              <span className="capitalize">
                                {cat.targetType?.replace("_", " ").toLowerCase()}
                              </span>
                            ) : (
                              <span>General Outflow</span>
                            )}
                          </TableCell>

                          {/* Chart of Accounts Link */}
                          <TableCell className="py-3 text-xs text-foreground/80 font-mono">
                            {cat.chartAccountName}
                          </TableCell>

                          {/* Status */}
                          <TableCell className="py-3 text-right pr-4">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                cat.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {cat.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {filteredCategories.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-12 text-center text-xs text-muted-foreground"
                        >
                          No categories found matching criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: CHART OF ACCOUNTS BULK UPDATE */}
        {activeTab === "ACCOUNTS" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-background p-4 rounded-xl border border-border">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                  <Input
                    placeholder="Search account name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs bg-muted/30"
                  />
                </div>

                <Select
                  value={accountTypeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value)}
                  className="h-8 text-xs min-w-[130px]"
                >
                  <option value="ALL">All Account Types</option>
                  <option value="ASSET">Asset</option>
                  <option value="LIABILITY">Liability</option>
                  <option value="EQUITY">Equity</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </Select>

                <Select
                  value={filterFund}
                  onChange={(e) => setFilterFund(e.target.value)}
                  className="h-8 text-xs min-w-[140px]"
                >
                  <option value="ALL">All Funds</option>
                  {funds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="text-xs text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{filteredAccounts.length}</strong> accounts
              </div>
            </div>

            {/* Batch Action Floating Panel */}
            {selectedIds.length > 0 && (
              <Card className="border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 shadow-md">
                <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-6 px-2.5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {selectedIds.length}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Ledger Accounts Selected
                    </span>
                  </div>

                  {/* Action Inputs */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Move to Fund */}
                    <Select
                      value={targetAccountFund}
                      onChange={(e) => setTargetAccountFund(e.target.value)}
                      className="h-8 text-xs bg-background min-w-[140px]"
                    >
                      <option value="">Move to Fund...</option>
                      {funds.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </Select>

                    {/* Change Account Type */}
                    <Select
                      value={targetAccountType}
                      onChange={(e) => setTargetAccountType(e.target.value as any)}
                      className="h-8 text-xs bg-background min-w-[130px]"
                    >
                      <option value="">Set Type...</option>
                      <option value="ASSET">Asset</option>
                      <option value="LIABILITY">Liability</option>
                      <option value="EQUITY">Equity</option>
                      <option value="INCOME">Income</option>
                      <option value="EXPENSE">Expense</option>
                    </Select>

                    {/* Assign Parent Account */}
                    <Select
                      value={targetParentAccount}
                      onChange={(e) => setTargetParentAccount(e.target.value)}
                      className="h-8 text-xs bg-background min-w-[160px]"
                    >
                      <option value="">Set Parent Account...</option>
                      <option value="NONE">No Parent (Top Level)</option>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.type})
                        </option>
                      ))}
                    </Select>

                    {/* Set Status */}
                    <Select
                      value={targetAccountStatus}
                      onChange={(e) => setTargetAccountStatus(e.target.value as any)}
                      className="h-8 text-xs bg-background min-w-[110px]"
                    >
                      <option value="">Set Status...</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </Select>

                    <Button
                      size="sm"
                      onClick={handleExecuteAccountBulkUpdate}
                      disabled={isUpdating}
                      className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg gap-1.5"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Apply Updates</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Accounts Table */}
            <Card className="border border-border shadow-xs overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="w-12 pl-4">
                        <Checkbox
                          checked={allSelected}
                          onChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Account Name & Code
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-36">
                        Account Type
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-44">
                        Assigned Fund
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-48">
                        Parent Account
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider text-right pr-4 w-24">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border">
                    {filteredAccounts.map((acc) => {
                      const isSelected = selectedIds.includes(acc.id);
                      const fundObj = funds.find((f) => f.id === acc.fundId);

                      return (
                        <TableRow
                          key={acc.id}
                          onClick={() => toggleSelect(acc.id)}
                          className={`group hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer ${
                            isSelected ? "bg-blue-50/60 dark:bg-blue-950/40" : ""
                          }`}
                        >
                          <TableCell className="pl-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleSelect(acc.id)}
                            />
                          </TableCell>

                          <TableCell className="py-3 font-semibold text-xs text-foreground">
                            <div className="flex items-center gap-2">
                              <span>{acc.name}</span>
                              {acc.code && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-muted text-muted-foreground">
                                  {acc.code}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-3">
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {acc.type}
                            </span>
                          </TableCell>

                          <TableCell className="py-3 text-xs font-medium text-foreground/90 flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span>{fundObj?.name || "General Fund"}</span>
                          </TableCell>

                          <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                            {acc.parentAccount?.name || "—"}
                          </TableCell>

                          <TableCell className="py-3 text-right pr-4">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                acc.isActive !== false
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {acc.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {filteredAccounts.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-12 text-center text-xs text-muted-foreground"
                        >
                          No accounts found matching criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: TRANSACTIONS BULK UPDATE */}
        {activeTab === "TRANSACTIONS" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-background p-4 rounded-xl border border-border">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                  <Input
                    placeholder="Search party or receipt #..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs bg-muted/30"
                  />
                </div>

                <Select
                  value={txModuleType}
                  onChange={(e) => {
                    setTxModuleType(e.target.value as any);
                    setSelectedIds([]);
                  }}
                  className="h-8 text-xs min-w-[140px]"
                >
                  <option value="COLLECTIONS">Collections Recorded</option>
                  <option value="VOUCHERS">Expenses / Vouchers</option>
                </Select>

                <Select
                  value={txFilterCategory}
                  onChange={(e) => setTxFilterCategory(e.target.value)}
                  className="h-8 text-xs min-w-[150px]"
                >
                  <option value="ALL">All Categories</option>
                  {(txModuleType === "COLLECTIONS" ? collectionCategories : expenseCategories).map(
                    (c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    )
                  )}
                </Select>
              </div>

              <div className="text-xs text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{filteredTransactions.length}</strong> transactions
              </div>
            </div>

            {/* Batch Action Floating Panel */}
            {selectedIds.length > 0 && (
              <Card className="border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 shadow-md">
                <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-6 px-2.5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {selectedIds.length}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Transactions Selected
                    </span>
                  </div>

                  {/* Action Inputs */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Reassign Fund */}
                    <Select
                      value={txTargetFund}
                      onChange={(e) => setTxTargetFund(e.target.value)}
                      className="h-8 text-xs bg-background min-w-[140px]"
                    >
                      <option value="">Move to Fund...</option>
                      {funds.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </Select>

                    {/* Reassign Category */}
                    <Select
                      value={txTargetCategory}
                      onChange={(e) => setTxTargetCategory(e.target.value)}
                      className="h-8 text-xs bg-background min-w-[150px]"
                    >
                      <option value="">Change Category...</option>
                      {(txModuleType === "COLLECTIONS" ? collectionCategories : expenseCategories).map(
                        (c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        )
                      )}
                    </Select>

                    <Button
                      size="sm"
                      onClick={handleExecuteTransactionBulkUpdate}
                      disabled={isUpdating}
                      className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg gap-1.5"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Reclassify</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transactions Table */}
            <Card className="border border-border shadow-xs overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="w-12 pl-4">
                        <Checkbox
                          checked={allSelected}
                          onChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Document / Ref
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Party / Member
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-40">
                        Category
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-32">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider text-right pr-4 w-32">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border">
                    {filteredTransactions.map((tx: any) => {
                      const isSelected = selectedIds.includes(tx.id);
                      const party =
                        tx.donorName ||
                        tx.member?.fullName ||
                        tx.family?.name ||
                        tx.payeeName ||
                        tx.partyName ||
                        "—";
                      const doc =
                        tx.receipt?.receiptNumber ||
                        tx.collectionNumber ||
                        tx.voucherNumber ||
                        "—";
                      const catName =
                        tx.category?.name ||
                        tx.expenseCategory?.name ||
                        "—";
                      const formattedDate = new Date(tx.date).toLocaleDateString("en-GB");

                      return (
                        <TableRow
                          key={tx.id}
                          onClick={() => toggleSelect(tx.id)}
                          className={`group hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer ${
                            isSelected ? "bg-blue-50/60 dark:bg-blue-950/40" : ""
                          }`}
                        >
                          <TableCell className="pl-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleSelect(tx.id)}
                            />
                          </TableCell>

                          <TableCell className="py-3 font-mono text-xs font-semibold text-foreground">
                            {doc}
                          </TableCell>

                          <TableCell className="py-3 text-xs text-foreground font-medium">
                            {party}
                          </TableCell>

                          <TableCell className="py-3 text-xs text-foreground/80">
                            {catName}
                          </TableCell>

                          <TableCell className="py-3 text-xs text-muted-foreground">
                            {formattedDate}
                          </TableCell>

                          <TableCell className="py-3 text-right pr-4 font-mono font-bold text-xs text-foreground">
                            ₹{parseFloat(tx.amount || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {filteredTransactions.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-12 text-center text-xs text-muted-foreground"
                        >
                          No transactions found matching criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
