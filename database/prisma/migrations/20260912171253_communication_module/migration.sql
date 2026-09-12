-- CreateEnum
CREATE TYPE "AnnouncementAudience" AS ENUM ('ALL', 'COMMITTEE_ONLY', 'DIVISION');

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "audience" "AnnouncementAudience" NOT NULL DEFAULT 'ALL',
ADD COLUMN     "targetDivisionId" TEXT;

-- CreateTable
CREATE TABLE "notification_settings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "notifyOnNewServiceRequest" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnNewDue" BOOLEAN NOT NULL DEFAULT true,
    "eventReminderDaysBefore" INTEGER,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "smsProviderName" TEXT,
    "smsSenderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_settings_tenantId_key" ON "notification_settings"("tenantId");

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_targetDivisionId_fkey" FOREIGN KEY ("targetDivisionId") REFERENCES "tenant_divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
