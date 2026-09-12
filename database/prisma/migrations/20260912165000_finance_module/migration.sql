-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INCOME', 'EXPENSE', 'ASSET', 'LIABILITY');

-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('RECEIPT', 'PAYMENT');

-- CreateEnum
CREATE TYPE "DueStatus" AS ENUM ('PENDING', 'PAID', 'WAIVED');

-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "finance_accounts" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_vouchers" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "voucherNumber" TEXT,
    "type" "VoucherType" NOT NULL,
    "accountId" TEXT NOT NULL,
    "memberId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "partyName" TEXT,
    "paymentMethod" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_dues" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "DueStatus" NOT NULL DEFAULT 'PENDING',
    "paidVoucherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_dues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_salary_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "staffName" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "SalaryStatus" NOT NULL DEFAULT 'PENDING',
    "paidVoucherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_salary_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "finance_accounts_tenantId_isActive_idx" ON "finance_accounts"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "finance_accounts_tenantId_name_key" ON "finance_accounts"("tenantId", "name");

-- CreateIndex
CREATE INDEX "finance_vouchers_tenantId_date_idx" ON "finance_vouchers"("tenantId", "date");

-- CreateIndex
CREATE INDEX "finance_vouchers_accountId_idx" ON "finance_vouchers"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "finance_vouchers_tenantId_voucherNumber_key" ON "finance_vouchers"("tenantId", "voucherNumber");

-- CreateIndex
CREATE UNIQUE INDEX "finance_dues_paidVoucherId_key" ON "finance_dues"("paidVoucherId");

-- CreateIndex
CREATE INDEX "finance_dues_tenantId_status_idx" ON "finance_dues"("tenantId", "status");

-- CreateIndex
CREATE INDEX "finance_dues_memberId_idx" ON "finance_dues"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "finance_salary_records_paidVoucherId_key" ON "finance_salary_records"("paidVoucherId");

-- CreateIndex
CREATE INDEX "finance_salary_records_tenantId_status_idx" ON "finance_salary_records"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "finance_salary_records_tenantId_staffName_month_key" ON "finance_salary_records"("tenantId", "staffName", "month");

-- AddForeignKey
ALTER TABLE "finance_accounts" ADD CONSTRAINT "finance_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_vouchers" ADD CONSTRAINT "finance_vouchers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_vouchers" ADD CONSTRAINT "finance_vouchers_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "finance_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_vouchers" ADD CONSTRAINT "finance_vouchers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_dues" ADD CONSTRAINT "finance_dues_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_dues" ADD CONSTRAINT "finance_dues_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_dues" ADD CONSTRAINT "finance_dues_paidVoucherId_fkey" FOREIGN KEY ("paidVoucherId") REFERENCES "finance_vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_salary_records" ADD CONSTRAINT "finance_salary_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_salary_records" ADD CONSTRAINT "finance_salary_records_paidVoucherId_fkey" FOREIGN KEY ("paidVoucherId") REFERENCES "finance_vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
