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
  FinanceFund,
  Account,
  AccountType,
  CollectionFormConfig,
  DynamicFormFieldConfig
} from "@/lib/finance";
import { DynamicFormBuilder, DEFAULT_STANDARD_FIELDS } from "@/features/finance/dynamic-form-builder";

interface Props {
  slug: string;
  settings: FinanceSettings | null;
  bankAccounts: FinanceBankAccount[];
  paymentMethods: FinancePaymentMethod[];
  collectionCategories: CollectionCategory[];
  expenseCategories: ExpenseCategory[];
  funds?: FinanceFund[];
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
  divisions = [],
  funds = []
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"funds" | "categories" | "banks" | "methods" | "general">("funds");

  const incomeAccounts = accounts.filter((a) => a.type === "INCOME" || !a.type);
  const expenseAccounts = accounts.filter((a) => a.type === "EXPENSE" || !a.type);

  // Operational Funds (FinanceFund) State
  const [operationalFunds, setOperationalFunds] = useState<FinanceFund[]>(funds);
  const [opFundModalOpen, setOpFundModalOpen] = useState(false);
  const [opFundName, setOpFundName] = useState("");
  const [opFundCode, setOpFundCode] = useState("");
  const [opFundDescription, setOpFundDescription] = useState("");
  const [opFundColor, setOpFundColor] = useState("#059669");
  const [opFundIsDefault, setOpFundIsDefault] = useState(false);
  const [isSavingOpFund, setIsSavingOpFund] = useState(false);

  const [editOpFundTarget, setEditOpFundTarget] = useState<FinanceFund | null>(null);
  const [editOpFundName, setEditOpFundName] = useState("");
  const [editOpFundCode, setEditOpFundCode] = useState("");
  const [editOpFundDescription, setEditOpFundDescription] = useState("");
  const [editOpFundColor, setEditOpFundColor] = useState("#059669");
  const [editOpFundIsDefault, setEditOpFundIsDefault] = useState(false);
  const [isSavingEditOpFund, setIsSavingEditOpFund] = useState(false);

  const [deleteOpFundTarget, setDeleteOpFundTarget] = useState<FinanceFund | null>(null);
  const [isDeletingOpFund, setIsDeletingOpFund] = useState(false);

  // Chart of Accounts Fund / Account Management State
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

  // Category Filter in Categories Tab
  const [categoryFundFilter, setCategoryFundFilter] = useState("ALL");

  // Category Add Modal State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catType, setCatType] = useState<"collection" | "expense">("collection");
  const [catFundId, setCatFundId] = useState("");
  const [catAccountId, setCatAccountId] = useState("");
  const [catName, setCatName] = useState("");
  const [catCode, setCatCode] = useState("");
  const [catTargetType, setCatTargetType] = useState<string>("FAMILY_BASED");
  const [catIsRecurring, setCatIsRecurring] = useState(false);
  const [catIsSubscription, setCatIsSubscription] = useState(false);
  const [catRecurrenceFrequency, setCatRecurrenceFrequency] = useState<string>("MONTHLY");
  const [catAutoGenerate, setCatAutoGenerate] = useState(false);
  const [catEconomicCategory, setCatEconomicCategory] = useState("ALL");
  const [catTargetDivisions, setCatTargetDivisions] = useState<string[]>([]);
  const [catDefaultAmount, setCatDefaultAmount] = useState("");
  const [catTargetAmount, setCatTargetAmount] = useState("");
  const [catDynamicFields, setCatDynamicFields] = useState<DynamicFormFieldConfig[]>(DEFAULT_STANDARD_FIELDS);
  const [isSavingCat, setIsSavingCat] = useState(false);

