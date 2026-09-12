-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'REVIEW', 'COMPLETED');

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "divisionTerm" TEXT,
ADD COLUMN     "hasDivisions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "houseNumberingMethod" TEXT,
ADD COLUMN     "imamName" TEXT,
ADD COLUMN     "khatheebName" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "localBody" TEXT,
ADD COLUMN     "localBodyType" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "masjidAddress" TEXT,
ADD COLUMN     "masjidName" TEXT,
ADD COLUMN     "masjidPhone" TEXT,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "place" TEXT,
ADD COLUMN     "presidentName" TEXT,
ADD COLUMN     "presidentPhone" TEXT,
ADD COLUMN     "secretaryName" TEXT,
ADD COLUMN     "secretaryPhone" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "treasurerName" TEXT,
ADD COLUMN     "treasurerPhone" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "tenant_divisions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_divisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_drafts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OnboardingStatus" NOT NULL DEFAULT 'DRAFT',
    "currentStep" TEXT NOT NULL DEFAULT 'mahalle',
    "data" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_divisions_tenantId_order_idx" ON "tenant_divisions"("tenantId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_drafts_userId_key" ON "onboarding_drafts"("userId");

-- AddForeignKey
ALTER TABLE "tenant_divisions" ADD CONSTRAINT "tenant_divisions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_drafts" ADD CONSTRAINT "onboarding_drafts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
