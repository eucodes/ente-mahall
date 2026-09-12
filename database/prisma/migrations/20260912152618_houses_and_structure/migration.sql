-- CreateTable
CREATE TABLE "houses" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "divisionId" TEXT,
    "displayNumber" TEXT NOT NULL,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "houses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "houses_tenantId_isActive_idx" ON "houses"("tenantId", "isActive");

-- CreateIndex
CREATE INDEX "houses_divisionId_idx" ON "houses"("divisionId");

-- CreateIndex
CREATE UNIQUE INDEX "houses_tenantId_displayNumber_key" ON "houses"("tenantId", "displayNumber");

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "tenant_divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