  // Category Edit & Delete State
  const [editCatTarget, setEditCatTarget] = useState<{
    item: CollectionCategory | ExpenseCategory;
    type: "collection" | "expense";
  } | null>(null);
  const [editCatFundId, setEditCatFundId] = useState("");
  const [editCatAccountId, setEditCatAccountId] = useState("");
  const [editCatName, setEditCatName] = useState("");
  const [editCatCode, setEditCatCode] = useState("");
  const [editCatTargetType, setEditCatTargetType] = useState<string>("FAMILY_BASED");
  const [editCatIsRecurring, setEditCatIsRecurring] = useState(false);
  const [editCatIsSubscription, setEditCatIsSubscription] = useState(false);
  const [editCatRecurrenceFrequency, setEditCatRecurrenceFrequency] = useState<string>("MONTHLY");
  const [editCatAutoGenerate, setEditCatAutoGenerate] = useState(false);
  const [editCatEconomicCategory, setEditCatEconomicCategory] = useState("ALL");
  const [editCatTargetDivisions, setEditCatTargetDivisions] = useState<string[]>([]);
  const [editCatDefaultAmount, setEditCatDefaultAmount] = useState("");
  const [editCatTargetAmount, setEditCatTargetAmount] = useState("");
  const [editCatDynamicFields, setEditCatDynamicFields] = useState<DynamicFormFieldConfig[]>(DEFAULT_STANDARD_FIELDS);
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
  // Operational Fund (FinanceFund) Handlers
  // ---------------------------------------------------------------------------
  async function handleCreateOpFund(e: React.FormEvent) {
    e.preventDefault();
    if (!opFundName.trim()) {
      toast({ title: "Please enter fund name", variant: "destructive" });
      return;
    }
    setIsSavingOpFund(true);
    try {
      const res = await apiClient.post<{ fund: FinanceFund }>(`/tenants/${slug}/finance/settings/funds`, {
        name: opFundName.trim(),
        code: opFundCode.trim() || undefined,
        description: opFundDescription.trim() || undefined,
        color: opFundColor || "#059669",
        isDefault: opFundIsDefault
      });
      if (res?.fund) {
        setOperationalFunds((prev) => [...prev, res.fund]);
      }
      toast({ title: "Operational Fund created successfully", variant: "success" });
      setOpFundModalOpen(false);
      setOpFundName("");
      setOpFundCode("");
      setOpFundDescription("");
      setOpFundColor("#059669");
      setOpFundIsDefault(false);
      router.refresh();
    } catch (err) {
      toast({
        title: "Error creating fund",
        description: err instanceof ApiError ? err.message : "Failed to create fund",
        variant: "destructive"
      });
    } finally {
      setIsSavingOpFund(false);
    }
  }

  async function handleUpdateOpFund(e: React.FormEvent) {
    e.preventDefault();
    if (!editOpFundTarget || !editOpFundName.trim()) return;
    setIsSavingEditOpFund(true);
    try {
      const res = await apiClient.patch<{ fund: FinanceFund }>(`/tenants/${slug}/finance/settings/funds/${editOpFundTarget.id}`, {
        name: editOpFundName.trim(),
        code: editOpFundCode.trim() || undefined,
        description: editOpFundDescription.trim() || undefined,
        color: editOpFundColor || "#059669",
        isDefault: editOpFundIsDefault
      });
      if (res?.fund) {
        setOperationalFunds((prev) => prev.map((f) => (f.id === res.fund.id ? res.fund : f)));
      }
      toast({ title: "Operational Fund updated successfully", variant: "success" });
      setEditOpFundTarget(null);
      router.refresh();
    } catch (err) {
      toast({
        title: "Error updating fund",
        description: err instanceof ApiError ? err.message : "Failed to update fund",
        variant: "destructive"
      });
    } finally {
      setIsSavingEditOpFund(false);
    }
  }

