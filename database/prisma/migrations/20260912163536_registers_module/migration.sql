-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('WAQF', 'ASSET', 'RENTED');

-- CreateTable
CREATE TABLE "certificate_counters" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "registerType" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "certificate_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "death_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "memberId" TEXT,
    "deceasedName" TEXT NOT NULL,
    "fatherOrGuardianName" TEXT,
    "gender" "Gender",
    "dateOfBirth" TIMESTAMP(3),
    "dateOfDeath" TIMESTAMP(3) NOT NULL,
    "placeOfDeath" TEXT,
    "causeOfDeath" TEXT,
    "burialDate" TIMESTAMP(3),
    "remarks" TEXT,
    "certificateNumber" TEXT,
    "certificateIssuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "death_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marriage_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "groomFatherName" TEXT,
    "groomMemberId" TEXT,
    "brideName" TEXT NOT NULL,
    "brideFatherName" TEXT,
    "brideMemberId" TEXT,
    "marriageDate" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "officiantName" TEXT,
    "witness1Name" TEXT,
    "witness2Name" TEXT,
    "mahrDetails" TEXT,
    "remarks" TEXT,
    "certificateNumber" TEXT,
    "certificateIssuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marriage_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divorce_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "husbandName" TEXT NOT NULL,
    "husbandMemberId" TEXT,
    "wifeName" TEXT NOT NULL,
    "wifeMemberId" TEXT,
    "divorceType" TEXT,
    "divorceDate" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "officiantName" TEXT,
    "remarks" TEXT,
    "certificateNumber" TEXT,
    "certificateIssuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divorce_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mahallu_release_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "memberId" TEXT,
    "memberName" TEXT NOT NULL,
    "familyId" TEXT,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "destinationMahallu" TEXT,
    "remarks" TEXT,
    "certificateNumber" TEXT,
    "certificateIssuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mahallu_release_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grave_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "deathRecordId" TEXT,
    "deceasedName" TEXT NOT NULL,
    "plotNumber" TEXT NOT NULL,
    "section" TEXT,
    "burialDate" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grave_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "madrassa_enrollments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentMemberId" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "className" TEXT,
    "admissionDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "madrassa_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "areaDetails" TEXT,
    "lesseeName" TEXT,
    "lesseePhone" TEXT,
    "rentAmount" TEXT,
    "acquisitionDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificate_counters_tenantId_registerType_key" ON "certificate_counters"("tenantId", "registerType");

-- CreateIndex
CREATE UNIQUE INDEX "death_records_memberId_key" ON "death_records"("memberId");

-- CreateIndex
CREATE INDEX "death_records_tenantId_dateOfDeath_idx" ON "death_records"("tenantId", "dateOfDeath");

-- CreateIndex
CREATE UNIQUE INDEX "death_records_tenantId_certificateNumber_key" ON "death_records"("tenantId", "certificateNumber");

-- CreateIndex
CREATE INDEX "marriage_records_tenantId_marriageDate_idx" ON "marriage_records"("tenantId", "marriageDate");

-- CreateIndex
CREATE UNIQUE INDEX "marriage_records_tenantId_certificateNumber_key" ON "marriage_records"("tenantId", "certificateNumber");

-- CreateIndex
CREATE INDEX "divorce_records_tenantId_divorceDate_idx" ON "divorce_records"("tenantId", "divorceDate");

-- CreateIndex
CREATE UNIQUE INDEX "divorce_records_tenantId_certificateNumber_key" ON "divorce_records"("tenantId", "certificateNumber");

-- CreateIndex
CREATE INDEX "mahallu_release_records_tenantId_releaseDate_idx" ON "mahallu_release_records"("tenantId", "releaseDate");

-- CreateIndex
CREATE UNIQUE INDEX "mahallu_release_records_tenantId_certificateNumber_key" ON "mahallu_release_records"("tenantId", "certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "grave_records_deathRecordId_key" ON "grave_records"("deathRecordId");

-- CreateIndex
CREATE INDEX "grave_records_tenantId_idx" ON "grave_records"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "grave_records_tenantId_plotNumber_key" ON "grave_records"("tenantId", "plotNumber");

-- CreateIndex
CREATE INDEX "madrassa_enrollments_tenantId_isActive_idx" ON "madrassa_enrollments"("tenantId", "isActive");

-- CreateIndex
CREATE INDEX "property_records_tenantId_propertyType_isActive_idx" ON "property_records"("tenantId", "propertyType", "isActive");

-- AddForeignKey
ALTER TABLE "certificate_counters" ADD CONSTRAINT "certificate_counters_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "death_records" ADD CONSTRAINT "death_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "death_records" ADD CONSTRAINT "death_records_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marriage_records" ADD CONSTRAINT "marriage_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marriage_records" ADD CONSTRAINT "marriage_records_groomMemberId_fkey" FOREIGN KEY ("groomMemberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marriage_records" ADD CONSTRAINT "marriage_records_brideMemberId_fkey" FOREIGN KEY ("brideMemberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divorce_records" ADD CONSTRAINT "divorce_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divorce_records" ADD CONSTRAINT "divorce_records_husbandMemberId_fkey" FOREIGN KEY ("husbandMemberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divorce_records" ADD CONSTRAINT "divorce_records_wifeMemberId_fkey" FOREIGN KEY ("wifeMemberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahallu_release_records" ADD CONSTRAINT "mahallu_release_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahallu_release_records" ADD CONSTRAINT "mahallu_release_records_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahallu_release_records" ADD CONSTRAINT "mahallu_release_records_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grave_records" ADD CONSTRAINT "grave_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grave_records" ADD CONSTRAINT "grave_records_deathRecordId_fkey" FOREIGN KEY ("deathRecordId") REFERENCES "death_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "madrassa_enrollments" ADD CONSTRAINT "madrassa_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "madrassa_enrollments" ADD CONSTRAINT "madrassa_enrollments_studentMemberId_fkey" FOREIGN KEY ("studentMemberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_records" ADD CONSTRAINT "property_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
