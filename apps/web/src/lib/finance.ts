import "server-only";
import { serverApiGet } from "./server-api";

export type AccountType = "INCOME" | "EXPENSE" | "ASSET" | "LIABILITY" | "EQUITY";
export type VoucherType = "RECEIPT" | "PAYMENT";
export type DueStatus = "PENDING" | "PAID" | "WAIVED";
export type SalaryStatus = "PENDING" | "PAID";

export interface FinanceFund {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  color?: string | null;
  isDefault?: boolean;
  isActive?: boolean;
  displayOrder?: number;
}

export interface Account {
  id: string;
  fundId?: string | null;
  fund?: FinanceFund | null;
  code?: string | null;
  name: string;
  type: AccountType;
  parentAccountId?: string | null;
  parentAccount?: { id: string; name: string; code?: string | null } | null;
  description?: string | null;
  isSystem?: boolean;
  openingBalance?: string;
  currentBalance?: string;
  isActive?: boolean;
  children?: Account[];
}

export interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "OPEN" | "CLOSED";
  isCurrent: boolean;
}

export interface FinanceSettings {
  id: string;
  currency: string;
  financialYearStartMonth: number;
  financialYearStartDay: number;
  receiptPrefix: string;
  receiptStartNumber: number;
  receiptDigits: number;
  voucherPrefix: string;
  voucherStartNumber: number;
  voucherDigits: number;
  defaultCollectionDescription?: string | null;
  defaultPaymentMethodId?: string | null;
  defaultCashAccountId?: string | null;
  defaultBankAccountId?: string | null;
  defaultSalaryExpenseAccountId?: string | null;
  defaultCollectionIncomeAccountId?: string | null;
  defaultDonationIncomeAccountId?: string | null;
  defaultGeneralExpenseAccountId?: string | null;
}

export interface FinancePaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  isActive: boolean;
  requiresReference: boolean;
  requiresChequeNumber: boolean;
  requiresBankDetails: boolean;
  displayOrder: number;
}

export interface FinanceBankAccount {
  id: string;
  accountName: string;
  bankName: string;
  branch?: string | null;
  accountNumber: string;
  ifsc?: string | null;
  accountType: string;
  openingBalance: string;
  currentBalance: string;
  chartAccountId?: string | null;
  isActive: boolean;
}

export interface CollectionCustomField {
  id: string;
  label: string;
  type: "text" | "number" | "select";
  required: boolean;
  options?: string[];
}

export interface CollectionFormConfig {
  enableFamily?: boolean;
  requireFamily?: boolean;
  enableMember?: boolean;
  requireMember?: boolean;
  enableAmount?: boolean;
  requireAmount?: boolean;
  defaultAmount?: number | string | null;
  enablePaymentMethod?: boolean;
  enableDate?: boolean;
  enableNotes?: boolean;
  enableDescription?: boolean;
  enableAttachment?: boolean;
  customFields?: CollectionCustomField[];
}

export interface CollectionCategory {
  id: string;
  fundId?: string | null;
  fund?: FinanceFund | null;
  name: string;
  code?: string | null;
  description?: string | null;
  incomeAccountId?: string | null;
  incomeAccount?: { id: string; name: string; code?: string | null } | null;
  targetType?: "ALL_FAMILIES" | "SPECIFIC_DIVISIONS" | "CATEGORY_BASED" | "GENERAL";
  isRecurring?: boolean;
  isSubscription?: boolean;
  recurrenceFrequency?: "MONTHLY" | "ANNUAL" | "ONE_TIME" | string | null;
  targetEconomicCategory?: string | null;
  targetDivisionIds?: string[];
  targetAmount?: string | number | null;
  defaultAmount?: string | number | null;
  formConfig?: CollectionFormConfig | null;
  isActive: boolean;
  displayOrder: number;
}

export interface ExpenseCategory {
  id: string;
  fundId?: string | null;
  fund?: FinanceFund | null;
  name: string;
  code?: string | null;
  description?: string | null;
  expenseAccountId?: string | null;
  expenseAccount?: { id: string; name: string; code?: string | null } | null;
  isActive: boolean;
  displayOrder: number;
}

