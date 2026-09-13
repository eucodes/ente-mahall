-- AlterEnum
ALTER TYPE "AccountType" ADD VALUE 'EQUITY';

-- AlterTable
ALTER TABLE "finance_accounts" ADD COLUMN     "code" TEXT,
ADD COLUMN     "currentBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openingBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "parentAccountId" TEXT;

-- AlterTable
ALTER TABLE "finance_dues" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "familyId" TEXT,
ADD COLUMN     "outstandingAmount" DECIMAL(12,2),
ADD COLUMN     "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "period" TEXT;

-- AlterTable
ALTER TABLE "finance_salary_records" ADD COLUMN     "allowances" DECIMAL(12,2),
ADD COLUMN     "approvalStatus" TEXT NOT NULL DEFAULT 'PAID',
ADD COLUMN     "basicSalary" DECIMAL(12,2),
ADD COLUMN     "deductions" DECIMAL(12,2),
ADD COLUMN     "netSalary" DECIMAL(12,2),
ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "reference" TEXT;

-- AlterTable
ALTER TABLE "finance_vouchers" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "bankAccountId" TEXT,
ADD COLUMN     "expenseCategoryId" TEXT,
ADD COLUMN     "journalEntryId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "payeeName" TEXT,
ADD COLUMN     "receiptId" TEXT,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PAID',
ADD COLUMN     "voucherSubtype" TEXT DEFAULT 'PAYMENT';

-- CreateTable
CREATE TABLE "finance_settings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "financialYearStartMonth" INTEGER NOT NULL DEFAULT 4,
    "financialYearStartDay" INTEGER NOT NULL DEFAULT 1,
    "defaultCollectionDescription" TEXT,
    "defaultPaymentMethodId" TEXT,
    "defaultCashAccountId" TEXT,
    "defaultBankAccountId" TEXT,
    "receiptPrefix" TEXT NOT NULL DEFAULT 'RCP',
    "receiptStartNumber" INTEGER NOT NULL DEFAULT 1,
    "receiptDigits" INTEGER NOT NULL DEFAULT 6,
    "voucherPrefix" TEXT NOT NULL DEFAULT 'VCH',
    "voucherStartNumber" INTEGER NOT NULL DEFAULT 1,
    "voucherDigits" INTEGER NOT NULL DEFAULT 6,
    "defaultSalaryExpenseAccountId" TEXT,
    "defaultCollectionIncomeAccountId" TEXT,
    "defaultDonationIncomeAccountId" TEXT,
    "defaultGeneralExpenseAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_payment_methods" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CASH',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresReference" BOOLEAN NOT NULL DEFAULT false,
    "requiresChequeNumber" BOOLEAN NOT NULL DEFAULT false,
    "requiresBankDetails" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_bank_accounts" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "branch" TEXT,
    "accountNumber" TEXT NOT NULL,
    "ifsc" TEXT,
    "accountType" TEXT NOT NULL DEFAULT 'SAVINGS',
    "openingBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currentBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "chartAccountId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_financial_years" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "closedAt" TIMESTAMP(3),
    "closedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_financial_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_collection_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "incomeAccountId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_collection_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_expense_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "expenseAccountId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_expense_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_collections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "collectionNumber" TEXT,
    "type" TEXT NOT NULL,
    "categoryId" TEXT,
    "familyId" TEXT,
    "memberId" TEXT,
    "donorName" TEXT,
    "donorPhone" TEXT,
    "donorAddress" TEXT,
    "collectorName" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "paymentMethodId" TEXT,
    "paymentMethod" TEXT,
    "bankAccountId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "receiptId" TEXT,
    "journalEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_receipts" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "voucherId" TEXT,
    "dueId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedFrom" TEXT NOT NULL,
    "categoryName" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "paymentMethod" TEXT,
    "reference" TEXT,
    "description" TEXT,
    "recordedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "cancelledAt" TIMESTAMP(3),
    "cancelledReason" TEXT,
    "cancelledBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_journal_entries" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "entryNumber" TEXT NOT NULL,
    "financialYearId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "description" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'MANUAL',
    "sourceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'POSTED',
    "totalDebit" DECIMAL(12,2) NOT NULL,
    "totalCredit" DECIMAL(12,2) NOT NULL,
    "postedAt" TIMESTAMP(3),
    "postedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_journal_entry_lines" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "debit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_journal_entry_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_interest_free_accounts" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,
    "holderType" TEXT NOT NULL DEFAULT 'MEMBER',
    "memberId" TEXT,
    "familyId" TEXT,
    "phone" TEXT,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_interest_free_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_interest_free_transactions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "description" TEXT,
    "balanceAfter" DECIMAL(12,2) NOT NULL,
    "receiptNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_interest_free_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_tax_legal_filings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "filingType" TEXT NOT NULL,
    "period" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentDate" TIMESTAMP(3),
    "reference" TEXT,
    "notes" TEXT,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_tax_legal_filings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "finance_settings_tenantId_key" ON "finance_settings"("tenantId");

