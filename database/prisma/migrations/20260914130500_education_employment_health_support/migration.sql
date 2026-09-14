-- CreateEnum
CREATE TYPE "HealthConditionStatus" AS ENUM ('NO_KNOWN_CONDITION', 'HAS_CONDITION', 'NOT_DISCLOSED');

-- CreateEnum
CREATE TYPE "DisabilityType" AS ENUM ('PHYSICAL', 'VISUAL', 'HEARING', 'SPEECH', 'INTELLECTUAL', 'MULTIPLE', 'OTHER');

-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('ACTIVE', 'MONITORING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('EMPLOYED', 'SELF_EMPLOYED', 'BUSINESS', 'GOVERNMENT_SERVICE', 'PRIVATE_SECTOR', 'DAILY_WAGE', 'JOB_SEEKER', 'STUDENT', 'HOMEMAKER', 'RETIRED', 'UNABLE_TO_WORK');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('NONE', 'PRIMARY', 'SECONDARY_SSLC', 'HIGHER_SECONDARY', 'DIPLOMA', 'GRADUATE', 'POST_GRADUATE', 'DOCTORATE', 'MADRASSA_ISLAMIC', 'VOCATIONAL', 'OTHER');

-- AlterTable
ALTER TABLE "members" ADD COLUMN "educationLevel" "EducationLevel",
ADD COLUMN "educationDetails" TEXT,
ADD COLUMN "institution" TEXT,
ADD COLUMN "employmentStatus" "EmploymentStatus",
ADD COLUMN "jobTitle" TEXT,
ADD COLUMN "employerOrBusiness" TEXT,
ADD COLUMN "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "isJobSeeker" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "families" ADD COLUMN "requiresCommunitySupport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "supportCategory" TEXT,
ADD COLUMN "supportStatus" "SupportStatus" DEFAULT 'ACTIVE',
ADD COLUMN "supportNotes" TEXT,
ADD COLUMN "emergencyContactName" TEXT,
ADD COLUMN "emergencyContactPhone" TEXT;

-- CreateTable
CREATE TABLE "member_health_profiles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "HealthConditionStatus" NOT NULL DEFAULT 'NO_KNOWN_CONDITION',
    "hasDisability" BOOLEAN NOT NULL DEFAULT false,
    "disabilityType" "DisabilityType",
    "disabilityPercentage" INTEGER,
    "disabilityCertificate" BOOLEAN NOT NULL DEFAULT false,
    "disabilityCertificateNo" TEXT,
    "hasChronicIllness" BOOLEAN NOT NULL DEFAULT false,
    "chronicConditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "chronicDetails" TEXT,
    "treatmentRequired" BOOLEAN NOT NULL DEFAULT false,
    "regularMedicationRequired" BOOLEAN NOT NULL DEFAULT false,
    "requiresMentalHealthSupport" BOOLEAN NOT NULL DEFAULT false,
    "mentalHealthSupportType" TEXT,
    "requiresAssistance" BOOLEAN NOT NULL DEFAULT false,
    "assistanceTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "primaryCaregiverName" TEXT,
    "caregiverRelationship" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "requiresCommunitySupport" BOOLEAN NOT NULL DEFAULT false,
    "supportCategory" TEXT,
    "supportStatus" "SupportStatus" NOT NULL DEFAULT 'ACTIVE',
    "supportNotes" TEXT,
    "lastSupportDate" TIMESTAMP(3),

    CONSTRAINT "member_health_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_health_profiles_memberId_key" ON "member_health_profiles"("memberId");

-- CreateIndex
CREATE INDEX "member_health_profiles_tenantId_status_idx" ON "member_health_profiles"("tenantId", "status");

-- CreateIndex
CREATE INDEX "member_health_profiles_tenantId_hasDisability_idx" ON "member_health_profiles"("tenantId", "hasDisability");

-- CreateIndex
CREATE INDEX "member_health_profiles_tenantId_hasChronicIllness_idx" ON "member_health_profiles"("tenantId", "hasChronicIllness");

-- CreateIndex
CREATE INDEX "member_health_profiles_tenantId_requiresCommunitySupport_idx" ON "member_health_profiles"("tenantId", "requiresCommunitySupport");

-- CreateIndex
CREATE INDEX "members_tenantId_educationLevel_idx" ON "members"("tenantId", "educationLevel");

-- CreateIndex
CREATE INDEX "members_tenantId_employmentStatus_idx" ON "members"("tenantId", "employmentStatus");

-- CreateIndex
CREATE INDEX "members_tenantId_isJobSeeker_idx" ON "members"("tenantId", "isJobSeeker");

-- CreateIndex
CREATE INDEX "families_tenantId_requiresCommunitySupport_idx" ON "families"("tenantId", "requiresCommunitySupport");

-- AddForeignKey
ALTER TABLE "member_health_profiles" ADD CONSTRAINT "member_health_profiles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_health_profiles" ADD CONSTRAINT "member_health_profiles_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
