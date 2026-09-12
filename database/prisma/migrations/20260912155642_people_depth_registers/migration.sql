-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "RelationToHead" AS ENUM ('HEAD', 'SPOUSE', 'SON', 'DAUGHTER', 'PARENT', 'SIBLING', 'OTHER');

-- CreateEnum
CREATE TYPE "MovementStatus" AS ENUM ('RESIDENT', 'MIGRATED', 'MOVED_OUT', 'DECEASED');

-- AlterTable
ALTER TABLE "families" ADD COLUMN     "houseId" TEXT;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "bloodGroup" "BloodGroup",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "expatriateContact" TEXT,
ADD COLUMN     "expatriateCountry" TEXT,
ADD COLUMN     "expatriateOccupation" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "guardianName" TEXT,
ADD COLUMN     "guardianPhone" TEXT,
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "isExpatriate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isYatheem" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maritalStatus" "MaritalStatus",
ADD COLUMN     "movementDate" TIMESTAMP(3),
ADD COLUMN     "movementNotes" TEXT,
ADD COLUMN     "movementStatus" "MovementStatus" NOT NULL DEFAULT 'RESIDENT',
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "relationToHead" "RelationToHead";

-- CreateIndex
CREATE INDEX "families_houseId_idx" ON "families"("houseId");

-- CreateIndex
CREATE INDEX "members_tenantId_isYatheem_idx" ON "members"("tenantId", "isYatheem");

-- CreateIndex
CREATE INDEX "members_tenantId_isExpatriate_idx" ON "members"("tenantId", "isExpatriate");

-- CreateIndex
CREATE INDEX "members_tenantId_bloodGroup_idx" ON "members"("tenantId", "bloodGroup");

-- CreateIndex
CREATE INDEX "members_tenantId_movementStatus_idx" ON "members"("tenantId", "movementStatus");

-- AddForeignKey
ALTER TABLE "families" ADD CONSTRAINT "families_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
