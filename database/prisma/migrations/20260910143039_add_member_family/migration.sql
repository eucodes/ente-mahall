-- AlterTable
ALTER TABLE "members" ADD COLUMN     "familyId" TEXT;

-- CreateIndex
CREATE INDEX "members_familyId_idx" ON "members"("familyId");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

