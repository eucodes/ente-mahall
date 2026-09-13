-- AlterTable
ALTER TABLE "families" ADD COLUMN     "familyNumber" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "houses" ADD COLUMN     "name" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "tenant_divisions" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "houseNumberAllowManual" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "houseNumberMinDigits" INTEGER,
ADD COLUMN     "houseNumberPrefix" TEXT,
ADD COLUMN     "houseNumberStartAt" INTEGER,
ADD COLUMN     "houseNumberSuffix" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "families_tenantId_familyNumber_key" ON "families"("tenantId", "familyNumber");

-- CreateIndex
CREATE INDEX "tenant_divisions_tenantId_isActive_idx" ON "tenant_divisions"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_divisions_tenantId_code_key" ON "tenant_divisions"("tenantId", "code");

