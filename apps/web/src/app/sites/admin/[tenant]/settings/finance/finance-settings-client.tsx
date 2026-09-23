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
  FormField,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ConfirmDialog,
  Select,
  Checkbox,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Plus,
  Building2,
  CreditCard,
  Layers,
  Settings,
  Pencil,
  Trash2,
  RefreshCw,
  Globe,
  MapPin,
  Tag,
  Users,
  Wallet,
  Info,
  FolderPlus,
  SettingsRow,
  SettingsSection,
  Tabs,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type {
  FinanceSettings,
  FinanceBankAccount,
  FinancePaymentMethod,
  CollectionCategory,
  ExpenseCategory,
  Account,
  AccountType,
  CollectionFormConfig
} from "@/lib/finance";

interface Props {
  slug: string;
  settings: FinanceSettings | null;
  bankAccounts: FinanceBankAccount[];
  paymentMethods: FinancePaymentMethod[];
  collectionCategories: CollectionCategory[];
  expenseCategories: ExpenseCategory[];
  accounts?: Account[];
  divisions?: { id: string; name: string; code: string | null }[];
}


function FormConfigRow({
  label,
  enabled,
  required,
  onEnabledChange,
  onRequiredChange
}: {
  label: string;
  enabled: boolean;
  required: boolean;
  onEnabledChange: (v: boolean) => void;
  onRequiredChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
          <Checkbox
            checked={enabled}
            onChange={(e) => {
              onEnabledChange(e.target.checked);
              if (!e.target.checked) onRequiredChange(false);
            }}
          />
          <span className="text-muted-foreground">Enable</span>
        </label>
        {enabled && (
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <Checkbox
              checked={required}
              onChange={(e) => onRequiredChange(e.target.checked)}
            />
            <span className="text-muted-foreground">Required</span>
          </label>
        )}
      </div>
    </div>
  );
}