-- CreateIndex
CREATE INDEX "finance_payment_methods_tenantId_isActive_idx" ON "finance_payment_methods"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "finance_payment_methods_tenantId_code_key" ON "finance_payment_methods"("tenantId", "code");

-- CreateIndex
CREATE INDEX "finance_bank_accounts_tenantId_isActive_idx" ON "finance_bank_accounts"("tenantId", "isActive");

-- CreateIndex
CREATE INDEX "finance_financial_years_tenantId_status_idx" ON "finance_financial_years"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "finance_financial_years_tenantId_name_key" ON "finance_financial_years"("tenantId", "name");

-- CreateIndex
CREATE INDEX "finance_collection_categories_tenantId_isActive_idx" ON "finance_collection_categories"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "finance_collection_categories_tenantId_name_key" ON "finance_collection_categories"("tenantId", "name");

-- CreateIndex
CREATE INDEX "finance_expense_categories_tenantId_isActive_idx" ON "finance_expense_categories"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "finance_expense_categories_tenantId_name_key" ON "finance_expense_categories"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "finance_collections_receiptId_key" ON "finance_collections"("receiptId");

-- CreateIndex
CREATE UNIQUE INDEX "finance_collections_journalEntryId_key" ON "finance_collections"("journalEntryId");

-- CreateIndex
CREATE INDEX "finance_collections_tenantId_date_idx" ON "finance_collections"("tenantId", "date");

-- CreateIndex
CREATE INDEX "finance_collections_tenantId_type_idx" ON "finance_collections"("tenantId", "type");

-- CreateIndex
CREATE INDEX "finance_collections_familyId_idx" ON "finance_collections"("familyId");

-- CreateIndex
CREATE INDEX "finance_collections_memberId_idx" ON "finance_collections"("memberId");

-- CreateIndex
CREATE INDEX "finance_collections_categoryId_idx" ON "finance_collections"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "finance_collections_tenantId_collectionNumber_key" ON "finance_collections"("tenantId", "collectionNumber");

-- CreateIndex
CREATE INDEX "finance_receipts_tenantId_date_idx" ON "finance_receipts"("tenantId", "date");

-- CreateIndex
CREATE INDEX "finance_receipts_tenantId_status_idx" ON "finance_receipts"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "finance_receipts_tenantId_receiptNumber_key" ON "finance_receipts"("tenantId", "receiptNumber");

-- CreateIndex
CREATE INDEX "finance_journal_entries_tenantId_date_idx" ON "finance_journal_entries"("tenantId", "date");

-- CreateIndex
CREATE INDEX "finance_journal_entries_tenantId_status_idx" ON "finance_journal_entries"("tenantId", "status");

-- CreateIndex
CREATE INDEX "finance_journal_entries_financialYearId_idx" ON "finance_journal_entries"("financialYearId");

-- CreateIndex
CREATE UNIQUE INDEX "finance_journal_entries_tenantId_entryNumber_key" ON "finance_journal_entries"("tenantId", "entryNumber");

-- CreateIndex
CREATE INDEX "finance_journal_entry_lines_journalEntryId_idx" ON "finance_journal_entry_lines"("journalEntryId");

-- CreateIndex
CREATE INDEX "finance_journal_entry_lines_accountId_idx" ON "finance_journal_entry_lines"("accountId");

-- CreateIndex
CREATE INDEX "finance_interest_free_accounts_tenantId_status_idx" ON "finance_interest_free_accounts"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "finance_interest_free_accounts_tenantId_accountNumber_key" ON "finance_interest_free_accounts"("tenantId", "accountNumber");

-- CreateIndex
CREATE INDEX "finance_interest_free_transactions_tenantId_date_idx" ON "finance_interest_free_transactions"("tenantId", "date");

