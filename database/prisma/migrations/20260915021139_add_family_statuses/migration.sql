-- AlterTable
ALTER TABLE "families" ADD COLUMN     "category" TEXT,
ADD COLUMN     "familyStatusId" TEXT;

-- AlterTable
ALTER TABLE "finance_collection_categories" ADD COLUMN     "defaultAmount" DECIMAL(12,2),
ADD COLUMN     "formConfig" JSONB,
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSubscription" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurrenceFrequency" TEXT DEFAULT 'MONTHLY',
ADD COLUMN     "targetAmount" DECIMAL(12,2),
ADD COLUMN     "targetDivisionIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "targetEconomicCategory" TEXT DEFAULT 'ALL',
ADD COLUMN     "targetType" TEXT NOT NULL DEFAULT 'ALL_FAMILIES';

-- AlterTable
ALTER TABLE "finance_collections" ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "customFields" JSONB;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "educationHistory" JSONB;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "familyStatusTerm" TEXT DEFAULT 'Category',
ADD COLUMN     "hasFamilyStatuses" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "tenant_family_statuses" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "color" TEXT DEFAULT 'emerald',
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_family_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_family_statuses_tenantId_order_idx" ON "tenant_family_statuses"("tenantId", "order");

-- CreateIndex
CREATE INDEX "tenant_family_statuses_tenantId_isActive_idx" ON "tenant_family_statuses"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_family_statuses_tenantId_code_key" ON "tenant_family_statuses"("tenantId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_family_statuses_tenantId_name_key" ON "tenant_family_statuses"("tenantId", "name");

-- CreateIndex
CREATE INDEX "families_familyStatusId_idx" ON "families"("familyStatusId");

-- CreateIndex
CREATE INDEX "families_tenantId_category_idx" ON "families"("tenantId", "category");

-- AddForeignKey
ALTER TABLE "tenant_family_statuses" ADD CONSTRAINT "tenant_family_statuses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "families" ADD CONSTRAINT "families_familyStatusId_fkey" FOREIGN KEY ("familyStatusId") REFERENCES "tenant_family_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