export interface FinanceCollection {
  id: string;
  collectionNumber?: string | null;
  type: string;
  categoryId?: string | null;
  category?: { id: string; name: string; code?: string | null } | null;
  familyId?: string | null;
  family?: { id: string; name: string; familyNumber?: string | null; house?: { displayNumber: string } | null } | null;
  memberId?: string | null;
  member?: { id: string; fullName: string; phone?: string | null } | null;
  donorName?: string | null;
  donorPhone?: string | null;
  donorAddress?: string | null;
  collectorName?: string | null;
  amount: string;
  paymentMethod?: string | null;
  date: string;
  reference?: string | null;
  description?: string | null;
  notes?: string | null;
  attachmentUrl?: string | null;
  customFields?: Record<string, any> | null;
  status: string;
  receipt?: { id: string; receiptNumber: string; status: string } | null;
}

export interface FinanceReceipt {
  id: string;
  receiptNumber: string;
  date: string;
  receivedFrom: string;
  categoryName?: string | null;
  amount: string;
  paymentMethod?: string | null;
  reference?: string | null;
  description?: string | null;
  recordedBy?: string | null;
  status: string;
  cancelledReason?: string | null;
  collection?: { id: string; type: string; collectionNumber?: string | null } | null;
}

export interface Voucher {
  id: string;
  voucherNumber: string | null;
  type: VoucherType;
  voucherSubtype?: string | null;
  status?: string;
  accountId: string;
  account: { id: string; name: string; type: AccountType };
  memberId: string | null;
  member: { id: string; fullName: string } | null;
  expenseCategoryId?: string | null;
  expenseCategory?: { id: string; name: string } | null;
  bankAccountId?: string | null;
  bankAccount?: { id: string; accountName: string; bankName: string } | null;
  date: string;
  amount: string;
  partyName: string | null;
  payeeName?: string | null;
  paymentMethod: string | null;
  reference?: string | null;
  description: string | null;
  attachmentUrl?: string | null;
  notes?: string | null;
}

export interface Due {
  id: string;
  memberId: string;
  member: { id: string; fullName: string; phone?: string | null };
  familyId?: string | null;
  family?: { id: string; name: string; familyNumber?: string | null; house?: { displayNumber: string } | null } | null;
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
  title: string;
  period?: string | null;
  amount: string;
  paidAmount?: string;
  outstandingAmount?: string | null;
  dueDate: string;
  status: DueStatus;
  paidVoucherId: string | null;
}

export interface SalaryRecord {
  id: string;
  staffName: string;
  month: string;
  amount: string;
  basicSalary?: string | null;
  allowances?: string | null;
  deductions?: string | null;
  netSalary?: string | null;
  status: SalaryStatus;
  approvalStatus?: string;
  paymentDate?: string | null;
  paymentMethod?: string | null;
  paidVoucherId: string | null;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  account: { id: string; name: string; code?: string | null; type: AccountType };
  debit: string;
  credit: string;
  description?: string | null;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference?: string | null;
  description: string;
  sourceType: string;
  status: string;
  totalDebit: string;
  totalCredit: string;
  financialYear?: { id: string; name: string } | null;
  lines: JournalEntryLine[];
}

export interface InterestFreeAccount {
  id: string;
  accountNumber: string;
  holderName: string;
  holderType: string;
  phone?: string | null;
  balance: string;
  status: string;
  member?: { id: string; fullName: string } | null;
  family?: { id: string; name: string } | null;
  transactions?: InterestFreeTransaction[];
}

export interface InterestFreeTransaction {
  id: string;
  type: string;
  amount: string;
  date: string;
  reference?: string | null;
  description?: string | null;
  balanceAfter: string;
  receiptNumber?: string | null;
}

export interface TaxLegalFiling {
  id: string;
  title: string;
  filingType: string;
  period?: string | null;
  dueDate: string;
  amount?: string | null;
  status: string;
  paymentDate?: string | null;
  reference?: string | null;
  notes?: string | null;
  documentUrl?: string | null;
}

export interface CashBookRow {
  id?: string;
  voucher?: Voucher;
  date?: string;
  entryNumber?: string;
  reference?: string | null;
  description?: string;
  receipts?: string | null;
  payments?: string | null;
  balance: string;
}