export function FinanceSettingsClient({
  slug,
  settings,
  bankAccounts,
  paymentMethods,
  collectionCategories,
  expenseCategories,
  accounts = [],
  divisions = []
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"funds" | "categories" | "banks" | "methods" | "general">("funds");

  const incomeAccounts = accounts.filter((a) => a.type === "INCOME" || !a.type);
  const expenseAccounts = accounts.filter((a) => a.type === "EXPENSE" || !a.type);

  // Fund / Account Management State
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundName, setFundName] = useState("");
  const [fundCode, setFundCode] = useState("");
  const [fundType, setFundType] = useState<AccountType>("INCOME");
  const [fundDescription, setFundDescription] = useState("");
  const [fundOpeningBalance, setFundOpeningBalance] = useState("");
  const [isSavingFund, setIsSavingFund] = useState(false);

  const [editFundTarget, setEditFundTarget] = useState<Account | null>(null);
  const [editFundName, setEditFundName] = useState("");
  const [editFundCode, setEditFundCode] = useState("");
  const [editFundType, setEditFundType] = useState<AccountType>("INCOME");
  const [editFundDescription, setEditFundDescription] = useState("");
  const [editFundOpeningBalance, setEditFundOpeningBalance] = useState("");
  const [isSavingEditFund, setIsSavingEditFund] = useState(false);

  const [deleteFundTarget, setDeleteFundTarget] = useState<Account | null>(null);
  const [isDeletingFund, setIsDeletingFund] = useState(false);

  // General Settings State
  const [currency, setCurrency] = useState(settings?.currency || "INR");
  const [receiptPrefix, setReceiptPrefix] = useState(settings?.receiptPrefix || "REC-");
  const [voucherPrefix, setVoucherPrefix] = useState(settings?.voucherPrefix || "VOU-");
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Bank Account Add Modal State
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branch, setBranch] = useState("");
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Bank Account Edit & Delete State
  const [editBankTarget, setEditBankTarget] = useState<FinanceBankAccount | null>(null);
  const [editBankName, setEditBankName] = useState("");
  const [editAccountName, setEditAccountName] = useState("");
  const [editAccountNumber, setEditAccountNumber] = useState("");
  const [editIfscCode, setEditIfscCode] = useState("");
  const [editBranch, setEditBranch] = useState("");
  const [isSavingEditBank, setIsSavingEditBank] = useState(false);

  const [deleteBankTarget, setDeleteBankTarget] = useState<FinanceBankAccount | null>(null);
  const [isDeletingBank, setIsDeletingBank] = useState(false);

  // Category Add Modal State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catType, setCatType] = useState<"collection" | "expense">("collection");
  const [catAccountId, setCatAccountId] = useState("");
  const [catName, setCatName] = useState("");
  const [catCode, setCatCode] = useState("");
  const [catTargetType, setCatTargetType] = useState<"ALL_FAMILIES" | "SPECIFIC_DIVISIONS" | "CATEGORY_BASED" | "GENERAL">("ALL_FAMILIES");
  const [catIsRecurring, setCatIsRecurring] = useState(false);
  const [catIsSubscription, setCatIsSubscription] = useState(false);
  const [catRecurrenceFrequency, setCatRecurrenceFrequency] = useState<"MONTHLY" | "ANNUAL" | "ONE_TIME">("MONTHLY");
  const [catEconomicCategory, setCatEconomicCategory] = useState("ALL");
  const [catTargetDivisions, setCatTargetDivisions] = useState<string[]>([]);
  const [catDefaultAmount, setCatDefaultAmount] = useState("");
  const [catTargetAmount, setCatTargetAmount] = useState("");
  const [isSavingCat, setIsSavingCat] = useState(false);

  // Category Edit & Delete State
  const [editCatTarget, setEditCatTarget] = useState<{
    item: CollectionCategory | ExpenseCategory;
    type: "collection" | "expense";
  } | null>(null);
  const [editCatAccountId, setEditCatAccountId] = useState("");
  const [editCatName, setEditCatName] = useState("");
  const [editCatCode, setEditCatCode] = useState("");
  const [editCatTargetType, setEditCatTargetType] = useState<"ALL_FAMILIES" | "SPECIFIC_DIVISIONS" | "CATEGORY_BASED" | "GENERAL">("ALL_FAMILIES");
  const [editCatIsRecurring, setEditCatIsRecurring] = useState(false);
  const [editCatIsSubscription, setEditCatIsSubscription] = useState(false);
  const [editCatRecurrenceFrequency, setEditCatRecurrenceFrequency] = useState<"MONTHLY" | "ANNUAL" | "ONE_TIME">("MONTHLY");
  const [editCatEconomicCategory, setEditCatEconomicCategory] = useState("ALL");
  const [editCatTargetDivisions, setEditCatTargetDivisions] = useState<string[]>([]);
  const [editCatDefaultAmount, setEditCatDefaultAmount] = useState("");
  const [editCatTargetAmount, setEditCatTargetAmount] = useState("");
  const [isSavingEditCat, setIsSavingEditCat] = useState(false);

  const [deleteCatTarget, setDeleteCatTarget] = useState<{
    item: CollectionCategory | ExpenseCategory;
    type: "collection" | "expense";
  } | null>(null);
  const [isDeletingCat, setIsDeletingCat] = useState(false);

  const defaultFormConfig: CollectionFormConfig = {
    enableFamily: true,
    requireFamily: true,
    enableMember: true,
    requireMember: false,
    enableAmount: true,
    requireAmount: true,
    enablePaymentMethod: true,
    enableDate: true,
    enableNotes: true,
    enableAttachment: false
  };

  // Add modal form config state
  const [catFormConfig, setCatFormConfig] = useState<CollectionFormConfig>(defaultFormConfig);

  // Edit modal form config state
  const [editCatFormConfig, setEditCatFormConfig] = useState<CollectionFormConfig>(defaultFormConfig);

  // Payment Method Add Modal State
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [methodCode, setMethodCode] = useState("");
  const [methodType, setMethodType] = useState("BANK_TRANSFER");
  const [methodIsActive, setMethodIsActive] = useState(true);
  const [methodRequiresRef, setMethodRequiresRef] = useState(false);
  const [methodRequiresCheque, setMethodRequiresCheque] = useState(false);
  const [methodRequiresBank, setMethodRequiresBank] = useState(false);
  const [isSavingMethod, setIsSavingMethod] = useState(false);

  // Payment Method Edit & Delete State
  const [editMethodTarget, setEditMethodTarget] = useState<FinancePaymentMethod | null>(null);
  const [editMethodName, setEditMethodName] = useState("");
  const [editMethodCode, setEditMethodCode] = useState("");
  const [editMethodType, setEditMethodType] = useState("BANK_TRANSFER");
  const [editMethodIsActive, setEditMethodIsActive] = useState(true);
  const [editMethodRequiresRef, setEditMethodRequiresRef] = useState(false);
  const [editMethodRequiresCheque, setEditMethodRequiresCheque] = useState(false);
  const [editMethodRequiresBank, setEditMethodRequiresBank] = useState(false);
  const [isSavingEditMethod, setIsSavingEditMethod] = useState(false);

  const [deleteMethodTarget, setDeleteMethodTarget] = useState<FinancePaymentMethod | null>(null);
  const [isDeletingMethod, setIsDeletingMethod] = useState(false);

  // ---------------------------------------------------------------------------
  // General Handlers
  // ---------------------------------------------------------------------------
  async function handleSaveGeneral(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingGeneral(true);
    try {
      await apiClient.patch(`/tenants/${slug}/finance/settings`, {
        currency,
        receiptPrefix,
        voucherPrefix
      });
      toast({ title: "Finance settings saved", variant: "success" });
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to save settings";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSavingGeneral(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Fund / Account Handlers
  // ---------------------------------------------------------------------------
  async function handleCreateFund(e: React.FormEvent) {
    e.preventDefault();
    if (!fundName.trim()) {
      toast({ title: "Please enter fund name", variant: "destructive" });
      return;
    }

    setIsSavingFund(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/accounts`, {
        name: fundName.trim(),
        code: fundCode.trim() || undefined,
        type: fundType,
        description: fundDescription.trim() || undefined,
        openingBalance: fundOpeningBalance ? String(fundOpeningBalance) : "0"
      });
      toast({ title: "Fund / Account created successfully", variant: "success" });
      setFundModalOpen(false);
      setFundName("");
      setFundCode("");
      setFundDescription("");
      setFundOpeningBalance("");
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create fund";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSavingFund(false);
    }
  }

  function openEditFund(acc: Account) {
    setEditFundTarget(acc);
    setEditFundName(acc.name);
    setEditFundCode(acc.code || "");
    setEditFundType(acc.type || "INCOME");
    setEditFundDescription(acc.description || "");
    setEditFundOpeningBalance(acc.openingBalance ? String(acc.openingBalance) : "");
  }

  async function handleUpdateFund(e: React.FormEvent) {
    e.preventDefault();
    if (!editFundTarget || !editFundName.trim()) return;

    setIsSavingEditFund(true);
    try {
      await apiClient.patch(`/tenants/${slug}/finance/accounts/${editFundTarget.id}`, {
        name: editFundName.trim(),
        code: editFundCode.trim() || undefined,
        type: editFundType,
        description: editFundDescription.trim() || undefined,
        openingBalance: editFundOpeningBalance ? String(editFundOpeningBalance) : "0"
      });
      toast({ title: "Fund / Account updated", variant: "success" });
      setEditFundTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to update fund";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSavingEditFund(false);
    }
  }

  async function handleDeleteFund() {
    if (!deleteFundTarget) return;
    setIsDeletingFund(true);
    try {
      await apiClient.delete(`/tenants/${slug}/finance/accounts/${deleteFundTarget.id}`);
      toast({ title: "Fund / Account deleted", variant: "success" });
      setDeleteFundTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete fund";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsDeletingFund(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Bank Account Handlers
  // ---------------------------------------------------------------------------
  async function handleCreateBank(e: React.FormEvent) {
    e.preventDefault();
    if (!bankName || !accountName || !accountNumber) {
      toast({ title: "Please fill required bank details", variant: "destructive" });
      return;
    }

    setIsSavingBank(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/settings/bank-accounts`, {
        bankName,
        accountName,
        accountNumber,
        ifsc: ifscCode || undefined,
        branch: branch || undefined
      });
      toast({ title: "Bank account added", variant: "success" });
      setBankModalOpen(false);
      setBankName("");
      setAccountName("");
      setAccountNumber("");
      setIfscCode("");
      setBranch("");
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to add bank account";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSavingBank(false);
    }
  }

  function openEditBank(b: FinanceBankAccount) {
    setEditBankTarget(b);
    setEditBankName(b.bankName);
    setEditAccountName(b.accountName);
    setEditAccountNumber("");
    setEditIfscCode(b.ifsc || "");
    setEditBranch(b.branch || "");
  }

  async function handleUpdateBank(e: React.FormEvent) {
    e.preventDefault();
    if (!editBankTarget) return;
    if (!editBankName || !editAccountName) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    setIsSavingEditBank(true);
    try {
      const payload: Record<string, any> = {
        bankName: editBankName,
        accountName: editAccountName,
        ifsc: editIfscCode || undefined,
        branch: editBranch || undefined
      };
      if (editAccountNumber.trim()) {
        payload.accountNumber = editAccountNumber.trim();
      }

      await apiClient.patch(`/tenants/${slug}/finance/settings/bank-accounts/${editBankTarget.id}`, payload);
      toast({ title: "Bank account updated", variant: "success" });
      setEditBankTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to update bank account";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSavingEditBank(false);
    }
  }

  async function handleDeleteBank() {
    if (!deleteBankTarget) return;
    setIsDeletingBank(true);
    try {
      await apiClient.delete(`/tenants/${slug}/finance/settings/bank-accounts/${deleteBankTarget.id}`);
      toast({ title: "Bank account deleted", variant: "success" });
      setDeleteBankTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete bank account";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsDeletingBank(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Category Handlers
  // ---------------------------------------------------------------------------
  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catName.trim()) {
      toast({ title: "Please enter category name", variant: "destructive" });
      return;
    }

    setIsSavingCat(true);
    try {
      if (catType === "collection") {
        await apiClient.post(`/tenants/${slug}/finance/settings/collection-categories`, {
          name: catName.trim(),
          code: catCode.trim() || undefined,
          incomeAccountId: catAccountId || undefined,
          targetType: catTargetType,
          isRecurring: catIsRecurring,
          isSubscription: catIsSubscription,
          recurrenceFrequency: catIsRecurring ? catRecurrenceFrequency : undefined,
          targetEconomicCategory: catTargetType === "CATEGORY_BASED" ? catEconomicCategory : undefined,
          targetDivisionIds: catTargetType === "SPECIFIC_DIVISIONS" ? catTargetDivisions : undefined,
          defaultAmount: catDefaultAmount ? Number(catDefaultAmount) : undefined,
          targetAmount: catTargetAmount ? Number(catTargetAmount) : undefined,
          formConfig: catFormConfig
        });
      } else {
        await apiClient.post(`/tenants/${slug}/finance/settings/expense-categories`, {
          name: catName.trim(),
          code: catCode.trim() || undefined,
          expenseAccountId: catAccountId || undefined
        });
      }
      toast({ title: `${catType === "collection" ? "Collection" : "Expense"} category added`, variant: "success" });
      setCatModalOpen(false);
      setCatName("");
      setCatCode("");
      setCatAccountId("");
      setCatTargetType("ALL_FAMILIES");
      setCatIsRecurring(false);
      setCatIsSubscription(false);
      setCatRecurrenceFrequency("MONTHLY");
      setCatEconomicCategory("ALL");
      setCatTargetDivisions([]);
      setCatDefaultAmount("");
      setCatTargetAmount("");
      setCatFormConfig(defaultFormConfig);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to add category";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSavingCat(false);
    }
  }

  function openEditCategory(item: CollectionCategory | ExpenseCategory, type: "collection" | "expense") {
    setEditCatTarget({ item, type });
    setEditCatName(item.name);
    setEditCatCode(item.code || "");
    if (type === "collection") {
      const col = item as CollectionCategory;
      setEditCatAccountId(col.incomeAccountId || "");
      setEditCatTargetType(col.targetType || "ALL_FAMILIES");
      setEditCatIsRecurring(Boolean(col.isRecurring));
      setEditCatIsSubscription(Boolean(col.isSubscription));
      setEditCatRecurrenceFrequency((col.recurrenceFrequency as any) || "MONTHLY");
      setEditCatEconomicCategory(col.targetEconomicCategory || "ALL");
      setEditCatTargetDivisions(col.targetDivisionIds || []);
      setEditCatDefaultAmount(col.defaultAmount != null ? String(col.defaultAmount) : "");
      setEditCatTargetAmount(col.targetAmount != null ? String(col.targetAmount) : "");
      setEditCatFormConfig({
        enableFamily: col.formConfig?.enableFamily ?? true,
        requireFamily: col.formConfig?.requireFamily ?? true,
        enableMember: col.formConfig?.enableMember ?? true,
        requireMember: col.formConfig?.requireMember ?? false,
        enableAmount: col.formConfig?.enableAmount ?? true,
        requireAmount: col.formConfig?.requireAmount ?? true,
        enablePaymentMethod: col.formConfig?.enablePaymentMethod ?? true,
        enableDate: col.formConfig?.enableDate ?? true,
        enableNotes: col.formConfig?.enableNotes ?? true,
        enableAttachment: col.formConfig?.enableAttachment ?? false
      });
    } else {
      const exp = item as ExpenseCategory;
      setEditCatAccountId(exp.expenseAccountId || "");
    }
  }

  async function handleUpdateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editCatTarget) return;
    if (!editCatName.trim()) {
      toast({ title: "Please enter category name", variant: "destructive" });
      return;
    }

    setIsSavingEditCat(true);
    try {
      if (editCatTarget.type === "collection") {
        await apiClient.patch(`/tenants/${slug}/finance/settings/collection-categories/${editCatTarget.item.id}`, {
          name: editCatName.trim(),
          code: editCatCode.trim() || undefined,
          incomeAccountId: editCatAccountId || null,
          targetType: editCatTargetType,
          isRecurring: editCatIsRecurring,
          isSubscription: editCatIsSubscription,
          recurrenceFrequency: editCatIsRecurring ? editCatRecurrenceFrequency : undefined,
          targetEconomicCategory: editCatTargetType === "CATEGORY_BASED" ? editCatEconomicCategory : undefined,
          targetDivisionIds: editCatTargetType === "SPECIFIC_DIVISIONS" ? editCatTargetDivisions : undefined,
          defaultAmount: editCatDefaultAmount ? Number(editCatDefaultAmount) : null,
          targetAmount: editCatTargetAmount ? Number(editCatTargetAmount) : null,
          formConfig: editCatFormConfig
        });
      } else {
        await apiClient.patch(`/tenants/${slug}/finance/settings/expense-categories/${editCatTarget.item.id}`, {
          name: editCatName.trim(),
          code: editCatCode.trim() || undefined,
          expenseAccountId: editCatAccountId || null
        });
      }
      toast({
        title: `${editCatTarget.type === "collection" ? "Collection" : "Expense"} category updated`,
        variant: "success"
      });
      setEditCatTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to update category";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSavingEditCat(false);
    }
  }

  async function handleDeleteCategory() {
    if (!deleteCatTarget) return;
    setIsDeletingCat(true);
    try {
      const endpoint = deleteCatTarget.type === "collection" ? "collection-categories" : "expense-categories";
      await apiClient.delete(`/tenants/${slug}/finance/settings/${endpoint}/${deleteCatTarget.item.id}`);
      toast({
        title: `${deleteCatTarget.type === "collection" ? "Collection" : "Expense"} category deleted`,
        variant: "success"
      });
      setDeleteCatTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete category";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsDeletingCat(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Payment Method Handlers
  // ---------------------------------------------------------------------------
  async function handleCreatePaymentMethod(e: React.FormEvent) {
    e.preventDefault();
    if (!methodName || !methodCode) {
      toast({ title: "Please enter method name and code", variant: "destructive" });
      return;
    }

    setIsSavingMethod(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/settings/payment-methods`, {
        name: methodName,
        code: methodCode,
        type: methodType,
        isActive: methodIsActive,
        requiresReference: methodRequiresRef,
        requiresChequeNumber: methodRequiresCheque,
        requiresBankDetails: methodRequiresBank
      });
      toast({ title: "Payment method added", variant: "success" });
      setMethodModalOpen(false);
      setMethodName("");
      setMethodCode("");
      setMethodType("BANK_TRANSFER");
      setMethodIsActive(true);
      setMethodRequiresRef(false);
      setMethodRequiresCheque(false);
      setMethodRequiresBank(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to add payment method";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSavingMethod(false);
    }
  }

  function openEditPaymentMethod(pm: FinancePaymentMethod) {
    setEditMethodTarget(pm);
    setEditMethodName(pm.name);
    setEditMethodCode(pm.code);
    setEditMethodType(pm.type);
    setEditMethodIsActive(pm.isActive);
    setEditMethodRequiresRef(pm.requiresReference);
    setEditMethodRequiresCheque(pm.requiresChequeNumber);
    setEditMethodRequiresBank(pm.requiresBankDetails);
  }

  async function handleUpdatePaymentMethod(e: React.FormEvent) {
    e.preventDefault();
    if (!editMethodTarget) return;
    if (!editMethodName || !editMethodCode) {
      toast({ title: "Please enter method name and code", variant: "destructive" });
      return;
    }

    setIsSavingEditMethod(true);
    try {
      await apiClient.patch(`/tenants/${slug}/finance/settings/payment-methods/${editMethodTarget.id}`, {
        name: editMethodName,
        code: editMethodCode,
        type: editMethodType,
        isActive: editMethodIsActive,
        requiresReference: editMethodRequiresRef,
        requiresChequeNumber: editMethodRequiresCheque,
        requiresBankDetails: editMethodRequiresBank
      });
      toast({ title: "Payment method updated", variant: "success" });
      setEditMethodTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to update payment method";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSavingEditMethod(false);
    }
  }

  async function handleDeletePaymentMethod() {
    if (!deleteMethodTarget) return;
    setIsDeletingMethod(true);
    try {
      await apiClient.delete(`/tenants/${slug}/finance/settings/payment-methods/${deleteMethodTarget.id}`);
      toast({ title: "Payment method deactivated", variant: "success" });
      setDeleteMethodTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to remove payment method";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsDeletingMethod(false);
    }
  }

  return (
    <div className="space-y-6">
      <Tabs
        variant="underline"
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        tabs={[
          { id: "funds", label: "Funds & Accounts", icon: <Wallet className="h-4 w-4" />, count: accounts.length },
          {
            id: "categories",
            label: "Categories & Heads",
            icon: <Layers className="h-4 w-4" />,
            count: collectionCategories.length + expenseCategories.length
          },
          { id: "banks", label: "Bank accounts", icon: <Building2 className="h-4 w-4" />, count: bankAccounts.length },
          { id: "methods", label: "Payment methods", icon: <CreditCard className="h-4 w-4" />, count: paymentMethods.length },
          { id: "general", label: "Numbering", icon: <Settings className="h-4 w-4" /> }
        ]}
      />

      {/* Funds & Accounts Tab */}
      {activeTab === "funds" && (
        <div className="space-y-6">
          {/* Header Banner & Distinction Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950 dark:text-blue-200">
                  Mahallu Operational Funds & Accounts
                </h3>
                <p className="text-xs text-blue-800/80 dark:text-blue-300/80 mt-0.5 leading-relaxed">
                  Create and manage your Mahal funds (e.g. General Fund, Building Fund, Zakat Fund, Madrasa Fund) before creating collection or expense categories.
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-blue-700 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/40 px-2.5 py-1 rounded-lg w-fit">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    <strong>Note:</strong> These are operational funds for inflows and outflows. Double-entry general ledgers are managed in the Chart of Accounts under Accountant.
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setFundType("INCOME");
                setFundModalOpen(true);
              }}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shrink-0 self-start md:self-center"
            >
              <Plus className="h-4 w-4" />
              Add Fund / Account
            </Button>
          </div>

          {/* Table of Funds */}
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">Configured Funds & Accounts ({accounts.length})</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Parent funds and financial accounts available for category grouping and transactions.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund / Account Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Linked Categories</TableHead>
                    <TableHead>Opening Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((acc) => {
                    const linkedCols = collectionCategories.filter((c) => c.incomeAccountId === acc.id);
                    const linkedExps = expenseCategories.filter((c) => c.expenseAccountId === acc.id);
                    const totalLinked = linkedCols.length + linkedExps.length;

                    return (
                      <TableRow key={acc.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-foreground">{acc.name}</span>
                            {acc.description && (
                              <span className="text-[11px] text-muted-foreground line-clamp-1">{acc.description}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{acc.code || "—"}</TableCell>
                        <TableCell className="text-xs">
                          <Badge
                            variant={acc.type === "INCOME" ? "success" : acc.type === "EXPENSE" ? "destructive" : "secondary"}
                            className="text-[10px] uppercase font-bold"
                          >
                            {acc.type === "INCOME" ? "Income / Inflow Fund" : acc.type === "EXPENSE" ? "Expense Account" : acc.type || "Fund"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {totalLinked > 0 ? (
                            <span className="inline-flex items-center gap-1 font-medium text-primary">
                              <Layers className="h-3 w-3" />
                              {totalLinked} {totalLinked === 1 ? "category" : "categories"}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-mono font-medium">
                          {acc.openingBalance ? `₹${Number(acc.openingBalance).toLocaleString("en-IN")}` : "₹0.00"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                              onClick={() => openEditFund(acc)}
                              title="Edit fund"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteFundTarget(acc)}
                              title="Delete fund"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {accounts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                        No funds or accounts configured yet. Click &quot;Add Fund / Account&quot; to create your first fund.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="max-w-5xl">
          <SettingsSection
            title="Currency & numbering"
            description="The currency used across finance records, and the prefixes placed before receipt and voucher numbers."
            footer={
              <Button type="submit" size="sm" isLoading={isSavingGeneral}>
                Save changes
              </Button>
            }
          >
            <SettingsRow label="Currency" description="ISO currency code, e.g. INR." htmlFor="finance-currency">
              <Input
                id="finance-currency"
                className="font-mono md:max-w-[160px]"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
            </SettingsRow>
            <SettingsRow label="Receipt prefix" description="Placed before every collection receipt number." htmlFor="finance-receipt-prefix">
              <Input
                id="finance-receipt-prefix"
                className="font-mono md:max-w-[200px]"
                value={receiptPrefix}
                onChange={(e) => setReceiptPrefix(e.target.value)}
                required
              />
            </SettingsRow>
            <SettingsRow label="Voucher prefix" description="Placed before every payment voucher number." htmlFor="finance-voucher-prefix">
              <Input
                id="finance-voucher-prefix"
                className="font-mono md:max-w-[200px]"
                value={voucherPrefix}
                onChange={(e) => setVoucherPrefix(e.target.value)}
                required
              />
            </SettingsRow>
          </SettingsSection>
        </form>
      )}

      {/* Banks Tab */}
      {activeTab === "banks" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setBankModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              <Plus className="h-4 w-4" />
              Add Bank Account
            </Button>
          </div>

          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>IFSC Code</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankAccounts.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-semibold text-xs">{b.bankName}</TableCell>
                      <TableCell className="text-xs">{b.accountName}</TableCell>
                      <TableCell className="text-xs font-mono">{b.accountNumber}</TableCell>
                      <TableCell className="text-xs font-mono">{b.ifsc || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{b.branch || "—"}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="text-[10px]">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                            onClick={() => openEditBank(b)}
                            title="Edit bank account"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteBankTarget(b)}
                            title="Delete bank account"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bankAccounts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-xs text-muted-foreground">
                        No bank accounts configured yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setCatType("collection");
                setCatModalOpen(true);
              }}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              <Plus className="h-4 w-4" />
              Add Collection Category
            </Button>
            <Button
              onClick={() => {
                setCatType("expense");
                setCatModalOpen(true);
              }}
              variant="outline"
              className="gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              Add Expense Category
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Collection Categories */}
            <Card className="rounded-2xl border border-border/80 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Collection Heads ({collectionCategories.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {collectionCategories.map((c) => (
                  <div key={c.id} className="group flex items-start justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-xs border border-transparent hover:border-border/60">
                    <div className="space-y-1.5 min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground text-sm">{c.name}</span>
                        {c.code && (
                          <span className="font-mono text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/60">
                            {c.code}
                          </span>
                        )}
                        {(c.incomeAccount?.name || (c.incomeAccountId && accounts.find(a => a.id === c.incomeAccountId)?.name)) && (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-300">
                            Fund: {c.incomeAccount?.name || accounts.find(a => a.id === c.incomeAccountId)?.name}
                          </Badge>
                        )}
                        {c.isRecurring && (
                          <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 gap-1">
                            <RefreshCw className="h-2.5 w-2.5" />
                            {c.recurrenceFrequency || "MONTHLY"}
                          </Badge>
                        )}
                        {c.isSubscription && (
                          <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200">
                            Subscription
                          </Badge>
                        )}
                        {c.defaultAmount != null && Number(c.defaultAmount) > 0 && (
                          <Badge variant="outline" className="text-[10px] font-mono font-medium text-foreground">
                            ₹{Number(c.defaultAmount).toLocaleString("en-IN")}
                          </Badge>
                        )}
                        {c.targetAmount != null && Number(c.targetAmount) > 0 && (
                          <Badge variant="outline" className="text-[10px] font-mono font-medium text-muted-foreground">
                            Target: ₹{Number(c.targetAmount).toLocaleString("en-IN")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                        {c.targetType === "GENERAL" ? (
                          <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium">
                            <Globe className="h-3 w-3" /> General / Open (Donations / Hundi)
                          </span>
                        ) : c.targetType === "SPECIFIC_DIVISIONS" ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                            <MapPin className="h-3 w-3" /> Specific Divisions ({c.targetDivisionIds?.length || 0})
                          </span>
                        ) : c.targetType === "CATEGORY_BASED" ? (
                          <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                            <Tag className="h-3 w-3" /> Economic Category: {c.targetEconomicCategory || "All"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                            <Users className="h-3 w-3" /> All Families
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                        onClick={() => openEditCategory(c, "collection")}
                        title="Edit category"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteCatTarget({ item: c, type: "collection" })}
                        title="Delete category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {collectionCategories.length === 0 && (
                  <p className="text-center py-4 text-xs text-muted-foreground">No collection categories configured.</p>
                )}
              </CardContent>
            </Card>

            {/* Expense Categories */}
            <Card className="rounded-2xl border border-border/80 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Expense Heads ({expenseCategories.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {expenseCategories.map((c) => (
                  <div key={c.id} className="group flex items-center justify-between p-2.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{c.name}</span>
                      {c.code && <span className="font-mono text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/60">{c.code}</span>}
                      {(c.expenseAccount?.name || (c.expenseAccountId && accounts.find(a => a.id === c.expenseAccountId)?.name)) && (
                        <span className="text-[11px] text-muted-foreground">
                          • Account: {c.expenseAccount?.name || accounts.find(a => a.id === c.expenseAccountId)?.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                        onClick={() => openEditCategory(c, "expense")}
                        title="Edit category"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteCatTarget({ item: c, type: "expense" })}
                        title="Delete category"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {expenseCategories.length === 0 && (
                  <p className="text-center py-4 text-xs text-muted-foreground">No expense categories configured.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Methods Tab */}
      {activeTab === "methods" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setMethodModalOpen(true)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </div>

          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Configured Payment Methods ({paymentMethods.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="group flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="font-semibold text-foreground">{pm.name}</span>
                      <span className="text-muted-foreground ml-2 font-mono text-[11px]">({pm.code})</span>
                      <span className="text-muted-foreground ml-2 text-[11px]">[{pm.type}]</span>
                    </div>
                    <Badge variant={pm.isActive ? "secondary" : "outline"} className="text-[10px]">
                      {pm.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                      onClick={() => openEditPaymentMethod(pm)}
                      title="Edit payment method"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {pm.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteMethodTarget(pm)}
                        title="Deactivate payment method"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {paymentMethods.length === 0 && (
                <p className="text-center py-6 text-xs text-muted-foreground">No payment methods configured.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Bank Modal */}
      <Dialog open={bankModalOpen} onOpenChange={setBankModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBank} className="space-y-4 pt-2">
            <FormField label="Bank Name" required>
              <Input
                placeholder="e.g. State Bank of India"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Account Title" required>
              <Input
                placeholder="e.g. Mahallu Jama-ath General Fund"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Account Number" required>
              <Input
                placeholder="Account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="IFSC Code">
                <Input
                  placeholder="e.g. SBIN0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              </FormField>

              <FormField label="Branch">
                <Input
                  placeholder="e.g. Wayanad Main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </FormField>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setBankModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingBank} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSavingBank ? "Adding..." : "Add Bank Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Bank Modal */}
      <Dialog open={editBankTarget !== null} onOpenChange={(open) => !open && setEditBankTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Edit Bank Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBank} className="space-y-4 pt-2">
            <FormField label="Bank Name" required>
              <Input
                value={editBankName}
                onChange={(e) => setEditBankName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Account Title" required>
              <Input
                value={editAccountName}
                onChange={(e) => setEditAccountName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Account Number (Leave blank to keep current)">
              <Input
                placeholder={editBankTarget?.accountNumber || "Leave blank to keep existing"}
                value={editAccountNumber}
                onChange={(e) => setEditAccountNumber(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="IFSC Code">
                <Input
                  value={editIfscCode}
                  onChange={(e) => setEditIfscCode(e.target.value)}
                />
              </FormField>

              <FormField label="Branch">
                <Input
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                />
              </FormField>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditBankTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingEditBank} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSavingEditBank ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Bank ConfirmDialog */}
      <ConfirmDialog
        open={deleteBankTarget !== null}
        onOpenChange={(open) => !open && setDeleteBankTarget(null)}
        title="Delete Bank Account?"
        description={`Are you sure you want to delete ${deleteBankTarget?.bankName} (${deleteBankTarget?.accountName})? This bank account will be deactivated.`}
        confirmLabel="Delete"
        destructive
        isConfirming={isDeletingBank}
        onConfirm={handleDeleteBank}
      />

      {/* Add Category Modal */}
      <Dialog open={catModalOpen} onOpenChange={setCatModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add {catType === "collection" ? "Collection" : "Expense"} Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCategory} className="space-y-4 pt-2">
            <FormField label="Category Name" required>
              <Input
                placeholder={catType === "collection" ? "e.g. Monthly Varisa, Juma Collection" : "e.g. Electricity, Maintenance"}
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
              />
            </FormField>

            <FormField label={catType === "collection" ? "Parent Fund Category" : "Parent Expense Account"}>
              <Select
                value={catAccountId}
                onChange={(e) => setCatAccountId(e.target.value)}
              >
                <option value="">Select Account / Fund (Optional)...</option>
                {(catType === "collection" ? incomeAccounts : expenseAccounts).map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} {acc.code ? `(${acc.code})` : ""}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Category Code (Optional)">
              <Input
                placeholder="e.g. VARISA, JUMA, BLDG"
                value={catCode}
                onChange={(e) => setCatCode(e.target.value)}
              />
            </FormField>

            {catType === "collection" && (
              <>
                <div className="border-t border-border/60 pt-3 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Collection Settings & Rules
                  </h4>

                  <FormField label="Target Scope">
                    <Select
                      value={catTargetType}
                      onChange={(e) => setCatTargetType(e.target.value as any)}
                    >
                      <option value="ALL_FAMILIES">All Mahallu Families</option>
                      <option value="SPECIFIC_DIVISIONS">Specific Divisions / Wards</option>
                      <option value="CATEGORY_BASED">Economic Category (BPL / APL)</option>
                      <option value="GENERAL">General / Open (Public Donation, Friday Juma, Hundi)</option>
                    </Select>
                  </FormField>

                  {catTargetType === "SPECIFIC_DIVISIONS" && (
                    <div className="space-y-2 p-3 bg-muted/20 rounded-xl border border-border/60">
                      <label className="text-xs font-medium text-foreground">Select Applicable Divisions/Wards</label>
                      <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                        {divisions.map((d) => {
                          const checked = catTargetDivisions.includes(d.id);
                          return (
                            <label key={d.id} className="flex items-center gap-2 text-xs cursor-pointer p-1.5 rounded hover:bg-muted/50">
                              <Checkbox
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCatTargetDivisions([...catTargetDivisions, d.id]);
                                  } else {
                                    setCatTargetDivisions(catTargetDivisions.filter((id) => id !== d.id));
                                  }
                                }}
                              />
                              <span className="truncate">{d.name} {d.code ? `(${d.code})` : ""}</span>
                            </label>
                          );
                        })}
                        {divisions.length === 0 && (
                          <p className="col-span-2 text-xs text-muted-foreground italic">No divisions found.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {catTargetType === "CATEGORY_BASED" && (
                    <FormField label="Eligible Economic Category">
                      <Select
                        value={catEconomicCategory}
                        onChange={(e) => setCatEconomicCategory(e.target.value)}
                      >
                        <option value="BPL">BPL (Below Poverty Line) Only</option>
                        <option value="APL">APL (Above Poverty Line) Only</option>
                        <option value="ALL">All Categories</option>
                      </Select>
                    </FormField>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Default Amount (₹)">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 200"
                        value={catDefaultAmount}
                        onChange={(e) => setCatDefaultAmount(e.target.value)}
                      />
                    </FormField>

                    <FormField label="Collection Target (₹)">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 50000"
                        value={catTargetAmount}
                        onChange={(e) => setCatTargetAmount(e.target.value)}
                      />
                    </FormField>

                    {catIsRecurring && (
                      <FormField label="Frequency">
                        <Select
                          value={catRecurrenceFrequency}
                          onChange={(e) => setCatRecurrenceFrequency(e.target.value as any)}
                        >
                          <option value="MONTHLY">Monthly</option>
                          <option value="ANNUAL">Annual</option>
                          <option value="ONE_TIME">One Time</option>
                        </Select>
                      </FormField>
                    )}
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <Checkbox
                        checked={catIsRecurring}
                        onChange={(e) => setCatIsRecurring(e.target.checked)}
                      />
                      <span className="font-medium text-foreground">
                        Recurring Collection (e.g. Monthly Varisa)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <Checkbox
                        checked={catIsSubscription}
                        onChange={(e) => setCatIsSubscription(e.target.checked)}
                      />
                      <span className="font-medium text-foreground">
                        Subscription-based (assign to specific families/members)
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {catType === "collection" && (
              <div className="border-t border-border/60 pt-3 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Form Field Configuration
                </h4>
                <p className="text-[11px] text-muted-foreground">Configure which fields appear in the collection recording form.</p>
                <div className="space-y-2">
                  <FormConfigRow
                    label="Family Selection"
                    enabled={catFormConfig.enableFamily ?? true}
                    required={catFormConfig.requireFamily ?? false}
                    onEnabledChange={(v) => setCatFormConfig(prev => ({ ...prev, enableFamily: v }))}
                    onRequiredChange={(v) => setCatFormConfig(prev => ({ ...prev, requireFamily: v }))}
                  />
                  <FormConfigRow
                    label="Member Selection"
                    enabled={catFormConfig.enableMember ?? true}
                    required={catFormConfig.requireMember ?? false}
                    onEnabledChange={(v) => setCatFormConfig(prev => ({ ...prev, enableMember: v }))}
                    onRequiredChange={(v) => setCatFormConfig(prev => ({ ...prev, requireMember: v }))}
                  />
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <span className="text-xs font-medium text-foreground">Notes / Description</span>
                    <label className="flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={catFormConfig.enableNotes ?? true}
                        onChange={(e) => setCatFormConfig(prev => ({ ...prev, enableNotes: e.target.checked }))}
                      />
                      <span className="text-muted-foreground">Enable</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <span className="text-xs font-medium text-foreground">Attachment / Receipt Upload</span>
                    <label className="flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={catFormConfig.enableAttachment ?? false}
                        onChange={(e) => setCatFormConfig(prev => ({ ...prev, enableAttachment: e.target.checked }))}
                      />
                      <span className="text-muted-foreground">Enable</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <Button type="button" variant="outline" onClick={() => setCatModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingCat} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSavingCat ? "Saving..." : "Save Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={editCatTarget !== null} onOpenChange={(open) => !open && setEditCatTarget(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {editCatTarget?.type === "collection" ? "Collection" : "Expense"} Category
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCategory} className="space-y-4 pt-2">
            <FormField label="Category Name" required>
              <Input
                value={editCatName}
                onChange={(e) => setEditCatName(e.target.value)}
                required
              />
            </FormField>

            <FormField label={editCatTarget?.type === "collection" ? "Parent Fund Category" : "Parent Expense Account"}>
              <Select
                value={editCatAccountId}
                onChange={(e) => setEditCatAccountId(e.target.value)}
              >
                <option value="">Select Account / Fund (Optional)...</option>
                {(editCatTarget?.type === "collection" ? incomeAccounts : expenseAccounts).map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} {acc.code ? `(${acc.code})` : ""}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Category Code (Optional)">
              <Input
                value={editCatCode}
                onChange={(e) => setEditCatCode(e.target.value)}
              />
            </FormField>

            {editCatTarget?.type === "collection" && (
              <>
                <div className="border-t border-border/60 pt-3 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Collection Settings & Rules
                  </h4>

                  <FormField label="Target Scope">
                    <Select
                      value={editCatTargetType}
                      onChange={(e) => setEditCatTargetType(e.target.value as any)}
                    >
                      <option value="ALL_FAMILIES">All Mahallu Families</option>
                      <option value="SPECIFIC_DIVISIONS">Specific Divisions / Wards</option>
                      <option value="CATEGORY_BASED">Economic Category (BPL / APL)</option>
                      <option value="GENERAL">General / Open (Public Donation, Friday Juma, Hundi)</option>
                    </Select>
                  </FormField>

                  {editCatTargetType === "SPECIFIC_DIVISIONS" && (
                    <div className="space-y-2 p-3 bg-muted/20 rounded-xl border border-border/60">
                      <label className="text-xs font-medium text-foreground">Select Applicable Divisions/Wards</label>
                      <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                        {divisions.map((d) => {
                          const checked = editCatTargetDivisions.includes(d.id);
                          return (
                            <label key={d.id} className="flex items-center gap-2 text-xs cursor-pointer p-1.5 rounded hover:bg-muted/50">
                              <Checkbox
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditCatTargetDivisions([...editCatTargetDivisions, d.id]);
                                  } else {
                                    setEditCatTargetDivisions(editCatTargetDivisions.filter((id) => id !== d.id));
                                  }
                                }}
                              />
                              <span className="truncate">{d.name} {d.code ? `(${d.code})` : ""}</span>
                            </label>
                          );
                        })}
                        {divisions.length === 0 && (
                          <p className="col-span-2 text-xs text-muted-foreground italic">No divisions found.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {editCatTargetType === "CATEGORY_BASED" && (
                    <FormField label="Eligible Economic Category">
                      <Select
                        value={editCatEconomicCategory}
                        onChange={(e) => setEditCatEconomicCategory(e.target.value)}
                      >
                        <option value="BPL">BPL (Below Poverty Line) Only</option>
                        <option value="APL">APL (Above Poverty Line) Only</option>
                        <option value="ALL">All Categories</option>
                      </Select>
                    </FormField>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Default Amount (₹)">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 200"
                        value={editCatDefaultAmount}
                        onChange={(e) => setEditCatDefaultAmount(e.target.value)}
                      />
                    </FormField>

                    <FormField label="Collection Target (₹)">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 50000"
                        value={editCatTargetAmount}
                        onChange={(e) => setEditCatTargetAmount(e.target.value)}
                      />
                    </FormField>

                    {editCatIsRecurring && (
                      <FormField label="Frequency">
                        <Select
                          value={editCatRecurrenceFrequency}
                          onChange={(e) => setEditCatRecurrenceFrequency(e.target.value as any)}
                        >
                          <option value="MONTHLY">Monthly</option>
                          <option value="ANNUAL">Annual</option>
                          <option value="ONE_TIME">One Time</option>
                        </Select>
                      </FormField>
                    )}
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <Checkbox
                        checked={editCatIsRecurring}
                        onChange={(e) => setEditCatIsRecurring(e.target.checked)}
                      />
                      <span className="font-medium text-foreground">
                        Recurring Collection (e.g. Monthly Varisa)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <Checkbox
                        checked={editCatIsSubscription}
                        onChange={(e) => setEditCatIsSubscription(e.target.checked)}
                      />
                      <span className="font-medium text-foreground">
                        Subscription-based (assign to specific families/members)
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {editCatTarget?.type === "collection" && (
              <div className="border-t border-border/60 pt-3 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Form Field Configuration
                </h4>
                <p className="text-[11px] text-muted-foreground">Configure which fields appear in the collection recording form.</p>
                <div className="space-y-2">
                  <FormConfigRow
                    label="Family Selection"
                    enabled={editCatFormConfig.enableFamily ?? true}
                    required={editCatFormConfig.requireFamily ?? false}
                    onEnabledChange={(v) => setEditCatFormConfig(prev => ({ ...prev, enableFamily: v }))}
                    onRequiredChange={(v) => setEditCatFormConfig(prev => ({ ...prev, requireFamily: v }))}
                  />
                  <FormConfigRow
                    label="Member Selection"
                    enabled={editCatFormConfig.enableMember ?? true}
                    required={editCatFormConfig.requireMember ?? false}
                    onEnabledChange={(v) => setEditCatFormConfig(prev => ({ ...prev, enableMember: v }))}
                    onRequiredChange={(v) => setEditCatFormConfig(prev => ({ ...prev, requireMember: v }))}
                  />
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <span className="text-xs font-medium text-foreground">Notes / Description</span>
                    <label className="flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={editCatFormConfig.enableNotes ?? true}
                        onChange={(e) => setEditCatFormConfig(prev => ({ ...prev, enableNotes: e.target.checked }))}
                      />
                      <span className="text-muted-foreground">Enable</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <span className="text-xs font-medium text-foreground">Attachment / Receipt Upload</span>
                    <label className="flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={editCatFormConfig.enableAttachment ?? false}
                        onChange={(e) => setEditCatFormConfig(prev => ({ ...prev, enableAttachment: e.target.checked }))}
                      />
                      <span className="text-muted-foreground">Enable</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <Button type="button" variant="outline" onClick={() => setEditCatTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingEditCat} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSavingEditCat ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Category ConfirmDialog */}
      <ConfirmDialog
        open={deleteCatTarget !== null}
        onOpenChange={(open) => !open && setDeleteCatTarget(null)}
        title={`Delete ${deleteCatTarget?.type === "collection" ? "Collection" : "Expense"} Category?`}
        description={`Are you sure you want to delete category "${deleteCatTarget?.item.name}"?`}
        confirmLabel="Delete"
        destructive
        isConfirming={isDeletingCat}
        onConfirm={handleDeleteCategory}
      />

      {/* Add Payment Method Modal */}
      <Dialog open={methodModalOpen} onOpenChange={setMethodModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePaymentMethod} className="space-y-4 pt-2">
            <FormField label="Method Name" required>
              <Input
                placeholder="e.g. Google Pay / UPI"
                value={methodName}
                onChange={(e) => setMethodName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Code" required>
                <Input
                  placeholder="e.g. UPI"
                  value={methodCode}
                  onChange={(e) => setMethodCode(e.target.value.toUpperCase())}
                  required
                />
              </FormField>

              <FormField label="Type" required>
                <Select value={methodType} onChange={(e) => setMethodType(e.target.value)}>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="ONLINE">Online Gateway</option>
                  <option value="OTHER">Other</option>
                </Select>
              </FormField>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={methodRequiresRef}
                  onChange={(e) => setMethodRequiresRef(e.target.checked)}
                />
                <span>Requires Transaction / Reference Number</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={methodRequiresCheque}
                  onChange={(e) => setMethodRequiresCheque(e.target.checked)}
                />
                <span>Requires Cheque Number</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={methodRequiresBank}
                  onChange={(e) => setMethodRequiresBank(e.target.checked)}
                />
                <span>Requires Bank Account Selection</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setMethodModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingMethod} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSavingMethod ? "Adding..." : "Add Method"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Method Modal */}
      <Dialog open={editMethodTarget !== null} onOpenChange={(open) => !open && setEditMethodTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePaymentMethod} className="space-y-4 pt-2">
            <FormField label="Method Name" required>
              <Input
                value={editMethodName}
                onChange={(e) => setEditMethodName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Code" required>
                <Input
                  value={editMethodCode}
                  onChange={(e) => setEditMethodCode(e.target.value.toUpperCase())}
                  required
                />
              </FormField>

              <FormField label="Type" required>
                <Select value={editMethodType} onChange={(e) => setEditMethodType(e.target.value)}>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="ONLINE">Online Gateway</option>
                  <option value="OTHER">Other</option>
                </Select>
              </FormField>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={editMethodIsActive}
                  onChange={(e) => setEditMethodIsActive(e.target.checked)}
                />
                <span className="font-medium">Active (enabled for payments)</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={editMethodRequiresRef}
                  onChange={(e) => setEditMethodRequiresRef(e.target.checked)}
                />
                <span>Requires Transaction / Reference Number</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={editMethodRequiresCheque}
                  onChange={(e) => setEditMethodRequiresCheque(e.target.checked)}
                />
                <span>Requires Cheque Number</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={editMethodRequiresBank}
                  onChange={(e) => setEditMethodRequiresBank(e.target.checked)}
                />
                <span>Requires Bank Account Selection</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditMethodTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingEditMethod} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSavingEditMethod ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete / Deactivate Payment Method ConfirmDialog */}
      <ConfirmDialog
        open={deleteMethodTarget !== null}
        onOpenChange={(open) => !open && setDeleteMethodTarget(null)}
        title="Deactivate Payment Method?"
        description={`Are you sure you want to deactivate "${deleteMethodTarget?.name}"? It will no longer appear as an active payment option.`}
        confirmLabel="Deactivate"
        destructive
        isConfirming={isDeletingMethod}
        onConfirm={handleDeletePaymentMethod}
      />

      {/* Add Fund / Account Dialog */}
      <Dialog open={fundModalOpen} onOpenChange={setFundModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="pb-3 border-b border-border/60">
            <DialogTitle className="text-base font-bold">Add Operational Fund / Account</DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create a parent fund or account before setting up its specific categories.
            </p>
          </DialogHeader>

          <form onSubmit={handleCreateFund} className="space-y-4 pt-3">
            <FormField label="Fund / Account Name" required>
              <Input
                placeholder="e.g. Building / Construction Fund, Zakat Fund, General Fund"
                value={fundName}
                onChange={(e) => setFundName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Fund Code / Abbreviation">
                <Input
                  placeholder="e.g. FUND-BLD"
                  value={fundCode}
                  onChange={(e) => setFundCode(e.target.value.toUpperCase())}
                />
              </FormField>

              <FormField label="Type" required>
                <Select value={fundType} onChange={(e) => setFundType(e.target.value as AccountType)}>
                  <option value="INCOME">Income / Fund (Collections)</option>
                  <option value="EXPENSE">Expense / Disbursement Account</option>
                  <option value="ASSET">Asset (Cash / Bank)</option>
                  <option value="LIABILITY">Liability / Dues</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Opening Balance (₹)">
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={fundOpeningBalance}
                onChange={(e) => setFundOpeningBalance(e.target.value)}
              />
            </FormField>

            <FormField label="Description / Purpose (Optional)">
              <Input
                placeholder="Brief purpose of this fund or account"
                value={fundDescription}
                onChange={(e) => setFundDescription(e.target.value)}
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setFundModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingFund} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSavingFund ? "Creating..." : "Create Fund"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Fund / Account Dialog */}
      <Dialog open={editFundTarget !== null} onOpenChange={(open) => !open && setEditFundTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="pb-3 border-b border-border/60">
            <DialogTitle className="text-base font-bold">Edit Fund / Account</DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update fund name, code, or operational classification.
            </p>
          </DialogHeader>

          <form onSubmit={handleUpdateFund} className="space-y-4 pt-3">
            <FormField label="Fund / Account Name" required>
              <Input
                placeholder="e.g. Building / Construction Fund"
                value={editFundName}
                onChange={(e) => setEditFundName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Fund Code">
                <Input
                  placeholder="e.g. FUND-BLD"
                  value={editFundCode}
                  onChange={(e) => setEditFundCode(e.target.value.toUpperCase())}
                />
              </FormField>

              <FormField label="Type" required>
                <Select value={editFundType} onChange={(e) => setEditFundType(e.target.value as AccountType)}>
                  <option value="INCOME">Income / Fund (Collections)</option>
                  <option value="EXPENSE">Expense / Disbursement Account</option>
                  <option value="ASSET">Asset (Cash / Bank)</option>
                  <option value="LIABILITY">Liability / Dues</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Opening Balance (₹)">
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={editFundOpeningBalance}
                onChange={(e) => setEditFundOpeningBalance(e.target.value)}
              />
            </FormField>

            <FormField label="Description / Purpose (Optional)">
              <Input
                placeholder="Brief purpose of this fund or account"
                value={editFundDescription}
                onChange={(e) => setEditFundDescription(e.target.value)}
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditFundTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingEditFund} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSavingEditFund ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Fund ConfirmDialog */}
      <ConfirmDialog
        open={deleteFundTarget !== null}
        onOpenChange={(open) => !open && setDeleteFundTarget(null)}
        title="Delete Fund / Account?"
        description={`Are you sure you want to delete "${deleteFundTarget?.name}"? Make sure no active collections or categories are assigned to this fund.`}
        confirmLabel="Delete Fund"
        destructive
        isConfirming={isDeletingFund}
        onConfirm={handleDeleteFund}
      />
    </div>
  );
}
