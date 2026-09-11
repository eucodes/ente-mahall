-- CreateTable
CREATE TABLE "member_otps" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "member_otps_memberId_consumedAt_idx" ON "member_otps"("memberId", "consumedAt");

-- CreateIndex
CREATE UNIQUE INDEX "members_tenantId_phone_key" ON "members"("tenantId", "phone");

-- AddForeignKey
ALTER TABLE "member_otps" ADD CONSTRAINT "member_otps_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_otps" ADD CONSTRAINT "member_otps_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

