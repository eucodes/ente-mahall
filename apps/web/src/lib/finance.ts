import "server-only";
import { serverApiGet } from "./server-api";

export type AccountType = "INCOME" | "EXPENSE" | "ASSET" | "LIABILITY";
export type VoucherType = "RECEIPT" | "PAYMENT";
export type DueStatus = "PENDING" | "PAID" | "WAIVED";
export type SalaryStatus = "PENDING" | "PAID";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
}

export interface Voucher {
  id: string;
  voucherNumber: string | null;
  type: VoucherType;
  accountId: string;
  account: { id: string; name: string; type: AccountType };
  memberId: string | null;
  member: { id: string; fullName: string } | null;
  date: string;
  amount: string;
  partyName: string | null;
  paymentMethod: string | null;
  description: string | null;
}

export interface Due {
  id: string;
  memberId: string;
  member: { id: string; fullName: string };
  title: string;
  amount: string;
  dueDate: string;
  status: DueStatus;
  paidVoucherId: string | null;
}

export interface SalaryRecord {
  id: string;
  staffName: string;
  month: string;
  amount: string;
  status: SalaryStatus;
  paidVoucherId: string | null;
}

export interface CashBookRow {
  voucher: Voucher;
  balance: string;
}

export interface FinanceSummary {
  byAccount: { account: Account; totalReceived: string; totalPaid: string }[];
  totalIncome: string;
  totalExpense: string;
  netPosition: string;
}

async function get<T>(slug: string, path: string): Promise<T | null> {
  const { status, body } = await serverApiGet<T>(`/tenants/${encodeURIComponent(slug)}/finance${path}`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}

export const getAccounts = (slug: string) => get<{ accounts: Account[] }>(slug, "/accounts").then((r) => r?.accounts ?? null);

export const getVouchers = (slug: string, page: number, pageSize: number) =>
  get<{ vouchers: Voucher[]; meta: { total: number } }>(slug, `/vouchers?page=${page}&pageSize=${pageSize}`).then((r) =>
    r ? { vouchers: r.vouchers, total: r.meta.total } : null
  );

export const getDues = (slug: string, page: number, pageSize: number) =>
  get<{ dues: Due[]; meta: { total: number } }>(slug, `/dues?page=${page}&pageSize=${pageSize}`).then((r) =>
    r ? { dues: r.dues, total: r.meta.total } : null
  );

export const getSalaryRecords = (slug: string, page: number, pageSize: number) =>
  get<{ records: SalaryRecord[]; meta: { total: number } }>(slug, `/salary?page=${page}&pageSize=${pageSize}`).then((r) =>
    r ? { records: r.records, total: r.meta.total } : null
  );

export const getCashBook = (slug: string) => get<{ rows: CashBookRow[]; closingBalance: string }>(slug, "/reports/cash-book");

export const getFinanceSummary = (slug: string) => get<FinanceSummary>(slug, "/reports/summary");