export interface FinanceSummary {
  byAccount: { account: Account; totalReceived: string; totalPaid: string }[];
  totalIncome: string;
  totalExpense: string;
  netPosition: string;
}

export interface FinanceOverview {
  todayCollections: string;
  todayPayments: string;
  thisMonthIncome: string;
  thisMonthExpenditure: string;
  outstandingDues: string;
  cashBalance: string;
  bankBalance: string;
  currentFinancialYear: string;
  recentCollections: any[];
  recentReceipts: any[];
  recentPayments: any[];
  recentPendingDues: any[];
  trend: { month: string; collections: number; expenses: number }[];
}

// Helpers for API requests
async function get<T>(slug: string, path: string): Promise<T | null> {
  const { status, body } = await serverApiGet<T>(`/tenants/${encodeURIComponent(slug)}/finance${path}`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}

// Client fetchers
export const getFinanceOverview = (slug: string) => get<FinanceOverview>(slug, "/overview");
export const getAccounts = (slug: string) => get<{ accounts: Account[] }>(slug, "/accounts").then((r) => r?.accounts ?? null);
export const getAccountHierarchy = (slug: string) => get<{ tree: Account[] }>(slug, "/accounts/hierarchy").then((r) => r?.tree ?? null);
export const getFinancialYears = (slug: string) => get<{ financialYears: FinancialYear[] }>(slug, "/financial-years").then((r) => r?.financialYears ?? null);

export const getJournalEntries = (slug: string, page = 1, pageSize = 20, status?: string) =>
  get<{ journalEntries: JournalEntry[]; meta: { total: number } }>(
    slug,
    `/journal-entries?page=${page}&pageSize=${pageSize}${status ? `&status=${status}` : ""}`
  );

export const getGeneralLedger = (slug: string, accountId: string, startDate?: string, endDate?: string, financialYearId?: string) =>
  get<any>(
    slug,
    `/ledger/${accountId}?${startDate ? `startDate=${startDate}&` : ""}${endDate ? `endDate=${endDate}&` : ""}${financialYearId ? `financialYearId=${financialYearId}` : ""}`
  );

export const getCashBook = (slug: string, startDate?: string, endDate?: string, financialYearId?: string) =>
  get<{ rows: CashBookRow[]; closingBalance: string; openingBalance: string; totalReceipts: string; totalPayments: string }>(
    slug,
    `/cash-book?${startDate ? `startDate=${startDate}&` : ""}${endDate ? `endDate=${endDate}&` : ""}${financialYearId ? `financialYearId=${financialYearId}` : ""}`
  );

export const getBankBook = (slug: string, bankAccountId: string, startDate?: string, endDate?: string) =>
  get<any>(
    slug,
    `/bank-book/${bankAccountId}?${startDate ? `startDate=${startDate}&` : ""}${endDate ? `endDate=${endDate}` : ""}`
  );

export const getTrialBalance = (slug: string, financialYearId?: string, startDate?: string, endDate?: string) =>
  get<{ rows: any[]; totalDebit: string; totalCredit: string; isBalanced: boolean }>(
    slug,
    `/trial-balance?${financialYearId ? `financialYearId=${financialYearId}&` : ""}${startDate ? `startDate=${startDate}&` : ""}${endDate ? `endDate=${endDate}` : ""}`
  );

export const getReceiptPaymentAccount = (slug: string, financialYearId?: string, startDate?: string, endDate?: string) =>
  get<any>(
    slug,
    `/receipt-payment?${financialYearId ? `financialYearId=${financialYearId}&` : ""}${startDate ? `startDate=${startDate}&` : ""}${endDate ? `endDate=${endDate}` : ""}`
  );

export const getIncomeExpenditure = (slug: string, financialYearId?: string, startDate?: string, endDate?: string) =>
  get<any>(
    slug,
    `/income-expenditure?${financialYearId ? `financialYearId=${financialYearId}&` : ""}${startDate ? `startDate=${startDate}&` : ""}${endDate ? `endDate=${endDate}` : ""}`
  );

export const getBalanceSheet = (slug: string, asOfDate?: string, financialYearId?: string) =>
  get<any>(
    slug,
    `/balance-sheet?${asOfDate ? `asOfDate=${asOfDate}&` : ""}${financialYearId ? `financialYearId=${financialYearId}` : ""}`
  );

export const getCollections = (slug: string, queryStr = "") =>
  get<{ collections: FinanceCollection[]; meta: { total: number } }>(slug, `/collections?${queryStr}`);

export const getReceipts = (slug: string, page = 1, pageSize = 20, search?: string) =>
  get<{ receipts: FinanceReceipt[]; meta: { total: number } }>(
    slug,
    `/receipts?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""}`
  );

export const getFridaySummary = (slug: string, date: string) =>
  get<any>(slug, `/collections/friday-summary?date=${encodeURIComponent(date)}`);

export const getFamilyCollections = (slug: string, familyId: string) =>
  get<any>(slug, `/collections/family/${encodeURIComponent(familyId)}`);

export const getVouchers = (slug: string, page = 1, pageSize = 20, queryStr = "") =>
  get<{ vouchers: Voucher[]; meta: { total: number } }>(
    slug,
    `/vouchers?page=${page}&pageSize=${pageSize}${queryStr ? `&${queryStr}` : ""}`
  ).then((r) => (r ? { vouchers: r.vouchers, total: r.meta.total } : null));

export const getDues = (slug: string, page = 1, pageSize = 20, queryStr = "") =>
  get<{ dues: Due[]; meta: { total: number } }>(
    slug,
    `/dues?page=${page}&pageSize=${pageSize}${queryStr ? `&${queryStr}` : ""}`
  ).then((r) => (r ? { dues: r.dues, total: r.meta.total } : null));

export const getSalaryRecords = (slug: string, page = 1, pageSize = 20, queryStr = "") =>
  get<{ records: SalaryRecord[]; meta: { total: number } }>(
    slug,
    `/salary?page=${page}&pageSize=${pageSize}${queryStr ? `&${queryStr}` : ""}`
  ).then((r) => (r ? { records: r.records, total: r.meta.total } : null));

export const getInterestFreeAccounts = (slug: string, page = 1, pageSize = 20, search?: string) =>
  get<{ accounts: InterestFreeAccount[]; meta: { total: number } }>(
    slug,
    `/interest-free/accounts?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""}`
  );

export const getInterestFreeAccount = (slug: string, id: string) =>
  get<{ account: InterestFreeAccount }>(slug, `/interest-free/accounts/${encodeURIComponent(id)}`).then((r) => r?.account ?? null);

export const getTaxLegalFilings = (slug: string, status?: string) =>
  get<{ filings: TaxLegalFiling[] }>(slug, `/taxes-legal${status ? `?status=${status}` : ""}`).then((r) => r?.filings ?? null);

export const getFinanceSettings = (slug: string) =>
  get<{ settings: FinanceSettings }>(slug, "/settings").then((r) => r?.settings ?? null);

export const getPaymentMethods = (slug: string) =>
  get<{ paymentMethods: FinancePaymentMethod[] }>(slug, "/settings/payment-methods").then((r) => r?.paymentMethods ?? null);

export const getBankAccounts = (slug: string) =>
  get<{ bankAccounts: FinanceBankAccount[] }>(slug, "/settings/bank-accounts").then((r) => r?.bankAccounts ?? null);

export const getCollectionCategories = (slug: string) =>
  get<{ categories: CollectionCategory[] }>(slug, "/settings/collection-categories").then((r) => r?.categories ?? null);

export const getExpenseCategories = (slug: string) =>
  get<{ categories: ExpenseCategory[] }>(slug, "/settings/expense-categories").then((r) => r?.categories ?? null);

export const getFinanceFunds = (slug: string) =>
  get<{ funds: FinanceFund[] }>(slug, "/settings/funds").then((r) => r?.funds ?? null);

export const getAreaFinanceAnalysis = (slug: string) =>
  get<{ areas: any[] }>(slug, "/reports/area-analysis").then((r) => r?.areas ?? null);

export const getFinanceSummary = (slug: string) => get<FinanceSummary>(slug, "/summary");