-- CreateIndex
CREATE INDEX "finance_interest_free_transactions_accountId_idx" ON "finance_interest_free_transactions"("accountId");

-- CreateIndex
CREATE INDEX "finance_tax_legal_filings_tenantId_status_idx" ON "finance_tax_legal_filings"("tenantId", "status");

-- CreateIndex
CREATE INDEX "finance_tax_legal_filings_tenantId_dueDate_idx" ON "finance_tax_legal_filings"("tenantId", "dueDate");

-- CreateIndex
CREATE INDEX "finance_accounts_tenantId_code_idx" ON "finance_accounts"("tenantId", "code");

-- CreateIndex
CREATE INDEX "finance_accounts_parentAccountId_idx" ON "finance_accounts"("parentAccountId");

-- CreateIndex
CREATE INDEX "finance_dues_familyId_idx" ON "finance_dues"("familyId");

-- CreateIndex
CREATE INDEX "finance_dues_categoryId_idx" ON "finance_dues"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "finance_vouchers_journalEntryId_key" ON "finance_vouchers"("journalEntryId");

-- CreateIndex
CREATE INDEX "finance_vouchers_expenseCategoryId_idx" ON "finance_vouchers"("expenseCategoryId");

-- CreateIndex
CREATE INDEX "finance_vouchers_bankAccountId_idx" ON "finance_vouchers"("bankAccountId");

-- AddForeignKey
ALTER TABLE "finance_accounts" ADD CONSTRAINT "finance_accounts_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES "finance_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_settings" ADD CONSTRAINT "finance_settings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_payment_methods" ADD CONSTRAINT "finance_payment_methods_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_bank_accounts" ADD CONSTRAINT "finance_bank_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_bank_accounts" ADD CONSTRAINT "finance_bank_accounts_chartAccountId_fkey" FOREIGN KEY ("chartAccountId") REFERENCES "finance_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_financial_years" ADD CONSTRAINT "finance_financial_years_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collection_categories" ADD CONSTRAINT "finance_collection_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collection_categories" ADD CONSTRAINT "finance_collection_categories_incomeAccountId_fkey" FOREIGN KEY ("incomeAccountId") REFERENCES "finance_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_expense_categories" ADD CONSTRAINT "finance_expense_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_expense_categories" ADD CONSTRAINT "finance_expense_categories_expenseAccountId_fkey" FOREIGN KEY ("expenseAccountId") REFERENCES "finance_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collections" ADD CONSTRAINT "finance_collections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collections" ADD CONSTRAINT "finance_collections_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "finance_collection_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collections" ADD CONSTRAINT "finance_collections_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collections" ADD CONSTRAINT "finance_collections_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collections" ADD CONSTRAINT "finance_collections_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "finance_payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collections" ADD CONSTRAINT "finance_collections_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "finance_bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collections" ADD CONSTRAINT "finance_collections_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "finance_receipts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_collections" ADD CONSTRAINT "finance_collections_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "finance_journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_receipts" ADD CONSTRAINT "finance_receipts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_vouchers" ADD CONSTRAINT "finance_vouchers_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES "finance_expense_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_vouchers" ADD CONSTRAINT "finance_vouchers_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "finance_bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_vouchers" ADD CONSTRAINT "finance_vouchers_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "finance_journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_dues" ADD CONSTRAINT "finance_dues_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_dues" ADD CONSTRAINT "finance_dues_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "finance_collection_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_journal_entries" ADD CONSTRAINT "finance_journal_entries_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_journal_entries" ADD CONSTRAINT "finance_journal_entries_financialYearId_fkey" FOREIGN KEY ("financialYearId") REFERENCES "finance_financial_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_journal_entry_lines" ADD CONSTRAINT "finance_journal_entry_lines_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "finance_journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_journal_entry_lines" ADD CONSTRAINT "finance_journal_entry_lines_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "finance_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_interest_free_accounts" ADD CONSTRAINT "finance_interest_free_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_interest_free_accounts" ADD CONSTRAINT "finance_interest_free_accounts_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_interest_free_accounts" ADD CONSTRAINT "finance_interest_free_accounts_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_interest_free_transactions" ADD CONSTRAINT "finance_interest_free_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_interest_free_transactions" ADD CONSTRAINT "finance_interest_free_transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "finance_interest_free_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_tax_legal_filings" ADD CONSTRAINT "finance_tax_legal_filings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