  async function handleDeleteOpFund() {
    if (!deleteOpFundTarget) return;
    setIsDeletingOpFund(true);
    try {
      await apiClient.delete(`/tenants/${slug}/finance/settings/funds/${deleteOpFundTarget.id}`);
      setOperationalFunds((prev) => prev.filter((f) => f.id !== deleteOpFundTarget.id));
      toast({ title: "Operational Fund deleted", variant: "success" });
      setDeleteOpFundTarget(null);
      router.refresh();
    } catch (err) {
      toast({
        title: "Error deleting fund",
        description: err instanceof ApiError ? err.message : "Failed to delete fund",
        variant: "destructive"
      });
    } finally {
      setIsDeletingOpFund(false);
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
        const familyField = catDynamicFields.find((f) => f.type === "family");
        const memberField = catDynamicFields.find((f) => f.type === "member");
        const amountField = catDynamicFields.find((f) => f.type === "amount");
        const dateField = catDynamicFields.find((f) => f.type === "date");
        const descField = catDynamicFields.find((f) => f.type === "description");
        const fileField = catDynamicFields.find((f) => f.type === "file");

        const fullFormConfig: CollectionFormConfig = {
          fields: catDynamicFields,
          enableFamily: familyField ? familyField.enabled : true,
          requireFamily: familyField ? familyField.required : false,
          enableMember: memberField ? memberField.enabled : true,
          requireMember: memberField ? memberField.required : false,
          enableAmount: amountField ? amountField.enabled : true,
          requireAmount: amountField ? amountField.required : true,
          enableDate: dateField ? dateField.enabled : true,
          enableNotes: descField ? descField.enabled : true,
          enableDescription: descField ? descField.enabled : true,
          enableAttachment: fileField ? fileField.enabled : false
        };

        await apiClient.post(`/tenants/${slug}/finance/settings/collection-categories`, {
          name: catName.trim(),
          code: catCode.trim() || undefined,
          fundId: catFundId || undefined,
          incomeAccountId: catAccountId || undefined,
          targetType: catTargetType,
          isRecurring: catIsRecurring,
          isSubscription: catIsSubscription,
          recurrenceFrequency: catIsRecurring ? catRecurrenceFrequency : undefined,
          autoGenerate: catAutoGenerate,
          targetEconomicCategory: catTargetType === "CUSTOM_TARGET" || catTargetType === "CATEGORY_BASED" ? catEconomicCategory : undefined,
          targetDivisionIds: catTargetType === "DIVISION_BASED" || catTargetType === "SPECIFIC_DIVISIONS" ? catTargetDivisions : undefined,
          defaultAmount: catDefaultAmount ? Number(catDefaultAmount) : undefined,
          targetAmount: catTargetAmount ? Number(catTargetAmount) : undefined,
          formConfig: fullFormConfig
        });
      } else {
        await apiClient.post(`/tenants/${slug}/finance/settings/expense-categories`, {
          name: catName.trim(),
          code: catCode.trim() || undefined,
          fundId: catFundId || undefined,
          expenseAccountId: catAccountId || undefined
        });
      }
      toast({ title: `${catType === "collection" ? "Collection" : "Expense"} category added`, variant: "success" });
      setCatModalOpen(false);
      setCatName("");
      setCatCode("");
      setCatFundId("");
      setCatAccountId("");
      setCatTargetType("FAMILY_BASED");
      setCatIsRecurring(false);
      setCatIsSubscription(false);
      setCatRecurrenceFrequency("MONTHLY");
      setCatAutoGenerate(false);
      setCatEconomicCategory("ALL");
      setCatTargetDivisions([]);
      setCatDefaultAmount("");
      setCatTargetAmount("");
      setCatDynamicFields(DEFAULT_STANDARD_FIELDS);
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
    setEditCatFundId(item.fundId || "");
    if (type === "collection") {
      const col = item as CollectionCategory;
      setEditCatAccountId(col.incomeAccountId || "");
      setEditCatTargetType(col.targetType || "FAMILY_BASED");
      setEditCatIsRecurring(Boolean(col.isRecurring));
      setEditCatIsSubscription(Boolean(col.isSubscription));
      setEditCatRecurrenceFrequency(String(col.recurrenceFrequency || "MONTHLY"));
      setEditCatAutoGenerate(Boolean(col.autoGenerate));
      setEditCatEconomicCategory(col.targetEconomicCategory || "ALL");
      setEditCatTargetDivisions(col.targetDivisionIds || []);
      setEditCatDefaultAmount(col.defaultAmount != null ? String(col.defaultAmount) : "");
      setEditCatTargetAmount(col.targetAmount != null ? String(col.targetAmount) : "");
      if (col.formConfig?.fields && col.formConfig.fields.length > 0) {
        setEditCatDynamicFields(col.formConfig.fields);
      } else {
        setEditCatDynamicFields([
          { id: "family", type: "family", label: "Mahallu Family", enabled: col.formConfig?.enableFamily ?? true, required: col.formConfig?.requireFamily ?? true },
          { id: "member", type: "member", label: "Family Member", enabled: col.formConfig?.enableMember ?? true, required: col.formConfig?.requireMember ?? false },
          { id: "amount", type: "amount", label: "Amount (₹)", enabled: col.formConfig?.enableAmount ?? true, required: col.formConfig?.requireAmount ?? true },
          { id: "date", type: "date", label: "Collection Date", enabled: col.formConfig?.enableDate ?? true, required: true },
          { id: "description", type: "description", label: "Notes / Description", enabled: col.formConfig?.enableNotes ?? true, required: false },
          { id: "file", type: "file", label: "Attachment / Receipt", enabled: col.formConfig?.enableAttachment ?? false, required: false }
        ]);
      }
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
        const familyField = editCatDynamicFields.find((f) => f.type === "family");
        const memberField = editCatDynamicFields.find((f) => f.type === "member");
        const amountField = editCatDynamicFields.find((f) => f.type === "amount");
        const dateField = editCatDynamicFields.find((f) => f.type === "date");
        const descField = editCatDynamicFields.find((f) => f.type === "description");
        const fileField = editCatDynamicFields.find((f) => f.type === "file");

        const fullFormConfig: CollectionFormConfig = {
          fields: editCatDynamicFields,
          enableFamily: familyField ? familyField.enabled : true,
          requireFamily: familyField ? familyField.required : false,
          enableMember: memberField ? memberField.enabled : true,
          requireMember: memberField ? memberField.required : false,
          enableAmount: amountField ? amountField.enabled : true,
          requireAmount: amountField ? amountField.required : true,
          enableDate: dateField ? dateField.enabled : true,
          enableNotes: descField ? descField.enabled : true,
          enableDescription: descField ? descField.enabled : true,
          enableAttachment: fileField ? fileField.enabled : false
        };

        await apiClient.patch(`/tenants/${slug}/finance/settings/collection-categories/${editCatTarget.item.id}`, {
          name: editCatName.trim(),
          code: editCatCode.trim() || undefined,
          fundId: editCatFundId || null,
          incomeAccountId: editCatAccountId || null,
          targetType: editCatTargetType,
          isRecurring: editCatIsRecurring,
          isSubscription: editCatIsSubscription,
          recurrenceFrequency: editCatIsRecurring ? editCatRecurrenceFrequency : undefined,
          autoGenerate: editCatAutoGenerate,
          targetEconomicCategory: editCatTargetType === "CUSTOM_TARGET" || editCatTargetType === "CATEGORY_BASED" ? editCatEconomicCategory : undefined,
          targetDivisionIds: editCatTargetType === "DIVISION_BASED" || editCatTargetType === "SPECIFIC_DIVISIONS" ? editCatTargetDivisions : undefined,
          defaultAmount: editCatDefaultAmount ? Number(editCatDefaultAmount) : null,
          targetAmount: editCatTargetAmount ? Number(editCatTargetAmount) : null,
          formConfig: fullFormConfig
        });
      } else {
        await apiClient.patch(`/tenants/${slug}/finance/settings/expense-categories/${editCatTarget.item.id}`, {
          name: editCatName.trim(),
          code: editCatCode.trim() || undefined,
          fundId: editCatFundId || null,
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
          {/* 1. Operational Funds (Finance Accounts: Masjid Fund, Madrasa Fund, etc.) */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                  Operational Funds & Accounts
                  <Badge variant="secondary" className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    Operational Layer
                  </Badge>
                </h3>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
                  Manage operational funds. Each fund has its own Income and Expense categories and reports.
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                setOpFundName("");
                setOpFundCode("");
                setOpFundDescription("");
                setOpFundColor("#059669");
                setOpFundIsDefault(false);
                setOpFundModalOpen(true);
              }}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shrink-0 self-start md:self-center"
            >
              <Plus className="h-4 w-4" />
              Add Operational Fund
            </Button>
          </div>

          {/* Table of Operational Funds */}
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">Mahallu Operational Funds ({operationalFunds.length})</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Designated organizational funds used for collections, vouchers, and fund-level accounting.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Linked Categories</TableHead>
                    <TableHead>Default / Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationalFunds.map((f) => {
                    const linkedCols = collectionCategories.filter((c) => c.fundId === f.id);
                    const linkedExps = expenseCategories.filter((c) => c.fundId === f.id);
                    const totalLinked = linkedCols.length + linkedExps.length;

                    return (
                      <TableRow key={f.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: f.color || "#059669" }}
                            />
                            <span className="font-semibold text-xs text-foreground">{f.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{f.code || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {f.description || "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {totalLinked > 0 ? (
                            <span className="inline-flex items-center gap-1 font-medium text-primary">
                              <Layers className="h-3 w-3" />
                              {totalLinked} {totalLinked === 1 ? "category" : "categories"}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60">0 categories</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1.5">
                            {f.isDefault && (
                              <Badge variant="success" className="text-[10px]">
                                Default Fund
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-[10px]">
                              Active
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setEditOpFundTarget(f);
                                setEditOpFundName(f.name);
                                setEditOpFundCode(f.code || "");
                                setEditOpFundDescription(f.description || "");
                                setEditOpFundColor(f.color || "#059669");
                                setEditOpFundIsDefault(Boolean(f.isDefault));
                              }}
                              title="Edit fund"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteOpFundTarget(f)}
                              title="Delete fund"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {operationalFunds.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                        No operational funds configured yet. Click &quot;Add Operational Fund&quot; to create your first fund (e.g. Masjid Fund).
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 2. Chart of Accounts Ledgers */}
          <div className="pt-2">
            <Card className="rounded-2xl border border-border/80 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Chart of Accounts Ledgers ({accounts.length})
                    <Badge variant="outline" className="text-[10px] text-blue-700 dark:text-blue-300">
                      Accounting Layer
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Double-entry accounting backbone accounts. Operational categories are mapped to these ledgers.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setFundType("INCOME");
                    setFundModalOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs rounded-xl"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Ledger Account
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ledger Account Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Mapped Categories</TableHead>
                      <TableHead>Balance</TableHead>
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
                              {acc.type || "ACCOUNT"}
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
                            {acc.currentBalance ? `₹${Number(acc.currentBalance).toLocaleString("en-IN")}` : "₹0.00"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                onClick={() => openEditFund(acc)}
                                title="Edit ledger account"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                onClick={() => setDeleteFundTarget(acc)}
                                title="Delete ledger account"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
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
      {activeTab === "categories" && (() => {
        const filteredCollectionCategories = collectionCategories.filter((c) =>
          categoryFundFilter === "ALL" || c.fundId === categoryFundFilter
        );
        const filteredExpenseCategories = expenseCategories.filter((c) =>
          categoryFundFilter === "ALL" || c.fundId === categoryFundFilter
        );

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Operational Fund:</span>
                <Select
                  value={categoryFundFilter}
                  onChange={(e) => setCategoryFundFilter(e.target.value)}
                  className="w-56 h-8 text-xs"
                >
                  <option value="ALL">All Operational Funds ({operationalFunds.length})</option>
                  {operationalFunds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} {f.code ? `(${f.code})` : ""}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    setCatType("collection");
                    setCatFundId(categoryFundFilter !== "ALL" ? categoryFundFilter : (operationalFunds[0]?.id || ""));
                    setCatModalOpen(true);
                  }}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-9"
                >
                  <Plus className="h-4 w-4" />
                  Add Collection Category
                </Button>
                <Button
                  onClick={() => {
                    setCatType("expense");
                    setCatFundId(categoryFundFilter !== "ALL" ? categoryFundFilter : (operationalFunds[0]?.id || ""));
                    setCatModalOpen(true);
                  }}
                  variant="outline"
                  className="gap-2 rounded-xl text-xs h-9"
                >
                  <Plus className="h-4 w-4" />
                  Add Expense Category
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Collection Categories */}
              <Card className="rounded-2xl border border-border/80 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>Collection Heads ({filteredCollectionCategories.length})</span>
                    {categoryFundFilter !== "ALL" && (
                      <Badge variant="secondary" className="text-[10px]">
                        Fund Filter Active
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {filteredCollectionCategories.map((c) => {
                    const matchedFund = c.fund || operationalFunds.find((f) => f.id === c.fundId);
                    const matchedCoa = c.incomeAccount || accounts.find((a) => a.id === c.incomeAccountId);

                    return (
                      <div key={c.id} className="group flex items-start justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-xs border border-transparent hover:border-border/60">
                        <div className="space-y-1.5 min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground text-sm">{c.name}</span>
                            {c.code && (
                              <span className="font-mono text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/60">
                                {c.code}
                              </span>
                            )}
                            {matchedFund && (
                              <Badge variant="outline" className="text-[10px] bg-blue-500/5 text-blue-700 dark:text-blue-300 border-blue-300">
                                Fund: {matchedFund.name}
                              </Badge>
                            )}
                            {matchedCoa ? (
                              <Badge variant="outline" className="text-[10px] bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-300">
                                COA: {matchedCoa.name}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300">
                                Unposted (No COA)
                              </Badge>
                            )}
                            {c.isRecurring && (
                              <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 gap-1">
                                <RefreshCw className="h-2.5 w-2.5" />
                                {c.recurrenceFrequency || "MONTHLY"}
                              </Badge>
                            )}
                            {c.autoGenerate && (
                              <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200">
                                Auto-gen
                              </Badge>
                            )}
                            {c.defaultAmount != null && Number(c.defaultAmount) > 0 && (
                              <Badge variant="outline" className="text-[10px] font-mono font-medium text-foreground">
                                ₹{Number(c.defaultAmount).toLocaleString("en-IN")}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                            <span className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
                              Target: {c.targetType === "NO_TARGET" || c.targetType === "GENERAL"
                                ? "No Target / Open"
                                : c.targetType === "DIVISION_BASED" || c.targetType === "SPECIFIC_DIVISIONS"
                                  ? `Division-based (${c.targetDivisionIds?.length || 0} Wards)`
                                  : c.targetType === "CUSTOM_TARGET" || c.targetType === "CATEGORY_BASED"
                                    ? `Custom (${c.targetEconomicCategory || "All"})`
                                    : c.targetType === "MEMBER_BASED"
                                      ? "Member-based"
                                      : "Family-based"}
                            </span>
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
                    );
                  })}
                  {filteredCollectionCategories.length === 0 && (
                    <p className="text-center py-4 text-xs text-muted-foreground">
                      No collection categories found for selected fund.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Expense Categories */}
              <Card className="rounded-2xl border border-border/80 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>Expense Heads ({filteredExpenseCategories.length})</span>
                    {categoryFundFilter !== "ALL" && (
                      <Badge variant="secondary" className="text-[10px]">
                        Fund Filter Active
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filteredExpenseCategories.map((c) => {
                    const matchedFund = c.fund || operationalFunds.find((f) => f.id === c.fundId);
                    const matchedCoa = c.expenseAccount || accounts.find((a) => a.id === c.expenseAccountId);

                    return (
                      <div key={c.id} className="group flex items-center justify-between p-2.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{c.name}</span>
                          {c.code && <span className="font-mono text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/60">{c.code}</span>}
                          {matchedFund && (
                            <Badge variant="outline" className="text-[10px] bg-blue-500/5 text-blue-700 dark:text-blue-300 border-blue-300">
                              Fund: {matchedFund.name}
                            </Badge>
                          )}
                          {matchedCoa ? (
                            <Badge variant="outline" className="text-[10px] bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-300">
                              COA: {matchedCoa.name}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300">
                              Unposted (No COA)
                            </Badge>
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
                    );
                  })}
                  {filteredExpenseCategories.length === 0 && (
                    <p className="text-center py-4 text-xs text-muted-foreground">
                      No expense categories found for selected fund.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })()}

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

      {/* Add Operational Fund Modal */}
      <Dialog open={opFundModalOpen} onOpenChange={setOpFundModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Add Operational Fund / Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOpFund} className="space-y-4 pt-2">
            <FormField label="Fund Name" required>
              <Input
                placeholder="e.g. Masjid Fund, Madrasa Fund, Building Fund"
                value={opFundName}
                onChange={(e) => setOpFundName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Fund Code (Short prefix)">
              <Input
                placeholder="e.g. MSJ, MDR, BLD"
                value={opFundCode}
                onChange={(e) => setOpFundCode(e.target.value)}
                className="font-mono"
              />
            </FormField>

            <FormField label="Description">
              <Input
                placeholder="e.g. Primary fund for daily operations and utilities"
                value={opFundDescription}
                onChange={(e) => setOpFundDescription(e.target.value)}
              />
            </FormField>

            <FormField label="Color Badge Theme">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={opFundColor}
                  onChange={(e) => setOpFundColor(e.target.value)}
                  className="w-10 h-9 rounded cursor-pointer border border-border"
                />
                <span className="text-xs font-mono text-muted-foreground">{opFundColor}</span>
              </div>
            </FormField>

            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <Checkbox
                checked={opFundIsDefault}
                onChange={(e) => setOpFundIsDefault(e.target.checked)}
              />
              <span className="font-medium text-foreground">
                Set as Default Operational Fund
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <Button type="button" variant="outline" onClick={() => setOpFundModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingOpFund} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSavingOpFund ? "Saving..." : "Create Fund"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Operational Fund Modal */}
      <Dialog open={editOpFundTarget !== null} onOpenChange={(open) => !open && setEditOpFundTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Edit Operational Fund</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateOpFund} className="space-y-4 pt-2">
            <FormField label="Fund Name" required>
              <Input
                value={editOpFundName}
                onChange={(e) => setEditOpFundName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Fund Code">
              <Input
                value={editOpFundCode}
                onChange={(e) => setEditOpFundCode(e.target.value)}
                className="font-mono"
              />
            </FormField>

            <FormField label="Description">
              <Input
                value={editOpFundDescription}
                onChange={(e) => setEditOpFundDescription(e.target.value)}
              />
            </FormField>

            <FormField label="Color Badge Theme">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={editOpFundColor}
                  onChange={(e) => setEditOpFundColor(e.target.value)}
                  className="w-10 h-9 rounded cursor-pointer border border-border"
                />
                <span className="text-xs font-mono text-muted-foreground">{editOpFundColor}</span>
              </div>
            </FormField>

            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <Checkbox
                checked={editOpFundIsDefault}
                onChange={(e) => setEditOpFundIsDefault(e.target.checked)}
              />
              <span className="font-medium text-foreground">
                Set as Default Operational Fund
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <Button type="button" variant="outline" onClick={() => setEditOpFundTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingEditOpFund} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSavingEditOpFund ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Operational Fund ConfirmDialog */}
      <ConfirmDialog
        open={deleteOpFundTarget !== null}
        onOpenChange={(open) => !open && setDeleteOpFundTarget(null)}
        title="Delete Operational Fund?"
        description={`Are you sure you want to delete "${deleteOpFundTarget?.name}"? Operational categories linked to this fund will need to be reallocated.`}
        confirmLabel="Delete Fund"
        destructive
        isConfirming={isDeletingOpFund}
        onConfirm={handleDeleteOpFund}
      />

      {/* Add Category Modal */}
      <Dialog open={catModalOpen} onOpenChange={setCatModalOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add {catType === "collection" ? "Collection" : "Expense"} Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCategory} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Operational Fund / Account" required>
                <Select
                  value={catFundId}
                  onChange={(e) => setCatFundId(e.target.value)}
                >
                  <option value="">Select Operational Fund...</option>
                  {operationalFunds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} {f.code ? `(${f.code})` : ""} {f.isDefault ? "[Default]" : ""}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label={catType === "collection" ? "Chart of Accounts Mapping (Income)" : "Chart of Accounts Mapping (Expense)"}>
                <Select
                  value={catAccountId}
                  onChange={(e) => setCatAccountId(e.target.value)}
                >
                  <option value="">Select COA Account (Required for Posting)...</option>
                  {(catType === "collection" ? incomeAccounts : expenseAccounts).map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} {acc.code ? `(${acc.code})` : ""}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Category Name" required>
                <Input
                  placeholder={catType === "collection" ? "e.g. Monthly Varisa, Juma Collection" : "e.g. Electricity, Staff Salary"}
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Category Code (Optional)">
                <Input
                  placeholder="e.g. VARISA, JUMA, BLDG"
                  value={catCode}
                  onChange={(e) => setCatCode(e.target.value)}
                />
              </FormField>
            </div>

            {catType === "collection" && (
              <>
                <div className="border-t border-border/60 pt-3 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Target Configuration & Recurrence
                  </h4>

                  <FormField label="Target Scope">
                    <Select
                      value={catTargetType}
                      onChange={(e) => setCatTargetType(e.target.value)}
                    >
                      <option value="NO_TARGET">No Target / Open (General Public, Hundi, Juma)</option>
                      <option value="FAMILY_BASED">Family-based (All Mahall Families)</option>
                      <option value="DIVISION_BASED">Division-based (Select Specific Wards)</option>
                      <option value="MEMBER_BASED">Member-based (Individual Members)</option>
                      <option value="CUSTOM_TARGET">Custom Target (Economic Category: BPL / APL)</option>
                    </Select>
                  </FormField>

                  {(catTargetType === "DIVISION_BASED" || catTargetType === "SPECIFIC_DIVISIONS") && (
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
                      </div>
                    </div>
                  )}

                  {(catTargetType === "CUSTOM_TARGET" || catTargetType === "CATEGORY_BASED") && (
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
                  </div>

                  <div className="space-y-3 pt-1">
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <Checkbox
                        checked={catIsRecurring}
                        onChange={(e) => setCatIsRecurring(e.target.checked)}
                      />
                      <span className="font-medium text-foreground">
                        Recurring Collection (e.g. Monthly Varisa, Annual Subscription)
                      </span>
                    </label>

                    {catIsRecurring && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6">
                        <FormField label="Recurrence Frequency">
                          <Select
                            value={catRecurrenceFrequency}
                            onChange={(e) => setCatRecurrenceFrequency(e.target.value)}
                          >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="QUARTERLY">Quarterly</option>
                            <option value="YEARLY">Yearly</option>
                            <option value="CUSTOM">Custom</option>
                          </Select>
                        </FormField>

                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                            <Checkbox
                              checked={catAutoGenerate}
                              onChange={(e) => setCatAutoGenerate(e.target.checked)}
                            />
                            <span className="text-foreground">
                              Auto-generate collections at start of period
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-border/60 pt-3">
                  <DynamicFormBuilder
                    fields={catDynamicFields}
                    onChange={setCatDynamicFields}
                  />
                </div>
              </>
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
        <DialogContent className="max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {editCatTarget?.type === "collection" ? "Collection" : "Expense"} Category
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCategory} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Operational Fund / Account" required>
                <Select
                  value={editCatFundId}
                  onChange={(e) => setEditCatFundId(e.target.value)}
                >
                  <option value="">Select Operational Fund...</option>
                  {operationalFunds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} {f.code ? `(${f.code})` : ""} {f.isDefault ? "[Default]" : ""}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label={editCatTarget?.type === "collection" ? "Chart of Accounts Mapping (Income)" : "Chart of Accounts Mapping (Expense)"}>
                <Select
                  value={editCatAccountId}
                  onChange={(e) => setEditCatAccountId(e.target.value)}
                >
                  <option value="">Select COA Account (Required for Posting)...</option>
                  {(editCatTarget?.type === "collection" ? incomeAccounts : expenseAccounts).map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} {acc.code ? `(${acc.code})` : ""}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Category Name" required>
                <Input
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Category Code (Optional)">
                <Input
                  value={editCatCode}
                  onChange={(e) => setEditCatCode(e.target.value)}
                />
              </FormField>
            </div>

            {editCatTarget?.type === "collection" && (
              <>
                <div className="border-t border-border/60 pt-3 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Target Configuration & Recurrence
                  </h4>

                  <FormField label="Target Scope">
                    <Select
                      value={editCatTargetType}
                      onChange={(e) => setEditCatTargetType(e.target.value)}
                    >
                      <option value="NO_TARGET">No Target / Open (General Public, Hundi, Juma)</option>
                      <option value="FAMILY_BASED">Family-based (All Mahall Families)</option>
                      <option value="DIVISION_BASED">Division-based (Select Specific Wards)</option>
                      <option value="MEMBER_BASED">Member-based (Individual Members)</option>
                      <option value="CUSTOM_TARGET">Custom Target (Economic Category: BPL / APL)</option>
                    </Select>
                  </FormField>

                  {(editCatTargetType === "DIVISION_BASED" || editCatTargetType === "SPECIFIC_DIVISIONS") && (
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
                      </div>
                    </div>
                  )}

                  {(editCatTargetType === "CUSTOM_TARGET" || editCatTargetType === "CATEGORY_BASED") && (
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
                  </div>

                  <div className="space-y-3 pt-1">
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <Checkbox
                        checked={editCatIsRecurring}
                        onChange={(e) => setEditCatIsRecurring(e.target.checked)}
                      />
                      <span className="font-medium text-foreground">
                        Recurring Collection (e.g. Monthly Varisa, Annual Subscription)
                      </span>
                    </label>

                    {editCatIsRecurring && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6">
                        <FormField label="Recurrence Frequency">
                          <Select
                            value={editCatRecurrenceFrequency}
                            onChange={(e) => setEditCatRecurrenceFrequency(e.target.value)}
                          >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="QUARTERLY">Quarterly</option>
                            <option value="YEARLY">Yearly</option>
                            <option value="CUSTOM">Custom</option>
                          </Select>
                        </FormField>

                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                            <Checkbox
                              checked={editCatAutoGenerate}
                              onChange={(e) => setEditCatAutoGenerate(e.target.checked)}
                            />
                            <span className="text-foreground">
                              Auto-generate collections at start of period
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-border/60 pt-3">
                  <DynamicFormBuilder
                    fields={editCatDynamicFields}
                    onChange={setEditCatDynamicFields}
                  />
                </div>
              </>
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
