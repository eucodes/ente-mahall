--
-- PostgreSQL database dump
--

\restrict ULA0Me2e7tdTruribDgU6vgulAJGzf6kj79zDIdeNT9Frb4fN7AtPCMfSMMVXPP

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.tenant_memberships DROP CONSTRAINT IF EXISTS "tenant_memberships_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.tenant_memberships DROP CONSTRAINT IF EXISTS "tenant_memberships_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.tenant_memberships DROP CONSTRAINT IF EXISTS "tenant_memberships_roleId_fkey";
ALTER TABLE IF EXISTS ONLY public.tenant_feature_overrides DROP CONSTRAINT IF EXISTS "tenant_feature_overrides_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.tenant_feature_overrides DROP CONSTRAINT IF EXISTS "tenant_feature_overrides_featureId_fkey";
ALTER TABLE IF EXISTS ONLY public.tenant_family_statuses DROP CONSTRAINT IF EXISTS "tenant_family_statuses_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.tenant_divisions DROP CONSTRAINT IF EXISTS "tenant_divisions_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.subscriptions DROP CONSTRAINT IF EXISTS "subscriptions_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.subscriptions DROP CONSTRAINT IF EXISTS "subscriptions_planId_fkey";
ALTER TABLE IF EXISTS ONLY public.service_requests DROP CONSTRAINT IF EXISTS "service_requests_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.service_requests DROP CONSTRAINT IF EXISTS "service_requests_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.service_requests DROP CONSTRAINT IF EXISTS "service_requests_eventId_fkey";
ALTER TABLE IF EXISTS ONLY public.service_requests DROP CONSTRAINT IF EXISTS "service_requests_assignedToUserId_fkey";
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS "roles_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS "role_permissions_roleId_fkey";
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS "role_permissions_permissionId_fkey";
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS "refresh_tokens_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS "refresh_tokens_replacedById_fkey";
ALTER TABLE IF EXISTS ONLY public.property_records DROP CONSTRAINT IF EXISTS "property_records_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS "programs_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.platform_memberships DROP CONSTRAINT IF EXISTS "platform_memberships_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.plan_features DROP CONSTRAINT IF EXISTS "plan_features_planId_fkey";
ALTER TABLE IF EXISTS ONLY public.plan_features DROP CONSTRAINT IF EXISTS "plan_features_featureId_fkey";
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS "payments_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS "payments_invoiceId_fkey";
ALTER TABLE IF EXISTS ONLY public.onboarding_drafts DROP CONSTRAINT IF EXISTS "onboarding_drafts_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.notification_settings DROP CONSTRAINT IF EXISTS "notification_settings_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.members DROP CONSTRAINT IF EXISTS "members_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.members DROP CONSTRAINT IF EXISTS "members_familyId_fkey";
ALTER TABLE IF EXISTS ONLY public.member_otps DROP CONSTRAINT IF EXISTS "member_otps_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.member_otps DROP CONSTRAINT IF EXISTS "member_otps_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.member_health_profiles DROP CONSTRAINT IF EXISTS "member_health_profiles_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.member_health_profiles DROP CONSTRAINT IF EXISTS "member_health_profiles_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.marriage_records DROP CONSTRAINT IF EXISTS "marriage_records_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.marriage_records DROP CONSTRAINT IF EXISTS "marriage_records_groomMemberId_fkey";
ALTER TABLE IF EXISTS ONLY public.marriage_records DROP CONSTRAINT IF EXISTS "marriage_records_brideMemberId_fkey";
ALTER TABLE IF EXISTS ONLY public.mahallu_release_records DROP CONSTRAINT IF EXISTS "mahallu_release_records_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.mahallu_release_records DROP CONSTRAINT IF EXISTS "mahallu_release_records_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.mahallu_release_records DROP CONSTRAINT IF EXISTS "mahallu_release_records_familyId_fkey";
ALTER TABLE IF EXISTS ONLY public.madrassa_enrollments DROP CONSTRAINT IF EXISTS "madrassa_enrollments_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.madrassa_enrollments DROP CONSTRAINT IF EXISTS "madrassa_enrollments_studentMemberId_fkey";
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS "invoices_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS "invoices_subscriptionId_fkey";
ALTER TABLE IF EXISTS ONLY public.houses DROP CONSTRAINT IF EXISTS "houses_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.houses DROP CONSTRAINT IF EXISTS "houses_divisionId_fkey";
ALTER TABLE IF EXISTS ONLY public.grave_records DROP CONSTRAINT IF EXISTS "grave_records_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.grave_records DROP CONSTRAINT IF EXISTS "grave_records_deathRecordId_fkey";
ALTER TABLE IF EXISTS ONLY public.form_versions DROP CONSTRAINT IF EXISTS "form_versions_templateId_fkey";
ALTER TABLE IF EXISTS ONLY public.form_fields DROP CONSTRAINT IF EXISTS "form_fields_versionId_fkey";
ALTER TABLE IF EXISTS ONLY public.form_assignments DROP CONSTRAINT IF EXISTS "form_assignments_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.form_assignments DROP CONSTRAINT IF EXISTS "form_assignments_templateId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_vouchers DROP CONSTRAINT IF EXISTS "finance_vouchers_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_vouchers DROP CONSTRAINT IF EXISTS "finance_vouchers_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_vouchers DROP CONSTRAINT IF EXISTS "finance_vouchers_journalEntryId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_vouchers DROP CONSTRAINT IF EXISTS "finance_vouchers_expenseCategoryId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_vouchers DROP CONSTRAINT IF EXISTS "finance_vouchers_eventId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_vouchers DROP CONSTRAINT IF EXISTS "finance_vouchers_bankAccountId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_vouchers DROP CONSTRAINT IF EXISTS "finance_vouchers_accountId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_tax_legal_filings DROP CONSTRAINT IF EXISTS "finance_tax_legal_filings_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_settings DROP CONSTRAINT IF EXISTS "finance_settings_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_salary_records DROP CONSTRAINT IF EXISTS "finance_salary_records_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_salary_records DROP CONSTRAINT IF EXISTS "finance_salary_records_paidVoucherId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_receipts DROP CONSTRAINT IF EXISTS "finance_receipts_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_payment_methods DROP CONSTRAINT IF EXISTS "finance_payment_methods_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_journal_entry_lines DROP CONSTRAINT IF EXISTS "finance_journal_entry_lines_journalEntryId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_journal_entry_lines DROP CONSTRAINT IF EXISTS "finance_journal_entry_lines_accountId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_journal_entries DROP CONSTRAINT IF EXISTS "finance_journal_entries_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_journal_entries DROP CONSTRAINT IF EXISTS "finance_journal_entries_financialYearId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_interest_free_transactions DROP CONSTRAINT IF EXISTS "finance_interest_free_transactions_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_interest_free_transactions DROP CONSTRAINT IF EXISTS "finance_interest_free_transactions_accountId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_interest_free_accounts DROP CONSTRAINT IF EXISTS "finance_interest_free_accounts_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_interest_free_accounts DROP CONSTRAINT IF EXISTS "finance_interest_free_accounts_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_interest_free_accounts DROP CONSTRAINT IF EXISTS "finance_interest_free_accounts_familyId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_financial_years DROP CONSTRAINT IF EXISTS "finance_financial_years_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_expense_categories DROP CONSTRAINT IF EXISTS "finance_expense_categories_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_expense_categories DROP CONSTRAINT IF EXISTS "finance_expense_categories_expenseAccountId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_dues DROP CONSTRAINT IF EXISTS "finance_dues_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_dues DROP CONSTRAINT IF EXISTS "finance_dues_paidVoucherId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_dues DROP CONSTRAINT IF EXISTS "finance_dues_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_dues DROP CONSTRAINT IF EXISTS "finance_dues_familyId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_dues DROP CONSTRAINT IF EXISTS "finance_dues_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collections DROP CONSTRAINT IF EXISTS "finance_collections_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collections DROP CONSTRAINT IF EXISTS "finance_collections_receiptId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collections DROP CONSTRAINT IF EXISTS "finance_collections_paymentMethodId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collections DROP CONSTRAINT IF EXISTS "finance_collections_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collections DROP CONSTRAINT IF EXISTS "finance_collections_journalEntryId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collections DROP CONSTRAINT IF EXISTS "finance_collections_familyId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collections DROP CONSTRAINT IF EXISTS "finance_collections_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collections DROP CONSTRAINT IF EXISTS "finance_collections_bankAccountId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collection_categories DROP CONSTRAINT IF EXISTS "finance_collection_categories_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_collection_categories DROP CONSTRAINT IF EXISTS "finance_collection_categories_incomeAccountId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_bank_accounts DROP CONSTRAINT IF EXISTS "finance_bank_accounts_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_bank_accounts DROP CONSTRAINT IF EXISTS "finance_bank_accounts_chartAccountId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_accounts DROP CONSTRAINT IF EXISTS "finance_accounts_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.finance_accounts DROP CONSTRAINT IF EXISTS "finance_accounts_parentAccountId_fkey";
ALTER TABLE IF EXISTS ONLY public.families DROP CONSTRAINT IF EXISTS "families_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.families DROP CONSTRAINT IF EXISTS "families_houseId_fkey";
ALTER TABLE IF EXISTS ONLY public.families DROP CONSTRAINT IF EXISTS "families_familyStatusId_fkey";
ALTER TABLE IF EXISTS ONLY public.events DROP CONSTRAINT IF EXISTS "events_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.event_registrations DROP CONSTRAINT IF EXISTS "event_registrations_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.event_registrations DROP CONSTRAINT IF EXISTS "event_registrations_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.event_registrations DROP CONSTRAINT IF EXISTS "event_registrations_eventId_fkey";
ALTER TABLE IF EXISTS ONLY public.divorce_records DROP CONSTRAINT IF EXISTS "divorce_records_wifeMemberId_fkey";
ALTER TABLE IF EXISTS ONLY public.divorce_records DROP CONSTRAINT IF EXISTS "divorce_records_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.divorce_records DROP CONSTRAINT IF EXISTS "divorce_records_husbandMemberId_fkey";
ALTER TABLE IF EXISTS ONLY public.death_records DROP CONSTRAINT IF EXISTS "death_records_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.death_records DROP CONSTRAINT IF EXISTS "death_records_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.committee_members DROP CONSTRAINT IF EXISTS "committee_members_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.committee_members DROP CONSTRAINT IF EXISTS "committee_members_memberId_fkey";
ALTER TABLE IF EXISTS ONLY public.committee_meetings DROP CONSTRAINT IF EXISTS "committee_meetings_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.committee_decisions DROP CONSTRAINT IF EXISTS "committee_decisions_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.committee_decisions DROP CONSTRAINT IF EXISTS "committee_decisions_meetingId_fkey";
ALTER TABLE IF EXISTS ONLY public.certificate_counters DROP CONSTRAINT IF EXISTS "certificate_counters_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS "audit_logs_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS "audit_logs_actorUserId_fkey";
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS "announcements_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS "announcements_targetDivisionId_fkey";
ALTER TABLE IF EXISTS ONLY public."_MeetingAttendees" DROP CONSTRAINT IF EXISTS "_MeetingAttendees_B_fkey";
ALTER TABLE IF EXISTS ONLY public."_MeetingAttendees" DROP CONSTRAINT IF EXISTS "_MeetingAttendees_A_fkey";
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.tenants_slug_key;
DROP INDEX IF EXISTS public."tenants_isActive_idx";
DROP INDEX IF EXISTS public."tenant_memberships_userId_idx";
DROP INDEX IF EXISTS public."tenant_memberships_tenantId_userId_key";
DROP INDEX IF EXISTS public."tenant_memberships_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."tenant_feature_overrides_tenantId_featureId_key";
DROP INDEX IF EXISTS public."tenant_family_statuses_tenantId_order_idx";
DROP INDEX IF EXISTS public."tenant_family_statuses_tenantId_name_key";
DROP INDEX IF EXISTS public."tenant_family_statuses_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."tenant_family_statuses_tenantId_code_key";
DROP INDEX IF EXISTS public."tenant_divisions_tenantId_order_idx";
DROP INDEX IF EXISTS public."tenant_divisions_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."tenant_divisions_tenantId_code_key";
DROP INDEX IF EXISTS public."subscriptions_tenantId_key";
DROP INDEX IF EXISTS public."service_requests_tenantId_status_idx";
DROP INDEX IF EXISTS public."roles_tenantId_key_key";
DROP INDEX IF EXISTS public."role_permissions_roleId_permissionId_key";
DROP INDEX IF EXISTS public."role_permissions_permissionId_idx";
DROP INDEX IF EXISTS public."refresh_tokens_userId_idx";
DROP INDEX IF EXISTS public."refresh_tokens_tokenHash_key";
DROP INDEX IF EXISTS public."refresh_tokens_replacedById_key";
DROP INDEX IF EXISTS public."property_records_tenantId_propertyType_isActive_idx";
DROP INDEX IF EXISTS public."programs_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."platform_memberships_userId_key";
DROP INDEX IF EXISTS public.plans_key_key;
DROP INDEX IF EXISTS public."plan_features_planId_featureId_key";
DROP INDEX IF EXISTS public.permissions_key_key;
DROP INDEX IF EXISTS public."payments_tenantId_idx";
DROP INDEX IF EXISTS public."onboarding_drafts_userId_key";
DROP INDEX IF EXISTS public."notification_settings_tenantId_key";
DROP INDEX IF EXISTS public."members_tenantId_phone_key";
DROP INDEX IF EXISTS public."members_tenantId_movementStatus_idx";
DROP INDEX IF EXISTS public."members_tenantId_isYatheem_idx";
DROP INDEX IF EXISTS public."members_tenantId_isJobSeeker_idx";
DROP INDEX IF EXISTS public."members_tenantId_isExpatriate_idx";
DROP INDEX IF EXISTS public."members_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."members_tenantId_employmentStatus_idx";
DROP INDEX IF EXISTS public."members_tenantId_educationLevel_idx";
DROP INDEX IF EXISTS public."members_tenantId_bloodGroup_idx";
DROP INDEX IF EXISTS public."members_familyId_idx";
DROP INDEX IF EXISTS public."member_otps_memberId_consumedAt_idx";
DROP INDEX IF EXISTS public."member_health_profiles_tenantId_status_idx";
DROP INDEX IF EXISTS public."member_health_profiles_tenantId_requiresCommunitySupport_idx";
DROP INDEX IF EXISTS public."member_health_profiles_tenantId_hasDisability_idx";
DROP INDEX IF EXISTS public."member_health_profiles_tenantId_hasChronicIllness_idx";
DROP INDEX IF EXISTS public."member_health_profiles_memberId_key";
DROP INDEX IF EXISTS public."marriage_records_tenantId_marriageDate_idx";
DROP INDEX IF EXISTS public."marriage_records_tenantId_certificateNumber_key";
DROP INDEX IF EXISTS public."mahallu_release_records_tenantId_releaseDate_idx";
DROP INDEX IF EXISTS public."mahallu_release_records_tenantId_certificateNumber_key";
DROP INDEX IF EXISTS public."madrassa_enrollments_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."invoices_tenantId_idx";
DROP INDEX IF EXISTS public."houses_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."houses_tenantId_displayNumber_key";
DROP INDEX IF EXISTS public."houses_divisionId_idx";
DROP INDEX IF EXISTS public."grave_records_tenantId_plotNumber_key";
DROP INDEX IF EXISTS public."grave_records_tenantId_idx";
DROP INDEX IF EXISTS public."grave_records_deathRecordId_key";
DROP INDEX IF EXISTS public."form_versions_templateId_version_key";
DROP INDEX IF EXISTS public.form_templates_key_key;
DROP INDEX IF EXISTS public."form_fields_versionId_order_idx";
DROP INDEX IF EXISTS public."form_fields_versionId_key_key";
DROP INDEX IF EXISTS public."form_assignments_templateId_tenantId_key";
DROP INDEX IF EXISTS public."finance_vouchers_tenantId_voucherNumber_key";
DROP INDEX IF EXISTS public."finance_vouchers_tenantId_date_idx";
DROP INDEX IF EXISTS public."finance_vouchers_journalEntryId_key";
DROP INDEX IF EXISTS public."finance_vouchers_expenseCategoryId_idx";
DROP INDEX IF EXISTS public."finance_vouchers_eventId_idx";
DROP INDEX IF EXISTS public."finance_vouchers_bankAccountId_idx";
DROP INDEX IF EXISTS public."finance_vouchers_accountId_idx";
DROP INDEX IF EXISTS public."finance_tax_legal_filings_tenantId_status_idx";
DROP INDEX IF EXISTS public."finance_tax_legal_filings_tenantId_dueDate_idx";
DROP INDEX IF EXISTS public."finance_settings_tenantId_key";
DROP INDEX IF EXISTS public."finance_salary_records_tenantId_status_idx";
DROP INDEX IF EXISTS public."finance_salary_records_tenantId_staffName_month_key";
DROP INDEX IF EXISTS public."finance_salary_records_paidVoucherId_key";
DROP INDEX IF EXISTS public."finance_receipts_tenantId_status_idx";
DROP INDEX IF EXISTS public."finance_receipts_tenantId_receiptNumber_key";
DROP INDEX IF EXISTS public."finance_receipts_tenantId_date_idx";
DROP INDEX IF EXISTS public."finance_payment_methods_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."finance_payment_methods_tenantId_code_key";
DROP INDEX IF EXISTS public."finance_journal_entry_lines_journalEntryId_idx";
DROP INDEX IF EXISTS public."finance_journal_entry_lines_accountId_idx";
DROP INDEX IF EXISTS public."finance_journal_entries_tenantId_status_idx";
DROP INDEX IF EXISTS public."finance_journal_entries_tenantId_entryNumber_key";
DROP INDEX IF EXISTS public."finance_journal_entries_tenantId_date_idx";
DROP INDEX IF EXISTS public."finance_journal_entries_financialYearId_idx";
DROP INDEX IF EXISTS public."finance_interest_free_transactions_tenantId_date_idx";
DROP INDEX IF EXISTS public."finance_interest_free_transactions_accountId_idx";
DROP INDEX IF EXISTS public."finance_interest_free_accounts_tenantId_status_idx";
DROP INDEX IF EXISTS public."finance_interest_free_accounts_tenantId_accountNumber_key";
DROP INDEX IF EXISTS public."finance_financial_years_tenantId_status_idx";
DROP INDEX IF EXISTS public."finance_financial_years_tenantId_name_key";
DROP INDEX IF EXISTS public."finance_expense_categories_tenantId_name_key";
DROP INDEX IF EXISTS public."finance_expense_categories_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."finance_dues_tenantId_status_idx";
DROP INDEX IF EXISTS public."finance_dues_paidVoucherId_key";
DROP INDEX IF EXISTS public."finance_dues_memberId_idx";
DROP INDEX IF EXISTS public."finance_dues_familyId_idx";
DROP INDEX IF EXISTS public."finance_dues_categoryId_idx";
DROP INDEX IF EXISTS public."finance_collections_tenantId_type_idx";
DROP INDEX IF EXISTS public."finance_collections_tenantId_date_idx";
DROP INDEX IF EXISTS public."finance_collections_tenantId_collectionNumber_key";
DROP INDEX IF EXISTS public."finance_collections_receiptId_key";
DROP INDEX IF EXISTS public."finance_collections_memberId_idx";
DROP INDEX IF EXISTS public."finance_collections_journalEntryId_key";
DROP INDEX IF EXISTS public."finance_collections_familyId_idx";
DROP INDEX IF EXISTS public."finance_collections_categoryId_idx";
DROP INDEX IF EXISTS public."finance_collection_categories_tenantId_name_key";
DROP INDEX IF EXISTS public."finance_collection_categories_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."finance_bank_accounts_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."finance_accounts_tenantId_name_key";
DROP INDEX IF EXISTS public."finance_accounts_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."finance_accounts_tenantId_code_idx";
DROP INDEX IF EXISTS public."finance_accounts_parentAccountId_idx";
DROP INDEX IF EXISTS public.features_key_key;
DROP INDEX IF EXISTS public."families_tenantId_requiresCommunitySupport_idx";
DROP INDEX IF EXISTS public."families_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."families_tenantId_familyNumber_key";
DROP INDEX IF EXISTS public."families_tenantId_category_idx";
DROP INDEX IF EXISTS public."families_houseId_idx";
DROP INDEX IF EXISTS public."families_familyStatusId_idx";
DROP INDEX IF EXISTS public."events_tenantId_startsAt_idx";
DROP INDEX IF EXISTS public."events_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."event_registrations_tenantId_eventId_idx";
DROP INDEX IF EXISTS public."divorce_records_tenantId_divorceDate_idx";
DROP INDEX IF EXISTS public."divorce_records_tenantId_certificateNumber_key";
DROP INDEX IF EXISTS public."death_records_tenantId_dateOfDeath_idx";
DROP INDEX IF EXISTS public."death_records_tenantId_certificateNumber_key";
DROP INDEX IF EXISTS public."death_records_memberId_key";
DROP INDEX IF EXISTS public."committee_members_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."committee_members_memberId_idx";
DROP INDEX IF EXISTS public."committee_meetings_tenantId_meetingDate_idx";
DROP INDEX IF EXISTS public."committee_decisions_tenantId_idx";
DROP INDEX IF EXISTS public."committee_decisions_meetingId_idx";
DROP INDEX IF EXISTS public."certificate_counters_tenantId_registerType_key";
DROP INDEX IF EXISTS public."audit_logs_tenantId_createdAt_idx";
DROP INDEX IF EXISTS public."audit_logs_actorUserId_idx";
DROP INDEX IF EXISTS public.audit_logs_action_idx;
DROP INDEX IF EXISTS public."announcements_tenantId_isActive_idx";
DROP INDEX IF EXISTS public."_MeetingAttendees_B_index";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.tenants DROP CONSTRAINT IF EXISTS tenants_pkey;
ALTER TABLE IF EXISTS ONLY public.tenant_memberships DROP CONSTRAINT IF EXISTS tenant_memberships_pkey;
ALTER TABLE IF EXISTS ONLY public.tenant_feature_overrides DROP CONSTRAINT IF EXISTS tenant_feature_overrides_pkey;
ALTER TABLE IF EXISTS ONLY public.tenant_family_statuses DROP CONSTRAINT IF EXISTS tenant_family_statuses_pkey;
ALTER TABLE IF EXISTS ONLY public.tenant_divisions DROP CONSTRAINT IF EXISTS tenant_divisions_pkey;
ALTER TABLE IF EXISTS ONLY public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_pkey;
ALTER TABLE IF EXISTS ONLY public.service_requests DROP CONSTRAINT IF EXISTS service_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.property_records DROP CONSTRAINT IF EXISTS property_records_pkey;
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS programs_pkey;
ALTER TABLE IF EXISTS ONLY public.platform_memberships DROP CONSTRAINT IF EXISTS platform_memberships_pkey;
ALTER TABLE IF EXISTS ONLY public.plans DROP CONSTRAINT IF EXISTS plans_pkey;
ALTER TABLE IF EXISTS ONLY public.plan_features DROP CONSTRAINT IF EXISTS plan_features_pkey;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_pkey;
ALTER TABLE IF EXISTS ONLY public.onboarding_drafts DROP CONSTRAINT IF EXISTS onboarding_drafts_pkey;
ALTER TABLE IF EXISTS ONLY public.notification_settings DROP CONSTRAINT IF EXISTS notification_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.members DROP CONSTRAINT IF EXISTS members_pkey;
ALTER TABLE IF EXISTS ONLY public.member_otps DROP CONSTRAINT IF EXISTS member_otps_pkey;
ALTER TABLE IF EXISTS ONLY public.member_health_profiles DROP CONSTRAINT IF EXISTS member_health_profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.marriage_records DROP CONSTRAINT IF EXISTS marriage_records_pkey;
ALTER TABLE IF EXISTS ONLY public.mahallu_release_records DROP CONSTRAINT IF EXISTS mahallu_release_records_pkey;
ALTER TABLE IF EXISTS ONLY public.madrassa_enrollments DROP CONSTRAINT IF EXISTS madrassa_enrollments_pkey;
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS invoices_pkey;
ALTER TABLE IF EXISTS ONLY public.houses DROP CONSTRAINT IF EXISTS houses_pkey;
ALTER TABLE IF EXISTS ONLY public.grave_records DROP CONSTRAINT IF EXISTS grave_records_pkey;
ALTER TABLE IF EXISTS ONLY public.form_versions DROP CONSTRAINT IF EXISTS form_versions_pkey;
ALTER TABLE IF EXISTS ONLY public.form_templates DROP CONSTRAINT IF EXISTS form_templates_pkey;
ALTER TABLE IF EXISTS ONLY public.form_fields DROP CONSTRAINT IF EXISTS form_fields_pkey;
ALTER TABLE IF EXISTS ONLY public.form_assignments DROP CONSTRAINT IF EXISTS form_assignments_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_vouchers DROP CONSTRAINT IF EXISTS finance_vouchers_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_tax_legal_filings DROP CONSTRAINT IF EXISTS finance_tax_legal_filings_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_settings DROP CONSTRAINT IF EXISTS finance_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_salary_records DROP CONSTRAINT IF EXISTS finance_salary_records_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_receipts DROP CONSTRAINT IF EXISTS finance_receipts_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_payment_methods DROP CONSTRAINT IF EXISTS finance_payment_methods_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_journal_entry_lines DROP CONSTRAINT IF EXISTS finance_journal_entry_lines_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_journal_entries DROP CONSTRAINT IF EXISTS finance_journal_entries_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_interest_free_transactions DROP CONSTRAINT IF EXISTS finance_interest_free_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_interest_free_accounts DROP CONSTRAINT IF EXISTS finance_interest_free_accounts_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_financial_years DROP CONSTRAINT IF EXISTS finance_financial_years_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_expense_categories DROP CONSTRAINT IF EXISTS finance_expense_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_dues DROP CONSTRAINT IF EXISTS finance_dues_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_collections DROP CONSTRAINT IF EXISTS finance_collections_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_collection_categories DROP CONSTRAINT IF EXISTS finance_collection_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_bank_accounts DROP CONSTRAINT IF EXISTS finance_bank_accounts_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_accounts DROP CONSTRAINT IF EXISTS finance_accounts_pkey;
ALTER TABLE IF EXISTS ONLY public.features DROP CONSTRAINT IF EXISTS features_pkey;
ALTER TABLE IF EXISTS ONLY public.families DROP CONSTRAINT IF EXISTS families_pkey;
ALTER TABLE IF EXISTS ONLY public.events DROP CONSTRAINT IF EXISTS events_pkey;
ALTER TABLE IF EXISTS ONLY public.event_registrations DROP CONSTRAINT IF EXISTS event_registrations_pkey;
ALTER TABLE IF EXISTS ONLY public.divorce_records DROP CONSTRAINT IF EXISTS divorce_records_pkey;
ALTER TABLE IF EXISTS ONLY public.death_records DROP CONSTRAINT IF EXISTS death_records_pkey;
ALTER TABLE IF EXISTS ONLY public.committee_members DROP CONSTRAINT IF EXISTS committee_members_pkey;
ALTER TABLE IF EXISTS ONLY public.committee_meetings DROP CONSTRAINT IF EXISTS committee_meetings_pkey;
ALTER TABLE IF EXISTS ONLY public.committee_decisions DROP CONSTRAINT IF EXISTS committee_decisions_pkey;
ALTER TABLE IF EXISTS ONLY public.certificate_counters DROP CONSTRAINT IF EXISTS certificate_counters_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."_MeetingAttendees" DROP CONSTRAINT IF EXISTS "_MeetingAttendees_AB_pkey";
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.tenants;
DROP TABLE IF EXISTS public.tenant_memberships;
DROP TABLE IF EXISTS public.tenant_feature_overrides;
DROP TABLE IF EXISTS public.tenant_family_statuses;
DROP TABLE IF EXISTS public.tenant_divisions;
DROP TABLE IF EXISTS public.subscriptions;
DROP TABLE IF EXISTS public.service_requests;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP TABLE IF EXISTS public.property_records;
DROP TABLE IF EXISTS public.programs;
DROP TABLE IF EXISTS public.platform_memberships;
DROP TABLE IF EXISTS public.plans;
DROP TABLE IF EXISTS public.plan_features;
DROP TABLE IF EXISTS public.permissions;
DROP TABLE IF EXISTS public.payments;
DROP TABLE IF EXISTS public.onboarding_drafts;
DROP TABLE IF EXISTS public.notification_settings;
DROP TABLE IF EXISTS public.members;
DROP TABLE IF EXISTS public.member_otps;
DROP TABLE IF EXISTS public.member_health_profiles;
DROP TABLE IF EXISTS public.marriage_records;
DROP TABLE IF EXISTS public.mahallu_release_records;
DROP TABLE IF EXISTS public.madrassa_enrollments;
DROP TABLE IF EXISTS public.invoices;
DROP TABLE IF EXISTS public.houses;
DROP TABLE IF EXISTS public.grave_records;
DROP TABLE IF EXISTS public.form_versions;
DROP TABLE IF EXISTS public.form_templates;
DROP TABLE IF EXISTS public.form_fields;
DROP TABLE IF EXISTS public.form_assignments;
DROP TABLE IF EXISTS public.finance_vouchers;
DROP TABLE IF EXISTS public.finance_tax_legal_filings;
DROP TABLE IF EXISTS public.finance_settings;
DROP TABLE IF EXISTS public.finance_salary_records;
DROP TABLE IF EXISTS public.finance_receipts;
DROP TABLE IF EXISTS public.finance_payment_methods;
DROP TABLE IF EXISTS public.finance_journal_entry_lines;
DROP TABLE IF EXISTS public.finance_journal_entries;
DROP TABLE IF EXISTS public.finance_interest_free_transactions;
DROP TABLE IF EXISTS public.finance_interest_free_accounts;
DROP TABLE IF EXISTS public.finance_financial_years;
DROP TABLE IF EXISTS public.finance_expense_categories;
DROP TABLE IF EXISTS public.finance_dues;
DROP TABLE IF EXISTS public.finance_collections;
DROP TABLE IF EXISTS public.finance_collection_categories;
DROP TABLE IF EXISTS public.finance_bank_accounts;
DROP TABLE IF EXISTS public.finance_accounts;
DROP TABLE IF EXISTS public.features;
DROP TABLE IF EXISTS public.families;
DROP TABLE IF EXISTS public.events;
DROP TABLE IF EXISTS public.event_registrations;
DROP TABLE IF EXISTS public.divorce_records;
DROP TABLE IF EXISTS public.death_records;
DROP TABLE IF EXISTS public.committee_members;
DROP TABLE IF EXISTS public.committee_meetings;
DROP TABLE IF EXISTS public.committee_decisions;
DROP TABLE IF EXISTS public.certificate_counters;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.announcements;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."_MeetingAttendees";
DROP TYPE IF EXISTS public."VoucherType";
DROP TYPE IF EXISTS public."SupportStatus";
DROP TYPE IF EXISTS public."SubscriptionStatus";
DROP TYPE IF EXISTS public."ServiceRequestStatus";
DROP TYPE IF EXISTS public."SalaryStatus";
DROP TYPE IF EXISTS public."RelationToHead";
DROP TYPE IF EXISTS public."PropertyType";
DROP TYPE IF EXISTS public."PlatformRole";
DROP TYPE IF EXISTS public."OnboardingStatus";
DROP TYPE IF EXISTS public."MovementStatus";
DROP TYPE IF EXISTS public."MaritalStatus";
DROP TYPE IF EXISTS public."InvoiceStatus";
DROP TYPE IF EXISTS public."HealthConditionStatus";
DROP TYPE IF EXISTS public."Gender";
DROP TYPE IF EXISTS public."FormVersionStatus";
DROP TYPE IF EXISTS public."FormFieldType";
DROP TYPE IF EXISTS public."EmploymentStatus";
DROP TYPE IF EXISTS public."EducationLevel";
DROP TYPE IF EXISTS public."DueStatus";
DROP TYPE IF EXISTS public."DisabilityType";
DROP TYPE IF EXISTS public."CommitteeMeetingStatus";
DROP TYPE IF EXISTS public."BloodGroup";
DROP TYPE IF EXISTS public."BillingPeriod";
DROP TYPE IF EXISTS public."AnnouncementAudience";
DROP TYPE IF EXISTS public."AccountType";
--
-- Name: AccountType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AccountType" AS ENUM (
    'INCOME',
    'EXPENSE',
    'ASSET',
    'LIABILITY',
    'EQUITY'
);


--
-- Name: AnnouncementAudience; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AnnouncementAudience" AS ENUM (
    'ALL',
    'COMMITTEE_ONLY',
    'DIVISION'
);


--
-- Name: BillingPeriod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BillingPeriod" AS ENUM (
    'MONTHLY',
    'YEARLY'
);


--
-- Name: BloodGroup; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BloodGroup" AS ENUM (
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE'
);


--
-- Name: CommitteeMeetingStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CommitteeMeetingStatus" AS ENUM (
    'SCHEDULED',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: DisabilityType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DisabilityType" AS ENUM (
    'PHYSICAL',
    'VISUAL',
    'HEARING',
    'SPEECH',
    'INTELLECTUAL',
    'MULTIPLE',
    'OTHER'
);


--
-- Name: DueStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DueStatus" AS ENUM (
    'PENDING',
    'PAID',
    'WAIVED'
);


--
-- Name: EducationLevel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EducationLevel" AS ENUM (
    'NONE',
    'PRIMARY',
    'SECONDARY_SSLC',
    'HIGHER_SECONDARY',
    'DIPLOMA',
    'GRADUATE',
    'POST_GRADUATE',
    'DOCTORATE',
    'MADRASSA_ISLAMIC',
    'VOCATIONAL',
    'OTHER'
);


--
-- Name: EmploymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EmploymentStatus" AS ENUM (
    'EMPLOYED',
    'SELF_EMPLOYED',
    'BUSINESS',
    'GOVERNMENT_SERVICE',
    'PRIVATE_SECTOR',
    'DAILY_WAGE',
    'JOB_SEEKER',
    'STUDENT',
    'HOMEMAKER',
    'RETIRED',
    'UNABLE_TO_WORK'
);


--
-- Name: FormFieldType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FormFieldType" AS ENUM (
    'TEXT',
    'LONG_TEXT',
    'NUMBER',
    'PHONE',
    'EMAIL',
    'DATE',
    'TIME',
    'SELECT',
    'MULTI_SELECT',
    'RADIO',
    'CHECKBOX',
    'FILE_UPLOAD',
    'ADDRESS',
    'MEMBER_LOOKUP',
    'FAMILY_LOOKUP',
    'HOUSE_LOOKUP'
);


--
-- Name: FormVersionStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FormVersionStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED'
);


--
-- Name: Gender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


--
-- Name: HealthConditionStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."HealthConditionStatus" AS ENUM (
    'NO_KNOWN_CONDITION',
    'HAS_CONDITION',
    'NOT_DISCLOSED'
);


--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'ISSUED',
    'PAID',
    'OVERDUE',
    'VOID'
);


--
-- Name: MaritalStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MaritalStatus" AS ENUM (
    'SINGLE',
    'MARRIED',
    'WIDOWED',
    'DIVORCED'
);


--
-- Name: MovementStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MovementStatus" AS ENUM (
    'RESIDENT',
    'MIGRATED',
    'MOVED_OUT',
    'DECEASED'
);


--
-- Name: OnboardingStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OnboardingStatus" AS ENUM (
    'DRAFT',
    'IN_PROGRESS',
    'REVIEW',
    'COMPLETED'
);


--
-- Name: PlatformRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PlatformRole" AS ENUM (
    'SUPER_ADMIN',
    'PLATFORM_STAFF',
    'PLATFORM_SUPPORT'
);


--
-- Name: PropertyType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PropertyType" AS ENUM (
    'WAQF',
    'ASSET',
    'RENTED'
);


--
-- Name: RelationToHead; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RelationToHead" AS ENUM (
    'HEAD',
    'SPOUSE',
    'SON',
    'DAUGHTER',
    'PARENT',
    'SIBLING',
    'OTHER'
);


--
-- Name: SalaryStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SalaryStatus" AS ENUM (
    'PENDING',
    'PAID'
);


--
-- Name: ServiceRequestStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ServiceRequestStatus" AS ENUM (
    'SUBMITTED',
    'IN_REVIEW',
    'APPROVED',
    'REJECTED',
    'COMPLETED'
);


--
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'TRIAL',
    'ACTIVE',
    'PAST_DUE',
    'SUSPENDED',
    'CANCELLED',
    'EXPIRED'
);


--
-- Name: SupportStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SupportStatus" AS ENUM (
    'ACTIVE',
    'MONITORING',
    'RESOLVED'
);


--
-- Name: VoucherType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VoucherType" AS ENUM (
    'RECEIPT',
    'PAYMENT'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _MeetingAttendees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_MeetingAttendees" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcements (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    audience public."AnnouncementAudience" DEFAULT 'ALL'::public."AnnouncementAudience" NOT NULL,
    "targetDivisionId" text
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "actorUserId" text,
    "tenantId" text,
    action text NOT NULL,
    "targetType" text,
    "targetId" text,
    metadata jsonb,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: certificate_counters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certificate_counters (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "registerType" text NOT NULL,
    "lastNumber" integer DEFAULT 0 NOT NULL
);


--
-- Name: committee_decisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.committee_decisions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "meetingId" text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: committee_meetings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.committee_meetings (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    "meetingDate" timestamp(3) without time zone NOT NULL,
    location text,
    agenda text,
    minutes text,
    status public."CommitteeMeetingStatus" DEFAULT 'SCHEDULED'::public."CommitteeMeetingStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: committee_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.committee_members (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "memberId" text NOT NULL,
    designation text NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "termStart" timestamp(3) without time zone,
    "termEnd" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: death_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.death_records (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "memberId" text,
    "deceasedName" text NOT NULL,
    "fatherOrGuardianName" text,
    gender public."Gender",
    "dateOfBirth" timestamp(3) without time zone,
    "dateOfDeath" timestamp(3) without time zone NOT NULL,
    "placeOfDeath" text,
    "causeOfDeath" text,
    "burialDate" timestamp(3) without time zone,
    remarks text,
    "certificateNumber" text,
    "certificateIssuedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: divorce_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divorce_records (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "husbandName" text NOT NULL,
    "husbandMemberId" text,
    "wifeName" text NOT NULL,
    "wifeMemberId" text,
    "divorceType" text,
    "divorceDate" timestamp(3) without time zone NOT NULL,
    place text,
    "officiantName" text,
    remarks text,
    "certificateNumber" text,
    "certificateIssuedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_registrations (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "eventId" text NOT NULL,
    "memberId" text,
    "participantName" text NOT NULL,
    "participantPhone" text,
    attended boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    description text,
    location text,
    "startsAt" timestamp(3) without time zone NOT NULL,
    "endsAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: families; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.families (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "houseId" text,
    "familyNumber" text,
    notes text,
    "requiresCommunitySupport" boolean DEFAULT false NOT NULL,
    "supportCategory" text,
    "supportStatus" public."SupportStatus" DEFAULT 'ACTIVE'::public."SupportStatus",
    "supportNotes" text,
    "emergencyContactName" text,
    "emergencyContactPhone" text,
    category text,
    "familyStatusId" text
);


--
-- Name: features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.features (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    description text,
    category text,
    "isEnabledGlobally" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_accounts (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    type public."AccountType" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    code text,
    "currentBalance" numeric(12,2) DEFAULT 0 NOT NULL,
    description text,
    "isSystem" boolean DEFAULT false NOT NULL,
    "openingBalance" numeric(12,2) DEFAULT 0 NOT NULL,
    "parentAccountId" text
);


--
-- Name: finance_bank_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_bank_accounts (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "accountName" text NOT NULL,
    "bankName" text NOT NULL,
    branch text,
    "accountNumber" text NOT NULL,
    ifsc text,
    "accountType" text DEFAULT 'SAVINGS'::text NOT NULL,
    "openingBalance" numeric(12,2) DEFAULT 0 NOT NULL,
    "currentBalance" numeric(12,2) DEFAULT 0 NOT NULL,
    "chartAccountId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_collection_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_collection_categories (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    code text,
    description text,
    "incomeAccountId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "defaultAmount" numeric(12,2),
    "isRecurring" boolean DEFAULT false NOT NULL,
    "recurrenceFrequency" text DEFAULT 'MONTHLY'::text,
    "targetDivisionIds" text[] DEFAULT ARRAY[]::text[],
    "targetEconomicCategory" text DEFAULT 'ALL'::text,
    "targetType" text DEFAULT 'ALL_FAMILIES'::text NOT NULL,
    "formConfig" jsonb,
    "isSubscription" boolean DEFAULT false NOT NULL,
    "targetAmount" numeric(12,2)
);


--
-- Name: finance_collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_collections (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "collectionNumber" text,
    type text NOT NULL,
    "categoryId" text,
    "familyId" text,
    "memberId" text,
    "donorName" text,
    "donorPhone" text,
    "donorAddress" text,
    "collectorName" text,
    amount numeric(12,2) NOT NULL,
    "paymentMethodId" text,
    "paymentMethod" text,
    "bankAccountId" text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reference text,
    description text,
    notes text,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    "receiptId" text,
    "journalEntryId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "attachmentUrl" text,
    "customFields" jsonb
);


--
-- Name: finance_dues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_dues (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "memberId" text NOT NULL,
    title text NOT NULL,
    amount numeric(12,2) NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    status public."DueStatus" DEFAULT 'PENDING'::public."DueStatus" NOT NULL,
    "paidVoucherId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "categoryId" text,
    "familyId" text,
    "outstandingAmount" numeric(12,2),
    "paidAmount" numeric(12,2) DEFAULT 0 NOT NULL,
    period text
);


--
-- Name: finance_expense_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_expense_categories (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    code text,
    description text,
    "expenseAccountId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_financial_years; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_financial_years (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "isCurrent" boolean DEFAULT false NOT NULL,
    "closedAt" timestamp(3) without time zone,
    "closedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_interest_free_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_interest_free_accounts (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "accountNumber" text NOT NULL,
    "holderName" text NOT NULL,
    "holderType" text DEFAULT 'MEMBER'::text NOT NULL,
    "memberId" text,
    "familyId" text,
    phone text,
    balance numeric(12,2) DEFAULT 0 NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_interest_free_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_interest_free_transactions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "accountId" text NOT NULL,
    type text NOT NULL,
    amount numeric(12,2) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reference text,
    description text,
    "balanceAfter" numeric(12,2) NOT NULL,
    "receiptNumber" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: finance_journal_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_journal_entries (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "entryNumber" text NOT NULL,
    "financialYearId" text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reference text,
    description text NOT NULL,
    "sourceType" text DEFAULT 'MANUAL'::text NOT NULL,
    "sourceId" text,
    status text DEFAULT 'POSTED'::text NOT NULL,
    "totalDebit" numeric(12,2) NOT NULL,
    "totalCredit" numeric(12,2) NOT NULL,
    "postedAt" timestamp(3) without time zone,
    "postedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_journal_entry_lines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_journal_entry_lines (
    id text NOT NULL,
    "journalEntryId" text NOT NULL,
    "accountId" text NOT NULL,
    debit numeric(12,2) DEFAULT 0 NOT NULL,
    credit numeric(12,2) DEFAULT 0 NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: finance_payment_methods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_payment_methods (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    type text DEFAULT 'CASH'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "requiresReference" boolean DEFAULT false NOT NULL,
    "requiresChequeNumber" boolean DEFAULT false NOT NULL,
    "requiresBankDetails" boolean DEFAULT false NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_receipts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_receipts (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "receiptNumber" text NOT NULL,
    "voucherId" text,
    "dueId" text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "receivedFrom" text NOT NULL,
    "categoryName" text,
    amount numeric(12,2) NOT NULL,
    "paymentMethod" text,
    reference text,
    description text,
    "recordedBy" text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "cancelledAt" timestamp(3) without time zone,
    "cancelledReason" text,
    "cancelledBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_salary_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_salary_records (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffName" text NOT NULL,
    month text NOT NULL,
    amount numeric(12,2) NOT NULL,
    status public."SalaryStatus" DEFAULT 'PENDING'::public."SalaryStatus" NOT NULL,
    "paidVoucherId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    allowances numeric(12,2),
    "approvalStatus" text DEFAULT 'PAID'::text NOT NULL,
    "basicSalary" numeric(12,2),
    deductions numeric(12,2),
    "netSalary" numeric(12,2),
    "paymentDate" timestamp(3) without time zone,
    "paymentMethod" text,
    reference text
);


--
-- Name: finance_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_settings (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    "financialYearStartMonth" integer DEFAULT 4 NOT NULL,
    "financialYearStartDay" integer DEFAULT 1 NOT NULL,
    "defaultCollectionDescription" text,
    "defaultPaymentMethodId" text,
    "defaultCashAccountId" text,
    "defaultBankAccountId" text,
    "receiptPrefix" text DEFAULT 'RCP'::text NOT NULL,
    "receiptStartNumber" integer DEFAULT 1 NOT NULL,
    "receiptDigits" integer DEFAULT 6 NOT NULL,
    "voucherPrefix" text DEFAULT 'VCH'::text NOT NULL,
    "voucherStartNumber" integer DEFAULT 1 NOT NULL,
    "voucherDigits" integer DEFAULT 6 NOT NULL,
    "defaultSalaryExpenseAccountId" text,
    "defaultCollectionIncomeAccountId" text,
    "defaultDonationIncomeAccountId" text,
    "defaultGeneralExpenseAccountId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_tax_legal_filings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_tax_legal_filings (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    "filingType" text NOT NULL,
    period text,
    "dueDate" timestamp(3) without time zone NOT NULL,
    amount numeric(12,2),
    status text DEFAULT 'PENDING'::text NOT NULL,
    "paymentDate" timestamp(3) without time zone,
    reference text,
    notes text,
    "documentUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: finance_vouchers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_vouchers (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "voucherNumber" text,
    type public."VoucherType" NOT NULL,
    "accountId" text NOT NULL,
    "memberId" text,
    date timestamp(3) without time zone NOT NULL,
    amount numeric(12,2) NOT NULL,
    "partyName" text,
    "paymentMethod" text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "eventId" text,
    "approvedAt" timestamp(3) without time zone,
    "approvedBy" text,
    "attachmentUrl" text,
    "bankAccountId" text,
    "expenseCategoryId" text,
    "journalEntryId" text,
    notes text,
    "paidAt" timestamp(3) without time zone,
    "payeeName" text,
    "receiptId" text,
    reference text,
    status text DEFAULT 'PAID'::text NOT NULL,
    "voucherSubtype" text DEFAULT 'PAYMENT'::text
);


--
-- Name: form_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_assignments (
    id text NOT NULL,
    "templateId" text NOT NULL,
    "tenantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: form_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_fields (
    id text NOT NULL,
    "versionId" text NOT NULL,
    key text NOT NULL,
    label text NOT NULL,
    type public."FormFieldType" NOT NULL,
    description text,
    required boolean DEFAULT false NOT NULL,
    "order" integer NOT NULL,
    options jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: form_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_templates (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    description text,
    category text,
    "isPlatformWide" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: form_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_versions (
    id text NOT NULL,
    "templateId" text NOT NULL,
    version integer NOT NULL,
    status public."FormVersionStatus" DEFAULT 'DRAFT'::public."FormVersionStatus" NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: grave_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grave_records (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "deathRecordId" text,
    "deceasedName" text NOT NULL,
    "plotNumber" text NOT NULL,
    section text,
    "burialDate" timestamp(3) without time zone NOT NULL,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: houses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.houses (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "divisionId" text,
    "displayNumber" text NOT NULL,
    address text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    name text,
    notes text
);


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "subscriptionId" text,
    "amountMinor" integer NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    status public."InvoiceStatus" DEFAULT 'DRAFT'::public."InvoiceStatus" NOT NULL,
    description text,
    "issuedAt" timestamp(3) without time zone,
    "dueAt" timestamp(3) without time zone,
    "paidAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: madrassa_enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.madrassa_enrollments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentName" text NOT NULL,
    "studentMemberId" text,
    "guardianName" text,
    "guardianPhone" text,
    "className" text,
    "admissionDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: mahallu_release_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mahallu_release_records (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "memberId" text,
    "memberName" text NOT NULL,
    "familyId" text,
    "releaseDate" timestamp(3) without time zone NOT NULL,
    reason text,
    "destinationMahallu" text,
    remarks text,
    "certificateNumber" text,
    "certificateIssuedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: marriage_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marriage_records (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "groomName" text NOT NULL,
    "groomFatherName" text,
    "groomMemberId" text,
    "brideName" text NOT NULL,
    "brideFatherName" text,
    "brideMemberId" text,
    "marriageDate" timestamp(3) without time zone NOT NULL,
    place text,
    "officiantName" text,
    "witness1Name" text,
    "witness2Name" text,
    "mahrDetails" text,
    remarks text,
    "certificateNumber" text,
    "certificateIssuedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: member_health_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_health_profiles (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "memberId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."HealthConditionStatus" DEFAULT 'NO_KNOWN_CONDITION'::public."HealthConditionStatus" NOT NULL,
    "hasDisability" boolean DEFAULT false NOT NULL,
    "disabilityType" public."DisabilityType",
    "disabilityPercentage" integer,
    "disabilityCertificate" boolean DEFAULT false NOT NULL,
    "disabilityCertificateNo" text,
    "hasChronicIllness" boolean DEFAULT false NOT NULL,
    "chronicConditions" text[] DEFAULT ARRAY[]::text[],
    "chronicDetails" text,
    "treatmentRequired" boolean DEFAULT false NOT NULL,
    "regularMedicationRequired" boolean DEFAULT false NOT NULL,
    "requiresMentalHealthSupport" boolean DEFAULT false NOT NULL,
    "mentalHealthSupportType" text,
    "requiresAssistance" boolean DEFAULT false NOT NULL,
    "assistanceTypes" text[] DEFAULT ARRAY[]::text[],
    "primaryCaregiverName" text,
    "caregiverRelationship" text,
    "emergencyContactName" text,
    "emergencyContactPhone" text,
    "requiresCommunitySupport" boolean DEFAULT false NOT NULL,
    "supportCategory" text,
    "supportStatus" public."SupportStatus" DEFAULT 'ACTIVE'::public."SupportStatus" NOT NULL,
    "supportNotes" text,
    "lastSupportDate" timestamp(3) without time zone
);


--
-- Name: member_otps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_otps (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "memberId" text NOT NULL,
    "codeHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    "consumedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.members (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "fullName" text NOT NULL,
    email text,
    phone text,
    address text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "familyId" text,
    "bloodGroup" public."BloodGroup",
    "dateOfBirth" timestamp(3) without time zone,
    "expatriateContact" text,
    "expatriateCountry" text,
    "expatriateOccupation" text,
    gender public."Gender",
    "guardianName" text,
    "guardianPhone" text,
    "idNumber" text,
    "isExpatriate" boolean DEFAULT false NOT NULL,
    "isYatheem" boolean DEFAULT false NOT NULL,
    "maritalStatus" public."MaritalStatus",
    "movementDate" timestamp(3) without time zone,
    "movementNotes" text,
    "movementStatus" public."MovementStatus" DEFAULT 'RESIDENT'::public."MovementStatus" NOT NULL,
    occupation text,
    "relationToHead" public."RelationToHead",
    "educationLevel" public."EducationLevel",
    "educationDetails" text,
    institution text,
    "employmentStatus" public."EmploymentStatus",
    "jobTitle" text,
    "employerOrBusiness" text,
    skills text[] DEFAULT ARRAY[]::text[],
    "isJobSeeker" boolean DEFAULT false NOT NULL,
    "educationHistory" jsonb
);


--
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_settings (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "notifyOnNewServiceRequest" boolean DEFAULT true NOT NULL,
    "notifyOnNewDue" boolean DEFAULT true NOT NULL,
    "eventReminderDaysBefore" integer,
    "smsEnabled" boolean DEFAULT false NOT NULL,
    "smsProviderName" text,
    "smsSenderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: onboarding_drafts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.onboarding_drafts (
    id text NOT NULL,
    "userId" text NOT NULL,
    status public."OnboardingStatus" DEFAULT 'DRAFT'::public."OnboardingStatus" NOT NULL,
    "currentStep" text DEFAULT 'mahalle'::text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "invoiceId" text,
    "amountMinor" integer NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    method text NOT NULL,
    reference text,
    "recordedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    key text NOT NULL,
    category text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: plan_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plan_features (
    id text NOT NULL,
    "planId" text NOT NULL,
    "featureId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plans (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    description text,
    "priceMinor" integer,
    currency text DEFAULT 'INR'::text NOT NULL,
    "billingPeriod" public."BillingPeriod" DEFAULT 'MONTHLY'::public."BillingPeriod" NOT NULL,
    "userLimit" integer,
    "memberLimit" integer,
    "storageLimitMb" integer,
    "smsCredits" integer,
    "supportLevel" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: platform_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_memberships (
    id text NOT NULL,
    "userId" text NOT NULL,
    role public."PlatformRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.programs (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: property_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.property_records (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "propertyType" public."PropertyType" NOT NULL,
    name text NOT NULL,
    location text,
    "areaDetails" text,
    "lesseeName" text,
    "lesseePhone" text,
    "rentAmount" text,
    "acquisitionDate" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "replacedById" text,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id text NOT NULL,
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    "isSystem" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: service_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_requests (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "requestType" text NOT NULL,
    "memberId" text,
    "requesterName" text NOT NULL,
    "requesterPhone" text,
    subject text NOT NULL,
    description text,
    "eventId" text,
    "registerType" text,
    "registerRecordId" text,
    status public."ServiceRequestStatus" DEFAULT 'SUBMITTED'::public."ServiceRequestStatus" NOT NULL,
    "assignedToUserId" text,
    "resolutionNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "planId" text NOT NULL,
    status public."SubscriptionStatus" DEFAULT 'TRIAL'::public."SubscriptionStatus" NOT NULL,
    "trialEndsAt" timestamp(3) without time zone,
    "currentPeriodEnd" timestamp(3) without time zone,
    "cancelledAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tenant_divisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_divisions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    code text,
    description text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tenant_family_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_family_statuses (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    code text,
    color text DEFAULT 'emerald'::text,
    description text,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tenant_feature_overrides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_feature_overrides (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "featureId" text NOT NULL,
    "isEnabled" boolean NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tenant_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_memberships (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    "roleId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text,
    "addressLine1" text,
    "addressLine2" text,
    "contactEmail" text,
    "contactPhone" text,
    country text,
    "coverImageUrl" text,
    district text,
    "divisionTerm" text,
    "hasDivisions" boolean DEFAULT false NOT NULL,
    "houseNumberingMethod" text,
    "imamName" text,
    "khatheebName" text,
    latitude double precision,
    "localBody" text,
    "localBodyType" text,
    "logoUrl" text,
    longitude double precision,
    "masjidAddress" text,
    "masjidName" text,
    "masjidPhone" text,
    "pinCode" text,
    place text,
    "presidentName" text,
    "presidentPhone" text,
    "secretaryName" text,
    "secretaryPhone" text,
    state text,
    "treasurerName" text,
    "treasurerPhone" text,
    website text,
    "houseNumberAllowManual" boolean DEFAULT true NOT NULL,
    "houseNumberMinDigits" integer,
    "houseNumberPrefix" text,
    "houseNumberStartAt" integer,
    "houseNumberSuffix" text,
    "familyStatusTerm" text DEFAULT 'Category'::text,
    "hasFamilyStatuses" boolean DEFAULT false NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "fullName" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    phone text
);


--
-- Data for Name: _MeetingAttendees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."_MeetingAttendees" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
af021251-185f-4b0f-9984-f3988b7be729	0232bb348d3ba3e1fdfd08a8c44dc632fa4fb2b2278e3191c3973920db4b45e3	2026-09-13 16:26:06.370604+00	20260913215600_complete_finance_accounting	\N	\N	2026-09-13 16:26:06.311757+00	1
6cebf791-3ed4-45ac-8c44-1071a2a15846	127eb422ac5a114db39740bf13df4001c29af6392f2cf8080c9e0246e92e8b20	2026-09-10 08:16:10.366179+00	20260910081610_init	\N	\N	2026-09-10 08:16:10.345257+00	1
bddf235a-c75f-4f93-a326-a3b5e69b53e6	f4c77e4c40ea89ff72c4ea070bdc20a4596a616b834c6651d78f5cae0af06b35	2026-09-12 17:00:48.125083+00	20260912170048_services_module	\N	\N	2026-09-12 17:00:48.116653+00	1
e99a445f-2e4a-4803-ac13-e760059c9f0c	13c496a3eea380819cfb51cef087d311f72bb2f2c04c98fdfd23fcae3f0d2452	2026-09-10 08:31:25.457098+00	20260910083125_add_refresh_tokens	\N	\N	2026-09-10 08:31:25.44852+00	1
6b60b513-488a-43d4-87de-fd62612612f8	2652f4b77f17b68f8550660fb7dc604a3ceba11a9c928815e6ecab55288ab7a6	2026-09-10 10:15:55.578417+00	20260910101555_add_members	\N	\N	2026-09-10 10:15:55.572686+00	1
52303ebe-e1a9-498c-808a-a25d65c6ad8e	91f65ff4b442810cee8f4a9c8da6f67fae150791432b71cb9036abeee56a2d48	2026-09-10 10:30:24.807684+00	20260910103024_add_families_events_announcements_programs	\N	\N	2026-09-10 10:30:24.796705+00	1
953a59af-b7e6-469d-b816-25c08de3666a	b24deaedc6898247d24cd2f1da4dbf76554eefe1ef2d81231381df6994721c5d	2026-09-12 17:06:36.082454+00	20260912170636_events_depth	\N	\N	2026-09-12 17:06:36.07447+00	1
61f2aef2-02b7-41a6-b80a-686d6f2d2e40	67ce72a421b9f5d8713a251af16df1954fb1d7ba2db382fe3d5915cacfaaff27	2026-09-10 12:28:02.005403+00	20260910122802_add_tenant_description	\N	\N	2026-09-10 12:28:02.00388+00	1
3521ee20-1028-4162-bc7d-74df59c0733f	bf1a2f9dfc58d48f478e196d87a10284491b87fd29673f69abc69c2c9792a903	2026-09-10 14:07:05.642229+00	20260910140701_add_member_otp_login	\N	\N	2026-09-10 14:07:05.628123+00	1
786aa9c6-9568-4c7b-b570-6d6de64b1bb8	f607f6c4a29f34477928c474d1cbe254473c7d743083faadfb8fbaa64a4b787d	2026-09-10 14:30:40.11931+00	20260910143039_add_member_family	\N	\N	2026-09-10 14:30:40.109905+00	1
f9adffa5-3f46-44b4-9315-95826ee7ffdc	8cbbda4bfc8bf7a024041064713b80105a04ce644ac61d0e3cb24690249ec76d	2026-09-12 17:12:53.575267+00	20260912171253_communication_module	\N	\N	2026-09-12 17:12:53.568344+00	1
e0402a25-57b0-4967-8938-054eb65b0880	959f844c4c42d85845bbe7afdca4dfa84d758685147a622b027d39a9011a5b81	2026-09-12 14:35:04.126917+00	20260912143504_onboarding_wizard_fields	\N	\N	2026-09-12 14:35:04.112336+00	1
7183c2ad-066a-44f1-baee-d656e73761aa	faedb9967c366ecf6430ae8fa7b309831a2580374465e74386696e47a1523d69	2026-09-12 15:26:18.962449+00	20260912152618_houses_and_structure	\N	\N	2026-09-12 15:26:18.955873+00	1
c541fb85-5075-43dc-be32-fe1a8c7686d6	fcc3ab47ab39577f7d54c29830f042afa92d44738f7b596b79b3be91896f77a6	2026-09-14 07:55:04.296693+00	20260914130500_education_employment_health_support	\N	\N	2026-09-14 07:55:04.269589+00	1
fd3b5c19-5572-4ab4-bd8f-ee44f4cba0f4	37cd07d4227bf210b69f98f23c65729198eeebf4dd3a741dd3b1be86dabb0401	2026-09-12 15:56:42.84656+00	20260912155642_people_depth_registers	\N	\N	2026-09-12 15:56:42.839111+00	1
584fbaf1-8c27-4ee7-890c-77724913ac52	68fe9a7106f15cd3195711dd6e0ca3d0f8b883f7a56280b4136254482868bd93	2026-09-13 05:39:37.155649+00	20260913053937_role_custom_support	\N	\N	2026-09-13 05:39:37.152232+00	1
d945a937-5038-4d22-83e8-1183fa684d90	5b5528b9178d2c96c015c007ccd33335d837fcb7f52bf82ae900a1fe66ac7db5	2026-09-12 16:20:36.359751+00	20260912162036_committee_module	\N	\N	2026-09-12 16:20:36.345944+00	1
11ecc2b3-102c-4b7c-a896-beccf66e955e	f2820d1a8caeb9c94cc65ceade7e2e869ec78eb90152991c6abff8c64cf2c788	2026-09-12 16:35:36.429255+00	20260912163536_registers_module	\N	\N	2026-09-12 16:35:36.400449+00	1
c9ba31e5-7a88-490a-8b4f-cd8bf2ef8dc7	8c6c43ca22d00b65f10e354685c41297f29793637ac8e09879d4f8fbae027983	2026-09-12 16:50:00.645671+00	20260912165000_finance_module	\N	\N	2026-09-12 16:50:00.625577+00	1
f113941f-6bd0-4e6e-a08b-f165824b58c0	63c4837d23244b0191d7a47645feaede3676b4ae9ac9ad65c559a16c6b701e43	2026-09-13 05:47:33.072595+00	20260913054724_structure_house_family_extensions	\N	\N	2026-09-13 05:47:33.063795+00	1
426ff1b2-41d1-46e4-b860-71bf79e7ed72	fa620b3c7d9b1727b096f6a94c07700093a64d9345a44f0867e8ba1a5b2c8c16	2026-09-13 05:47:41.889893+00	20260913054741_add_forms	\N	\N	2026-09-13 05:47:41.873588+00	1
30708ca4-cde7-429a-ab06-a86232baed8a	3230ef2fec01018f2ca24e9c21bfa21cef7323747ed9cc9e59d619b02529a8ea	2026-09-13 06:01:43.629096+00	20260913060143_add_features	\N	\N	2026-09-13 06:01:43.61421+00	1
dd9f11c1-2b46-474d-b8a2-77ee75a97532	47487084bf159c7162ae9018787d22fe244ae19e1b9aa3b637fb25eb8dadb777	2026-09-13 06:21:04.574541+00	20260913062104_add_plans_billing	\N	\N	2026-09-13 06:21:04.557877+00	1
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.announcements (id, "tenantId", title, body, "publishedAt", "isActive", "createdAt", "updatedAt", audience, "targetDivisionId") FROM stdin;
cmtx322y2008iuey33l4hxxww	cmtv96wxe000wue7w59ewld1m	test	test	2026-09-11 15:00:17.642	f	2026-09-11 15:00:17.642	2026-09-13 05:40:52.675	ALL	\N
cmtzf2h6n006kueouz876wrr5	cmtv96wxe000wue7w59ewld1m	cds	vxz	2026-09-13 06:12:03.839	t	2026-09-13 06:12:03.839	2026-09-13 06:12:03.839	ALL	\N
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, "actorUserId", "tenantId", action, "targetType", "targetId", metadata, "ipAddress", "userAgent", "createdAt") FROM stdin;
cmu72dabs00fnueok25zwcwgd	cmtv96wx6000tue7wfg2rfzuu	cmtyh4tr8002yuebkqxkrgukw	platform.user.assign_tenant	User	cmtv96x5n0057ue7wcl3a27w0	{"email": "owner@demo.mahalle.local", "roleKey": "ADMIN", "tenantSlug": "mahalle"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:38:42.569
cmu72duxc00lbueok5lj4irnp	cmtv96wx6000tue7wfg2rfzuu	cmtyh4tr8002yuebkqxkrgukw	platform.user.remove_tenant	User	cmtv96x5n0057ue7wcl3a27w0	{"email": "owner@demo.mahalle.local", "tenantId": "cmtyh4tr8002yuebkqxkrgukw"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:39:09.265
cmu82kylz0043uezxdy4leyd1	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:32:26.807
cmu864l6b0043ue9torsow058	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:11:41.361
cmtva0fll000gue72dmujrzxt	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789029563759-440192@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:39:25.689
cmtva0flo000iue725wi084nc	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789029563759-440192@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:39:25.692
cmtvakxa6000gue80wibffr13	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789030520322-152050@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:55:21.727
cmtvakxa9000iue804bbobi36	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789030520322-152050@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:55:21.729
cmtvan3aq000gueeupk4016iy	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789030621375-845397@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:57:02.834
cmtvan3as000iueeu4h1z6pmj	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789030621375-845397@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:57:02.836
cmu72ey1u0043ue6b80qgj92w	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.terminate_sessions	User	cmtv96x5n0057ue7wcl3a27w0	{"email": "owner@demo.mahalle.local"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:39:59.971
cmu82qw7p00hpuezx5yj2ht06	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.create	Voucher	cmu82qw7f00hnuezxxemn3hnp	{"amount": "100.00", "status": "DRAFT", "voucherNumber": "VCH-00003"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:37:03.637
cmu82r34q00mruezx1jap81oc	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.submit	Voucher	cmu82qw7f00hnuezxxemn3hnp	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:37:12.602
cmu86eutt00w1ue9t9436523e	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:19:40.433
cmtvb3lo8000gueeddwuzge61	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789031391756-574172@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:09:53.145
cmtvb3lob000iueed3lsxftjk	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789031391756-574172@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:09:53.147
cmtwz9c49003juey3nnvfkgei	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:13:57.657
cmtvdrve6000cuekjtorwfjxh	\N	\N	auth.register	User	cmtvdrve5000auekj1actbjuc	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.718
cmtwz9ofb003nuey3d3rc6fvp	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8w4n002zuedoz7t6ex5t	{"bulk": true, "name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789132416075-155087"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.607
cmtwz9ofh003puey3xifmx3z4	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8w4e000juedlbdi1emk8	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789132416075-885536"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.613
cmtwz9ofk003ruey3diyszg6z	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8w46002zuedpj0m2lfod	{"bulk": true, "name": "E2E Members Tenant B", "slug": "e2e-members-b-1789132416074-25677"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.617
cmtwz9ofo003tuey30uv3mw3k	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8w44000fuedqvpq1ylhz	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789132416075-91189"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.621
cmtvdrvea000cuekk3jdvuzzh	\N	\N	auth.register	User	cmtvdrve8000auekkf9x5bj8j	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.723
cmtvdrw99000puekhtk29wsv6	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:45.838
cmtwz9ofs003vuey3jl25wgtq	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8w43000fuedo7sj9l3ht	{"bulk": true, "name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789132416075-155087"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.625
cmtvdrw3g000luekhwlctdgnc	\N	\N	auth.register	User	cmtvdrw3e000juekhl1k80u25	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:45.628
cmtwz9ofy003xuey3609j8c22	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8w3s000fuednta55b0ui	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789132416075-517458"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.631
cmtwz9og3003zuey3soex4v05	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8w3m000fuedpx2lztn6w	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789132416074-25677"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.635
cmtwz9og80041uey3qi2zoyht	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8qem002zuecb6okedhf5	{"bulk": true, "name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789132408620-985577"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.641
cmtwz9ogc0043uey35ankxxmp	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8qel002zueccbw7640kz	{"bulk": true, "name": "E2E Members Tenant B", "slug": "e2e-members-b-1789132408619-649472"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.644
cmtwz9ogh0045uey32q78s45y	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8qe8000juec8lutedw0u	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789132408619-200997"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.649
cmtwz9ogl0047uey3vl10jfqi	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8qe3000fuecbi1pskq6w	{"bulk": true, "name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789132408620-985577"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.654
cmtwz9ogr0049uey3qv0fzg9m	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8qe0000fuecc24ob5z4s	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789132408619-649472"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.659
cmtwz9ogw004buey30yspcrm1	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8qdq000fueca6qk2glxc	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789132408619-641554"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.664
cmtwz9oh0004duey3hyvcvfto	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwz8qdn000fuecdmis7pbks	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789132408620-202374"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:14:13.669
cmtvdrwfv000zuekhl62uy5nf	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:46.076
cmtve6mne0002uesce3qikyov	\N	\N	auth.register	User	cmtve6mnc0000uescss5f8g9o	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.227
cmtvb3l6n0008ueedcz1bj1sb	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031391756-574172@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:09:52.511
cmu72f0rs0045ue6bc61y85ui	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.terminate_sessions	User	cmtv96wx6000tue7wfg2rfzuu	{"email": "platform-admin@mahalle.local"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:40:03.496
cmu82r4ll00rtuezx3uhiby81	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.approve	Voucher	cmu82qw7f00hnuezxxemn3hnp	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:37:14.506
cmu82r7c300x2uezxbx8tny3m	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.pay	Voucher	cmu82qw7f00hnuezxxemn3hnp	{"amount": "100.00", "voucherNumber": "VCH-00003"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:37:18.052
cmu86vxg503w2ue9tp0k99ecr	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	collections.create	FinanceCollection	cmu86vxfx03w0ue9tjvokzjhq	{"type": "DONATION", "amount": "1000.00", "receiptNumber": "RCP-00004", "collectionNumber": "COL-00004"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:32:56.981
cmtwzecjs004fuey3gtw1v8c1	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.tenant.suspend	Tenant	cmtv96wxe000wue7w59ewld1m	{"name": "Demo Mahalle", "slug": "demo"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:17:51.496
cmtvct6gq0033uepkyksiqyh8	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 09:57:46.106
cmtwzf5b5004juey3zzpwh7q6	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:18:28.769
cmtvcywdd000guew83c9lwbnn	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789034531528-786756@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.961
cmtvcywdf000iuew8isz41jf5	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789034531528-786756@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.964
cmtyobxvq0068uenjpdf89hzq	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:43:35.75
cmtzgjsk0000hueshhzfmorz0	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:53:31.345
cmtvbn8vr000vuewlqq5mc1m6	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:25:09.688
cmtvbn8w0000zuewlj6mx2a1p	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:25:09.697
cmtwzekz2004huey3072e2obs	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.tenant.activate	Tenant	cmtv96wxe000wue7w59ewld1m	{"name": "Demo Mahalle", "slug": "demo"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:18:02.415
cmtyoci60006euenjpuf63emg	\N	cmtv96wxe000wue7w59ewld1m	member.otp.request	Member	cmtxus7k7000tuetvqqxr667b	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:44:02.041
cmtzgq0db0001uex1tidtpwgq	\N	\N	auth.login.failed	\N	\N	{"email": "info@eucodes.in"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:58:21.408
cmtzgq5b30003uex10dkcjt2u	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:58:27.807
cmtzo689k0003ue29o173ktxa	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.division.reactivate	TenantDivision	cmtzny68j0007uekqyf0b6ral	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:26:55.449
cmtzzrwfq0019ueix69pyedi2	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"divisionTerm": "", "hasDivisions": false, "houseNumberPrefix": "KBD", "houseNumberingMethod": "GLOBAL", "previousDivisionTerm": "Zone", "previousHouseNumberingMethod": "PER_DIVISION"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:51:42.326
cmu0z1t1t004buevcec4e0p8k	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.update	House	cmu0z10k3003juevciq5e67sc	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:19:11.058
cmu0z1t2f004duevczh852j62	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmu0z10kt003puevcm46p3ge0	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:19:11.08
cmu1io742004vue5lo8j2rfir	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:28:28.418
cmu717cbh0047uefsk8k1ukkc	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:06:05.595
cmtve6n19002yuescjb3vz91i	\N	\N	tenant.create	Tenant	cmtve6n0v000fuescnjyb57ub	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789036572276-912031"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.726
cmtve6n1k0032uescf8baoghs	\N	\N	tenant.admin.add	TenantMembership	cmtve6n1i0030uescf1mkq2xh	{"email": "e2e-admins-member-1789036572276-912031@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.737
cmtve6n1s0036uesc2ybu29c8	\N	\N	tenant.admin.add	TenantMembership	cmtve6n1q0034uescwg0bcf0y	{"email": "e2e-admins-promoted-1789036572276-912031@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.745
cmtve6n3d003auescmuhdo9pj	\N	\N	tenant.admin.remove	TenantMembership	cmtve6n1q0034uescwg0bcf0y	{"removedRole": "ADMIN", "removedUserId": "cmtve6n0k000auesczdt91gwq"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.802
cmtve6mnh0002uesekojv7uzn	\N	\N	auth.register	User	cmtve6mnf0000ueseof7wtbgz	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.23
cmtve6n1d002yueseujgfpj75	\N	\N	tenant.create	Tenant	cmtve6n0z000fueser0y4zml4	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789036572277-393567"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.729
cmtve6n22005muesep3i646p6	\N	\N	tenant.admin.add	TenantMembership	cmtve6n1z005kuesef75xyhaw	{"email": "e2e-members-plain-a-1789036572277-393567@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.754
cmtve6n2e005quese3ln1ro48	\N	\N	member.create	Member	cmtve6n2c005ouese7bn4kcjv	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.766
cmtve6n30005suesekecfz8bh	\N	\N	member.update	Member	cmtve6n2c005ouese7bn4kcjv	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.789
cmtve6n3g005uuesev3gb67az	\N	\N	member.delete	Member	cmtve6n2c005ouese7bn4kcjv	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.805
cmtve6mnj0002uesgn7c8lefe	\N	\N	auth.register	User	cmtve6mnh0000uesg3f22puga	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.231
cmtve6mnm0002uesbudqjb8k9	\N	\N	auth.register	User	cmtve6mnk0000uesb0cm3evxc	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.234
cmtve6mun0006uesb5ze7h3cj	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036572277-999629@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.487
cmtve6n140008uesbmj9iuldc	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036572277-999629@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.72
cmtve6n76000auesbgzuyva4n	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036572277-999629@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.939
cmtve6nd1000cuesb3ynnbcc4	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036572277-999629@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:14.149
cmtve6niu000euesbjblm9yp7	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036572277-999629@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:14.359
cmtve6mnq0002uesdhcdfxvpi	\N	\N	auth.register	User	cmtve6mno0000uesdm7c5hs6x	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.238
cmtve6n1q002yuesdgt2jcte4	\N	\N	tenant.create	Tenant	cmtve6n1c000fuesdrbumyjcf	{"name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789036572276-845338"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.742
cmtve6n2r005quesdhdzsbooc	\N	\N	family.create	Family	cmtve6n2p005ouesdn7zbuw3v	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.779
cmtve6n3j005suesd714n983i	\N	\N	family.delete	Family	cmtve6n2p005ouesdn7zbuw3v	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.808
cmtve6n46005wuesduhu7kqmz	\N	\N	event.create	Event	cmtve6n44005uuesdz3ed2qca	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.83
cmtve6n4o005yuesd2fd8nj8r	\N	\N	event.delete	Event	cmtve6n44005uuesdz3ed2qca	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.848
cmtve6mnu0002uesfof2ghch3	\N	\N	auth.register	User	cmtve6mns0000uesfk5qk4arc	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.243
cmtve6mu30007uesclw8f51m7	\N	\N	auth.register	User	cmtve6mu20005uescefn35j7v	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.468
cmtve6mu40007uesgdlho51ea	\N	\N	auth.register	User	cmtve6mu30005uesg46ym11cq	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.468
cmtve6muy002vuesg6oadv6ed	\N	\N	tenant.create	Tenant	cmtve6muh000cuesgerklag00	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789036572277-644307"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.498
cmtve6mu70007uesebtf2a1bk	\N	\N	auth.register	User	cmtve6mu60005uese3nadqqgj	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.471
cmtve6n1r005iueserfcv6mqd	\N	\N	tenant.create	Tenant	cmtve6n1h002zuese8r68fjle	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789036572277-393567"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.743
cmtve6mun0007uesfhldj89kb	\N	\N	auth.register	User	cmtve6mum0005uesfxahk4mp7	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.488
cmu72ghd00059uebce0mpxrfo	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:41:11.653
cmu86ykoo048eue9t4hiyfgod	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.bankAccount.create	FinanceBankAccount	cmu86ykok048cue9thbk8hh0h	{"masked": "XXXX XXXX 3254", "bankName": "sbi", "accountName": "Mahal"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:35:00.408
cmtve6n1h002yuesfw6thr2e6	\N	\N	tenant.create	Tenant	cmtve6n13000fuesfrjlchcpe	{"name": "E2E Tenant", "slug": "e2e-tenant-1789036572277-441424"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.734
cmtvb4wkp000guely9zcpwuve	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789031452540-493888@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.929
cmtvb4wkr000iuelytuvz7hi5	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789031452540-493888@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.932
cmtzgqdog0007uex1jtjyuwm1	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:58:38.657
cmtvb71l9000guetkj4e8pmjm	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789031552355-717150@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:12:33.742
cmtvb71lb000iuetkgyysi93m	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789031552355-717150@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:12:33.744
cmtvbn8dk000guewl7stgot2j	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789032307624-400618@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:25:09.032
cmtvbn8do000iuewln1wamcov	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789032307624-400618@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:25:09.037
cmu72gscb00dpuebcjfxlyvza	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": false}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:41:25.883
cmtvd7kdm000guev0008yfi0d	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789034935950-75187@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:57.323
cmtvd7kdo000iuev0kajm49x6	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789034935950-75187@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:57.325
cmu86z8bb04laue9tkql709sm	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.bankAccount.create	FinanceBankAccount	cmu86z8b704l8ue9tpe0qexgk	{"masked": "XXXX XXXX 7978", "bankName": "HDFC", "accountName": "HHGG"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:35:31.032
cmtve6mup0007uesdyaan8dt5	\N	\N	auth.register	User	cmtve6muo0005uesdmdn2aqmo	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.489
cmtve6n24005iuesdvcl3jiy5	\N	\N	tenant.create	Tenant	cmtve6n1v002zuesdzxop9v96	{"name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789036572276-845338"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.757
cmtve6n0m000cuescasmtwn7b	\N	\N	auth.register	User	cmtve6n0k000auesczdt91gwq	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.702
cmtvde145000cuesupos2n23r	\N	\N	auth.register	User	cmtvde144000auesuqg4w38lo	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.95
cmtvd7kdj000euev0xbm2lta3	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034935950-75187@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:57.32
cmtvd7kjg000luev0a0rnloi9	\N	\N	auth.register	User	cmtvd7kjd000juev0o6nwm0hk	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:57.533
cmtvd8rv0000gue0faf67e8pg	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789034992312-937438@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.676
cmtvd8rv2000iue0f2kbzol2v	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789034992312-937438@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.679
cmtyod7be006iuenjd4kfszeu	\N	cmtv96wxe000wue7w59ewld1m	member.otp.request	Member	cmtxus7k7000tuetvqqxr667b	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:44:34.634
cmtyoe1tk006muenjoloy9lhl	\N	cmtv96wxe000wue7w59ewld1m	member.otp.request	Member	cmtxus7k7000tuetvqqxr667b	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:45:14.169
cmtzgrh9w000duex15p2sfglz	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.create	House	cmtzgrh9q000buex1xszxwdtw	{"displayNumber": "VERIFY-1"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:59:29.972
cmtx18op8007ouey3wivpm6lk	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:09:26.541
cmu72hanf00jxuebclu5ubtzx	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:41:49.612
cmtyoygnq006ouenjqqih2d5y	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 18:01:06.515
cmtzc72nr0001uepkf6i42g5s	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 04:51:39.447
cmtzgrnlj000fuex1h3xmjjnu	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxurypj000huetvuj18pre2	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:59:38.167
cmtzgrnlk000huex1lxd9244k	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.house_changed	Family	cmtxurypj000huetvuj18pre2	{"newHouseId": "cmtzgrh9q000buex1xszxwdtw", "newHouseNumber": "VERIFY-1", "previousHouseId": null, "previousHouseNumber": null}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:59:38.169
cmtzgrufh000juex1kv71hdtc	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxurypj000huetvuj18pre2	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:59:47.022
cmtzgrufj000luex1e1rqs8q1	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.house_changed	Family	cmtxurypj000huetvuj18pre2	{"newHouseId": null, "newHouseNumber": null, "previousHouseId": "cmtzgrh9q000buex1xszxwdtw", "previousHouseNumber": "VERIFY-1"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:59:47.024
cmtzgsho6000nuex1amgq03p0	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:00:17.141
cmtzgsnhf000ruex1l7rmdten	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.deactivate	House	cmtzgrh9q000buex1xszxwdtw	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 07:00:24.675
cmtzgtoh5000tuex1r0ar8mv5	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:01:12.617
cmtzgutp3000vuex1f6z5chdm	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.52386.3 Chrome/152.0.7977.76 Safari/537.36	2026-09-13 07:02:06.038
cmtzoc4nl0005ue29bdkqhutt	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"divisionTerm": "wards", "hasDivisions": true, "houseNumberPrefix": null, "houseNumberingMethod": "PER_DIVISION", "previousDivisionTerm": "Unit", "previousHouseNumberingMethod": "NUMERIC"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:31:30.705
cmu00m1sb001bueix9vjxec84	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 16:15:08.936
cmu0zg930003jue1w5bdmh2x7	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:30:25.02
cmu1jvser0043ue2jec8iy3dx	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 18:02:22.227
cmu1jvser0045ue2jl5bfffgw	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 18:02:22.227
cmu7181u8004duefsr0js3sgd	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": false}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:06:38.673
cmtve6n2g0038uescqo84tq4j	\N	\N	tenant.admin.role_change	TenantMembership	cmtve6n1i0030uescf1mkq2xh	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.769
cmtve6n0s000cuese1iovsezc	\N	\N	auth.register	User	cmtve6n0r000aueserz9ahig3	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.708
cmtve6n0y000cuesf7cgt47tx	\N	\N	auth.register	User	cmtve6n0x000auesf2i9sodk8	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.714
cmtve6n15000cuesdlidak5xe	\N	\N	auth.register	User	cmtve6n14000auesdnmmycywy	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.721
cmtve6np2000luesbt1d956tr	\N	\N	auth.register	User	cmtve6noz000juesbzja8f4n6	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:14.582
cmtve6nuv000puesbzpgdbxof	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:14.791
cmtve6o14000vuesb41eceesq	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:15.016
cmtve6o1b000zuesbn8cq6ypz	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:15.024
cmtvebdo30002ueai9hjfp7wy	\N	\N	auth.register	User	cmtvebdny0000ueaiq1j2k2hf	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:54.868
cmtvebe3c002yueaiq6aezcjl	\N	\N	tenant.create	Tenant	cmtvebe2w000fueailscbmz2r	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789036794488-274433"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.417
cmtvebe3o0032ueai65w9ojm0	\N	\N	tenant.admin.add	TenantMembership	cmtvebe3l0030ueaizhesepyg	{"email": "e2e-admins-member-1789036794488-274433@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.428
cmtvebe3x0036ueaiu1x52u62	\N	\N	tenant.admin.add	TenantMembership	cmtvebe3v0034ueaib1zmh1qu	{"email": "e2e-admins-promoted-1789036794488-274433@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.437
cmtvebdo30002ueamr6a65n7x	\N	\N	auth.register	User	cmtvebdnw0000ueam96cbg36f	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:54.867
cmtvebdo30002ueakwxxnjq1b	\N	\N	auth.register	User	cmtvebdnw0000ueaku7zr146k	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:54.868
cmtvebe3f002yueak0co0qw70	\N	\N	tenant.create	Tenant	cmtvebe2z000fueake26e122s	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789036794488-83155"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.419
cmtvebe43005mueak0s1raehv	\N	\N	tenant.admin.add	TenantMembership	cmtvebe41005kueakqyrevpev	{"email": "e2e-members-plain-a-1789036794488-83155@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.443
cmtvebe4e005queakoxu6v5oh	\N	\N	member.create	Member	cmtvebe4d005oueakmbx4wipo	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.454
cmtvebdo30002ueaj264gq88s	\N	\N	auth.register	User	cmtvebdo00000ueajt5fmhrsh	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:54.868
cmtvebe3f002yueajpe4e4wy4	\N	\N	tenant.create	Tenant	cmtvebe30000fueajemed2rr0	{"name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789036794489-498592"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.42
cmtvebe44005mueajaqlsait7	\N	\N	tenant.admin.add	TenantMembership	cmtvebe41005kueajofwqfhxj	{"email": "e2e-biz-plain-a-1789036794489-498592@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.444
cmtx19i6d007suey3xpokfzwx	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtx160w2004ruey3f701qq62	{"name": "Dash Check Mahalle", "slug": "dash-check-mahalle"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:10:04.741
cmtyoys1c006suenj8lkfs8yl	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 18:01:21.264
cmtzc7g3e0005uepka2zpe8sd	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 04:51:56.858
cmu72hl8m00nxuebczkj76ew3	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": false}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:42:03.335
cmu88dbcg07zmue9tsixxbyqw	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.create	Voucher	cmu88dbc907zkue9t47ysl3xb	{"amount": "100.00", "status": "DRAFT", "voucherNumber": "VCH-00004"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:14:27.761
cmtzgxuql000zuex1tsz5kloh	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.52386.3 Chrome/152.0.7977.76 Safari/537.36	2026-09-13 07:04:27.357
cmtzgyeft0013uex1mzgf3h86	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:04:52.89
cmtzoc9or0007ue29qq2wpl50	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"divisionTerm": "ward", "hasDivisions": true, "houseNumberPrefix": null, "houseNumberingMethod": "PER_DIVISION", "previousDivisionTerm": "wards"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:31:37.227
cmu016z0q003fuew0vl1g4xwh	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 16:31:25.13
cmu0zylit003tue1wd988prqp	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:44:40.95
cmu718a96004huefs3om72a9g	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:06:49.578
cmtx167mm007muey3hbf6k7mi	\N	\N	event.create	Event	cmtx167mj007kuey3sthg5r6p	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 14:07:31.102
cmtvebe4f005queaj3v4ljcok	\N	\N	family.create	Family	cmtvebe4e005oueajcljxh3xs	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.456
cmtvebdo30002ueahtw1dwt6s	\N	\N	auth.register	User	cmtvebdo00000ueah5zuphvzv	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:54.868
cmtvebdw00006ueahvsya0m53	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036794488-991076@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.152
cmtvebe2k0008ueahj82k9hag	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036794488-991076@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.389
cmtvebdo50002uealz5c71x65	\N	\N	auth.register	User	cmtvebdo40000uealdwau8ish	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:54.87
cmtvebdvr0007ueakojo1pouz	\N	\N	auth.register	User	cmtvebdvo0005ueakra5v4e94	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.144
cmtvebe3t005iueakzp76vz8x	\N	\N	tenant.create	Tenant	cmtvebe3j002zueaknichqs85	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789036794488-83155"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.433
cmtvebdvw0007ueamrmd53fdt	\N	\N	auth.register	User	cmtvebdvv0005ueamq6ps56mc	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.149
cmtvebdwu002vueamv1wt6b46	\N	\N	tenant.create	Tenant	cmtvebdwb000cueamkjkuyw33	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789036794488-906780"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.182
cmtvebdvy0007ueai6e7okjlf	\N	\N	auth.register	User	cmtvebdvx0005ueaibevdwgcz	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.15
cmtvebdw00007ueajm2xpifzh	\N	\N	auth.register	User	cmtvebdvz0005ueajgknm9xgu	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.153
cmtvebe3t005iueaj6giga718	\N	\N	tenant.create	Tenant	cmtvebe3k002zueajfwi8mael	{"name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789036794489-498592"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.433
cmtvebdwc0007uealzidfv0zt	\N	\N	auth.register	User	cmtvebdwb0005ueal4ppg1ucd	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.165
cmtvebe3m002yuealuc7vkv92	\N	\N	tenant.create	Tenant	cmtvebe37000fuealz1qn18qp	{"name": "E2E Tenant", "slug": "e2e-tenant-1789036794488-331358"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.427
cmtvebe2o000cueai7ds8vfnw	\N	\N	auth.register	User	cmtvebe2o000aueaib0f0p248	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.393
cmtvebe4n0038ueaimp2xs7am	\N	\N	tenant.admin.role_change	TenantMembership	cmtvebe3l0030ueaizhesepyg	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.464
cmtvebe2r000cueakakn12ni1	\N	\N	auth.register	User	cmtvebe2q000aueakj9rzduhp	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.395
cmtvebe2t000cueajo7jtzjwh	\N	\N	auth.register	User	cmtvebe2s000aueaju1syl1n0	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.397
cmtvebe31000cuealc2xm42lm	\N	\N	auth.register	User	cmtvebe30000auealsbxhqxl2	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.406
cmtvebf3s000vueahrcf9icj0	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:56.728
cmtvebf3y000zueah58d45q3q	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:56.735
cmtvitwvu0002uerqe314ifin	\N	\N	auth.register	User	cmtvitwvq0000uerqcjae2wbz	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 12:46:18.043
cmtvkddos005muerqmvgeaj1c	\N	\N	auth.login.failed	\N	\N	{"email": "test@mahall.in"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:29:25.9
cmtvkdgtc005ouerq4oo3x018	\N	\N	auth.login.failed	\N	\N	{"email": "test@mahall.in"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:29:29.952
cmtvde1530032uesupia0fvam	\N	\N	tenant.admin.add	TenantMembership	cmtvde1510030uesu17ig4ez5	{"email": "e2e-admins-member-1789035238215-185355@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.984
cmu72hx9q00rxuebc55sljvhz	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:42:18.927
cmu88delb084oue9t9669wi9c	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.submit	Voucher	cmu88dbc907zkue9t47ysl3xb	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:14:31.968
cmu88djte08ezue9t1q2v0ozy	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.pay	Voucher	cmu88dbc907zkue9t47ysl3xb	{"amount": "100.00", "voucherNumber": "VCH-00004"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:14:38.739
cmtvde1lu000guesteporgl73	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789035238215-513201@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:59.587
cmtvde1lx000iuestkxb4ysen	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789035238215-513201@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:59.59
cmtx2gvpx007uuey3jij5o1me	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:43:48.498
cmtx2heo3007yuey3ga2pktac	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:44:13.059
cmtxuhxay0001uetvziy5exjp	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 03:48:26.456
cmtzccirl0009uepk0qyukgjj	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 04:55:53.601
cmtzh15vs0017uex1quzlus47	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:07:01.768
cmtzh1fud0019uex1vs0mtul9	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:07:14.677
cmtzod6hv0003uev7wpmx9quu	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.division.create	TenantDivision	cmtzod6hs0001uev7rt50ooed	{"name": "nilambur"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:32:19.748
cmtvde1rp000luestrckwgudc	\N	\N	auth.register	User	cmtvde1rn000juestwx9vec51	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:59.798
cmtvde1a6000auestag6lpury	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035238215-513201@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:59.167
cmtvde1fz000cuest57q09t1p	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035238215-513201@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:59.375
cmtvde1lq000euesta0vgmp5d	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035238215-513201@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:59.583
cmtvdjmmk000guel881zgtup6	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789035498631-883965@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:20.108
cmtvdjmmm000iuel8th5fkg63	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789035498631-883965@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:20.111
cmu72sedc016zuebc1ny12pmg	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:50:27.649
cmu88dgpg089que9tqgbsn9b1	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.approve	Voucher	cmu88dbc907zkue9t47ysl3xb	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:14:34.709
cmtx2hov40082uey365ny783z	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:44:26.273
cmtx2j2sc0086uey38beweq4i	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 14:45:30.973
cmtxunaua0005uetvkdrq20wn	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 03:52:37.283
cmtzcpyfk0001ue4uhht7m228	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:06:20.432
cmtzdnp4u0005ue4u6rjpq6zn	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:32:34.686
cmtzh919r001duex1c5fw4bos	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:13:09.04
cmtzh97qx001fuex14eh08f7t	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:13:17.433
cmtvdjmy8000puel8v5aoiysa	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:20.528
cmtvdrvx1000guekh32hevmhq	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789035883899-924476@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:45.398
cmtvdrvx4000iuekhoz8mbosl	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789035883899-924476@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:45.4
cmu73hqew01a3uebcxa3bvcc6	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:10:09.657
cmu88n35t0045uec3x9xqj93c	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:22:03.714
cmudqtflb0045ue6tcjufpxoo	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 06:49:43.727
cmtx3044g008auey30h1prr2r	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:58:45.856
cmtxurqhe0009uetvomnzayh7	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 03:56:04.178
cmtxuryp6000fuetvf3dl5ulu	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.create	Family	cmtxuryp3000duetvd4ba24fs	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 03:56:14.826
cmtxurypk000juetv2siz7rzv	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.create	Family	cmtxurypj000huetvuj18pre2	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 03:56:14.841
cmtxus7ja000nuetvupk21e43	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmtxus7j5000luetve3fysn5s	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 03:56:26.278
cmtxus7js000ruetvh0cgjlh7	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmtxus7jp000puetvfqm7pjcw	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 03:56:26.296
cmtxus7k9000vuetvyfmuud16	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmtxus7k7000tuetvqqxr667b	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 03:56:26.313
cmtvdrwfo000vuekh4hgu7ooi	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:46.069
cmtx310nm008euey3yk9xya4d	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:59:28.019
cmtxus7kq000zuetvv3wn6hsk	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmtxus7kn000xuetvlm50a67d	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 03:56:26.33
cmu88u4j201kduehy08pv6kw9	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.paymentMethod.deactivate	FinancePaymentMethod	cmu010we300ojue6sbqgsq5uu	{"name": "Other"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:27:32.079
cmtzdo4g20009ue4uxyu7ysgi	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:32:54.531
cmtzhatgp001juex1v4cvj4bo	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:14:32.233
cmtzhb0wn001luex1kxywdh32	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:14:41.879
cmtzodt740005uev7bo769zwp	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.division.update	TenantDivision	cmtzod6hs0001uev7rt50ooed	{"code": "NLM", "name": "nilambur", "description": null}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:32:49.168
cmtzofwuk000juev7ahvab3hc	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.create	House	cmtzofwuh000huev7ou8zfy2m	{"displayNumber": "KBD04"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:34:27.213
cmtzofwv5000luev7a2mfv2aa	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxurypj000huetvuj18pre2	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:34:27.233
cmtzofwv7000nuev7t8nj8bkb	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.house_changed	Family	cmtxurypj000huetvuj18pre2	{"newHouseId": "cmtzofwuh000huev7ou8zfy2m", "newHouseNumber": "KBD04", "previousHouseId": null, "previousHouseNumber": null}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:34:27.235
cmtzofwvm000puev7uz8jbq56	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxurypj000huetvuj18pre2	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:34:27.25
cmu01swp30001uerf81ncxh8r	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 16:48:28.549
cmu0zyz2i003vue1wvwo74reh	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.update	House	cmtzofdmc0007uev7ttqboaqn	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:44:58.506
cmu0zyz39003xue1wewf9wfps	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxuryp3000duetvd4ba24fs	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:44:58.533
cmu7197y9004luefsbp2bnhna	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev6002duel2m7fo4762	{"key": "committee", "isEnabled": false}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:07:33.25
cmtve6n560062uesdap09bkcr	\N	\N	announcement.create	Announcement	cmtve6n540060uesdzlma5lyc	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.866
cmtve6n69006auesdcqwsjy87	\N	\N	program.delete	Program	cmtve6n5y0066uesdgs5wu8zr	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.906
cmtvkdlih005querqch3bjzk3	\N	\N	auth.login.failed	\N	\N	{"email": "test@mahall.in"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:29:36.042
cmtvkdn0s005suerq2ig0woy6	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:29:37.997
cmtvkdrhb005wuerqqnwdwa6r	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:29:43.775
cmtvitwwm002ouerqhg1vlp42	\N	\N	tenant.create	Tenant	cmtvitwwc0005uerq2s2yagjm	{"name": "test", "slug": "test"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 12:46:18.07
cmtvkeu8u0061uerqg9i5xkdj	\N	\N	auth.register	User	cmtvkeu8p005zuerqah3pw5cb	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:30:34.015
cmtvkpdl9006fuerqimv71rwa	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:38:45.645
cmtwq3ndu0007uevoy41i6xzg	\N	\N	auth.register	User	cmtwq3ndr0005uevoa3qtc9bx	\N	::1	curl/8.7.1	2026-09-11 08:57:35.778
cmtwy504b0002ueokbewf7fg2	\N	\N	auth.register	User	cmtwy50440000ueokj6cfq7h1	\N	::1	curl/8.7.1	2026-09-11 12:42:35.867
cmtwy55mu0007ueokdom5dhgh	\N	\N	auth.register	User	cmtwy55mr0005ueokzxjk4bpl	\N	::1	curl/8.7.1	2026-09-11 12:42:43.015
cmtwy5c70002wueokopmv1o2l	\N	\N	auth.register	User	cmtwy5c6x002uueokfnvqjtie	\N	::1	curl/8.7.1	2026-09-11 12:42:51.517
cmtvde15t0038uesu6e7ptaiv	\N	\N	tenant.admin.role_change	TenantMembership	cmtvde1510030uesu17ig4ez5	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:59.01
cmtvde14d000cuesv5ngnpsiz	\N	\N	auth.register	User	cmtvde14c000auesvwplnro30	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.957
cmtvde1xj000puestmp8pqluo	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:14:00.007
cmtvde23s000vuestaak3qc4w	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:14:00.232
cmtvde242000zuestspjf8al5	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:14:00.242
cmtvdjlra0002uel9bzdvcd6v	\N	\N	auth.register	User	cmtvdjlr40000uel9w1jxcgwh	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:18.982
cmtvdjm4i002yuel9i7bs3gnl	\N	\N	tenant.create	Tenant	cmtvdjm44000fuel9khdrgpxb	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789035498631-518567"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.459
cmtvdjm4s0032uel9tu7msvpl	\N	\N	tenant.admin.add	TenantMembership	cmtvdjm4q0030uel9h4wxrlz4	{"email": "e2e-admins-member-1789035498631-518567@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.469
cmtx322y6008kuey3x425xld2	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	announcement.create	Announcement	cmtx322y2008iuey33l4hxxww	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 15:00:17.647
cmtxv1jgz0001uec4gyzal5fl	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 04:03:41.649
cmu89741300gdue8i0tfk8wkw	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:37:37.956
cmtzdr9a20001uemjnv9s76yr	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtynl5940009uenjarxk71r7	{"bulk": true, "name": "Phase 10 Test Mahallu", "slug": "phase10-test-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.762
cmtve6n5q0064uesdh1n44w53	\N	\N	announcement.delete	Announcement	cmtve6n540060uesdzlma5lyc	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.886
cmtzdr9a90003uemjxzogm9kn	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtymvvzf002cuemuek48vuc9	{"bulk": true, "name": "Phase 6 Test Mahallu", "slug": "phase6-test-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.769
cmtzdr9ad0005uemjo3qytoxq	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtyml4u70028ueyp8ra4krsb	{"bulk": true, "name": "Phase 5 Test Mahallu", "slug": "phase5-test-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.773
cmtzdr9ah0007uemjnq4yfe2b	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtym6q2o000due7p7o1kahsa	{"bulk": true, "name": "Phase 4 Test Mahallu", "slug": "phase4-test-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.778
cmtzdr9am0009uemjzjfl849u	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtylir92000duetp5zfqsiyf	{"bulk": true, "name": "Phase 3 Test Mahallu", "slug": "phase3-test-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.782
cmtzdr9ar000buemjnviy55k8	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtykucsx000huesbwj1pqnsh	{"bulk": true, "name": "Phase 2 Test Mahallu", "slug": "phase2-test-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.787
cmtzdr9au000duemjsu5loex4	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtyjji840005uef7b9rtkdwy	{"bulk": true, "name": "Phase1 Test Mahallu", "slug": "phase1-test-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.79
cmtzdr9aw000fuemjqw49fs9x	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtyim0ys000iueqpwh1acydu	{"bulk": true, "name": "mvm", "slug": "mvm"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.793
cmtzdr9az000huemjv9vwca9q	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtyht3090007ueolfv1rt4mh	{"bulk": true, "name": "Parappur Juma Mahallu", "slug": "parappur-onb-wizard"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.795
cmtzdr9b2000juemjyrab9shf	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtyh3h610009uebktky9mjy8	{"bulk": true, "name": "Parappur Test Mahallu", "slug": "parappur-onboard-test"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:35:20.798
cmtzhbwvq001puex1ljq7w0ji	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:15:23.318
cmtzhcdqi001ruex1lvi86k3l	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:15:45.162
cmtzofdml0009uev7v9ct191g	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.create	House	cmtzofdmc0007uev7ttqboaqn	{"displayNumber": "KBD02"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:34:02.301
cmtzofdng000buev7iur8otcb	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxuryp3000duetvd4ba24fs	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:34:02.332
cmtzofdni000duev73oiaii53	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.house_changed	Family	cmtxuryp3000duetvd4ba24fs	{"newHouseId": "cmtzofdmc0007uev7ttqboaqn", "newHouseNumber": "KBD02", "previousHouseId": null, "previousHouseNumber": null}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:34:02.334
cmtzofdny000fuev7w8wnoszb	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxuryp3000duetvd4ba24fs	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:34:02.35
cmu02cksu0005uerfeyoleiee	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:03:46.25
cmu106u5u0041ue1w7r5zj5b3	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.update	House	cmtzofdmc0007uev7ttqboaqn	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:51:05.394
cmu106u6k0043ue1wwzygud6g	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxuryp3000duetvd4ba24fs	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:51:05.42
cmu106u770045ue1w7nioqjis	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtxus7j5000luetve3fysn5s	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:51:05.443
cmtymvw00007nuemuustf6yiq	\N	\N	tenant.create	Tenant	cmtymvvzf002cuemuek48vuc9	{"name": "Phase 6 Test Mahallu", "slug": "phase6-test-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:03:07.201
cmtve6n5z0068uesd4d1kjtop	\N	\N	program.create	Program	cmtve6n5y0066uesdgs5wu8zr	\N	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.895
cmu897gq300h3ue8in6qwacay	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.tenant.update_profile	Tenant	cmtv96wxe000wue7w59ewld1m	{"slug": "demo", "changes": ["name", "description", "contactPhone", "contactEmail", "website", "masjidName", "masjidPhone", "masjidAddress", "imamName", "khatheebName", "country", "state", "district", "localBody", "place", "pinCode", "addressLine1", "addressLine2", "presidentName", "presidentPhone", "secretaryName", "secretaryPhone", "treasurerName", "treasurerPhone"]}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:37:54.412
cmudqtll2006hue6t2dz9wnyp	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 06:49:51.494
cmudqtnwd006jue6tmq4kqd4j	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 06:49:54.493
cmtve6nj0000guesb6pyq820h	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789036572277-999629@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:14.365
cmtve6nj4000iuesb4kja0mup	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789036572277-999629@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:14.368
cmty0vzeu0001uebkbizu03zf	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 06:47:20.069
cmtzds5tz000nuemjnirfk69j	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:36:02.951
cmtzds5uy000ruemjbkh5vj1f	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.support.start	Tenant	cmtv96wxe000wue7w59ewld1m	{"name": "Demo Mahalle", "slug": "demo", "reason": "verifying phase 3"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:36:02.987
cmtzds5ve000tuemj9lgqxo6g	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.support.end	Tenant	cmtv96wxe000wue7w59ewld1m	{"name": "Demo Mahalle", "slug": "demo"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:36:03.002
cmtzdsxbi000xuemjcvn3l470	\N	cmtv96wxe000wue7w59ewld1m	member.otp.request	Member	cmtxus7j5000luetve3fysn5s	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:36:38.575
cmtvebe53005sueak4ae8u960	\N	\N	member.update	Member	cmtvebe4d005oueakmbx4wipo	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.479
cmtvebe5h005uueak5yf98s2e	\N	\N	member.delete	Member	cmtvebe4d005oueakmbx4wipo	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.494
cmtvebe56005sueajbksfzjfb	\N	\N	family.delete	Family	cmtvebe4e005oueajcljxh3xs	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.482
cmtvebe5m005wueaj14xekkcs	\N	\N	event.create	Event	cmtvebe5k005uueaj1kpu5uqo	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.498
cmtvebe67005yueajgjqi8ebu	\N	\N	event.delete	Event	cmtvebe5k005uueaj1kpu5uqo	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.519
cmtzdt5qv000zuemjnu5z4w1k	\N	cmtv96wxe000wue7w59ewld1m	member.login	Member	cmtxus7j5000luetve3fysn5s	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:36:49.496
cmtzhdfx2001vuex1xoeyx8zo	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:16:34.646
cmu8as90j0869ue8ix79v09s8	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:22:03.812
cmudr17p0015pue6tlulemng7	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.delete	Voucher	cmu82qw7f00hnuezxxemn3hnp	{"amount": "100.00", "voucherNumber": "VCH-00003"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 06:55:46.741
cmtzogqm6000ruev770k13nec	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:35:05.791
cmu036rzv0001uerobrrb5bz0	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:27:15.259
cmu1074lz0049ue1whe6x8zu9	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtxus7jp000puetvfqm7pjcw	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:51:18.935
cmu719f8g004puefsrh463rbn	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev6002duel2m7fo4762	{"key": "committee", "isEnabled": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:07:42.689
cmtyh3djh0006uebk6hl53xeq	\N	\N	auth.register	User	cmtyh3dj40004uebkwlnzh5ge	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 14:20:58.829
cmtyh3h6w002suebkarqalelx	\N	\N	tenant.create	Tenant	cmtyh3h610009uebktky9mjy8	{"name": "Parappur Test Mahallu", "slug": "parappur-onboard-test"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 14:21:03.561
cmtyh3utg002vuebku9ivujjh	\N	\N	auth.register	User	cmtyh3utc002tuebkyvzk8u6j	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 14:21:21.22
cmtyh4try005huebk3o42ig96	\N	cmtyh4tr8002yuebkqxkrgukw	tenant.create	Tenant	cmtyh4tr8002yuebkqxkrgukw	{"name": "Mahalle", "slug": "mahalle"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 14:22:06.526
cmtvebe6q0062ueajmgiltidf	\N	\N	announcement.create	Announcement	cmtvebe6o0060ueajbivn7brl	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.538
cmtvebe8g006aueajkilzts01	\N	\N	program.delete	Program	cmtvebe7z0066ueajnk4fw6fa	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.6
cmtvdjm500036uel9jr9w5yqb	\N	\N	tenant.admin.add	TenantMembership	cmtvdjm4y0034uel9l4mxykif	{"email": "e2e-admins-promoted-1789035498631-518567@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.477
cmtvdjm6a003auel9t6nu61k8	\N	\N	tenant.admin.remove	TenantMembership	cmtvdjm4y0034uel9l4mxykif	{"removedRole": "ADMIN", "removedUserId": "cmtvdjm3u000auel90kasvtjz"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.523
cmtvdjlra0002uelcpz6kvujd	\N	\N	auth.register	User	cmtvdjlr80000uelcm2jabdc0	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:18.983
cmtvdjlra0002uela0e7l7aws	\N	\N	auth.register	User	cmtvdjlr90000uelak96ikuph	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:18.983
cmtvdjm4o002yuelal2fucizt	\N	\N	tenant.create	Tenant	cmtvdjm49000fuelairztkaf5	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789035498631-87979"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.464
cmtvdjm59005muelage5qy13p	\N	\N	tenant.admin.add	TenantMembership	cmtvdjm57005kuelabjklppzv	{"email": "e2e-members-plain-a-1789035498631-87979@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.485
cmtvdjm5i005quela80yaj7u6	\N	\N	member.create	Member	cmtvdjm5h005ouelawj45sanx	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.495
cmtvdjm62005suelanvplnrti	\N	\N	member.update	Member	cmtvdjm5h005ouelawj45sanx	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.514
cmtvdjm6f005uuela3p7840i2	\N	\N	member.delete	Member	cmtvdjm5h005ouelawj45sanx	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.528
cmtvdjlrg0002uelbfoxh4ho3	\N	\N	auth.register	User	cmtvdjlrf0000uelbv04e12qf	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:18.989
cmtvdjlrg0002uel8yc4en9vc	\N	\N	auth.register	User	cmtvdjlrf0000uel8b5qjvq5q	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:18.989
cmtvdjlxt0006uel8ek5gyn20	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035498631-883965@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.217
cmtvdjm3v0008uel8ita8wxat	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035498631-883965@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.435
cmtvdjmam000auel8up7zz1ik	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035498631-883965@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.678
cmtvdjmgo000cuel8uez09lql	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035498631-883965@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.896
cmtvdjmmh000euel8llt6bje2	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035498631-883965@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:20.105
cmtvdjlxr0007uel9p6sfhtie	\N	\N	auth.register	User	cmtvdjlxq0005uel9p5obycia	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.215
cmtvdjlxx0007uelbkwmoxwu3	\N	\N	auth.register	User	cmtvdjlxw0005uelbqs84mlew	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.221
cmtvdjm4m002yuelbs1sv5hm8	\N	\N	tenant.create	Tenant	cmtvdjm49000fuelbdzf20rhh	{"name": "E2E Tenant", "slug": "e2e-tenant-1789035498631-416558"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.462
cmtvdjlxy0007uelas2kxgxd7	\N	\N	auth.register	User	cmtvdjlxw0005uelab8fjlxwy	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.222
cmtvebe5m003aueaika27gg7r	\N	\N	tenant.admin.remove	TenantMembership	cmtvebe3v0034ueaib1zmh1qu	{"removedRole": "ADMIN", "removedUserId": "cmtvebe2o000aueaib0f0p248"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.499
cmu8azyum086bue8i7gchh5rl	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:28:03.887
cmtvdjm50005iuelah24itu0i	\N	\N	tenant.create	Tenant	cmtvdjm4s002zuelaytvv7nuo	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789035498631-87979"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.477
cmtvdjly30007uelcg2rlmkpx	\N	\N	auth.register	User	cmtvdjly20005uelc99pb17np	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.228
cmtzdyde10001uejthbo3z3cy	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	announcement.delete	Announcement	cmtx322y2008iuey33l4hxxww	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:40:52.682
cmtzi29c8001zuex19qiit50m	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:35:52.521
cmtzp7341000vuev7t2hzwns4	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:55:35.041
cmu03in1x0005uero82w0l6ij	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.bankAccount.deactivate	FinanceBankAccount	cmu010wek00plue6ssznb294d	{"accountName": "Main Operating Account"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:36:28.725
cmu117qt70050ue1wzfavw1z4	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	collections.create	FinanceCollection	cmu117qsx004yue1wjqdc8a08	{"type": "MONTHLY", "amount": "100.00", "receiptNumber": "RCP-00003", "collectionNumber": "COL-00003"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:19:47.323
cmu7254iq006xueoksr6gpioy	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": false}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:32:21.795
cmtyhsnjc0002ueolyel01ioo	\N	\N	auth.register	User	cmtyhsnj60000ueol9kbsjh58	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 14:40:38.184
cmtyht312002sueolqbo9k4zx	\N	\N	tenant.create	Tenant	cmtyht3090007ueolfv1rt4mh	{"name": "Parappur Juma Mahallu", "slug": "parappur-onb-wizard"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 14:40:58.263
cmtvdjlyx002vuelcy4le2c71	\N	\N	tenant.create	Tenant	cmtvdjlyg000cuelchbj9yf9c	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789035498631-465333"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.258
cmtvdjm3v000cuel97l7m6q57	\N	\N	auth.register	User	cmtvdjm3u000auel90kasvtjz	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.436
cmtvdjm5l0038uel99hhfp934	\N	\N	tenant.admin.role_change	TenantMembership	cmtvdjm4q0030uel9h4wxrlz4	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.497
cmtvdjm43000cuelauxhhan7q	\N	\N	auth.register	User	cmtvdjm41000auelatonwlqt8	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.443
cmtvdjm44000cuelb4d6ivugn	\N	\N	auth.register	User	cmtvdjm43000auelb641sv29b	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:19.444
cmtvdjmse000luel8d6shsc7z	\N	\N	auth.register	User	cmtvdjmsc000juel8w41gs7ts	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:20.318
cmtvdjn4k000vuel8b07yf606	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:20.757
cmtvdjn4t000zuel85v8m607n	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:18:20.766
cmtvdmomg0002ue09did5nz7h	\N	\N	auth.register	User	cmtvdmomb0000ue09erj6x88u	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 10:20:42.665
cmtvdmote0006ue09ttjow3kc	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 10:20:42.914
cmtvdmoup002sue09q9i7481m	\N	\N	tenant.create	Tenant	cmtvdmou70009ue091d9koiz0	{"name": "Verify Mahalle", "slug": "verify-1789035642"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 10:20:42.962
cmtvdmov6002wue095x6ygnlr	\N	\N	member.create	Member	cmtvdmov5002uue09na9q84b8	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 10:20:42.979
cmtvdrv1h0002uekllnp0bhtl	\N	\N	auth.register	User	cmtvdrv1c0000uekl79ti2evn	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.261
cmtvdrv1h0002uekim7ww2zpi	\N	\N	auth.register	User	cmtvdrv1c0000uekii4jk8vn8	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.261
cmtvdrven002yuekixcx1llhy	\N	\N	tenant.create	Tenant	cmtvdrve3000fueki27iwfdfp	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789035883899-969633"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.735
cmtvdrvf30032uekiy86a3ddo	\N	\N	tenant.admin.add	TenantMembership	cmtvdrvex0030uekism195tll	{"email": "e2e-admins-member-1789035883899-969633@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.751
cmtvdrvfc0036uekilq64fi32	\N	\N	tenant.admin.add	TenantMembership	cmtvdrvfa0034uekif5lmb9y7	{"email": "e2e-admins-promoted-1789035883899-969633@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.761
cmtvdrvgm003auekifad6czhr	\N	\N	tenant.admin.remove	TenantMembership	cmtvdrvfa0034uekif5lmb9y7	{"removedRole": "ADMIN", "removedUserId": "cmtvdrvdv000auekilprq4v8f"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.807
cmtvdrv1h0002uekjfrq5lgjo	\N	\N	auth.register	User	cmtvdrv1f0000uekjm6ivez01	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.261
cmtvdrvf1002yuekj210fmban	\N	\N	tenant.create	Tenant	cmtvdrvek000fuekjmxlwno3d	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789035883899-285357"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.749
cmtvdrvfp005muekjy731w7v0	\N	\N	tenant.admin.add	TenantMembership	cmtvdrvfm005kuekjzr1ykmmy	{"email": "e2e-members-plain-a-1789035883899-285357@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.773
cmtvdrvfx005quekj74ynlrdl	\N	\N	member.create	Member	cmtvdrvfw005ouekjwttuj7se	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.781
cmtvdrvgg005suekj21nstnmo	\N	\N	member.update	Member	cmtvdrvfw005ouekjwttuj7se	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.801
cmtvdrvgv005uuekj24jawjml	\N	\N	member.delete	Member	cmtvdrvfw005ouekjwttuj7se	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.816
cmtvdrv1n0002uekhdhhjh66n	\N	\N	auth.register	User	cmtvdrv1l0000uekhddweego2	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.267
cmtvdrv850006uekhtaqa6g2z	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035883899-924476@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.501
cmtvdrve50008uekhwwj5sewr	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035883899-924476@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.717
cmtvdrvl1000auekh4d6ulm11	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035883899-924476@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.966
cmtvdrvr3000cuekh1to979yx	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035883899-924476@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:45.184
cmtvdrvwy000euekhud7zbem6	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035883899-924476@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:45.394
cmtvebe7e0064ueaj8r1mxbyt	\N	\N	announcement.delete	Announcement	cmtvebe6o0060ueajbivn7brl	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.562
cmtyidno90008ueqp1lt4l637	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 14:56:58.138
cmudtb0jy06zjue6tsil6rqnw	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:59:23.278
cmtze2agq0001ue8kpvd4r92a	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:43:55.514
cmtvebe810068ueajh6lwbwcd	\N	\N	program.create	Program	cmtvebe7z0066ueajnk4fw6fa	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.585
cmtvdrv1n0002uekkh5tzm15w	\N	\N	auth.register	User	cmtvdrv1l0000uekks2q45tcu	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.268
cmtvdrv7u0007ueki300ytk3i	\N	\N	auth.register	User	cmtvdrv7s0005uekiievhv44w	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.49
cmtze2ic90062ue8ks0gb5ojr	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.grant	PlatformMembership	cmtze2ic30060ue8kt55e5bl4	{"role": "PLATFORM_SUPPORT", "email": "owner@demo.mahalle.local"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:44:05.722
cmtvdrv7v0007ueklruickndk	\N	\N	auth.register	User	cmtvdrv7v0005ueklp46t8mik	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.492
cmtze2okv006cue8kc01zirap	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.role_change	PlatformMembership	cmtze2ic30060ue8kt55e5bl4	{"to": "PLATFORM_STAFF", "from": "PLATFORM_SUPPORT", "email": "owner@demo.mahalle.local"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:44:13.808
cmtze2olj006eue8krpydlbxe	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.revoke	PlatformMembership	cmtze2ic30060ue8kt55e5bl4	{"role": "PLATFORM_STAFF", "email": "owner@demo.mahalle.local"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:44:13.832
cmtze2om3006gue8ki1tjxrgs	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.revoke	PlatformMembership	cmtv96wxa000vue7w3jvysuj7	{"role": "SUPER_ADMIN", "email": "platform-admin@mahalle.local"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:44:13.851
cmtvdrv8r002vueklcbm2se0a	\N	\N	tenant.create	Tenant	cmtvdrv88000cuekl13f7rxoh	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789035883900-662667"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.524
cmtvdrv850007uekj6hg14zen	\N	\N	auth.register	User	cmtvdrv840005uekjqzi7f47q	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.501
cmtziebrp0001uepip2s6font	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:45:15.538
cmtzif5mu0005uepinll74mu0	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:45:54.247
cmtzif6bz0009uepih55t3rrp	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:45:55.151
cmtzif94c000duepieah5pjc0	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:45:58.764
cmtzp86lj000zuev7wgxs4uiu	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:26.216
cmtzp89s20013uev7c5z5q8p2	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:30.338
cmtzp8ctj0017uev7pi5f2dc7	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:34.279
cmtzp8j2w001buev7c5qsefk0	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:42.392
cmtzp8ujx001fuev7kbp3kr8z	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:57.26
cmtzp94kg001juev7qio7qser	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:57:10.24
cmu03jkeg0001uepw8k8qbexj	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.collectionCategory.remove	CollectionCategory	cmu010wer00q1ue6sxkez1omr	{"name": "Other Inflow"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:37:11.944
cmu11ydy50054ue1wo4h196u1	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:40:30.365
cmtwyis2v0006ue0644691ue1	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131198043-780570@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.631
cmtwyis9i0008ue06k8y1akau	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131198043-780570@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.871
cmtwyisfy000aue069vwesu3u	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131198043-780570@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.103
cmtwyirwd0002ue08jh2vs8fn	\N	\N	auth.register	User	cmtwyirwb0000ue08ryo8t8py	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.397
cmtwyisaz002yue08zm6w32kt	\N	\N	tenant.create	Tenant	cmtwyisag000fue080i72mvua	{"name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789131198043-459117"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.923
cmtwyis2j0007ue09w39wo5zd	\N	\N	auth.register	User	cmtwyis2h0005ue090tyljcne	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.619
cmtwyisae005iue09od5tzed5	\N	\N	tenant.create	Tenant	cmtwyisa3002zue095jz099mw	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131198043-13614"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.903
cmtwyis2q0007ue07o4xwxkui	\N	\N	auth.register	User	cmtwyis2p0005ue07t5u0mhcy	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.627
cmtwyis2t0007ue05hlhxrljw	\N	\N	auth.register	User	cmtwyis2s0005ue05n7x597mc	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.629
cmtyia2yz0002ueqpn1612d3s	\N	\N	auth.register	User	cmtyia2yr0000ueqpra7jtwlc	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 14:54:11.339
cmtze2c510006ue8kiigcg5l8	\N	\N	auth.register	User	cmtze2c4u0004ue8klrw14769	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:43:57.685
cmtze2cb1000aue8kwcwp02jn	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:43:57.901
cmudtbaoz070rue6tauohfdye	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.tenant.update_profile	Tenant	cmtv96wxe000wue7w59ewld1m	{"slug": "demo", "changes": ["name", "description", "contactPhone", "contactEmail", "website", "masjidName", "masjidPhone", "masjidAddress", "imamName", "khatheebName", "country", "state", "district", "localBody", "place", "pinCode", "addressLine1", "addressLine2", "presidentName", "presidentPhone", "secretaryName", "secretaryPhone", "treasurerName", "treasurerPhone"]}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:59:36.42
cmtvebeky000gueahcnnqawja	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789036794488-991076@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:56.051
cmtvebel1000iueah4rddqvpm	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789036794488-991076@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:56.053
cmtvebe90000aueah3qem5p6m	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036794488-991076@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.62
cmtvivt2s002querq1tjvc4th	\N	\N	auth.login.failed	\N	\N	{"email": "qa-tester-onboard@example.com"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 12:47:46.421
cmtvebef0000cueahy6wqibie	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036794488-991076@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:55.836
cmtviwjc5002tuerqyrcmyhqc	\N	\N	auth.register	User	cmtviwjc1002ruerqughcq1ib	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 12:48:20.453
cmtvebekv000eueahc4e4gtnh	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789036794488-991076@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:39:56.048
cmtzifkvo000huepi7dicqjuy	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:46:14.005
cmtviwzf6002yuerqkuavgyog	\N	\N	auth.register	User	cmtviwzf3002wuerq927yvbl3	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 12:48:41.298
cmtvebero000lueah29jm7838	\N	\N	auth.register	User	cmtveberm000jueahx2lntz8r	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:56.292
cmtvix7kj005kuerqj8fs19zo	\N	\N	tenant.create	Tenant	cmtvix7jp0031uerq3xt6ftp2	{"name": "QA Mahallu Two", "slug": "qa-mahallu-two"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 12:48:51.86
cmtvkisbf0065uerqbs04r8b9	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:33:38.14
cmtvklvfo0069uerqoh4nn1gj	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.failed	\N	\N	{"email": "owner@demo.mahalle.local"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:36:02.148
cmtvkmcbr006buerq68r6lgat	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:36:24.039
cmtvkprva006huerqahb0gl31	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:39:04.15
cmtvkptrw006luerqk9iq1wmi	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:39:06.621
cmtvkq7wt006puerqn7fevrkp	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:39:24.942
cmtvkquw4006ruerqdt2fxl27	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:39:54.724
cmtvkr8gj006vuerq02n1u04q	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:40:12.308
cmtvkvycl0001uexgu2d5kvrs	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:43:52.486
cmtvkvyj60005uexger2c38fr	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:43:52.723
cmtvl7ysh0009uexgzap08o80	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:53:12.929
cmtvl8415000duexgsdbioq3j	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:53:19.721
cmtvebexi000pueah1hqn6vqc	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:39:56.503
cmtvl8qt4000guexgrxjeoj26	\N	\N	auth.register	User	cmtvl8qsy000euexgu59ixqrk	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:53:49.241
cmtyj9mut0033ueqpeexl147v	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 15:21:50.068
cmtwq3alt0002uevoq9fh4xhp	\N	\N	auth.register	User	cmtwq3aln0000uevonkq9fp2d	\N	::1	curl/8.7.1	2026-09-11 08:57:19.217
cmtvl8qut0032uexg28q21txs	\N	\N	tenant.create	Tenant	cmtvl8qu8000juexgqrd51sx9	{"name": "Onboard Flow Mahallu", "slug": "onboard-flow-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:53:49.302
cmtvlfmut0034uexgrwbckksr	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:59:10.71
cmtvlfwdg0038uexgj9cpz8tw	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:59:23.044
cmtvljr24003cuexgaa8kz5g8	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:02:22.781
cmtvlk0b6003euexg47amm1pk	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:02:34.77
cmtvlsucu0001uedctkffuya6	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:09:26.959
cmtvlsued0007uedcgykd5fll	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmtvlsuea0005uedcu2w3j540	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:09:27.014
cmtvlsxoq000buedcbyfh8cb0	\N	cmtv96wxe000wue7w59ewld1m	member.otp.request	Member	cmtvlsuea0005uedcu2w3j540	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:09:31.275
cmtvltk6s000duedcv3rqhm4b	\N	cmtv96wxe000wue7w59ewld1m	member.login	Member	cmtvlsuea0005uedcu2w3j540	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:10:00.436
cmudu4a0t0asfue6t6u00eqe2	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	accounting.account.create	Account	cmudu4a0q0asdue6tyy6f2j7p	{"code": null, "name": "Madrassa", "type": "INCOME"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:22:08.573
cmtvltt6k002xuedcafb22ik3	cmtv96x5n0057ue7wcl3a27w0	\N	tenant.create	Tenant	cmtvltt5q000euedcozbth1d1	{"name": "Other Mahallu", "slug": "other-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:10:12.092
cmtvlwd120031uedc04a8putq	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmtvlwd10002zuedcfyojvde5	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:12:11.127
cmtvlwqes0033uedcht183lxb	\N	cmtv96wxe000wue7w59ewld1m	member.login	Member	cmtvlwd10002zuedcfyojvde5	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:12:28.469
cmtvm8ong0035uedc5nsvbqi3	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:21:46.06
cmtvmdluv0003uev0s8u242ir	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.create	Family	cmtvmdluo0001uev04h2hb39t	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:25:35.72
cmtvmh9bv0005uev0duldzw0i	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:28:26.108
cmtvmhkve000buev0d305yfgn	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.create	Family	cmtvmhkvb0009uev0h3nb0v32	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:28:41.067
cmtvmibay000duev0t903n14j	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:29:15.322
cmtvmigww000huev0sbr3gd56	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:29:22.592
cmtvmiq5d000juev07us3jpki	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:29:34.562
cmtvmnmq00003uexsw7gzfrla	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.create	Family	cmtvmnmpt0001uexs7n8ljdsr	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:33:23.401
cmtvmnt0i0007uexsgjejgvl6	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmtvmnt0c0005uexsgu8w8bhm	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:33:31.555
cmtvmnzc9000buexs1diamb82	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:33:39.753
cmtvmohrx000fuexs2y4esio4	\N	cmtv96wxe000wue7w59ewld1m	member.otp.request	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:34:03.645
cmtvmoswu000huexsq1lr3r87	\N	cmtv96wxe000wue7w59ewld1m	member.login	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:34:18.078
cmtvmp9jn000luexses2kg4t8	\N	cmtv96wxe000wue7w59ewld1m	member.otp.request	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:34:39.635
cmtvmpkwo000nuexs4hydkjo4	\N	cmtv96wxe000wue7w59ewld1m	member.login	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:34:54.361
cmtwy1m9f0001ueaz91n73ysa	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:39:57.937
cmtwy3f4w0005ueazztfzkbnc	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:41:22.016
cmudug7h90b5nue6tyvmr3e7k	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:31:25.149
cmtwyfkm0000guep9cxjmarut	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131047553-348368@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:50:48.984
cmtwyfkm2000iuep928wuer11	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131047553-348368@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:50:48.987
cmtyjeemz0037ueqpsmximtxz	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 15:25:32.7
cmtze58ai006iue8kwxm0boxa	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.revoke	PlatformMembership	cmtvdrv7z000bueklr10q68br	{"role": "PLATFORM_STAFF", "email": "e2e-platform-staff-1789035883900-662667@example.com"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:46:12.667
cmtwyfkxh000puep9zrk7v1kr	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:49.398
cmtvdrvff005iuekj216v9uk4	\N	\N	tenant.create	Tenant	cmtvdrvf7002zuekjexycmzt4	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789035883899-285357"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.763
cmtvdrv860007uekkxsc6u1n9	\N	\N	auth.register	User	cmtvdrv850005uekkqr7m422h	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.503
cmtvdrvf1002yuekks7czsqd4	\N	\N	tenant.create	Tenant	cmtvdrvek000fuekkgdxvjt4e	{"name": "E2E Tenant", "slug": "e2e-tenant-1789035883899-124109"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.75
cmudvb02h0b69ue6tm1d9yys8	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:55:21.881
cmtze5an0006kue8k3mtlb6cn	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.revoke	PlatformMembership	cmtvdjly7000buelc8by9wfxp	{"role": "PLATFORM_STAFF", "email": "e2e-platform-staff-1789035498631-465333@example.com"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:46:15.708
cmtze5cya006mue8k0i9sq013	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.revoke	PlatformMembership	cmtvde0yc000bueswrlv3t3u3	{"role": "PLATFORM_STAFF", "email": "e2e-platform-staff-1789035238215-197381@example.com"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:46:18.707
cmtziflsx000luepih89whrlr	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:46:15.202
cmtzifq8z000puepi6k1pzrn8	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:46:20.964
cmtzp96oi001nuev767e4ev0j	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:57:12.978
cmu03jqg10003uepwenemf1v5	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.collectionCategory.remove	CollectionCategory	cmu010wep00pxue6slc5t0ly6	{"name": "Nercha & Offerings"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:37:19.777
cmu12wbia005kue1whhadppcz	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.collectionCategory.update	CollectionCategory	cmu010wel00pnue6sz27v7wlr	{"updated": {"code": "MONTHLY", "name": "Monthly Mahallu Collection", "targetType": "SPECIFIC_DIVISIONS", "isRecurring": true, "defaultAmount": null, "targetDivisionIds": ["cmtzny68j0007uekqyf0b6ral"], "recurrenceFrequency": "MONTHLY"}, "previous": {"id": "cmu010wel00pnue6sz27v7wlr", "code": "MONTHLY", "name": "Monthly Mahallu Collection", "isActive": true, "tenantId": "cmtv96wxe000wue7w59ewld1m", "createdAt": "2026-09-13T16:26:41.806Z", "updatedAt": "2026-09-13T16:26:41.806Z", "targetType": "ALL_FAMILIES", "description": null, "isRecurring": false, "displayOrder": 1, "defaultAmount": null, "incomeAccountId": "cmu010wed00p3ue6s0x2wpas1", "targetDivisionIds": [], "recurrenceFrequency": "MONTHLY", "targetEconomicCategory": "ALL"}}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:06:53.506
cmtwyisbl0034ue05traryoag	\N	\N	platform.tenant.suspend	Tenant	cmtwyis9u000jue05zzjfrulk	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131198043-549987"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.945
cmtwyis310007ue0aykk5xafd	\N	\N	auth.register	User	cmtwyis310005ue0awf97biwt	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.638
cmtwyisa5002yue0acrsgf1ar	\N	\N	tenant.create	Tenant	cmtwyis9r000fue0atoyux9id	{"name": "E2E Tenant", "slug": "e2e-tenant-1789131198043-227906"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.893
cmtwyis3d0007ue08vuzcpl63	\N	\N	auth.register	User	cmtwyis3c0005ue08a7px8l34	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.649
cmtwyisbf005iue08slmo2y58	\N	\N	tenant.create	Tenant	cmtwyisb5002zue08flb4y4be	{"name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789131198043-459117"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.94
cmtwyis92000cue097ayk5ws6	\N	\N	auth.register	User	cmtwyis90000aue09cbz4swuk	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.854
cmtwyis9f000cue07ho35js4n	\N	\N	auth.register	User	cmtwyis9e000aue07170bk1l2	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.868
cmtwyisbl0038ue07ijb7ylic	\N	\N	tenant.admin.role_change	TenantMembership	cmtwyisaf0030ue07hqga4byu	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.945
cmtwyis9h000cue05zgqhl6pd	\N	\N	auth.register	User	cmtwyis9f000aue05xl9rp8n0	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.869
cmtwyisa80032ue05f8pku2ef	\N	\N	tenant.create	Tenant	cmtwyis9u000jue05zzjfrulk	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131198043-549987"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.896
cmtwyis9k000cue0aohf6nb4y	\N	\N	auth.register	User	cmtwyis9j000aue0aknetkr1n	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.872
cmtwyisa6000cue087zz6q36s	\N	\N	auth.register	User	cmtwyisa5000aue08d8m3igyh	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.895
cmtwyit3e000pue06logcio8u	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.946
cmtwyit9l000vue069pyv84rs	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:20.17
cmtwyooqi0002ueq6o0jnmlzz	\N	\N	auth.register	User	cmtwyooqg0000ueq6vsahe2ns	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.234
cmtwyop4w002yueq6ov2l486m	\N	\N	tenant.create	Tenant	cmtwyop4i000fueq6aaw6qltc	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789131473845-46468"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.753
cmtwyop5n005mueq6nqru93e1	\N	\N	tenant.admin.add	TenantMembership	cmtwyop5l005kueq6t8ckw41a	{"email": "e2e-members-plain-a-1789131473845-46468@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.78
cmtwyooqp0002ueq3ou8on10f	\N	\N	auth.register	User	cmtwyooqn0000ueq38nq8gqvy	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.241
cmtwyoox90006ueq3u8dz8imd	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131473845-501601@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.478
cmtwyop430008ueq34ewgv8s0	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131473845-501601@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.723
cmtyjji790002uef7w0eb96vr	\N	\N	auth.register	User	cmtyjji6z0000uef7rk1ce6fn	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 15:29:30.597
cmtyjji8m0032uef75kqd9atg	\N	\N	tenant.create	Tenant	cmtyjji840005uef7b9rtkdwy	{"name": "Phase1 Test Mahallu", "slug": "phase1-test-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 15:29:30.646
cmtyjjydf003cuef7opf1w9qe	\N	\N	house.create	House	cmtyjjydc003auef7bhtbaqjr	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 15:29:51.555
cmtvdrvdx000cuekibji7tw25	\N	\N	auth.register	User	cmtvdrvdv000auekilprq4v8f	\N	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.709
cmtvdrvfx0038uekidbecqf4d	\N	\N	tenant.admin.role_change	TenantMembership	cmtvdrvex0030uekism195tll	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:24:44.781
cmtwy5v630031ueokmtl1psju	\N	\N	auth.register	User	cmtwy5v5z002zueok3vzli5n6	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 12:43:16.107
cmue37wuo0b6bue6taa29av7t	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:36:54.668
cmtze5xcp006oue8kw0mnzvlu	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtze2cbs000due8kkj2pyfl9	{"name": "Section 1 Test Mahallu", "slug": "section1-test-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:46:45.146
cmtzigqwz000tuepiuevx6b30	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:47:08.483
cmtzpdb38001ruev7lcgfg653	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"divisionTerm": "", "hasDivisions": false, "houseNumberPrefix": null, "houseNumberingMethod": "GLOBAL", "previousDivisionTerm": "ward", "previousHouseNumberingMethod": "PER_DIVISION"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 11:00:25.316
cmu03m41d0007uepws4aeutpo	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.collectionCategory.remove	CollectionCategory	cmu010wen00prue6sce7bilxh	{"name": "General Donation"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:39:10.705
cmu13m2bd006cue1wotrrpk4w	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:26:54.65
cmtwyopba000aueq3jz2tr0p9	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131473845-501601@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.982
cmtwyophy000cueq3m6dn3svr	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131473845-501601@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:55.222
cmtwyopo6000eueq3cft8guxv	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131473845-501601@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:55.446
cmtwyooqr0002ueq79z7mxgxx	\N	\N	auth.register	User	cmtwyooqp0000ueq7tsystvoi	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.244
cmtwyooqu0002ueq54odje431	\N	\N	auth.register	User	cmtwyooqs0000ueq5hnt737mn	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.246
cmtwyop4w002yueq5vxd7q4th	\N	\N	tenant.create	Tenant	cmtwyop4h000fueq5qrwquyfx	{"name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789131473845-782916"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.753
cmtwyop5m005mueq5vmgb4mx9	\N	\N	tenant.admin.add	TenantMembership	cmtwyop5k005kueq5z127j0x6	{"email": "e2e-biz-plain-a-1789131473845-782916@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.779
cmtwyop5z005queq5oa7fzddy	\N	\N	family.create	Family	cmtwyop5x005oueq5zf0at9xt	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.791
cmtwyoor30002ueq4wkkn2j0w	\N	\N	auth.register	User	cmtwyoor10000ueq4vzun2qe8	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.255
cmtwyop54002yueq404eqiawk	\N	\N	tenant.create	Tenant	cmtwyop4p000fueq41qzn9zbw	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789131473846-136799"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.761
cmtwyop5g0032ueq42eh632tj	\N	\N	tenant.admin.add	TenantMembership	cmtwyop5d0030ueq4jmyxlyk0	{"email": "e2e-admins-member-1789131473846-136799@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.773
cmtwyop5q0036ueq4k6lg3d87	\N	\N	tenant.admin.add	TenantMembership	cmtwyop5o0034ueq4pjijci7v	{"email": "e2e-admins-promoted-1789131473846-136799@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.783
cmtwyoor50002ueq2w5scf0bt	\N	\N	auth.register	User	cmtwyoor30000ueq21iyh3yiv	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.257
cmtwyooxi0007ueq6yzpru2tm	\N	\N	auth.register	User	cmtwyooxh0005ueq6z7xbgdkg	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.486
cmtwyop5d005iueq6fbjyjc9j	\N	\N	tenant.create	Tenant	cmtwyop52002zueq626913p9o	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131473845-46468"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.769
cmtwyooxk0007ueq51z5q2pow	\N	\N	auth.register	User	cmtwyooxj0005ueq53gf79ni4	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.488
cmtyjjoft0034uef79zzcnpbr	\N	\N	structure.update	Tenant	cmtyjji840005uef7b9rtkdwy	{"houseNumberingMethod": "ALPHANUMERIC"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 15:29:38.682
cmtyjjog80038uef74ncb4rp8	\N	\N	structure.division.create	TenantDivision	cmtyjjog70036uef7ydutlzeq	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 15:29:38.697
cmtwy5v70005nueokjxxw3l06	\N	\N	tenant.create	Tenant	cmtwy5v6n0034ueokseh04457	{"name": "Existing Mahalle", "slug": "existing-mahalle"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 12:43:16.14
cmtwyfjru0002uepc6b106gtr	\N	\N	auth.register	User	cmtwyfjrp0000uepc3yhve9sc	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:47.898
cmtwyfjry0002uepahe62krr9	\N	\N	auth.register	User	cmtwyfjrw0000uepagya6cwu7	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:47.902
cmtwyfjry0002uep8zxqd8ubi	\N	\N	auth.register	User	cmtwyfjrx0000uep8n6q53bql	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:47.903
cmue5jf1t0cwbue6tdjnxdudq	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:41:50.705
cmtwyfjs50002uepdsvg60fi1	\N	\N	auth.register	User	cmtwyfjs40000uepdaaepyuy6	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:47.91
cmtwyfjs70002uepb5v61efbe	\N	\N	auth.register	User	cmtwyfjs50000uepbwbxxybed	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:47.911
cmtwyfjs80002uep9lhuyg58n	\N	\N	auth.register	User	cmtwyfjs60000uep9srhqz8c3	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:47.912
cmtze7rcb006que8kypyvuqrr	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:48:10.668
cmtzigur8000vuepii0ta1l1m	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:47:13.461
cmtzigvdw000xuepitvwmwv6g	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:47:14.277
cmtzigw04000zuepis17xanj3	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:47:15.077
cmtzpu5ov001tuev7mer9dsxm	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 11:13:31.47
cmu03pk3c0001uezoqia2yn0i	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.collectionCategory.remove	CollectionCategory	cmu010weo00ptue6swmtb16r0	{"name": "Zakat"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:41:51.48
cmu13saw4006kue1w6qnyr5rn	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:31:45.7
cmtwyop5c005iueq5bvr8aeae	\N	\N	tenant.create	Tenant	cmtwyop52002zueq5ky5d5w4f	{"name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789131473845-782916"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.768
cmtwyooxl0007ueq7q4lgeh3a	\N	\N	auth.register	User	cmtwyooxj0005ueq7znew5iqc	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.489
cmtwyop4w002yueq7amg43kag	\N	\N	tenant.create	Tenant	cmtwyop4h000fueq73ddz9z30	{"name": "E2E Tenant", "slug": "e2e-tenant-1789131473845-473068"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.752
cmtwyooxw0007ueq4mpizs3ec	\N	\N	auth.register	User	cmtwyooxv0005ueq49699i3hu	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.501
cmtwyooxx0007ueq2absjhlcn	\N	\N	auth.register	User	cmtwyooxw0005ueq2huen8ytc	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.502
cmtwyop700034ueq2bojiel4o	\N	\N	platform.tenant.suspend	Tenant	cmtwyop5a000jueq2sko6l8vg	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131473845-902249"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.828
cmtwyop770036ueq27ycb1wmp	\N	\N	platform.tenant.activate	Tenant	cmtwyop5a000jueq2sko6l8vg	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131473845-902249"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.836
cmtwyop7z0039ueq2it0x5xu6	\N	\N	platform.role.permissions_update	Role	cmtwyop5e001gueq2pqyjmh7t	{"roleKey": "ADMIN", "permissions": ["members.view"]}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.864
cmtwyop45000cueq5tyl8ryik	\N	\N	auth.register	User	cmtwyop43000aueq5fq203q0w	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.725
cmtwyop47000cueq6eqdexjci	\N	\N	auth.register	User	cmtwyop43000aueq6x23wb7he	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.728
cmtwyop47000cueq7qwdf1du8	\N	\N	auth.register	User	cmtwyop44000aueq7iuo9l218	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.727
cmtwyop4g000cueq41gu12g9q	\N	\N	auth.register	User	cmtwyop4f000aueq4j2hsq0ud	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.737
cmtwyop6g0038ueq4j9xdt1o2	\N	\N	tenant.admin.role_change	TenantMembership	cmtwyop5d0030ueq4jmyxlyk0	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.809
cmtwyop4w000cueq2cejq5lkk	\N	\N	auth.register	User	cmtwyop4v000aueq29g997nzp	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.752
cmtwyop5n0032ueq2yz8zscjk	\N	\N	tenant.create	Tenant	cmtwyop5a000jueq2sko6l8vg	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131473845-902249"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.779
cmtwyopu6000lueq36ndcnocn	\N	\N	auth.register	User	cmtwyopu4000jueq359jolvvp	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:55.663
cmtwyoq6b000vueq3cbhgooj2	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:56.099
cmtwyoq6k000zueq3jl2zltvk	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:56.109
cmtwyq6fb000euec5bjbgzqwj	\N	\N	auth.register	User	cmtwyq6f8000cuec5vu1wh3ha	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 12:59:03.815
cmtwyqbpz0030uec53n8oxv8f	\N	\N	tenant.create	Tenant	cmtwyqbp6000huec5gpegp0sr	{"name": "Live Verify Mahall", "slug": "live-verify-1789131543"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 12:59:10.68
cmtwyqukx0036uec5uz78dqre	\N	\N	platform.tenant.suspend	Tenant	cmtwyqbp6000huec5gpegp0sr	{"name": "Live Verify Mahall", "slug": "live-verify-1789131543"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 12:59:35.121
cmtwyr1e5003buec5ndnsbajh	\N	\N	platform.role.permissions_update	Role	cmtwyqbpg001euec5hievrhxl	{"roleKey": "ADMIN", "permissions": ["members.view"]}	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 12:59:43.949
cmtwyr1er003duec52nv3v706	\N	\N	platform.tenant.activate	Tenant	cmtwyqbp6000huec5gpegp0sr	{"name": "Live Verify Mahall", "slug": "live-verify-1789131543"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 12:59:43.971
cmtwyr1ff003fuec571oqh4da	\N	\N	platform.tenant.delete	Tenant	cmtwyqbp6000huec5gpegp0sr	{"name": "Live Verify Mahall", "slug": "live-verify-1789131543"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 12:59:43.996
cmtykt7uo0002uesbw59sijha	\N	\N	auth.register	User	cmtykt7ue0000uesbquzsuhby	\N	::1	curl/8.7.1	2026-09-12 16:05:03.36
cmtyktdtv0006uesb1vsu02vk	\N	\N	auth.login.success	\N	\N	\N	::1	curl/8.7.1	2026-09-12 16:05:11.108
cmtyku01g000auesbnk67vng4	\N	\N	auth.login.success	\N	\N	\N	::1	curl/8.7.1	2026-09-12 16:05:39.893
cmue69dxk0cwdue6tb099pzqa	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:02:02.312
cmtwyhvr3000guew1naoq49o6	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131155222-881274@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.736
cmtwyhvr7000iuew1k8hx5uyj	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131155222-881274@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.739
cmtwyfjym0006uep9gxzbfb4k	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131047553-348368@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:50:48.143
cmtwyfk4n0008uep9j3ims05a	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131047553-348368@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:50:48.359
cmtwyfkae000auep9na4g2wdl	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131047553-348368@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:50:48.567
cmtwyfkg6000cuep98ioxn5oq	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131047553-348368@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:50:48.774
cmtwyfklw000euep9qi9xh9p1	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131047553-348368@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:50:48.98
cmtwyfjyq0007uepdj6tr8gur	\N	\N	auth.register	User	cmtwyfjyl0005uepdz5m4whts	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:48.147
cmtwyfkrs000luep9wb17b0pm	\N	\N	auth.register	User	cmtwyfkrq000juep98y9ukk2i	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:49.193
cmtwyfl3a000tuep98hn72mao	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:50:49.607
cmtwyhuu50002uew31qv9m578	\N	\N	auth.register	User	cmtwyhuu20000uew33545sqph	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.549
cmtwyhv8l002yuew39fa20uja	\N	\N	tenant.create	Tenant	cmtwyhv82000fuew3we77zen4	{"name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789131155222-962191"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.07
cmtwyhv9d005muew3nfbgzk9x	\N	\N	tenant.admin.add	TenantMembership	cmtwyhv9a005kuew3xoumds8x	{"email": "e2e-biz-plain-a-1789131155222-962191@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.097
cmtwyhv9r005quew3b5rk6uou	\N	\N	family.create	Family	cmtwyhv9p005ouew332n50rzg	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.111
cmtwyhvam005suew3stlohmf8	\N	\N	family.delete	Family	cmtwyhv9p005ouew332n50rzg	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.142
cmtwyhvb1005wuew39p6e1h13	\N	\N	event.create	Event	cmtwyhvb0005uuew3v3qoktfg	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.158
cmtwyhvds006auew3q27np7ro	\N	\N	program.delete	Program	cmtwyhvd20066uew3zkrk6iw2	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.257
cmtze8se7006uue8k51vgp4zp	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"divisionTerm": "Division", "hasDivisions": true, "houseNumberingMethod": "NUMERIC"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:48:58.688
cmtwyhvbj005yuew3kvq8an0b	\N	\N	event.delete	Event	cmtwyhvb0005uuew3v3qoktfg	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.176
cmtzih2v00011uepidlhclfkm	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:47:23.965
cmtzihk8z0015uepi4x2njgzq	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:47:46.5
cmtwyirw70002ue06jjccoaj3	\N	\N	auth.register	User	cmtwyirw50000ue06pts4r13p	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.391
cmtwyhvc00062uew3zv6f1ep1	\N	\N	announcement.create	Announcement	cmtwyhvby0060uew3miqdptny	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.192
cmtwyhvck0064uew34u3ltl13	\N	\N	announcement.delete	Announcement	cmtwyhvby0060uew3miqdptny	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.213
cmtwyhvd40068uew33iurlt17	\N	\N	program.create	Program	cmtwyhvd20066uew3zkrk6iw2	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.232
cmtwyhuup0002uew5yv34f23m	\N	\N	auth.register	User	cmtwyhuuo0000uew578dd16aw	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.57
cmtwyhuur0002uew14le5qhce	\N	\N	auth.register	User	cmtwyhuup0000uew1qj3covkj	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.571
cmtwyhv1j0006uew1zqtyy4lh	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131155222-881274@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.815
cmtwyhv8p0008uew1xmahjx3p	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131155222-881274@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.074
cmtwyhvfa000auew1l5bkk3q4	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131155222-881274@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.311
cmtwyhvl6000cuew1t1qawizl	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131155222-881274@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.522
cmtwyhvqz000euew163n1ym1v	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131155222-881274@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.731
cmtwyhuus0002uew2wsxemlh8	\N	\N	auth.register	User	cmtwyhuur0000uew21pxbmn3l	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.573
cmtze9ylf006wue8kgwo94i8o	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:49:53.38
cmtzeavrf0072ue8kpzx2upr5	cmtv96wx6000tue7wfg2rfzuu	cmtyh4tr8002yuebkqxkrgukw	platform.support.end	Tenant	cmtyh4tr8002yuebkqxkrgukw	{"name": "Mahalle", "slug": "mahalle"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:50:36.363
cmtwyhv8y002yuew2y5pmyu0d	\N	\N	tenant.create	Tenant	cmtwyhv8j000fuew22b27a4qc	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789131155222-947720"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.083
cmtwyhv9k0036uew2la77wlt5	\N	\N	tenant.admin.add	TenantMembership	cmtwyhv9i0034uew2ik4labr6	{"email": "e2e-admins-promoted-1789131155222-947720@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.104
cmtwyhvbb003auew2ivlkzai9	\N	\N	tenant.admin.remove	TenantMembership	cmtwyhv9i0034uew2ik4labr6	{"removedRole": "ADMIN", "removedUserId": "cmtwyhv85000auew2vi1kmd9v"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.167
cmtzih9jt0013uepiks6z8g9x	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:47:32.634
cmtzqe3xy001xuev7b36lfvoa	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 11:29:02.322
cmu03poa70003uezomt5lhoz0	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.collectionCategory.remove	CollectionCategory	cmu010wep00pvue6sjffdx5l2	{"name": "Fitra"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:41:56.911
cmu13smkw006mue1wodc3zn2l	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:32:00.848
cmtwyisbs005mue08zdnox7am	\N	\N	tenant.admin.add	TenantMembership	cmtwyisbp005kue08ksfo5140	{"email": "e2e-biz-plain-a-1789131198043-459117@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.952
cmtwyisc5005que08pbsx4mid	\N	\N	family.create	Family	cmtwyisc3005oue08oqinowik	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.965
cmtwyisf40064ue08v76tcvvb	\N	\N	announcement.delete	Announcement	cmtwyisej0060ue08xvrtuwme	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.073
cmtwyisfh0068ue08tl2pk077	\N	\N	program.create	Program	cmtwyisfg0066ue08g27omj3l	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.085
cmtwyr7wt0061uec50olcqjbx	\N	\N	tenant.create	Tenant	cmtwyr7w8003iuec5u13ahdk6	{"name": "View Test Mahall", "slug": "live-verify-1789131543-view"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 12:59:52.397
cmtwytqd60002ue6xrsge51a9	\N	\N	auth.register	User	cmtwytqd40000ue6xsrdga8d9	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.627
cmtwytqd70002ue6yif0uz0iu	\N	\N	auth.register	User	cmtwytqd50000ue6y7vhufdv6	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.627
cmtwytqtd005sue6ykhv9wfto	\N	\N	family.delete	Family	cmtwytqsh005oue6yevsca5nz	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.209
cmtwytqtu005wue6ysus06831	\N	\N	event.create	Event	cmtwytqts005uue6yh8zlx8ac	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.226
cmtwytqud005yue6yqo3mt9py	\N	\N	event.delete	Event	cmtwytqts005uue6yh8zlx8ac	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.245
cmtwytquu0062ue6y1kak94pv	\N	\N	announcement.create	Announcement	cmtwytqur0060ue6ypkdt3fqu	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.262
cmtwytqd90002ue6vibou6qgm	\N	\N	auth.register	User	cmtwytqd70000ue6vwire9nbg	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.629
cmtwytqux005tue6vzq8u6hr2	\N	\N	tenant.create	Tenant	cmtwytque003aue6vq15zg5br	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789131709282-410246-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.265
cmtwytqdf0002ue6wvvwyaoyq	\N	\N	auth.register	User	cmtwytqde0000ue6wsx7gf66k	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.636
cmtwytqjw0006ue6wfx9ovoyh	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131709282-112916@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.869
cmtwytqdm0002ue6zotm15jah	\N	\N	auth.register	User	cmtwytqdl0000ue6zm50ybsjl	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.642
cmtwytqth005sue6zqjhe6y9n	\N	\N	member.update	Member	cmtwytqsn005oue6zrr8oed84	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.214
cmtwytqtx005uue6zogj8p5ir	\N	\N	member.delete	Member	cmtwytqsn005oue6zrr8oed84	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.229
cmtwytqdu0002ue706szyfxz9	\N	\N	auth.register	User	cmtwytqds0000ue70fuwxu0pr	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.65
cmtwytqk10007ue6xqmvc3fm0	\N	\N	auth.register	User	cmtwytqjz0005ue6xw3j22u7w	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.873
cmtwytqk30007ue6yenbxk9v6	\N	\N	auth.register	User	cmtwytqk20005ue6y1ja19aa4	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.875
cmtwytqk60007ue6viydy8mbz	\N	\N	auth.register	User	cmtwytqk50005ue6vzi3hp5d2	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.878
cmtwytqv3005vue6vnncdlsuz	\N	\N	platform.tenant.delete	Tenant	cmtwytque003aue6vq15zg5br	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789131709282-410246-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.272
cmtwytqtc0034ue6vy13avvi1	\N	\N	platform.tenant.suspend	Tenant	cmtwytqrn000jue6v3n2yrta1	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131709282-410246"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.208
cmtwytqti0036ue6v2gl9nvun	\N	\N	platform.tenant.activate	Tenant	cmtwytqrn000jue6v3n2yrta1	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131709282-410246"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.215
cmtwytqu20039ue6voqlzktyr	\N	\N	platform.role.permissions_update	Role	cmtwytqrr001gue6vzj4npka2	{"roleKey": "ADMIN", "permissions": ["members.view"]}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.234
cmtwytqra000cue6vqrukbu3o	\N	\N	auth.register	User	cmtwytqr9000aue6vcdd7n1lf	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.135
cmtwytqs10032ue6vj9j1l70z	\N	\N	tenant.create	Tenant	cmtwytqrn000jue6v3n2yrta1	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131709282-410246"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.162
cmtwz8pzz0002uecck1gfvxm9	\N	\N	auth.register	User	cmtwz8pzr0000ueccsus5lryx	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:28.991
cmtwz8q010002ueca6b859ssx	\N	\N	auth.register	User	cmtwz8pzz0000uecaaq4djafq	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:28.993
cmtwz8qk5000auec9no2d74vt	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132408620-671090@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.717
cmtwz8q050002uec96wb1r5oh	\N	\N	auth.register	User	cmtwz8q040000uec90wejag1v	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:28.997
cmtwz8q700006uec96ca5hlfx	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132408620-671090@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.245
cmtykz9lz0009uedfw5cnjui7	\N	\N	member.create	Member	cmtykz9ls0007uedfrv3vwxfr	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:09:45.575
cmtwyhuux0002uew09o0hjxow	\N	\N	auth.register	User	cmtwyhuuw0000uew0sfp0c2rh	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.578
cmtwyhvbz005tuew0qoi1klzg	\N	\N	tenant.create	Tenant	cmtwyhvbj003auew0wvtkr28i	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789131155221-973344-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.191
cmtwyhuv40002uew4jklnb3eg	\N	\N	auth.register	User	cmtwyhuv30000uew4yfmmxpxr	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.585
cmtwyhv94002yuew4swt90zh2	\N	\N	tenant.create	Tenant	cmtwyhv8p000fuew4c3l6yd3c	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789131155222-113417"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.088
cmtzeang30070ue8kryw6u0z1	cmtv96wx6000tue7wfg2rfzuu	cmtyh4tr8002yuebkqxkrgukw	platform.support.start	Tenant	cmtyh4tr8002yuebkqxkrgukw	{"name": "Mahalle", "slug": "mahalle", "reason": "sax"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:50:25.588
cmue7d7lu0d1bue6thsyngsoc	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:33:00.354
cmtwyhv9w005muew4dt3g4bxj	\N	\N	tenant.admin.add	TenantMembership	cmtwyhv9t005kuew43nziuj6w	{"email": "e2e-members-plain-a-1789131155222-113417@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.116
cmtwyhva9005quew48e4phfzu	\N	\N	member.create	Member	cmtwyhva7005ouew4bbi1jew2	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.13
cmtwyhvb0005suew4zpp9lho1	\N	\N	member.update	Member	cmtwyhva7005ouew4bbi1jew2	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.157
cmue7dbac0d1due6t0cnwuudd	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:33:05.124
cmtzeb46q0074ue8km1j3wnr8	cmtv96wx6000tue7wfg2rfzuu	cmtyh4tr8002yuebkqxkrgukw	platform.support.start	Tenant	cmtyh4tr8002yuebkqxkrgukw	{"name": "Mahalle", "slug": "mahalle", "reason": "s"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:50:47.282
cmtzijviy0001ueed6uvwcrf6	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:49:34.426
cmtzqxlut0021uev7pqrwo994	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 11:44:12.002
cmu03pvwd0005uezob63i6wte	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.expenseCategory.deactivate	ExpenseCategory	cmu010wew00qdue6sguq6yctd	{"name": "Office Stationery & Supplies"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:42:06.781
cmu0v1qzc0001uetf5xh1dz81	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:27:09.911
cmu1459fr003puejcmj9jx29d	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"familyStatusTerm": "Category", "hasFamilyStatuses": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:41:50.343
cmtwyisda005vue05hzreue00	\N	\N	platform.tenant.delete	Tenant	cmtwyiscm003aue051kyvm0ew	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789131198043-549987-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.007
cmtwyisbs0036ue05qq9saadm	\N	\N	platform.tenant.activate	Tenant	cmtwyis9u000jue05zzjfrulk	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131198043-549987"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.953
cmtwyiscc0039ue053sxabxuq	\N	\N	platform.role.permissions_update	Role	cmtwyis9y001gue05yw39virv	{"roleKey": "ADMIN", "permissions": ["members.view"]}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.972
cmtwz8qdm0008uec958qykl5k	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132408620-671090@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.482
cmtwz8q050002uecd3lwbfe73	\N	\N	auth.register	User	cmtwz8q040000uecdwbt1tzqq	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:28.998
cmtwz8q090002uec8k1rbhsj9	\N	\N	auth.register	User	cmtwz8q080000uec80e940cje	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.002
cmtwz8qj800b7uec8836re2pf	\N	\N	tenant.create	Tenant	cmtwz8qiy008ouec81w8imqnm	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789132408619-200997-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.685
cmtwz8q6q0007uecd3tdhxpaq	\N	\N	auth.register	User	cmtwz8q6o0005uecd60tu1vjz	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.234
cmtwz8q0g0002uecbaa26bz2y	\N	\N	auth.register	User	cmtwz8q0e0000uecbk98wi2ny	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.008
cmtwz8qgx005wuecb3txjsjfa	\N	\N	event.create	Event	cmtwz8qgv005uuecb0l5ard50	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.601
cmtwz8qhf005yuecbkjlm4xfc	\N	\N	event.delete	Event	cmtwz8qgv005uuecb0l5ard50	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.619
cmtwz8qhv0062uecbqna7jtqo	\N	\N	announcement.create	Announcement	cmtwz8qht0060uecbxw8grcg3	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.635
cmtwz8qj8006auecb1kc062gv	\N	\N	program.delete	Program	cmtwz8qir0066uecbg7g5cg1n	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.685
cmtwz8q790007uecbv2z8l1es	\N	\N	auth.register	User	cmtwz8q780005uecbf3hqynjy	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.253
cmtwz8qdt000cuecbyv4oydk7	\N	\N	auth.register	User	cmtwz8qds000auecbrwpz2bvp	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.489
cmtwz8q6o0007ueca4qkd3xxs	\N	\N	auth.register	User	cmtwz8q6m0005uecardigeq0x	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.232
cmtwz8qde000cuecanfmnxl1v	\N	\N	auth.register	User	cmtwz8qdc000aueca4vup6nuq	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.474
cmtwz8q6t0007uecczpqj4846	\N	\N	auth.register	User	cmtwz8q6s0005ueccfkpno8rb	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.238
cmtwz8qdq000cueccql2dtw95	\N	\N	auth.register	User	cmtwz8qdp000aueccz9ye02yq	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.487
cmtwz8q7a0007uec8zbwe7wsr	\N	\N	auth.register	User	cmtwz8q790005uec89ihxft33	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.254
cmtwz8qfs0034uec8newud8wd	\N	\N	platform.tenant.suspend	Tenant	cmtwz8qe8000juec8lutedw0u	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789132408619-200997"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.56
cmtwz8qio008luec8rt2rz2ao	\N	\N	platform.tenant.delete	Tenant	cmtwz8qhp003guec8fzarpqyu	{"bulk": true, "name": "Bulk Delete Me 1", "slug": "e2e-platform-1789132408619-200997-bulk-1"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.664
cmtwz8qig008juec8tmzwr3xv	\N	\N	tenant.create	Tenant	cmtwz8qi50060uec86entx2v7	{"name": "Bulk Delete Me 2", "slug": "e2e-platform-1789132408619-200997-bulk-2"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.656
cmtyl0eik0003uei25e3ubapb	\N	\N	member.create	Member	cmtyl0eic0001uei207xq8fr2	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:10:38.588
cmtyl0ej20007uei2o7t1v4xi	\N	\N	member.create	Member	cmtyl0eiz0005uei26otk0fo9	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:10:38.606
cmtwyhvbf005uuew4not1bclb	\N	\N	member.delete	Member	cmtwyhva7005ouew4bbi1jew2	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.172
cmtwyhv0z0007uew3mvb3tso7	\N	\N	auth.register	User	cmtwyhv0x0005uew30ihow6p3	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.795
cmtwyhv91005iuew3z5i4656j	\N	\N	tenant.create	Tenant	cmtwyhv8r002zuew3h2syi7jn	{"name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789131155222-962191"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.086
cmtwyhv1j0007uew2ea5kvyvv	\N	\N	auth.register	User	cmtwyhv1h0005uew2w9hv5wtr	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.815
cmtwyhv1r0007uew0bmulc1oc	\N	\N	auth.register	User	cmtwyhv1p0005uew0jmn1y0dv	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.823
cmtwyhvc6005vuew0xqpdpvtx	\N	\N	platform.tenant.delete	Tenant	cmtwyhvbj003auew0wvtkr28i	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789131155221-973344-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.199
cmtwyhvah0034uew0jp27xlg3	\N	\N	platform.tenant.suspend	Tenant	cmtwyhv8t000juew02yiv0dmd	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131155221-973344"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.138
cmtwyhvao0036uew09gh99ltg	\N	\N	platform.tenant.activate	Tenant	cmtwyhv8t000juew02yiv0dmd	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131155221-973344"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.145
cmtwyhvb80039uew038r1bf6m	\N	\N	platform.role.permissions_update	Role	cmtwyhv8x001guew0r1mp6244	{"roleKey": "ADMIN", "permissions": ["members.view"]}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.165
cmtwyhv1u0007uew5q1nqhgir	\N	\N	auth.register	User	cmtwyhv1t0005uew5lykxr2oi	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.826
cmtwyhv220007uew462zutoa5	\N	\N	auth.register	User	cmtwyhv210005uew4715sf8mk	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:35.835
cmue8dx1v0d5rue6t8cuw4uln	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:01:32.947
cmtwyhv9l005iuew4mu16ct9z	\N	\N	tenant.create	Tenant	cmtwyhv99002zuew4w6u5nufr	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131155222-113417"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.105
cmtwyhv7k000cuew366q8mqlq	\N	\N	auth.register	User	cmtwyhv7j000auew3z497pfjo	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.033
cmtzikwxv0005ueedjcq9bpb6	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:50:22.915
cmtzilscb0007ueedpo45amqs	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:03.611
cmtzilxps000dueedioypfsnf	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:10.576
cmtzilzwt000fueedeheasurx	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:13.421
cmtzrengd0025uev79zmbt8i7	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"divisionTerm": "", "hasDivisions": true, "houseNumberPrefix": null, "houseNumberingMethod": "PER_DIVISION", "previousHouseNumberingMethod": "GLOBAL"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 11:57:27.229
cmu03pyci0007uezo9ty0eyva	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.expenseCategory.deactivate	ExpenseCategory	cmu010wev00q9ue6sfzqmdaxz	{"name": "Masjid Maintenance"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:42:09.954
cmu0vqsbf0005uetff4f6urle	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:46:38.043
cmu145jp4003tuejc48rmx5lw	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.family_status.create	TenantFamilyStatus	cmu145jp2003ruejcyr9f6ac0	{"name": "BPL"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:42:03.641
cmtwyisd2005sue081d2ljqcy	\N	\N	family.delete	Family	cmtwyisc3005oue08oqinowik	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.999
cmtwyisdj005wue08acdr887i	\N	\N	event.create	Event	cmtwyisdh005uue088qsg0hrm	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.015
cmtwyise4005yue08cglkb0qf	\N	\N	event.delete	Event	cmtwyisdh005uue088qsg0hrm	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.036
cmtwyisel0062ue08xd4ck0jk	\N	\N	announcement.create	Announcement	cmtwyisej0060ue08xvrtuwme	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.053
cmtwyisfr006aue08h72jzv52	\N	\N	program.delete	Program	cmtwyisfg0066ue08g27omj3l	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.095
cmtwz8qiq008nuec8t7scwqq2	\N	\N	platform.tenant.delete	Tenant	cmtwz8qi50060uec86entx2v7	{"bulk": true, "name": "Bulk Delete Me 2", "slug": "e2e-platform-1789132408619-200997-bulk-2"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.667
cmtwz8qfz0036uec8w5kng8fw	\N	\N	platform.tenant.activate	Tenant	cmtwz8qe8000juec8lutedw0u	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789132408619-200997"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.567
cmtwz8qje00b9uec8inw4qqxw	\N	\N	platform.tenant.delete	Tenant	cmtwz8qiy008ouec81w8imqnm	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789132408619-200997-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.69
cmtwz8qgj0039uec8oatgt15f	\N	\N	platform.role.permissions_update	Role	cmtwz8qec001guec88kd4tw4z	{"roleKey": "ADMIN", "permissions": ["members.view"]}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.587
cmtwz8qh2003duec88secl4hs	\N	\N	member.create	Member	cmtwz8qh0003buec8fesmkftx	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.607
cmtwz8qhb003fuec8vbzao6qj	\N	\N	member.delete	Member	cmtwz8qh0003buec8fesmkftx	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.616
cmtyl4axd0009uei2srwtmuc4	\N	\N	member.update	Member	cmtyl0eiz0005uei26otk0fo9	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:13:40.562
cmtzee9x40002uehmta94m4q0	\N	\N	auth.register	User	cmtzee9wy0000uehmhijx4ya2	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:53:14.68
cmtzeea3d0006uehmk7zbuf2o	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:53:14.906
cmtzeea4u005uuehmpnmczhro	\N	\N	tenant.create	Tenant	cmtzeea4c0009uehmuvgiy46i	{"name": "Section 234 Mahallu", "slug": "section234-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:53:14.958
cmtzefvdi007auehmblzpm80n	\N	\N	family.create	Family	cmtzefvde0078uehmfqw8vnze	{"houseId": "cmtzefdjr006iuehmmh1ocqag", "familyNumber": "F-00001"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:29.143
cmtzefve1007guehm6wydmfpi	\N	\N	family.create	Family	cmtzefvdz007euehmsq27yzok	{"houseId": "cmtzefdjr006iuehmmh1ocqag", "familyNumber": "F-00002"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:29.162
cmtzefvel007muehmraffaztb	\N	\N	family.create	Family	cmtzefvej007kuehmp33g24mu	{"familyNumber": "F-00003"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:29.181
cmtwyhv86000cuew2zm243o9a	\N	\N	auth.register	User	cmtwyhv85000auew2vi1kmd9v	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.055
cmtwyhvad0038uew2dodmgczw	\N	\N	tenant.admin.role_change	TenantMembership	cmtwyhv990030uew26txaw8pp	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.133
cmtwyisrr000gue06sypawv52	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131198043-780570@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.527
cmtwyisru000iue06dyf2mwxw	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131198043-780570@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.531
cmtwyhv8e000cuew0zdyvlzum	\N	\N	auth.register	User	cmtwyhv8d000auew03vr5fxzv	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.062
cmtwyhv960032uew0ct4955ap	\N	\N	tenant.create	Tenant	cmtwyhv8t000juew02yiv0dmd	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131155221-973344"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.09
cmtwyhv8f000cuew490ynzxca	\N	\N	auth.register	User	cmtwyhv8e000auew40tpv3lzp	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.063
cmtwyhv8r000cuew5sky9pmba	\N	\N	auth.register	User	cmtwyhv8q000auew5o22tat2o	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.075
cmtwylknd0001uec5zpf82s0j	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:55:28.969
cmtwyoaba0005uec55hxjgi3k	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:57:35.543
cmtwyhvwy000luew1p8bfmuhr	\N	\N	auth.register	User	cmtwyhvww000juew1oo57y1r9	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.946
cmtwyhw2v000puew11b2l6e9w	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:37.159
cmtwyhw93000vuew18lm52pwr	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:37.383
cmtwyhw99000zuew1yma2m4td	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:52:37.389
cmtwyirvv0002ue098e5utmwd	\N	\N	auth.register	User	cmtwyirvs0000ue09huwoztj9	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.379
cmtwyis9x002yue09jvenb0st	\N	\N	tenant.create	Tenant	cmtwyis9g000fue09kfutvd9w	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789131198043-13614"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.886
cmtwyisaq005mue09van930fk	\N	\N	tenant.admin.add	TenantMembership	cmtwyisan005kue09a9cwpxhf	{"email": "e2e-members-plain-a-1789131198043-13614@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.915
cmtwyisb9005que09h70e35cn	\N	\N	member.create	Member	cmtwyisb6005oue09n40alaa3	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.933
cmtwyisbx005sue096gu3zkqo	\N	\N	member.update	Member	cmtwyisb6005oue09n40alaa3	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.958
cmtwyiscd005uue09528vf9vh	\N	\N	member.delete	Member	cmtwyisb6005oue09n40alaa3	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.973
cmtwyirvy0002ue05wsiwig4p	\N	\N	auth.register	User	cmtwyirvw0000ue05kqllvzmu	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.382
cmtwyisd4005tue05qorn7272	\N	\N	tenant.create	Tenant	cmtwyiscm003aue051kyvm0ew	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789131198043-549987-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.001
cmtwyirw30002ue0abylhzkvr	\N	\N	auth.register	User	cmtwyirw10000ue0agrdrekwa	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.387
cmtwyirw50002ue07p0a78q8h	\N	\N	auth.register	User	cmtwyirw30000ue07zwzqxljp	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.389
cmtwyisa5002yue07j43od5u5	\N	\N	tenant.create	Tenant	cmtwyis9r000fue07rfw2qrqy	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789131198042-497034"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.893
cmtwyisai0032ue0762irb6yk	\N	\N	tenant.admin.add	TenantMembership	cmtwyisaf0030ue07hqga4byu	{"email": "e2e-admins-member-1789131198042-497034@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.906
cmtwyiscl003aue07fwj2v0dd	\N	\N	tenant.admin.remove	TenantMembership	cmtwyisao0034ue07ysk9lcey	{"removedRole": "ADMIN", "removedUserId": "cmtwyis9e000aue07170bk1l2"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.981
cmu729x5z00edueokqloikjam	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.bulk_delete	User	\N	{"deletedCount": 99, "deletedUsers": [{"id": "cmtvdrve5000auekj1actbjuc", "email": "e2e-members-plain-a-1789035883899-285357@example.com", "fullName": "Test User"}, {"id": "cmtvdrve8000auekkf9x5bj8j", "email": "e2e-outsider-1789035883899-124109@example.com", "fullName": "Test User"}, {"id": "cmtvdrw3e000juekhl1k80u25", "email": "e2e-auth-2-1789035883899-924476@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtve6mnc0000uescss5f8g9o", "email": "e2e-admins-owner-1789036572276-912031@example.com", "fullName": "Test User"}, {"id": "cmtve6mnf0000ueseof7wtbgz", "email": "e2e-members-owner-a-1789036572277-393567@example.com", "fullName": "Test User"}, {"id": "cmtve6mnh0000uesg3f22puga", "email": "e2e-platform-staff-1789036572277-644307@example.com", "fullName": "Test User"}, {"id": "cmtve6mnk0000uesb0cm3evxc", "email": "e2e-auth-1789036572277-999629@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtve6mno0000uesdm7c5hs6x", "email": "e2e-biz-owner-a-1789036572276-845338@example.com", "fullName": "Test User"}, {"id": "cmtve6mns0000uesfk5qk4arc", "email": "e2e-owner-reserved-1789036572277-441424@example.com", "fullName": "Test User"}, {"id": "cmtve6mu20005uescefn35j7v", "email": "e2e-admins-member-1789036572276-912031@example.com", "fullName": "Test User"}, {"id": "cmtve6mu30005uesg46ym11cq", "email": "e2e-platform-tenant-owner-1789036572277-644307@example.com", "fullName": "Test User"}, {"id": "cmtve6mu60005uese3nadqqgj", "email": "e2e-members-owner-b-1789036572277-393567@example.com", "fullName": "Test User"}, {"id": "cmtve6mum0005uesfxahk4mp7", "email": "e2e-owner-1789036572277-441424@example.com", "fullName": "Test User"}, {"id": "cmtve6muo0005uesdmdn2aqmo", "email": "e2e-biz-owner-b-1789036572276-845338@example.com", "fullName": "Test User"}, {"id": "cmtve6n0k000auesczdt91gwq", "email": "e2e-admins-promoted-1789036572276-912031@example.com", "fullName": "Test User"}, {"id": "cmtve6n0r000aueserz9ahig3", "email": "e2e-members-plain-a-1789036572277-393567@example.com", "fullName": "Test User"}, {"id": "cmtve6n0x000auesf2i9sodk8", "email": "e2e-outsider-1789036572277-441424@example.com", "fullName": "Test User"}, {"id": "cmtve6n14000auesdnmmycywy", "email": "e2e-biz-plain-a-1789036572276-845338@example.com", "fullName": "Test User"}, {"id": "cmtve6noz000juesbzja8f4n6", "email": "e2e-auth-2-1789036572277-999629@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvebdny0000ueaiq1j2k2hf", "email": "e2e-admins-owner-1789036794488-274433@example.com", "fullName": "Test User"}, {"id": "cmtvebdnw0000ueam96cbg36f", "email": "e2e-platform-staff-1789036794488-906780@example.com", "fullName": "Test User"}, {"id": "cmtvebdnw0000ueaku7zr146k", "email": "e2e-members-owner-a-1789036794488-83155@example.com", "fullName": "Test User"}, {"id": "cmtvebdo00000ueajt5fmhrsh", "email": "e2e-biz-owner-a-1789036794489-498592@example.com", "fullName": "Test User"}, {"id": "cmtvebdo00000ueah5zuphvzv", "email": "e2e-auth-1789036794488-991076@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvebdo40000uealdwau8ish", "email": "e2e-owner-reserved-1789036794488-331358@example.com", "fullName": "Test User"}, {"id": "cmtvebdvo0005ueakra5v4e94", "email": "e2e-members-owner-b-1789036794488-83155@example.com", "fullName": "Test User"}, {"id": "cmtvebdvv0005ueamq6ps56mc", "email": "e2e-platform-tenant-owner-1789036794488-906780@example.com", "fullName": "Test User"}, {"id": "cmtvebdvx0005ueaibevdwgcz", "email": "e2e-admins-member-1789036794488-274433@example.com", "fullName": "Test User"}, {"id": "cmtvebdvz0005ueajgknm9xgu", "email": "e2e-biz-owner-b-1789036794489-498592@example.com", "fullName": "Test User"}, {"id": "cmtvebdwb0005ueal4ppg1ucd", "email": "e2e-owner-1789036794488-331358@example.com", "fullName": "Test User"}, {"id": "cmtvebe2o000aueaib0f0p248", "email": "e2e-admins-promoted-1789036794488-274433@example.com", "fullName": "Test User"}, {"id": "cmtvebe2q000aueakj9rzduhp", "email": "e2e-members-plain-a-1789036794488-83155@example.com", "fullName": "Test User"}, {"id": "cmtvebe2s000aueaju1syl1n0", "email": "e2e-biz-plain-a-1789036794489-498592@example.com", "fullName": "Test User"}, {"id": "cmtvebe30000auealsbxhqxl2", "email": "e2e-outsider-1789036794488-331358@example.com", "fullName": "Test User"}, {"id": "cmtveberm000jueahx2lntz8r", "email": "e2e-auth-2-1789036794488-991076@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvitwvq0000uerqcjae2wbz", "email": "test@mahall.in", "fullName": "test"}, {"id": "cmtvkeu8p005zuerqah3pw5cb", "email": "testuser@mahal.in", "fullName": "Testuser1"}, {"id": "cmtwq3aln0000uevonkq9fp2d", "email": "demo@example.com", "fullName": "Demo User"}, {"id": "cmtwq3ndr0005uevoa3qtc9bx", "email": "demo2@example.com", "fullName": "Demo Two"}, {"id": "cmtwy50440000ueokj6cfq7h1", "email": "demo3@example.com", "fullName": "Demo Three"}, {"id": "cmtwy55mr0005ueokzxjk4bpl", "email": "demo4@example.com", "fullName": "Demo Four"}, {"id": "cmtwy5c6x002uueokfnvqjtie", "email": "demo5@example.com", "fullName": "Demo Five"}, {"id": "cmtvde144000auesuqg4w38lo", "email": "e2e-admins-promoted-1789035238215-185355@example.com", "fullName": "Test User"}, {"id": "cmtvde14c000auesvwplnro30", "email": "e2e-outsider-1789035238215-492436@example.com", "fullName": "Test User"}, {"id": "cmtvde1rn000juestwx9vec51", "email": "e2e-auth-2-1789035238215-513201@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvdjlr40000uel9w1jxcgwh", "email": "e2e-admins-owner-1789035498631-518567@example.com", "fullName": "Test User"}, {"id": "cmtvdjlr80000uelcm2jabdc0", "email": "e2e-platform-staff-1789035498631-465333@example.com", "fullName": "Test User"}, {"id": "cmtvdjlr90000uelak96ikuph", "email": "e2e-members-owner-a-1789035498631-87979@example.com", "fullName": "Test User"}, {"id": "cmtvdjlrf0000uelbv04e12qf", "email": "e2e-owner-reserved-1789035498631-416558@example.com", "fullName": "Test User"}, {"id": "cmtvdjlrf0000uel8b5qjvq5q", "email": "e2e-auth-1789035498631-883965@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvdjlxq0005uel9p5obycia", "email": "e2e-admins-member-1789035498631-518567@example.com", "fullName": "Test User"}, {"id": "cmtvdjlxw0005uelbqs84mlew", "email": "e2e-owner-1789035498631-416558@example.com", "fullName": "Test User"}, {"id": "cmtvdjlxw0005uelab8fjlxwy", "email": "e2e-members-owner-b-1789035498631-87979@example.com", "fullName": "Test User"}, {"id": "cmtvdjly20005uelc99pb17np", "email": "e2e-platform-tenant-owner-1789035498631-465333@example.com", "fullName": "Test User"}, {"id": "cmtvdjm3u000auel90kasvtjz", "email": "e2e-admins-promoted-1789035498631-518567@example.com", "fullName": "Test User"}, {"id": "cmtvdjm41000auelatonwlqt8", "email": "e2e-members-plain-a-1789035498631-87979@example.com", "fullName": "Test User"}, {"id": "cmtvdjm43000auelb641sv29b", "email": "e2e-outsider-1789035498631-416558@example.com", "fullName": "Test User"}, {"id": "cmtvdjmsc000juel8w41gs7ts", "email": "e2e-auth-2-1789035498631-883965@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvdmomb0000ue09erj6x88u", "email": "verify-owner@example.com", "fullName": "Verify Owner"}, {"id": "cmtvdrv1c0000uekl79ti2evn", "email": "e2e-platform-staff-1789035883900-662667@example.com", "fullName": "Test User"}, {"id": "cmtvdrv1c0000uekii4jk8vn8", "email": "e2e-admins-owner-1789035883899-969633@example.com", "fullName": "Test User"}, {"id": "cmtvdrv1f0000uekjm6ivez01", "email": "e2e-members-owner-a-1789035883899-285357@example.com", "fullName": "Test User"}, {"id": "cmtvdrv1l0000uekhddweego2", "email": "e2e-auth-1789035883899-924476@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvdrv1l0000uekks2q45tcu", "email": "e2e-owner-reserved-1789035883899-124109@example.com", "fullName": "Test User"}, {"id": "cmtvdrv7s0005uekiievhv44w", "email": "e2e-admins-member-1789035883899-969633@example.com", "fullName": "Test User"}, {"id": "cmtvdrv7v0005ueklp46t8mik", "email": "e2e-platform-tenant-owner-1789035883900-662667@example.com", "fullName": "Test User"}, {"id": "cmtvdrv840005uekjqzi7f47q", "email": "e2e-members-owner-b-1789035883899-285357@example.com", "fullName": "Test User"}, {"id": "cmtvdrv850005uekkqr7m422h", "email": "e2e-owner-1789035883899-124109@example.com", "fullName": "Test User"}, {"id": "cmtvdrvdv000auekilprq4v8f", "email": "e2e-admins-promoted-1789035883899-969633@example.com", "fullName": "Test User"}, {"id": "cmtwy5v5z002zueok3vzli5n6", "email": "demo6@example.com", "fullName": "Demo Six"}, {"id": "cmtwyfjrp0000uepc3yhve9sc", "email": "e2e-members-owner-a-1789131047554-770670@example.com", "fullName": "Test User"}, {"id": "cmtwyfjrw0000uepagya6cwu7", "email": "e2e-admins-owner-1789131047553-390158@example.com", "fullName": "Test User"}, {"id": "cmtwyfjrx0000uep8n6q53bql", "email": "e2e-platform-staff-1789131047553-156675@example.com", "fullName": "Test User"}, {"id": "cmtwyfjs40000uepdaaepyuy6", "email": "e2e-owner-reserved-1789131047553-254039@example.com", "fullName": "Test User"}, {"id": "cmtwyfjs50000uepbwbxxybed", "email": "e2e-biz-owner-a-1789131047553-66544@example.com", "fullName": "Test User"}, {"id": "cmtwyfjs60000uep9srhqz8c3", "email": "e2e-auth-1789131047553-348368@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtwyfjyl0005uepdz5m4whts", "email": "e2e-owner-1789131047553-254039@example.com", "fullName": "Test User"}, {"id": "cmtwyfkrq000juep98y9ukk2i", "email": "e2e-auth-2-1789131047553-348368@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtwyhuu20000uew33545sqph", "email": "e2e-biz-owner-a-1789131155222-962191@example.com", "fullName": "Test User"}, {"id": "cmtwyhuuo0000uew578dd16aw", "email": "e2e-owner-reserved-1789131155222-245387@example.com", "fullName": "Test User"}, {"id": "cmtwyhuup0000uew1qj3covkj", "email": "e2e-auth-1789131155222-881274@example.com", "fullName": "No App Header"}, {"id": "cmtwyhuur0000uew21pxbmn3l", "email": "e2e-admins-owner-1789131155222-947720@example.com", "fullName": "Test User"}, {"id": "cmtwyhuuw0000uew0sfp0c2rh", "email": "e2e-platform-staff-1789131155221-973344@example.com", "fullName": "Test User"}, {"id": "cmtwyhuv30000uew4yfmmxpxr", "email": "e2e-members-owner-a-1789131155222-113417@example.com", "fullName": "Test User"}, {"id": "cmtwyhv0x0005uew30ihow6p3", "email": "e2e-biz-owner-b-1789131155222-962191@example.com", "fullName": "Test User"}, {"id": "cmtwyhv1h0005uew2w9hv5wtr", "email": "e2e-admins-member-1789131155222-947720@example.com", "fullName": "Test User"}, {"id": "cmtwyhv1p0005uew0jmn1y0dv", "email": "e2e-platform-super-1789131155221-973344@example.com", "fullName": "Test User"}, {"id": "cmtwyhv1t0005uew5lykxr2oi", "email": "e2e-owner-1789131155222-245387@example.com", "fullName": "Test User"}, {"id": "cmtwyhv210005uew4715sf8mk", "email": "e2e-members-owner-b-1789131155222-113417@example.com", "fullName": "Test User"}, {"id": "cmtwyhv7j000auew3z497pfjo", "email": "e2e-biz-plain-a-1789131155222-962191@example.com", "fullName": "Test User"}, {"id": "cmtwyhv85000auew2vi1kmd9v", "email": "e2e-admins-promoted-1789131155222-947720@example.com", "fullName": "Test User"}, {"id": "cmtwyhv8d000auew03vr5fxzv", "email": "e2e-platform-tenant-owner-1789131155221-973344@example.com", "fullName": "Test User"}, {"id": "cmtwyhv8e000auew40tpv3lzp", "email": "e2e-members-plain-a-1789131155222-113417@example.com", "fullName": "Test User"}, {"id": "cmtwyhv8q000auew5o22tat2o", "email": "e2e-outsider-1789131155222-245387@example.com", "fullName": "Test User"}, {"id": "cmtwyhvww000juew1oo57y1r9", "email": "e2e-auth-2-1789131155222-881274@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtwyirvs0000ue09huwoztj9", "email": "e2e-members-owner-a-1789131198043-13614@example.com", "fullName": "Test User"}, {"id": "cmtwyirvw0000ue05kqllvzmu", "email": "e2e-platform-staff-1789131198043-549987@example.com", "fullName": "Test User"}, {"id": "cmtwyirw10000ue0agrdrekwa", "email": "e2e-owner-reserved-1789131198043-227906@example.com", "fullName": "Test User"}, {"id": "cmtwyirw30000ue07zwzqxljp", "email": "e2e-admins-owner-1789131198042-497034@example.com", "fullName": "Test User"}]}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:36:05.543
cmtylbsxw000buei2x2pkyr6x	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 16:19:30.5
cmuea668t0hf7ue6t9ebcytwa	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:51:30.846
cmtzeha96007ouehmw1xx01ho	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:55:35.082
cmtzehdtj007suehmyoxepy2g	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:55:39.703
cmtwyislu000cue065kha2uob	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131198043-780570@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.314
cmtwyisrn000eue060c0ybqap	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131198043-780570@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.524
cmtwyisxm000lue06dlcwnywc	\N	\N	auth.register	User	cmtwyisxj000jue06wnv2mhvt	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:19.738
cmtwyit9t000zue06yqgm4p2s	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:53:20.177
cmuea687n0hfbue6tf9viqa3n	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:51:33.396
cmuea8r1l0hfhue6tvqvaf0lm	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:53:31.114
cmtva0esc0002ue72ispqkw2z	\N	\N	auth.register	User	cmtva0es40000ue72f90zm21v	\N	::ffff:127.0.0.1	\N	2026-09-10 08:39:24.636
cmtva0eyf0006ue72riohdwfe	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789029563759-440192@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:39:24.856
cmtva0f470008ue7217zq5v10	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789029563759-440192@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:39:25.063
cmtva0f9y000aue72ii4ajgel	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789029563759-440192@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:39:25.27
cmtva0ffp000cue72cz60lk5w	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789029563759-440192@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:39:25.478
cmtva0flh000eue722f8excp1	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789029563759-440192@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:39:25.685
cmtzim31v000jueedyhogna0l	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:17.492
cmtzimbci000lueedmnagezvs	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:28.243
cmtzrewcs0027uev7hlajyejh	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"divisionTerm": "Zone", "hasDivisions": true, "houseNumberPrefix": null, "houseNumberingMethod": "PER_DIVISION", "previousDivisionTerm": ""}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 11:57:38.765
cmu03q8pd0009uezo3pgvswq1	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:42:23.377
cmu0vr2ta0009uetfcimtafwc	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:46:51.647
cmu145xfy003xuejc605wyepz	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.family_status.create	TenantFamilyStatus	cmu145xfv003vuejc6x15kp0e	{"name": "APL"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:42:21.455
cmu148yx60047uejcqfmtn6ul	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.create	House	cmu148yx20045uejctwxujxgy	{"displayNumber": "test House"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:44:43.338
cmu148yxx0049uejcdi9mvwo3	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtvmdluo0001uev04h2hb39t	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:44:43.365
cmu148yxy004buejc57ap46c2	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.house_changed	Family	cmtvmdluo0001uev04h2hb39t	{"newHouseId": "cmu148yx20045uejctwxujxgy", "newHouseNumber": "test House", "previousHouseId": null, "previousHouseNumber": null}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:44:43.367
cmtwyop64005queq63begj9eu	\N	\N	member.create	Member	cmtwyop61005oueq6ka66w6lz	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.796
cmtwz8qdt000cuec8qvqrwkxs	\N	\N	auth.register	User	cmtwz8qdr000auec8n1iskkvd	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.489
cmtwz8qek0032uec8hqc1bfcu	\N	\N	tenant.create	Tenant	cmtwz8qe8000juec8lutedw0u	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789132408619-200997"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.517
cmtwz8qdd000cuecdldgcy8tn	\N	\N	auth.register	User	cmtwz8qdb000auecd20ep9ul0	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.473
cmtwz8w4s005muedpv11zi6q1	\N	\N	tenant.admin.add	TenantMembership	cmtwz8w4o005kuedpumo48bee	{"email": "e2e-members-plain-a-1789132416074-25677@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.94
cmtwz8w55005quedpu6be7j8m	\N	\N	member.create	Member	cmtwz8w52005ouedpedrcdq04	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.954
cmtwz8w5v005suedp9ysvl1d0	\N	\N	member.update	Member	cmtwz8w52005ouedpedrcdq04	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.98
cmtwz8vq90002uednj5asfj2p	\N	\N	auth.register	User	cmtwz8vq70000uednc9jvqi0o	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.417
cmtwz8w47002yuednfcpj4ujp	\N	\N	tenant.create	Tenant	cmtwz8w3s000fuednta55b0ui	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789132416075-517458"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.92
cmtwz8w4j0032uedner7stogc	\N	\N	tenant.admin.add	TenantMembership	cmtwz8w4g0030uednvfgqp1kr	{"email": "e2e-admins-member-1789132416075-517458@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.931
cmtwz8w4s0036uedno5ih38vd	\N	\N	tenant.admin.add	TenantMembership	cmtwz8w4p0034uednb99tjib0	{"email": "e2e-admins-promoted-1789132416075-517458@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.94
cmtwz8vqb0002uedqb6msufna	\N	\N	auth.register	User	cmtwz8vq90000uedq44eqg2bn	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.419
cmtwz8vqc0002uedlzekrgqtk	\N	\N	auth.register	User	cmtwz8vqa0000uedluda92o8s	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.42
cmtwz8vqd0002uedmwf91qacn	\N	\N	auth.register	User	cmtwz8vqc0000uedmwwqhn5yy	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.422
cmtwz8vx30006uedm1qsn7v11	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132416075-242656@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.664
cmtwz8w3p0008uedm0c6c5rq2	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132416075-242656@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.902
cmtwz8w58005muedoeillrr2g	\N	\N	tenant.admin.add	TenantMembership	cmtwz8w55005kuedocoyv10jm	{"email": "e2e-biz-plain-a-1789132416075-155087@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.957
cmtwz8w5l005quedohgysjtm4	\N	\N	family.create	Family	cmtwz8w5j005ouedooclp7cak	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.969
cmtwz8vqe0002uedoh55rcgkd	\N	\N	auth.register	User	cmtwz8vqd0000uedoqd7ludql	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.423
cmtwz8w4h002yuedonj3vt6ma	\N	\N	tenant.create	Tenant	cmtwz8w43000fuedo7sj9l3ht	{"name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789132416075-155087"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.929
cmtwz8vwg0007uedp8ivpj9t2	\N	\N	auth.register	User	cmtwz8vwf0005uedp4hy7rzw6	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.641
cmtylhz070001uetpl1rh59ps	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:24:18.291
cmtyliycc003ruetp1obv7hdg	\N	\N	committee.member.create	CommitteeMember	cmtyliyc8003puetp84omk9lb	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:25:04.093
cmtylj6jz003vuetp0347j4u1	\N	\N	committee.meeting.create	CommitteeMeeting	cmtylj6jr003tuetp89zty9jh	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:25:14.736
cmtzeeikv0060uehmig13gx2v	\N	\N	structure.division.create	TenantDivision	cmtzeeikm005yuehmp6zuy7gs	{"code": "NW", "name": "North Ward"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:53:25.903
cmtva0frf000lue72zpxyag0w	\N	\N	auth.register	User	cmtva0frd000jue72zfcc7jmd	\N	::ffff:127.0.0.1	\N	2026-09-10 08:39:25.899
cmtva0fx8000pue72isah66wy	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 08:39:26.109
cmtva0g3j000vue72hr1unx0g	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 08:39:26.336
cmtva0g3s000zue72ccuz92nj	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 08:39:26.344
cmtva8fx20002ue0rp4v9dzbi	\N	\N	auth.register	User	cmtva8fwu0000ue0rghqcxbza	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.49585.0 Chrome/152.0.7977.76 Safari/537.36	2026-09-10 08:45:39.35
cmtvab0oo0006ue0rqgdms877	\N	\N	auth.login.success	\N	\N	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.49585.0 Chrome/152.0.7977.76 Safari/537.36	2026-09-10 08:47:39.576
cmtvad1ds000aue0r46hh2jdg	\N	\N	auth.login.success	\N	\N	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.49585.0 Chrome/152.0.7977.76 Safari/537.36	2026-09-10 08:49:13.792
cmtvadcxb000eue0rn3ngyl7v	\N	\N	auth.login.success	\N	\N	\N	::1	curl/8.7.1	2026-09-10 08:49:28.751
cmtvady16000iue0r4tm8ke3z	\N	\N	auth.login.success	\N	\N	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.49585.0 Chrome/152.0.7977.76 Safari/537.36	2026-09-10 08:49:56.106
cmtvale380001uecz15w17kq0	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 08:55:43.508
cmtvakwg90002ue80nfslguew	\N	\N	auth.register	User	cmtvakwg50000ue80pyk3ubw6	\N	::ffff:127.0.0.1	\N	2026-09-10 08:55:20.649
cmtzimi6z000pueedlaurj9z8	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:37.115
cmtvakwmm0006ue80o0ft870h	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030520322-152050@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:55:20.878
cmtvakwsf0008ue802q8luo7s	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030520322-152050@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:55:21.087
cmtzimkn9000rueedkizpffao	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:40.294
cmtvakwy9000aue803jcpdg3p	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030520322-152050@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:55:21.297
cmtvakx43000cue80wfkj3bad	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030520322-152050@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:55:21.507
cmtvakxa2000eue80orom1pcv	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030520322-152050@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:55:21.723
cmtvakxg0000lue80sleyj7zz	\N	\N	auth.register	User	cmtvakxfz000jue80h8yuvbfw	\N	::ffff:127.0.0.1	\N	2026-09-10 08:55:21.937
cmtvakxlt000pue803rbnx1uk	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 08:55:22.145
cmtvakxs4000vue80c8ml7xry	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 08:55:22.373
cmtvakxsb000zue80zr7cxgxs	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 08:55:22.379
cmtvan2fn0002ueeukxgs289p	\N	\N	auth.register	User	cmtvan2ff0000ueeueq58ibbo	\N	::ffff:127.0.0.1	\N	2026-09-10 08:57:01.715
cmtvan2lz0006ueeuqa8s8nob	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030621375-845397@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:57:01.943
cmtvan2s80008ueeu73ed322x	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030621375-845397@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:57:02.169
cmtvan2yg000aueeucvo7se23	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030621375-845397@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:57:02.393
cmtvan34n000cueeuxp8fbh6s	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030621375-845397@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:57:02.616
cmtvan3an000eueeuxhex69gt	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789030621375-845397@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 08:57:02.831
cmtvan3h3000lueeubdl4c9lh	\N	\N	auth.register	User	cmtvan3h2000jueeu3zbohon7	\N	::ffff:127.0.0.1	\N	2026-09-10 08:57:03.064
cmtvan3na000pueeujak86agx	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 08:57:03.286
cmtzrmxb50029uev7xghqu2sz	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:03:53.25
cmu03ssmm000guead6riocjrq	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	collections.create	FinanceCollection	cmu03ssm9000eueadc4hi3h66	{"type": "MONTHLY", "amount": "2342.00", "receiptNumber": "RCP-00001", "collectionNumber": "COL-00001"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:44:22.511
cmu0w18r6000duetft9ll2isx	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:54:45.906
cmu146sjv003zuejco5k4jb8m	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"familyStatusTerm": "Status", "hasFamilyStatuses": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:43:01.771
cmtwyop6w005sueq6kuxxecqj	\N	\N	member.update	Member	cmtwyop61005oueq6ka66w6lz	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.825
cmtwyop7d005uueq6qthcn9w9	\N	\N	member.delete	Member	cmtwyop61005oueq6ka66w6lz	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.841
cmtwyop6t005sueq5s6mjafy0	\N	\N	family.delete	Family	cmtwyop5x005oueq5zf0at9xt	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.821
cmtwyop7b005wueq5sv9yv27j	\N	\N	event.create	Event	cmtwyop79005uueq5hx5qyn0w	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.839
cmtwyop80005yueq5camskxw2	\N	\N	event.delete	Event	cmtwyop79005uueq5hx5qyn0w	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.865
cmtwyop8u0062ueq5o5tu7cvl	\N	\N	announcement.create	Announcement	cmtwyop8s0060ueq5ypwbx686	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.895
cmtwyopav006aueq5gi5ygvzo	\N	\N	program.delete	Program	cmtwyopa40066ueq5uznxjxrl	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.968
cmtwyop7l003aueq4mguqzhel	\N	\N	tenant.admin.remove	TenantMembership	cmtwyop5o0034ueq4pjijci7v	{"removedRole": "ADMIN", "removedUserId": "cmtwyop4f000aueq4j2hsq0ud"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.849
cmtwyop91005tueq28m8g32ma	\N	\N	tenant.create	Tenant	cmtwyop8d003aueq2umlepnzm	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789131473845-902249-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.902
cmtwyop9b005vueq29p99yw8y	\N	\N	platform.tenant.delete	Tenant	cmtwyop8d003aueq2umlepnzm	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789131473845-902249-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.911
cmtvan3uf000vueeuphzjfnip	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 08:57:03.544
cmtvan3uq000zueeu28wbcg0f	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 08:57:03.554
cmtvb3kur0002ueed4z38sgu4	\N	\N	auth.register	User	cmtvb3kul0000ueedv74dzr0c	\N	::ffff:127.0.0.1	\N	2026-09-10 09:09:52.083
cmtylwl8y0041uetpu434ottk	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 16:35:40.306
cmtylxudh0045uetpgw9g8u8o	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 16:36:38.79
cmtvb3l0s0006ueedoskh0vhb	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031391756-574172@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:09:52.301
cmtvb3lck000aueedq4au0eje	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031391756-574172@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:09:52.725
cmtvb3lic000cueedoxzn2p33	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031391756-574172@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:09:52.933
cmtvb3lo4000eueedcjikh12k	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031391756-574172@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:09:53.14
cmtvb3kur0002ueeels21c6ml	\N	\N	auth.register	User	cmtvb3kuo0000ueeeaj6owqre	\N	::ffff:127.0.0.1	\N	2026-09-10 09:09:52.083
cmtvb3l0s0007ueeegmbg277v	\N	\N	auth.register	User	cmtvb3l0q0005ueeelrd4krv9	\N	::ffff:127.0.0.1	\N	2026-09-10 09:09:52.3
cmtvb3l6n000cueee0kdfsz5k	\N	\N	auth.register	User	cmtvb3l6l000aueeej11w1v57	\N	::ffff:127.0.0.1	\N	2026-09-10 09:09:52.512
cmtvb3lu1000lueed9sqjpfh8	\N	\N	auth.register	User	cmtvb3lty000jueeduifhd1p3	\N	::ffff:127.0.0.1	\N	2026-09-10 09:09:53.353
cmtvb3lzt000pueedvf943ouv	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:09:53.562
cmtvb3m69000vueedgt6celp0	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:09:53.793
cmtvb3m6h000zueedg9j9gbvg	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:09:53.801
cmtvb4vqm0002uelyhj140o10	\N	\N	auth.register	User	cmtvb4vqj0000uelyxyjiyftq	\N	::ffff:127.0.0.1	\N	2026-09-10 09:10:52.847
cmtvb4vx60006uely2kq85fwb	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031452540-493888@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.082
cmtvb4w320008uelyk5dm1dho	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031452540-493888@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.294
cmtvb4w90000auely5vcctn1n	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031452540-493888@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.509
cmtvb4wet000cuelyxaal9sfu	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031452540-493888@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.717
cmtvb4wkm000euelymlmysd1i	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031452540-493888@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.926
cmtvb4vqr0002uelzm5n6ins3	\N	\N	auth.register	User	cmtvb4vqn0000uelzh3z998xg	\N	::ffff:127.0.0.1	\N	2026-09-10 09:10:52.851
cmtzinprv000vueedx1uee36a	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtzeea4c0009uehmuvgiy46i	{"bulk": true, "name": "Section 234 Mahallu", "slug": "section234-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:52:33.595
cmtzinps4000xueedja8e06fk	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtzf1zpg000vueouypd1r49g	{"bulk": true, "name": "Final Test Mahallu", "slug": "final-test-mahallu"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:52:33.605
cmtzs6vn5002duev7z93172c7	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:19:24.209
cmu03tsdn000guebnuqjxv1mh	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	collections.create	FinanceCollection	cmu03tsd6000euebnupd1kj8r	{"type": "MONTHLY", "amount": "234.00", "receiptNumber": "RCP-00002", "collectionNumber": "COL-00002"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:45:08.843
cmu0w2s0b000fuetf97d03hfk	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:55:57.515
cmu146x890041uejc06tlsurb	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"familyStatusTerm": "Status", "hasFamilyStatuses": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:43:07.834
cmtwyop9i0064ueq5ltpbj6z0	\N	\N	announcement.delete	Announcement	cmtwyop8s0060ueq5ypwbx686	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.919
cmtwyopa70068ueq5i4jme4u5	\N	\N	program.create	Program	cmtwyopa40066ueq5uznxjxrl	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:54.943
cmtwz8w4g005iuedpfn569uw6	\N	\N	tenant.create	Tenant	cmtwz8w46002zuedpj0m2lfod	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789132416074-25677"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.929
cmtwz8vwx0007uedn29eoq2zx	\N	\N	auth.register	User	cmtwz8vww0005uednkd7s1rx7	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.658
cmtwz8w4y005iuedobqjceikm	\N	\N	tenant.create	Tenant	cmtwz8w4n002zuedoz7t6ex5t	{"name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789132416075-155087"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.946
cmtwz8vx60007uedo7oco2luy	\N	\N	auth.register	User	cmtwz8vx50005uedokxye6njz	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.666
cmtzeeijq005wuehmt7vlv3bf	\N	\N	structure.update	Tenant	cmtzeea4c0009uehmuvgiy46i	{"divisionTerm": "Ward", "hasDivisions": true, "houseNumberStartAt": 1, "houseNumberMinDigits": 3, "houseNumberingMethod": "NUMERIC", "previousDivisionTerm": null, "previousHouseNumberingMethod": null}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:53:25.862
cmtzef1yt006euehmkh1oc890	\N	\N	house.create	House	cmtzef1yq006cuehmysxdkblo	{"displayNumber": "001"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:53:51.03
cmtzefdjs006kuehm4k067fto	\N	\N	house.create	House	cmtzefdjr006iuehmmh1ocqag	{"displayNumber": "002"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:06.04
cmtzefdkb006ouehmb4as2axu	\N	\N	house.create	House	cmtzefdk9006muehmxgur1bpf	{"displayNumber": "010"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:06.059
cmtzefdks006suehm9c0qbkyr	\N	\N	house.create	House	cmtzefdkr006quehmjuf5vpos	{"displayNumber": "011"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:06.077
cmtzefdla006wuehm8sdqs3r7	\N	\N	house.create	House	cmtzefdl9006uuehmj5n4hz5j	{"displayNumber": "003"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:06.094
cmtzefdob006yuehmagrtk506	\N	\N	house.update	House	cmtzef1yq006cuehmysxdkblo	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:06.203
cmtzefdoc0070uehmtzcyd2k6	\N	\N	house.number_changed	House	cmtzef1yq006cuehmysxdkblo	{"newDisplayNumber": "099", "previousDisplayNumber": "001"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:06.205
cmtzefdot0072uehmlabv23jp	\N	\N	house.deactivate	House	cmtzef1yq006cuehmysxdkblo	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:06.222
cmtzefdpb0074uehmk1bnhv9j	\N	\N	house.reactivate	House	cmtzef1yq006cuehmysxdkblo	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:54:06.24
cmtvb4vx70007uelzj6v8150l	\N	\N	auth.register	User	cmtvb4vx60005uelzkqkcmwwz	\N	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.084
cmtvb4w3t002uuelzm35zmhi1	\N	\N	tenant.create	Tenant	cmtvb4w3b000fuelzuva0x8pj	{"name": "E2E Tenant", "slug": "e2e-tenant-1789031452540-299211"}	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.321
cmtvb4w33000cuelzfndsauqy	\N	\N	auth.register	User	cmtvb4w31000auelzf0ihwe21	\N	::ffff:127.0.0.1	\N	2026-09-10 09:10:53.296
cmtwyopoa000gueq3tyu6i1cj	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131473845-501601@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:55.45
cmtwyopod000iueq3hapniqhx	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131473845-501601@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 12:57:55.453
cmtvb4wqk000luely4jp4w80s	\N	\N	auth.register	User	cmtvb4wqi000juelyn2vegwj0	\N	::ffff:127.0.0.1	\N	2026-09-10 09:10:54.141
cmtvb4wwe000puely0ags56tw	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:10:54.351
cmtvb4x2o000vuelygjykox9c	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:10:54.577
cmtvb4x2u000zuely1p22us8i	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:10:54.582
cmtwypq3o0009uec5vardyeih	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:58:42.66
cmtvb70rn0002uetk6fikwtt0	\N	\N	auth.register	User	cmtvb70rj0000uetk6zehn36j	\N	::ffff:127.0.0.1	\N	2026-09-10 09:12:32.676
cmtym0q7l004buetp4ay73mr1	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmtym0q780049uetpt4mjpb20	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 16:38:53.361
cmtwyqguk0032uec5qv01ap58	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:59:17.325
cmtwyoq01000pueq39v8v385e	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 12:57:55.874
cmtvb70xr0006uetkep8gd4jo	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031552355-717150@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:12:32.895
cmtwyqwrn0038uec5ih5cnpmi	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyop5a000jueq2sko6l8vg	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789131473845-902249"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:59:37.955
cmtvb713m0008uetkczo186vu	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031552355-717150@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:12:33.106
cmtvb719i000auetktowb90ew	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031552355-717150@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:12:33.319
cmtvb71fd000cuetkf05fc3z9	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031552355-717150@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:12:33.529
cmtvb71l6000euetk4btbf0qx	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789031552355-717150@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:12:33.739
cmtvb70rn0002uetlxgamv1w9	\N	\N	auth.register	User	cmtvb70rl0000uetlqhm2cwcf	\N	::ffff:127.0.0.1	\N	2026-09-10 09:12:32.676
cmtvb70xr0007uetl6x3y7vzt	\N	\N	auth.register	User	cmtvb70xo0005uetl9g8jq0xc	\N	::ffff:127.0.0.1	\N	2026-09-10 09:12:32.895
cmtvb7149002uuetlqqbhqevr	\N	\N	tenant.create	Tenant	cmtvb713t000fuetlezjknzxe	{"name": "E2E Tenant", "slug": "e2e-tenant-1789031552355-231290"}	::ffff:127.0.0.1	\N	2026-09-10 09:12:33.13
cmtvb713n000cuetldfwoywjk	\N	\N	auth.register	User	cmtvb713l000auetl0lukklu8	\N	::ffff:127.0.0.1	\N	2026-09-10 09:12:33.107
cmtvb71r3000luetkk2zzqrgg	\N	\N	auth.register	User	cmtvb71r1000juetkncdlbpbu	\N	::ffff:127.0.0.1	\N	2026-09-10 09:12:33.951
cmtvb71x6000puetkyti3kzpp	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:12:34.17
cmtwyr6qo003huec5p8suswiz	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.suspend	Tenant	cmtwyop52002zueq626913p9o	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131473845-46468"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:59:50.881
cmtwyr8p30063uec5sto8gahp	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.activate	Tenant	cmtwyop52002zueq626913p9o	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131473845-46468"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:59:53.415
cmtwyrhg60065uec5m11d3dfv	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyop52002zueq626913p9o	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131473845-46468"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:00:04.759
cmtwy575i002tueok87h35gkv	cmtv96x5n0057ue7wcl3a27w0	\N	tenant.create	Tenant	cmtwy574p000aueokn9bez06b	{"name": "deeem", "slug": "deeem"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:42:44.982
cmtwysb880067uec50srzbcgx	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwy574p000aueokn9bez06b	{"name": "deeem", "slug": "deeem"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:00:43.353
cmtvb723r000vuetkr1d96anc	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:12:34.407
cmtvb723x000zuetkfe4bo859	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:12:34.413
cmtvbn7jl0002uewmv9v1v2p7	\N	\N	auth.register	User	cmtvbn7jf0000uewmfw0kgid5	\N	::ffff:127.0.0.1	\N	2026-09-10 09:25:07.953
cmtvbn7jl0002uewlv0trimep	\N	\N	auth.register	User	cmtvbn7jf0000uewl5ik6n7sf	\N	::ffff:127.0.0.1	\N	2026-09-10 09:25:07.954
cmtvbn7pq0006uewla9icvtmv	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789032307624-400618@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:25:08.175
cmtvbn7vm0008uewlmhdn6jo1	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789032307624-400618@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:25:08.387
cmtvbn81j000auewlxwf0upz9	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789032307624-400618@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:25:08.6
cmtvbn87k000cuewlhesvhwgu	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789032307624-400618@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:25:08.817
cmtvbn8df000euewlwfammnth	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789032307624-400618@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 09:25:09.027
cmtvbn7pr0007uewmzuhcdaob	\N	\N	auth.register	User	cmtvbn7pq0005uewmqkxe0y33	\N	::ffff:127.0.0.1	\N	2026-09-10 09:25:08.175
cmtvbn7vn000cuewm9e0f6o2m	\N	\N	auth.register	User	cmtvbn7vl000auewmn5t319p3	\N	::ffff:127.0.0.1	\N	2026-09-10 09:25:08.387
cmtvbn8ji000luewllo73q22l	\N	\N	auth.register	User	cmtvbn8jg000juewlhqv73clg	\N	::ffff:127.0.0.1	\N	2026-09-10 09:25:09.247
cmtvbn8pc000puewlfh82yci4	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 09:25:09.457
cmtvbvfki0002uepk58vtzhu4	\N	\N	auth.register	User	cmtvbvfkb0000uepkioymlnxq	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 09:31:31.603
cmtvbvsuj0007uepkbhv4zkcc	\N	\N	auth.register	User	cmtvbvsuh0005uepkmsiib052	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 09:31:48.811
cmtvbxcmk000buepkdtan1fi9	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 09:33:01.1
cmtvbyb30000euepko8wg3479	\N	\N	auth.register	User	cmtvbyb2u000cuepk5nry8hfd	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 09:33:45.757
cmtvcsbd4000juepk2wy72czc	\N	\N	auth.register	User	cmtvcsbcy000huepk6pzgowzr	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 09:57:05.8
cmtvcsbeh0031uepketoyayjd	\N	\N	tenant.create	Tenant	cmtvcsbdx000muepkmszo08lc	{"name": "Curl Demo Mahalle", "slug": "curl-demo"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 09:57:05.849
cmtvcyvi80002uew8mtwpno14	\N	\N	auth.register	User	cmtvcyvi10000uew8120mgm53	\N	::ffff:127.0.0.1	\N	2026-09-10 10:02:11.84
cmtvcyvpl0006uew8d11x5gyi	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034531528-786756@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.106
cmtvcyvvi0008uew84umni5p7	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034531528-786756@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.318
cmtzehdub007yuehm17rr8vpd	cmtv96wx6000tue7wfg2rfzuu	\N	platform.form.create	FormTemplate	cmtzehdu5007vuehm30nx6spn	{"key": "marriage-noc", "name": "Marriage NOC Request"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:55:39.731
cmtzehk6r0080uehm38o2zdcu	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:55:47.955
cmtzehkd00086uehm1a7h40ig	cmtv96wx6000tue7wfg2rfzuu	\N	platform.form.field.add	FormVersion	cmtzehdu5007wuehmy9g0psvy	{"fieldKey": "groom_name", "templateId": "cmtzehdu5007vuehm30nx6spn"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:55:48.18
cmtzehkde008auehm7s56pfvo	cmtv96wx6000tue7wfg2rfzuu	\N	platform.form.field.add	FormVersion	cmtzehdu5007wuehmy9g0psvy	{"fieldKey": "marriage_type", "templateId": "cmtzehdu5007vuehm30nx6spn"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:55:48.194
cmtzehrpg008cuehmbxm3da7h	cmtv96wx6000tue7wfg2rfzuu	\N	platform.form.publish	FormVersion	cmtzehdu5007wuehmy9g0psvy	{"version": 1, "templateId": "cmtzehdu5007vuehm30nx6spn"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:55:57.701
cmtzehrqg008iuehmw98qg225	cmtv96wx6000tue7wfg2rfzuu	\N	platform.form.new_draft	FormVersion	cmtzehrqd008euehmocmn5htx	{"version": 2, "templateId": "cmtzehdu5007vuehm30nx6spn"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:55:57.737
cmtzehsca008kuehmnmwkdgz4	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:55:58.523
cmtzehyp5008puehmbeaivg82	cmtv96wx6000tue7wfg2rfzuu	\N	platform.form.assignment.update	FormTemplate	cmtzehdu5007vuehm30nx6spn	{"tenantIds": ["cmtv96wxe000wue7w59ewld1m"], "isPlatformWide": false}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:56:06.761
cmtzio7ag0011ueed2gbzp1f9	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerevg002juel2l6xwmp57	{"key": "marriage-register", "isEnabled": false}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:52:56.297
cmtzsjlcc002huev7maldyjky	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:29:17.388
cmu03uk2m000kuebn0cdq55pt	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	dues.create	Due	cmu03uk2e000iuebn5fht0uku	{"title": "100", "amount": "100.00", "dueDate": "2026-08-31"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:45:44.735
cmu03v8fq000muebn4b7zl3pw	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	dues.delete	Due	cmu03uk2e000iuebn5fht0uku	{"title": "100"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:46:16.31
cmu0w3ae1000huetfaaehxa48	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:56:21.337
cmu148fut0043uejcd95k5x0m	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"familyStatusTerm": "Category", "hasFamilyStatuses": false}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:44:18.629
cmtwytqkg0007ue70olmv7o19	\N	\N	auth.register	User	cmtwytqkf0005ue706reuf04u	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.889
cmtwytqrv002yue70fs8j5jkv	\N	\N	tenant.create	Tenant	cmtwytqrg000fue70osns876f	{"name": "E2E Tenant", "slug": "e2e-tenant-1789131709282-639819"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.155
cmtwytqr9000cue70fvfbk8in	\N	\N	auth.register	User	cmtwytqr8000aue70r4z41khp	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.133
cmtwz8vx70007uedqvz0gbdu7	\N	\N	auth.register	User	cmtwz8vx70005uedqeooe3vlr	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.668
cmtwz8w4j002yuedq35detyda	\N	\N	tenant.create	Tenant	cmtwz8w44000fuedqvpq1ylhz	{"name": "E2E Tenant", "slug": "e2e-tenant-1789132416075-91189"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.931
cmtwz8vxd0007uedlb3hlefmu	\N	\N	auth.register	User	cmtwz8vxc0005uedl2i4tctjc	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.674
cmtwz8w3b000cuedph3ufaivh	\N	\N	auth.register	User	cmtwz8w39000auedplfk76tha	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.887
cmtwz8w5k0038uedna891x5jq	\N	\N	tenant.admin.role_change	TenantMembership	cmtwz8w4g0030uednvfgqp1kr	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.968
cmtwz8w3g000cuedn2hjxd64g	\N	\N	auth.register	User	cmtwz8w3f000auednttd9gexp	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.892
cmtwz8w3t000cuedoeyci7n2s	\N	\N	auth.register	User	cmtwz8w3s000auedo1tnhckno	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.906
cmtwz8w3w000cuedq5yoftwb0	\N	\N	auth.register	User	cmtwz8w3v000auedqfyaova4e	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.908
cmtwz8w40000cuedlaupz7ym0	\N	\N	auth.register	User	cmtwz8w3z000auedl0bepsuf3	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.913
cmtwz8w4s0032uedlg13zdk7m	\N	\N	tenant.create	Tenant	cmtwz8w4e000juedlbdi1emk8	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789132416075-885536"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.94
cmtx160v4004ouey3speiv8ih	\N	\N	auth.register	User	cmtx160uv004muey37uwtxn61	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 14:07:22.336
cmtym6gsf0001ue7p5flxqitg	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:43:21.087
cmtym6pw20006ue7pq6vfvcee	\N	\N	auth.register	User	cmtym6pvx0004ue7pbojaqq4c	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:43:32.883
cmtym6q1y000aue7psrhn0icz	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:43:33.095
cmtvcyw1h000auew8nublcdg2	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034531528-786756@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.533
cmtvcyw7f000cuew8sieq2dis	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034531528-786756@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.747
cmtvcywd8000euew89mijduz0	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034531528-786756@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.957
cmtvcyvi80002uew9t3u5alqh	\N	\N	auth.register	User	cmtvcyvi20000uew9daz8fc8e	\N	::ffff:127.0.0.1	\N	2026-09-10 10:02:11.841
cmtvcyvph0007uew9qcedmhf1	\N	\N	auth.register	User	cmtvcyvpf0005uew9wm8ai8q2	\N	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.101
cmtvcyvvz002uuew9ul184l3k	\N	\N	tenant.create	Tenant	cmtvcyvvl000fuew9ioep7vsw	{"name": "E2E Tenant", "slug": "e2e-tenant-1789034531528-956159"}	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.336
cmtvcyvvf000cuew9ftppmqln	\N	\N	auth.register	User	cmtvcyvve000auew9rwl9jhlv	\N	::ffff:127.0.0.1	\N	2026-09-10 10:02:12.315
cmtvcywj8000luew866qj7pkf	\N	\N	auth.register	User	cmtvcywj7000juew8j71mjaml	\N	::ffff:127.0.0.1	\N	2026-09-10 10:02:13.173
cmtvcywp3000puew89e9bvowe	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:02:13.383
cmtvcywvf000vuew807jmyvzc	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:02:13.612
cmtvcywvn000zuew8sgao7dik	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:02:13.62
cmtvd7jjz0002uev1jbfd0c95	\N	\N	auth.register	User	cmtvd7jju0000uev12g3c7awz	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.256
cmtvd7jk00002uev0qrdpern9	\N	\N	auth.register	User	cmtvd7jjy0000uev08vke5dub	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.256
cmtvd7jq40006uev0s3bscery	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034935950-75187@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.476
cmtvd7jw00008uev0zy8ji77n	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034935950-75187@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.688
cmtvd7k1y000auev0i3gf061l	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034935950-75187@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.903
cmtvd7k7r000cuev0zuonpxfh	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034935950-75187@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:57.111
cmtvd7jk20002uev2e3b0o7gc	\N	\N	auth.register	User	cmtvd7jk10000uev2sija4wz0	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.259
cmtvd7jq30007uev17l2vl9v8	\N	\N	auth.register	User	cmtvd7jpz0005uev16z6f75n1	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.476
cmtvd7jq50007uev2oa6onwbj	\N	\N	auth.register	User	cmtvd7jq30005uev2pm0vtphc	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.477
cmtzekof3008tuehmuqnvf7bc	cmtv96wx6000tue7wfg2rfzuu	\N	platform.form.create	FormTemplate	cmtzekoev008quehmf8v2tbat	{"key": "ed", "name": "ht"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:58:13.407
cmtzelxcw0093uehmpn022u0f	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:59:11.649
cmtzioc3r0015ueedou19dmc2	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev7002euel2xzur6ndg	{"key": "events", "isEnabled": false}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:53:02.535
cmtzskjzq0001ues52onn3a9k	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:30:02.294
cmu03vrue000suebn7lzd1uwc	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.create	Voucher	cmu03vru4000quebnz48r1hwb	{"amount": "212.00", "status": "DRAFT", "voucherNumber": "VCH-00001"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:46:41.463
cmu0w3kbc000juetfzwh312pf	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:56:34.201
cmu149a22004duejc9i12tg88	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.update	House	cmtzofdmc0007uev7ttqboaqn	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:44:57.77
cmu149a2r004fuejct7md83lq	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxuryp3000duetvd4ba24fs	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:44:57.796
cmtwytqrl002yue6zmi6vlcdd	\N	\N	tenant.create	Tenant	cmtwytqr7000fue6zp1swm7y8	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789131709282-192045"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.146
cmtwytqsb005mue6zgj9w78c8	\N	\N	tenant.admin.add	TenantMembership	cmtwytqs8005kue6zagedyfqy	{"email": "e2e-members-plain-a-1789131709282-192045@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.171
cmtwytqsq005que6z4n1owhbh	\N	\N	member.create	Member	cmtwytqsn005oue6zrr8oed84	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.186
cmtwytqki0007ue6z7ni0bk7t	\N	\N	auth.register	User	cmtwytqkh0005ue6zaew9tiqe	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:49.891
cmtwytqs1005iue6zmhcdd0na	\N	\N	tenant.create	Tenant	cmtwytqrr002zue6zbt8xqhsf	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131709282-192045"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.161
cmtwytqqx000cue6zbv6q8fqf	\N	\N	auth.register	User	cmtwytqqw000aue6zq9e6dmae	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.121
cmtx160wf007auey3e1vqwcpj	\N	\N	tenant.create	Tenant	cmtx160w2004ruey3f701qq62	{"name": "Dash Check Mahalle", "slug": "dash-check-mahalle"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 14:07:22.384
cmtx167lc007euey3481m4g7n	\N	\N	member.create	Member	cmtx167l6007cuey3kgtn7fxz	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 14:07:31.057
cmtx167ly007iuey36grdmq5t	\N	\N	member.create	Member	cmtx167lv007guey3oi8iknmo	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 14:07:31.078
cmtyiko68000dueqp89xyuokl	\N	\N	auth.register	User	cmtyiko5y000bueqpfmaagnh4	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 15:02:25.377
cmtyim0zl0031ueqple42bger	\N	\N	tenant.create	Tenant	cmtyim0ys000iueqpwh1acydu	{"name": "mvm", "slug": "mvm"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 15:03:28.641
cmtyku6z9000euesbn854iylt	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:05:48.886
cmtykucth003euesb8bv4fgfa	\N	\N	tenant.create	Tenant	cmtykucsx000huesbwj1pqnsh	{"name": "Phase 2 Test Mahallu", "slug": "phase2-test-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:05:56.453
cmtykujhd003iuesbng4qwq7z	\N	\N	house.create	House	cmtykujhb003guesbmav8uknw	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:06:05.089
cmtykyyqo0003uedf4jwqet64	\N	\N	family.create	Family	cmtykyyqi0001uedf6wovfa2c	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:09:31.489
cmtvd7jwp002uuev2azibejgd	\N	\N	tenant.create	Tenant	cmtvd7jw9000fuev2o3zykj9m	{"name": "E2E Tenant", "slug": "e2e-tenant-1789034935950-188180"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.713
cmtvd7jw2000cuev1gkw8i2bj	\N	\N	auth.register	User	cmtvd7jvz000auev1x1c2vrfz	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.69
cmtvd7kp8000puev0ygc1t8jk	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:57.74
cmtvd7kvi000vuev0wt5p9zes	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:57.967
cmtwytr8x000gue6wvpsamopq	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131709282-112916@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.769
cmtwytr90000iue6wn7989ihi	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789131709282-112916@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.772
cmtvd7kvq000zuev0rw4imygd	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:57.975
cmtvd7jw2000cuev2742h8xri	\N	\N	auth.register	User	cmtvd7jvz000auev2ui57fbss	\N	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.69
cmtvd8r1c0002ue0gj2d1tqz5	\N	\N	auth.register	User	cmtvd8r180000ue0geq1aod8d	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:52.608
cmtvd8rdy002yue0g7kky78u1	\N	\N	tenant.create	Tenant	cmtvd8rdj000fue0gg2n064qh	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789034992312-591871"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.062
cmtvd8r1d0002ue0fvxitjt6t	\N	\N	auth.register	User	cmtvd8r1b0000ue0fqrcrnoy6	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:52.61
cmtzel7nz008xuehmhyqxw0yk	cmtv96wx6000tue7wfg2rfzuu	\N	platform.form.field.add	FormVersion	cmtzekoev008ruehm27pfl07y	{"fieldKey": "name", "templateId": "cmtzekoev008quehmf8v2tbat"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:58:38.352
cmtzeldgt008zuehmmho4daxo	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:58:45.87
cmtziomkp0017ueedpnd5zx0b	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:53:16.105
cmtzt4j730005ues5qtwtygy3	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:45:34.384
cmu03w7a5000uuebnidw825vq	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.submit	Voucher	cmu03vru4000quebnz48r1hwb	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:47:01.47
cmu0w3q5x000luetfa300edw9	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtvmnzc50009uexshpunohwg	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:56:41.781
cmu17fz3p003jue73n0wxakmi	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:14:09.013
cmu17gy97003nue73txwfsgto	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	finance.collectionCategory.update	CollectionCategory	cmu010wen00ppue6sj7dhw8lg	{"updated": {"code": "FRIDAY", "name": "Friday / Juma Collection", "formConfig": {"enableDate": true, "enableNotes": true, "enableAmount": true, "enableFamily": false, "enableMember": false, "requireAmount": true, "requireFamily": false, "requireMember": false, "enableAttachment": false, "enablePaymentMethod": true}, "targetType": "GENERAL", "isRecurring": false, "targetAmount": null, "defaultAmount": null, "isSubscription": false}, "previous": {"id": "cmu010wen00ppue6sj7dhw8lg", "code": "FRIDAY", "name": "Friday / Juma Collection", "isActive": true, "tenantId": "cmtv96wxe000wue7w59ewld1m", "createdAt": "2026-09-13T16:26:41.807Z", "updatedAt": "2026-09-13T16:26:41.807Z", "formConfig": null, "targetType": "ALL_FAMILIES", "description": null, "isRecurring": false, "displayOrder": 2, "targetAmount": null, "defaultAmount": null, "isSubscription": false, "incomeAccountId": "cmu010wee00p5ue6sy03fao75", "targetDivisionIds": [], "recurrenceFrequency": "MONTHLY", "targetEconomicCategory": "ALL"}}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:14:54.571
cmtwytqq90008ue6wos12tytq	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131709282-112916@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.098
cmtwytqx0000aue6wzhfly4ky	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131709282-112916@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.341
cmtwytr2y000cue6wt733pdc8	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131709282-112916@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.554
cmtwytr8t000eue6w0nupdqu1	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789131709282-112916@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.766
cmtwytres000lue6we9uml89x	\N	\N	auth.register	User	cmtwytreq000jue6wm56yqis5	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.98
cmtwytrkk000pue6wz7db4m33	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:51.188
cmtwytrqt000vue6whvgllp0w	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:51.414
cmtwytrr3000zue6w1od7oado	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:51.423
cmtylir2g0006uetp7o6sl5t8	\N	\N	auth.register	User	cmtylir2c0004uetpxjvc5cow	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:24:54.664
cmtylir8c000auetpb3h3sst5	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:24:54.877
cmtylir9j003juetpmdbuj8w3	\N	\N	tenant.create	Tenant	cmtylir92000duetp5zfqsiyf	{"name": "Phase 3 Test Mahallu", "slug": "phase3-test-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:24:54.92
cmtyliyat003nuetpyvekyvw8	\N	\N	member.create	Member	cmtyliyap003luetpb0jgd6wp	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:25:04.038
cmtyljezh003zuetpvh7r85vr	\N	\N	committee.decision.create	CommitteeDecision	cmtyljezf003xuetpd5npg04m	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:25:25.661
cmtym6q3a0053ue7plan7hbru	\N	\N	tenant.create	Tenant	cmtym6q2o000due7p7o1kahsa	{"name": "Phase 4 Test Mahallu", "slug": "phase4-test-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:43:33.143
cmtym6wj50057ue7pjxki2ojy	\N	\N	registers.death.create	DeathRecord	cmtym6wj10055ue7ph25rcvzy	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:43:41.49
cmtym770f005bue7px4fjnwa3	\N	\N	registers.death.certificate.issue	DeathRecord	cmtym6wj10055ue7ph25rcvzy	{"certificateNumber": "DTH-00001"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:43:55.071
cmtym7718005fue7ppt7bo5cu	\N	\N	registers.property.create	PropertyRecord	cmtym7715005due7pk3ot9k0b	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:43:55.101
cmtym771o005jue7phjtmz0fv	\N	\N	registers.property.create	PropertyRecord	cmtym771m005hue7pks63nr8y	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:43:55.116
cmtymcove0065ue7phty80zoi	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:48:11.499
cmtvd8r7g0006ue0fhleotrdp	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034992312-937438@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:52.828
cmtvd8rda0008ue0ft3lkujbn	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034992312-937438@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.039
cmtvd8rja000aue0fr8j7mkwi	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034992312-937438@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.255
cmtvd8rp4000cue0fvi0kcyss	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034992312-937438@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.465
cmtvd8rux000eue0fnpii0pcz	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789034992312-937438@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.673
cmtvd8r1d0002ue0ho93eqykk	\N	\N	auth.register	User	cmtvd8r1c0000ue0h7dq378nh	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:52.61
cmtvd8r7e0007ue0gdifdo6zj	\N	\N	auth.register	User	cmtvd8r7b0005ue0ggatout4z	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:52.826
cmtvd8r7j0007ue0hq8m9jv1t	\N	\N	auth.register	User	cmtvd8r7i0005ue0hvemff1id	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:52.831
cmtvd8rdy002yue0hb85ywiba	\N	\N	tenant.create	Tenant	cmtvd8rdj000fue0hqhyuvt0t	{"name": "E2E Tenant", "slug": "e2e-tenant-1789034992312-634436"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.062
cmtvd8rdb000cue0ggtreoq3m	\N	\N	auth.register	User	cmtvd8rda000aue0glwo0sqs4	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.04
cmtvd8rdd000cue0hps5je7q5	\N	\N	auth.register	User	cmtvd8rdd000aue0h8am5bjwa	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.042
cmtvd8s0u000lue0f41hcj948	\N	\N	auth.register	User	cmtvd8s0r000jue0f6c7pxlzu	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.886
cmtvd8s6m000pue0fxat83jod	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:54.095
cmtvd8scu000vue0ffowzv8iv	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:54.319
cmtvd8sd2000zue0f8inz3j3j	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-10 10:09:54.327
cmtvde0s60002uestdxd1z0va	\N	\N	auth.register	User	cmtvde0s30000uest4wzwo0ai	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.519
cmtvde0y80006uestgj09x8wk	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035238215-513201@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.737
cmtvde1450008uest42hpwhsm	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789035238215-513201@example.com"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.949
cmtvde0s60002ueswl71uvlcu	\N	\N	auth.register	User	cmtvde0s30000ueswuefgos3n	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.519
cmtvde0s70002uesum884h8kx	\N	\N	auth.register	User	cmtvde0s60000uesur1z4idno	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.52
cmtvde1590036uesunsrykiaw	\N	\N	tenant.admin.add	TenantMembership	cmtvde1580034uesu00ev7g39	{"email": "e2e-admins-promoted-1789035238215-185355@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.989
cmtvde16d003auesuw2k0tk0k	\N	\N	tenant.admin.remove	TenantMembership	cmtvde1580034uesu00ev7g39	{"removedRole": "ADMIN", "removedUserId": "cmtvde144000auesuqg4w38lo"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:59.03
cmtvde0sc0002uesv1vzp59se	\N	\N	auth.register	User	cmtvde0sb0000uesvuo9ukqhw	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.525
cmtziouf3001dueed9thqz1e9	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev9002fuel2ss38mzvb	{"key": "announcements", "isEnabled": false}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:53:26.272
cmtzv89xu0009ues5xxuuk1px	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 13:44:28.242
cmu03wf4h000wuebn531kxrwn	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.approve	Voucher	cmu03vru4000quebnz48r1hwb	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:47:11.634
cmu0whvx6000nuetf07dsakge	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:07:42.426
cmu18p9jm0041uedqhz02c6xe	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:49:22.067
cmu18phl30043uedq4v9xi8ht	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:49:32.487
cmtwytqrf002yue6xpnbfhuvk	\N	\N	tenant.create	Tenant	cmtwytqr0000fue6xk90nykh1	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789131709282-444096"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.139
cmtwytqrp0032ue6xnxkqrxry	\N	\N	tenant.admin.add	TenantMembership	cmtwytqrm0030ue6x0xqq8ro3	{"email": "e2e-admins-member-1789131709282-444096@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.15
cmtwytqry0036ue6xo8f8d2u5	\N	\N	tenant.admin.add	TenantMembership	cmtwytqrv0034ue6xnudc3fey	{"email": "e2e-admins-promoted-1789131709282-444096@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.159
cmtwytqto003aue6xc7qzsnwj	\N	\N	tenant.admin.remove	TenantMembership	cmtwytqrv0034ue6xnudc3fey	{"removedRole": "ADMIN", "removedUserId": "cmtwytqqk000aue6x6nyant89"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.22
cmtwytqql000cue6xvf3txj4n	\N	\N	auth.register	User	cmtwytqqk000aue6x6nyant89	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.11
cmtwytqso0038ue6x03geh4bf	\N	\N	tenant.admin.role_change	TenantMembership	cmtwytqrm0030ue6x0xqq8ro3	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.185
cmtym7kbn005nue7pbw36tfe4	\N	\N	registers.marriage.create	MarriageRecord	cmtym7kbj005lue7puamtvykv	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:44:12.323
cmtym7kc8005rue7p4hvj0ldf	\N	\N	registers.divorce.create	DivorceRecord	cmtym7kc5005pue7p1nw6pwa5	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:44:12.344
cmtym7kcq005vue7p6vnc52qc	\N	\N	registers.release.create	MahalluReleaseRecord	cmtym7kco005tue7puqb268f7	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:44:12.363
cmtym7kd8005zue7pr8jgd0o2	\N	\N	registers.grave.create	GraveRecord	cmtym7kd5005xue7poy2xvig9	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:44:12.381
cmtym7kdq0063ue7psfv23t04	\N	\N	registers.madrassa.create	MadrassaEnrollment	cmtym7kdn0061ue7pgcbnxgt2	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:44:12.399
cmtyml4na0021ueypolggipyo	\N	\N	auth.register	User	cmtyml4n5001zueypxi4cwgig	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:54:45.191
cmtyml4te0025ueypw4wz8x1k	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:54:45.41
cmtyml4us0076ueyp56nkpsfx	\N	\N	tenant.create	Tenant	cmtyml4u70028ueyp8ra4krsb	{"name": "Phase 5 Test Mahallu", "slug": "phase5-test-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:54:45.46
cmtymldpy007aueypn9na6zjh	\N	\N	finance.account.create	Account	cmtymldpv0078ueypn76oniq2	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:54:56.95
cmtymldqj007eueyp74rd5jyj	\N	\N	finance.account.create	Account	cmtymldqh007cueyptk0sxpwg	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:54:56.971
cmtymldr1007iueypn1kw40pt	\N	\N	finance.account.create	Account	cmtymldqz007gueypzqqt48jy	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:54:56.989
cmtvde0y70007uesuc475btwv	\N	\N	auth.register	User	cmtvde0y60005uesudjju32o2	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.735
cmtvde0y80007uesw3on73jzs	\N	\N	auth.register	User	cmtvde0y70005ueswxmv2pmls	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.736
cmtvde0yz002vueswit1p0f26	\N	\N	tenant.create	Tenant	cmtvde0yk000cuesw7tesu1pt	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789035238215-197381"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.764
cmtvde0yd0007uesvptyqyj4k	\N	\N	auth.register	User	cmtvde0yc0005uesv6ptwksyw	\N	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.741
cmtzkjhnh001fueedjnjhzrqr	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 08:45:15.678
cmtzvxmyi000dues5z5ybd8b4	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:04:11.515
cmu03wl320015uebnqudupgzh	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.pay	Voucher	cmu03vru4000quebnz48r1hwb	{"amount": "212.00", "voucherNumber": "VCH-00001"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:47:19.358
cmu0x74pt000ruetfo1b4pbvl	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:27:20.225
cmtvde14w002yuesvgius4w66	\N	\N	tenant.create	Tenant	cmtvde14i000fuesviofjfrpd	{"name": "E2E Tenant", "slug": "e2e-tenant-1789035238215-492436"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.976
cmu72aps000efueokr1zomr4c	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.bulk_delete	User	\N	{"deletedCount": 59, "deletedUsers": [{"id": "cmtva0es40000ue72f90zm21v", "email": "e2e-auth-1789029563759-440192@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtva0frd000jue72zfcc7jmd", "email": "e2e-auth-2-1789029563759-440192@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtva8fwu0000ue0rghqcxbza", "email": "browsertest@example.com", "fullName": "Browser Test User"}, {"id": "cmtvakwg50000ue80pyk3ubw6", "email": "e2e-auth-1789030520322-152050@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvakxfz000jue80h8yuvbfw", "email": "e2e-auth-2-1789030520322-152050@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvan2ff0000ueeueq58ibbo", "email": "e2e-auth-1789030621375-845397@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvan3h2000jueeu3zbohon7", "email": "e2e-auth-2-1789030621375-845397@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvb3kul0000ueedv74dzr0c", "email": "e2e-auth-1789031391756-574172@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvb3kuo0000ueeeaj6owqre", "email": "e2e-owner-reserved-1789031391757-168310@example.com", "fullName": "Test User"}, {"id": "cmtvb3l0q0005ueeelrd4krv9", "email": "e2e-owner-1789031391757-168310@example.com", "fullName": "Test User"}, {"id": "cmtvb3l6l000aueeej11w1v57", "email": "e2e-outsider-1789031391757-168310@example.com", "fullName": "Test User"}, {"id": "cmtvb3lty000jueeduifhd1p3", "email": "e2e-auth-2-1789031391756-574172@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvb4vqj0000uelyxyjiyftq", "email": "e2e-auth-1789031452540-493888@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvb4vqn0000uelzh3z998xg", "email": "e2e-owner-reserved-1789031452540-299211@example.com", "fullName": "Test User"}, {"id": "cmtvb4vx60005uelzkqkcmwwz", "email": "e2e-owner-1789031452540-299211@example.com", "fullName": "Test User"}, {"id": "cmtvb4w31000auelzf0ihwe21", "email": "e2e-outsider-1789031452540-299211@example.com", "fullName": "Test User"}, {"id": "cmtvb4wqi000juelyn2vegwj0", "email": "e2e-auth-2-1789031452540-493888@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvb70rj0000uetk6zehn36j", "email": "e2e-auth-1789031552355-717150@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvb70rl0000uetlqhm2cwcf", "email": "e2e-owner-reserved-1789031552355-231290@example.com", "fullName": "Test User"}, {"id": "cmtvb70xo0005uetl9g8jq0xc", "email": "e2e-owner-1789031552355-231290@example.com", "fullName": "Test User"}, {"id": "cmtvb713l000auetl0lukklu8", "email": "e2e-outsider-1789031552355-231290@example.com", "fullName": "Test User"}, {"id": "cmtvb71r1000juetkncdlbpbu", "email": "e2e-auth-2-1789031552355-717150@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvbn7jf0000uewmfw0kgid5", "email": "e2e-owner-reserved-1789032307624-22702@example.com", "fullName": "Test User"}, {"id": "cmtvbn7jf0000uewl5ik6n7sf", "email": "e2e-auth-1789032307624-400618@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvbn7pq0005uewmqkxe0y33", "email": "e2e-owner-1789032307624-22702@example.com", "fullName": "Test User"}, {"id": "cmtvbn7vl000auewmn5t319p3", "email": "e2e-outsider-1789032307624-22702@example.com", "fullName": "Test User"}, {"id": "cmtvbn8jg000juewlhqv73clg", "email": "e2e-auth-2-1789032307624-400618@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvbvfkb0000uepkioymlnxq", "email": "owner@jkl.com", "fullName": "owner"}, {"id": "cmtvbvsuh0005uepkmsiib052", "email": "owner@lkn.com", "fullName": "owner"}, {"id": "cmtvbyb2u000cuepk5nry8hfd", "email": "jfyfy@gh.bk", "fullName": "igiu"}, {"id": "cmtvcsbcy000huepk6pzgowzr", "email": "curl-owner@example.com", "fullName": "Curl Owner"}, {"id": "cmtvcyvi10000uew8120mgm53", "email": "e2e-auth-1789034531528-786756@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvcyvi20000uew9daz8fc8e", "email": "e2e-owner-reserved-1789034531528-956159@example.com", "fullName": "Test User"}, {"id": "cmtvcyvpf0005uew9wm8ai8q2", "email": "e2e-owner-1789034531528-956159@example.com", "fullName": "Test User"}, {"id": "cmtvcyvve000auew9rwl9jhlv", "email": "e2e-outsider-1789034531528-956159@example.com", "fullName": "Test User"}, {"id": "cmtvcywj7000juew8j71mjaml", "email": "e2e-auth-2-1789034531528-786756@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvd7jju0000uev12g3c7awz", "email": "e2e-admins-owner-1789034935950-166457@example.com", "fullName": "Test User"}, {"id": "cmtvd7jjy0000uev08vke5dub", "email": "e2e-auth-1789034935950-75187@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvd7jk10000uev2sija4wz0", "email": "e2e-owner-reserved-1789034935950-188180@example.com", "fullName": "Test User"}, {"id": "cmtvd7jpz0005uev16z6f75n1", "email": "e2e-admins-member-1789034935950-166457@example.com", "fullName": "Test User"}, {"id": "cmtvd7jq30005uev2pm0vtphc", "email": "e2e-owner-1789034935950-188180@example.com", "fullName": "Test User"}, {"id": "cmtvd7jvz000auev1x1c2vrfz", "email": "e2e-admins-promoted-1789034935950-166457@example.com", "fullName": "Test User"}, {"id": "cmtvd7kjd000juev0o6nwm0hk", "email": "e2e-auth-2-1789034935950-75187@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvd7jvz000auev2ui57fbss", "email": "e2e-outsider-1789034935950-188180@example.com", "fullName": "Test User"}, {"id": "cmtvd8r180000ue0geq1aod8d", "email": "e2e-admins-owner-1789034992312-591871@example.com", "fullName": "Test User"}, {"id": "cmtvd8r1b0000ue0fqrcrnoy6", "email": "e2e-auth-1789034992312-937438@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvd8r1c0000ue0h7dq378nh", "email": "e2e-owner-reserved-1789034992312-634436@example.com", "fullName": "Test User"}, {"id": "cmtvd8r7b0005ue0ggatout4z", "email": "e2e-admins-member-1789034992312-591871@example.com", "fullName": "Test User"}, {"id": "cmtvd8r7i0005ue0hvemff1id", "email": "e2e-owner-1789034992312-634436@example.com", "fullName": "Test User"}, {"id": "cmtvd8rda000aue0glwo0sqs4", "email": "e2e-admins-promoted-1789034992312-591871@example.com", "fullName": "Test User"}, {"id": "cmtvd8rdd000aue0h8am5bjwa", "email": "e2e-outsider-1789034992312-634436@example.com", "fullName": "Test User"}, {"id": "cmtvd8s0r000jue0f6c7pxlzu", "email": "e2e-auth-2-1789034992312-937438@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtvde0s30000uest4wzwo0ai", "email": "e2e-auth-1789035238215-513201@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtvde0s30000ueswuefgos3n", "email": "e2e-platform-staff-1789035238215-197381@example.com", "fullName": "Test User"}, {"id": "cmtvde0s60000uesur1z4idno", "email": "e2e-admins-owner-1789035238215-185355@example.com", "fullName": "Test User"}, {"id": "cmtvde0sb0000uesvuo9ukqhw", "email": "e2e-owner-reserved-1789035238215-492436@example.com", "fullName": "Test User"}, {"id": "cmtvde0y60005uesudjju32o2", "email": "e2e-admins-member-1789035238215-185355@example.com", "fullName": "Test User"}, {"id": "cmtvde0y70005ueswxmv2pmls", "email": "e2e-platform-tenant-owner-1789035238215-197381@example.com", "fullName": "Test User"}, {"id": "cmtvde0yc0005uesv6ptwksyw", "email": "e2e-owner-1789035238215-492436@example.com", "fullName": "Test User"}]}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:36:42.624
cmuebd34k0hq7ue6to7hgxw3e	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:24:53.013
cmu18p9jl003zuedq08f58413	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:49:22.066
cmtwytqrg002yue6yvqi8dmbz	\N	\N	tenant.create	Tenant	cmtwytqr1000fue6yfkbx0g2s	{"name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789131709282-336069"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.14
cmtwytqs6005mue6yo5avq0c5	\N	\N	tenant.admin.add	TenantMembership	cmtwytqs4005kue6ywgolighw	{"email": "e2e-biz-plain-a-1789131709282-336069@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.167
cmtwytqsk005que6y76oabkwx	\N	\N	family.create	Family	cmtwytqsh005oue6yevsca5nz	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.18
cmtwytqvb0064ue6yzpljrzff	\N	\N	announcement.delete	Announcement	cmtwytqur0060ue6ypkdt3fqu	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.279
cmtwytqvs0068ue6ym7a5zkrs	\N	\N	program.create	Program	cmtwytqvq0066ue6ya8ezkdmf	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.297
cmtwytqwd006aue6y0yzxsvo0	\N	\N	program.delete	Program	cmtwytqvq0066ue6ya8ezkdmf	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.317
cmtwytqrv005iue6y0pufpspg	\N	\N	tenant.create	Tenant	cmtwytqrk002zue6yglax3or1	{"name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789131709282-336069"}	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.155
cmtwytqqo000cue6yy2kjvocu	\N	\N	auth.register	User	cmtwytqqn000aue6y6tgkxnh1	\N	::ffff:127.0.0.1	\N	2026-09-11 13:01:50.112
cmtymln0m007mueypq077zk3x	\N	\N	member.create	Member	cmtymln0d007kueypv5p1ajum	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:55:08.999
cmtymly9c007wueyp8ygtbzx1	\N	\N	finance.due.paid	Due	cmtymln3l007oueypigb6or4o	{"voucherNumber": "RCT-00001"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:55:23.568
cmtymly9u0082ueypsvdu0jpp	\N	\N	finance.voucher.create	Voucher	cmtymly9r0080ueypjtlpp8nw	{"amount": "30.00", "voucherNumber": "PAY-00001"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:55:23.587
cmtymln3r007queypqvn8k8fe	\N	\N	finance.due.create	Due	cmtymln3l007oueypigb6or4o	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 16:55:09.111
cmtymvvsj0025uemui241iizt	\N	\N	auth.register	User	cmtymvvsg0023uemudx5v7gon	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:03:06.931
cmtymvvym0029uemuenradsn1	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:03:07.151
cmtynaz6i0001ueg4r8hjh0zq	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:14:51.162
cmtynaz9d0009ueg4ipnbmt9w	\N	\N	notifications.settings.update	NotificationSettings	cmtynaz7n0005ueg4wjajaxkh	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:14:51.265
cmtynb57y000dueg4kmrwfn1d	\N	\N	announcement.create	Announcement	cmtynb57u000bueg4h8vurpw5	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:14:58.99
cmtze2ccc005yue8kbd4iun4d	\N	\N	tenant.create	Tenant	cmtze2cbs000due8kkj2pyfl9	{"name": "Section 1 Test Mahallu", "slug": "section1-test-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:43:57.948
cmtze2kdw006aue8koqq2yf59	\N	\N	role.create	Role	cmtze2kdt0064ue8kt8jigq66	{"name": "Accountant", "permissionKeys": ["finance.view", "finance.create", "finance.update"]}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:44:08.373
cmtzees0p0066uehmg0ibyxdl	\N	\N	structure.division.create	TenantDivision	cmtzees0m0064uehm52jio96a	{"code": "SW", "name": "South Ward"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:53:38.138
cmtzees210068uehm12zpgjgi	\N	\N	structure.division.reorder	TenantDivision	\N	{"orderedIds": ["cmtzees0m0064uehm52jio96a", "cmtzeeikm005yuehmp6zuy7gs"]}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:53:38.185
cmtzees2m006auehmurv33icx	\N	\N	structure.division.deactivate	TenantDivision	cmtzees0m0064uehm52jio96a	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:53:38.206
cmtzeqedw0097uehmxi6fatsy	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:02:40.338
cmtzerljz009buehmiy4lc4qx	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:03:36.288
cmtzet0ri009fuehm33j5aaru	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:04:42.655
cmtzetfgx009juehmzdn5a13b	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:05:01.714
cmtzev1mh009ruehmcaqw004l	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:06:17.081
cmu729d2a00ebueok6y5ysf21	cmtv96wx6000tue7wfg2rfzuu	\N	platform.user.bulk_delete	User	\N	{"deletedCount": 99, "deletedUsers": [{"id": "cmtwyirw50000ue06pts4r13p", "email": "e2e-auth-1789131198043-780570@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtwyirwb0000ue08ryo8t8py", "email": "e2e-biz-owner-a-1789131198043-459117@example.com", "fullName": "Test User"}, {"id": "cmtwyis2h0005ue090tyljcne", "email": "e2e-members-owner-b-1789131198043-13614@example.com", "fullName": "Test User"}, {"id": "cmtwyis2p0005ue07t5u0mhcy", "email": "e2e-admins-member-1789131198042-497034@example.com", "fullName": "Test User"}, {"id": "cmtwyis2s0005ue05n7x597mc", "email": "e2e-platform-super-1789131198043-549987@example.com", "fullName": "Test User"}, {"id": "cmtwyis310005ue0awf97biwt", "email": "e2e-owner-1789131198043-227906@example.com", "fullName": "Test User"}, {"id": "cmtwyis3c0005ue08a7px8l34", "email": "e2e-biz-owner-b-1789131198043-459117@example.com", "fullName": "Test User"}, {"id": "cmtwyis90000aue09cbz4swuk", "email": "e2e-members-plain-a-1789131198043-13614@example.com", "fullName": "Test User"}, {"id": "cmtwyis9e000aue07170bk1l2", "email": "e2e-admins-promoted-1789131198042-497034@example.com", "fullName": "Test User"}, {"id": "cmtwyis9f000aue05xl9rp8n0", "email": "e2e-platform-tenant-owner-1789131198043-549987@example.com", "fullName": "Test User"}, {"id": "cmtwyis9j000aue0aknetkr1n", "email": "e2e-outsider-1789131198043-227906@example.com", "fullName": "Test User"}, {"id": "cmtwyisa5000aue08d8m3igyh", "email": "e2e-biz-plain-a-1789131198043-459117@example.com", "fullName": "Test User"}, {"id": "cmtwyisxj000jue06wnv2mhvt", "email": "e2e-auth-2-1789131198043-780570@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtwyooqg0000ueq6vsahe2ns", "email": "e2e-members-owner-a-1789131473845-46468@example.com", "fullName": "Test User"}, {"id": "cmtwyooqn0000ueq38nq8gqvy", "email": "e2e-auth-1789131473845-501601@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtwyooqp0000ueq7tsystvoi", "email": "e2e-owner-reserved-1789131473845-473068@example.com", "fullName": "Test User"}, {"id": "cmtwyooqs0000ueq5hnt737mn", "email": "e2e-biz-owner-a-1789131473845-782916@example.com", "fullName": "Test User"}, {"id": "cmtwyoor10000ueq4vzun2qe8", "email": "e2e-admins-owner-1789131473846-136799@example.com", "fullName": "Test User"}, {"id": "cmtwyoor30000ueq21iyh3yiv", "email": "e2e-platform-staff-1789131473845-902249@example.com", "fullName": "Test User"}, {"id": "cmtwyooxh0005ueq6z7xbgdkg", "email": "e2e-members-owner-b-1789131473845-46468@example.com", "fullName": "Test User"}, {"id": "cmtwyooxj0005ueq53gf79ni4", "email": "e2e-biz-owner-b-1789131473845-782916@example.com", "fullName": "Test User"}, {"id": "cmtwyooxj0005ueq7znew5iqc", "email": "e2e-owner-1789131473845-473068@example.com", "fullName": "Test User"}, {"id": "cmtwyooxv0005ueq49699i3hu", "email": "e2e-admins-member-1789131473846-136799@example.com", "fullName": "Test User"}, {"id": "cmtwyooxw0005ueq2huen8ytc", "email": "e2e-platform-super-1789131473845-902249@example.com", "fullName": "Test User"}, {"id": "cmtwyop43000aueq5fq203q0w", "email": "e2e-biz-plain-a-1789131473845-782916@example.com", "fullName": "Test User"}, {"id": "cmtwyop43000aueq6x23wb7he", "email": "e2e-members-plain-a-1789131473845-46468@example.com", "fullName": "Test User"}, {"id": "cmtwyop44000aueq7iuo9l218", "email": "e2e-outsider-1789131473845-473068@example.com", "fullName": "Test User"}, {"id": "cmtwyop4f000aueq4j2hsq0ud", "email": "e2e-admins-promoted-1789131473846-136799@example.com", "fullName": "Test User"}, {"id": "cmtwyop4v000aueq29g997nzp", "email": "e2e-platform-tenant-owner-1789131473845-902249@example.com", "fullName": "Test User"}, {"id": "cmtwyopu4000jueq359jolvvp", "email": "e2e-auth-2-1789131473845-501601@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtwyq6f8000cuec5vu1wh3ha", "email": "live-verify-1789131543@example.com", "fullName": "Live Verify"}, {"id": "cmtwytqd40000ue6xsrdga8d9", "email": "e2e-admins-owner-1789131709282-444096@example.com", "fullName": "Test User"}, {"id": "cmtwytqd50000ue6y7vhufdv6", "email": "e2e-biz-owner-a-1789131709282-336069@example.com", "fullName": "Test User"}, {"id": "cmtwytqd70000ue6vwire9nbg", "email": "e2e-platform-staff-1789131709282-410246@example.com", "fullName": "Test User"}, {"id": "cmtwytqde0000ue6wsx7gf66k", "email": "e2e-auth-1789131709282-112916@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtwytqdl0000ue6zm50ybsjl", "email": "e2e-members-owner-a-1789131709282-192045@example.com", "fullName": "Test User"}, {"id": "cmtwytqds0000ue70fuwxu0pr", "email": "e2e-owner-reserved-1789131709282-639819@example.com", "fullName": "Test User"}, {"id": "cmtwytqjz0005ue6xw3j22u7w", "email": "e2e-admins-member-1789131709282-444096@example.com", "fullName": "Test User"}, {"id": "cmtwytqk20005ue6y1ja19aa4", "email": "e2e-biz-owner-b-1789131709282-336069@example.com", "fullName": "Test User"}, {"id": "cmtwytqk50005ue6vzi3hp5d2", "email": "e2e-platform-super-1789131709282-410246@example.com", "fullName": "Test User"}, {"id": "cmtwytqkf0005ue706reuf04u", "email": "e2e-owner-1789131709282-639819@example.com", "fullName": "Test User"}, {"id": "cmtwytqkh0005ue6zaew9tiqe", "email": "e2e-members-owner-b-1789131709282-192045@example.com", "fullName": "Test User"}, {"id": "cmtwytqqk000aue6x6nyant89", "email": "e2e-admins-promoted-1789131709282-444096@example.com", "fullName": "Test User"}, {"id": "cmtwytqqn000aue6y6tgkxnh1", "email": "e2e-biz-plain-a-1789131709282-336069@example.com", "fullName": "Test User"}, {"id": "cmtwytqqw000aue6zq9e6dmae", "email": "e2e-members-plain-a-1789131709282-192045@example.com", "fullName": "Test User"}, {"id": "cmtwytqr8000aue70r4z41khp", "email": "e2e-outsider-1789131709282-639819@example.com", "fullName": "Test User"}, {"id": "cmtwytqr9000aue6vcdd7n1lf", "email": "e2e-platform-tenant-owner-1789131709282-410246@example.com", "fullName": "Test User"}, {"id": "cmtwytreq000jue6wm56yqis5", "email": "e2e-auth-2-1789131709282-112916@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtwz8pzr0000ueccsus5lryx", "email": "e2e-members-owner-a-1789132408619-649472@example.com", "fullName": "Test User"}, {"id": "cmtwz8pzz0000uecaaq4djafq", "email": "e2e-admins-owner-1789132408619-641554@example.com", "fullName": "Test User"}, {"id": "cmtwz8q040000uec90wejag1v", "email": "e2e-auth-1789132408620-671090@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtwz8q040000uecdwbt1tzqq", "email": "e2e-owner-reserved-1789132408620-202374@example.com", "fullName": "Test User"}, {"id": "cmtwz8q080000uec80e940cje", "email": "e2e-platform-staff-1789132408619-200997@example.com", "fullName": "Test User"}, {"id": "cmtwz8q6o0005uecd60tu1vjz", "email": "e2e-owner-1789132408620-202374@example.com", "fullName": "Test User"}, {"id": "cmtwz8q0e0000uecbk98wi2ny", "email": "e2e-biz-owner-a-1789132408620-985577@example.com", "fullName": "Test User"}, {"id": "cmtwz8q780005uecbf3hqynjy", "email": "e2e-biz-owner-b-1789132408620-985577@example.com", "fullName": "Test User"}, {"id": "cmtwz8qds000auecbrwpz2bvp", "email": "e2e-biz-plain-a-1789132408620-985577@example.com", "fullName": "Test User"}, {"id": "cmtwz8q6m0005uecardigeq0x", "email": "e2e-admins-member-1789132408619-641554@example.com", "fullName": "Test User"}, {"id": "cmtwz8qdc000aueca4vup6nuq", "email": "e2e-admins-promoted-1789132408619-641554@example.com", "fullName": "Test User"}, {"id": "cmtwz8q6s0005ueccfkpno8rb", "email": "e2e-members-owner-b-1789132408619-649472@example.com", "fullName": "Test User"}, {"id": "cmtwz8qdp000aueccz9ye02yq", "email": "e2e-members-plain-a-1789132408619-649472@example.com", "fullName": "Test User"}, {"id": "cmtwz8q790005uec89ihxft33", "email": "e2e-platform-super-1789132408619-200997@example.com", "fullName": "Test User"}, {"id": "cmtwz8qdr000auec8n1iskkvd", "email": "e2e-platform-tenant-owner-1789132408619-200997@example.com", "fullName": "Test User"}, {"id": "cmtwz8qdb000auecd20ep9ul0", "email": "e2e-outsider-1789132408620-202374@example.com", "fullName": "Test User"}, {"id": "cmtwz8r1u000juec9n2uehqk0", "email": "e2e-auth-2-1789132408620-671090@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtwz8vpj0000uedp7v021csw", "email": "e2e-members-owner-a-1789132416074-25677@example.com", "fullName": "Test User"}, {"id": "cmtwz8vq70000uednc9jvqi0o", "email": "e2e-admins-owner-1789132416075-517458@example.com", "fullName": "Test User"}, {"id": "cmtwz8vq90000uedq44eqg2bn", "email": "e2e-owner-reserved-1789132416075-91189@example.com", "fullName": "Test User"}, {"id": "cmtwz8vqa0000uedluda92o8s", "email": "e2e-platform-staff-1789132416075-885536@example.com", "fullName": "Test User"}, {"id": "cmtwz8vqc0000uedmwwqhn5yy", "email": "e2e-auth-1789132416075-242656@example.com", "fullName": "E2E Auth Test"}, {"id": "cmtwz8vqd0000uedoqd7ludql", "email": "e2e-biz-owner-a-1789132416075-155087@example.com", "fullName": "Test User"}, {"id": "cmtwz8vwf0005uedp4hy7rzw6", "email": "e2e-members-owner-b-1789132416074-25677@example.com", "fullName": "Test User"}, {"id": "cmtwz8vww0005uednkd7s1rx7", "email": "e2e-admins-member-1789132416075-517458@example.com", "fullName": "Test User"}, {"id": "cmtwz8vx50005uedokxye6njz", "email": "e2e-biz-owner-b-1789132416075-155087@example.com", "fullName": "Test User"}, {"id": "cmtwz8vx70005uedqeooe3vlr", "email": "e2e-owner-1789132416075-91189@example.com", "fullName": "Test User"}, {"id": "cmtwz8vxc0005uedl2i4tctjc", "email": "e2e-platform-super-1789132416075-885536@example.com", "fullName": "Test User"}, {"id": "cmtwz8w39000auedplfk76tha", "email": "e2e-members-plain-a-1789132416074-25677@example.com", "fullName": "Test User"}, {"id": "cmtwz8w3f000auednttd9gexp", "email": "e2e-admins-promoted-1789132416075-517458@example.com", "fullName": "Test User"}, {"id": "cmtwz8w3s000auedo1tnhckno", "email": "e2e-biz-plain-a-1789132416075-155087@example.com", "fullName": "Test User"}, {"id": "cmtwz8w3v000auedqfyaova4e", "email": "e2e-outsider-1789132416075-91189@example.com", "fullName": "Test User"}, {"id": "cmtwz8w3z000auedl0bepsuf3", "email": "e2e-platform-tenant-owner-1789132416075-885536@example.com", "fullName": "Test User"}, {"id": "cmtwz8wrt000juedmfejwd9yh", "email": "e2e-auth-2-1789132416075-242656@example.com", "fullName": "E2E Auth Test 2"}, {"id": "cmtx160uv004muey37uwtxn61", "email": "dashcheck@example.com", "fullName": "Dash Check"}, {"id": "cmtyh3dj40004uebkwlnzh5ge", "email": "onboardcurl1@example.com", "fullName": "Curl Test Admin"}, {"id": "cmtyh3utc002tuebkyvzk8u6j", "email": "adburahman@mahall.com", "fullName": "abdu rahman"}, {"id": "cmtyhsnj60000ueol9kbsjh58", "email": "onboardwizard1@example.com", "fullName": "Onboard Wizard"}, {"id": "cmtyia2yr0000ueqpra7jtwlc", "email": "dfs@dsg.ytr", "fullName": "sdagvfasd"}, {"id": "cmtyiko5y000bueqpfmaagnh4", "email": "jhgjg@gfx.bjhv", "fullName": "jgj"}, {"id": "cmtyjji6z0000uef7rk1ce6fn", "email": "phase1test1@example.com", "fullName": "Phase1 Test"}, {"id": "cmtykt7ue0000uesbquzsuhby", "email": "phase2test@example.com", "fullName": "Phase Two Tester"}, {"id": "cmtylir2c0004uetpxjvc5cow", "email": "phase3test@example.com", "fullName": "Phase Three Tester"}, {"id": "cmtym6pvx0004ue7pbojaqq4c", "email": "phase4test@example.com", "fullName": "Phase Four Tester"}, {"id": "cmtyml4n5001zueypxi4cwgig", "email": "phase5test@example.com", "fullName": "Phase Five Tester"}, {"id": "cmtymvvsg0023uemudx5v7gon", "email": "phase6test@example.com", "fullName": "Phase Six Tester"}, {"id": "cmtynl51x0000uenjkdusxmu5", "email": "phase10test@example.com", "fullName": "Phase Ten Tester"}, {"id": "cmtze2c4u0004ue8klrw14769", "email": "section1test@example.com", "fullName": "Section One Tester"}, {"id": "cmtzee9wy0000uehmhijx4ya2", "email": "section234@example.com", "fullName": "Section 234 Tester"}, {"id": "cmtzf1zio000mueouh5ubp0i1", "email": "finaltest@example.com", "fullName": "Final Tester"}, {"id": "cmtzf2ug70072ueouddov6sgm", "email": "regofficer@example.com", "fullName": "Reg Officer"}]}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:35:39.49
cmtvd7jwp002uuev11bvt9yu3	\N	\N	tenant.create	Tenant	cmtvd7jw9000fuev1d3sgkw5h	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789034935950-166457"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.713
cmtvd7jwz002yuev1wpzszj7w	\N	\N	tenant.admin.add	TenantMembership	cmtvd7jww002wuev1a9tvb5im	{"email": "e2e-admins-member-1789034935950-166457@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.723
cmtvd7jx60032uev1lqsulbh7	\N	\N	tenant.admin.add	TenantMembership	cmtvd7jx40030uev1k2q32uly	{"email": "e2e-admins-promoted-1789034935950-166457@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.73
cmtvd7jy50034uev1dlih7oye	\N	\N	tenant.admin.remove	TenantMembership	cmtvd7jx40030uev1k2q32uly	{"removedRole": "ADMIN", "removedUserId": "cmtvd7jvz000auev1x1c2vrfz"}	::ffff:127.0.0.1	\N	2026-09-10 10:08:56.765
cmuebegfw0hq9ue6ta5gfsqry	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:25:56.924
cmtzetsv1009nuehmywhr1hzj	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:05:19.07
cmtwyynyg0069uec5k33ynzlb	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvd7jw9000fuev1d3sgkw5h	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789034935950-166457"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:05:39.784
cmtwyz02s006buec5ngk8a2gs	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwytqrr002zue6zbt8xqhsf	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131709282-192045"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:05:55.492
cmtwz7r7d0001uey34nxqicez	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwytqrn000jue6v3n2yrta1	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789131709282-410246"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.897
cmtwz7r7k0003uey3ka2w6ql7	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwytqrk002zue6yglax3or1	{"bulk": true, "name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789131709282-336069"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.904
cmtwz7r7p0005uey38ixhx9ti	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwytqrg000fue70osns876f	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789131709282-639819"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.909
cmtwz7r7u0007uey3z58kr2fb	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwytqr7000fue6zp1swm7y8	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789131709282-192045"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.914
cmtwz7r7z0009uey3nkue20f1	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwytqr1000fue6yfkbx0g2s	{"bulk": true, "name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789131709282-336069"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.919
cmtwz7r84000buey3zxc101ld	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwytqr0000fue6xk90nykh1	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789131709282-444096"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.925
cmtwz7r89000duey3maxiox9a	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyop52002zueq5ky5d5w4f	{"bulk": true, "name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789131473845-782916"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.93
cmtwyhv9b0032uew24cozv3q1	\N	\N	tenant.admin.add	TenantMembership	cmtwyhv990030uew26txaw8pp	{"email": "e2e-admins-member-1789131155222-947720@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.096
cmtwz7r8d000fuey3isx07hgm	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyop4p000fueq41qzn9zbw	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789131473846-136799"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.933
cmtwz7r8h000huey3gdgz7qdq	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyop4i000fueq6aaw6qltc	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789131473845-46468"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.938
cmtwz7r8k000juey3u7q6fjft	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyop4h000fueq73ddz9z30	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789131473845-473068"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.941
cmtwz7r8o000luey3wps8azxz	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyop4h000fueq5qrwquyfx	{"bulk": true, "name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789131473845-782916"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.944
cmtwyhv9d002yuew5qrliaugq	\N	\N	tenant.create	Tenant	cmtwyhv8z000fuew5b06kn7tm	{"name": "E2E Tenant", "slug": "e2e-tenant-1789131155222-245387"}	::ffff:127.0.0.1	\N	2026-09-11 12:52:36.098
cmtwz7r8r000nuey32ve16z6x	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyisb5002zue08flb4y4be	{"bulk": true, "name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789131198043-459117"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.947
cmtwz7r8u000puey3axkz6z3p	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyisag000fue080i72mvua	{"bulk": true, "name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789131198043-459117"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.951
cmtwz7r8y000ruey3b66otj72	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyisa3002zue095jz099mw	{"bulk": true, "name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131198043-13614"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.954
cmtwyisar0036ue07su77slfi	\N	\N	tenant.admin.add	TenantMembership	cmtwyisao0034ue07ysk9lcey	{"email": "e2e-admins-promoted-1789131198042-497034@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-11 12:53:18.915
cmtwz7r91000tuey3k541i71t	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyis9u000jue05zzjfrulk	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789131198043-549987"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.957
cmtwz7r94000vuey3l2foc409	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyis9r000fue0atoyux9id	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789131198043-227906"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.961
cmuecmv5c0ljjue6tx9fnwby9	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	accounting.account.deactivate	Account	cmudu4a0q0asdue6tyy6f2j7p	{"name": "Madrassa", "lineCount": 0, "voucherCount": 0}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 17:00:28.848
cmtvde14u002yuesu2uonyj9c	\N	\N	tenant.create	Tenant	cmtvde14d000fuesup45narlm	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789035238215-185355"}	::ffff:127.0.0.1	\N	2026-09-10 10:13:58.974
cmtwz7r97000xuey3t31qi8jp	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyis9r000fue07rfw2qrqy	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789131198042-497034"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.964
cmtwz7r9b000zuey3ssvbvgay	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyis9g000fue09kfutvd9w	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789131198043-13614"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.967
cmtwz7r9e0011uey3ocjcs109	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyhv99002zuew4w6u5nufr	{"bulk": true, "name": "E2E Members Tenant B", "slug": "e2e-members-b-1789131155222-113417"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.97
cmtwz7r9h0013uey3apdt6kj4	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyhv8z000fuew5b06kn7tm	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789131155222-245387"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.974
cmtwz7r9l0015uey3kvrpg6qr	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyhv8t000juew02yiv0dmd	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789131155221-973344"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.977
cmtwz7r9p0017uey3es8wjjvc	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyhv8r002zuew3h2syi7jn	{"bulk": true, "name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789131155222-962191"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.981
cmtwz7r9t0019uey32e2vx4ey	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyhv8p000fuew4c3l6yd3c	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789131155222-113417"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.985
cmtwz7r9y001buey3n1k8vw4t	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyhv8j000fuew22b27a4qc	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789131155222-947720"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.99
cmtwz7ra2001duey3z79x84hs	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwyhv82000fuew3we77zen4	{"bulk": true, "name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789131155222-962191"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.994
cmtwz7ra5001fuey374f7cs7z	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtwy5v6n0034ueokseh04457	{"bulk": true, "name": "Existing Mahalle", "slug": "existing-mahalle"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:43.998
cmtwz7ra8001huey3qxyxvh2c	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvitwwc0005uerq2s2yagjm	{"bulk": true, "name": "test", "slug": "test"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.001
cmuecohd90m1iue6tvehvpll0	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	collections.update	FinanceCollection	cmu03tsd6000euebnupd1kj8r	{"updated": {"categoryId": "cmu010weq00pzue6ske5w3285"}, "previous": {"id": "cmu03tsd6000euebnupd1kj8r", "date": "2026-09-13T00:00:00.000Z", "type": "MONTHLY", "notes": " [CANCELLED: ,]", "amount": 234, "status": "CANCELLED", "receipt": {"id": "cmu03tsco0005uebn4v2903ix", "date": "2026-09-13T00:00:00.000Z", "dueId": null, "amount": 234, "status": "CANCELLED", "tenantId": "cmtv96wxe000wue7w59ewld1m", "createdAt": "2026-09-13T17:45:08.809Z", "reference": null, "updatedAt": "2026-09-13T18:06:56.112Z", "voucherId": null, "recordedBy": "cmtv96x5n0057ue7wcl3a27w0", "cancelledAt": "2026-09-13T18:06:56.111Z", "cancelledBy": "cmtv96x5n0057ue7wcl3a27w0", "description": null, "categoryName": "Monthly Mahallu Collection", "receivedFrom": "Khadeeja CH", "paymentMethod": "Cash", "receiptNumber": "RCP-00002", "cancelledReason": ","}, "familyId": "cmtxuryp3000duetvd4ba24fs", "memberId": "cmtxus7jp000puetvfqm7pjcw", "tenantId": "cmtv96wxe000wue7w59ewld1m", "createdAt": "2026-09-13T17:45:08.827Z", "donorName": "Khadeeja CH", "receiptId": "cmu03tsco0005uebn4v2903ix", "reference": null, "updatedAt": "2026-09-13T18:06:56.109Z", "categoryId": "cmu010wel00pnue6sz27v7wlr", "donorPhone": "+919812345602", "description": null, "customFields": null, "donorAddress": null, "journalEntry": {"id": "cmu03tscw0009uebnki1jrena", "date": "2026-09-13T00:00:00.000Z", "lines": [{"id": "cmu03tscw000buebnebmz6y0e", "debit": 234, "credit": 0, "accountId": "cmu010we900ovue6s2p3xw6ry", "createdAt": "2026-09-13T17:45:08.817Z", "description": "Received via Cash", "journalEntryId": "cmu03tscw0009uebnki1jrena"}, {"id": "cmu03tscw000cuebnwxve47vc", "debit": 0, "credit": 234, "accountId": "cmu010wed00p3ue6s0x2wpas1", "createdAt": "2026-09-13T17:45:08.817Z", "description": "Monthly Mahallu Collection", "journalEntryId": "cmu03tscw0009uebnki1jrena"}], "status": "CANCELLED", "postedAt": "2026-09-13T17:45:08.816Z", "postedBy": "cmtv96x5n0057ue7wcl3a27w0", "sourceId": null, "tenantId": "cmtv96wxe000wue7w59ewld1m", "createdAt": "2026-09-13T17:45:08.817Z", "reference": "RCP-00002", "updatedAt": "2026-09-13T18:06:56.121Z", "sourceType": "COLLECTION", "totalDebit": 234, "description": "Monthly Mahallu Collection from Khadeeja CH [CANCELLED: ,]", "entryNumber": "JRN-00002", "totalCredit": 234, "financialYearId": "cmu010wdp00o9ue6sp41ip2h6"}, "attachmentUrl": null, "bankAccountId": null, "collectorName": null, "paymentMethod": "Cash", "journalEntryId": "cmu03tscw0009uebnki1jrena", "paymentMethodId": null, "collectionNumber": "COL-00002"}}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 17:01:44.301
cmtwz7rab001juey3olkdvl6e	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvebe3k002zueajfwi8mael	{"bulk": true, "name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789036794489-498592"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.004
cmtwz7raf001luey3rf51juja	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvebe3j002zueaknichqs85	{"bulk": true, "name": "E2E Members Tenant B", "slug": "e2e-members-b-1789036794488-83155"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.008
cmtwz7ral001nuey3zfjteh7d	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvebe37000fuealz1qn18qp	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789036794488-331358"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.013
cmtwz7raq001puey3gwimwhj5	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvebe30000fueajemed2rr0	{"bulk": true, "name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789036794489-498592"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.019
cmtwz7raw001ruey34hytou3p	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvebe2z000fueake26e122s	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789036794488-83155"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.024
cmtwz7raz001tuey36fdba3y6	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvebe2w000fueailscbmz2r	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789036794488-274433"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.028
cmtwz7rb2001vuey3h6rgud0d	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvebdwb000cueamkjkuyw33	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789036794488-906780"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.031
cmtwz7rb6001xuey3uc80y3q8	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtve6n1v002zuesdzxop9v96	{"bulk": true, "name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789036572276-845338"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.034
cmtwz7rb9001zuey3r2fsex8h	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtve6n1h002zuese8r68fjle	{"bulk": true, "name": "E2E Members Tenant B", "slug": "e2e-members-b-1789036572277-393567"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.037
cmtwz7rbc0021uey3zrswh0bs	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtve6n1c000fuesdrbumyjcf	{"bulk": true, "name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789036572276-845338"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.041
cmtwz7rbf0023uey3v7molo5m	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtve6n13000fuesfrjlchcpe	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789036572277-441424"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.043
cmtwz7rbh0025uey3wcp8ikw0	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtve6n0z000fueser0y4zml4	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789036572277-393567"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.046
cmtve6n2g005muesdu6pwpknk	\N	\N	tenant.admin.add	TenantMembership	cmtve6n2e005kuesd74y3s1ye	{"email": "e2e-biz-plain-a-1789036572276-845338@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:36:13.768
cmtwz7rbk0027uey3jix9l4qs	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtve6n0v000fuescnjyb57ub	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789036572276-912031"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.048
cmtwz7rbm0029uey34yx1reux	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtve6muh000cuesgerklag00	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789036572277-644307"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.051
cmtwz7rbq002buey3j2r353qf	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdrvf7002zuekjexycmzt4	{"bulk": true, "name": "E2E Members Tenant B", "slug": "e2e-members-b-1789035883899-285357"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.054
cmtwz7rbt002duey3wq0w3r5k	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdrvek000fuekkgdxvjt4e	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789035883899-124109"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.057
cmtwz7rbv002fuey36s05a1pt	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdrvek000fuekjmxlwno3d	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789035883899-285357"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.059
cmtwz7rby002huey39n53g6pg	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdrve3000fueki27iwfdfp	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789035883899-969633"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.062
cmtwz7rc1002juey3abrfmjy1	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdrv88000cuekl13f7rxoh	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789035883900-662667"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.065
cmtwz7rc4002luey3pveygt17	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdmou70009ue091d9koiz0	{"bulk": true, "name": "Verify Mahalle", "slug": "verify-1789035642"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.068
cmtwz7rc6002nuey3eb0ovjo6	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdjm4s002zuelaytvv7nuo	{"bulk": true, "name": "E2E Members Tenant B", "slug": "e2e-members-b-1789035498631-87979"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.071
cmtwz7rc9002puey3thpy3nh0	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdjm49000fuelairztkaf5	{"bulk": true, "name": "E2E Members Tenant A", "slug": "e2e-members-a-1789035498631-87979"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.074
cmtwz7rcc002ruey3qqftcxmn	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdjm49000fuelbdzf20rhh	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789035498631-416558"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.077
cmtwz7rcg002tuey37ab2gcbn	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdjm44000fuel9khdrgpxb	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789035498631-518567"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.08
cmtwz7rcl002vuey3koxld7oq	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvdjlyg000cuelchbj9yf9c	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789035498631-465333"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.086
cmtwz7rcp002xuey3mqq1oq7w	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvde14i000fuesviofjfrpd	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789035238215-492436"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.09
cmtwz7rct002zuey39w6mo5kp	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvde14d000fuesup45narlm	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789035238215-185355"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.094
cmtwz7rcy0031uey3it12br5j	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvde0yk000cuesw7tesu1pt	{"bulk": true, "name": "E2E Platform Tenant", "slug": "e2e-platform-1789035238215-197381"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.098
cmtwz7rd40033uey3caipvsn5	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvd8rdj000fue0gg2n064qh	{"bulk": true, "name": "E2E Admins Tenant", "slug": "e2e-admins-1789034992312-591871"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.105
cmtwz7rd70035uey3fvqef9b9	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvd8rdj000fue0hqhyuvt0t	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789034992312-634436"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.108
cmtwz7rdb0037uey34ix6jw3d	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvd7jw9000fuev2o3zykj9m	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789034935950-188180"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.111
cmtwz7rdg0039uey3ewuiatzw	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvcyvvl000fuew9ioep7vsw	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789034531528-956159"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.116
cmtwz7rdk003buey3s7ded6c8	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvcsbdx000muepkmszo08lc	{"bulk": true, "name": "Curl Demo Mahalle", "slug": "curl-demo"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.12
cmtwz7rdo003duey3z1wpal8r	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvbn7vu000fuewmizkft5v8	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789032307624-22702"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.124
cmtwz7rdr003fuey3b15mzcw2	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvb713t000fuetlezjknzxe	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789031552355-231290"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.127
cmtwz7rdx003huey3cj4xpp7x	cmtv96wx6000tue7wfg2rfzuu	\N	platform.tenant.delete	Tenant	cmtvb4w3b000fuelzuva0x8pj	{"bulk": true, "name": "E2E Tenant", "slug": "e2e-tenant-1789031452540-299211"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:12:44.133
cmtvbn7wc002uuewm0tu1ki4l	\N	\N	tenant.create	Tenant	cmtvbn7vu000fuewmizkft5v8	{"name": "E2E Tenant", "slug": "e2e-tenant-1789032307624-22702"}	::ffff:127.0.0.1	\N	2026-09-10 09:25:08.412
cmtvd8re80032ue0g700s2mjg	\N	\N	tenant.admin.add	TenantMembership	cmtvd8re50030ue0gomddifwo	{"email": "e2e-admins-member-1789034992312-591871@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.072
cmtvd8ref0036ue0gqtuwjvo1	\N	\N	tenant.admin.add	TenantMembership	cmtvd8red0034ue0gadaj50t1	{"email": "e2e-admins-promoted-1789034992312-591871@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.079
cmtvd8rfh003aue0gc6jouv0f	\N	\N	tenant.admin.remove	TenantMembership	cmtvd8red0034ue0gadaj50t1	{"removedRole": "ADMIN", "removedUserId": "cmtvd8rda000aue0glwo0sqs4"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.118
cmtvd8rew0038ue0gyh9wq8wl	\N	\N	tenant.admin.role_change	TenantMembership	cmtvd8re50030ue0gomddifwo	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-10 10:09:53.096
cmtzezfsp0001ueou1fdbxiy8	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:09:42.074
cmtzezvmy0009ueoui0kvo345	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": null}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:10:02.602
cmtzf3geq007iueouomok9htv	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	program.create	Program	cmtzf3gen007gueoujabdao4t	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:12:49.49
cmtzkjmiu001jueedvltnztm8	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 08:45:21.991
cmtzw37k4002sues5eg9xh7ii	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	role.duplicate	Role	cmtzw37jk000hues5a1dhfiuz	{"sourceRoleId": "cmtv96wyh002mue7w8nxd6po7"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:08:31.493
cmu03x3ri001buebny41y348q	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.create	Voucher	cmu03x3rc0019uebnle3gz6fz	{"amount": "2134.00", "status": "DRAFT", "voucherNumber": "VCH-00002"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:47:43.567
cmu0xqzfv0001ue9hd435pl4p	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:42:46.507
cmu0xr3ky0005ue9hnuvww55s	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:42:51.874
cmu0xroad0009ue9hmwyj49b8	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:18.709
cmu0xrrrl000due9horz2wh0y	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:23.217
cmu0xrue2000hue9h3ajnn2sn	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:26.618
cmu0xrxqj000lue9hrlxie8kn	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:30.955
cmu0xs0xe000pue9hy8rfn7jb	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:35.091
cmu0xs6ni000tue9hwhy01yts	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:42.51
cmu0xt4ex000xue9hj18sebl1	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:44:26.266
cmu193zbr004fuedqu538qqre	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-14 13:00:48.664
cmtwz8qe1002yuecdpmj8nb11	\N	\N	tenant.create	Tenant	cmtwz8qdn000fuecdmis7pbks	{"name": "E2E Tenant", "slug": "e2e-tenant-1789132408620-202374"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.498
cmtymw22y007ruemuct3qx99l	\N	\N	services.request.create	ServiceRequest	cmtymw22u007puemuyqbyp92j	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:03:15.083
cmtzf0cij000bueougtq58trg	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:10:24.476
cmtzezvlr0007ueouqvb7vpfu	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.feature.override	Feature	cmtzerev4002cuel2enbo2801	{"key": "finance", "isEnabled": false}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:10:02.56
cmtzlssph001nueedz8zpupsd	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 09:20:29.525
cmtzw3c9h002uues5bbe3t3wy	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	role.deactivate	Role	cmtzw37jk000hues5a1dhfiuz	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:08:37.59
cmu03xb83001duebnxuc6zxu1	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.submit	Voucher	cmu03x3rc0019uebnle3gz6fz	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:47:53.235
cmu0yaxdc003luejvk2iw1b19	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtym0q780049uetpt4mjpb20	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:58:16.944
cmu1947ky004juedqi8wwvo8e	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:00:59.363
cmu194ikn004luedqehnex0uo	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-14 13:01:13.608
cmtwz8qe4002yuecaotbx0mev	\N	\N	tenant.create	Tenant	cmtwz8qdq000fueca6qk2glxc	{"name": "E2E Admins Tenant", "slug": "e2e-admins-1789132408619-641554"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.501
cmtwz8qeg0032uecauen6kdkc	\N	\N	tenant.admin.add	TenantMembership	cmtwz8qee0030uecaurkuvljb	{"email": "e2e-admins-member-1789132408619-641554@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.513
cmtwz8qep0036uecai7e3cvor	\N	\N	tenant.admin.add	TenantMembership	cmtwz8qen0034uecawvtjzyq6	{"email": "e2e-admins-promoted-1789132408619-641554@example.com", "roleKey": "ADMIN"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.522
cmtwz8qgd003auecamvkk5yrh	\N	\N	tenant.admin.remove	TenantMembership	cmtwz8qen0034uecawvtjzyq6	{"removedRole": "ADMIN", "removedUserId": "cmtwz8qdc000aueca4vup6nuq"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.582
cmtwz8qfe0038uecandlpp8v1	\N	\N	tenant.admin.role_change	TenantMembership	cmtwz8qee0030uecaurkuvljb	{"toRole": "MODERATOR", "fromRole": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.547
cmtymwa7d007tuemudn4z9me9	\N	\N	services.request.update	ServiceRequest	cmtymw22u007puemuyqbyp92j	{"status": "APPROVED"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:03:25.609
cmtymwa7u007vuemunf9gzjn1	\N	\N	services.request.update	ServiceRequest	cmtymw22u007puemuyqbyp92j	{"status": "COMPLETED"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:03:25.626
cmtzf1q2l000hueouvs5fqg8x	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:11:28.701
cmtzf1g2g000fueou0la6hypp	cmtv96wx6000tue7wfg2rfzuu	\N	platform.feature.disable	Feature	cmtzerevd002huel21p7ycc37	{"key": "services", "changes": {"isEnabledGlobally": false}}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:11:15.737
cmtzmnjll001rueed315q77sv	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 09:44:24.058
cmtzw95am002wues5x83yc67c	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:13:08.495
cmu04ed3d0001ueqhk3egy8si	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:01:08.81
cmu04i6d8000rueqhly8hk03e	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	registers.divorce.certificate.issue	DivorceRecord	cmu04i43e000lueqhdrnoyf29	{"certificateNumber": "DIV-00001"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:04:06.717
cmu0ybi49003puejvqg8qaqbw	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtym0q780049uetpt4mjpb20	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:58:43.833
cmu194no3004puedqcgmgc55d	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-14 13:01:20.212
cmu195g8h004tuedqt2ct3lsd	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:01:57.233
cmtwz8qef002yuecck5dorqlp	\N	\N	tenant.create	Tenant	cmtwz8qe0000fuecc24ob5z4s	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789132408619-649472"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.512
cmtwz8qf6005mueccsyskuat3	\N	\N	tenant.admin.add	TenantMembership	cmtwz8qf3005kuecctlgy4c4h	{"email": "e2e-members-plain-a-1789132408619-649472@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.538
cmtwz8qfj005quecc4abtx44o	\N	\N	member.create	Member	cmtwz8qfg005oueccenhx4p1q	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.551
cmtwz8qev005iueccttehbu66	\N	\N	tenant.create	Tenant	cmtwz8qel002zueccbw7640kz	{"name": "E2E Members Tenant B", "slug": "e2e-members-b-1789132408619-649472"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.527
cmtyn3dkg0001uefv0454ohrc	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:08:56.556
cmtyn69ft000nuefv6dn4511q	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:11:11.177
cmtyn3dlm0007uefv7m4trkwq	\N	\N	event.create	Event	cmtyn3dlj0005uefvhn8w9t0f	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:08:56.602
cmtyn3wgp000fuefv143kppg7	\N	\N	finance.account.create	Account	cmtyn3wgm000duefvb82s4u6g	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:09:21.05
cmtyn3wi3000luefv42n61bb8	\N	\N	finance.voucher.create	Voucher	cmtyn3whx000juefvn6ib69tu	{"amount": "500.00", "voucherNumber": "RCT-00001"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:09:21.1
cmtzf1z6w000lueouwccwgit1	cmtv96wx6000tue7wfg2rfzuu	\N	platform.feature.enable	Feature	cmtzerevd002huel21p7ycc37	{"key": "services", "changes": {"isEnabledGlobally": true}}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:11:40.52
cmtzf246j006iueou4s2shk93	cmtv96wx6000tue7wfg2rfzuu	\N	platform.feature.disable	Feature	cmtzerev9002fuel2ss38mzvb	{"key": "announcements", "changes": {"isEnabledGlobally": false}}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:11:46.987
cmtzn24pm001vueed4o29ct4w	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtxus7k7000tuetvqqxr667b	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 09:55:44.602
cmtzwgqjt0030ues5jhfh3pdt	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.support.start	Tenant	cmtv96wxe000wue7w59ewld1m	{"name": "Demo Mahalle", "slug": "demo", "reason": null}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:19:02.633
cmu04ep1x0005ueqhrqbfh2ex	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	expenses.voucher.cancel	Voucher	cmu03x3rc0019uebnle3gz6fz	{"reason": "nothung", "voucherNumber": "VCH-00002"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:01:24.309
cmu0ycu0c003ruejvs4nvjacw	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:59:45.901
cmu1a1466003juevqvc591t2u	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:26:34.59
cmu2v4j2w003juesws48ecdgf	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-15 16:04:51.99
cmu4dbi84003juezj3gpqu1es	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 17:21:56.741
cmtwz8qeg002yuecbby7435wh	\N	\N	tenant.create	Tenant	cmtwz8qe3000fuecbi1pskq6w	{"name": "E2E Biz Tenant A", "slug": "e2e-biz-a-1789132408620-985577"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.513
cmtwz8qf8005muecbp8qt5lhd	\N	\N	tenant.admin.add	TenantMembership	cmtwz8qf5005kuecbinvli4id	{"email": "e2e-biz-plain-a-1789132408620-985577@example.com", "roleKey": "MEMBER"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.541
cmtwz8qfk005quecb9m4j8m97	\N	\N	family.create	Family	cmtwz8qfj005ouecbu9ca4wjq	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.553
cmtwz8qid0064uecba1j2gbjr	\N	\N	announcement.delete	Announcement	cmtwz8qht0060uecbxw8grcg3	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.653
cmtwz8qis0068uecbydp1ll1o	\N	\N	program.create	Program	cmtwz8qir0066uecbg7g5cg1n	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.669
cmtwz8qew005iuecbh6x4c0cv	\N	\N	tenant.create	Tenant	cmtwz8qem002zuecb6okedhf5	{"name": "E2E Biz Tenant B", "slug": "e2e-biz-b-1789132408620-985577"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.528
cmtyn6g6k000ruefvbiahavoh	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:11:19.916
cmtyn3nm1000buefvtuawusps	\N	\N	events.registration.create	EventRegistration	cmtyn3nly0009uefvxli2zsl7	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:09:09.577
cmtzf1zir000oueouib7bgeti	\N	\N	auth.register	User	cmtzf1zio000mueouh5ubp0i1	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:11:40.948
cmtzf1zop000sueoutkq0jzam	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:11:41.161
cmtzf1zpy006gueoufj67qth6	\N	\N	tenant.create	Tenant	cmtzf1zpg000vueouypd1r49g	{"name": "Final Test Mahallu", "slug": "final-test-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:11:41.207
cmtzf349t007cueouxq0n5nop	\N	\N	tenant.admin.role_change	TenantMembership	cmtzf2ugs0078ueouvxvlyubq	{"toRole": "STAFF", "fromRole": "REGISTRATION_OFFICER"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:12:33.761
cmtzf34a7007eueou1yadxumq	\N	\N	role.deactivate	Role	cmtzf2m52006queouomdu3dju	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:12:33.776
cmtyncu9b000fueg4dvgw4wap	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:16:18.095
cmtyndmnu000nueg4xs7t4vmz	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:16:54.907
cmtzf2h6q006mueoue4hwv4om	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	announcement.create	Announcement	cmtzf2h6n006kueouz876wrr5	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:12:03.843
cmtznbpmu001xueed73lhmq9i	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:03:11.622
cmtzxlo0u0001ueixpjo8ehad	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:50:52.254
cmtzxlrgn0005ueix8yaxb2b7	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:50:56.711
cmu04g0u10009ueqh264iz8ro	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	taxes.filing.create	TaxLegalFiling	cmu04g0tu0007ueqhfk89w9oz	{"title": "test", "filingType": "TAX"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:02:26.234
cmu04iptl000vueqhdrd3b387	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	registers.grave.create	GraveRecord	cmu04ipti000tueqhkn5rhl2e	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:04:31.929
cmu0ywhc6003juelppqgqalna	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:15:02.599
cmu1aslum0047uevq4vvecxs7	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-14 13:47:57.215
cmu4dbtjj003nuezj6bo9z1t4	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 17:22:11.408
cmtwz8qga005suecch03y8kba	\N	\N	member.update	Member	cmtwz8qfg005oueccenhx4p1q	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.579
cmtwz8qgt005uueccncdrjegy	\N	\N	member.delete	Member	cmtwz8qfg005oueccenhx4p1q	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.598
cmtwz8qi0005zuec8n4rwxkdi	\N	\N	tenant.create	Tenant	cmtwz8qhp003guec8fzarpqyu	{"name": "Bulk Delete Me 1", "slug": "e2e-platform-1789132408619-200997-bulk-1"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.641
cmtwz8qge005suecb3r40v826	\N	\N	family.delete	Family	cmtwz8qfj005ouecbu9ca4wjq	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.582
cmtwz8qw1000guec94k4d34bb	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789132408620-671090@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:30.145
cmtwz8qw3000iuec96wrf5pmw	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789132408620-671090@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:30.148
cmtwz8qq3000cuec906ihn6d2	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132408620-671090@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:29.932
cmtwz8qvw000euec951xyvwvr	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132408620-671090@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:30.141
cmtwz8r1w000luec9tf2j4nnv	\N	\N	auth.register	User	cmtwz8r1u000juec9n2uehqk0	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:30.357
cmtwz8r7o000puec9l3o86okl	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:30.564
cmtwz8rdx000vuec9l0bs4am4	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:30.789
cmtwz8re4000zuec9tm561nx3	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:30.797
cmtwz8vpl0002uedphfxprqb9	\N	\N	auth.register	User	cmtwz8vpj0000uedp7v021csw	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.394
cmtwz8w41002yuedp7ogfrcdj	\N	\N	tenant.create	Tenant	cmtwz8w3m000fuedpx2lztn6w	{"name": "E2E Members Tenant A", "slug": "e2e-members-a-1789132416074-25677"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.913
cmtynd6vy000jueg4n5lwrfh3	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:16:34.462
cmtzf2ksn006oueou9edhemff	cmtv96wx6000tue7wfg2rfzuu	\N	platform.feature.enable	Feature	cmtzerev9002fuel2ss38mzvb	{"key": "announcements", "changes": {"isEnabledGlobally": true}}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:12:08.519
cmtzf2mu2006zueou5039ctmc	cmtv96wx6000tue7wfg2rfzuu	\N	platform.feature.enable	Feature	cmtzerevr002quel2cc2g36sj	{"key": "sms", "changes": {"isEnabledGlobally": true}}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:12:11.162
cmtzf2qvw0071ueoubnbaqoya	cmtv96wx6000tue7wfg2rfzuu	\N	platform.feature.enable	Feature	cmtzerevp002puel2ghm2z705	{"key": "madrassa", "changes": {"isEnabledGlobally": true}}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:12:16.412
cmtznp8ag0001uekq50cvy115	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"divisionTerm": "", "hasDivisions": false, "houseNumberStartAt": 1, "houseNumberMinDigits": 1, "houseNumberingMethod": "NUMERIC", "previousDivisionTerm": "Division", "houseNumberAllowManual": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:13:42.328
cmtzxro740009ueix2oe021de	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:55:32.416
cmu04gq72000dueqh9fjuk4ly	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	registers.death.create	DeathRecord	cmu04gq6w000bueqhamu0g2i6	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:02:59.102
cmu04i43h000nueqhon242jiq	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	registers.divorce.create	DivorceRecord	cmu04i43e000lueqhdrnoyf29	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:04:03.773
cmu0yxh8t003nuelpoz5t7w5m	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.update	House	cmtzofwuh000huev7ou8zfy2m	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:15:49.133
cmu0yxh9k003puelpsun5ypjj	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmtxurypj000huetvuj18pre2	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:15:49.16
cmu0yxha6003ruelpbo96cnh3	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.update	Member	cmtxus7k7000tuetvqqxr667b	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:15:49.183
cmu1cb5i6005ruevqrproxzse	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:30:22.11
cmu4fzrvg003puezjg583rrld	\N	\N	auth.login.failed	\N	\N	{"email": "hg@g.nk"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:36:48.22
cmu4fzs2d003ruezjzgmvqu0e	\N	\N	auth.login.failed	\N	\N	{"email": "hg@g.nk"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:36:48.47
cmu4fzvks003tuezjfllmhdvb	\N	\N	auth.login.failed	\N	\N	{"email": "hg@g.nk"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:36:53.02
cmu4g0hwa003vuezjww60i7i6	\N	\N	auth.login.failed	\N	\N	{"email": "dfsgdf@efw.sdf"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:37:21.946
cmtwz8w5z0034uedl2f0ls3ei	\N	\N	platform.tenant.suspend	Tenant	cmtwz8w4e000juedlbdi1emk8	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789132416075-885536"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.984
cmtwz8w650036uedlusu31fq0	\N	\N	platform.tenant.activate	Tenant	cmtwz8w4e000juedlbdi1emk8	{"name": "E2E Platform Tenant", "slug": "e2e-platform-1789132416075-885536"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.99
cmtwz8w6r0039uedl4ybetw31	\N	\N	platform.role.permissions_update	Role	cmtwz8w4i001guedlf9s1grw8	{"roleKey": "ADMIN", "permissions": ["members.view"]}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.011
cmtzf2m57006xueoua8kcdbo3	\N	\N	role.create	Role	cmtzf2m52006queouomdu3dju	{"name": "Registration Officer", "permissionKeys": ["registers.marriage.view", "registers.marriage.create", "registers.death.view", "registers.death.create"]}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:12:10.267
cmtzf2ugv007aueou2vids7r8	\N	\N	tenant.admin.add	TenantMembership	cmtzf2ugs0078ueouvxvlyubq	{"email": "regofficer@example.com", "roleKey": "REGISTRATION_OFFICER"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:12:21.056
cmtzf2uga0074ueouwm8820p0	\N	\N	auth.register	User	cmtzf2ug70072ueouddov6sgm	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:12:21.034
cmtzfbxqa007kueou8jgya9m9	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:19:25.186
cmtznx5uq0003uekqkayvd8dl	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:19:52.419
cmtzxw2da000bueixjlobh078	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:58:57.407
cmtzxw7dq000fueixrzk40r5c	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:59:03.903
cmtzxwnqo000hueix013kbw43	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:59:25.104
cmu04gsaq000hueqhw0g65rgv	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	registers.death.certificate.issue	DeathRecord	cmu04gq6w000bueqhamu0g2i6	{"certificateNumber": "DTH-00001"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:03:01.826
cmu0z10k7003luevcvlshrsog	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.create	House	cmu0z10k3003juevciq5e67sc	{"displayNumber": "KBD10"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:18:34.135
cmu0z10kz003ruevc796m4an6	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.create	Family	cmu0z10kt003puevcm46p3ge0	{"houseId": "cmu0z10k3003juevciq5e67sc", "familyNumber": "F-00001"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:18:34.163
cmu0z10lr003xuevchaz8w56j	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	member.create	Member	cmu0z10ld003tuevc761wfg9n	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:18:34.191
cmu1cb5i6005tuevqg2q6of3f	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:30:22.11
cmu4g1672003xuezjptk2dlji	\N	\N	auth.login.failed	\N	\N	{"email": "dfsgdf@efw.sdf"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:37:53.438
cmu4g1g1b003zuezjtyx6jkt7	\N	\N	auth.login.failed	\N	\N	{"email": "hg@g.nk"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:38:06.191
cmu4g1orl0041uezjc304favs	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:38:17.505
cmtwz8w6a005uuedpturlrif0	\N	\N	member.delete	Member	cmtwz8w52005ouedpedrcdq04	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.994
cmtwz8w6e005suedo4ieqpijp	\N	\N	family.delete	Family	cmtwz8w5j005ouedooclp7cak	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:36.999
cmtwz8w6w005wuedoew3eeoie	\N	\N	event.create	Event	cmtwz8w6u005uuedoz2zpjulw	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.017
cmtwz8w7i005yuedo4acx5i4j	\N	\N	event.delete	Event	cmtwz8w6u005uuedoz2zpjulw	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.039
cmtwz8w7x0062uedozaqtcpd9	\N	\N	announcement.create	Announcement	cmtwz8w7w0060uedoxbaaf4ha	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.054
cmtwz8w8g0064uedoh4hsq9ez	\N	\N	announcement.delete	Announcement	cmtwz8w7w0060uedoxbaaf4ha	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.073
cmtwz8w8y0068uedovnfhbqov	\N	\N	program.create	Program	cmtwz8w8x0066uedovpig1wh0	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.09
cmtwz8w9d006auedojaw9usb7	\N	\N	program.delete	Program	cmtwz8w8x0066uedovpig1wh0	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.105
cmtyndzcu000rueg4a5bmo5b1	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:17:11.358
cmtynh1vi001hueg41btf12fe	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:19:34.591
cmtyngh9l0011ueg4byptmlq3	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:19:07.881
cmtyngtcg0019ueg48o7u92gj	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:19:23.536
cmtynh09i001dueg4aemjyf4p	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:19:32.502
cmtzfcz1i007oueoulb7ohvni	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:20:13.542
cmtzny68m0009uekqpzf4gkzp	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.division.create	TenantDivision	cmtzny68j0007uekqyf0b6ral	{"code": "KBD", "name": "Kambalakkad"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:20:39.574
cmtzyy5c0000lueixpnuewsk4	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:28:34.173
cmu04heb8000jueqh1f0vtwem	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	registers.death.update	DeathRecord	cmu04gq6w000bueqhamu0g2i6	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:03:30.356
cmu0z1d1n003zuevclfj7dm7i	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.update	House	cmu0z10k3003juevciq5e67sc	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:18:50.315
cmu0z1d2i0041uevcwmxi8m3r	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmu0z10kt003puevcm46p3ge0	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:18:50.346
cmu1e5sk6003jues1c4tpitoq	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:22:11.286
cmu4g1sjj0045uezjjyuu072g	cmtv96wx6000tue7wfg2rfzuu	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:38:22.399
cmu4g1vlf0047uezj6es83eny	\N	\N	auth.login.failed	\N	\N	{"email": "platform-admin@mahalle.localxs"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:38:26.355
cmu4g44dd004auezjayl02ype	cmu4g44d30048uezjgje091gp	\N	auth.register	User	cmu4g44d30048uezjgje091gp	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:40:11.042
cmu6z8kuo003juefszkhp61hr	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:11:04.078
cmtwz8w6l003auedndtc5bezj	\N	\N	tenant.admin.remove	TenantMembership	cmtwz8w4p0034uednb99tjib0	{"removedRole": "ADMIN", "removedUserId": "cmtwz8w3f000auednttd9gexp"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.006
cmtyngjm90015ueg4k0arun8k	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:19:10.93
cmtzfocg00001uesh9k151jg3	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:29:04.128
cmtznycif000buekqtxnu6xux	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.update	Tenant	cmtv96wxe000wue7w59ewld1m	{"divisionTerm": "Unit", "hasDivisions": true, "houseNumberStartAt": 1, "houseNumberMinDigits": 1, "houseNumberingMethod": "NUMERIC", "previousDivisionTerm": "", "houseNumberAllowManual": true}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:20:47.703
cmtzzf7gk000pueixiie6b0z4	cmtv96wx6000tue7wfg2rfzuu	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:41:50.081
cmu04lt35000xueqhhux12kiw	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	collections.cancel	FinanceCollection	cmu03tsd6000euebnupd1kj8r	{"reason": ",", "collectionNumber": "COL-00002"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:06:56.129
cmu0z1gqy0043uevcn921g80n	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.update	House	cmu0z10k3003juevciq5e67sc	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:18:55.114
cmu0z1grj0045uevcm5tppz3x	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmu0z10kt003puevcm46p3ge0	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:18:55.135
cmu1fvr4g004rue5lfj6g53y4	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 16:10:22.097
cmu4gc3lm004guezjob1c617u	cmu4g44d30048uezjgje091gp	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:46:23.29
cmu4gc8de004iuezjwtct1193	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:46:29.474
cmu70c1vz003zuefsgnhymise	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:41:45.743
cmtwz8w8e005zuedllm5c65pr	\N	\N	tenant.create	Tenant	cmtwz8w82003guedlrpo6jot9	{"name": "Bulk Delete Me 1", "slug": "e2e-platform-1789132416075-885536-bulk-1"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.07
cmtwz8w9m00b7uedlk40igcdw	\N	\N	tenant.create	Tenant	cmtwz8w9d008ouedlc1twcqi0	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789132416075-885536-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.114
cmtwz8w7f003duedlb8xfupyc	\N	\N	member.create	Member	cmtwz8w7a003buedl7c216pou	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.035
cmtwz8w7o003fuedl6m0anqp8	\N	\N	member.delete	Member	cmtwz8w7a003buedl7c216pou	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.045
cmtwz8w95008luedlqisk3fan	\N	\N	platform.tenant.delete	Tenant	cmtwz8w82003guedlrpo6jot9	{"bulk": true, "name": "Bulk Delete Me 1", "slug": "e2e-platform-1789132416075-885536-bulk-1"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.097
cmtwz8w8x008juedljrxxl8iz	\N	\N	tenant.create	Tenant	cmtwz8w8j0060uedlvms6vzpz	{"name": "Bulk Delete Me 2", "slug": "e2e-platform-1789132416075-885536-bulk-2"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.089
cmtwz8w97008nuedl4q9s0kuh	\N	\N	platform.tenant.delete	Tenant	cmtwz8w8j0060uedlvms6vzpz	{"bulk": true, "name": "Bulk Delete Me 2", "slug": "e2e-platform-1789132416075-885536-bulk-2"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.099
cmtwz8w9q00b9uedlmhah3xvm	\N	\N	platform.tenant.delete	Tenant	cmtwz8w9d008ouedlc1twcqi0	{"name": "Delete Me Mahalle", "slug": "e2e-platform-1789132416075-885536-deleteme"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.119
cmtynl5230002uenjw5m6f7rf	\N	\N	auth.register	User	cmtynl51x0000uenjkdusxmu5	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:22:45.34
cmtynl58a0006uenjtmopk88p	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:22:45.563
cmtynl59z005muenjnzj7fn6o	\N	\N	tenant.create	Tenant	cmtynl5940009uenjarxk71r7	{"name": "Phase 10 Test Mahallu", "slug": "phase10-test-mahallu"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:22:45.623
cmtynlcef005quenjskci23k7	\N	\N	member.create	Member	cmtynlcdz005ouenjzjpcz87p	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 17:22:54.855
cmtwz8wm0000guedmkkdm88ae	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789132416075-242656@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.56
cmtwz8wm3000iuedmpuh3xqhw	\N	\N	auth.login.locked	\N	\N	{"email": "e2e-auth-1789132416075-242656@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.563
cmtynmll9005suenj0srn1bqk	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:23:53.422
cmtynms62005wuenj5vei5b97	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:24:01.946
cmtynn70r0060uenj7091ienm	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:24:21.195
cmtyno2yy0064uenjdmwhrh8h	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:25:02.603
cmtzfolnb0007ueshy48gqaox	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.subscription.set_plan	Subscription	cmtzfoln20005uesh0a3ivsj2	{"status": "ACTIVE", "planKey": "starter"}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:29:16.055
cmtzfotm1000buesh78r0p4rg	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.invoice.create	Invoice	cmtzfotlx0009ueshuzwdym4o	{"amountMinor": 99900}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:29:26.377
cmtzfp0gk000fueshui5wjuec	cmtv96wx6000tue7wfg2rfzuu	cmtv96wxe000wue7w59ewld1m	platform.invoice.mark_paid	Invoice	cmtzfotlx0009ueshuzwdym4o	{"amountMinor": 99900}	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:29:35.253
cmtzo60wh0001ue29jvsm6wgj	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	structure.division.deactivate	TenantDivision	cmtzny68j0007uekqyf0b6ral	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:26:45.905
cmtzzqdy0000tueixrxiu49vl	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:50:31.7
cmtzzqljg000xueixz4806c78	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:50:41.548
cmtzzqohn000zueixf1i0okxm	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:50:45.371
cmtzzqub90013ueixai9q0ibl	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:50:52.918
cmtzzr2m00015ueix8cvm5paf	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:51:03.672
cmu04mau6000zueqhrrevih5m	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	collections.cancel	FinanceCollection	cmu03ssm9000eueadc4hi3h66	{"reason": ",", "collectionNumber": "COL-00001"}	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:07:19.134
cmu0z1oyh0047uevcbhumzwg8	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	house.update	House	cmu0z10k3003juevciq5e67sc	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:19:05.754
cmu0z1oz80049uevc09gtmvoe	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxe000wue7w59ewld1m	family.update	Family	cmu0z10kt003puevcm46p3ge0	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:19:05.78
cmu1fvr4h004tue5lqd48gw2z	cmtv96x5n0057ue7wcl3a27w0	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 16:10:22.097
cmu70qpro0041uefsraj4yl7a	cmtv96x5n0057ue7wcl3a27w0	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:53:09.876
cmtwz8wa9000auedm6jzxm5ga	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132416075-242656@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.137
cmtwz8wg4000cuedmz2wtepu7	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132416075-242656@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.349
cmtwz8wlw000euedmy9ybcqx3	\N	\N	auth.login.failed	\N	\N	{"email": "e2e-auth-1789132416075-242656@example.com"}	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.557
cmtwz8wrv000luedmqjkx32ro	\N	\N	auth.register	User	cmtwz8wrt000juedmfejwd9yh	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.772
cmtwz8wxo000puedmzfdxgf0n	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:37.981
cmtwz8x3x000vuedm9zt6pt86	\N	\N	auth.login.success	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:38.206
cmtwz8x44000zuedmp6qp2t12	\N	\N	auth.logout	\N	\N	\N	::ffff:127.0.0.1	\N	2026-09-11 13:13:38.213
\.


--
-- Data for Name: certificate_counters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.certificate_counters (id, "tenantId", "registerType", "lastNumber") FROM stdin;
cmu04gsaj000fueqh9blktrgn	cmtv96wxe000wue7w59ewld1m	DEATH	1
cmu04i6d3000pueqher1go72q	cmtv96wxe000wue7w59ewld1m	DIVORCE	1
cmu0z10ko003nuevcbdvvi0in	cmtv96wxe000wue7w59ewld1m	FAMILY	1
cmu03ssla0001ueadicnur422	cmtv96wxe000wue7w59ewld1m	COLLECTION	4
cmu03sslj0003ueadio1pjb5w	cmtv96wxe000wue7w59ewld1m	RECEIPT	4
cmu03vrty000ouebn43qd8z7k	cmtv96wxe000wue7w59ewld1m	VOUCHER_PAYMENT	4
cmu03ssls0007ueadl5zgkzku	cmtv96wxe000wue7w59ewld1m	JOURNAL_ENTRY	7
\.


--
-- Data for Name: committee_decisions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.committee_decisions (id, "tenantId", "meetingId", description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: committee_meetings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.committee_meetings (id, "tenantId", title, "meetingDate", location, agenda, minutes, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: committee_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.committee_members (id, "tenantId", "memberId", designation, "displayOrder", "termStart", "termEnd", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: death_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.death_records (id, "tenantId", "memberId", "deceasedName", "fatherOrGuardianName", gender, "dateOfBirth", "dateOfDeath", "placeOfDeath", "causeOfDeath", "burialDate", remarks, "certificateNumber", "certificateIssuedAt", "createdAt", "updatedAt") FROM stdin;
cmu04gq6w000bueqhamu0g2i6	cmtv96wxe000wue7w59ewld1m	\N	sdaf	\N	MALE	2026-09-02 00:00:00	2026-09-18 00:00:00	\N	\N	\N	\N	DTH-00001	2026-09-13 18:03:01.823	2026-09-13 18:02:59.097	2026-09-13 18:03:30.353
\.


--
-- Data for Name: divorce_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divorce_records (id, "tenantId", "husbandName", "husbandMemberId", "wifeName", "wifeMemberId", "divorceType", "divorceDate", place, "officiantName", remarks, "certificateNumber", "certificateIssuedAt", "createdAt", "updatedAt") FROM stdin;
cmu04i43e000lueqhdrnoyf29	cmtv96wxe000wue7w59ewld1m	lklk	\N	mmn	\N	\N	2026-09-02 00:00:00	\N	\N	\N	DIV-00001	2026-09-13 18:04:06.714	2026-09-13 18:04:03.771	2026-09-13 18:04:06.715
\.


--
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_registrations (id, "tenantId", "eventId", "memberId", "participantName", "participantPhone", attended, "createdAt") FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (id, "tenantId", title, description, location, "startsAt", "endsAt", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: families; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.families (id, "tenantId", name, address, phone, "isActive", "createdAt", "updatedAt", "houseId", "familyNumber", notes, "requiresCommunitySupport", "supportCategory", "supportStatus", "supportNotes", "emergencyContactName", "emergencyContactPhone", category, "familyStatusId") FROM stdin;
cmtvmdluo0001uev04h2hb39t	cmtv96wxe000wue7w59ewld1m	test Family	House: test	+919876543210	t	2026-09-10 14:25:35.713	2026-09-14 10:44:43.357	cmu148yx20045uejctwxujxgy	\N	\N	f	\N	\N	\N	\N	\N	\N	\N
cmtxuryp3000duetvd4ba24fs	cmtv96wxe000wue7w59ewld1m	Al Baraka House Family	House: Al Baraka House, Mahall House No: KBD02, 12 Kadalundi Road	+919812300001	t	2026-09-12 03:56:14.824	2026-09-14 10:44:57.79	cmtzofdmc0007uev7ttqboaqn	\N	Ward: Kambalakkad | Mahall House: KBD02	f	\N	\N	\N	\N	\N	\N	\N
cmtvmdluo0001uev04h2hb39t-mahalle	cmtyh4tr8002yuebkqxkrgukw	test	\N	+919876543210	t	2026-09-13 16:57:11.421	2026-09-13 16:57:11.421	\N	\N	\N	f	\N	ACTIVE	\N	\N	\N	\N	\N
cmtxuryp3000duetvd4ba24fs-mahalle	cmtyh4tr8002yuebkqxkrgukw	Al Baraka House	12 Kadalundi Road	+919812300001	t	2026-09-13 16:57:11.427	2026-09-13 16:57:11.427	\N	\N	Ward: Kambalakkad	f	\N	ACTIVE	\N	\N	\N	\N	\N
cmtxurypj000huetvuj18pre2-mahalle	cmtyh4tr8002yuebkqxkrgukw	Noorul Huda	Ward 4, Kakkad Thazham	\N	t	2026-09-13 16:57:11.43	2026-09-13 16:57:11.43	\N	\N	Ward: Kambalakkad	f	\N	ACTIVE	\N	\N	\N	\N	\N
cmtxurypj000huetvuj18pre2	cmtv96wxe000wue7w59ewld1m	Noorul Huda Family	House: Noorul Huda, Mahall House No: KBD04, Ward 4, Kakkad Thazham	\N	t	2026-09-12 03:56:14.839	2026-09-14 08:15:49.154	cmtzofwuh000huev7ou8zfy2m	\N	Ward: Kambalakkad | Mahall House: KBD04	t	Medical assistance	MONITORING	\N	\N	\N	\N	\N
cmu0z10kt003puevcm46p3ge0	cmtv96wxe000wue7w59ewld1m	Koyathoduka Family	House: Koyathoduka, Mahall House No: KBD10, Municipal Door No: 101, Kambalakkad, PO: Kambalakkad, Kerala	+919207483478	t	2026-09-14 08:18:34.157	2026-09-14 08:19:11.075	cmu0z10k3003juevciq5e67sc	F-00001	Mahall House: KBD10 | Municipal House: 101 | Category: General | Father: Abdu	t	\N	ACTIVE	\N	\N	\N	\N	\N
\.


--
-- Data for Name: features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.features (id, key, name, description, category, "isEnabledGlobally", "createdAt", "updatedAt") FROM stdin;
cmtzereuz002buel21myf1hz9	family-management	Family Management	\N	Core	t	2026-09-13 06:03:27.611	2026-09-13 06:03:27.611
cmtzerevd002huel21p7ycc37	services	Welfare & Community Aid	Zakat distribution, medical aid, education scholarships, and relief schemes.	Community & Governance	t	2026-09-13 06:03:27.625	2026-09-23 17:17:03.547
cmtzereve002iuel2xvekvvzy	forms	Forms	\N	Core	t	2026-09-13 06:03:27.627	2026-09-13 06:03:27.627
cmtzerevr002quel2cc2g36sj	sms	SMS Notifications	\N	Communication	t	2026-09-13 06:03:27.639	2026-09-13 06:12:11.159
cmtzereva002guel2hab78b1k	programs	Programs & Activities	Community enrichment workshops, educational initiatives, and special programs.	Community & Governance	t	2026-09-13 06:03:27.623	2026-09-23 17:17:03.551
cmu71qm590040ueupjeymtjtm	reports	Demographic Reports	Blood donor directories, expatriate censuses, and yatheem welfare analytics.	Digital & Outreach	t	2026-09-18 14:21:04.798	2026-09-23 17:17:03.557
cmu71qm590041ueupy7uk693x	notifications	Broadcast Notifications	Automated SMS, WhatsApp, and push broadcast delivery for announcements.	Digital & Outreach	t	2026-09-18 14:21:04.798	2026-09-23 17:17:03.558
cmtzerev6002duel2m7fo4762	committee	Executive Committee	Committee office bearers, portfolio designations, and official meeting minutes.	Community & Governance	t	2026-09-13 06:03:27.618	2026-09-23 17:17:03.546
cmtzerevo002ouel2adwwca5e	release-register	Mahallu Release (NOC)	Official clearance and No Objection Certificates for members moving to other jurisdictions.	Official Registers	t	2026-09-13 06:03:27.636	2026-09-23 17:17:03.542
cmtzerevm002nuel27rcsvvc5	property-register	Waqf & Property Register	Masjid assets, endowment land, commercial properties, and tenant agreements.	Official Registers	t	2026-09-13 06:03:27.634	2026-09-23 17:17:03.545
cmu71qm59003zueuph77m9eqy	website	Public Website & CMS	Public-facing website, custom domain management, and online visibility.	Digital & Outreach	t	2026-09-18 14:21:04.797	2026-09-23 17:17:03.553
cmu71qm52003jueupb8zg13no	families	Families Registry	Household units, dwelling allocations, and household genealogy trees.	Core & Directory	t	2026-09-18 14:21:04.791	2026-09-23 17:17:03.533
cmtzerev7002euel2xzur6ndg	events	Events & Calendar	Islamic events, community gatherings, and program scheduling.	Community & Governance	t	2026-09-13 06:03:27.62	2026-09-23 17:17:03.548
cmu71qm53003kueup72729yjv	divisions	Wards & Divisions	Jurisdictional area divisions, ward assignments, and localized clustering.	Core & Directory	t	2026-09-18 14:21:04.791	2026-09-23 17:17:03.535
cmu71qm54003mueupaqk84x3g	accounting	Professional Accounting	Double-entry general ledger, chart of accounts, cash & bank books, trial balance, and financial statements.	Finance & Accounts	t	2026-09-18 14:21:04.792	2026-09-23 17:17:03.537
cmtzerevp002puel2ghm2z705	madrassa	Madrassa & Dars	Madrassa student enrollments, academic rosters, and teacher records.	Official Registers	t	2026-09-13 06:03:27.638	2026-09-23 17:17:03.544
cmu71qm4x003iueup7nq7205y	members	Members Directory	Official census, demographic registry, and individual profiles of all Mahallu residents.	Core & Directory	t	2026-09-18 14:21:04.785	2026-09-23 17:17:03.529
cmtzerev9002fuel2ss38mzvb	announcements	Announcements & Circulars	Noticeboard updates, public broadcasts, and targeted member alerts.	Community & Governance	t	2026-09-13 06:03:27.621	2026-09-23 17:17:03.549
cmtzerevg002juel2l6xwmp57	marriage-register	Marriage (Nikah) Register	Official Islamic marriage records, counter certificates, and register logs.	Official Registers	t	2026-09-13 06:03:27.628	2026-09-23 17:17:03.538
cmtzerevi002luel2dnujun9q	divorce-register	Divorce (Talaq) Register	Official divorce record tracking and certified archival documentation.	Official Registers	t	2026-09-13 06:03:27.631	2026-09-23 17:17:03.541
cmtzerevk002muel2avr1zgl1	grave-register	Grave Allocation (Kabarsthan)	Cemetery lot numbering, burial slot allotments, and Kabarsthan management.	Official Registers	t	2026-09-13 06:03:27.632	2026-09-23 17:17:03.543
cmtzerev4002cuel2enbo2801	finance	Finance & Collections	Operational collections, monthly subscriptions, dues tracking, and payment receipts.	Finance & Accounts	t	2026-09-13 06:03:27.616	2026-09-23 17:17:03.536
cmtzerevh002kuel24qomo1dy	death-register	Death (Mayyith) Register	Death registrations, burial records, and certified register exports.	Official Registers	t	2026-09-13 06:03:27.629	2026-09-23 17:17:03.54
\.


--
-- Data for Name: finance_accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_accounts (id, "tenantId", name, type, "isActive", "createdAt", "updatedAt", code, "currentBalance", description, "isSystem", "openingBalance", "parentAccountId") FROM stdin;
cmu010we400olue6svqptuqp9	cmtv96wxe000wue7w59ewld1m	Assets	ASSET	t	2026-09-13 16:26:41.789	2026-09-13 16:26:41.789	1000	0.00	\N	t	0.00	\N
cmu010we600onue6sg3rlnvhi	cmtv96wxe000wue7w59ewld1m	Liabilities	LIABILITY	t	2026-09-13 16:26:41.791	2026-09-13 16:26:41.791	2000	0.00	\N	t	0.00	\N
cmu010we700opue6s9gax0pjh	cmtv96wxe000wue7w59ewld1m	Equity & Funds	EQUITY	t	2026-09-13 16:26:41.792	2026-09-13 16:26:41.792	3000	0.00	\N	t	0.00	\N
cmu010we800orue6s2zud47ln	cmtv96wxe000wue7w59ewld1m	Income	INCOME	t	2026-09-13 16:26:41.792	2026-09-13 16:26:41.792	4000	0.00	\N	t	0.00	\N
cmu010we900otue6syf6iw8at	cmtv96wxe000wue7w59ewld1m	Expenses	EXPENSE	t	2026-09-13 16:26:41.793	2026-09-13 16:26:41.793	5000	0.00	\N	t	0.00	\N
cmu010wea00oxue6sflo0fb89	cmtv96wxe000wue7w59ewld1m	Federal Bank Main Account	ASSET	t	2026-09-13 16:26:41.795	2026-09-13 16:26:41.795	1200	0.00	\N	f	0.00	cmu010we400olue6svqptuqp9
cmu010web00ozue6s7z7si7pt	cmtv96wxe000wue7w59ewld1m	Accounts Payable	LIABILITY	t	2026-09-13 16:26:41.796	2026-09-13 16:26:41.796	2100	0.00	\N	f	0.00	cmu010we600onue6sg3rlnvhi
cmu010wec00p1ue6s88lsch3r	cmtv96wxe000wue7w59ewld1m	Mahallu General Fund	EQUITY	t	2026-09-13 16:26:41.796	2026-09-13 16:26:41.796	3100	0.00	\N	f	0.00	cmu010we700opue6s9gax0pjh
cmu010wef00p9ue6sl7hpht8g	cmtv96wxe000wue7w59ewld1m	Zakat & Fitra Funds	INCOME	t	2026-09-13 16:26:41.8	2026-09-13 16:26:41.8	4400	0.00	\N	f	0.00	cmu010we800orue6s2zud47ln
cmu010weg00pbue6s9t99yt7y	cmtv96wxe000wue7w59ewld1m	Staff Salary & Wages	EXPENSE	t	2026-09-13 16:26:41.8	2026-09-13 16:26:41.8	5100	0.00	\N	f	0.00	cmu010we900otue6syf6iw8at
cmu010weh00pfue6syyk1yt72	cmtv96wxe000wue7w59ewld1m	Masjid & Building Maintenance	EXPENSE	t	2026-09-13 16:26:41.802	2026-09-13 16:26:41.802	5300	0.00	\N	f	0.00	cmu010we900otue6syf6iw8at
cmu010wei00phue6s3dy1bgro	cmtv96wxe000wue7w59ewld1m	Programs & Religious Events	EXPENSE	t	2026-09-13 16:26:41.803	2026-09-13 16:26:41.803	5400	0.00	\N	f	0.00	cmu010we900otue6syf6iw8at
cmu010wej00pjue6shugxm1lx	cmtv96wxe000wue7w59ewld1m	Office & Administrative Expenses	EXPENSE	t	2026-09-13 16:26:41.803	2026-09-13 16:26:41.803	5500	0.00	\N	f	0.00	cmu010we900otue6syf6iw8at
cmu010wed00p3ue6s0x2wpas1	cmtv96wxe000wue7w59ewld1m	Monthly Mahallu Collections	INCOME	t	2026-09-13 16:26:41.797	2026-09-23 17:01:44.28	4100	5486.00	\N	f	0.00	cmu010we800orue6s2zud47ln
cmu010we900ovue6s2p3xw6ry	cmtv96wxe000wue7w59ewld1m	Cash on Hand	ASSET	t	2026-09-13 16:26:41.794	2026-09-23 17:01:44.289	1100	788.00	\N	f	0.00	cmu010we400olue6svqptuqp9
cmu010wef00p7ue6snc110y3p	cmtv96wxe000wue7w59ewld1m	General Donations & Offerings	INCOME	t	2026-09-13 16:26:41.799	2026-09-23 17:01:44.29	4300	234.00	\N	f	0.00	cmu010we800orue6s2zud47ln
cmu010wee00p5ue6sy03fao75	cmtv96wxe000wue7w59ewld1m	Friday / Juma Collections	INCOME	t	2026-09-13 16:26:41.798	2026-09-19 09:32:56.972	4200	1000.00	\N	f	0.00	cmu010we800orue6s2zud47ln
cmu010weh00pdue6sasza9qr2	cmtv96wxe000wue7w59ewld1m	Electricity & Utility Bills	EXPENSE	t	2026-09-13 16:26:41.801	2026-09-23 06:55:46.724	5200	312.00	\N	f	0.00	cmu010we900otue6syf6iw8at
cmudu4a0q0asdue6tyy6f2j7p	cmtv96wxe000wue7w59ewld1m	Madrassa	INCOME	f	2026-09-23 08:22:08.57	2026-09-23 17:00:28.845	\N	0.00	\N	f	0.00	\N
\.


--
-- Data for Name: finance_bank_accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_bank_accounts (id, "tenantId", "accountName", "bankName", branch, "accountNumber", ifsc, "accountType", "openingBalance", "currentBalance", "chartAccountId", "isActive", "createdAt", "updatedAt") FROM stdin;
cmu010wek00plue6ssznb294d	cmtv96wxe000wue7w59ewld1m	Main Operating Account	Federal Bank	Wayanad Main Branch	102938475612	FDRL0001234	SAVINGS	50000.00	50000.00	cmu010wea00oxue6sflo0fb89	f	2026-09-13 16:26:41.804	2026-09-13 17:36:28.716
cmu86ykok048cue9thbk8hh0h	cmtv96wxe000wue7w59ewld1m	Mahal	sbi	\N	12243254	\N	SAVINGS	0.00	0.00	\N	t	2026-09-19 09:35:00.404	2026-09-19 09:35:00.404
cmu86z8b704l8ue9tpe0qexgk	cmtv96wxe000wue7w59ewld1m	HHGG	HDFC	\N	907978	\N	SAVINGS	0.00	0.00	\N	t	2026-09-19 09:35:31.028	2026-09-19 09:35:31.028
\.


--
-- Data for Name: finance_collection_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_collection_categories (id, "tenantId", name, code, description, "incomeAccountId", "isActive", "displayOrder", "createdAt", "updatedAt", "defaultAmount", "isRecurring", "recurrenceFrequency", "targetDivisionIds", "targetEconomicCategory", "targetType", "formConfig", "isSubscription", "targetAmount") FROM stdin;
cmu010weq00pzue6ske5w3285	cmtv96wxe000wue7w59ewld1m	Program Collection	PROGRAM	\N	cmu010wef00p7ue6snc110y3p	t	7	2026-09-13 16:26:41.811	2026-09-13 16:26:41.811	\N	f	MONTHLY	{}	ALL	ALL_FAMILIES	\N	f	\N
cmu010wel00pnue6sz27v7wlr	cmtv96wxe000wue7w59ewld1m	Monthly Mahallu Collection	MONTHLY	\N	cmu010wed00p3ue6s0x2wpas1	t	1	2026-09-13 16:26:41.806	2026-09-14 10:06:53.498	\N	t	MONTHLY	{cmtzny68j0007uekqyf0b6ral}	ALL	SPECIFIC_DIVISIONS	\N	f	\N
cmu010wen00ppue6sj7dhw8lg	cmtv96wxe000wue7w59ewld1m	Friday / Juma Collection	FRIDAY	\N	cmu010wee00p5ue6sy03fao75	t	2	2026-09-13 16:26:41.807	2026-09-14 12:14:54.563	\N	f	MONTHLY	{}	ALL	GENERAL	{"enableDate": true, "enableNotes": true, "enableAmount": true, "enableFamily": false, "enableMember": false, "requireAmount": true, "requireFamily": false, "requireMember": false, "enableAttachment": false, "enablePaymentMethod": true}	f	\N
\.


--
-- Data for Name: finance_collections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_collections (id, "tenantId", "collectionNumber", type, "categoryId", "familyId", "memberId", "donorName", "donorPhone", "donorAddress", "collectorName", amount, "paymentMethodId", "paymentMethod", "bankAccountId", date, reference, description, notes, status, "receiptId", "journalEntryId", "createdAt", "updatedAt", "attachmentUrl", "customFields") FROM stdin;
cmu03ssm9000eueadc4hi3h66	cmtv96wxe000wue7w59ewld1m	COL-00001	MONTHLY	cmu010wel00pnue6sz27v7wlr	cmtxuryp3000duetvd4ba24fs	\N	Al Baraka House	\N	\N	\N	2342.00	\N	Cash	\N	2026-09-13 00:00:00	\N	\N	 [CANCELLED: ,]	CANCELLED	cmu03sslo0005ueadu47n9zpe	cmu03sslw0009ueadlkwyr675	2026-09-13 17:44:22.497	2026-09-13 18:07:19.122	\N	\N
cmu117qsx004yue1wjqdc8a08	cmtv96wxe000wue7w59ewld1m	COL-00003	MONTHLY	cmu010wel00pnue6sz27v7wlr	cmtxuryp3000duetvd4ba24fs	\N	Al Baraka House Family	\N	\N	\N	100.00	\N	Cash	\N	2026-09-14 00:00:00	\N	\N	\N	COMPLETED	cmu117qs9004pue1wdffyfxln	cmu117qsj004tue1wz7d5ubov	2026-09-14 09:19:47.313	2026-09-14 09:19:47.313	\N	\N
cmu86vxfx03w0ue9tjvokzjhq	cmtv96wxe000wue7w59ewld1m	COL-00004	DONATION	cmu010wen00ppue6sj7dhw8lg	\N	\N	Friday / Juma Collection	\N	\N	\N	1000.00	\N	Cash	\N	2026-09-19 00:00:00	\N	Friday / Juma Collection (September 2026)	\N	COMPLETED	cmu86vxfc03vrue9tguexkn10	cmu86vxfl03vvue9t5ou83ihr	2026-09-19 09:32:56.973	2026-09-19 09:32:56.973	\N	null
cmu03tsd6000euebnupd1kj8r	cmtv96wxe000wue7w59ewld1m	COL-00002	MONTHLY	cmu010weq00pzue6ske5w3285	cmtxuryp3000duetvd4ba24fs	cmtxus7jp000puetvfqm7pjcw	Khadeeja CH	+919812345602	\N	\N	234.00	\N	Cash	\N	2026-09-13 00:00:00	\N	\N	 [CANCELLED: ,]	CANCELLED	cmu03tsco0005uebn4v2903ix	cmu03tscw0009uebnki1jrena	2026-09-13 17:45:08.827	2026-09-23 17:01:44.293	\N	\N
\.


--
-- Data for Name: finance_dues; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_dues (id, "tenantId", "memberId", title, amount, "dueDate", status, "paidVoucherId", "createdAt", "updatedAt", "categoryId", "familyId", "outstandingAmount", "paidAmount", period) FROM stdin;
\.


--
-- Data for Name: finance_expense_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_expense_categories (id, "tenantId", name, code, description, "expenseAccountId", "isActive", "displayOrder", "createdAt", "updatedAt") FROM stdin;
cmu010wer00q3ue6sdudf6vod	cmtv96wxe000wue7w59ewld1m	Staff Salaries	SALARY	\N	cmu010weg00pbue6s9t99yt7y	t	1	2026-09-13 16:26:41.812	2026-09-13 16:26:41.812
cmu010wet00q5ue6sdmtagq2c	cmtv96wxe000wue7w59ewld1m	Electricity Bills	ELECTRICITY	\N	cmu010weh00pdue6sasza9qr2	t	2	2026-09-13 16:26:41.814	2026-09-13 16:26:41.814
cmu010weu00q7ue6sfywztxus	cmtv96wxe000wue7w59ewld1m	Water & Utilities	WATER	\N	cmu010weh00pdue6sasza9qr2	t	3	2026-09-13 16:26:41.815	2026-09-13 16:26:41.815
cmu010wew00qbue6s2u1vpvhb	cmtv96wxe000wue7w59ewld1m	Program & Events	PROGRAM	\N	cmu010wei00phue6s3dy1bgro	t	5	2026-09-13 16:26:41.816	2026-09-13 16:26:41.816
cmu010wew00qdue6sguq6yctd	cmtv96wxe000wue7w59ewld1m	Office Stationery & Supplies	OFFICE	\N	cmu010wej00pjue6shugxm1lx	f	6	2026-09-13 16:26:41.817	2026-09-13 17:42:06.777
cmu010wev00q9ue6sfzqmdaxz	cmtv96wxe000wue7w59ewld1m	Masjid Maintenance	MAINTENANCE	\N	cmu010weh00pfue6syyk1yt72	f	4	2026-09-13 16:26:41.815	2026-09-13 17:42:09.952
\.


--
-- Data for Name: finance_financial_years; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_financial_years (id, "tenantId", name, "startDate", "endDate", status, "isCurrent", "closedAt", "closedBy", "createdAt", "updatedAt") FROM stdin;
cmu010wdp00o9ue6sp41ip2h6	cmtv96wxe000wue7w59ewld1m	FY 2026-27	2026-04-01 00:00:00	2027-03-31 23:59:59	OPEN	t	\N	\N	2026-09-13 16:26:41.773	2026-09-13 16:26:41.773
\.


--
-- Data for Name: finance_interest_free_accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_interest_free_accounts (id, "tenantId", "accountNumber", "holderName", "holderType", "memberId", "familyId", phone, balance, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: finance_interest_free_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_interest_free_transactions (id, "tenantId", "accountId", type, amount, date, reference, description, "balanceAfter", "receiptNumber", "createdAt") FROM stdin;
\.


--
-- Data for Name: finance_journal_entries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_journal_entries (id, "tenantId", "entryNumber", "financialYearId", date, reference, description, "sourceType", "sourceId", status, "totalDebit", "totalCredit", "postedAt", "postedBy", "createdAt", "updatedAt") FROM stdin;
cmu03wl2j0010uebnhy6w7kb0	cmtv96wxe000wue7w59ewld1m	JRN-00003	cmu010wdp00o9ue6sp41ip2h6	2026-09-13 17:47:19.338	VCH-00001	Disbursement to wqed	EXPENSE	cmu03vru4000quebnz48r1hwb	POSTED	212.00	212.00	2026-09-13 17:47:19.338	cmtv96x5n0057ue7wcl3a27w0	2026-09-13 17:47:19.339	2026-09-13 17:47:19.339
cmu03sslw0009ueadlkwyr675	cmtv96wxe000wue7w59ewld1m	JRN-00001	cmu010wdp00o9ue6sp41ip2h6	2026-09-13 00:00:00	RCP-00001	Monthly Mahallu Collection from Family: Al Baraka House [CANCELLED: ,]	COLLECTION	\N	CANCELLED	2342.00	2342.00	2026-09-13 17:44:22.484	cmtv96x5n0057ue7wcl3a27w0	2026-09-13 17:44:22.484	2026-09-13 18:07:19.129
cmu117qsj004tue1wz7d5ubov	cmtv96wxe000wue7w59ewld1m	JRN-00004	cmu010wdp00o9ue6sp41ip2h6	2026-09-14 00:00:00	RCP-00003	Monthly Mahallu Collection from Family: Al Baraka House Family	COLLECTION	\N	POSTED	100.00	100.00	2026-09-14 09:19:47.298	cmtv96x5n0057ue7wcl3a27w0	2026-09-14 09:19:47.299	2026-09-14 09:19:47.299
cmu86vxfl03vvue9t5ou83ihr	cmtv96wxe000wue7w59ewld1m	JRN-00006	cmu010wdp00o9ue6sp41ip2h6	2026-09-19 00:00:00	RCP-00004	Friday / Juma Collection from Friday / Juma Collection	COLLECTION	\N	POSTED	1000.00	1000.00	2026-09-19 09:32:56.96	cmtv96x5n0057ue7wcl3a27w0	2026-09-19 09:32:56.961	2026-09-19 09:32:56.961
cmu88djsw08euue9tuor63hzu	cmtv96wxe000wue7w59ewld1m	JRN-00007	cmu010wdp00o9ue6sp41ip2h6	2026-09-19 10:14:38.72	VCH-00004	Disbursement to kjk	EXPENSE	cmu88dbc907zkue9t47ysl3xb	POSTED	100.00	100.00	2026-09-19 10:14:38.72	cmtv96x5n0057ue7wcl3a27w0	2026-09-19 10:14:38.721	2026-09-19 10:14:38.721
cmu03tscw0009uebnki1jrena	cmtv96wxe000wue7w59ewld1m	JRN-00002	cmu010wdp00o9ue6sp41ip2h6	2026-09-13 00:00:00	RCP-00002	Monthly Mahallu Collection from Khadeeja CH [CANCELLED: ,]	COLLECTION	\N	CANCELLED	234.00	234.00	2026-09-13 17:45:08.816	cmtv96x5n0057ue7wcl3a27w0	2026-09-13 17:45:08.817	2026-09-23 17:01:44.285
\.


--
-- Data for Name: finance_journal_entry_lines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_journal_entry_lines (id, "journalEntryId", "accountId", debit, credit, description, "createdAt") FROM stdin;
cmu03sslw000bueadqjk86pih	cmu03sslw0009ueadlkwyr675	cmu010we900ovue6s2p3xw6ry	2342.00	0.00	Received via Cash	2026-09-13 17:44:22.484
cmu03sslw000cueadcxhszgp6	cmu03sslw0009ueadlkwyr675	cmu010wed00p3ue6s0x2wpas1	0.00	2342.00	Monthly Mahallu Collection	2026-09-13 17:44:22.484
cmu03wl2j0012uebnotll0pv4	cmu03wl2j0010uebnhy6w7kb0	cmu010weh00pdue6sasza9qr2	212.00	0.00	\N	2026-09-13 17:47:19.339
cmu03wl2j0013uebnq25gkkna	cmu03wl2j0010uebnhy6w7kb0	cmu010we900ovue6s2p3xw6ry	0.00	212.00	Paid via Cash	2026-09-13 17:47:19.339
cmu117qsj004vue1wqhnndpfa	cmu117qsj004tue1wz7d5ubov	cmu010we900ovue6s2p3xw6ry	100.00	0.00	Received via Cash	2026-09-14 09:19:47.299
cmu117qsj004wue1wirtr4aka	cmu117qsj004tue1wz7d5ubov	cmu010wed00p3ue6s0x2wpas1	0.00	100.00	Monthly Mahallu Collection	2026-09-14 09:19:47.299
cmu86vxfl03vxue9tsyjupfw9	cmu86vxfl03vvue9t5ou83ihr	cmu010we900ovue6s2p3xw6ry	1000.00	0.00	Received via Cash	2026-09-19 09:32:56.961
cmu86vxfl03vyue9tqmzurmnx	cmu86vxfl03vvue9t5ou83ihr	cmu010wee00p5ue6sy03fao75	0.00	1000.00	Friday / Juma Collection	2026-09-19 09:32:56.961
cmu88djsw08ewue9tmuqtqab7	cmu88djsw08euue9tuor63hzu	cmu010weh00pdue6sasza9qr2	100.00	0.00	\N	2026-09-19 10:14:38.721
cmu88djsw08exue9ttcgdcdc4	cmu88djsw08euue9tuor63hzu	cmu010we900ovue6s2p3xw6ry	0.00	100.00	Paid via Cash	2026-09-19 10:14:38.721
cmuecohct0m1fue6t5ktp5log	cmu03tscw0009uebnki1jrena	cmu010we900ovue6s2p3xw6ry	234.00	0.00	Collected via Cash	2026-09-23 17:01:44.285
cmuecohct0m1gue6tn7jh757l	cmu03tscw0009uebnki1jrena	cmu010wef00p7ue6snc110y3p	0.00	234.00	\N	2026-09-23 17:01:44.285
\.


--
-- Data for Name: finance_payment_methods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_payment_methods (id, "tenantId", name, code, type, "isActive", "requiresReference", "requiresChequeNumber", "requiresBankDetails", "displayOrder", "createdAt", "updatedAt") FROM stdin;
cmu010wdu00obue6suufd8sus	cmtv96wxe000wue7w59ewld1m	Cash	CASH	CASH	t	f	f	f	1	2026-09-13 16:26:41.778	2026-09-13 16:26:41.778
cmu010wdy00odue6s8u6jxr3s	cmtv96wxe000wue7w59ewld1m	UPI / QR Code	UPI	UPI	t	t	f	f	2	2026-09-13 16:26:41.782	2026-09-13 16:26:41.782
cmu010wdz00ofue6sjizz6kp7	cmtv96wxe000wue7w59ewld1m	Bank Transfer (NEFT/RTGS/IMPS)	BANK_TRANSFER	BANK_TRANSFER	t	t	f	t	3	2026-09-13 16:26:41.784	2026-09-13 16:26:41.784
cmu010we100ohue6si1vyv3xe	cmtv96wxe000wue7w59ewld1m	Cheque	CHEQUE	CHEQUE	t	t	t	f	4	2026-09-13 16:26:41.785	2026-09-13 16:26:41.785
cmu010we300ojue6sbqgsq5uu	cmtv96wxe000wue7w59ewld1m	Other	OTHER	OTHER	f	f	f	f	5	2026-09-13 16:26:41.787	2026-09-19 10:27:32.074
\.


--
-- Data for Name: finance_receipts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_receipts (id, "tenantId", "receiptNumber", "voucherId", "dueId", date, "receivedFrom", "categoryName", amount, "paymentMethod", reference, description, "recordedBy", status, "cancelledAt", "cancelledReason", "cancelledBy", "createdAt", "updatedAt") FROM stdin;
cmu03sslo0005ueadu47n9zpe	cmtv96wxe000wue7w59ewld1m	RCP-00001	\N	\N	2026-09-13 00:00:00	Family: Al Baraka House	Monthly Mahallu Collection	2342.00	Cash	\N	\N	cmtv96x5n0057ue7wcl3a27w0	CANCELLED	2026-09-13 18:07:19.123	,	cmtv96x5n0057ue7wcl3a27w0	2026-09-13 17:44:22.477	2026-09-13 18:07:19.124
cmu117qs9004pue1wdffyfxln	cmtv96wxe000wue7w59ewld1m	RCP-00003	\N	\N	2026-09-14 00:00:00	Family: Al Baraka House Family	Monthly Mahallu Collection	100.00	Cash	\N	\N	cmtv96x5n0057ue7wcl3a27w0	ACTIVE	\N	\N	\N	2026-09-14 09:19:47.29	2026-09-14 09:19:47.29
cmu86vxfc03vrue9tguexkn10	cmtv96wxe000wue7w59ewld1m	RCP-00004	\N	\N	2026-09-19 00:00:00	Friday / Juma Collection	Friday / Juma Collection	1000.00	Cash	\N	Friday / Juma Collection (September 2026)	cmtv96x5n0057ue7wcl3a27w0	ACTIVE	\N	\N	\N	2026-09-19 09:32:56.952	2026-09-19 09:32:56.952
cmu03tsco0005uebn4v2903ix	cmtv96wxe000wue7w59ewld1m	RCP-00002	\N	\N	2026-09-13 00:00:00	Khadeeja CH	Monthly Mahallu Collection	234.00	Cash	\N	\N	cmtv96x5n0057ue7wcl3a27w0	CANCELLED	2026-09-13 18:06:56.111	,	cmtv96x5n0057ue7wcl3a27w0	2026-09-13 17:45:08.809	2026-09-23 17:01:44.291
\.


--
-- Data for Name: finance_salary_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_salary_records (id, "tenantId", "staffName", month, amount, status, "paidVoucherId", "createdAt", "updatedAt", allowances, "approvalStatus", "basicSalary", deductions, "netSalary", "paymentDate", "paymentMethod", reference) FROM stdin;
\.


--
-- Data for Name: finance_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_settings (id, "tenantId", currency, "financialYearStartMonth", "financialYearStartDay", "defaultCollectionDescription", "defaultPaymentMethodId", "defaultCashAccountId", "defaultBankAccountId", "receiptPrefix", "receiptStartNumber", "receiptDigits", "voucherPrefix", "voucherStartNumber", "voucherDigits", "defaultSalaryExpenseAccountId", "defaultCollectionIncomeAccountId", "defaultDonationIncomeAccountId", "defaultGeneralExpenseAccountId", "createdAt", "updatedAt") FROM stdin;
cmu010wex00qfue6s4iuyx1sq	cmtv96wxe000wue7w59ewld1m	INR	4	1	\N	\N	cmu010we900ovue6s2p3xw6ry	cmu010wea00oxue6sflo0fb89	RCP	1	6	VCH	1	6	cmu010weg00pbue6s9t99yt7y	cmu010wed00p3ue6s0x2wpas1	cmu010wef00p7ue6snc110y3p	cmu010wej00pjue6shugxm1lx	2026-09-13 16:26:41.817	2026-09-13 16:26:41.817
\.


--
-- Data for Name: finance_tax_legal_filings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_tax_legal_filings (id, "tenantId", title, "filingType", period, "dueDate", amount, status, "paymentDate", reference, notes, "documentUrl", "createdAt", "updatedAt") FROM stdin;
cmu04g0tu0007ueqhfk89w9oz	cmtv96wxe000wue7w59ewld1m	test	TAX	\N	2026-09-14 00:00:00	\N	PENDING	\N	\N	\N	\N	2026-09-13 18:02:26.226	2026-09-13 18:02:26.226
\.


--
-- Data for Name: finance_vouchers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_vouchers (id, "tenantId", "voucherNumber", type, "accountId", "memberId", date, amount, "partyName", "paymentMethod", description, "createdAt", "updatedAt", "eventId", "approvedAt", "approvedBy", "attachmentUrl", "bankAccountId", "expenseCategoryId", "journalEntryId", notes, "paidAt", "payeeName", "receiptId", reference, status, "voucherSubtype") FROM stdin;
cmu03vru4000quebnz48r1hwb	cmtv96wxe000wue7w59ewld1m	VCH-00001	PAYMENT	cmu010weh00pdue6sasza9qr2	\N	2026-09-13 00:00:00	212.00	\N	Cash	\N	2026-09-13 17:46:41.452	2026-09-13 17:47:19.351	\N	2026-09-13 17:47:11.625	cmtv96x5n0057ue7wcl3a27w0	\N	\N	cmu010wet00q5ue6sdmtagq2c	cmu03wl2j0010uebnhy6w7kb0	\N	2026-09-13 17:47:19.35	wqed	\N	\N	PAID	EXPENSE
cmu03x3rc0019uebnle3gz6fz	cmtv96wxe000wue7w59ewld1m	VCH-00002	PAYMENT	cmu010weg00pbue6s9t99yt7y	\N	2026-09-13 00:00:00	2134.00	\N	Cash	\N	2026-09-13 17:47:43.561	2026-09-13 18:01:24.307	\N	\N	\N	\N	\N	cmu010wer00q3ue6sdudf6vod	\N	 [CANCELLED: nothung]	\N	100	\N	\N	CANCELLED	EXPENSE
cmu88dbc907zkue9t47ysl3xb	cmtv96wxe000wue7w59ewld1m	VCH-00004	PAYMENT	cmu010weh00pdue6sasza9qr2	\N	2026-09-19 00:00:00	100.00	\N	Cash	\N	2026-09-19 10:14:27.753	2026-09-19 10:14:38.732	\N	2026-09-19 10:14:34.701	cmtv96x5n0057ue7wcl3a27w0	\N	\N	cmu010wet00q5ue6sdmtagq2c	cmu88djsw08euue9tuor63hzu	\N	2026-09-19 10:14:38.731	kjk	\N	\N	PAID	EXPENSE
\.


--
-- Data for Name: form_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.form_assignments (id, "templateId", "tenantId", "createdAt") FROM stdin;
\.


--
-- Data for Name: form_fields; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.form_fields (id, "versionId", key, label, type, description, required, "order", options, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: form_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.form_templates (id, key, name, description, category, "isPlatformWide", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: form_versions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.form_versions (id, "templateId", version, status, "publishedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: grave_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grave_records (id, "tenantId", "deathRecordId", "deceasedName", "plotNumber", section, "burialDate", remarks, "createdAt", "updatedAt") FROM stdin;
cmu04ipti000tueqhkn5rhl2e	cmtv96wxe000wue7w59ewld1m	\N	lkn	1	\N	2026-09-08 00:00:00	\N	2026-09-13 18:04:31.926	2026-09-13 18:04:31.926
\.


--
-- Data for Name: houses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.houses (id, "tenantId", "divisionId", "displayNumber", address, "isActive", "createdAt", "updatedAt", name, notes) FROM stdin;
cmtzgrh9q000buex1xszxwdtw	cmtv96wxe000wue7w59ewld1m	\N	VERIFY-1	\N	f	2026-09-13 06:59:29.967	2026-09-13 07:00:24.674	Verification House	\N
cmtzofwuh000huev7ou8zfy2m	cmtv96wxe000wue7w59ewld1m	cmtzny68j0007uekqyf0b6ral	KBD04	House: Noorul Huda, Mahall House No: KBD04, Ward 4, Kakkad Thazham	t	2026-09-13 10:34:27.209	2026-09-14 08:15:49.128	Noorul Huda	\N
cmu0z10k3003juevciq5e67sc	cmtv96wxe000wue7w59ewld1m	\N	KBD10	House: Koyathoduka, Mahall House No: KBD10, Municipal Door No: 101, Kambalakkad, PO: Kambalakkad, Kerala	t	2026-09-14 08:18:34.132	2026-09-14 08:19:11.053	Koyathoduka	\N
cmu148yx20045uejctwxujxgy	cmtv96wxe000wue7w59ewld1m	\N	test House	House: test	t	2026-09-14 10:44:43.335	2026-09-14 10:44:43.335	test	\N
cmtzofdmc0007uev7ttqboaqn	cmtv96wxe000wue7w59ewld1m	cmtzny68j0007uekqyf0b6ral	KBD02	House: Al Baraka House, Mahall House No: KBD02, 12 Kadalundi Road	t	2026-09-13 10:34:02.293	2026-09-14 10:44:57.768	Al Baraka House	\N
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.invoices (id, "tenantId", "subscriptionId", "amountMinor", currency, status, description, "issuedAt", "dueAt", "paidAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: madrassa_enrollments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.madrassa_enrollments (id, "tenantId", "studentName", "studentMemberId", "guardianName", "guardianPhone", "className", "admissionDate", "isActive", remarks, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: mahallu_release_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mahallu_release_records (id, "tenantId", "memberId", "memberName", "familyId", "releaseDate", reason, "destinationMahallu", remarks, "certificateNumber", "certificateIssuedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: marriage_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.marriage_records (id, "tenantId", "groomName", "groomFatherName", "groomMemberId", "brideName", "brideFatherName", "brideMemberId", "marriageDate", place, "officiantName", "witness1Name", "witness2Name", "mahrDetails", remarks, "certificateNumber", "certificateIssuedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: member_health_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.member_health_profiles (id, "tenantId", "memberId", "createdAt", "updatedAt", status, "hasDisability", "disabilityType", "disabilityPercentage", "disabilityCertificate", "disabilityCertificateNo", "hasChronicIllness", "chronicConditions", "chronicDetails", "treatmentRequired", "regularMedicationRequired", "requiresMentalHealthSupport", "mentalHealthSupportType", "requiresAssistance", "assistanceTypes", "primaryCaregiverName", "caregiverRelationship", "emergencyContactName", "emergencyContactPhone", "requiresCommunitySupport", "supportCategory", "supportStatus", "supportNotes", "lastSupportDate") FROM stdin;
cmu0yaxd2003juejvp0vg1olj	cmtv96wxe000wue7w59ewld1m	cmtym0q780049uetpt4mjpb20	2026-09-14 07:58:16.934	2026-09-14 07:58:43.822	HAS_CONDITION	t	VISUAL	\N	f	\N	t	{"Hypertension (BP)"}	\N	f	f	f	\N	f	{}	\N	\N	\N	\N	f	\N	ACTIVE	\N	\N
cmu0z10le003vuevcebamoah7	cmtv96wxe000wue7w59ewld1m	cmu0z10ld003tuevc761wfg9n	2026-09-14 08:18:34.178	2026-09-14 08:18:34.178	HAS_CONDITION	t	VISUAL	\N	f	\N	t	{"Hypertension (BP)"}	\N	f	t	f	\N	f	{}	\N	\N	\N	\N	f	\N	ACTIVE	\N	\N
cmu0zylii003rue1w4cegi8dk	cmtv96wxe000wue7w59ewld1m	cmtvmnzc50009uexshpunohwg	2026-09-14 08:44:40.938	2026-09-14 08:44:40.938	NO_KNOWN_CONDITION	f	\N	\N	f	\N	f	{}	\N	f	f	f	\N	f	{}	\N	\N	\N	\N	f	\N	ACTIVE	\N	\N
cmu1074ln0047ue1wil1p36lm	cmtv96wxe000wue7w59ewld1m	cmtxus7jp000puetvfqm7pjcw	2026-09-14 08:51:18.923	2026-09-14 08:51:18.923	NO_KNOWN_CONDITION	f	\N	\N	f	\N	f	{}	\N	f	f	f	\N	f	{}	\N	\N	\N	\N	f	\N	ACTIVE	\N	\N
\.


--
-- Data for Name: member_otps; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.member_otps (id, "tenantId", "memberId", "codeHash", "expiresAt", attempts, "consumedAt", "createdAt") FROM stdin;
cmtvmohrt000duexs0wwlxs6c	cmtv96wxe000wue7w59ewld1m	cmtvmnzc50009uexshpunohwg	378cba194c247404d389724959bafc9bb2d59f133ce24ddcf80f7e316f2e18a5	2026-09-10 14:39:03.64	0	2026-09-10 14:34:18.075	2026-09-10 14:34:03.641
cmtvmp9jk000juexs9lhwj1i8	cmtv96wxe000wue7w59ewld1m	cmtvmnzc50009uexshpunohwg	541ae186a6acbb99c28d418cc476ed46027d3d37f61c75f94bb4af178f8bb945	2026-09-10 14:39:39.632	0	2026-09-10 14:34:54.358	2026-09-10 14:34:39.632
cmtyoci5p006cuenj3nos5oyp	cmtv96wxe000wue7w59ewld1m	cmtxus7k7000tuetvqqxr667b	56ca1b65a172d40ccc369e0834969ed42dbd5b23c802838aca7b15c16c593472	2026-09-12 17:49:02.028	0	\N	2026-09-12 17:44:02.029
cmtyod7b8006guenj7969gdze	cmtv96wxe000wue7w59ewld1m	cmtxus7k7000tuetvqqxr667b	2e3e24204314756684937b440178f7e9aabab9e555cb194feeb51e4b8d91ff89	2026-09-12 17:49:34.627	0	\N	2026-09-12 17:44:34.628
cmtyoe1tf006kuenjhj81axez	cmtv96wxe000wue7w59ewld1m	cmtxus7k7000tuetvqqxr667b	3c6769641eac7eebc7491fbcf2f266ff72c28f5ebcfc4dafc029da84a9ab4de1	2026-09-12 17:50:14.163	0	\N	2026-09-12 17:45:14.164
cmtzdsxbe000vuemj3g8r4tuj	cmtv96wxe000wue7w59ewld1m	cmtxus7j5000luetve3fysn5s	edbb882ffe9627f63bc3cd4bf912d7dc13f7c6125b3546265cab9392c0c46da7	2026-09-13 05:41:38.57	0	2026-09-13 05:36:49.493	2026-09-13 05:36:38.571
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.members (id, "tenantId", "fullName", email, phone, address, "isActive", "createdAt", "updatedAt", "familyId", "bloodGroup", "dateOfBirth", "expatriateContact", "expatriateCountry", "expatriateOccupation", gender, "guardianName", "guardianPhone", "idNumber", "isExpatriate", "isYatheem", "maritalStatus", "movementDate", "movementNotes", "movementStatus", occupation, "relationToHead", "educationLevel", "educationDetails", institution, "employmentStatus", "jobTitle", "employerOrBusiness", skills, "isJobSeeker", "educationHistory") FROM stdin;
cmtxus7kn000xuetvlm50a67d	cmtv96wxe000wue7w59ewld1m	Sainaba Kunnath	saina@example.com	\N	\N	t	2026-09-12 03:56:26.328	2026-09-12 03:56:26.328	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	\N	\N	\N	\N	\N	\N	\N	{}	f	\N
cmtym0q780049uetpt4mjpb20-mahalle	cmtyh4tr8002yuebkqxkrgukw	test	\N	\N	\N	t	2026-09-13 16:57:11.434	2026-09-13 16:57:11.434	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	\N	\N	\N	\N	\N	\N	\N	{}	f	\N
cmtvmnzc50009uexshpunohwg-mahalle	cmtyh4tr8002yuebkqxkrgukw	ahmed	\N	+919876543210	\N	t	2026-09-13 16:57:11.439	2026-09-13 16:57:11.439	cmtvmdluo0001uev04h2hb39t-mahalle	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	\N	\N	\N	\N	\N	\N	\N	{}	f	\N
cmtxus7j5000luetve3fysn5s-mahalle	cmtyh4tr8002yuebkqxkrgukw	Muhammed Basheer	\N	+919812345601	\N	t	2026-09-13 16:57:11.442	2026-09-13 16:57:11.442	cmtxuryp3000duetvd4ba24fs-mahalle	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	\N	\N	\N	\N	\N	\N	\N	{}	f	\N
cmtxus7jp000puetvfqm7pjcw-mahalle	cmtyh4tr8002yuebkqxkrgukw	Khadeeja CH	\N	+919812345602	\N	t	2026-09-13 16:57:11.444	2026-09-13 16:57:11.444	cmtxuryp3000duetvd4ba24fs-mahalle	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	\N	\N	\N	\N	\N	\N	\N	{}	f	\N
cmtxus7kn000xuetvlm50a67d-mahalle	cmtyh4tr8002yuebkqxkrgukw	Sainaba Kunnath	\N	\N	\N	t	2026-09-13 16:57:11.447	2026-09-13 16:57:11.447	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	\N	\N	\N	\N	\N	\N	\N	{}	f	\N
cmtxus7k7000tuetvqqxr667b-mahalle	cmtyh4tr8002yuebkqxkrgukw	Anas Muhammed	\N	+919812345603	\N	t	2026-09-13 16:57:11.449	2026-09-13 16:57:11.449	cmtxurypj000huetvuj18pre2-mahalle	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	\N	\N	\N	\N	\N	\N	\N	{}	f	\N
cmtym0q780049uetpt4mjpb20	cmtv96wxe000wue7w59ewld1m	test	\N	\N	Kerala, Kerala	t	2026-09-12 16:38:53.348	2026-09-14 07:58:43.822	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	\N	\N	\N	RESIDENT	STUDENT	\N	HIGHER_SECONDARY	\N	\N	STUDENT	STUDENT	\N	{}	f	\N
cmtxus7k7000tuetvqqxr667b	cmtv96wxe000wue7w59ewld1m	Anas Muhammed	\N	+919812345603	\N	t	2026-09-12 03:56:26.311	2026-09-14 08:15:49.177	cmtxurypj000huetvuj18pre2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	business	HEAD	\N	\N	\N	\N	\N	\N	{}	f	\N
cmu0z10ld003tuevc761wfg9n	cmtv96wxe000wue7w59ewld1m	Jaseel	jazeelwayanad@gmail.com	+919207483478	House: Koyathoduka, Mahall House No: KBD10, Municipal Door No: 101, Kambalakkad, PO: Kambalakkad, Kerala	t	2026-09-14 08:18:34.178	2026-09-14 08:18:34.178	cmu0z10kt003puevcm46p3ge0	O_POSITIVE	2004-06-14 00:00:00	\N	\N	\N	MALE	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	HEAD	HIGHER_SECONDARY	\N	\N	\N	\N	jazeelwayanad.me	{}	t	\N
cmtvmnzc50009uexshpunohwg	cmtv96wxe000wue7w59ewld1m	ahmed	\N	+919876543210	Kerala, Kerala, Kerala, Kerala	t	2026-09-10 14:33:39.749	2026-09-14 08:44:40.938	cmtvmdluo0001uev04h2hb39t	\N	2026-09-14 00:00:00	\N	\N	\N	\N	\N	\N	\N	t	f	\N	\N	\N	RESIDENT	\N	SON	\N	\N	\N	\N	\N	\N	{}	f	\N
cmtxus7j5000luetve3fysn5s	cmtv96wxe000wue7w59ewld1m	Muhammed Basheer	basheer@example.com	+919812345601	\N	t	2026-09-12 03:56:26.273	2026-09-14 08:51:05.436	cmtxuryp3000duetvd4ba24fs	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	HEAD	\N	\N	\N	\N	\N	\N	{}	f	\N
cmtxus7jp000puetvfqm7pjcw	cmtv96wxe000wue7w59ewld1m	Khadeeja CH	\N	+919812345602	Kerala	t	2026-09-12 03:56:26.293	2026-09-14 08:51:18.923	cmtxuryp3000duetvd4ba24fs	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	RESIDENT	\N	SPOUSE	\N	\N	\N	\N	\N	\N	{}	f	\N
\.


--
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification_settings (id, "tenantId", "notifyOnNewServiceRequest", "notifyOnNewDue", "eventReminderDaysBefore", "smsEnabled", "smsProviderName", "smsSenderId", "createdAt", "updatedAt") FROM stdin;
cmtynei1s000zueg4w77ld09l	cmtv96wxe000wue7w59ewld1m	t	t	\N	f	\N	\N	2026-09-12 17:17:35.585	2026-09-12 17:17:35.585
\.


--
-- Data for Name: onboarding_drafts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.onboarding_drafts (id, "userId", status, "currentStep", data, "createdAt", "updatedAt") FROM stdin;
cmtzilvte000bueedth0e4erb	cmtv96wx6000tue7wfg2rfzuu	DRAFT	mahalle	{}	2026-09-13 07:51:08.114	2026-09-13 07:51:08.114
cmu4g44ds004euezjfdip2fne	cmu4g44d30048uezjgje091gp	IN_PROGRESS	mahalle	{}	2026-09-16 18:40:11.056	2026-09-16 18:40:11.059
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, "tenantId", "invoiceId", "amountMinor", currency, method, reference, "recordedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, key, category, "createdAt") FROM stdin;
cmtv96wp70000ue7wkf5k9yvn	members.view	members	2026-09-10 08:16:28.171
cmtv96wpc0001ue7wx3gphs9i	members.create	members	2026-09-10 08:16:28.177
cmtv96wpe0002ue7wpdzandl9	members.update	members	2026-09-10 08:16:28.179
cmtv96wpg0003ue7wdqgpa1xy	members.delete	members	2026-09-10 08:16:28.181
cmtv96wpi0004ue7wn0bxeer2	families.view	families	2026-09-10 08:16:28.183
cmtv96wpk0005ue7wmkpnvtoj	families.create	families	2026-09-10 08:16:28.185
cmtv96wpm0006ue7wcrsafo9h	families.update	families	2026-09-10 08:16:28.186
cmtv96wpo0007ue7wxc8kufp6	families.delete	families	2026-09-10 08:16:28.188
cmtv96wpq0008ue7wscak5zoz	events.view	events	2026-09-10 08:16:28.19
cmtv96wps0009ue7w3tpm099m	events.create	events	2026-09-10 08:16:28.193
cmtv96wpu000aue7w2sfz6iyp	events.update	events	2026-09-10 08:16:28.195
cmtv96wpw000bue7wmgzh2q5h	events.delete	events	2026-09-10 08:16:28.197
cmtv96wpy000cue7we3p7i6ag	announcements.view	announcements	2026-09-10 08:16:28.198
cmtv96wq0000due7wp5xckmfx	announcements.create	announcements	2026-09-10 08:16:28.2
cmtv96wq2000eue7wk21x493k	announcements.update	announcements	2026-09-10 08:16:28.202
cmtv96wq4000fue7wcyy0x91s	announcements.delete	announcements	2026-09-10 08:16:28.204
cmtv96wq6000gue7wbqelijcv	programs.view	programs	2026-09-10 08:16:28.206
cmtv96wq8000hue7wfen950xu	programs.create	programs	2026-09-10 08:16:28.208
cmtv96wqa000iue7wmxclcdy0	programs.update	programs	2026-09-10 08:16:28.21
cmtv96wqc000jue7w79up3mzo	programs.delete	programs	2026-09-10 08:16:28.212
cmtv96wqe000kue7wphae12et	website.view	website	2026-09-10 08:16:28.214
cmtv96wqf000lue7wlsy1offg	website.update	website	2026-09-10 08:16:28.216
cmtv96wqh000mue7wnih7aemu	settings.view	settings	2026-09-10 08:16:28.218
cmtv96wqj000nue7wp6cln9nv	settings.update	settings	2026-09-10 08:16:28.22
cmtv96wql000oue7wlrv5wc0s	admins.view	admins	2026-09-10 08:16:28.222
cmtv96wqn000pue7wti72lfrq	admins.create	admins	2026-09-10 08:16:28.224
cmtv96wqp000que7wjld2xg01	admins.update	admins	2026-09-10 08:16:28.226
cmtv96wqr000rue7w1weeqly3	admins.delete	admins	2026-09-10 08:16:28.227
cmtv96wqt000sue7w2omspfp6	reports.view	reports	2026-09-10 08:16:28.229
cmtyjfr4v000kue6l3miyje2n	structure.view	structure	2026-09-12 15:26:35.551
cmtyjfr4x000lue6lymqtqwri	structure.update	structure	2026-09-12 15:26:35.554
cmtyjfr50000mue6l0dbxe7ub	houses.view	houses	2026-09-12 15:26:35.557
cmtyjfr53000nue6lgei3psv3	houses.create	houses	2026-09-12 15:26:35.559
cmtyjfr55000oue6l9zxig9go	houses.update	houses	2026-09-12 15:26:35.562
cmtyjfr57000pue6l4ug690s5	houses.delete	houses	2026-09-12 15:26:35.564
cmtylgo58000queqb3nv38iwo	committee.view	committee	2026-09-12 16:23:17.564
cmtylgo5e000rueqbj1ncy6fx	committee.create	committee	2026-09-12 16:23:17.571
cmtylgo5g000sueqbpvbo7hvx	committee.update	committee	2026-09-12 16:23:17.572
cmtylgo5i000tueqbyuk6w0f8	committee.delete	committee	2026-09-12 16:23:17.574
cmtylx3ve000uue7dmegchwnr	registers.death.view	registers	2026-09-12 16:36:04.442
cmtylx3vg000vue7dgcmytvn9	registers.death.create	registers	2026-09-12 16:36:04.445
cmtylx3vi000wue7da17ngg44	registers.death.update	registers	2026-09-12 16:36:04.446
cmtylx3vj000xue7dtxaphm2y	registers.death.delete	registers	2026-09-12 16:36:04.448
cmtylx3vl000yue7d39v8rvoj	registers.marriage.view	registers	2026-09-12 16:36:04.449
cmtylx3vm000zue7d3ftz9x3t	registers.marriage.create	registers	2026-09-12 16:36:04.451
cmtylx3vo0010ue7djz1ulwi4	registers.marriage.update	registers	2026-09-12 16:36:04.452
cmtylx3vp0011ue7dkdmw0m33	registers.marriage.delete	registers	2026-09-12 16:36:04.454
cmtylx3vq0012ue7djc1f8pzp	registers.divorce.view	registers	2026-09-12 16:36:04.455
cmtylx3vs0013ue7d978wuw8l	registers.divorce.create	registers	2026-09-12 16:36:04.456
cmtylx3vt0014ue7d132kuvhl	registers.divorce.update	registers	2026-09-12 16:36:04.458
cmtylx3vu0015ue7dpcw6eubt	registers.divorce.delete	registers	2026-09-12 16:36:04.459
cmtylx3vw0016ue7dajokpiyl	registers.release.view	registers	2026-09-12 16:36:04.46
cmtylx3vx0017ue7dsgsp43g4	registers.release.create	registers	2026-09-12 16:36:04.462
cmtylx3vy0018ue7dqkwbhgve	registers.release.update	registers	2026-09-12 16:36:04.463
cmtylx3w00019ue7dwfb55ji7	registers.release.delete	registers	2026-09-12 16:36:04.464
cmtylx3w1001aue7df19ww36o	registers.grave.view	registers	2026-09-12 16:36:04.465
cmtylx3w2001bue7dz05meqvz	registers.grave.create	registers	2026-09-12 16:36:04.467
cmtylx3w3001cue7dvh4o4go0	registers.grave.update	registers	2026-09-12 16:36:04.468
cmtylx3w5001due7d3cz3it6f	registers.grave.delete	registers	2026-09-12 16:36:04.469
cmtylx3w6001eue7d96vw878b	registers.madrassa.view	registers	2026-09-12 16:36:04.47
cmtylx3w7001fue7djkhdfems	registers.madrassa.create	registers	2026-09-12 16:36:04.472
cmtylx3w8001gue7d78ky88m3	registers.madrassa.update	registers	2026-09-12 16:36:04.473
cmtylx3w9001hue7drxbp3pn4	registers.madrassa.delete	registers	2026-09-12 16:36:04.474
cmtylx3wb001iue7dk7dyjdpr	registers.property.view	registers	2026-09-12 16:36:04.475
cmtylx3wc001jue7dm3lw532r	registers.property.create	registers	2026-09-12 16:36:04.477
cmtylx3wd001kue7dn2heinif	registers.property.update	registers	2026-09-12 16:36:04.478
cmtylx3wf001lue7dqixnf5gm	registers.property.delete	registers	2026-09-12 16:36:04.479
cmtymku83001mueyphlm5ha32	finance.view	finance	2026-09-12 16:54:31.684
cmtymku8a001nueypnj227eem	finance.create	finance	2026-09-12 16:54:31.691
cmtymku8c001oueypamuta8b4	finance.update	finance	2026-09-12 16:54:31.692
cmtymku8d001pueypsm31kerv	finance.delete	finance	2026-09-12 16:54:31.693
cmtymvm4a001quemugn59be8f	services.view	services	2026-09-12 17:02:54.395
cmtymvm4h001ruemua9x74voq	services.create	services	2026-09-12 17:02:54.402
cmtymvm4j001suemu8zgtvdxq	services.update	services	2026-09-12 17:02:54.403
cmtymvm4k001tuemuw85qj03j	services.delete	services	2026-09-12 17:02:54.405
cmtynichw001uuedpfi74idyq	audit.view	audit	2026-09-12 17:20:35.013
cmtzdx5ho0023ueeirsegmxep	roles.view	roles	2026-09-13 05:39:55.788
cmtzdx5hp0024ueei7vyxlb4u	roles.create	roles	2026-09-13 05:39:55.79
cmtzdx5hq0025ueeiu2nxbyh0	roles.update	roles	2026-09-13 05:39:55.791
cmtzdx5hr0026ueeiafcs5t6p	roles.delete	roles	2026-09-13 05:39:55.791
cmu00xej0001quew0zl9nn5y9	finance.settings.view	finance	2026-09-13 16:23:58.669
cmu00xej3001ruew0m7dx2zxi	finance.settings.update	finance	2026-09-13 16:23:58.671
cmu00xej4001suew0ptznfgkm	collections.view	collections	2026-09-13 16:23:58.673
cmu00xej5001tuew0dsl9b2v7	collections.create	collections	2026-09-13 16:23:58.673
cmu00xej6001uuew0gpckluas	collections.update	collections	2026-09-13 16:23:58.675
cmu00xej7001vuew0seq3yzf8	collections.cancel	collections	2026-09-13 16:23:58.676
cmu00xej9001wuew0ppb6oi29	payments.view	payments	2026-09-13 16:23:58.678
cmu00xeja001xuew0p0wp0e33	payments.create	payments	2026-09-13 16:23:58.679
cmu00xejc001yuew0sw7f8ux8	payments.update	payments	2026-09-13 16:23:58.68
cmu00xejd001zuew0flknxcp5	payments.cancel	payments	2026-09-13 16:23:58.681
cmu00xejd0020uew05xm4shjt	receipts.view	receipts	2026-09-13 16:23:58.682
cmu00xeje0021uew0h915r8qd	receipts.create	receipts	2026-09-13 16:23:58.683
cmu00xejf0022uew0isc46tbs	receipts.print	receipts	2026-09-13 16:23:58.684
cmu00xejg0023uew0ztwph32y	receipts.cancel	receipts	2026-09-13 16:23:58.685
cmu00xeji0024uew0mcbkio7j	donations.view	donations	2026-09-13 16:23:58.686
cmu00xejj0025uew0fj1hqq9h	donations.create	donations	2026-09-13 16:23:58.687
cmu00xejk0026uew0w794rlrq	donations.update	donations	2026-09-13 16:23:58.688
cmu00xejl0027uew0jrwv3tef	donations.cancel	donations	2026-09-13 16:23:58.689
cmu00xejl0028uew0gd2nbkjf	dues.view	dues	2026-09-13 16:23:58.69
cmu00xejm0029uew0ugly41ji	dues.manage	dues	2026-09-13 16:23:58.691
cmu00xejn002auew0yenkm697	expenses.view	expenses	2026-09-13 16:23:58.692
cmu00xejo002buew0ebpnrg99	expenses.create	expenses	2026-09-13 16:23:58.692
cmu00xejp002cuew0a5gymobt	expenses.update	expenses	2026-09-13 16:23:58.693
cmu00xejq002duew0f34ts03e	expenses.approve	expenses	2026-09-13 16:23:58.694
cmu00xejq002euew0okl8kr9p	expenses.cancel	expenses	2026-09-13 16:23:58.695
cmu00xejr002fuew0v6zeh3un	salary.view	salary	2026-09-13 16:23:58.696
cmu00xejs002guew0beagizb6	salary.create	salary	2026-09-13 16:23:58.697
cmu00xejt002huew0exlvoepp	salary.update	salary	2026-09-13 16:23:58.697
cmu00xeju002iuew0010gx11y	salary.approve	salary	2026-09-13 16:23:58.698
cmu00xeju002juew01o6zdhru	salary.pay	salary	2026-09-13 16:23:58.699
cmu00xejv002kuew0ibdstxn2	accounting.view	accounting	2026-09-13 16:23:58.7
cmu00xejw002luew0bexzxpkr	accounting.accounts.manage	accounting	2026-09-13 16:23:58.7
cmu00xejx002muew0tnbha8ya	accounting.journal.create	accounting	2026-09-13 16:23:58.701
cmu00xejx002nuew0fjyyiw8g	accounting.journal.post	accounting	2026-09-13 16:23:58.702
cmu00xejy002ouew0txdcg2w7	accounting.journal.cancel	accounting	2026-09-13 16:23:58.703
cmu00xejz002puew0v5mpsow0	accounting.ledger.view	accounting	2026-09-13 16:23:58.703
cmu00xek0002quew0pp8lpa9c	accounting.reports.view	accounting	2026-09-13 16:23:58.704
cmu00xek1002ruew0zb67t8i8	banking.view	banking	2026-09-13 16:23:58.705
cmu00xek1002suew0v330qlmc	banking.manage	banking	2026-09-13 16:23:58.706
cmu00xek2002tuew0kd2lhn8w	taxes.view	taxes	2026-09-13 16:23:58.707
cmu00xek3002uuew0iywdl2pp	taxes.manage	taxes	2026-09-13 16:23:58.708
cmu00xekg003duew0rk8zhxa0	reports.export	reports	2026-09-13 16:23:58.72
cmu0xdt6x0008uezr3tp2imgn	education.view	education	2026-09-14 07:32:31.882
cmu0xdt700009uezru47yyxo6	education.manage	education	2026-09-14 07:32:31.885
cmu0xdt72000auezr1l31w5fm	health.view	health	2026-09-14 07:32:31.886
cmu0xdt73000buezrpa5pxvpf	health.manage	health	2026-09-14 07:32:31.887
cmu88mde50020uealf2za3xto	collections.delete	collections	2026-09-19 10:21:30.318
cmu88mdet002kuealz2zdm0gf	expenses.delete	expenses	2026-09-19 10:21:30.341
\.


--
-- Data for Name: plan_features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.plan_features (id, "planId", "featureId", "createdAt") FROM stdin;
cmtzfjume002tueuqtldlbcsf	cmtzfjumb002rueuqjqbcygv1	cmtzereuz002buel21myf1hz9	2026-09-13 06:25:34.407
cmtzfjumg002vueuqkvmnoyho	cmtzfjumb002rueuqjqbcygv1	cmtzerev4002cuel2enbo2801	2026-09-13 06:25:34.409
cmtzfjumh002xueuqnmz3lckr	cmtzfjumb002rueuqjqbcygv1	cmtzerev6002duel2m7fo4762	2026-09-13 06:25:34.41
cmtzfjumi002zueuq2xa6rqba	cmtzfjumb002rueuqjqbcygv1	cmtzerev7002euel2xzur6ndg	2026-09-13 06:25:34.411
cmtzfjumj0031ueuqgof7mq9b	cmtzfjumb002rueuqjqbcygv1	cmtzereva002guel2hab78b1k	2026-09-13 06:25:34.412
cmtzfjumk0033ueuqwl0myhcl	cmtzfjumb002rueuqjqbcygv1	cmtzereve002iuel2xvekvvzy	2026-09-13 06:25:34.413
cmtzfjumm0035ueuqy3agc7cp	cmtzfjumb002rueuqjqbcygv1	cmtzerevd002huel21p7ycc37	2026-09-13 06:25:34.414
cmtzfjumn0037ueuqgg4uar0a	cmtzfjumb002rueuqjqbcygv1	cmtzerev9002fuel2ss38mzvb	2026-09-13 06:25:34.415
cmtzfjump003aueuqgj2nz48f	cmtzfjumo0038ueuq83kpxo7c	cmtzereuz002buel21myf1hz9	2026-09-13 06:25:34.418
cmtzfjumr003cueuqx0lxshgw	cmtzfjumo0038ueuq83kpxo7c	cmtzerev4002cuel2enbo2801	2026-09-13 06:25:34.419
cmtzfjums003eueuqk0tb4lcc	cmtzfjumo0038ueuq83kpxo7c	cmtzerev6002duel2m7fo4762	2026-09-13 06:25:34.42
cmtzfjumt003gueuqi2y23nje	cmtzfjumo0038ueuq83kpxo7c	cmtzerev7002euel2xzur6ndg	2026-09-13 06:25:34.421
cmtzfjumu003iueuq01cuh7xn	cmtzfjumo0038ueuq83kpxo7c	cmtzereva002guel2hab78b1k	2026-09-13 06:25:34.422
cmtzfjumv003kueuq4401wfck	cmtzfjumo0038ueuq83kpxo7c	cmtzereve002iuel2xvekvvzy	2026-09-13 06:25:34.423
cmtzfjumw003mueuqka4ixvlv	cmtzfjumo0038ueuq83kpxo7c	cmtzerevg002juel2l6xwmp57	2026-09-13 06:25:34.424
cmtzfjumx003oueuqt1hecyxk	cmtzfjumo0038ueuq83kpxo7c	cmtzerevh002kuel24qomo1dy	2026-09-13 06:25:34.425
cmtzfjumy003queuqb7hp2b4w	cmtzfjumo0038ueuq83kpxo7c	cmtzerevi002luel2dnujun9q	2026-09-13 06:25:34.426
cmtzfjumz003sueuqgswwcwfg	cmtzfjumo0038ueuq83kpxo7c	cmtzerevk002muel2avr1zgl1	2026-09-13 06:25:34.427
cmtzfjun0003uueuqmiq86krb	cmtzfjumo0038ueuq83kpxo7c	cmtzerevm002nuel27rcsvvc5	2026-09-13 06:25:34.428
cmtzfjun1003wueuqrnkqdewx	cmtzfjumo0038ueuq83kpxo7c	cmtzerevo002ouel2adwwca5e	2026-09-13 06:25:34.429
cmtzfjun2003yueuqlffftkkf	cmtzfjumo0038ueuq83kpxo7c	cmtzerevd002huel21p7ycc37	2026-09-13 06:25:34.43
cmtzfjun30040ueuqj53x3ypl	cmtzfjumo0038ueuq83kpxo7c	cmtzerev9002fuel2ss38mzvb	2026-09-13 06:25:34.431
cmtzfjun50043ueuqj6ymikec	cmtzfjun40041ueuqk97fhahu	cmtzereuz002buel21myf1hz9	2026-09-13 06:25:34.434
cmtzfjun60045ueuqbxtnkvas	cmtzfjun40041ueuqk97fhahu	cmtzerev4002cuel2enbo2801	2026-09-13 06:25:34.435
cmtzfjun70047ueuqihlthcq6	cmtzfjun40041ueuqk97fhahu	cmtzerev6002duel2m7fo4762	2026-09-13 06:25:34.436
cmtzfjun80049ueuqwyhxb923	cmtzfjun40041ueuqk97fhahu	cmtzerev7002euel2xzur6ndg	2026-09-13 06:25:34.437
cmtzfjun9004bueuqrgwi7i4t	cmtzfjun40041ueuqk97fhahu	cmtzereva002guel2hab78b1k	2026-09-13 06:25:34.438
cmtzfjuna004dueuq0ne0w6u0	cmtzfjun40041ueuqk97fhahu	cmtzereve002iuel2xvekvvzy	2026-09-13 06:25:34.439
cmtzfjunb004fueuqn8irub53	cmtzfjun40041ueuqk97fhahu	cmtzerevg002juel2l6xwmp57	2026-09-13 06:25:34.44
cmtzfjunc004hueuq8oxwekk0	cmtzfjun40041ueuqk97fhahu	cmtzerevh002kuel24qomo1dy	2026-09-13 06:25:34.441
cmtzfjund004jueuqtbd4jmks	cmtzfjun40041ueuqk97fhahu	cmtzerevi002luel2dnujun9q	2026-09-13 06:25:34.442
cmtzfjune004lueuqj29345oe	cmtzfjun40041ueuqk97fhahu	cmtzerevk002muel2avr1zgl1	2026-09-13 06:25:34.443
cmtzfjunf004nueuq09hu1huu	cmtzfjun40041ueuqk97fhahu	cmtzerevm002nuel27rcsvvc5	2026-09-13 06:25:34.444
cmtzfjung004pueuqgaxvkz3l	cmtzfjun40041ueuqk97fhahu	cmtzerevo002ouel2adwwca5e	2026-09-13 06:25:34.445
cmtzfjunh004rueuqowzmljz5	cmtzfjun40041ueuqk97fhahu	cmtzerevd002huel21p7ycc37	2026-09-13 06:25:34.446
cmtzfjuni004tueuqk2q4dsf9	cmtzfjun40041ueuqk97fhahu	cmtzerev9002fuel2ss38mzvb	2026-09-13 06:25:34.447
cmtzfjunj004vueuqsl42yjye	cmtzfjun40041ueuqk97fhahu	cmtzerevr002quel2cc2g36sj	2026-09-13 06:25:34.447
cmtzfjunk004xueuqajwzlsff	cmtzfjun40041ueuqk97fhahu	cmtzerevp002puel2ghm2z705	2026-09-13 06:25:34.448
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.plans (id, key, name, description, "priceMinor", currency, "billingPeriod", "userLimit", "memberLimit", "storageLimitMb", "smsCredits", "supportLevel", "isActive", "createdAt", "updatedAt") FROM stdin;
cmtzfjumb002rueuqjqbcygv1	starter	Starter	\N	0	INR	MONTHLY	3	200	\N	\N	Community	t	2026-09-13 06:25:34.404	2026-09-13 06:25:34.404
cmtzfjumo0038ueuq83kpxo7c	growth	Growth	\N	99900	INR	MONTHLY	10	2000	\N	\N	Priority	t	2026-09-13 06:25:34.416	2026-09-13 06:25:34.416
cmtzfjun40041ueuqk97fhahu	enterprise	Enterprise	\N	\N	INR	YEARLY	\N	\N	\N	\N	Dedicated	t	2026-09-13 06:25:34.432	2026-09-13 06:25:34.432
\.


--
-- Data for Name: platform_memberships; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.platform_memberships (id, "userId", role, "isActive", "createdAt", "updatedAt") FROM stdin;
cmtze2ic30060ue8kt55e5bl4	cmtv96x5n0057ue7wcl3a27w0	PLATFORM_STAFF	f	2026-09-13 05:44:05.716	2026-09-13 05:44:13.831
cmtv96wxa000vue7w3jvysuj7	cmtv96wx6000tue7wfg2rfzuu	SUPER_ADMIN	t	2026-09-10 08:16:28.463	2026-09-13 05:44:13.85
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.programs (id, "tenantId", name, description, "isActive", "createdAt", "updatedAt") FROM stdin;
cmtzf3gen007gueoujabdao4t	cmtv96wxe000wue7w59ewld1m	hy	\N	t	2026-09-13 06:12:49.487	2026-09-13 06:12:49.487
\.


--
-- Data for Name: property_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.property_records (id, "tenantId", "propertyType", name, location, "areaDetails", "lesseeName", "lesseePhone", "rentAmount", "acquisitionDate", "isActive", remarks, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refresh_tokens (id, "userId", "tokenHash", "expiresAt", "revokedAt", "replacedById", "ipAddress", "userAgent", "createdAt") FROM stdin;
cmu72dslh00l9ueokh707pvpx	cmtv96wx6000tue7wfg2rfzuu	f5e7f117b7ff8d90ead3e5fbfb1a97c3893ab51cacb2b1140e29fd33c7b061a0	2026-10-18 14:39:06.244	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:39:06.245
cmu72sedj0171uebcfmk5j06e	cmtv96x5n0057ue7wcl3a27w0	b5de8bc5c7625f1619dc97f373753ceac86586e6c1faa61b6510436217dbc9ea	2026-10-18 14:50:27.655	2026-09-18 14:54:28.799	cmu72xkfr019vuebcjyvwwrq2	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:50:27.655
cmu82kymb0045uezxvqss50j2	cmtv96x5n0057ue7wcl3a27w0	7a5f919310a9515b6c8d6805e5e1fed69302a332a9c83bc48a8a3d2e162e8a46	2026-10-19 07:32:26.818	2026-09-19 07:36:27.174	cmu82q42q00bfuezx23pwj3sa	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:32:26.819
cmue4jfqa0cw5ue6tnko8go1g	cmtv96x5n0057ue7wcl3a27w0	0e7c35d84e050524f3ac9a7cede6029b5e1e2729dfa53ec10ce5cc939b72717a	2026-10-23 13:13:51.97	2026-09-23 13:25:13.074	cmue4y19s0cw7ue6t5o0yt2si	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:13:51.971
cmu864l6k0045ue9tu2ustxcv	cmtv96x5n0057ue7wcl3a27w0	500ced085ff75f7c1a63a3a71b2cd36a89bf1a197b4bef6f3020e4cb8164ab14	2026-10-19 09:11:41.372	2026-09-19 09:15:41.672	cmu869ql900lfue9th38euupi	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:11:41.373
cmudqytjq00jzue6t8ix591c1	cmtv96x5n0057ue7wcl3a27w0	9fc7aacf5d708da05ee188a1819b40bcf8532867c5bc120bd1bdccc186066aee	2026-10-23 06:53:55.094	2026-09-23 06:57:55.92	cmudr3zd501qvue6te0yqnkhr	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 06:53:55.095
cmue4y19s0cw7ue6t5o0yt2si	cmtv96x5n0057ue7wcl3a27w0	22790b3932ae565a610a22b5162facc549fc761cd8c01a3888e5efa57cd7c208	2026-10-23 13:25:13.072	2026-09-23 13:41:50.699	cmue5jf1m0cw9ue6tosdl2jxa	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:25:13.072
cmue5jf1m0cw9ue6tosdl2jxa	cmtv96x5n0057ue7wcl3a27w0	a17d0a1f36fb85b50a5086c8b85c7e840bf54f866540292989bf2243e8ba7583	2026-10-23 13:41:50.697	2026-09-23 13:41:50.702	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:41:50.698
cmue48mvn0cvdue6t2yu3hanz	cmtv96x5n0057ue7wcl3a27w0	29eb2ab4022d332670772290c34a7b1394519aca2d2b2066d66df4ae87682f7f	2026-10-23 13:05:28.018	2026-09-23 13:07:21.611	cmue4b2is0cvfue6trutajsrt	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:05:28.019
cmue4b2is0cvfue6trutajsrt	cmtv96x5n0057ue7wcl3a27w0	b423ac4b12c21ce67e8a4c1fad55afefb5ab1fc07e8d00aac3aaeda84713d299	2026-10-23 13:07:21.604	2026-09-23 13:09:52.004	cmue4eake0cvhue6tgjh2xcvm	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:07:21.605
cmue4eake0cvhue6tgjh2xcvm	cmtv96x5n0057ue7wcl3a27w0	b79304728e1d8f99aadfe64b1c4c2339a58c7aea8aaef10d031125f1a67323c9	2026-10-23 13:09:51.997	2026-09-23 13:11:21.612	cmue4g7pj0cw3ue6tb6a3vxer	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:09:51.998
cmuecujoe0nfmue6t2gtwbus2	cmtv96x5n0057ue7wcl3a27w0	530d26f8dde196eb48081e53fc9ac9a49f7afca9f006406d8dda501535be217e	2026-10-23 17:06:27.23	2026-09-23 17:10:30.301	cmueczr840nvsue6tf9c9sjvr	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 17:06:27.231
cmtvct6gv0035uepkwx6w2z4q	cmtv96x5n0057ue7wcl3a27w0	011151cc813919cf02e3354069047e204533ad428565897574d4e09005eed61d	2026-10-10 09:57:46.111	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 09:57:46.111
cmtynn70u0062uenj87pnlx74	cmtv96x5n0057ue7wcl3a27w0	f182e263f8379ed0a709784fd8b924372bba740082fbb224e0f268f68eb07d48	2026-10-12 17:24:21.198	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:24:21.198
cmtyno2z20066uenjo4sonk25	cmtv96x5n0057ue7wcl3a27w0	e70aad9fac13a7e97e3c9d4ea2f196455b9baa12cf08a4b87f54806d69b5b6a2	2026-10-12 17:25:02.606	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:25:02.607
cmtyobxw6006auenjlu7x4y74	cmtv96x5n0057ue7wcl3a27w0	9f30231edb3e00163a531021f6c87797b6199dc73e8d3987c7cce26cf88cf035	2026-10-12 17:43:35.765	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:43:35.766
cmtyoygo1006quenj2rrzjktc	cmtv96x5n0057ue7wcl3a27w0	698d5b10d7c8048a989c2a63b265780103265332bdca43f973a54f2eff1c481a	2026-10-12 18:01:06.529	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 18:01:06.529
cmtzc7g3n0007uepk747hrtcq	cmtv96x5n0057ue7wcl3a27w0	a9d0347489fc9e8bff3f32cee506c620b3bf11b18fe939b2a17c040f50fc1479	2026-10-13 04:51:56.867	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 04:51:56.867
cmtzgxuqv0011uex1qsfdf37c	cmtv96x5n0057ue7wcl3a27w0	aeac0be82d70eeb2e9809569d329ecc6c8ebc6fa5f7b5f95d57e42719b50bc1b	2026-10-13 07:04:27.366	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.52386.3 Chrome/152.0.7977.76 Safari/537.36	2026-09-13 07:04:27.367
cmtzhdfxa001xuex1zrw53snr	cmtv96x5n0057ue7wcl3a27w0	42b7f7800d6c191d52ebf5273d1e8b02f792fff17833351b3cc8d6980579acf9	2026-10-13 07:16:34.654	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:16:34.655
cmtziomks0019ueed00x9szl8	cmtv96x5n0057ue7wcl3a27w0	8706d529382314e2cf5d3a2b53de292a73af1567a05872f58800ec7c54ea3a0d	2026-10-13 07:53:16.108	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:53:16.109
cmtzkjhnq001hueed7pyo76wd	cmtv96x5n0057ue7wcl3a27w0	6ec267920e67b3781ebb4cf1f48104ea1f24b9423254baf94d2eb014121bf84e	2026-10-13 08:45:15.686	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 08:45:15.687
cmtzmnjlw001tueedodfz7595	cmtv96x5n0057ue7wcl3a27w0	37cbaf4fb403dd731f4e60527445570cdded0b14908dceff1ef46d6a217cdc4c	2026-10-13 09:44:24.068	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 09:44:24.069
cmtznbpn4001zueedm99djocx	cmtv96x5n0057ue7wcl3a27w0	2954768213cb9bc97dec605587c8ed0f46630dd44b90df09a214fee538995f8c	2026-10-13 10:03:11.632	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:03:11.632
cmtznx5uy0005uekqdfhfcxae	cmtv96x5n0057ue7wcl3a27w0	15247a08b8852045f9f655483deb6dd44f3c3ba9dcf5edea3e4a2207d3b2e54c	2026-10-13 10:19:52.426	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:19:52.427
cmtzogqmg000tuev7ilkc9898	cmtv96x5n0057ue7wcl3a27w0	fa5a0daa22a76214e7e853fa6391802039077d3e58164bedeb60560ae79380b9	2026-10-13 10:35:05.8	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:35:05.8
cmtzp7346000xuev7qad2v704	cmtv96x5n0057ue7wcl3a27w0	78bf9df59a2ffc8c5c34be5034de7f5a5b8fc6bce50fb48b9306196c51ef8351	2026-10-13 10:55:35.046	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:55:35.047
cmtzp86ls0011uev70ilbxxl3	cmtv96x5n0057ue7wcl3a27w0	10a6f83215070add56b58804a43e193b10474dd0dea95e77bd593b486160d4d6	2026-10-13 10:56:26.224	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:26.224
cmtzp89s30015uev7ylfra0g9	cmtv96x5n0057ue7wcl3a27w0	739af3df207f76a56b8c1721db802448536eafca6c50ba38d4e699d811b160a3	2026-10-13 10:56:30.339	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:30.34
cmtzp8cto0019uev7nxv9p9ed	cmtv96x5n0057ue7wcl3a27w0	d0ec8d5e63fc237ade8989d721fff6b8d9eadd5b05930f2b6a7cc403ce107303	2026-10-13 10:56:34.283	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:34.284
cmtzp8j2z001duev74kbqtaaw	cmtv96x5n0057ue7wcl3a27w0	e49f0c7237bd350c0a697f539cc68f6356960cc6c03a0a118027f48213422988	2026-10-13 10:56:42.395	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:42.395
cmtzp8uk0001huev7ibwpn8w7	cmtv96x5n0057ue7wcl3a27w0	221aa11677bbaa2860d10ed7b3e75a1159757a0db3f2719d33bba3a1943149df	2026-10-13 10:56:57.263	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:56:57.264
cmtzp94kq001luev7f4wvsv6w	cmtv96x5n0057ue7wcl3a27w0	ab7d45ffa34b19200b36bdf80232597dfa68ab4a6c9f6ea628819ca99e5e7466	2026-10-13 10:57:10.248	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:57:10.25
cmtzp96ot001puev7jyynql85	cmtv96x5n0057ue7wcl3a27w0	3b6d10ab1abb67ebb862c4decbcb2c7ca39964655fb000039623f79b94d13e1c	2026-10-13 10:57:12.989	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 10:57:12.989
cmtzpu5p9001vuev7sgbgktoz	cmtv96x5n0057ue7wcl3a27w0	5b6e7d510a9dca6fa5d8aca8a40547918c810b46e29bf108f0951c59441d00c2	2026-10-13 11:13:31.485	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 11:13:31.485
cmtzqe3y9001zuev703udlz82	cmtv96x5n0057ue7wcl3a27w0	dbdf225d04a0d064bb00d480a68abbfe1a24286aa794d0bc478169c5fb0cd989	2026-10-13 11:29:02.337	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 11:29:02.337
cmtzqxlv80023uev756uq64po	cmtv96x5n0057ue7wcl3a27w0	3b52257fdba6eb617155e0d5aef5ebfd6eea9aeab9ef7a086bba19d14e1a42b9	2026-10-13 11:44:12.019	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 11:44:12.02
cmtzrmxbh002buev75ndyt5ot	cmtv96x5n0057ue7wcl3a27w0	abd7153007310c0fc18f06b5aed55264375e10748e032639ed7994f8b28d0f9d	2026-10-13 12:03:53.261	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:03:53.261
cmtzs6vnf002fuev705z7p9q1	cmtv96x5n0057ue7wcl3a27w0	f4f917beb3d7b7901ec20c7d8cd2f9f89a5ffb5c826a451cb9b80ba293e41469	2026-10-13 12:19:24.219	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:19:24.22
cmtzsjlct002juev7zu029g1m	cmtv96x5n0057ue7wcl3a27w0	7957849b1dcfce21b44e3b2a5856620213ca3be1fc091f509145687891fdc1dd	2026-10-13 12:29:17.405	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:29:17.405
cmtzt4j7c0007ues5dcjga73r	cmtv96x5n0057ue7wcl3a27w0	90e76ef5f4df2f859614ea90c8dd5ac439b36dd6bd96e9383b7647350b121239	2026-10-13 12:45:34.392	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:45:34.393
cmtzv89y3000bues59xmyg4f2	cmtv96x5n0057ue7wcl3a27w0	22e8ce9ee1710dbf092b7df378fda0fb0ba034fd0be1851b567e6f855fe2b0fa	2026-10-13 13:44:28.251	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 13:44:28.252
cmtzvxmyu000fues5k0zrzkyz	cmtv96x5n0057ue7wcl3a27w0	91d661270af6fcde4be247951c545487ed4471cf50d4bf5ec162e3b5843170bb	2026-10-13 14:04:11.526	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:04:11.526
cmu00m1sk001dueixgmt6uxr6	cmtv96x5n0057ue7wcl3a27w0	e55a253797fde256b9fe8e1f5b23e93f265c46055dc2a0df66ba23b31e2baf29	2026-10-13 16:15:08.948	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 16:15:08.948
cmu016z10003huew0de5tcj4l	cmtv96x5n0057ue7wcl3a27w0	d0792f3e644e2726a6001fd6aa4bfb97230f0425e11bd323d84f41ac01f980bd	2026-10-13 16:31:25.14	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 16:31:25.141
cmu01swpe0003uerfloy2bkiu	cmtv96x5n0057ue7wcl3a27w0	4dc9006bf3832c2c393886900b1af0458a853fe1b09ad522946c1f2a38610f71	2026-10-13 16:48:28.562	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 16:48:28.563
cmu02ckt60007uerfcsxa91ra	cmtv96x5n0057ue7wcl3a27w0	d8b25d4ae9bc2853ef4c0a1c7f250d91fec0a968c42655450e9691b907cf4185	2026-10-13 17:03:46.266	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:03:46.267
cmu036s040003uerow7rcwfmr	cmtv96x5n0057ue7wcl3a27w0	475751f63d1226edde5a1eb0aeef8338186faf52151430d4f3097ce71becc24d	2026-10-13 17:27:15.268	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:27:15.269
cmu03q8pl000buezoyrht8k5h	cmtv96x5n0057ue7wcl3a27w0	12c929e4df6afca6f4beeab5d3f9cf6a365c55bf2e650635b339ff3af329cd21	2026-10-13 17:42:23.385	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 17:42:23.385
cmu04ed3n0003ueqhi60aq2e9	cmtv96x5n0057ue7wcl3a27w0	0a64d4c1c3bce80953f8acdcc49f86b5f44cfa4e913691254a0fc6147ff30a64	2026-10-13 18:01:08.819	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 18:01:08.82
cmu0v1qzp0003uetftm7yycrh	cmtv96x5n0057ue7wcl3a27w0	1049d7a8f6a6dd599c9e371c9f782cf00ff271a7f664d04bec8f229eb708e8ce	2026-10-14 06:27:09.925	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:27:09.925
cmu0vr2tf000buetfg25uu775	cmtv96x5n0057ue7wcl3a27w0	04148bdc50097b6577c5fe56b1eb7d92e522c2c0999f979da0772e21ca9a33c2	2026-10-14 06:46:51.651	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:46:51.652
cmu0whvxg000puetfgv5t91cz	cmtv96x5n0057ue7wcl3a27w0	6703a05974451dd06f3c26da7905257354524958af8efeb797d11679bba4e0ea	2026-10-14 07:07:42.436	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:07:42.437
cmu0x74q0000tuetfxr6d6ua6	cmtv96x5n0057ue7wcl3a27w0	6110f2c97134a4e4035f2813150774a6ea7d6a6b171a50a1638f1e9710c360f4	2026-10-14 07:27:20.232	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:27:20.233
cmu0xqzg50003ue9h5876ujch	cmtv96x5n0057ue7wcl3a27w0	68efd614eef47e0ae84d3de51c023e0f5fffd5868035a4c92f0978d7e86010f6	2026-10-14 07:42:46.517	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:42:46.517
cmu0xr3l50007ue9hco80rvid	cmtv96x5n0057ue7wcl3a27w0	ecdb8b677e30266845084877a98a0d1142b597a021b494a6d46de27e43660bd1	2026-10-14 07:42:51.881	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:42:51.881
cmu0xrrrp000fue9h3ziaargs	cmtv96x5n0057ue7wcl3a27w0	13d14e01a284015b2ad04fcbe645a7190bfd3c8c3df3c8baf2b3cb0d913eaf30	2026-10-14 07:43:23.221	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:23.222
cmu0xrue5000jue9hfgfe8vaw	cmtv96x5n0057ue7wcl3a27w0	107b99c195eeddeb1029950ec76253a9441e6aebd03c46821da0db5e4fc18c80	2026-10-14 07:43:26.621	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:26.621
cmu0xrxqm000nue9hggm01pct	cmtv96x5n0057ue7wcl3a27w0	1896e0a6a6e83a362b2c6af22e80f62233c46146e17e0507a9138f89a3efa7ef	2026-10-14 07:43:30.958	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:30.959
cmu0xs0xh000rue9huumh28pr	cmtv96x5n0057ue7wcl3a27w0	2185b1443efc84b686c07929b3831c4e7bf6976501cbaf33292a26494d922f29	2026-10-14 07:43:35.093	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:35.093
cmu0xs6nl000vue9hlvdrd280	cmtv96x5n0057ue7wcl3a27w0	b51b2d8d59a7dfbc550c031f7f2a76c13e5ca417606dcababce63ed8db9a5682	2026-10-14 07:43:42.512	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:42.513
cmu0xt4f2000zue9hrhmksyru	cmtv96x5n0057ue7wcl3a27w0	68ffd08dd1d8015aaffcc9ee4c2b33bb755293deabea65f10bad4ca202d58efb	2026-10-14 07:44:26.27	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:44:26.271
cmu0ycu0k003tuejvoq8u9ixq	cmtv96x5n0057ue7wcl3a27w0	05417a384b9d3575e5241013a1754dced867e6d48ce2aeb4c022f74740432e73	2026-10-14 07:59:45.907	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:59:45.908
cmu0ywhce003luelp0gwko31z	cmtv96x5n0057ue7wcl3a27w0	c5d2abf7fba3aa4d1af0cefc1ec27def56443ca45326bfbf9a14866417092959	2026-10-14 08:15:02.606	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:15:02.607
cmu1191uo0052ue1wpxa0z6ws	cmtv96x5n0057ue7wcl3a27w0	62c12f0b486e4c08cb798d2b5ac0c931aa342299bd8a5a1729d98975cb2936d0	2026-10-14 09:20:48.287	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:20:48.288
cmu193zbz004huedqffyqk9sf	cmtv96x5n0057ue7wcl3a27w0	eb58072bcaedbc4dd358a957fdbe5f04f14bbec6a0d1628746c87053b28343f1	2026-10-14 13:00:48.671	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-14 13:00:48.671
cmu194ikq004nuedqasf1nc1h	cmtv96x5n0057ue7wcl3a27w0	33154c37a22d846919a83a741909d5fdfb200aff6b4c59adfed634cfc1246093	2026-10-14 13:01:13.61	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-14 13:01:13.61
cmu194noc004ruedqrt7q6g0v	cmtv96x5n0057ue7wcl3a27w0	30d0953f9137a9aea57671c2b56d522e9478f567b54f2655b118160682cfd2ac	2026-10-14 13:01:20.22	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-14 13:01:20.221
cmu1asluu0049uevqhxmkga8r	cmtv96x5n0057ue7wcl3a27w0	9b6605e449ef96a4ee1936861e8d9d1a6cb0a3cf40cd7a0527e8f2ff3c9385a0	2026-10-14 13:47:57.221	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-14 13:47:57.222
cmu1fcgos004bue5lfiruv3qw	cmtv96x5n0057ue7wcl3a27w0	4342dd9a2cc7555d1fb05daa15328535041e0841c91b1aa4e143b98a5d31a9cf	2026-10-14 15:55:22.108	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:55:22.109
cmu1frw8e004nue5lcsi6ln5a	cmtv96x5n0057ue7wcl3a27w0	dce6903986821129d0be7a00adb1022b582f47dd6925c6fc304f6facdf60fae5	2026-10-14 16:07:22.093	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 16:07:22.094
cmu1jpcw1003zue2jnvn62gk8	cmtv96x5n0057ue7wcl3a27w0	2613f285519c60593d9e5debade0e0c4fbff7fd9d312f526da49207867412f49	2026-10-14 17:57:22.177	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:57:22.178
cmu4gf8wh004muezjzbxpfc56	cmtv96x5n0057ue7wcl3a27w0	7b67024d8d8b3185f3bda3f288e6a466ef26d4557e36f81f6a72fa30e01d572c	2026-10-16 18:48:50.129	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:48:50.13
cmue4g7pj0cw3ue6tb6a3vxer	cmtv96x5n0057ue7wcl3a27w0	671df4f29169675169e71c71fd74c20dd7202da6af43cdd018bca6c173c7618e	2026-10-23 13:11:21.606	2026-09-23 13:13:51.974	cmue4jfqa0cw5ue6tnko8go1g	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:11:21.607
cmu72xkfr019vuebcjyvwwrq2	cmtv96x5n0057ue7wcl3a27w0	53d1649c1413f47c678d1c0a68a6691f9498494f1dede220eb85700af829268c	2026-10-18 14:54:28.791	2026-09-18 14:58:28.753	cmu732pl8019xuebczun8dt6x	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:54:28.791
cmu82q42q00bfuezx23pwj3sa	cmtv96x5n0057ue7wcl3a27w0	6ee6152daaf935c46613566d89726f04bccc2702c89c902b6c05c10515bf7237	2026-10-19 07:36:27.169	2026-09-19 07:40:27.172	cmu82v99801c4uezxx9ck3aqq	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:36:27.17
cmue69dxu0cwfue6tpx2t7ha1	cmtv96x5n0057ue7wcl3a27w0	c18f5ce8e42d106720473a5bd8932eb489acbd7a0de1ff2e49bc7e8901ee5878	2026-10-23 14:02:02.322	2026-09-23 14:06:02.695	cmue6ejeo0d0xue6tvksxcjna	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:02:02.322
cmu869ql900lfue9th38euupi	cmtv96x5n0057ue7wcl3a27w0	892c4815661e1430ec1fddadfd04cb0a88b5357c603613021674930221323bea	2026-10-19 09:15:41.66	2026-09-19 09:28:09.656	cmu86prqt02ldue9tniebg0dq	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:15:41.662
cmudr3zd501qvue6te0yqnkhr	cmtv96x5n0057ue7wcl3a27w0	2194101ac2ba8ec53e3abf35b8d62dfd65f4b81d1c57ed7e6bf31c7247b525c9	2026-10-23 06:57:55.912	2026-09-23 07:01:55.961	cmudr94ku01qxue6tbloe3xic	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 06:57:55.913
cmueczr840nvsue6tf9c9sjvr	cmtv96x5n0057ue7wcl3a27w0	0b76f61a8575a9fe1dd4b49817d031d6d8ada457db2baddbff67cb9d3a9ad9df	2026-10-23 17:10:30.292	2026-09-23 17:10:33.329	cmuecztke0ny2ue6tpt6t83ub	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 17:10:30.293
cmuecztke0ny2ue6tpt6t83ub	cmtv96x5n0057ue7wcl3a27w0	ce149330536738071576497a9817fa38e4d007cc2ebd4c95d222ab2f48a0c68b	2026-10-23 17:10:33.326	2026-09-23 17:16:30.263	cmued7gz80ozcue6tdoc42a8a	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 17:10:33.327
cmtyidnoe000aueqpopm3dppt	cmtv96wx6000tue7wfg2rfzuu	e5af6f954928e59e2c3e3393e2927321b1f703469e2b04f70232a35836daee42	2026-10-12 14:56:58.142	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 14:56:58.142
cmtyj9mv10035ueqpv6673sn7	cmtv96wx6000tue7wfg2rfzuu	1399719c1df21fcb0e1f6fae277f1ae3250b3818e545b54b81b8092989381032	2026-10-12 15:21:50.077	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 15:21:50.078
cmtylwl940043uetpro1u43gr	cmtv96wx6000tue7wfg2rfzuu	ac58217120450cfa5ac20b3779add58c013a144f3b6c6390dbdf2d72bb680c6b	2026-10-12 16:35:40.312	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 16:35:40.313
cmtzehk6u0082uehmrdlylu0j	cmtv96wx6000tue7wfg2rfzuu	db43fdce74d49769c7f2bc61936c0d4c88464d62bca9ff2a788768d937ac1b4e	2026-10-13 05:55:47.958	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:55:47.959
cmtzeldgz0091uehmgcnnk31n	cmtv96wx6000tue7wfg2rfzuu	e8c8a442b3d588aa105627ccc90356eb939a7428ab78ecb179ee7647e2b766ca	2026-10-13 05:58:45.874	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:58:45.875
cmtzetsv7009puehmjlhifn3b	cmtv96wx6000tue7wfg2rfzuu	8d5ae13eb8a79191ff601d22cb5e26f57a65b4c50bc9d5f402f4c6a25dbb0d1d	2026-10-13 06:05:19.075	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:05:19.075
cmtzezfsu0003ueou5gslprxq	cmtv96wx6000tue7wfg2rfzuu	279e137cb8da48b86563960797ede6e67600108afe347df12a42939cb2ec951b	2026-10-13 06:09:42.077	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:09:42.078
cmtzfbxqi007mueoudc6eei1m	cmtv96wx6000tue7wfg2rfzuu	261b93217a8669ae63220a16359d9ddaffa1928e5ad9dbeb3fbc93e27312513d	2026-10-13 06:19:25.194	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:19:25.195
cmtzfocg90003ueshgdwsob4d	cmtv96wx6000tue7wfg2rfzuu	a2687057cf33cb44b59741233b1af6ad15e53c635d07d2d712a4d58a267064bd	2026-10-13 06:29:04.137	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:29:04.138
cmtzgjskc000jueshcencus2k	cmtv96wx6000tue7wfg2rfzuu	c8436f666e39b1dd6c8bd4fb1fb531079de015c52566d742fae9ac14707c05c3	2026-10-13 06:53:31.356	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:53:31.356
cmtzgq5ba0005uex1pj2ury8j	cmtv96wx6000tue7wfg2rfzuu	a0d474116a57d93f47ae78e493be5ef1c7ee18ddb74261868931972b2e7e4025	2026-10-13 06:58:27.814	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:58:27.815
cmtzif6c2000buepikpdt5n2y	cmtv96wx6000tue7wfg2rfzuu	ae3c2ebda3723a06b15a3f42734e63fdb2f72b98e92cccedef12b982a8b325b2	2026-10-13 07:45:55.154	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:45:55.155
cmtzif94h000fuepi57owtqoc	cmtv96wx6000tue7wfg2rfzuu	21986f88cc9e6d75fd09e4b1eabb0b30045658eb40c8e20149665aee672bb7ae	2026-10-13 07:45:58.769	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:45:58.769
cmtzifkvu000juepi852wm4a1	cmtv96wx6000tue7wfg2rfzuu	afb015a2e7229be80bb57ab962b38820615ac70a50753c4a7b71f2edad94655c	2026-10-13 07:46:14.01	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:46:14.011
cmtziflt1000nuepio265zyxe	cmtv96wx6000tue7wfg2rfzuu	0f3bb8d031eadd917aeaf302fc67d8da7f80cfbe3737cd846a1e68637f9b65d5	2026-10-13 07:46:15.204	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:46:15.205
cmtzifq94000ruepilyy1jiml	cmtv96wx6000tue7wfg2rfzuu	df4aded01e2daac57ad20aad1342ae50f91e9bfcc3e0f3dab0f79e76744df697	2026-10-13 07:46:20.968	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:46:20.969
cmtzihk910017uepi4renphay	cmtv96wx6000tue7wfg2rfzuu	1dfbb596c31220f90a7f941bb97d620c1bf5c913f4beb8747e51aa730b99c609	2026-10-13 07:47:46.501	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:47:46.501
cmtzimknc000tueedzmsx6nqq	cmtv96wx6000tue7wfg2rfzuu	dea490ac20c917ffcbc58579b2ff6cc1f62d4823b915370bf00f3dcb95f0fd8d	2026-10-13 07:51:40.296	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:40.297
cmu732pl8019xuebczun8dt6x	cmtv96x5n0057ue7wcl3a27w0	808685c361f4aa7f610ac2c4ab5ab0f0e0d4e44f21c038245a69b23c63d99f27	2026-10-18 14:58:28.748	2026-09-18 15:02:28.85	cmu737uui019zuebctvfyacgj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:58:28.749
cmue6ejeo0d0xue6tvksxcjna	cmtv96x5n0057ue7wcl3a27w0	51d9a097066d3e32c239cba6fff4c5b402ad80a8d10849b70b25258962c25b9b	2026-10-23 14:06:02.687	2026-09-23 14:10:02.669	cmue6jokk0d0zue6tb3cnnewa	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:06:02.688
cmu82v99801c4uezxx9ck3aqq	cmtv96x5n0057ue7wcl3a27w0	a2a15f58dc6433974f545a75201174ed9f237006b7673849e042c781e61e20a2	2026-10-19 07:40:27.163	2026-09-19 07:44:27.181	cmu830eg201rquezxqssha5dv	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:40:27.164
cmu86euu200w3ue9triifkqmc	cmtv96wx6000tue7wfg2rfzuu	dc615da503c65c8662b226affa2bdf62585c9a1ed555f7315c3e5246a13ad777	2026-10-19 09:19:40.442	2026-09-19 09:23:41.728	cmu86k10501ndue9ttt1rux8e	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:19:40.442
cmued7gz80ozcue6tdoc42a8a	cmtv96x5n0057ue7wcl3a27w0	14bc04790f82414ce0ce0ad355c368137265ee22a0e5ed8b05757d36171962b8	2026-10-23 17:16:30.259	2026-09-23 17:20:21.308	cmuedcf940paiue6tnfa41w0a	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	2026-09-23 17:16:30.26
cmudr94ku01qxue6tbloe3xic	cmtv96x5n0057ue7wcl3a27w0	f7800827a56a381f230fab64b1bff7e509a4ea35e3df51fc743395d789a8db03	2026-10-23 07:01:55.949	2026-09-23 07:05:55.98	cmudre9s801qzue6tmwcoc4cs	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:01:55.95
cmudre9s801qzue6tmwcoc4cs	cmtv96x5n0057ue7wcl3a27w0	74c6493d907554c9137068d435976714bd5dc34f8e494239d6e1919d6155f24b	2026-10-23 07:05:55.975	2026-09-23 07:09:56.067	cmudrjf1301r1ue6t80l6rnkc	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:05:55.976
cmu737uui019zuebctvfyacgj	cmtv96x5n0057ue7wcl3a27w0	337d7087d2637fcbdd101f629e540c7e331a44c4aab29fcb87b3ecd1c9b0a108	2026-10-18 15:02:28.841	2026-09-18 15:06:28.853	cmu73d01701a1uebcsm8k9tvs	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:02:28.842
cmu73d01701a1uebcsm8k9tvs	cmtv96x5n0057ue7wcl3a27w0	1c447a803fd98fa2c0e8a20615530a49c82165a4931c78599d6686e2fff6fee3	2026-10-18 15:06:28.842	2026-09-18 15:10:28.846	cmu73i57u01aruebclcafqrm6	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:06:28.844
cmue6jokk0d0zue6tb3cnnewa	cmtv96x5n0057ue7wcl3a27w0	29e20b6a802a5760f0be35293025eaacb07ca227803ccff02c7bd06f139b3aa2	2026-10-23 14:10:02.66	2026-09-23 14:14:02.669	cmue6otre0d11ue6taav64dnq	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:10:02.66
cmu830eg201rquezxqssha5dv	cmtv96x5n0057ue7wcl3a27w0	193216d216a853b88654596dc75ce7804ff4ac79353086e332c962db9bd27b04	2026-10-19 07:44:27.17	2026-09-19 07:55:14.019	cmu83e9ju01v4uezxrmsztupx	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:44:27.17
cmue6otre0d11ue6taav64dnq	cmtv96x5n0057ue7wcl3a27w0	c964539fda7d59fc9af715260b5ceac770df9131a4fdacf72201f75a2adc3557	2026-10-23 14:14:02.666	2026-09-23 14:18:02.689	cmue6tyyh0d13ue6txgw4znmg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:14:02.666
cmu86k10501ndue9ttt1rux8e	cmtv96wx6000tue7wfg2rfzuu	966fdd0fc79867dc6997d3ea95b7be8fc4f7ad1a3a76190400d58dee35784517	2026-10-19 09:23:41.716	2026-09-19 09:27:41.695	cmu86p66002lbue9tvngdjsbg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:23:41.717
cmudrjf1301r1ue6t80l6rnkc	cmtv96x5n0057ue7wcl3a27w0	e060234f815d662413eb7ef98e92bb7c02b62bbf22444ddc67803597722ed348	2026-10-23 07:09:56.055	2026-09-23 07:13:56.009	cmudrok6c01r3ue6t01l4i4hg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:09:56.056
cmudrok6c01r3ue6t01l4i4hg	cmtv96x5n0057ue7wcl3a27w0	f224bde763ea0264c3ab5bf723c82c211ff1d08d82ece966a86ff1ba17a70c41	2026-10-23 07:13:56.004	2026-09-23 07:17:55.946	cmudrtpb801r5ue6tmg029ia7	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:13:56.005
cmuedcf940paiue6tnfa41w0a	cmtv96x5n0057ue7wcl3a27w0	9f55f70f704badce31870ff1aaf952abf9f4294945a03e5ff9ce895844483bb8	2026-10-23 17:20:21.304	2026-09-23 17:20:30.298	cmuedcm6v0pakue6tq47t49b7	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	2026-09-23 17:20:21.305
cmuedcm6v0pakue6tq47t49b7	cmtv96x5n0057ue7wcl3a27w0	677fb5f0b58824c2630ce743e3526c351bf472900dedc4e4cb16ca91e3694c9f	2026-10-23 17:20:30.295	2026-09-23 17:24:21.338	cmuedhkgk0pamue6t1va7o4u1	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	2026-09-23 17:20:30.296
cmuedhrej0paoue6tfvwrb7t9	cmtv96x5n0057ue7wcl3a27w0	fbbf25eb1b7a52c3c1dad8a1cc11c8694ebf3f09a91b4f58c1c6446d749a1cee	2026-10-23 17:24:30.33	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	2026-09-23 17:24:30.331
cmuedhkgk0pamue6t1va7o4u1	cmtv96x5n0057ue7wcl3a27w0	d86bd11c5cde1f3b252218c0d41a7118e4a746032d0413bf1b4d78b629d7a511	2026-10-23 17:24:21.331	2026-09-23 17:24:30.337	cmuedhrej0paoue6tfvwrb7t9	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	2026-09-23 17:24:21.332
cmu73hqf701a5uebchmwxhw8n	cmtv96wx6000tue7wfg2rfzuu	8e11297905565c23b30f1d7aae67ccf578a8aa093b75781a9c5a5dfe83c0fa11	2026-10-18 15:10:09.666	2026-09-18 15:14:10.764	cmu73mwg401ftuebcwv5r9teo	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:10:09.667
cmu83e9ju01v4uezxrmsztupx	cmtv96x5n0057ue7wcl3a27w0	225b8f3506ec20213e0684b366559d097e3e2bd4638a8a2ddaa094ef04ba076c	2026-10-19 07:55:14.009	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 07:55:14.01
cmue6tyyh0d13ue6txgw4znmg	cmtv96x5n0057ue7wcl3a27w0	d17df8b8828693622bd4b3c9af256eeaedee60d575df0b1f30fd49a9cc0f2f92	2026-10-23 14:18:02.68	2026-09-23 14:22:02.726	cmue6z4690d15ue6t39l35wb4	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:18:02.681
cmu86p66002lbue9tvngdjsbg	cmtv96wx6000tue7wfg2rfzuu	0fa0aa4e20cad8bada02e3531b80a88bd1ea76aa04270271d23fd586824160bb	2026-10-19 09:27:41.687	2026-09-19 09:31:41.715	cmu86ubd9032nue9th13y17in	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:27:41.688
cmu86prqt02ldue9tniebg0dq	cmtv96x5n0057ue7wcl3a27w0	d700d075f95fb275a3195a31fe076e65a9a8c369c8ade8ddb3e49805f9ae389a	2026-10-19 09:28:09.653	2026-09-19 09:32:09.505	cmu86uwt903hpue9tn2m0pn4g	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:28:09.653
cmue6z4690d15ue6t39l35wb4	cmtv96x5n0057ue7wcl3a27w0	1575b1f13b1e061e2435fe8bb981ba0dd47883d368af3dec58160bf53e42f77d	2026-10-23 14:22:02.721	2026-09-23 14:26:02.739	cmue749d90d17ue6tfi6lntq7	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:22:02.722
cmudrtpb801r5ue6tmg029ia7	cmtv96x5n0057ue7wcl3a27w0	057195de7722ae20e39481cb364519f3ab8ff6ca620dc5acc2aeca675ae810be	2026-10-23 07:17:55.94	2026-09-23 07:21:55.104	cmudrytuh029jue6t0h17ut0v	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:17:55.941
cmu73i57u01aruebclcafqrm6	cmtv96x5n0057ue7wcl3a27w0	50c6c009245018995675dab7509d9570e8df928004de6e95885d1c040d7c9092	2026-10-18 15:10:28.841	2026-09-18 15:14:28.779	cmu73nacm01fvuebc7hqy9xo2	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:10:28.842
cmu86ubd9032nue9th13y17in	cmtv96wx6000tue7wfg2rfzuu	f94c6dba31692668244dd63d1ada25c3e72d2595aef904bf5ac4a5b972de2c6b	2026-10-19 09:31:41.709	2026-09-19 09:35:41.658	cmu86zgid04vcue9t4z0kb6c4	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:31:41.71
cmue749d90d17ue6tfi6lntq7	cmtv96x5n0057ue7wcl3a27w0	da7a33d8f542b9f0e6491b259d4a4c71900c928daf6798742b3ac2d963380145	2026-10-23 14:26:02.732	2026-09-23 14:30:24.723	cmue79vim0d19ue6tn3scutsu	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:26:02.733
cmudrytuh029jue6t0h17ut0v	cmtv96x5n0057ue7wcl3a27w0	eb67bfd0d5dd56100f784e154390b01ebcb7ef4335425cb0220e92712d7e2a08	2026-10-23 07:21:55.096	2026-09-23 07:26:25.971	cmuds4muk03j5ue6t6w2k51ie	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:21:55.097
cmue79vim0d19ue6tn3scutsu	cmtv96x5n0057ue7wcl3a27w0	c9a13448f110f85f2fc2ab3514d20bcb06f2bd04d86f14dc1f99c79ea70182c8	2026-10-23 14:30:24.718	2026-09-23 14:33:00.345	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:30:24.719
cmue7dbae0d1fue6t7oumaccs	cmtv96x5n0057ue7wcl3a27w0	b14a4dd83ae7a58142e2416849fc27bf7e5e96830ff1882693ca5b9302247d9e	2026-10-23 14:33:05.126	2026-09-23 14:37:05.473	cmue7igqh0d5due6tsbs39039	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:33:05.126
cmu73mwg401ftuebcwv5r9teo	cmtv96wx6000tue7wfg2rfzuu	55d655535aba0fef1e76f7b05b10be2ce342a2106ee2bc2c8244bbac4ddb8a18	2026-10-18 15:14:10.756	2026-09-18 15:18:10.871	cmu73s1pw01fxuebciamklx0j	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:14:10.757
cmu73nacm01fvuebc7hqy9xo2	cmtv96x5n0057ue7wcl3a27w0	45c90356bf98700883610feadb404987a0d0676e8ae89e8356c99ecb51dcb2b2	2026-10-18 15:14:28.773	2026-09-18 15:18:45.833	cmu73ssoy01fzuebciyswoj7u	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:14:28.774
cmu86uwt903hpue9tn2m0pn4g	cmtv96x5n0057ue7wcl3a27w0	08304e628f5100ba99f6c6dd8f578738a04b1036920c54e775bd1a5efd725c99	2026-10-19 09:32:09.5	2026-09-19 09:36:22.555	cmu870c2f055eue9tqf4pq1wh	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:32:09.501
cmuds4muk03j5ue6t6w2k51ie	cmtv96x5n0057ue7wcl3a27w0	609afa08dfbdde491ff5724e75c5a4afb3b7fae951bda960f4db59f94b57708d	2026-10-23 07:26:25.963	2026-09-23 07:30:25.964	cmuds9s1203j7ue6tzigrd00t	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:26:25.964
cmue7igqh0d5due6tsbs39039	cmtv96x5n0057ue7wcl3a27w0	707c38f0af40272a1740355caaa8b29df252ea7a9b7612279521a7fc385fad23	2026-10-23 14:37:05.465	2026-09-23 14:41:05.503	cmue7nlxz0d5fue6t5ifn5gyl	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:37:05.466
cmu73s1pw01fxuebciamklx0j	cmtv96wx6000tue7wfg2rfzuu	7e32ebb7391b718fe171e6dceaa1d38033542e340bb0970bbb1f92c4cbc0c847	2026-10-18 15:18:10.867	2026-09-18 15:22:10.848	cmu73x6vs01g1uebcmor54i71	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:18:10.868
cmu73ssoy01fzuebciyswoj7u	cmtv96x5n0057ue7wcl3a27w0	7cf3b2f921d4f271101e926484199c1719b4de6c3154dd96ca76117be75c8066	2026-10-18 15:18:45.825	2026-09-18 15:22:45.797	cmu73xxup01g3uebcc8akki27	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:18:45.826
cmu73x6vs01g1uebcmor54i71	cmtv96wx6000tue7wfg2rfzuu	0d42073fcb871b9412dbd3a935d3f41503c1abcc984fa4c43521f0940b0650e8	2026-10-18 15:22:10.839	2026-09-18 15:26:10.867	cmu742c3301g5uebcf2keb5gj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:22:10.84
cmu73xxup01g3uebcc8akki27	cmtv96x5n0057ue7wcl3a27w0	2fd77fda6dfe8518fbc859877a7c0bbfba12b5c8fd10311e9f89d87a2218ef0b	2026-10-18 15:22:45.793	2026-09-18 15:26:45.796	cmu74331d01g7uebc8m5kiofv	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:22:45.794
cmu86zgid04vcue9t4z0kb6c4	cmtv96wx6000tue7wfg2rfzuu	91585fa836b4c74ab5d97d6b701c0cfe9de0d1dcd2820a340d18f173ebac3469	2026-10-19 09:35:41.652	2026-09-19 09:39:41.741	cmu874lrb06dcue9tsb74uijc	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:35:41.653
cmuds9s1203j7ue6tzigrd00t	cmtv96x5n0057ue7wcl3a27w0	dcc060e42907efbc369a080a26f325e42a6ab382abcd08337afa686756ad31a3	2026-10-23 07:30:25.957	2026-09-23 07:34:25.945	cmudsex7203j9ue6tpm6cu7i3	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:30:25.958
cmudsex7203j9ue6tpm6cu7i3	cmtv96x5n0057ue7wcl3a27w0	7af32c0a34f9fe6a0263a1b94877a64e7bd36dadc61437204f9d7c7ef85192a4	2026-10-23 07:34:25.933	2026-09-23 07:38:25.666	cmudsk26603tvue6txewr3bo3	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:34:25.934
cmue7nlxz0d5fue6t5ifn5gyl	cmtv96x5n0057ue7wcl3a27w0	bfc1f0119ad5d3b8695d9d8bd49ea9a7ddc8ce73c2c5b56497207861527b98e6	2026-10-23 14:41:05.492	2026-09-23 14:45:05.467	cmue7sr3p0d5hue6tdeaa8ta4	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:41:05.493
cmu742c3301g5uebcf2keb5gj	cmtv96wx6000tue7wfg2rfzuu	eb79941382b15c2b5a2286dab3e3cced4ad216ed0191d5efbd25dca91d2723ab	2026-10-18 15:26:10.863	2026-09-18 15:30:10.835	cmu747h8w01g9uebcgdzp2qfo	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:26:10.864
cmue7sr3p0d5hue6tdeaa8ta4	cmtv96x5n0057ue7wcl3a27w0	92c4a27b31de4f0966f71051581105cb3689b360adcb91c56a367ca5f22ece68	2026-10-23 14:45:05.461	2026-09-23 14:49:05.477	cmue7xwap0d5jue6tlin4y81q	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:45:05.462
cmu74331d01g7uebc8m5kiofv	cmtv96x5n0057ue7wcl3a27w0	23f54d71f1ad8b8fae14e6803a83b7564a12b252ffde75915592538f10e35ff2	2026-10-18 15:26:45.793	2026-09-18 15:30:45.842	cmu74889701gbuebc494avmbj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:26:45.794
cmu747h8w01g9uebcgdzp2qfo	cmtv96wx6000tue7wfg2rfzuu	aa71555f2594c51e4bb6b71ff190715dc6568245a59f1c39d72791b8a12f2efe	2026-10-18 15:30:10.831	2026-09-18 15:34:10.894	cmu74cmh601gduebc6cl7vd61	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:30:10.832
cmu74889701gbuebc494avmbj	cmtv96x5n0057ue7wcl3a27w0	4849883d6b293d01018a86c051dd8faf10e64405adf7a43b174209f2097cc1ad	2026-10-18 15:30:45.835	2026-09-18 15:34:45.869	cmu74ddgp01gfuebcnm7op9ju	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:30:45.836
cmu870c2f055eue9tqf4pq1wh	cmtv96x5n0057ue7wcl3a27w0	15eed061fb58db6406fb2903da3e56d84d41226e3840ef3826921330e110369e	2026-10-19 09:36:22.55	2026-09-19 09:42:58.913	cmu878twc06f2ue9t2oy2y1l9	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:36:22.551
cmudsk26603tvue6txewr3bo3	cmtv96x5n0057ue7wcl3a27w0	650eb9bb5322228a688c8497198cac51241174e7a04a06c608abacb6151663e9	2026-10-23 07:38:25.661	2026-09-23 07:42:25.489	cmudsp77s04alue6tvrybxwt3	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:38:25.662
cmue7xwap0d5jue6tlin4y81q	cmtv96x5n0057ue7wcl3a27w0	2f7ec374779718b494f05227481f03efca8ee07feae139675cd9a08ed9b5eb7a	2026-10-23 14:49:05.473	2026-09-23 14:53:05.744	cmue831oo0d5lue6tzoz3vnx0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:49:05.473
cmu74ddgp01gfuebcnm7op9ju	cmtv96x5n0057ue7wcl3a27w0	679829442d3cf4941e073d430295a514c8438a71cba922fe08be096585731531	2026-10-18 15:34:45.864	2026-09-18 15:38:45.873	cmu74iini01ghuebcw9nocmv5	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:34:45.865
cmu74cmh601gduebc6cl7vd61	cmtv96wx6000tue7wfg2rfzuu	7d147fa5c046257dafc4ec559e981f7d86409e5ed9e1892e0f3f7786802a2d79	2026-10-18 15:34:10.89	2026-09-18 15:38:45.888	cmu74iinw01gjuebcuxoi6h7d	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:34:10.89
cmu74iini01ghuebcw9nocmv5	cmtv96x5n0057ue7wcl3a27w0	df030e240b7df01b925af15beac4899902bbe1f2a9a8f002682c87956e27f88d	2026-10-18 15:38:45.869	2026-09-18 15:42:45.857	cmu74nntq01gnuebcahi1oxcv	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:38:45.87
cmue831oo0d5lue6tzoz3vnx0	cmtv96x5n0057ue7wcl3a27w0	07b56fdc2901a155443e31e8ee779817d992471a2a01d227881412a05a266bf3	2026-10-23 14:53:05.735	2026-09-23 14:57:05.758	cmue886vr0d5nue6tmaka6gad	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:53:05.736
cmu874lrb06dcue9tsb74uijc	cmtv96wx6000tue7wfg2rfzuu	463df9073a076154d3300fc6f8f87f0dbb5c7566f6101912d8893f190ba86b19	2026-10-19 09:39:41.735	2026-09-19 09:43:41.736	cmu879qxw06jkue9tf1dapenc	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:39:41.736
cmudsp77s04alue6tvrybxwt3	cmtv96x5n0057ue7wcl3a27w0	7c6d1b94ac74d94948c3fd3f8ea8a6dd170a35f1528a0ae95165a1a7103eeb9b	2026-10-23 07:42:25.48	2026-09-23 07:46:25.497	cmudsucen04cvue6ta86wodq9	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:42:25.481
cmtvlfwdl003auexgb6d1mifs	cmtv96x5n0057ue7wcl3a27w0	6456dc437f07d5eeb6e04ad20154eac08be5baa66c2e1b43d6f5befc8c1c5b01	2026-10-10 13:59:23.049	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:59:23.05
cmtvlsud40003uedcdzmnbllh	cmtv96x5n0057ue7wcl3a27w0	83d65ef23e9edefbef81bfeccaa0af0f5ccef0f5e58d6053eac36bfff4e8041f	2026-10-10 14:09:26.967	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:09:26.968
cmtvkisbj0067uerq9tbw95pe	cmtv96wx6000tue7wfg2rfzuu	4f7f5d060c0eac34821aecaec9fd6d7eb920014bbe4c748214b6552cd9c64f16	2026-10-10 13:33:38.142	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:33:38.143
cmtvkmcbx006duerqm8qfkso6	cmtv96wx6000tue7wfg2rfzuu	addda1ae4c3e14c2b75c33ac309772059bba61e72f1cb64158d38af6affc89df	2026-10-10 13:36:24.044	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:36:24.045
cmtvkprvd006juerqn8fec4tk	cmtv96wx6000tue7wfg2rfzuu	f32c2c334a51429c9f83a301105fc27c2eb72101d112cc1fd77e6864d6c78c44	2026-10-10 13:39:04.153	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:39:04.154
cmtvkvycs0003uexgenib9d9b	cmtv96wx6000tue7wfg2rfzuu	5eba7de2b6ed46742cca088ef78aae127be2f0bef857ff24f9e5c418b63ea002	2026-10-10 13:43:52.492	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:43:52.493
cmtvkvyj90007uexgfmjvvtag	cmtv96wx6000tue7wfg2rfzuu	40247cecf795d6b23dc1eb2c51408cb04cbf2158f391cc8574449e167506cceb	2026-10-10 13:43:52.725	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:43:52.726
cmtvlk0bc003guexguvc6wklq	cmtv96wx6000tue7wfg2rfzuu	395be155070b20da2eb6319a27588ddf24734d6f4e25c50842d961259ba73a0b	2026-10-10 14:02:34.776	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:02:34.777
cmue8dsi40d5pue6tdxz5va2z	cmtv96x5n0057ue7wcl3a27w0	bf6d20b15664166ae7018ece1088eb8f4d42f6c9a7be4b1ca88696d2f57dd70a	2026-10-23 15:01:27.051	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:01:27.052
cmu74iinw01gjuebcuxoi6h7d	cmtv96wx6000tue7wfg2rfzuu	5853f351eeb89e1f9c973300619e06c380e0f92b0b0ca40a40b94258724a6d58	2026-10-18 15:38:45.884	2026-09-18 15:42:45.807	cmu74nns801gluebc08r47oht	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:38:45.885
cmue886vr0d5nue6tmaka6gad	cmtv96x5n0057ue7wcl3a27w0	6ab19b300a98fdf8981fd981a720b20728955f1e64402e9002cc2d3df2f2fc21	2026-10-23 14:57:05.75	2026-09-23 15:01:27.06	cmue8dsi40d5pue6tdxz5va2z	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 14:57:05.751
cmu74nns801gluebc08r47oht	cmtv96wx6000tue7wfg2rfzuu	f22b499fddb2fbd1bf4387db0f1772d4df555121933e6b8ea55f15654ee95bac	2026-10-18 15:42:45.799	2026-09-18 15:46:45.822	cmu74ssze01gpuebchv6wj189	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:42:45.8
cmu74nntq01gnuebcahi1oxcv	cmtv96x5n0057ue7wcl3a27w0	ddc80e41a044ea861f23580010cd16051d68099fb7895ed73c9e631244827537	2026-10-18 15:42:45.854	2026-09-18 15:46:45.84	cmu74sszy01gruebcsk2xvk7a	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:42:45.854
cmtvkptrz006nuerq63ug003f	cmtv96wx6000tue7wfg2rfzuu	fa52dae29ef46731caa953403a9efc34e93621a26a4817de9504db026f95fe86	2026-10-10 13:39:06.623	2026-09-10 13:39:24.937	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:39:06.623
cmtvkquw9006tuerq4ebwydzi	cmtv96wx6000tue7wfg2rfzuu	a8524f94978a69015871022f91adce68f18dc5fc93cab9637d218c168c2a284a	2026-10-10 13:39:54.729	2026-09-10 13:40:12.302	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:39:54.729
cmtvl7ysq000buexgtorue3qw	cmtv96x5n0057ue7wcl3a27w0	bbc0d5de023a75c9c4b641c0c695f5b0862bcaf1aab0f54e0eb86ef658422ffe	2026-10-10 13:53:12.938	2026-09-10 13:53:19.716	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 13:53:12.939
cmu878twc06f2ue9t2oy2y1l9	cmtv96x5n0057ue7wcl3a27w0	872bf8ab1040eadcc3394f009ee42a98cd963c279617976cb208c8376a8080c5	2026-10-19 09:42:58.908	2026-09-19 09:50:22.672	cmu87icb106wgue9txshzc4y0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:42:58.908
cmtvlfmuv0036uexgpqf06wra	cmtv96wx6000tue7wfg2rfzuu	c70e32b5c2102a880e9978cf7e640d2a6f3823cce76d45c5bba2f638167745c9	2026-10-10 13:59:10.711	2026-09-10 14:02:22.776	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 13:59:10.712
cmue8dx220d5tue6tqv6dnkzp	cmtv96x5n0057ue7wcl3a27w0	7bb87ffec11700c64e7ee65682a7896d6df589e3e4617188350f2544fa309602	2026-10-23 15:01:32.954	2026-09-23 15:05:07.792	cmue8iitm0dbfue6t916ukvc6	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:01:32.955
cmudsucen04cvue6ta86wodq9	cmtv96x5n0057ue7wcl3a27w0	6b41f192c9d49a0b3f5bb03ebe4bd655dd9cb7e8843583672fd538633729d687	2026-10-23 07:46:25.487	2026-09-23 07:50:26.044	cmudszi0n04hdue6tfnddou33	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:46:25.488
cmtvmibb2000fuev0vgf4l91c	cmtv96x5n0057ue7wcl3a27w0	f2b3f108e51b883c86861e8a8ae1d25e7182b9e85b9331b8a42760276156a838	2026-10-10 14:29:15.326	2026-09-10 14:29:22.588	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:29:15.327
cmtvm8onr0037uedc6t10crht	cmtv96x5n0057ue7wcl3a27w0	1436e4551f352b00224e31fb5f1e78bf35f5ad0ccf1d14f67ae3f61b99f54003	2026-10-10 14:21:46.071	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:21:46.072
cmtvmh9c60007uev029t22duh	cmtv96x5n0057ue7wcl3a27w0	3c1a6cdb885360e58d0c299028e63854886503c4bbbddc7c54fe2e481fe1fff1	2026-10-10 14:28:26.117	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-10 14:28:26.118
cmtwy3f530007ueazha1pr65o	cmtv96x5n0057ue7wcl3a27w0	6496b3b88ab7a7eaa4021c4af956a45c6329d401649b787992e7c0fb7195c8a8	2026-10-11 12:41:22.023	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:41:22.024
cmtvmiq5h000luev0jg97h2hx	cmtv96wx6000tue7wfg2rfzuu	9c7dd580239d048fefbde3186ec470b25190e5827403fe3887f10a36e18090f4	2026-10-10 14:29:34.564	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-10 14:29:34.565
cmtwy1m9o0003ueazqil5u9cn	cmtv96wx6000tue7wfg2rfzuu	4cdb274433c13c74eabd70c3b804fa3e3ca61f22c71f7155c56a4822e0a54d52	2026-10-11 12:39:57.948	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:39:57.949
cmu74xy7f01gtuebcgqzftl4h	cmtv96x5n0057ue7wcl3a27w0	c11497cce27e7b8aa3ec93cb26c1bd06848919653aac56f95adc10862a816598	2026-10-18 15:50:45.866	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:50:45.867
cmu74sszy01gruebcsk2xvk7a	cmtv96x5n0057ue7wcl3a27w0	97cc2ee484695a01ce340825ad591ec7975f3446afb0e8b079f810b0c44e5605	2026-10-18 15:46:45.838	2026-09-18 15:50:45.871	cmu74xy7f01gtuebcgqzftl4h	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:46:45.839
cmu74ssze01gpuebchv6wj189	cmtv96wx6000tue7wfg2rfzuu	e9f06f5b69369e71d1180ac1c0122d9d6fe9da837f56a7ac89c4b04ed0d1c0cc	2026-10-18 15:46:45.817	2026-09-18 15:50:45.884	cmu74xy7u01gvuebc5vsh3avh	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:46:45.818
cmue8iitm0dbfue6t916ukvc6	cmtv96x5n0057ue7wcl3a27w0	da33f08c049c5665e9586f5c7715e906bfe9dc42056aa5c289299413c306329a	2026-10-23 15:05:07.786	2026-09-23 15:05:34.035	cmue8j32p0dbhue6t2yhpkl9j	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:05:07.786
cmu879qxw06jkue9tf1dapenc	cmtv96wx6000tue7wfg2rfzuu	26ca3c0132327970d6b176d2dcf64569c51bd57fb3cd196b66c44cca97f6cfc0	2026-10-19 09:43:41.732	2026-09-19 09:48:03.757	cmu87fd4906weue9t59gldsxy	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:43:41.732
cmue8j32p0dbhue6t2yhpkl9j	cmtv96x5n0057ue7wcl3a27w0	ad52e36bad014183aefb22db1aa93cf3a8b8100d12755b11e7de91f53f381a41	2026-10-23 15:05:34.032	2026-09-23 15:09:07.809	cmue8no0q0dkfue6ta9luzeu6	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:05:34.033
cmudszi0n04hdue6tfnddou33	cmtv96x5n0057ue7wcl3a27w0	eb9199790d3bed970695ce86d0a617bc285113545d7f4a15c65ccf35edb311b4	2026-10-23 07:50:26.039	2026-09-23 07:55:04.384	cmudt5gsc05lzue6tzv1g8vuj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:50:26.04
cmu74xy7u01gvuebc5vsh3avh	cmtv96wx6000tue7wfg2rfzuu	f994be588aa1394630a40d840b5252c5ef05eb35e047f6de45e4e5fa94f3eb0b	2026-10-18 15:50:45.882	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 15:50:45.882
cmue8no0q0dkfue6ta9luzeu6	cmtv96x5n0057ue7wcl3a27w0	c3a7c752c1b494bdcb062be95e402fc3349b6fe036980cb4b5e31d9fde35e456	2026-10-23 15:09:07.802	2026-09-23 15:09:34.018	cmue8o88v0dkhue6tw3hi8k4w	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:09:07.802
cmu87fd4906weue9t59gldsxy	cmtv96wx6000tue7wfg2rfzuu	fc8424473998d0a29f1c6424bb777b48926cb3bec1c1cb11af3425e580f8080a	2026-10-19 09:48:03.753	2026-09-19 09:51:40.742	cmu87k0jk06y6ue9tyf8ur60r	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:48:03.754
cmu87icb106wgue9txshzc4y0	cmtv96x5n0057ue7wcl3a27w0	50f598719f6e50460b1591d6d64daaf36e9d745349e40ab0273c77a26fc3b3e0	2026-10-19 09:50:22.668	2026-09-19 09:54:22.378	cmu87nh9c06y8ue9tsh5eygxt	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:50:22.669
cmu87k0jk06y6ue9tyf8ur60r	cmtv96wx6000tue7wfg2rfzuu	ed6ecffc19dfc74a673ca16d0de4da67ac55c893f31e570e669177cd702692fb	2026-10-19 09:51:40.736	2026-09-19 09:56:03.666	cmu87pnf306yaue9tmecmswc5	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:51:40.737
cmue8o88v0dkhue6tw3hi8k4w	cmtv96x5n0057ue7wcl3a27w0	af94f64ff499cbacb55757ee624ab52064a486494ae18ea1fc7b1cd0f8c3778f	2026-10-23 15:09:34.014	2026-09-23 15:13:34.062	cmue8tdgq0dyfue6tikkcw0xi	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:09:34.015
cmudt5gsc05lzue6tzv1g8vuj	cmtv96x5n0057ue7wcl3a27w0	1ed9611ce24d975661ce2c5cc127e8f8f0787d55cfd92f07397486b7a797408f	2026-10-23 07:55:04.379	2026-09-23 07:59:04.389	cmudtalz206zhue6tepf1j8b0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:55:04.38
cmtwyoabi0007uec51ag49uak	cmtv96x5n0057ue7wcl3a27w0	09a33e523d531940ac7933800af4c2ddb92f3c8fdf89227d04c09c39cf26faca	2026-10-11 12:57:35.55	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:57:35.55
cmtwylknj0003uec55218dofc	cmtv96wx6000tue7wfg2rfzuu	1f03dc7f361ae65cfce82085e32508513f473a10095dbb3a5fa06bb01e122fa0	2026-10-11 12:55:28.975	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:55:28.975
cmue8tdgq0dyfue6tikkcw0xi	cmtv96x5n0057ue7wcl3a27w0	f92a36f4d96e363e514c12c90a209fd3f25091a695a1b7feaca54f74019023ef	2026-10-23 15:13:34.058	2026-09-23 15:16:19.328	cmue8wwzf0e7due6tq8ymduti	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:13:34.059
cmu87nh9c06y8ue9tsh5eygxt	cmtv96x5n0057ue7wcl3a27w0	7d2dea92db12e3f85876378dc8181b7a71c5ff5168a550292815e5645b6200fb	2026-10-19 09:54:22.368	2026-09-19 09:58:22.301	cmu87sme206ycue9t024xi86r	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:54:22.369
cmu87pnf306yaue9tmecmswc5	cmtv96wx6000tue7wfg2rfzuu	c6692c8ab58f1fb06cf625ab11f99f3f445bf4be36fce73f4b6412bc4084f677	2026-10-19 09:56:03.663	2026-09-19 10:00:03.676	cmu87usly06yeue9ta5qe4nl4	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:56:03.663
cmu87sme206ycue9t024xi86r	cmtv96x5n0057ue7wcl3a27w0	8db089a47481b3bae26da528b678f3890926590985cb5e489e8e52808a021606	2026-10-19 09:58:22.297	2026-09-19 10:02:22.305	cmu87xrkr06ygue9tebdf6m6p	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 09:58:22.298
cmudtb0k206zlue6tylifywkc	cmtv96wx6000tue7wfg2rfzuu	72a14ba5b136302e28535229cb2d846cc4e9b6f99e1cf1f50901528ce7ed1ece	2026-10-23 07:59:23.282	2026-09-23 08:03:24.065	cmudtg6cb07whue6tqwi2pp3g	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:59:23.282
cmudtalz206zhue6tepf1j8b0	cmtv96x5n0057ue7wcl3a27w0	14c61904b3327921fbeb896505d461107bdc61273d0b1b6361facc5749244a16	2026-10-23 07:59:04.382	2026-09-23 08:04:27.06	cmudthiy607wjue6thbl05g0u	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 07:59:04.382
cmu87usly06yeue9ta5qe4nl4	cmtv96wx6000tue7wfg2rfzuu	4c169ea852008bb0c3ffb6b72ba71521c30b8d97ac38a689af9eb480b4c2e00d	2026-10-19 10:00:03.669	2026-09-19 10:04:03.677	cmu87zxsm0706ue9tsyoa1d8q	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:00:03.67
cmu87xrkr06ygue9tebdf6m6p	cmtv96x5n0057ue7wcl3a27w0	630199d0e15f0042032e9a4e2e854af87e3e651b29bfcb3526962f1c4bb6730b	2026-10-19 10:02:22.299	2026-09-19 10:06:22.319	cmu882wrv0708ue9tkl6yw1cz	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:02:22.3
cmue8wwzf0e7due6tq8ymduti	cmtv96x5n0057ue7wcl3a27w0	e8e2da90d9ba5374ebe31a80be64828efea102700e818d6c782083cda8a79603	2026-10-23 15:16:19.322	2026-09-23 15:17:34.035	cmue8yimn0e7fue6to80bq1dq	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:16:19.323
cmue8yimn0e7fue6to80bq1dq	cmtv96x5n0057ue7wcl3a27w0	e822db0d149c0312bf32212f5b0747a1f6d398773c39f4a91cd79d0b2f386ce5	2026-10-23 15:17:34.031	2026-09-23 15:22:39.145	cmue9521u0f49ue6t6w5dvjox	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:17:34.032
cmudtg6cb07whue6tqwi2pp3g	cmtv96wx6000tue7wfg2rfzuu	c5c02855a7ca372df9b6042ffc12a3900038e949138968f2cbce0be4111b2f6a	2026-10-23 08:03:24.058	2026-09-23 08:07:24.055	cmudtlbip07wlue6t7cp2i2dl	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:03:24.059
cmudthiy607wjue6thbl05g0u	cmtv96x5n0057ue7wcl3a27w0	c3b73d040c46358cd92a70740f238170bb01520098ba10932e85eb2e468f8a1a	2026-10-23 08:04:27.054	2026-09-23 08:08:27.974	cmudtmoua089hue6tmj1znhye	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:04:27.054
cmudtlbip07wlue6t7cp2i2dl	cmtv96wx6000tue7wfg2rfzuu	10c8de5d277543fbf556ef6a678b57794fdd46c82307dae5b1ab683b11cead29	2026-10-23 08:07:24.049	2026-09-23 08:11:23.98	cmudtqgn708fnue6ttgfkt6la	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:07:24.05
cmu87zxsm0706ue9tsyoa1d8q	cmtv96wx6000tue7wfg2rfzuu	478668710affb13e15128ecc022cb636a03748b600ed14d44477e9b9ff5e24a7	2026-10-19 10:04:03.67	2026-09-19 10:08:03.749	cmu88531d071yue9tk34gvz85	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:04:03.67
cmu882wrv0708ue9tkl6yw1cz	cmtv96x5n0057ue7wcl3a27w0	4873870093f39e33041a463bd948709b6a05f0f2ffadbbd210aa4a33db42a328	2026-10-19 10:06:22.315	2026-09-19 10:10:22.312	cmu8881yb07esue9tkk6u6eyb	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:06:22.316
cmue9521u0f49ue6t6w5dvjox	cmtv96x5n0057ue7wcl3a27w0	a87f3a79c94ce780e745211df000ad3cf1ad686fd128b07a385d42cf888ddffa	2026-10-23 15:22:39.137	2026-09-23 15:22:40.01	cmue952pz0f4bue6tgr226xuh	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:22:39.138
cmudtmoua089hue6tmj1znhye	cmtv96x5n0057ue7wcl3a27w0	fdac03c595850037cfb21239f7c61bae3a305ba0528e5cdc64e8933dea116a3e	2026-10-23 08:08:27.969	2026-09-23 08:15:34.047	cmudtvtln090bue6tsy8a9579	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:08:27.97
cmue952pz0f4bue6tgr226xuh	cmtv96x5n0057ue7wcl3a27w0	bce7b6ede4265b71fedecfcff07649d69e952f6c075f9f489f68b3a06095f704	2026-10-23 15:22:40.006	2026-09-23 15:26:39.149	cmue9a78n0fwpue6t29u5oplv	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:22:40.007
cmu88531d071yue9tk34gvz85	cmtv96wx6000tue7wfg2rfzuu	d8c4a8b0df4647f1ac9578169d230729ecf43396d1af1bd4961426d30e01c8b6	2026-10-19 10:08:03.744	2026-09-19 10:12:03.662	cmu88a85h07mmue9twziunjqc	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:08:03.745
cmudtqgn708fnue6ttgfkt6la	cmtv96wx6000tue7wfg2rfzuu	a40ff839bec61a4ab2da874063b7d1e5dc36c971bfc3a62cf67463d7af282ebf	2026-10-23 08:11:23.97	2026-09-23 08:15:24.059	cmudtvlw40909ue6txyaw5979	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:11:23.971
cmue9a78n0fwpue6t29u5oplv	cmtv96x5n0057ue7wcl3a27w0	56f6c158208b796d3143b25bc7b0e9a9fe2efa90965e119e5b6e3de51a310650	2026-10-23 15:26:39.138	2026-09-23 15:26:40.054	cmue9a7xv0fwrue6tj6325ty0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:26:39.139
cmue9a7xv0fwrue6tj6325ty0	cmtv96x5n0057ue7wcl3a27w0	16ecfc84e636bc0fafa9742e0bee9ddef856e7765c1fe18e6b2c3e9aabae4dbc	2026-10-23 15:26:40.05	2026-09-23 15:30:39.979	cmue9fd2d0gcxue6tkjvkerlt	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:26:40.051
cmu8881yb07esue9tkk6u6eyb	cmtv96x5n0057ue7wcl3a27w0	222db2fcf575e1ea2a087c706ad35ce638f4e5e0d2550839d28823242989f9ae	2026-10-19 10:10:22.306	2026-09-19 10:14:22.311	cmu88d74z07ywue9t62r9o1sj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:10:22.307
cmue9fd2d0gcxue6tkjvkerlt	cmtv96x5n0057ue7wcl3a27w0	123bd53529711fee5dc6ad69b7684ec48a2f80732c1e11c612f9b67f0c490c3a	2026-10-23 15:30:39.973	2026-09-23 15:36:10.131	cmue9mfta0go3ue6tbylf32l7	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:30:39.974
cmudtvtln090bue6tsy8a9579	cmtv96x5n0057ue7wcl3a27w0	020f1c09af165b264001a4085011c4f4815dfa9b879fde52314e4881faad152e	2026-10-23 08:15:34.043	2026-09-23 08:17:36.063	cmudtyfqu099tue6t1qjcfjyb	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:15:34.043
cmudtvlw40909ue6txyaw5979	cmtv96wx6000tue7wfg2rfzuu	b24d4c6eb1b58bc06a665749247d1adf65843cc2a992dfd55449ca320500728e	2026-10-23 08:15:24.052	2026-09-23 08:19:24.009	cmudu0r1i09w3ue6teac005db	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:15:24.053
cmu88a85h07mmue9twziunjqc	cmtv96wx6000tue7wfg2rfzuu	f50eb27d7800d18f7ff3dfb18567b78a1781f74b7b9190238a8b0f045e113467	2026-10-19 10:12:03.653	2026-09-19 10:16:03.788	cmu88fdfp08jhue9th67rsg9b	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:12:03.653
cmudtyfqu099tue6t1qjcfjyb	cmtv96x5n0057ue7wcl3a27w0	20f155ce77384596c61b8a28d67d4927d71347f23b3f4ad3d88bb4cfadbf4491	2026-10-23 08:17:36.053	2026-09-23 08:22:58.997	cmudu5cxa0b2hue6trlzqrw0i	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:17:36.054
cmue9mfta0go3ue6tbylf32l7	cmtv96x5n0057ue7wcl3a27w0	6474b6c8ce776f42de0e258be32e76b32eefa15ff9fd5aa7215ac2fd5f5d2773	2026-10-23 15:36:10.126	2026-09-23 15:36:11.04	cmue9mgil0go5ue6ts5ct2gvv	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:36:10.127
cmue9mgil0go5ue6ts5ct2gvv	cmtv96x5n0057ue7wcl3a27w0	47d5900d3c79e58e8366be03df1dbf288c38ec9766f093ddfdf78ba6eb0f3986	2026-10-23 15:36:11.036	2026-09-23 15:40:11.081	cmue9rlqc0h73ue6tn2033361	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:36:11.037
cmtwypq3t000buec538epa2jm	cmtv96wx6000tue7wfg2rfzuu	fbdc6c73f6a48cc1b1e7edb18d59f88b11013b6745eac2c6be673baeb25276e0	2026-10-11 12:58:42.665	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:58:42.665
cmu88d74z07ywue9t62r9o1sj	cmtv96x5n0057ue7wcl3a27w0	eefc9a58d9b934b376377ddb6f6a81757b29ff92fedf8d387a81019f9c1e3295	2026-10-19 10:14:22.306	2026-09-19 10:18:22.325	cmu88icbx08jjue9ty8s9qln0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:14:22.307
cmudu0r1i09w3ue6teac005db	cmtv96wx6000tue7wfg2rfzuu	f7df0263989b30e7e86e795189ebd402b29d224d30225742f7ebabbc93079929	2026-10-23 08:19:24.005	2026-09-23 08:23:24.048	cmudu5w950b2jue6te4cnfzy3	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:19:24.006
cmue9rlqc0h73ue6tn2033361	cmtv96x5n0057ue7wcl3a27w0	f2fa2cc96805e5d499152cef11688e4c4f5401456e90fd8042fc6192897f3ab3	2026-10-23 15:40:11.075	2026-09-23 15:41:31.076	cmue9tbgc0h75ue6taqxbegsi	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:40:11.076
cmue9tbgc0h75ue6taqxbegsi	cmtv96x5n0057ue7wcl3a27w0	fc913b491f2ee7cc64a2dcee4f699ada71efe30dd51b3387f5069b341b21fae5	2026-10-23 15:41:31.067	2026-09-23 15:44:11.012	cmue9wqv10h77ue6tzzj0se8e	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:41:31.068
cmtwyqgun0034uec5w7r9y046	cmtv96x5n0057ue7wcl3a27w0	4517a751430cbe9fda81c6e5130c1e4009d516c5e006316c21bbf8329e595bea	2026-10-11 12:59:17.327	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 12:59:17.328
cmu88fdfp08jhue9th67rsg9b	cmtv96wx6000tue7wfg2rfzuu	f8f06e186d23b84b16f8c3a1d3a74fcb048f228f537a1511848f60a98097b216	2026-10-19 10:16:03.781	2026-09-19 10:22:03.708	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:16:03.781
cmu88icbx08jjue9ty8s9qln0	cmtv96x5n0057ue7wcl3a27w0	f35d13664c1d1654d6e6a1eccf2cc9cfdece887da6af0e59bab9e88b76714fa9	2026-10-19 10:18:22.317	2026-09-19 10:22:22.34	cmu88nhj40045uedl9u4fte7e	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:18:22.317
cmue9wqv10h77ue6tzzj0se8e	cmtv96x5n0057ue7wcl3a27w0	d1cf9b38e61c98321bf40cdbd3dc43dc99844a5db049ebcbcb21f082da2d9e0d	2026-10-23 15:44:11.005	2026-09-23 15:45:31.065	cmue9ygmp0h79ue6tldn02k80	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:44:11.005
cmudu5cxa0b2hue6trlzqrw0i	cmtv96x5n0057ue7wcl3a27w0	8937d5450431c1a594db5089520e3e6af772e3888a81625193d71c39d5575cbc	2026-10-23 08:22:58.99	2026-09-23 08:24:48.049	cmudu7p2j0b5due6tjez63dx9	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:22:58.991
cmudu5w950b2jue6te4cnfzy3	cmtv96wx6000tue7wfg2rfzuu	ea9c643cf702822c9f8b0726d4667914c82d1c5d58fda084fcc9ffefd91ea800	2026-10-23 08:23:24.041	2026-09-23 08:27:25.061	cmudub2810b5hue6txn19sncy	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:23:24.041
cmue9ygmp0h79ue6tldn02k80	cmtv96x5n0057ue7wcl3a27w0	ef078f4c5d1ca2dc482f1fba78fe4398e305b7e64c19b5295fcc6f86626e3304	2026-10-23 15:45:31.056	2026-09-23 15:48:11.056	cmuea1w2w0h7bue6t5mti7xfe	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:45:31.057
cmuea1w2w0h7bue6t5mti7xfe	cmtv96x5n0057ue7wcl3a27w0	a4a4e874da92cb7537d6fb05f329c82d97d68db25b2a74416aade8749010a175	2026-10-23 15:48:11.048	2026-09-23 15:49:30.998	cmuea3lrl0h7due6thvg3wrel	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:48:11.048
cmuea3lrl0h7due6thvg3wrel	cmtv96x5n0057ue7wcl3a27w0	f330e7397b945096f8cfad8cbbc00c750eba346c8204815fb42c58b799bc70d2	2026-10-23 15:49:30.992	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:49:30.993
cmu88nhj40045uedl9u4fte7e	cmtv96x5n0057ue7wcl3a27w0	fce09d8a87be8ae6edd817648886b3249f3ea0a126c37899d91121487ed5ea1f	2026-10-19 10:22:22.336	2026-09-19 10:28:47.165	cmu88vqgp01yvuehy53psndmx	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:22:22.337
cmudu7p2j0b5due6tjez63dx9	cmtv96x5n0057ue7wcl3a27w0	357942786d5a032e696140f6d39fb6fd72b49365fb4b7238b87bd3e960d7d245	2026-10-23 08:24:48.043	2026-09-23 08:26:58.849	cmuduahzy0b5fue6twwn8cr16	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:24:48.044
cmuduahzy0b5fue6twwn8cr16	cmtv96x5n0057ue7wcl3a27w0	97c7864f719019c4d15b2744cf59eb1e094512523ec5b19e1cf4e840152d9b1b	2026-10-23 08:26:58.846	2026-09-23 08:28:48.068	cmuducu9o0b5jue6tnzpp86hp	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:26:58.847
cmuducu9o0b5jue6tnzpp86hp	cmtv96x5n0057ue7wcl3a27w0	841dbfcadfcd91b46b83a139e4a0f8bc920b20e8cb8c633ac5af09b4de8164e1	2026-10-23 08:28:48.06	2026-09-23 08:30:58.882	cmudufn7i0b5lue6tje80tt57	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:28:48.06
cmudub2810b5hue6txn19sncy	cmtv96wx6000tue7wfg2rfzuu	90471e8f9a3581e751ab1c12e2f6eb9f01dcba06207905b6e6fb07c13d8a6514	2026-10-23 08:27:25.057	2026-09-23 08:31:25.142	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:27:25.057
cmuea66960hf9ue6t08nobwv1	cmtv96x5n0057ue7wcl3a27w0	a4142ca92da4744562e896472682728e5a0c3640649c46d8a9c5b40268b51505	2026-10-23 15:51:30.858	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:51:30.859
cmu88vqgp01yvuehy53psndmx	cmtv96x5n0057ue7wcl3a27w0	949b67f5817baec40789641c8a26b5a08ad7596d19ae2a4379d2d7ecbe6c6f31	2026-10-19 10:28:47.16	2026-09-19 10:37:39.745	cmu8975ej00ghue8i14v7ydxe	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:28:47.161
cmuea719o0hffue6t8kfwwqyx	cmtv96x5n0057ue7wcl3a27w0	fa6c68c092d8f5bb7995b5837a1d53f1071b85b8ca95cd963008c9f88b966c65	2026-10-23 15:52:11.051	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:52:11.052
cmudufn7i0b5lue6tje80tt57	cmtv96x5n0057ue7wcl3a27w0	fe51157a79f34a943ba8d1ede51637121ac6fda41a77beeda0a11f3f0e92527f	2026-10-23 08:30:58.878	2026-09-23 08:32:48.148	cmuduhzin0b5pue6tym6rof0g	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:30:58.878
cmuea687q0hfdue6t1kl9ob32	cmtv96x5n0057ue7wcl3a27w0	b758877b8c2f3748069ab6c50f368783b6f915a7692cbac48b032b3f21cdfe4a	2026-10-23 15:51:33.398	2026-09-23 15:52:11.055	cmuea719o0hffue6t8kfwwqyx	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:51:33.399
cmuduhzin0b5pue6tym6rof0g	cmtv96x5n0057ue7wcl3a27w0	7e1c2294da3d375ead1fb7e23031f930c6389e5486477baeb272e98bea026440	2026-10-23 08:32:48.143	2026-09-23 08:34:58.86	cmuduksdl0b5rue6tlp3vzlwg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:32:48.144
cmuduksdl0b5rue6tlp3vzlwg	cmtv96x5n0057ue7wcl3a27w0	3ea1574f0b78725119b028f816de29c2cc4871de7b9ddb0ea01fc33651095f84	2026-10-23 08:34:58.857	2026-09-23 08:36:48.144	cmudun4p70b5tue6tjvn6385j	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:34:58.858
cmuea8r1p0hfjue6tc1vtw3a3	cmtv96x5n0057ue7wcl3a27w0	beff6c2bb0df77ef0729ae247266f3c271a79a7b1ef1b5f29b68ded5504c4104	2026-10-23 15:53:31.117	2026-09-23 16:24:52.998	cmuebd3400hq5ue6tgj6r2qfr	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 15:53:31.117
cmtwzf5b9004luey3yn6phwfx	cmtv96x5n0057ue7wcl3a27w0	7a0263e4e6f75236a2852b3c2c33a8a733daf9545896fc065eb98a398e1b3aa0	2026-10-11 13:18:28.773	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:18:28.773
cmtwz9c4e003luey334hylfjw	cmtv96wx6000tue7wfg2rfzuu	356f3f04e860a48f626f288875ed58e7a0f175e31f52e715b66e186c69b8f5ae	2026-10-11 13:13:57.662	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 13:13:57.662
cmtx18opj007quey3xij605yu	cmtv96wx6000tue7wfg2rfzuu	13e4f114927e34f9b1b7932f3f9c4a379957ba0f3e242779814dc8dfab6d79fc	2026-10-11 14:09:26.551	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:09:26.552
cmtx2gvq5007wuey304jceida	cmtv96wx6000tue7wfg2rfzuu	8cfb8d808a24a18f2439c9bfd380fbfd9df407cdb254d224ee42d5f599822599	2026-10-11 14:43:48.509	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:43:48.51
cmtx2heo80080uey3ad8uuu0n	cmtv96wx6000tue7wfg2rfzuu	7721134ae2af6c4c26dc335c9be2e3413991172dab7d848739f93f643e3c3478	2026-10-11 14:44:13.063	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:44:13.064
cmuebd3400hq5ue6tgj6r2qfr	cmtv96x5n0057ue7wcl3a27w0	3589811bd588b099b28fd9eb44eb241ef5bb49c702e93799b9815ebe0300c9b8	2026-10-23 16:24:52.991	2026-09-23 16:24:53.008	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:24:52.992
cmu89741700gfue8i3r7jue4j	cmtv96wx6000tue7wfg2rfzuu	5474fdae4cf1ff97d9eee40caf6b0d1aa265aea1a90260f3c156aa46e294189a	2026-10-19 10:37:37.963	2026-09-19 10:41:38.692	cmu89c9rz01alue8i2mbygbv1	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:37:37.964
cmu89c9rz01alue8i2mbygbv1	cmtv96wx6000tue7wfg2rfzuu	7bc24a710fd8935e7e1e70298d239d0cd646f4017c8e456db917fb296c713aab	2026-10-19 10:41:38.686	2026-09-19 10:45:38.419	cmu89her201e1ue8i4x463g1j	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:41:38.687
cmudun4p70b5tue6tjvn6385j	cmtv96x5n0057ue7wcl3a27w0	d010c80229014dd1ccb82bca8c999fff67bd219a3d0855e9c75c02e155a4e7f8	2026-10-23 08:36:48.139	2026-09-23 08:38:58.865	cmudupxka0b5vue6tvf3ye243	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:36:48.14
cmudupxka0b5vue6tvf3ye243	cmtv96x5n0057ue7wcl3a27w0	4ebe2a45da42c772a9e394ff141f318d5a0f88f6fc295a2f221016c9a8146d7a	2026-10-23 08:38:58.858	2026-09-23 08:40:48.059	cmudus9te0b5xue6t5py84tyn	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:38:58.859
cmudus9te0b5xue6t5py84tyn	cmtv96x5n0057ue7wcl3a27w0	e111618c553adacdaac6b28d7d6e2e30f8c05018c47341412e70cc7eb48fc223	2026-10-23 08:40:48.05	2026-09-23 08:42:58.876	cmuduv2ra0b5zue6tazve12fh	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:40:48.051
cmtx310nt008guey30feop44n	cmtv96x5n0057ue7wcl3a27w0	0adf95cd8a2bb992a5492d6fb3e6ca529cdf121f302ba7ff5faf9718cab077be	2026-10-11 14:59:28.025	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:59:28.025
cmtxuhxbe0003uetvezvhljra	cmtv96x5n0057ue7wcl3a27w0	054fcf89c05b5fc33cf280413ebbdb08379b1095621fe39af8e1028eb1881009	2026-10-12 03:48:26.473	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 03:48:26.474
cmtxurqhn000buetvhcb7rilb	cmtv96x5n0057ue7wcl3a27w0	9258cb1fbff859db687ffd1cf4dba5c3af2af3c9b23fbbbf6f5f27fc8bdb6beb	2026-10-12 03:56:04.187	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-12 03:56:04.188
cmtxv1jh80003uec4afouye7m	cmtv96x5n0057ue7wcl3a27w0	68edc0c6bf286a610cc16e77f29a59ea19a554e3b1bc4271af006ed81f3c4c78	2026-10-12 04:03:41.66	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 04:03:41.66
cmty0vzf60003uebklyfdyhrp	cmtv96x5n0057ue7wcl3a27w0	651def496f7f8be5bc047b9558bdbe9d61f95ea649ec8c9942e1329e5cc07b0e	2026-10-12 06:47:20.082	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 06:47:20.082
cmu8975ej00ghue8i14v7ydxe	cmtv96x5n0057ue7wcl3a27w0	8b72293af1eabed7896f554efa7d2cf73c2899f57a4d4bfc7dd6f4b290871fe4	2026-10-19 10:37:39.739	2026-09-19 10:41:58.162	cmu89cosq01cvue8iez6r5tbg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:37:39.74
cmtyjeen60039ueqpn2f5uln8	cmtv96x5n0057ue7wcl3a27w0	55577676675ca9085c7141ac554b748055136941f06e4de9f3327ee51a79527e	2026-10-12 15:25:32.706	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 15:25:32.707
cmtylbsy4000duei26q19ddvx	cmtv96x5n0057ue7wcl3a27w0	076381ef572a0949c8f60f07194021e0891ad8aee40f7b864e307f7293a19975	2026-10-12 16:19:30.508	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 16:19:30.509
cmtylxudm0047uetpz68nym2c	cmtv96x5n0057ue7wcl3a27w0	bfce62aeda533eb95c912391a4feb8c8e8abfea1f1af3ecc7706aa0b4ab8109c	2026-10-12 16:36:38.794	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 16:36:38.794
cmtx2hovc0084uey3c3ote9wi	cmtv96wx6000tue7wfg2rfzuu	a6d7f04562febac5beb35dd90fad18a8410fe414b65552ae194c8a080bf8fd9a	2026-10-11 14:44:26.28	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:44:26.281
cmtx2j2si0088uey3a5sudm8w	cmtv96wx6000tue7wfg2rfzuu	183960f59ff91238d31f7b177093e429828b40b8c5f94bbee6123dacea5e7c1c	2026-10-11 14:45:30.978	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-11 14:45:30.979
cmtx3044q008cuey3g5zovn6p	cmtv96wx6000tue7wfg2rfzuu	e48e3ed869a174c7fe70d6fb13bf2e2c9cf9ea244d2108bd7baf5be84a043eba	2026-10-11 14:58:45.864	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-11 14:58:45.866
cmtxunaul0007uetv4l9q1hyt	cmtv96wx6000tue7wfg2rfzuu	1a47478be35492e128d297aa75cb5183fd91c4cc175e69f3e5dbc239efc1121f	2026-10-12 03:52:37.293	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 03:52:37.294
cmuebegg70hqbue6tux55ebwl	cmtv96x5n0057ue7wcl3a27w0	9381195aa1b62fe57c1feed67322662ff18138ab9a242142ace136f2067c429f	2026-10-23 16:25:56.935	2026-09-23 16:29:57.341	cmuebjly00ht5ue6tu0pdx58k	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:25:56.936
cmuduv2ra0b5zue6tazve12fh	cmtv96x5n0057ue7wcl3a27w0	3115f63d8f18fb5bb034ac6a43819f1537f1fddf9acff39773f449eea76f84fc	2026-10-23 08:42:58.869	2026-09-23 08:44:47.972	cmuduxext0b61ue6thqfwwdts	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:42:58.87
cmuduxext0b61ue6thqfwwdts	cmtv96x5n0057ue7wcl3a27w0	384db10bbc482bee8cc66a7f25633587e76317ba60bce58095a9ea164d087999	2026-10-23 08:44:47.968	2026-09-23 08:46:58.86	cmudv07xl0b63ue6tpfmnspf1	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:44:47.969
cmudv07xl0b63ue6tpfmnspf1	cmtv96x5n0057ue7wcl3a27w0	04391c7c607913c672c0085fc92847600b770814edc4c1262ffb703862a2d638	2026-10-23 08:46:58.857	2026-09-23 08:49:25.143	cmudv3csx0b65ue6tnnor9gir	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:46:58.858
cmtyncu9h000hueg4yrqxvfjv	cmtv96x5n0057ue7wcl3a27w0	10a449ba3724fed41e6bddb99e00c2384f4a21b55c4e5d47cafa27c94f99f308	2026-10-12 17:16:18.101	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:16:18.102
cmtynd6w3000lueg4679lhqk7	cmtv96x5n0057ue7wcl3a27w0	38c1530c55e9ce00446373db39d6097b878e551cf519fda2368d74506945dc61	2026-10-12 17:16:34.467	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:16:34.467
cmtyndmnz000pueg4248p6n03	cmtv96x5n0057ue7wcl3a27w0	3afb170d9d7706dbf7d6177c0189cdd5af41dc8f2ad3db68012fcc00c0af0bc1	2026-10-12 17:16:54.911	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:16:54.912
cmtyngh9x0013ueg4mctcn7j0	cmtv96x5n0057ue7wcl3a27w0	dae267dfdd4a200b6c08d7971cae45f3f41ce0632a292aae2607bf1b20ec00bd	2026-10-12 17:19:07.892	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:19:07.893
cmtyngtci001bueg4disj5otr	cmtv96x5n0057ue7wcl3a27w0	6aa63a8d99718a1e87dedbc3de0542ac85ad4603c62403e04460ab64484a676f	2026-10-12 17:19:23.538	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:19:23.539
cmtynh09l001fueg4w5vlpu6g	cmtv96x5n0057ue7wcl3a27w0	b04736e6f82715bd9cea7be47aed204ec6068b6210b2a761dfc323027009d916	2026-10-12 17:19:32.505	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:19:32.506
cmtynmllk005uuenj7nw9jr3s	cmtv96x5n0057ue7wcl3a27w0	d04f425187203b0b42f5f459d697ede22b3fa4230d883084a0959f736fd58b02	2026-10-12 17:23:53.431	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:23:53.432
cmtynms66005yuenj0bu1qahn	cmtv96x5n0057ue7wcl3a27w0	0d391dbb002b4daf2b6afaf4948eacf3250cab6fb5fec99e8a9c133ab633d66a	2026-10-12 17:24:01.95	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 17:24:01.95
cmtyoys1h006uuenjl12hti6z	cmtv96wx6000tue7wfg2rfzuu	959bf4c53877007da8a4d21492564f915221bd11bcfa299ed9d1e6edcd69f6ee	2026-10-12 18:01:21.269	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-12 18:01:21.269
cmtzc72ob0003uepk4ojipun2	cmtv96wx6000tue7wfg2rfzuu	50d299e5445b9fdb0c80e2b9cff49d4738aa4d06de29de74e98c8afd0b44ab98	2026-10-13 04:51:39.466	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 04:51:39.467
cmtzccirp000buepkdyzgala0	cmtv96wx6000tue7wfg2rfzuu	bb07bd7583990322120014ce213d9c5f9e545e7c778b56715720d50e9c5ced7a	2026-10-13 04:55:53.605	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 04:55:53.606
cmtzcpyft0003ue4urt19018s	cmtv96wx6000tue7wfg2rfzuu	38639f866225fb1953c1488f43938882765d03cbd157c36d91844cd678e1b842	2026-10-13 05:06:20.441	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:06:20.441
cmtzdnp520007ue4u299mbst7	cmtv96wx6000tue7wfg2rfzuu	c5c087931da0c00b4400bb938c9ef4ce89d0e4e950fe3399f4047cab0bd3100c	2026-10-13 05:32:34.694	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:32:34.694
cmu89cosq01cvue8iez6r5tbg	cmtv96x5n0057ue7wcl3a27w0	f20d99d3dd6cb68ea31e2a139bb0f259d4ae9270afaf2538de8e556d158288ba	2026-10-19 10:41:58.153	2026-09-19 10:45:58.164	cmu89htzl01e3ue8ir7ykdfr8	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:41:58.154
cmuebjly00ht5ue6tu0pdx58k	cmtv96x5n0057ue7wcl3a27w0	904fefacdf0a90ba194be847e7d7d568fdbfd2ebe57fe3406fb4277795841904	2026-10-23 16:29:57.336	2026-09-23 16:36:08.33	cmuebrk780i4vue6tnqk8vhx5	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:29:57.336
cmudv3csx0b65ue6tnnor9gir	cmtv96x5n0057ue7wcl3a27w0	7b4e33c459349a37ff18bb98c2b270603f5f1799aa82ee046100b7c2f098a5fd	2026-10-23 08:49:25.137	2026-09-23 08:50:58.868	cmudv5d4d0b67ue6tl0v58f4h	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:49:25.138
cmudv5d4d0b67ue6tl0v58f4h	cmtv96x5n0057ue7wcl3a27w0	1ac4f6fdf7f7ccd5dcb4324074083fd80370b6854192d171333ccffe26d2c880	2026-10-23 08:50:58.861	2026-09-23 08:55:21.877	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 08:50:58.862
cmtzdo4g8000bue4ud986m1qo	cmtv96x5n0057ue7wcl3a27w0	aff412b247d28e865629173d8d4ec2574014c1ebb3041d09e5ca1f0dc3bfa807	2026-10-13 05:32:54.536	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:32:54.537
cmtze7rci006sue8kdm576lga	cmtv96x5n0057ue7wcl3a27w0	7148a22b5223de1021f8b7ab2a8d7f8569855ce59b04513ab59b8c221970caec	2026-10-13 05:48:10.674	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:48:10.675
cmtzeha9a007quehmotnwk9a4	cmtv96x5n0057ue7wcl3a27w0	769cd5e951ca89308d62cda90405a8b4f7c6b832187a9ddcff657dc6ad804625	2026-10-13 05:55:35.085	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:55:35.086
cmtzehscd008muehm304jtgfz	cmtv96x5n0057ue7wcl3a27w0	476ed9ee0b5d14b0aaf39ce167d3245e9054f7cab316e4f887a20ef8e34157e7	2026-10-13 05:55:58.525	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:55:58.526
cmuebrk780i4vue6tnqk8vhx5	cmtv96x5n0057ue7wcl3a27w0	e76c36ad9bb5ce2d32f78521de6ae9979d376f59794c1ae067f07a51d3e8a665	2026-10-23 16:36:08.323	2026-09-23 16:42:27.3	cmuebzom40kvtue6tkc2n1e3e	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:36:08.324
cmtzelxd30095uehmf59wncs1	cmtv96x5n0057ue7wcl3a27w0	51a071f8387bc5ff4c3b6766eed1db531d50c3d5c1bdfebf25e8669d97b6cd20	2026-10-13 05:59:11.655	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:59:11.656
cmtzfcz1p007queout9iuc2m9	cmtv96x5n0057ue7wcl3a27w0	1130624e3f343e0c852846ff817d461f375b254177249c061c2ebdf9ac37069f	2026-10-13 06:20:13.548	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 06:20:13.549
cmtzgqdoj0009uex1aqduq60r	cmtv96x5n0057ue7wcl3a27w0	762d2f8fe0c9061fde89d37f4ee019b60476df6fb2e4709574dfe3d4ad9ced8b	2026-10-13 06:58:38.659	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 06:58:38.66
cmtzds5u3000puemj6ddj85ns	cmtv96wx6000tue7wfg2rfzuu	d141f7a23b92dfc4c2abc1d9b0be2c231473e73a4c68861bd3ab94281b8f08be	2026-10-13 05:36:02.954	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:36:02.955
cmu89her201e1ue8i4x463g1j	cmtv96wx6000tue7wfg2rfzuu	38c7ff9cb63f43450f0fdd7a617da51c22c96e3fccc4c0cb4184e06c70f54eab	2026-10-19 10:45:38.413	2026-09-19 10:49:38.755	cmu89mk7101k9ue8i45a6wabf	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:45:38.414
cmtze2agx0003ue8kut7urnen	cmtv96wx6000tue7wfg2rfzuu	b486c4877a79712cf648abe763c7017403c0a88e342b75c374d60c08d24f0380	2026-10-13 05:43:55.52	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:43:55.521
cmu89htzl01e3ue8ir7ykdfr8	cmtv96x5n0057ue7wcl3a27w0	e845136999c26479f6995a6cb9061482305467628c71c440247b05d35184cc78	2026-10-19 10:45:58.16	2026-09-19 11:01:27.756	cmu8a1r9j085nue8i78zuw74m	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:45:58.161
cmtze9ylr006yue8kxt9xcvbx	cmtv96wx6000tue7wfg2rfzuu	8b3d99f08dedab6d29ee041700b3cb0bdd8eafc7174e2e43f3e8ecb9ebe53c90	2026-10-13 05:49:53.391	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 05:49:53.392
cmtzehdtl007uuehmcl40mo26	cmtv96wx6000tue7wfg2rfzuu	9d28eef68193a619a9df4f41695ff2063c1c3650b9141615e53dd6a7144cb79b	2026-10-13 05:55:39.705	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	curl/8.7.1	2026-09-13 05:55:39.705
cmue37wv10b6due6t8miphbto	cmtv96x5n0057ue7wcl3a27w0	e16c74c11b20aef7fbfd4dafb6c64f331dd8677b6c4e994a95eb43ce6f4358e7	2026-10-23 12:36:54.685	2026-09-23 12:40:59.034	cmue3d5ed0c0zue6tdl98qu2u	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:36:54.685
cmtzgshoa000puex13w0mw8kk	cmtv96x5n0057ue7wcl3a27w0	f113805cb369ecd0b685452e133a206c96358058db6b30d65a3d538bca5ecbd3	2026-10-13 07:00:17.146	2026-09-13 07:01:12.611	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:00:17.146
cmtzgyefy0015uex1losh7og3	cmtv96x5n0057ue7wcl3a27w0	2a9f2b8f85a704372f5afe2826c33be76499a8c3807a3ecd08e13a4932abbd92	2026-10-13 07:04:52.894	2026-09-13 07:07:01.761	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:04:52.894
cmtzh1fui001buex1fyd88xku	cmtv96x5n0057ue7wcl3a27w0	c9c2be6554b7dfc089f2d7f64f496aecb68be6a7913764c2102ba804f97bd4aa	2026-10-13 07:07:14.681	2026-09-13 07:13:09.033	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:07:14.682
cmtzh97qz001huex1y01bdcp1	cmtv96x5n0057ue7wcl3a27w0	e63c258f7a3929c620e618144a7df336349d24931044c0465253b9c0e53bac2e	2026-10-13 07:13:17.435	2026-09-13 07:14:32.229	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:13:17.436
cmtzhb0wq001nuex12n9vv9uc	cmtv96x5n0057ue7wcl3a27w0	372c4772e68e57b57f4a8661d9bb7263f825b82f43a643f880d58149a39bf733	2026-10-13 07:14:41.881	2026-09-13 07:15:23.313	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:14:41.882
cmu89mk7101k9ue8i45a6wabf	cmtv96wx6000tue7wfg2rfzuu	e1e1eb4ebd59f1b5afc0817d6c2d13c65f10267ad5e9751af872a309d17e60e3	2026-10-19 10:49:38.749	2026-09-19 10:53:38.779	cmu89rpee033bue8i4k0vpiuu	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:49:38.75
cmuebzom40kvtue6tkc2n1e3e	cmtv96x5n0057ue7wcl3a27w0	19803c1fa187905b87c3c4813ef202d7275e00c4e6277133c7c06402edf912ed	2026-10-23 16:42:27.291	2026-09-23 16:46:27.25	cmuec4tri0l1fue6taicftzx2	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:42:27.292
cmue3d5ed0c0zue6tdl98qu2u	cmtv96x5n0057ue7wcl3a27w0	8fd1de0bfd7fde504b61b695afe4d0e294246418ed4961fc78b883c99d5c0be7	2026-10-23 12:40:59.029	2026-09-23 12:43:21.999	cmue3g7pn0cnjue6thqfop4xt	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:40:59.03
cmtzi29ck0021uex1yltemtuu	cmtv96x5n0057ue7wcl3a27w0	4c2df9444c353b962c438de90f4cc1a928858c155da312b599b8e94f7d437acf	2026-10-13 07:35:52.531	2026-09-13 07:47:08.476	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:35:52.532
cmtzijvj70003ueedeogih3sx	cmtv96wx6000tue7wfg2rfzuu	c6534657e911224173872dad2e719172c58d0dfd889c278e0ea1d4d0367ba752	2026-10-13 07:49:34.434	2026-09-13 07:50:22.908	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:49:34.435
cmtzilsce0009ueedo255pg7a	cmtv96wx6000tue7wfg2rfzuu	833e31c6b31189c9f2ff9e5f01c738476a1aef0b129912bb98b2c7c79268fecb	2026-10-13 07:51:03.614	2026-09-13 07:51:10.572	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:03.615
cmtzilzwv000hueeddf30miw6	cmtv96x5n0057ue7wcl3a27w0	d29e35bec25fb73ed159bd970e3b2f1918d9abd7eb42ce54d9c8347b63157a6d	2026-10-13 07:51:13.423	2026-09-13 07:51:17.487	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:13.424
cmtzimbcl000nueedt5kmoujb	cmtv96wx6000tue7wfg2rfzuu	71ba669ce5212b868bfa1fabeba2b0ca15df86ac2733e16540372ed0d234f17b	2026-10-13 07:51:28.245	2026-09-13 07:51:37.111	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:51:28.246
cmtzgutp8000xuex14qfhh4wv	cmtv96wx6000tue7wfg2rfzuu	c4f1e321fb589f10de2f858363414c621ff12a733de91fd1b2ec01f83795d85b	2026-10-13 07:02:06.044	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.52386.3 Chrome/152.0.7977.76 Safari/537.36	2026-09-13 07:02:06.044
cmtzhcdql001tuex1zrx0cj5k	cmtv96wx6000tue7wfg2rfzuu	a962cc69a2f494e3f8906836537416a397c51e35b655b16f5cc48834b04c2c5e	2026-10-13 07:15:45.165	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:15:45.165
cmtziebry0003uepim3mao556	cmtv96wx6000tue7wfg2rfzuu	4616f08ffb793bc0490e7a5328feb92d37736a28d37d3be72c942eb80ccdbe58	2026-10-13 07:45:15.549	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:45:15.55
cmtzif5n10007uepityzyqwnl	cmtv96wx6000tue7wfg2rfzuu	eab037d68f1856a26bc4309f28b79c16d82064625e755c3d520b4d3a8a5ea189	2026-10-13 07:45:54.253	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 07:45:54.254
cmu89rpee033bue8i4k0vpiuu	cmtv96wx6000tue7wfg2rfzuu	ff181afe852ee9989fcd0b2703bfb0a30f35aa9288909e34a6eac3587aa6b78a	2026-10-19 10:53:38.773	2026-09-19 10:57:38.694	cmu89wuiq0851ue8ig212090e	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:53:38.774
cmuec4tri0l1fue6taicftzx2	cmtv96x5n0057ue7wcl3a27w0	ec939703ecc57bb7ad5a6e5162104f750a270aee0cb42317e966694da9088766	2026-10-23 16:46:27.245	2026-09-23 16:50:27.247	cmuec9yy20l1hue6ti8z6yf4s	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:46:27.246
cmue3g7pn0cnjue6thqfop4xt	cmtv96x5n0057ue7wcl3a27w0	5deb72dcd132dc489adf05092b8dcd414cc06a1165a19d1eeebef0e2a8086f7f	2026-10-23 12:43:21.995	2026-09-23 12:45:27.937	cmue3iwvv0cnlue6t8sxvoi9z	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:43:21.996
cmue3iwvv0cnlue6t8sxvoi9z	cmtv96x5n0057ue7wcl3a27w0	198e804068fd303ee3f5cdd5d0140ea0c62172462d3ae03925deafb66b050970	2026-10-23 12:45:27.931	2026-09-23 12:47:21.933	cmue3lcuj0cnnue6t7k3o4o2e	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:45:27.932
cmue3lcuj0cnnue6t7k3o4o2e	cmtv96x5n0057ue7wcl3a27w0	9c232e6028dcd14ee0e562f63e5b74697bdcbf7ac8ae04c26c7462772a998d3c	2026-10-23 12:47:21.931	2026-09-23 12:49:27.98	cmue3o23q0cnpue6t8fak56tx	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:47:21.932
cmtzlsspq001pueedreow88ze	cmtv96x5n0057ue7wcl3a27w0	8eb8f88fde2ef0d9a8f5d290c6140c31a41935d44b2768ffb955040c82dae8eb	2026-10-13 09:20:29.534	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 09:20:29.534
cmtzkjmj0001lueed9921wlp8	cmtv96wx6000tue7wfg2rfzuu	c06837d7b21a65c3eb1d12cf759fd2996547a3251ecf227348f0789d0292fab8	2026-10-13 08:45:21.996	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 08:45:21.996
cmtzskjzx0003ues5v9r07ix8	cmtv96wx6000tue7wfg2rfzuu	b9932a69ef1428374d10b6eabb8ecffebdfe40660bb47e4705323cc7e4b34602	2026-10-13 12:30:02.301	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 12:30:02.301
cmtzw95as002yues57xhndtxk	cmtv96wx6000tue7wfg2rfzuu	78f19260ee8ad1bdb01d3ebe1093c9a68e14e04dc3dc0df918af4374537bfff9	2026-10-13 14:13:08.5	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:13:08.501
cmtzxlo160003ueix3iwmsqjp	cmtv96x5n0057ue7wcl3a27w0	c277c9af43bdd9de5f5650532a4a7f035e60ebdf499907498825cf7b879f5734	2026-10-13 14:50:52.266	2026-09-13 14:55:32.405	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:50:52.266
cmtzxw2dj000dueixdd5phs1g	cmtv96wx6000tue7wfg2rfzuu	a092974c6f901123156d95ce8a3dee9d19724eba8c39cff6bbae67169d8629f3	2026-10-13 14:58:57.415	2026-09-13 14:59:03.899	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:58:57.415
cmtzzqdy9000vueixdf9aj8pg	cmtv96x5n0057ue7wcl3a27w0	06a3aa4f106004f757f05f7a9ea69ebae2d7a38c83b8087f74c5e629e22a6385	2026-10-13 15:50:31.713	2026-09-13 15:50:41.543	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:50:31.713
cmtzzqohp0011ueixcxrwa1xb	cmtv96x5n0057ue7wcl3a27w0	edec1c5f2ad9a8fe0d57d326b40b6a848a7f6b3129f32f429042083d63c3f03f	2026-10-13 15:50:45.373	2026-09-13 15:50:52.913	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:50:45.373
cmu89wuiq0851ue8ig212090e	cmtv96wx6000tue7wfg2rfzuu	c9b99ce99b24316e098f6c41eb554b65fd75f7aaabe6d08702ddc273a3ce1055	2026-10-19 10:57:38.689	2026-09-19 11:01:38.756	cmu8a1zr1085pue8ik98vetxt	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 10:57:38.69
cmuec9yy20l1hue6ti8z6yf4s	cmtv96x5n0057ue7wcl3a27w0	11c05fddff0fd965640e7181da9d3ae773c18060a042f1087854f29943278482	2026-10-23 16:50:27.242	2026-09-23 16:52:21.79	cmueccfbu0l1jue6t7kw0uuyj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:50:27.243
cmue3o23q0cnpue6t8fak56tx	cmtv96x5n0057ue7wcl3a27w0	235c0eff1c01ccedb9fd3fc0ddc8de81cc522e0e2d6c54fa17e7334fe58dbdbc	2026-10-23 12:49:27.974	2026-09-23 12:51:21.994	cmue3qi2u0cnrue6tgm5qnsua	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:49:27.975
cmue3qi2u0cnrue6tgm5qnsua	cmtv96x5n0057ue7wcl3a27w0	48a3054445775bba80ed3a4666a1974a83e1b6267eff742c9557a613e1a13ab4	2026-10-23 12:51:21.989	2026-09-23 12:53:27.956	cmue3t79t0cv1ue6to1zhz5k2	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:51:21.99
cmueccfbu0l1jue6t7kw0uuyj	cmtv96x5n0057ue7wcl3a27w0	b6a9443592f1366c16f7ad7c7c3bcfe20cdd20bc3e4d08c70eae0d59325cd2e7	2026-10-23 16:52:21.786	2026-09-23 16:54:27.23	cmuecf44b0l6lue6tah595kry	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:52:21.787
cmtzxwnqq000jueix9gvwaba9	cmtv96x5n0057ue7wcl3a27w0	7902710c203fed3964572d5239dc0234f7f437aa8128d8fee4e61bae288c5a72	2026-10-13 14:59:25.106	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:59:25.106
cmtzyy5c8000nueix0uvcv60r	cmtv96x5n0057ue7wcl3a27w0	51e0eefbcc1a03be32ba2287959dc4fd61386d867b1e82cd2a751477bcb8f434	2026-10-13 15:28:34.184	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:28:34.184
cmtzzr2m20017ueix5vnk4i56	cmtv96x5n0057ue7wcl3a27w0	938cf78b81890dae282676a5de2a250083351db4a7eb3cd6e93c2bd332d763e2	2026-10-13 15:51:03.673	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:51:03.674
cmtzxlrgq0007ueix2enfjxt4	cmtv96wx6000tue7wfg2rfzuu	bce21c2c22ceed239be71b1691220112261f7aca566c8f1c0f1e892eb8baddc0	2026-10-13 14:50:56.714	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 14:50:56.715
cmtzzf7gt000rueixilyfoorh	cmtv96wx6000tue7wfg2rfzuu	59ae8319d89e4657ac632d8131c8e2fbd766fb1a4cf09347e7b15010f5d29986	2026-10-13 15:41:50.093	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-13 15:41:50.094
cmu0vqsbq0007uetf8fwlpsln	cmtv96wx6000tue7wfg2rfzuu	848b9ab62ebc82312666f342bbb8e686bc83ec1b47a62c0657a8b9933e1fe8b4	2026-10-14 06:46:38.054	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 06:46:38.055
cmuecf44b0l6lue6tah595kry	cmtv96x5n0057ue7wcl3a27w0	beae184e743ed1ede2570444e0a84e4a16555931e6e44a8bd97ac3249139ce1d	2026-10-23 16:54:27.227	2026-09-23 16:56:23.266	cmuechlnf0l6nue6tbmvs09xm	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:54:27.227
cmu8a1r9j085nue8i78zuw74m	cmtv96x5n0057ue7wcl3a27w0	6cb9f080d4d8e0f785568841a0137ffe728ab1f2a44da6885fd0197c4b0226bf	2026-10-19 11:01:27.75	2026-09-19 11:05:27.901	cmu8a6wk6085rue8it6bj85tx	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:01:27.75
cmuechlnf0l6nue6tbmvs09xm	cmtv96x5n0057ue7wcl3a27w0	538fbd140a9bae48df31a3ad066f9068df93c0936f4b7dce935eb10e4c9ce080	2026-10-23 16:56:23.259	2026-09-23 16:58:27.334	cmueck9dv0l6pue6tm1jma0he	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:56:23.26
cmu8a1zr1085pue8ik98vetxt	cmtv96wx6000tue7wfg2rfzuu	9f04aa8e6f6045b89f2cbadcd3e46d1ea045255ef75d2d24f5a4064e8e114ca7	2026-10-19 11:01:38.749	2026-09-19 11:06:03.9	cmu8a7oc7085tue8iy1kuhmhr	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:01:38.75
cmu8a6wk6085rue8it6bj85tx	cmtv96x5n0057ue7wcl3a27w0	2a12a2a163b0043f3511fef5a8ba9625e413359033c6bbb9bcb12c9800ab0bbb	2026-10-19 11:05:27.893	2026-09-19 11:09:27.818	cmu8ac1om085vue8i1do95oyc	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:05:27.894
cmu8a7oc7085tue8iy1kuhmhr	cmtv96wx6000tue7wfg2rfzuu	60b7229bf4a0eb7f68edc5f62edc6de295da655026fbebf4251305b1d5edaf70	2026-10-19 11:06:03.895	2026-09-19 11:10:03.794	cmu8actfy085xue8irdi7zftg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:06:03.895
cmu0xroai000bue9h4qskl2qz	cmtv96x5n0057ue7wcl3a27w0	8f478c8af30ae83e5feba41b857b341d1d386b74e3fc41f15b3a88cfdee1f6f9	2026-10-14 07:43:18.714	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 07:43:18.715
cmu0zg93d003lue1wptedltx2	cmtv96x5n0057ue7wcl3a27w0	4381a10dfea16c490ba8801102226963560f19724a0199e5e25274605c8e1387	2026-10-14 08:30:25.032	2026-09-14 08:37:38.346	cmu0zpjfo003nue1wub7cw952	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:30:25.033
cmu0zpjfo003nue1wub7cw952	cmtv96x5n0057ue7wcl3a27w0	d8786b36d0863c111718cb075dc910c37c467de6c2b14205a5978dea27228aef	2026-10-14 08:37:38.339	2026-09-14 08:44:33.709	cmu0zyfxi003pue1wkylil53c	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:37:38.34
cmue3t79t0cv1ue6to1zhz5k2	cmtv96x5n0057ue7wcl3a27w0	1c192783088c12a6fb2b6d7ed4210db25f31d0931973affa4ba0bc946b4f0533	2026-10-23 12:53:27.953	2026-09-23 12:55:21.941	cmue3vn820cv3ue6te6zxr44k	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:53:27.953
cmu0zyfxi003pue1wkylil53c	cmtv96x5n0057ue7wcl3a27w0	dc4e33bc656a8359ac07700443d9db54af64a2f9679c1f4483bd62a2c3abdc09	2026-10-14 08:44:33.701	2026-09-14 08:48:33.687	cmu103l3l003zue1whqf1rg0q	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:44:33.702
cmu103l3l003zue1whqf1rg0q	cmtv96x5n0057ue7wcl3a27w0	90f2b13cc09672c129251fb82b1248fbe29fdbae8a2d634cc8f0b39d5d222fb8	2026-10-14 08:48:33.681	2026-09-14 08:54:19.107	cmu10azmj004bue1whgv3spju	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:48:33.681
cmue3vn820cv3ue6te6zxr44k	cmtv96x5n0057ue7wcl3a27w0	522c8373fb22d4f4267796289c8b3afa607df146e38fd4b1ff4d41bbe3f7a1d0	2026-10-23 12:55:21.938	2026-09-23 12:57:28	cmue3ychm0cv5ue6tftol7qrn	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:55:21.938
cmu10azmj004bue1whgv3spju	cmtv96x5n0057ue7wcl3a27w0	371a61724eca119043c70eb64e479161c0c036659a8ad1e27fc43058848652e3	2026-10-14 08:54:19.099	2026-09-14 08:58:19.12	cmu10g4to004due1wa4fgiksk	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:54:19.1
cmue3ychm0cv5ue6tftol7qrn	cmtv96x5n0057ue7wcl3a27w0	db5e5a972d9e750d4338221751f5ea3e21bf1e3ac927dc47cf9725edf375cecc	2026-10-23 12:57:27.994	2026-09-23 12:59:22.025	cmue40sh10cv7ue6ti3plcnpl	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:57:27.994
cmu10g4to004due1wa4fgiksk	cmtv96x5n0057ue7wcl3a27w0	da1a44576d762d118d5b8f85423683540457bf64c9ab39a6bfa6f95a31ae84c4	2026-10-14 08:58:19.115	2026-09-14 09:02:19.133	cmu10la0o004fue1wf4jlrnx7	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 08:58:19.116
cmu10la0o004fue1wf4jlrnx7	cmtv96x5n0057ue7wcl3a27w0	7043b8ba1dbc0ff562c415a981b877e3a571ecd644046626abac540a4888bfe9	2026-10-14 09:02:19.128	2026-09-14 09:06:19.127	cmu10qf78004hue1wzpfpam30	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:02:19.129
cmu10qf78004hue1wzpfpam30	cmtv96x5n0057ue7wcl3a27w0	785fed273b2a4adf4ecd1d4d98065424a47974fa4943b6af1903df682229cadc	2026-10-14 09:06:19.123	2026-09-14 09:10:20.103	cmu10vl4z004jue1wk1qletju	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:06:19.124
cmu10vl4z004jue1wk1qletju	cmtv96x5n0057ue7wcl3a27w0	83dbc3e786ce1c122ba361eeb0df85860695d812e511029b1c508b95521796a9	2026-10-14 09:10:20.099	2026-09-14 09:20:48.293	cmu1191uo0052ue1wpxa0z6ws	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:10:20.1
cmu11ydye0056ue1w2h62fusu	cmtv96x5n0057ue7wcl3a27w0	10b1585b530fbb6dbe70bcddd8e95dbbf38184b74867b82e976b81976055f5d5	2026-10-14 09:40:30.374	2026-09-14 09:47:28.326	cmu127cg20058ue1w9a9aey6e	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:40:30.374
cmu127cg20058ue1w9a9aey6e	cmtv96x5n0057ue7wcl3a27w0	fb980a43fc0e2d6fe9694f4f2356411cd4d5fb11395e85f1b640193c095fe4ab	2026-10-14 09:47:28.321	2026-09-14 09:51:28.328	cmu12chmm005aue1w9v5mokbu	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:47:28.322
cmu12chmm005aue1w9v5mokbu	cmtv96x5n0057ue7wcl3a27w0	cabefe45e480146a09a6e136af8f37b819dcb1987392aec5b32b42b10cf974ff	2026-10-14 09:51:28.318	2026-09-14 09:55:33.821	cmu12hr20005cue1wuuop9c1w	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:51:28.319
cmu12hr20005cue1wuuop9c1w	cmtv96x5n0057ue7wcl3a27w0	67402b56cbd02c3bd2e10b34f2450d5bebbaca0149ae5f06ef91a1ac938f401a	2026-10-14 09:55:33.815	2026-09-14 09:59:33.818	cmu12mw8k005eue1wpootv61d	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:55:33.816
cmu12mw8k005eue1wpootv61d	cmtv96x5n0057ue7wcl3a27w0	b3c74427dea382d068c706c2a3614452161d9a7fca0c707881117bee28f75a71	2026-10-14 09:59:33.812	2026-09-14 10:03:33.832	cmu12s1fn005gue1wca4m6epn	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 09:59:33.813
cmu13m2bj006eue1wqklledza	cmtv96wx6000tue7wfg2rfzuu	7a44692d4005969bf7e5be02de4f325ebfd23ddf55b4fdefd5ebee2e9c4c7a62	2026-10-14 10:26:54.655	2026-09-18 14:40:03.49	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:26:54.656
cmu12s1fn005gue1wca4m6epn	cmtv96x5n0057ue7wcl3a27w0	4feaae345a9f7ab8ba912080822e4257995be6f033890cf3d2a20157f407db23	2026-10-14 10:03:33.827	2026-09-14 10:05:39.849	cmu12uqo5005iue1wqwtoe2dq	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:03:33.828
cmu12uqo5005iue1wqwtoe2dq	cmtv96x5n0057ue7wcl3a27w0	d29679f971233b11e8c3b719601f5b2a9bafac9a8c85c098c89709402993a32d	2026-10-14 10:05:39.845	2026-09-14 10:07:33.824	cmu12x6m4005mue1wlg9614o8	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:05:39.846
cmu12x6m4005mue1wlg9614o8	cmtv96x5n0057ue7wcl3a27w0	7837c6e1ac79fc4e0c89efd0ed53cdee541aeaaef7bebb1f8d53aee2708a7782	2026-10-14 10:07:33.819	2026-09-14 10:09:39.359	cmu12zvh0005oue1wi6t2n5ew	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:07:33.82
cmu12zvh0005oue1wi6t2n5ew	cmtv96x5n0057ue7wcl3a27w0	1d938c8ffa163f05db57cce67e70ed151f257e5b947667378981cb3db79b134d	2026-10-14 10:09:39.347	2026-09-14 10:11:33.822	cmu132bsn005que1wlxbj6xkg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:09:39.348
cmu132bsn005que1wlxbj6xkg	cmtv96x5n0057ue7wcl3a27w0	8ac31b7314053aff9ca31997f8ba159f9126d54913b879707d13b7c3a8a2ff6b	2026-10-14 10:11:33.815	2026-09-14 10:13:39.362	cmu1350nw005sue1ww7daeggz	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:11:33.816
cmu1350nw005sue1ww7daeggz	cmtv96x5n0057ue7wcl3a27w0	058cd467f65cdc78a7dbb2585a05e46d2e82b12cbd6b0170d1b11883abc47e84	2026-10-14 10:13:39.355	2026-09-14 10:15:33.833	cmu137gzp005uue1w0nn3nv0v	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:13:39.356
cmu137gzp005uue1w0nn3nv0v	cmtv96x5n0057ue7wcl3a27w0	b725d76a08ccf13d774727bb212c160b8cf0248735147dc2345cd343316de84a	2026-10-14 10:15:33.828	2026-09-14 10:17:47.644	cmu13ac8p005wue1wedzg3mzk	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:15:33.829
cmu13ac8p005wue1wedzg3mzk	cmtv96x5n0057ue7wcl3a27w0	1ccd81c7813643fc780e74199878d618e6c0311ee3c112f902c7cc6457d02bed	2026-10-14 10:17:47.641	2026-09-14 10:20:28.839	cmu13dsm9005yue1wf0wr4xbj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:17:47.641
cmu13dsm9005yue1wf0wr4xbj	cmtv96x5n0057ue7wcl3a27w0	b6faf739d1b950637be09352a4bb3d0d756904526534a7ddf98164ca3d376b9e	2026-10-14 10:20:28.832	2026-09-14 10:21:47.833	cmu13fhkj0060ue1w1ynxupd8	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:20:28.833
cmu13fhkj0060ue1w1ynxupd8	cmtv96x5n0057ue7wcl3a27w0	33b04791854d5b6c4c58890054e66d9ec206823e6d5cf0682c90faf9ee27facb	2026-10-14 10:21:47.827	2026-09-14 10:23:33.838	cmu13hrd70062ue1wadbz6w4c	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:21:47.828
cmu13hrd70062ue1wadbz6w4c	cmtv96x5n0057ue7wcl3a27w0	ee31fc15a58fb49c0d8cc72cfa6cbf8cafcd814eafc1e169fef1a02d8c004c8d	2026-10-14 10:23:33.835	2026-09-14 10:25:47.835	cmu13kmra0068ue1w4r16w4dj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:23:33.835
cmu13kmra0068ue1w4r16w4dj	cmtv96x5n0057ue7wcl3a27w0	49fe77896fcafa0536ecbcda419f43befb20a24b5da048a4101eb6c506c689b0	2026-10-14 10:25:47.83	2026-09-14 10:29:47.858	cmu13pryg006gue1wsprmbc0s	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:25:47.831
cmu13pryg006gue1wsprmbc0s	cmtv96x5n0057ue7wcl3a27w0	518d7f7713c69754c610045de353a47ee81e27b2f1bdb7f5cea1348bdb2200ec	2026-10-14 10:29:47.847	2026-09-14 10:30:05.673	cmu13q5pi006iue1w8cinbmy4	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:29:47.848
cmu13q5pi006iue1w8cinbmy4	cmtv96x5n0057ue7wcl3a27w0	bb777631657dd9d14266c5952862ced7ea61b3c2b11fccffb647392e17077732	2026-10-14 10:30:05.669	2026-09-14 10:31:45.69	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:30:05.67
cmu13sml3006oue1w7bsb5w3s	cmtv96x5n0057ue7wcl3a27w0	d94eafc76a6e8c37b329060a0caa193ff5cd918677d3f9de014f8e0b6e38e2e7	2026-10-14 10:32:00.855	2026-09-14 10:33:47.871	cmu13ux5l003juebtbasvq7ik	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:32:00.856
cmu13ux5l003juebtbasvq7ik	cmtv96x5n0057ue7wcl3a27w0	5404cc5da4905344b950fad5d60368d9d2b31f7bc8d64aa79c9a247e666a9c63	2026-10-14 10:33:47.865	2026-09-14 10:36:03.531	cmu13xtty003juejc0o5kxyj6	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:33:47.866
cmu13xtty003juejc0o5kxyj6	cmtv96x5n0057ue7wcl3a27w0	6ab9a94a4f4e7e4ca60971ac12ed9f287c9896d260ed57585530c349ceb8faf3	2026-10-14 10:36:03.525	2026-09-14 10:37:47.861	cmu1402bu003luejcwyefffun	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:36:03.526
cmu1402bu003luejcwyefffun	cmtv96x5n0057ue7wcl3a27w0	e4e2f4dec37c88b5c6ced1bb974873606c33f95da030d97e8f814e050fec8ec0	2026-10-14 10:37:47.849	2026-09-14 10:40:03.505	cmu142yzy003nuejccwcfulp8	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:37:47.85
cmu142yzy003nuejccwcfulp8	cmtv96x5n0057ue7wcl3a27w0	2ac9c3a9011dc03e7637b8b77610844aef482f5f6335bd606a63a20767a1c714	2026-10-14 10:40:03.501	2026-09-14 10:45:32.313	cmu14a0pf004huejcwpwzgkqq	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:40:03.502
cmu14a0pf004huejcwpwzgkqq	cmtv96x5n0057ue7wcl3a27w0	526af08245f6c37ecb2f1b59b2ac0f943ac00a404a0b520511d4fd8f2314e91a	2026-10-14 10:45:32.307	2026-09-14 10:48:22.863	cmu14dob0004juejczkjnn8cy	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:45:32.308
cmu14f5wd004luejcnas9c8jc	cmtv96x5n0057ue7wcl3a27w0	2ee2b555e1cb0b822cbfcfc886088049c16472e7627106e10545d978f0d2a614	2026-10-14 10:49:32.316	2026-09-14 10:52:22.892	cmu14itie004nuejce7b62a6e	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:49:32.317
cmu14dob0004juejczkjnn8cy	cmtv96x5n0057ue7wcl3a27w0	f1605ba5ceb4bfe6aa08e5e4ca3d3d2ed4add2ddd0188ab706437c67c568a4f2	2026-10-14 10:48:22.86	2026-09-14 10:49:32.321	cmu14f5wd004luejcnas9c8jc	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:48:22.861
cmu14qzvc004tuejc0gdrimqu	cmtv96x5n0057ue7wcl3a27w0	615e91f5bf9106462c2f655e60dd319fe9eb483ead61c4f9f55eee9b6a983feb	2026-10-14 10:58:44.376	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:58:44.377
cmu14itie004nuejce7b62a6e	cmtv96x5n0057ue7wcl3a27w0	fab05343e76dbe97c535277dd613941c80620caa373bfe1010097884a357e3d7	2026-10-14 10:52:22.886	2026-09-14 10:53:32.324	cmu14kb33004puejc69bw0i7w	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:52:22.886
cmu14kb33004puejc69bw0i7w	cmtv96x5n0057ue7wcl3a27w0	3f1e1611a301ffaa37a6d21ac60eac1018fb7bcda30878f6fd9e84d1388fba0f	2026-10-14 10:53:32.318	2026-09-14 10:56:22.885	cmu14nyos004ruejc288vd4a0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:53:32.318
cmu14nyos004ruejc288vd4a0	cmtv96x5n0057ue7wcl3a27w0	4fbb6c42d83887b793b2f0532e2400f627ee592cb85a66f87c0f74c8cf9f4d9f	2026-10-14 10:56:22.875	2026-09-14 10:58:44.38	cmu14qzvc004tuejc0gdrimqu	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 10:56:22.876
cmu8actfy085xue8irdi7zftg	cmtv96wx6000tue7wfg2rfzuu	d3c68d9c5f573e09e3361b73cd43aa7b3ebb1b25b8e3be0fd798157cd61e1378	2026-10-19 11:10:03.79	2026-09-19 11:14:03.727	cmu8ahyks0861ue8il0iyeui6	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:10:03.791
cmu17fz3x003lue735r8tl1xg	cmtv96x5n0057ue7wcl3a27w0	324219a51169b78af3fd6da92f6fca16e0beb1339056642533aa396c30d8e8b6	2026-10-14 12:14:09.021	2026-09-14 12:18:11.077	cmu17l5vl003pue73iz5i10nt	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:14:09.022
cmu8ah6u3085zue8ijlooalr1	cmtv96x5n0057ue7wcl3a27w0	93baa03ecd9945cd92f97697519284d643f12cbee95b071712053ab17b92003b	2026-10-19 11:13:27.77	2026-09-19 11:17:27.803	cmu8amc1j0863ue8i6ns9ppxg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:13:27.771
cmu17l5vl003pue73iz5i10nt	cmtv96x5n0057ue7wcl3a27w0	629deef1ac80296736dbcc2435645f299e8f42e7cc76172344baf62e63acf2cb	2026-10-14 12:18:11.073	2026-09-14 12:22:11.104	cmu17qb2v003rue73n858tdr8	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:18:11.074
cmu17qb2v003rue73n858tdr8	cmtv96x5n0057ue7wcl3a27w0	19afe9ca6b5ae4b07487e0dee75513ed407e99b29b05f97eac3c099ed94d213f	2026-10-14 12:22:11.095	2026-09-14 12:26:11.116	cmu17vg9y003juedqmomornn4	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:22:11.096
cmu17vg9y003juedqmomornn4	cmtv96x5n0057ue7wcl3a27w0	55cfeb0cd71020bdd7e81847fec3c6f85b5fbbe70963cc2484dd08a3e36d84d2	2026-10-14 12:26:11.11	2026-09-14 12:30:11.11	cmu180lge003luedqxib8ixy1	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:26:11.111
cmu180lge003luedqxib8ixy1	cmtv96x5n0057ue7wcl3a27w0	0ebe4475a5abeb3369381283fce83e6bd9458a80a1c79c03968bdb539c2b22ee	2026-10-14 12:30:11.102	2026-09-14 12:32:18.058	cmu183bev003nuedqwy0v3heb	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:30:11.103
cmu183bev003nuedqwy0v3heb	cmtv96x5n0057ue7wcl3a27w0	a0aa972f3cb99a9f0c3b3e0cbf545125d1465df7af24f76f544ba5b8b44961a4	2026-10-14 12:32:18.054	2026-09-14 12:34:11.08	cmu185qmd003puedq1dguorh1	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:32:18.055
cmu185qmd003puedq1dguorh1	cmtv96x5n0057ue7wcl3a27w0	07fbb3643f8826499edb005e44dec66a56c9ac30f61a4ed56d117a907e138ea5	2026-10-14 12:34:11.076	2026-09-14 12:36:18.056	cmu188glg003ruedq04dpm1hc	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:34:11.077
cmu188glg003ruedq04dpm1hc	cmtv96x5n0057ue7wcl3a27w0	9f96a2a53893cc9ce1596ea8818817245a28f8ae9e3e010297f4a68fc8d2f539	2026-10-14 12:36:18.051	2026-09-14 12:38:11.051	cmu18avs7003tuedq4xlrc3ab	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:36:18.052
cmu18avs7003tuedq4xlrc3ab	cmtv96x5n0057ue7wcl3a27w0	6592dde37a997a0b361f14889202b3e2cc80a422eab09f9d314f4264c24503f0	2026-10-14 12:38:11.046	2026-09-14 12:40:18.123	cmu18dltt003vuedql3tcw0r9	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:38:11.047
cmu18dltt003vuedql3tcw0r9	cmtv96x5n0057ue7wcl3a27w0	2f2333f87b4dc2934bf4191f70c30320442845fc3c1b1456a02d6fc3b7a76904	2026-10-14 12:40:18.112	2026-09-14 12:42:25.069	cmu18gbsa003xuedq2663111i	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:40:18.113
cmu18gbsa003xuedq2663111i	cmtv96x5n0057ue7wcl3a27w0	e0435ce594506a647fe6f066004a7d9c1a9483b90b13111fd3093118208e0d87	2026-10-14 12:42:25.065	2026-09-14 12:49:22.06	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:42:25.066
cmu18phl60045uedqpvt05fnd	cmtv96x5n0057ue7wcl3a27w0	6860804a8aae3a6414d24976818f145891e6d76ddb48b2fa401c2201e134cc4d	2026-10-14 12:49:32.49	2026-09-14 12:53:34.23	cmu18uo430047uedqbkjbzy49	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:49:32.49
cmu18uo430047uedqbkjbzy49	cmtv96x5n0057ue7wcl3a27w0	3f68ed06318c0ee50f47d9c82e0e1d7114a110c8458418f45ce9e51f91cb7897	2026-10-14 12:53:34.226	2026-09-14 12:56:48.055	cmu18yto40049uedqy5vp4y1g	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:53:34.227
cmu18yto40049uedqy5vp4y1g	cmtv96x5n0057ue7wcl3a27w0	fb9deaad269c0d22dd0d18f497aeb98c8b3b0697b2988fe6455eed1a37113d05	2026-10-14 12:56:48.051	2026-09-14 12:57:35.051	cmu18ztxh004buedqo83qj3ve	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:56:48.052
cmu18ztxh004buedqo83qj3ve	cmtv96x5n0057ue7wcl3a27w0	cdbadfefab81d7b268e73ad98fa60fa67c960d7b7acea2ff3cf4c5d34d03b8b4	2026-10-14 12:57:35.045	2026-09-14 13:00:48.04	cmu193yua004duedqorv5sa36	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 12:57:35.046
cmu193yua004duedqorv5sa36	cmtv96x5n0057ue7wcl3a27w0	4b20d874f7eb90a49d43eb113612de836e8d8cf7515f62194cb9d7a044240ea4	2026-10-14 13:00:48.033	2026-09-14 13:00:59.357	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:00:48.034
cmu195g8l004vuedqgl1orzna	cmtv96x5n0057ue7wcl3a27w0	77348f516028445b66c7aa9604b9e9b2374d3454e84278694697d3257db30027	2026-10-14 13:01:57.237	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:01:57.237
cmu8ac1om085vue8i1do95oyc	cmtv96x5n0057ue7wcl3a27w0	89e7b52486575cd17112b17f349bdfa5be49b968d231e219be1eab06c695ecc5	2026-10-19 11:09:27.811	2026-09-19 11:13:27.775	cmu8ah6u3085zue8ijlooalr1	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:09:27.815
cmu1a146k003luevqo1oz5aoa	cmtv96x5n0057ue7wcl3a27w0	8e4a42b0e137172d071d8df8d6d442c08b2c5e4e216945fa9a82d555da85b1b6	2026-10-14 13:26:34.604	2026-09-14 13:30:37.015	cmu1a6b81003nuevqvfa3xxrl	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:26:34.604
cmu1a6b81003nuevqvfa3xxrl	cmtv96x5n0057ue7wcl3a27w0	2e773acef2c791694292c125bebe283e63c633dfbacb2ac83c031e02be19a222	2026-10-14 13:30:37.008	2026-09-14 13:31:28.002	cmu1a7eka003puevqvq8diruz	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:30:37.009
cmu1a7eka003puevqvq8diruz	cmtv96x5n0057ue7wcl3a27w0	ced966a758d1e54fcdf2ae8ec617c97053a75739156116b1b16ec49aee78d2eb	2026-10-14 13:31:27.993	2026-09-14 13:34:37.02	cmu1abgev003ruevqe85j8bfm	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:31:27.994
cmu1abgev003ruevqe85j8bfm	cmtv96x5n0057ue7wcl3a27w0	e720a68864071f0b6997c5d982226ad111cf6828a4f8defcecd6dee591898cb1	2026-10-14 13:34:37.015	2026-09-14 13:35:28.001	cmu1acjqw003tuevqp3ccmzut	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:34:37.015
cmu1acjqw003tuevqp3ccmzut	cmtv96x5n0057ue7wcl3a27w0	28a3a92ea87d3fc702aeb1d87660bc27b2acc8bbcd3b8ca9a4cb10b1b74f9715	2026-10-14 13:35:27.991	2026-09-14 13:38:37.021	cmu1agllj003vuevqssj69wb5	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:35:27.992
cmu1agllj003vuevqssj69wb5	cmtv96x5n0057ue7wcl3a27w0	e4575d975fa72f9d4c7cd815c85bf8b14a69799033fb1af0c17dd135d90cf6b6	2026-10-14 13:38:37.014	2026-09-14 13:39:28.003	cmu1ahoxo003xuevq004uoaqq	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:38:37.015
cmu1ahoxo003xuevq004uoaqq	cmtv96x5n0057ue7wcl3a27w0	449b3b923c187f787174bb5ab51687fa3c82871c6db6abc4338946023ad92b40	2026-10-14 13:39:27.996	2026-09-14 13:42:37.008	cmu1alqrq003zuevq5zvzb4uj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:39:27.997
cmu1alqrq003zuevq5zvzb4uj	cmtv96x5n0057ue7wcl3a27w0	c8efd9cb5799219fe4744f0cb4542b48182c5f52e34b0a8ff87da2f9360b0621	2026-10-14 13:42:36.997	2026-09-14 13:43:28.013	cmu1amu4q0041uevqyzuzty1d	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:42:36.998
cmu1amu4q0041uevqyzuzty1d	cmtv96x5n0057ue7wcl3a27w0	7f0065b8cf0f2102f1788a2ca7093b764fbe6bc3c13b2db86d2093c6427e37df	2026-10-14 13:43:28.01	2026-09-14 13:46:37.016	cmu1aqvyo0043uevq31h5wg3m	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:43:28.01
cmu1aqvyo0043uevq31h5wg3m	cmtv96x5n0057ue7wcl3a27w0	c0b68f274ab3e61089f858675555acf13de75b794e13defff0018ede6b06a119	2026-10-14 13:46:37.007	2026-09-14 13:47:28.012	cmu1arzbc0045uevqodnzytj0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:46:37.008
cmu1arzbc0045uevqodnzytj0	cmtv96x5n0057ue7wcl3a27w0	e42f3a0169f51c48ae2e6d3f20bd381f82fc3727c7107adcd9855c54030346c8	2026-10-14 13:47:28.008	2026-09-14 13:50:37.018	cmu1aw15e004fuevqvjfxidx0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:47:28.009
cmu1aw15e004fuevqvjfxidx0	cmtv96x5n0057ue7wcl3a27w0	984dab6283f9255626051a05705f0e25cf38339eb23c90fd176fc254cddde581	2026-10-14 13:50:37.01	2026-09-14 13:51:28.034	cmu1ax4ij004huevqy4g2io2m	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:50:37.011
cmu1ax4ij004huevqy4g2io2m	cmtv96x5n0057ue7wcl3a27w0	11350f4945d049a6b5fa2319a3858045a658760f8be9c41c624ef49e935c55d8	2026-10-14 13:51:28.027	2026-09-14 13:57:08	cmu1b4ety004vuevq3im26ug9	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:51:28.028
cmu1b4ety004vuevq3im26ug9	cmtv96x5n0057ue7wcl3a27w0	46eb9d96c1f24fe373499e385f5ec58ce2d7c87562c0453396b5adb7e548a879	2026-10-14 13:57:07.99	2026-09-14 13:57:35.019	cmu1b4zom004xuevqwklik44d	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:57:07.991
cmu1b4zom004xuevqwklik44d	cmtv96x5n0057ue7wcl3a27w0	6531b53efcb990f5daba122423ea0cd165c38c07229ca4b3ddc6b8dd53a3a485	2026-10-14 13:57:35.014	2026-09-14 14:01:08.055	cmu1b9k27004zuevqtjpooavh	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 13:57:35.015
cmu1b9k27004zuevqtjpooavh	cmtv96x5n0057ue7wcl3a27w0	b856803c1dbe9fe9023a623a92df2b1cf7bedccebf7f538b4f968207372e5fd8	2026-10-14 14:01:08.047	2026-09-14 14:01:35.019	cmu1ba4vc0051uevqjmkfcwpb	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:01:08.048
cmu1ba4vc0051uevqjmkfcwpb	cmtv96x5n0057ue7wcl3a27w0	4d8c55cbaa46d411b24b04229f1ee4bee3940ea44b6b4524d67e3811ef9878dc	2026-10-14 14:01:35.015	2026-09-14 14:05:08.044	cmu1bep8l0053uevq7jfzi9hh	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:01:35.016
cmu1bep8l0053uevq7jfzi9hh	cmtv96x5n0057ue7wcl3a27w0	48cf76cf531fd822f9d9622bdbdabb417227ec65247e9cf20c7f8a3c816398c8	2026-10-14 14:05:08.037	2026-09-14 14:05:35.044	cmu1bfa2o0055uevqczc0ovdo	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:05:08.038
cmu1bfa2o0055uevqczc0ovdo	cmtv96x5n0057ue7wcl3a27w0	5051ba5a839204a4d216cc939404d45afaa2a732ccc23c2113718f335aa2b489	2026-10-14 14:05:35.039	2026-09-14 14:09:08.059	cmu1bjufr0057uevqajuqsqar	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:05:35.04
cmu1bjufr0057uevqajuqsqar	cmtv96x5n0057ue7wcl3a27w0	0221fc500fc4e294c5b4675aca2217a1a969f8d30a88c3c8d1960232a8db61be	2026-10-14 14:09:08.055	2026-09-14 14:09:35.042	cmu1bkf9a0059uevq7qxqfo8d	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:09:08.055
cmu1bozm5005buevqlsb96ohl	cmtv96x5n0057ue7wcl3a27w0	71b1f3d18fd966dcb9446604090255b8a44ea5ab086cd7f92bbd4f894e225cd1	2026-10-14 14:13:08.044	2026-09-14 14:13:35.045	cmu1bpkg1005duevqvrddl3k3	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:13:08.045
cmu1bkf9a0059uevq7qxqfo8d	cmtv96x5n0057ue7wcl3a27w0	2a2716cdb1ee927d4ac983d9eb7078a18118e64dfdfc1504b27a9d4cd323dc32	2026-10-14 14:09:35.038	2026-09-14 14:13:08.049	cmu1bozm5005buevqlsb96ohl	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:09:35.038
cmu1f7bi70047ue5luapo45o2	cmtv96x5n0057ue7wcl3a27w0	1ab8b81ad75cbe560a8600797d01648a21cbb5ed300615e492458fc21a46fb3b	2026-10-14 15:51:22.111	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:51:22.112
cmu1bpkg1005duevqvrddl3k3	cmtv96x5n0057ue7wcl3a27w0	ee21d7da85ed369ecbabc8236a97c9f0bbe1f1490e5c9f2f15e53bcb2a5ab007	2026-10-14 14:13:35.04	2026-09-14 14:17:08.074	cmu1bu4te005fuevq63ndd0qj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:13:35.041
cmu8ahyks0861ue8il0iyeui6	cmtv96wx6000tue7wfg2rfzuu	fe2f74aeb7f888142dbb1f67b4b6637a1aa5229aef5c70471e6dd519b2cf5fc0	2026-10-19 11:14:03.723	2026-09-19 11:18:03.754	cmu8an3s70865ue8iudr7myk5	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:14:03.724
cmu1bu4te005fuevq63ndd0qj	cmtv96x5n0057ue7wcl3a27w0	3b45aad844da6bc81ca67b3f01f683808ca8d4c778d77b7a62e461bd24239044	2026-10-14 14:17:08.066	2026-09-14 14:17:35.05	cmu1bupmr005huevqbx4lr5r0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:17:08.066
cmu1bupmr005huevqbx4lr5r0	cmtv96x5n0057ue7wcl3a27w0	c3d7157f7ca35abbcc1327347a3a83262e3697759fa61db6725c2b077f802641	2026-10-14 14:17:35.043	2026-09-14 14:21:22.072	cmu1bzksx005juevq46h0ozfb	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:17:35.043
cmu1bzksx005juevq46h0ozfb	cmtv96x5n0057ue7wcl3a27w0	a8477ddd531232c2826af34da00ce0f35be555d4030a41fc832d32ac74ad144d	2026-10-14 14:21:22.064	2026-09-14 14:22:22.077	cmu1c0v3q005luevq4o2vbot8	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:21:22.065
cmu1c0v3q005luevq4o2vbot8	cmtv96x5n0057ue7wcl3a27w0	71a8b835d574c340e7861c84e60995504ae473c64e2d55954e07ae3ac902cc82	2026-10-14 14:22:22.069	2026-09-14 14:25:22.069	cmu1c4pzj005nuevq5bhn6pqp	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:22:22.07
cmu1c4pzj005nuevq5bhn6pqp	cmtv96x5n0057ue7wcl3a27w0	e58d21d5be8c624ef6f82eed8a96ee9cb631e4b9ec17f9cd75e1faf46d26d89b	2026-10-14 14:25:22.062	2026-09-14 14:26:22.062	cmu1c609z005puevqqcdjwmaf	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:25:22.063
cmu1c609z005puevqqcdjwmaf	cmtv96x5n0057ue7wcl3a27w0	547d4ffa9665616c747d51d9a235f4409b58e061612463349519a7e7f8e7b509	2026-10-14 14:26:22.054	2026-09-14 14:30:22.101	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 14:26:22.055
cmu1e5skf003lues17w5lb61w	cmtv96x5n0057ue7wcl3a27w0	08ae26b6e7ce3ed67b9e8890ae3799aa7668723e96db0d48c0f93b89d3cea024	2026-10-14 15:22:11.295	2026-09-14 15:26:27.083	cmu1eb9xi003jue5lq3ti3s36	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:22:11.296
cmu1eb9xi003jue5lq3ti3s36	cmtv96x5n0057ue7wcl3a27w0	c9101791aa68eb19b4ac6a54f1b76aa9c84a788628b8e55959c608b514b97d9d	2026-10-14 15:26:27.077	2026-09-14 15:26:34.401	cmu1ebfks003lue5le605cg7j	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:26:27.078
cmu1ebfks003lue5le605cg7j	cmtv96x5n0057ue7wcl3a27w0	374a84e3ec7048ca56d0c9afa910def24ab4f915c4f21bab835df6fd22b634dc	2026-10-14 15:26:34.395	2026-09-14 15:30:27.074	cmu1egf3z003nue5lip9bd6o9	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:26:34.396
cmu1egf3z003nue5lip9bd6o9	cmtv96x5n0057ue7wcl3a27w0	0c69cc76dc4c9350c174be325fdc9e33a9118c037727e2d6a8c834e8bf3f7fd2	2026-10-14 15:30:27.07	2026-09-14 15:30:35.055	cmu1egl9n003pue5lvnoatgjo	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:30:27.071
cmu1egl9n003pue5lvnoatgjo	cmtv96x5n0057ue7wcl3a27w0	adc1feed262df63a43d0e6597d183454ca4800a12e843474a71bf6825dadfcdb	2026-10-14 15:30:35.051	2026-09-14 15:34:27.064	cmu1elkac003rue5l92b8qcqs	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:30:35.052
cmu1elkac003rue5l92b8qcqs	cmtv96x5n0057ue7wcl3a27w0	07e229fcf353e09cb338a13f3fe271fa55b97264a17e1949dbb3aab07ed11c72	2026-10-14 15:34:27.06	2026-09-14 15:34:35.054	cmu1elqgb003tue5l2ext6127	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:34:27.061
cmu1elqgb003tue5l2ext6127	cmtv96x5n0057ue7wcl3a27w0	b7e7db88ff170d3a32a3e6a5707a019704a712dc5b71953fede8eed3b7cd0fe4	2026-10-14 15:34:35.051	2026-09-14 15:38:26.598	cmu1eqp3t003vue5lxne5lm0n	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:34:35.052
cmu1eqp3t003vue5lxne5lm0n	cmtv96x5n0057ue7wcl3a27w0	75e41538b08cdcc99932075ea9a0c4512967775f8856839f49b94be4526d043f	2026-10-14 15:38:26.584	2026-09-14 15:38:35.057	cmu1eqvn1003xue5lxd369wrg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:38:26.585
cmu1eqvn1003xue5lxd369wrg	cmtv96x5n0057ue7wcl3a27w0	9893ccc896ee121ee175824be20a1bfdfadc61a995089c7baa6a4ebb1d09f9de	2026-10-14 15:38:35.053	2026-09-14 15:42:27.091	cmu1evuoc003zue5l8lnavv1s	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:38:35.054
cmu1evuoc003zue5l8lnavv1s	cmtv96x5n0057ue7wcl3a27w0	8304db023c9610f83d84f49c907131aa4d91a0cde762fd8a88777fad8dbd26e9	2026-10-14 15:42:27.084	2026-09-14 15:42:35.079	cmu1ew0uc0041ue5la19b0xtm	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:42:27.084
cmu1ew0uc0041ue5la19b0xtm	cmtv96x5n0057ue7wcl3a27w0	e3b3ea5216d0ab53dcdce0f29035b7feeb814d6ad2ea0c3f808d18e225986e46	2026-10-14 15:42:35.076	2026-09-14 15:46:27.124	cmu1f0zvw0043ue5lguawx3ry	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:42:35.077
cmu1f0zvw0043ue5lguawx3ry	cmtv96x5n0057ue7wcl3a27w0	c863405313570df658bac81929c310b5f5182ae14df751b4a09dd51b8583a21e	2026-10-14 15:46:27.116	2026-09-14 15:46:35.081	cmu1f16120045ue5l0ls1n9al	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:46:27.117
cmu1f16120045ue5l0ls1n9al	cmtv96x5n0057ue7wcl3a27w0	49f321a8f1c30a42b69deeafc5a68200e79a1b777e93c58abeb7881cb2561d76	2026-10-14 15:46:35.077	2026-09-14 15:51:22.122	cmu1f7bid0049ue5l31w1ifm8	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:46:35.078
cmu1fhlur004fue5lhsfpri3u	cmtv96x5n0057ue7wcl3a27w0	789651efa9b9399aca5bf39cd93c0b74fab19f08aa31233a7d4ad72b09847251	2026-10-14 15:59:22.083	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:59:22.084
cmu1fmr1h004jue5lqmc5ka4f	cmtv96x5n0057ue7wcl3a27w0	0cae3230e05df4bb4629be1cdcdb1ef9ff5ea78e67047244b6631621174dd536	2026-10-14 16:03:22.085	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 16:03:22.086
cmu1f7bid0049ue5l31w1ifm8	cmtv96x5n0057ue7wcl3a27w0	29296728f29008a5dd7c24e6fb6673684be44a9fa065ecf5ec297921e78892a6	2026-10-14 15:51:22.116	2026-09-14 15:55:22.121	cmu1fcgoz004due5ltwbwifdo	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:51:22.117
cmu1fcgoz004due5ltwbwifdo	cmtv96x5n0057ue7wcl3a27w0	7f35c3096759f5df2b958312e347d583d1066ab72826d02ef86921fa13be05d1	2026-10-14 15:55:22.115	2026-09-14 15:59:22.091	cmu1fhlux004hue5l6b9ustke	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:55:22.116
cmu8amc1j0863ue8i6ns9ppxg	cmtv96x5n0057ue7wcl3a27w0	8a2e73f3a824c58927190d9105cecf31c5b7d36f5cc6915e88e4d3850ff847f6	2026-10-19 11:17:27.798	2026-09-19 11:21:27.733	cmu8arh6a0867ue8id1uk5pil	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:17:27.799
cmu1fhlux004hue5l6b9ustke	cmtv96x5n0057ue7wcl3a27w0	27a57a467c5798e3a021a6ccc7055e02c9fa245ec769774a4eae0771a6ff74f2	2026-10-14 15:59:22.089	2026-09-14 16:03:22.094	cmu1fmr1o004lue5l38ygclzs	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 15:59:22.089
cmu8an3s70865ue8iudr7myk5	cmtv96wx6000tue7wfg2rfzuu	65cc386cb4480c33d4ceb5af5ccc778dd61065f153cee6eb9bc8c345d4790541	2026-10-19 11:18:03.75	2026-09-19 11:22:03.804	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:18:03.751
cmu8arh6a0867ue8id1uk5pil	cmtv96x5n0057ue7wcl3a27w0	f2f18b719aed04d537acd6ff9baea11d35dbbae1c36ce29fc9fc5985a8f4bd4d	2026-10-19 11:21:27.729	2026-09-19 11:28:03.881	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-19 11:21:27.73
cmu1fmr1o004lue5l38ygclzs	cmtv96x5n0057ue7wcl3a27w0	c37d793e02ead2ad67da72acb78d37d13fd0fa0c8bd390183978b105fea6c0d1	2026-10-14 16:03:22.092	2026-09-14 16:07:22.104	cmu1frw8k004pue5lcrb5wal6	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 16:03:22.093
cmu1frw8k004pue5lcrb5wal6	cmtv96x5n0057ue7wcl3a27w0	826a22d725a222aaf07caa306f45e97bff08eb716d617d69d7d92e2fb80c3ecf	2026-10-14 16:07:22.1	2026-09-14 16:10:22.091	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 16:07:22.1
cmu1io74f004xue5laj8h0bde	cmtv96x5n0057ue7wcl3a27w0	4cf709523446af49edaa074c95a6fbbc2feb2d15b938d16c5bc2ad5efff877ab	2026-10-14 17:28:28.43	2026-09-14 17:32:31.205	cmu1iteg2004zue5lr96aam49	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:28:28.431
cmu1iteg2004zue5lr96aam49	cmtv96x5n0057ue7wcl3a27w0	50553df3352a4c105b77da8d3e0a729010ee12044a67a2d5e579dbfd4899257c	2026-10-14 17:32:31.201	2026-09-14 17:32:37.173	cmu1itj1v0051ue5l84icklun	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:32:31.202
cmu1itj1v0051ue5l84icklun	cmtv96x5n0057ue7wcl3a27w0	a2fc26233bc31dddc24e354a2cab829497d358761d1487d68cfa13dc60d69a19	2026-10-14 17:32:37.171	2026-09-14 17:36:31.214	cmu1iyjmt003jueor0h0ui19n	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:32:37.172
cmu1iyjmt003jueor0h0ui19n	cmtv96x5n0057ue7wcl3a27w0	405eaf465d2b5954332512b9cd5fe1032ac30c28b109263aa879967e5e8dca00	2026-10-14 17:36:31.205	2026-09-14 17:36:37.185	cmu1iyo8e003lueorunobwkvn	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:36:31.206
cmu1iyo8e003lueorunobwkvn	cmtv96x5n0057ue7wcl3a27w0	d3d2c6979bb32aa68735c12439557db8b65268ad19eb5959b5dea0272e39b479	2026-10-14 17:36:37.166	2026-09-14 17:40:31.211	cmu1j3otj003jue2jxndar3y8	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:36:37.167
cmu1j3otj003jue2jxndar3y8	cmtv96x5n0057ue7wcl3a27w0	03c4f2fa77743e7f4409e8b75d21776dc77552da600040e025838fe2f59666b1	2026-10-14 17:40:31.207	2026-09-14 17:40:37.188	cmu1j3tfl003lue2jmsvfbwx5	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:40:31.207
cmu1j3tfl003lue2jmsvfbwx5	cmtv96x5n0057ue7wcl3a27w0	7617ebfe0e31edb473f16a256a164eeb31d4559157e1c004180b7428981d4419	2026-10-14 17:40:37.184	2026-09-14 17:44:31.204	cmu1j8u01003nue2jgz9lp2wp	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:40:37.185
cmu1j8u01003nue2jgz9lp2wp	cmtv96x5n0057ue7wcl3a27w0	b9a5808ef5fa345c65e04a11b8fe77e16dd31167560c055ca80f2087a43ed96e	2026-10-14 17:44:31.2	2026-09-14 17:44:37.184	cmu1j8ylz003pue2j9bqcgclf	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:44:31.201
cmu1j8ylz003pue2j9bqcgclf	cmtv96x5n0057ue7wcl3a27w0	43508f7d16aa3059a0f2047ae2479de4d04e68804f1e85159a6835afd1e8bfd9	2026-10-14 17:44:37.175	2026-09-14 17:48:31.191	cmu1jdz69003rue2j1j4dnfkj	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:44:37.176
cmu1jdz69003rue2j1j4dnfkj	cmtv96x5n0057ue7wcl3a27w0	b42df2c594132679edfdb0d75d418bc962500201519a5dd2959e7c7697a08230	2026-10-14 17:48:31.184	2026-09-14 17:48:37.178	cmu1je3s6003tue2j1ojo4zdr	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:48:31.185
cmu1je3s6003tue2j1ojo4zdr	cmtv96x5n0057ue7wcl3a27w0	4315833e52bdcd3e985de265030ffefa361ae1ea8c7cd0b466166de2ae4c0f8b	2026-10-14 17:48:37.158	2026-09-14 17:52:31.194	cmu1jj4cy003vue2jy2y4n9eq	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:48:37.159
cmu1jj4cy003vue2jy2y4n9eq	cmtv96x5n0057ue7wcl3a27w0	aa683133255aa2a1a192f64cf857948c4ffa408c7140b8fa015a6362562cce24	2026-10-14 17:52:31.185	2026-09-14 17:52:37.172	cmu1jj8z6003xue2jedxsyidv	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:52:31.186
cmu1jj8z6003xue2jedxsyidv	cmtv96x5n0057ue7wcl3a27w0	a75f3dbe90cee0aa38ae124883d5bb589040d47dabe42417ada0731c32227f87	2026-10-14 17:52:37.17	2026-09-14 17:57:22.187	cmu1jpcw80041ue2joryg8ml1	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:52:37.17
cmu1jpcw80041ue2joryg8ml1	cmtv96x5n0057ue7wcl3a27w0	5a4c8b488325a701281aa57ef7bb85510b9ff2ca4ca8598ff400b5a4a9abf47f	2026-10-14 17:57:22.183	2026-09-14 18:02:22.219	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-14 17:57:22.184
cmu4dbi8k003luezjvyn0s1w2	cmtv96wx6000tue7wfg2rfzuu	af7185dadbddc4dc9635d06daa4ae4b786c8bc400062037609401cf0bc9ad7b2	2026-10-16 17:21:56.756	2026-09-16 17:22:11.399	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 17:21:56.757
cmu4g1oru0043uezjdb8t6381	cmtv96wx6000tue7wfg2rfzuu	2b5293610a447197f74bc7e4b590657ead16c7c781b4ac22249a0842ee92eecc	2026-10-16 18:38:17.514	2026-09-16 18:38:22.391	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:38:17.515
cmu4g44dg004cuezjjs93l7u2	cmu4g44d30048uezjgje091gp	37744380dbf0610421baf67177fa2e1ae7791d2b07ffaf5d1e907da976559c80	2026-10-16 18:40:11.044	2026-09-16 18:46:23.283	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:40:11.045
cmu2v4j3b003lueswynpdr70g	cmtv96x5n0057ue7wcl3a27w0	9f1534f3ff2443ec2c7f77c79ce387ab132341fde11b1f5498b09f5310beb4b7	2026-10-15 16:04:52.007	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-15 16:04:52.007
cmu4gc8dk004kuezj5p3w1q15	cmtv96x5n0057ue7wcl3a27w0	777608d20b6fea890ce10cac0e236820f3d2cb5ebba02348f9efc41b131d5fad	2026-10-16 18:46:29.48	2026-09-16 18:48:50.133	cmu4gf8wh004muezjzbxpfc56	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	2026-09-16 18:46:29.481
cmudqtflr0047ue6to8jdo8i3	cmtv96x5n0057ue7wcl3a27w0	d3c3ec4c97a4bc466f424afd583947e73b748e4efd424592a95b6ce4bcf9f53d	2026-10-23 06:49:43.742	2026-09-23 06:49:51.483	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 06:49:43.743
cmueck9dv0l6pue6tm1jma0he	cmtv96x5n0057ue7wcl3a27w0	66a7f61298351e95b77ecfa80789f682e8780baf86fd5098387748ae75395687	2026-10-23 16:58:27.331	2026-09-23 17:00:37.133	cmuecn1je0lqtue6t097xcwm9	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 16:58:27.331
cmu6z8kv3003luefs75wxyhiz	cmtv96x5n0057ue7wcl3a27w0	e728de9359ed55a6bcab40cd5529c7b1cdda153047e3633ae11c6ac34c17fd4c	2026-10-18 13:11:04.095	2026-09-18 13:15:06.086	cmu6zdrky003nuefs06sgljys	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:11:04.096
cmu6zdrky003nuefs06sgljys	cmtv96x5n0057ue7wcl3a27w0	73f65cedf60fad83157c188339088ce3dd5b26fb84e1584829c9e6f56d0fe80e	2026-10-18 13:15:06.081	2026-09-18 13:19:06.086	cmu6ziwrn003puefs1rxbpb3k	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:15:06.082
cmu6ziwrn003puefs1rxbpb3k	cmtv96x5n0057ue7wcl3a27w0	a4997f26817a22f0a36cf09622fe84b8ef0d7e389c6400b8e0ee80016179f1a0	2026-10-18 13:19:06.083	2026-09-18 13:23:06.735	cmu6zo2gb003ruefsuzwmj55k	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:19:06.083
cmu6zo2gb003ruefsuzwmj55k	cmtv96x5n0057ue7wcl3a27w0	b9de9de6a6f9d9dcd6a2438ebb72d79eaaef0121fc09942db98b8f9372c12188	2026-10-18 13:23:06.73	2026-09-18 13:27:06.857	cmu6zt7qc003tuefsfq2m8ne7	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:23:06.731
cmu6zt7qc003tuefsfq2m8ne7	cmtv96x5n0057ue7wcl3a27w0	c6e715a3b387bae79fa2cceeb4f26ff382063a88a76bc1d42a4910e893cd2ddc	2026-10-18 13:27:06.852	2026-09-18 13:31:06.868	cmu6zycxc003vuefsopo8kk2w	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:27:06.853
cmu6zycxc003vuefsopo8kk2w	cmtv96x5n0057ue7wcl3a27w0	16b3841b5fd34d4dc6f8e17275ba281f5e391fc1e9d48cc43d2d2a3c21449fe1	2026-10-18 13:31:06.863	2026-09-18 13:35:06.895	cmu703i4s003xuefsqcn10f9m	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:31:06.864
cmu703i4s003xuefsqcn10f9m	cmtv96x5n0057ue7wcl3a27w0	93acc75259444831421d86ba5c66492e4396cc83e3ac244ed0140f8fce676573	2026-10-18 13:35:06.891	2026-09-18 13:41:45.736	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:35:06.892
cmu70qpru0043uefsj2rotwzw	cmtv96x5n0057ue7wcl3a27w0	9437780763e58ad3ab5db716c81f11cddb78b6be43f6ad40678286af27431412	2026-10-18 13:53:09.882	2026-09-18 13:57:15.661	cmu70vzeu0045uefsq1rx0bfi	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:53:09.882
cmu70vzeu0045uefsq1rx0bfi	cmtv96x5n0057ue7wcl3a27w0	00b6256667a3adb278b113432ffc8e4a2ee58070417787ad79127662058021d3	2026-10-18 13:57:15.654	2026-09-18 14:08:29.224	cmu71af50004ruefslmyzsejg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 13:57:15.655
cmu717cbp0049uefs8btxlnkf	cmtv96wx6000tue7wfg2rfzuu	eea9b238f23097081c4d2f1bc1803e6a9c79b2248e7377a557c09fe02d389923	2026-10-18 14:06:05.604	2026-09-18 14:10:06.811	cmu71cifs004tuefsxx4c6ca5	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:06:05.605
cmu71af50004ruefslmyzsejg	cmtv96x5n0057ue7wcl3a27w0	edbbb405e5196c1b6df7316a9d5911e938e8740e44dcf8f47fedf6815c1a832d	2026-10-18 14:08:29.22	2026-09-18 14:12:29.737	cmu71fkpx004vuefsgiv243ab	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:08:29.221
cmu71cifs004tuefsxx4c6ca5	cmtv96wx6000tue7wfg2rfzuu	dd91a6c60c8b840c727bab2b1067ebe450ccb914141e6c1c425a51f38106304a	2026-10-18 14:10:06.807	2026-09-18 14:14:06.725	cmu71hnk3004xuefsj25kxpkm	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:10:06.808
cmu71hnk3004xuefsj25kxpkm	cmtv96wx6000tue7wfg2rfzuu	5242e24e36c63ae5e286c1ce32fa698a54d5bc855aef258d505a44fa1c8e1463	2026-10-18 14:14:06.722	2026-09-18 14:18:06.771	cmu71mss1004zuefs48x6lw6z	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:14:06.723
cmu71fkpx004vuefsgiv243ab	cmtv96x5n0057ue7wcl3a27w0	fd93b66d15b035264be80361c4fdaca1ff7d73980b098dfefbe3273b438920d5	2026-10-18 14:12:29.732	2026-09-18 14:22:05.755	cmu71rx6h0043ueyddkbfdl5u	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:12:29.733
cmu71rx6h0043ueyddkbfdl5u	cmtv96x5n0057ue7wcl3a27w0	754d5c1c80f9a3f42e90db53bf4e8cf2e58295d555bccad5cb2d683f00ef57e7	2026-10-18 14:22:05.752	2026-09-18 14:26:05.818	cmu71x2es009nue1zyoufnop0	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:22:05.753
cmu71rxzc0045ueydsmmn2sek	cmtv96wx6000tue7wfg2rfzuu	da2a2fd1de02b73cbbbe064e8722314e90970969a640db6fb591393810b29919	2026-10-18 14:22:06.792	2026-09-18 14:30:54.187	cmu7238x30043uekn47vpifg8	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:22:06.793
cmu71mss1004zuefs48x6lw6z	cmtv96wx6000tue7wfg2rfzuu	e09927e64559e2777f9f9eb2f6b47d5dfe6138a5cd3a10603cdeaa44b164fe45	2026-10-18 14:18:06.769	2026-09-18 14:22:06.795	cmu71rxzc0045ueydsmmn2sek	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:18:06.769
cmu728nes00e9ueokc1sbss29	cmtv96wx6000tue7wfg2rfzuu	10b0fb2fab91f38fcfe723462ec9f75f394f423e1a6da59166cce7e5138b6a75	2026-10-18 14:35:06.244	2026-09-18 14:39:06.249	cmu72dslh00l9ueokh707pvpx	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:35:06.245
cmu728hmd00e7ueokddkl9l7a	cmtv96x5n0057ue7wcl3a27w0	5cce0a4fec6056ccc78128e97a26daa0fa0110727a00a6ae5d054aba25ba8aff	2026-10-18 14:34:58.741	2026-09-18 14:39:59.966	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:34:58.742
cmu71x2es009nue1zyoufnop0	cmtv96x5n0057ue7wcl3a27w0	f9c9bf8b41ad00563ee70064c82ac1f140d289c128b4a12e6e1a0013bdd7c346	2026-10-18 14:26:05.812	2026-09-18 14:30:05.832	cmu7227lr00dlue1zjvkgnfk3	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:26:05.813
cmu7227lr00dlue1zjvkgnfk3	cmtv96x5n0057ue7wcl3a27w0	f85e1124b039fd70e2254ea217b5d9e44071f105f502641f58a0bda957592cf1	2026-10-18 14:30:05.823	2026-09-18 14:34:58.75	cmu728hmd00e7ueokddkl9l7a	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:30:05.824
cmudqtnwf006lue6tik9eirxm	cmtv96x5n0057ue7wcl3a27w0	20d300f905f402ca98a49ee5865b011ddba56d203b6b74132be29e309ba7e682	2026-10-23 06:49:54.495	2026-09-23 06:53:55.102	cmudqytjq00jzue6t8ix591c1	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 06:49:54.495
cmu7238x30043uekn47vpifg8	cmtv96wx6000tue7wfg2rfzuu	cbf5cc579ef72b6ea15c0bebc267413b9ef3b2b9baa2617253f55fe217b8231f	2026-10-18 14:30:54.183	2026-09-18 14:35:06.25	cmu728nes00e9ueokc1sbss29	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-18 14:30:54.184
cmuecn1je0lqtue6t097xcwm9	cmtv96x5n0057ue7wcl3a27w0	9b707e94da8f170e0e92fad55db01c7c4f060978096eebd0d89cf1f253215dea	2026-10-23 17:00:37.129	2026-09-23 17:02:27.175	cmuecpeg10m6kue6tquccn4tg	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 17:00:37.13
cmuecpeg10m6kue6tquccn4tg	cmtv96x5n0057ue7wcl3a27w0	87d3e10fba952f44b1f8ec34f58233996660e8919346ecb1089ebbd80777e967	2026-10-23 17:02:27.169	2026-09-23 17:06:27.233	cmuecujoe0nfmue6t2gtwbus2	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 17:02:27.17
cmue40sh10cv7ue6ti3plcnpl	cmtv96x5n0057ue7wcl3a27w0	3f2f163849604f69e6a3057af9ac7edc6d586b8f5f312fbc9f7376d61e903fcf	2026-10-23 12:59:22.02	2026-09-23 13:01:27.994	cmue43ho80cv9ue6teq7ts4yh	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 12:59:22.021
cmue43ho80cv9ue6teq7ts4yh	cmtv96x5n0057ue7wcl3a27w0	4bef4d66c42bd1aba9b578f32cb40a20a4fb91d95290aacc8aa7927f7af2498c	2026-10-23 13:01:27.992	2026-09-23 13:03:21.618	cmue45xce0cvbue6t67u9v1y9	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:01:27.992
cmue45xce0cvbue6t67u9v1y9	cmtv96x5n0057ue7wcl3a27w0	bfb029315a12ffaa02bdd2bd18c0a7b4849efc0a157ee22afada4e15b35108fe	2026-10-23 13:03:21.614	2026-09-23 13:05:28.023	cmue48mvn0cvdue6t2yu3hanz	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-23 13:03:21.614
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions (id, "roleId", "permissionId", "createdAt") FROM stdin;
cmtv96wxk0010ue7wjnjhcjot	cmtv96wxh000yue7wbvlbpd58	cmtv96wp70000ue7wkf5k9yvn	2026-09-10 08:16:28.472
cmtv96wxn0012ue7wt5wbrtru	cmtv96wxh000yue7wbvlbpd58	cmtv96wpc0001ue7wx3gphs9i	2026-09-10 08:16:28.475
cmtv96wxo0014ue7wxt9uujox	cmtv96wxh000yue7wbvlbpd58	cmtv96wpe0002ue7wpdzandl9	2026-09-10 08:16:28.477
cmtv96wxq0016ue7wziejg3ya	cmtv96wxh000yue7wbvlbpd58	cmtv96wpg0003ue7wdqgpa1xy	2026-09-10 08:16:28.478
cmtv96wxs0018ue7wgq8l8m4p	cmtv96wxh000yue7wbvlbpd58	cmtv96wpi0004ue7wn0bxeer2	2026-09-10 08:16:28.48
cmtv96wxt001aue7w1be47cvj	cmtv96wxh000yue7wbvlbpd58	cmtv96wpk0005ue7wmkpnvtoj	2026-09-10 08:16:28.482
cmtv96wxv001cue7wcm2ds0gf	cmtv96wxh000yue7wbvlbpd58	cmtv96wpm0006ue7wcrsafo9h	2026-09-10 08:16:28.483
cmtv96wxw001eue7waxs8kli4	cmtv96wxh000yue7wbvlbpd58	cmtv96wpo0007ue7wxc8kufp6	2026-09-10 08:16:28.484
cmtv96wxx001gue7w70vkcc35	cmtv96wxh000yue7wbvlbpd58	cmtv96wpq0008ue7wscak5zoz	2026-09-10 08:16:28.486
cmtv96wxy001iue7wimul6p3k	cmtv96wxh000yue7wbvlbpd58	cmtv96wps0009ue7w3tpm099m	2026-09-10 08:16:28.487
cmtv96wxz001kue7wi5qssrrb	cmtv96wxh000yue7wbvlbpd58	cmtv96wpu000aue7w2sfz6iyp	2026-09-10 08:16:28.488
cmtv96wy0001mue7w2ncvysrp	cmtv96wxh000yue7wbvlbpd58	cmtv96wpw000bue7wmgzh2q5h	2026-09-10 08:16:28.489
cmtv96wy1001oue7wzu1rz93t	cmtv96wxh000yue7wbvlbpd58	cmtv96wpy000cue7we3p7i6ag	2026-09-10 08:16:28.49
cmtv96wy2001que7w5t6zncpq	cmtv96wxh000yue7wbvlbpd58	cmtv96wq0000due7wp5xckmfx	2026-09-10 08:16:28.491
cmtv96wy3001sue7w5i2b5z21	cmtv96wxh000yue7wbvlbpd58	cmtv96wq2000eue7wk21x493k	2026-09-10 08:16:28.492
cmtv96wy4001uue7wvmvwlsty	cmtv96wxh000yue7wbvlbpd58	cmtv96wq4000fue7wcyy0x91s	2026-09-10 08:16:28.493
cmtv96wy5001wue7wb8d71xjp	cmtv96wxh000yue7wbvlbpd58	cmtv96wq6000gue7wbqelijcv	2026-09-10 08:16:28.493
cmtv96wy6001yue7wxf16nslo	cmtv96wxh000yue7wbvlbpd58	cmtv96wq8000hue7wfen950xu	2026-09-10 08:16:28.495
cmtv96wy70020ue7w0sbirz3n	cmtv96wxh000yue7wbvlbpd58	cmtv96wqa000iue7wmxclcdy0	2026-09-10 08:16:28.495
cmtv96wy80022ue7wuxnwmeq5	cmtv96wxh000yue7wbvlbpd58	cmtv96wqc000jue7w79up3mzo	2026-09-10 08:16:28.496
cmtv96wy90024ue7wuguung8e	cmtv96wxh000yue7wbvlbpd58	cmtv96wqe000kue7wphae12et	2026-09-10 08:16:28.497
cmtv96wya0026ue7w4peb06fk	cmtv96wxh000yue7wbvlbpd58	cmtv96wqf000lue7wlsy1offg	2026-09-10 08:16:28.498
cmtv96wyb0028ue7wigwkkc9i	cmtv96wxh000yue7wbvlbpd58	cmtv96wqh000mue7wnih7aemu	2026-09-10 08:16:28.499
cmtv96wyc002aue7wp3t6igru	cmtv96wxh000yue7wbvlbpd58	cmtv96wqj000nue7wp6cln9nv	2026-09-10 08:16:28.5
cmtv96wyc002cue7wsneyhfqv	cmtv96wxh000yue7wbvlbpd58	cmtv96wql000oue7wlrv5wc0s	2026-09-10 08:16:28.501
cmtv96wyd002eue7w45bvmtbv	cmtv96wxh000yue7wbvlbpd58	cmtv96wqn000pue7wti72lfrq	2026-09-10 08:16:28.502
cmtv96wye002gue7w3vzlu4rl	cmtv96wxh000yue7wbvlbpd58	cmtv96wqp000que7wjld2xg01	2026-09-10 08:16:28.503
cmtv96wyf002iue7wawbbyk8c	cmtv96wxh000yue7wbvlbpd58	cmtv96wqr000rue7w1weeqly3	2026-09-10 08:16:28.503
cmtv96wyg002kue7weywn37f0	cmtv96wxh000yue7wbvlbpd58	cmtv96wqt000sue7w2omspfp6	2026-09-10 08:16:28.504
cmtv96wyi002oue7wb3zm3jz9	cmtv96wyh002mue7w8nxd6po7	cmtv96wp70000ue7wkf5k9yvn	2026-09-10 08:16:28.506
cmtv96wyj002que7wps4kkjlz	cmtv96wyh002mue7w8nxd6po7	cmtv96wpc0001ue7wx3gphs9i	2026-09-10 08:16:28.507
cmtv96wyj002sue7wau5lyaoo	cmtv96wyh002mue7w8nxd6po7	cmtv96wpe0002ue7wpdzandl9	2026-09-10 08:16:28.508
cmtv96wyk002uue7wvsocqftw	cmtv96wyh002mue7w8nxd6po7	cmtv96wpg0003ue7wdqgpa1xy	2026-09-10 08:16:28.509
cmtv96wyl002wue7wyqu4dhdk	cmtv96wyh002mue7w8nxd6po7	cmtv96wpi0004ue7wn0bxeer2	2026-09-10 08:16:28.51
cmtv96wym002yue7wfom8k9ur	cmtv96wyh002mue7w8nxd6po7	cmtv96wpk0005ue7wmkpnvtoj	2026-09-10 08:16:28.511
cmtv96wyn0030ue7whkwgta2u	cmtv96wyh002mue7w8nxd6po7	cmtv96wpm0006ue7wcrsafo9h	2026-09-10 08:16:28.512
cmtv96wyo0032ue7whrbfj3cj	cmtv96wyh002mue7w8nxd6po7	cmtv96wpo0007ue7wxc8kufp6	2026-09-10 08:16:28.512
cmtv96wyp0034ue7wooonzaus	cmtv96wyh002mue7w8nxd6po7	cmtv96wpq0008ue7wscak5zoz	2026-09-10 08:16:28.513
cmtv96wyq0036ue7wcb0mgzyo	cmtv96wyh002mue7w8nxd6po7	cmtv96wps0009ue7w3tpm099m	2026-09-10 08:16:28.514
cmtv96wyq0038ue7w95f9rks4	cmtv96wyh002mue7w8nxd6po7	cmtv96wpu000aue7w2sfz6iyp	2026-09-10 08:16:28.515
cmtv96wyr003aue7wv8matzlk	cmtv96wyh002mue7w8nxd6po7	cmtv96wpw000bue7wmgzh2q5h	2026-09-10 08:16:28.516
cmtv96wys003cue7ws6mv6osy	cmtv96wyh002mue7w8nxd6po7	cmtv96wpy000cue7we3p7i6ag	2026-09-10 08:16:28.517
cmtv96wyt003eue7wu4f6avks	cmtv96wyh002mue7w8nxd6po7	cmtv96wq0000due7wp5xckmfx	2026-09-10 08:16:28.518
cmtv96wyu003gue7wkqvf08ju	cmtv96wyh002mue7w8nxd6po7	cmtv96wq2000eue7wk21x493k	2026-09-10 08:16:28.519
cmtv96wyv003iue7w64rjzapf	cmtv96wyh002mue7w8nxd6po7	cmtv96wq4000fue7wcyy0x91s	2026-09-10 08:16:28.52
cmtv96wyw003kue7w3ezbtrhp	cmtv96wyh002mue7w8nxd6po7	cmtv96wq6000gue7wbqelijcv	2026-09-10 08:16:28.521
cmtv96wyx003mue7wwmsxqg2c	cmtv96wyh002mue7w8nxd6po7	cmtv96wq8000hue7wfen950xu	2026-09-10 08:16:28.521
cmtv96wyy003oue7wg3pz8fr0	cmtv96wyh002mue7w8nxd6po7	cmtv96wqa000iue7wmxclcdy0	2026-09-10 08:16:28.522
cmtv96wyz003que7wm3aheazq	cmtv96wyh002mue7w8nxd6po7	cmtv96wqc000jue7w79up3mzo	2026-09-10 08:16:28.523
cmtv96wz0003sue7ww8gilwl1	cmtv96wyh002mue7w8nxd6po7	cmtv96wqe000kue7wphae12et	2026-09-10 08:16:28.524
cmtv96wz0003uue7wd0ctaduz	cmtv96wyh002mue7w8nxd6po7	cmtv96wqf000lue7wlsy1offg	2026-09-10 08:16:28.525
cmtv96wz1003wue7wp8sez426	cmtv96wyh002mue7w8nxd6po7	cmtv96wqh000mue7wnih7aemu	2026-09-10 08:16:28.526
cmtv96wz2003yue7w0txkudp5	cmtv96wyh002mue7w8nxd6po7	cmtv96wqj000nue7wp6cln9nv	2026-09-10 08:16:28.527
cmtv96wz30040ue7wd7fd91c0	cmtv96wyh002mue7w8nxd6po7	cmtv96wqt000sue7w2omspfp6	2026-09-10 08:16:28.527
cmtv96wz50044ue7wzwssmare	cmtv96wz40042ue7wl8nbr0tt	cmtv96wp70000ue7wkf5k9yvn	2026-09-10 08:16:28.53
cmtv96wz60046ue7wih593flv	cmtv96wz40042ue7wl8nbr0tt	cmtv96wpi0004ue7wn0bxeer2	2026-09-10 08:16:28.531
cmtv96wz70048ue7w1unhzeoc	cmtv96wz40042ue7wl8nbr0tt	cmtv96wpq0008ue7wscak5zoz	2026-09-10 08:16:28.532
cmtv96wz8004aue7w4u8c2mnh	cmtv96wz40042ue7wl8nbr0tt	cmtv96wpu000aue7w2sfz6iyp	2026-09-10 08:16:28.533
cmtv96wz9004cue7wiyrnpayz	cmtv96wz40042ue7wl8nbr0tt	cmtv96wpy000cue7we3p7i6ag	2026-09-10 08:16:28.534
cmtv96wza004eue7w4ba8a98c	cmtv96wz40042ue7wl8nbr0tt	cmtv96wq0000due7wp5xckmfx	2026-09-10 08:16:28.535
cmtv96wzb004gue7wy2x1g4z3	cmtv96wz40042ue7wl8nbr0tt	cmtv96wq2000eue7wk21x493k	2026-09-10 08:16:28.535
cmtv96wzc004iue7wqjr1vz28	cmtv96wz40042ue7wl8nbr0tt	cmtv96wq6000gue7wbqelijcv	2026-09-10 08:16:28.536
cmtv96wze004mue7wkusk6369	cmtv96wzd004kue7wx3p2sybf	cmtv96wpy000cue7we3p7i6ag	2026-09-10 08:16:28.538
cmtv96wzf004oue7wlrelg23l	cmtv96wzd004kue7wx3p2sybf	cmtv96wq0000due7wp5xckmfx	2026-09-10 08:16:28.539
cmtv96wzf004que7wq5yxfqrv	cmtv96wzd004kue7wx3p2sybf	cmtv96wq2000eue7wk21x493k	2026-09-10 08:16:28.54
cmtv96wzg004sue7wfvx8sw6l	cmtv96wzd004kue7wx3p2sybf	cmtv96wqe000kue7wphae12et	2026-09-10 08:16:28.541
cmtv96wzh004uue7w45w0jw5n	cmtv96wzd004kue7wx3p2sybf	cmtv96wqf000lue7wlsy1offg	2026-09-10 08:16:28.542
cmtv96wzj004yue7wher0k26j	cmtv96wzi004wue7w51lndipk	cmtv96wp70000ue7wkf5k9yvn	2026-09-10 08:16:28.543
cmtv96wzk0050ue7w9o9y56zb	cmtv96wzi004wue7w51lndipk	cmtv96wpi0004ue7wn0bxeer2	2026-09-10 08:16:28.544
cmtv96wzl0052ue7wx8o04zus	cmtv96wzi004wue7w51lndipk	cmtv96wpq0008ue7wscak5zoz	2026-09-10 08:16:28.545
cmtv96wzm0054ue7wcawcjs5b	cmtv96wzi004wue7w51lndipk	cmtv96wq6000gue7wbqelijcv	2026-09-10 08:16:28.546
cmtzw37jl000jues570lq26xc	cmtzw37jk000hues5a1dhfiuz	cmtv96wp70000ue7wkf5k9yvn	2026-09-13 14:08:31.472
cmtzw37jl000kues5neozptu8	cmtzw37jk000hues5a1dhfiuz	cmtv96wpc0001ue7wx3gphs9i	2026-09-13 14:08:31.472
cmtzw37jl000lues5x3gwp5o6	cmtzw37jk000hues5a1dhfiuz	cmtv96wpe0002ue7wpdzandl9	2026-09-13 14:08:31.472
cmtzw37jl000mues5epmjwn8k	cmtzw37jk000hues5a1dhfiuz	cmtv96wpg0003ue7wdqgpa1xy	2026-09-13 14:08:31.472
cmtzw37jl000nues5v20wjbj8	cmtzw37jk000hues5a1dhfiuz	cmtv96wpi0004ue7wn0bxeer2	2026-09-13 14:08:31.472
cmtzw37jl000oues5o8u3iccu	cmtzw37jk000hues5a1dhfiuz	cmtv96wpk0005ue7wmkpnvtoj	2026-09-13 14:08:31.472
cmtzw37jl000pues5htbgc7rb	cmtzw37jk000hues5a1dhfiuz	cmtv96wpm0006ue7wcrsafo9h	2026-09-13 14:08:31.472
cmtzw37jl000ques5h0wg3pb6	cmtzw37jk000hues5a1dhfiuz	cmtv96wpo0007ue7wxc8kufp6	2026-09-13 14:08:31.472
cmtzw37jl000rues5k8zmfh6n	cmtzw37jk000hues5a1dhfiuz	cmtv96wpq0008ue7wscak5zoz	2026-09-13 14:08:31.472
cmtzw37jl000sues5m3uyrw35	cmtzw37jk000hues5a1dhfiuz	cmtv96wps0009ue7w3tpm099m	2026-09-13 14:08:31.472
cmtzw37jl000tues5agmulgkf	cmtzw37jk000hues5a1dhfiuz	cmtv96wpu000aue7w2sfz6iyp	2026-09-13 14:08:31.472
cmtzw37jl000uues543l1om84	cmtzw37jk000hues5a1dhfiuz	cmtv96wpw000bue7wmgzh2q5h	2026-09-13 14:08:31.472
cmtzw37jl000vues5ew953458	cmtzw37jk000hues5a1dhfiuz	cmtv96wpy000cue7we3p7i6ag	2026-09-13 14:08:31.472
cmtzw37jl000wues5x6fvtzhs	cmtzw37jk000hues5a1dhfiuz	cmtv96wq0000due7wp5xckmfx	2026-09-13 14:08:31.472
cmtzw37jl000xues5pm9qr6s1	cmtzw37jk000hues5a1dhfiuz	cmtv96wq2000eue7wk21x493k	2026-09-13 14:08:31.472
cmtzw37jl000yues5vnwv3a5w	cmtzw37jk000hues5a1dhfiuz	cmtv96wq4000fue7wcyy0x91s	2026-09-13 14:08:31.472
cmtzw37jl000zues5t3lfmd7h	cmtzw37jk000hues5a1dhfiuz	cmtv96wq6000gue7wbqelijcv	2026-09-13 14:08:31.472
cmtzw37jl0010ues53gndhqxx	cmtzw37jk000hues5a1dhfiuz	cmtv96wq8000hue7wfen950xu	2026-09-13 14:08:31.472
cmtzw37jl0011ues57ob8ymb8	cmtzw37jk000hues5a1dhfiuz	cmtv96wqa000iue7wmxclcdy0	2026-09-13 14:08:31.472
cmtzw37jl0012ues5y3uynawk	cmtzw37jk000hues5a1dhfiuz	cmtv96wqc000jue7w79up3mzo	2026-09-13 14:08:31.472
cmtzw37jl0013ues5xwj2beuo	cmtzw37jk000hues5a1dhfiuz	cmtv96wqe000kue7wphae12et	2026-09-13 14:08:31.472
cmtzw37jl0014ues5xgc3ehxr	cmtzw37jk000hues5a1dhfiuz	cmtv96wqf000lue7wlsy1offg	2026-09-13 14:08:31.472
cmtzw37jl0015ues5m9g0zsxr	cmtzw37jk000hues5a1dhfiuz	cmtv96wqh000mue7wnih7aemu	2026-09-13 14:08:31.472
cmtzw37jl0016ues5d9dr8kia	cmtzw37jk000hues5a1dhfiuz	cmtv96wqj000nue7wp6cln9nv	2026-09-13 14:08:31.472
cmtzw37jl0017ues51zb5gcnp	cmtzw37jk000hues5a1dhfiuz	cmtv96wqt000sue7w2omspfp6	2026-09-13 14:08:31.472
cmtzw37jl0018ues5fo7ablqi	cmtzw37jk000hues5a1dhfiuz	cmtzdx5ho0023ueeirsegmxep	2026-09-13 14:08:31.472
cmtzw37jl0019ues57qpgb43x	cmtzw37jk000hues5a1dhfiuz	cmtzdx5hp0024ueei7vyxlb4u	2026-09-13 14:08:31.472
cmtzw37jl001aues51aennz4w	cmtzw37jk000hues5a1dhfiuz	cmtzdx5hq0025ueeiu2nxbyh0	2026-09-13 14:08:31.472
cmtzw37jl001bues5gl4kn30a	cmtzw37jk000hues5a1dhfiuz	cmtzdx5hr0026ueeiafcs5t6p	2026-09-13 14:08:31.472
cmtzw37jl001cues5057dauow	cmtzw37jk000hues5a1dhfiuz	cmtyjfr4v000kue6l3miyje2n	2026-09-13 14:08:31.472
cmtzw37jl001dues5tvwn2881	cmtzw37jk000hues5a1dhfiuz	cmtyjfr4x000lue6lymqtqwri	2026-09-13 14:08:31.472
cmtzw37jl001eues5uv1tt7x1	cmtzw37jk000hues5a1dhfiuz	cmtyjfr50000mue6l0dbxe7ub	2026-09-13 14:08:31.472
cmtzw37jl001fues5cyfcb6wx	cmtzw37jk000hues5a1dhfiuz	cmtyjfr53000nue6lgei3psv3	2026-09-13 14:08:31.472
cmtzw37jl001gues573i3uonk	cmtzw37jk000hues5a1dhfiuz	cmtyjfr55000oue6l9zxig9go	2026-09-13 14:08:31.472
cmtzw37jl001hues5u8dctstv	cmtzw37jk000hues5a1dhfiuz	cmtyjfr57000pue6l4ug690s5	2026-09-13 14:08:31.472
cmtzw37jl001iues5y94lg662	cmtzw37jk000hues5a1dhfiuz	cmtylgo58000queqb3nv38iwo	2026-09-13 14:08:31.472
cmtzw37jl001jues5d4999qdf	cmtzw37jk000hues5a1dhfiuz	cmtylgo5e000rueqbj1ncy6fx	2026-09-13 14:08:31.472
cmtzw37jl001kues5lnjjtj3s	cmtzw37jk000hues5a1dhfiuz	cmtylgo5g000sueqbpvbo7hvx	2026-09-13 14:08:31.472
cmtzw37jl001lues5lkxx78xa	cmtzw37jk000hues5a1dhfiuz	cmtylgo5i000tueqbyuk6w0f8	2026-09-13 14:08:31.472
cmtzw37jl001mues5aejcqpmz	cmtzw37jk000hues5a1dhfiuz	cmtylx3ve000uue7dmegchwnr	2026-09-13 14:08:31.472
cmtzw37jl001nues5avjvg42v	cmtzw37jk000hues5a1dhfiuz	cmtylx3vg000vue7dgcmytvn9	2026-09-13 14:08:31.472
cmtzw37jl001oues5wk2qz9fx	cmtzw37jk000hues5a1dhfiuz	cmtylx3vi000wue7da17ngg44	2026-09-13 14:08:31.472
cmtzw37jl001pues5aalctra7	cmtzw37jk000hues5a1dhfiuz	cmtylx3vj000xue7dtxaphm2y	2026-09-13 14:08:31.472
cmtzw37jl001ques5cggv5wkr	cmtzw37jk000hues5a1dhfiuz	cmtylx3vl000yue7d39v8rvoj	2026-09-13 14:08:31.472
cmtzw37jl001rues55ce9doti	cmtzw37jk000hues5a1dhfiuz	cmtylx3vm000zue7d3ftz9x3t	2026-09-13 14:08:31.472
cmtzw37jl001sues5vl9xvh7l	cmtzw37jk000hues5a1dhfiuz	cmtylx3vo0010ue7djz1ulwi4	2026-09-13 14:08:31.472
cmtzw37jl001tues51cfp5rag	cmtzw37jk000hues5a1dhfiuz	cmtylx3vp0011ue7dkdmw0m33	2026-09-13 14:08:31.472
cmtzw37jl001uues5klcd452o	cmtzw37jk000hues5a1dhfiuz	cmtylx3vq0012ue7djc1f8pzp	2026-09-13 14:08:31.472
cmtzw37jl001vues5as4vrr74	cmtzw37jk000hues5a1dhfiuz	cmtylx3vs0013ue7d978wuw8l	2026-09-13 14:08:31.472
cmtzw37jl001wues5799ejvgb	cmtzw37jk000hues5a1dhfiuz	cmtylx3vt0014ue7d132kuvhl	2026-09-13 14:08:31.472
cmtzw37jl001xues5ihtcgky0	cmtzw37jk000hues5a1dhfiuz	cmtylx3vu0015ue7dpcw6eubt	2026-09-13 14:08:31.472
cmtzw37jl001yues5e4nles0y	cmtzw37jk000hues5a1dhfiuz	cmtylx3vw0016ue7dajokpiyl	2026-09-13 14:08:31.472
cmtzw37jl001zues5gjhhn9ay	cmtzw37jk000hues5a1dhfiuz	cmtylx3vx0017ue7dsgsp43g4	2026-09-13 14:08:31.472
cmtzw37jl0020ues5jcdyedim	cmtzw37jk000hues5a1dhfiuz	cmtylx3vy0018ue7dqkwbhgve	2026-09-13 14:08:31.472
cmtzw37jl0021ues5boba60on	cmtzw37jk000hues5a1dhfiuz	cmtylx3w00019ue7dwfb55ji7	2026-09-13 14:08:31.472
cmtzw37jl0022ues5g3od8hc0	cmtzw37jk000hues5a1dhfiuz	cmtylx3w1001aue7df19ww36o	2026-09-13 14:08:31.472
cmtzw37jl0023ues5i1k55ylg	cmtzw37jk000hues5a1dhfiuz	cmtylx3w2001bue7dz05meqvz	2026-09-13 14:08:31.472
cmtzw37jl0024ues5dyl264xy	cmtzw37jk000hues5a1dhfiuz	cmtylx3w3001cue7dvh4o4go0	2026-09-13 14:08:31.472
cmtzw37jl0025ues532trjaec	cmtzw37jk000hues5a1dhfiuz	cmtylx3w5001due7d3cz3it6f	2026-09-13 14:08:31.472
cmtzw37jl0026ues59dls1aiy	cmtzw37jk000hues5a1dhfiuz	cmtylx3w6001eue7d96vw878b	2026-09-13 14:08:31.472
cmtzw37jl0027ues5673av5qb	cmtzw37jk000hues5a1dhfiuz	cmtylx3w7001fue7djkhdfems	2026-09-13 14:08:31.472
cmtzw37jl0028ues5qjvpsl1j	cmtzw37jk000hues5a1dhfiuz	cmtylx3w8001gue7d78ky88m3	2026-09-13 14:08:31.472
cmtzw37jl0029ues5qfx09bbs	cmtzw37jk000hues5a1dhfiuz	cmtylx3w9001hue7drxbp3pn4	2026-09-13 14:08:31.472
cmtzw37jl002aues5jpkg08ys	cmtzw37jk000hues5a1dhfiuz	cmtylx3wb001iue7dk7dyjdpr	2026-09-13 14:08:31.472
cmtzw37jl002bues5km2r8xai	cmtzw37jk000hues5a1dhfiuz	cmtylx3wc001jue7dm3lw532r	2026-09-13 14:08:31.472
cmtzw37jl002cues5my49p3mc	cmtzw37jk000hues5a1dhfiuz	cmtylx3wd001kue7dn2heinif	2026-09-13 14:08:31.472
cmtzw37jl002dues5hvodv6su	cmtzw37jk000hues5a1dhfiuz	cmtylx3wf001lue7dqixnf5gm	2026-09-13 14:08:31.472
cmtzw37jl002eues5v0f4skze	cmtzw37jk000hues5a1dhfiuz	cmtymku83001mueyphlm5ha32	2026-09-13 14:08:31.472
cmtzw37jl002fues5e1mrdmub	cmtzw37jk000hues5a1dhfiuz	cmtymku8a001nueypnj227eem	2026-09-13 14:08:31.472
cmtzw37jl002gues5uo0fvml0	cmtzw37jk000hues5a1dhfiuz	cmtymku8c001oueypamuta8b4	2026-09-13 14:08:31.472
cmtzw37jl002hues5futzv3c7	cmtzw37jk000hues5a1dhfiuz	cmtymku8d001pueypsm31kerv	2026-09-13 14:08:31.472
cmtzw37jl002iues5khb8ro2w	cmtzw37jk000hues5a1dhfiuz	cmtymvm4a001quemugn59be8f	2026-09-13 14:08:31.472
cmtzw37jl002jues558nqbj6h	cmtzw37jk000hues5a1dhfiuz	cmtymvm4h001ruemua9x74voq	2026-09-13 14:08:31.472
cmtzw37jl002kues5xa0xfyrd	cmtzw37jk000hues5a1dhfiuz	cmtymvm4j001suemu8zgtvdxq	2026-09-13 14:08:31.472
cmtzw37jl002lues5rskbjww5	cmtzw37jk000hues5a1dhfiuz	cmtymvm4k001tuemuw85qj03j	2026-09-13 14:08:31.472
cmtzw37jl002mues5h2sypzx3	cmtzw37jk000hues5a1dhfiuz	cmtynichw001uuedpfi74idyq	2026-09-13 14:08:31.472
cmtzw37jl002nues5ppaqczpi	cmtzw37jk000hues5a1dhfiuz	cmtv96wql000oue7wlrv5wc0s	2026-09-13 14:08:31.472
cmtzw37jl002oues5ro6wazgg	cmtzw37jk000hues5a1dhfiuz	cmtv96wqn000pue7wti72lfrq	2026-09-13 14:08:31.472
cmtzw37jl002pues5jgyu3syd	cmtzw37jk000hues5a1dhfiuz	cmtv96wqp000que7wjld2xg01	2026-09-13 14:08:31.472
cmtzw37jl002ques5tgly9ns7	cmtzw37jk000hues5a1dhfiuz	cmtv96wqr000rue7w1weeqly3	2026-09-13 14:08:31.472
cmtyh4trb0031uebk6euhwo5y	cmtyh4tra0030uebk1ctq2tsa	cmtv96wp70000ue7wkf5k9yvn	2026-09-12 14:22:06.504
cmtyh4trb0032uebkozk0b96t	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpc0001ue7wx3gphs9i	2026-09-12 14:22:06.504
cmtyh4trb0033uebk60cztorx	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpe0002ue7wpdzandl9	2026-09-12 14:22:06.504
cmtyh4trb0034uebkvahk4mwd	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpg0003ue7wdqgpa1xy	2026-09-12 14:22:06.504
cmtyh4trb0035uebkjy11wbqz	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpi0004ue7wn0bxeer2	2026-09-12 14:22:06.504
cmtyh4trc0036uebkot7oy9hv	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpk0005ue7wmkpnvtoj	2026-09-12 14:22:06.504
cmtyh4trc0037uebk8zx1dw9u	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpm0006ue7wcrsafo9h	2026-09-12 14:22:06.504
cmtyh4trc0038uebkhsk664sk	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpo0007ue7wxc8kufp6	2026-09-12 14:22:06.504
cmtyh4trc0039uebknpc0jx6u	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpq0008ue7wscak5zoz	2026-09-12 14:22:06.504
cmtyh4trc003auebkn0yslagu	cmtyh4tra0030uebk1ctq2tsa	cmtv96wps0009ue7w3tpm099m	2026-09-12 14:22:06.504
cmtyh4trc003buebkdjfxcbhm	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpu000aue7w2sfz6iyp	2026-09-12 14:22:06.504
cmtyh4trc003cuebkuvnejck4	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpw000bue7wmgzh2q5h	2026-09-12 14:22:06.504
cmtyh4trc003duebkm8uc0lqs	cmtyh4tra0030uebk1ctq2tsa	cmtv96wpy000cue7we3p7i6ag	2026-09-12 14:22:06.504
cmtyh4trc003euebk05w4dy02	cmtyh4tra0030uebk1ctq2tsa	cmtv96wq0000due7wp5xckmfx	2026-09-12 14:22:06.504
cmtyh4trc003fuebk3o9g8j8h	cmtyh4tra0030uebk1ctq2tsa	cmtv96wq2000eue7wk21x493k	2026-09-12 14:22:06.504
cmtyh4trc003guebkpfwx9l1y	cmtyh4tra0030uebk1ctq2tsa	cmtv96wq4000fue7wcyy0x91s	2026-09-12 14:22:06.504
cmtyh4trc003huebkjbuf1rgp	cmtyh4tra0030uebk1ctq2tsa	cmtv96wq6000gue7wbqelijcv	2026-09-12 14:22:06.504
cmtyh4trc003iuebk32fsbxrb	cmtyh4tra0030uebk1ctq2tsa	cmtv96wq8000hue7wfen950xu	2026-09-12 14:22:06.504
cmtyh4trc003juebkzxu48lda	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqa000iue7wmxclcdy0	2026-09-12 14:22:06.504
cmtyh4trc003kuebkfxqzeq6b	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqc000jue7w79up3mzo	2026-09-12 14:22:06.504
cmtyh4trc003luebkq26zd2th	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqe000kue7wphae12et	2026-09-12 14:22:06.504
cmtyh4trc003muebk05mbx0pg	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqf000lue7wlsy1offg	2026-09-12 14:22:06.504
cmtyh4trc003nuebk8rj9upci	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqh000mue7wnih7aemu	2026-09-12 14:22:06.504
cmtyh4trc003ouebkvmsq8i28	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqj000nue7wp6cln9nv	2026-09-12 14:22:06.504
cmtyh4trc003puebkzlga56vv	cmtyh4tra0030uebk1ctq2tsa	cmtv96wql000oue7wlrv5wc0s	2026-09-12 14:22:06.504
cmtyh4trc003quebkksehgvzm	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqn000pue7wti72lfrq	2026-09-12 14:22:06.504
cmtyh4trc003ruebkb8pi8dmz	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqp000que7wjld2xg01	2026-09-12 14:22:06.504
cmtyh4trc003suebkdfkktyi6	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqr000rue7w1weeqly3	2026-09-12 14:22:06.504
cmtyh4trc003tuebkmacpjkht	cmtyh4tra0030uebk1ctq2tsa	cmtv96wqt000sue7w2omspfp6	2026-09-12 14:22:06.504
cmtyh4trg003wuebkfmoedtbo	cmtyh4trf003vuebkp9agdobo	cmtv96wp70000ue7wkf5k9yvn	2026-09-12 14:22:06.509
cmtyh4trg003xuebklzh8buwa	cmtyh4trf003vuebkp9agdobo	cmtv96wpc0001ue7wx3gphs9i	2026-09-12 14:22:06.509
cmtyh4trg003yuebksw1hlbhv	cmtyh4trf003vuebkp9agdobo	cmtv96wpe0002ue7wpdzandl9	2026-09-12 14:22:06.509
cmtyh4trg003zuebkpfawk3fl	cmtyh4trf003vuebkp9agdobo	cmtv96wpg0003ue7wdqgpa1xy	2026-09-12 14:22:06.509
cmtyh4trg0040uebk0byvi6g2	cmtyh4trf003vuebkp9agdobo	cmtv96wpi0004ue7wn0bxeer2	2026-09-12 14:22:06.509
cmtyh4trg0041uebkwzvvngg8	cmtyh4trf003vuebkp9agdobo	cmtv96wpk0005ue7wmkpnvtoj	2026-09-12 14:22:06.509
cmtyh4trg0042uebk56me9uzq	cmtyh4trf003vuebkp9agdobo	cmtv96wpm0006ue7wcrsafo9h	2026-09-12 14:22:06.509
cmtyh4trg0043uebk84s7wrbb	cmtyh4trf003vuebkp9agdobo	cmtv96wpo0007ue7wxc8kufp6	2026-09-12 14:22:06.509
cmtyh4trg0044uebkdkze3ogf	cmtyh4trf003vuebkp9agdobo	cmtv96wpq0008ue7wscak5zoz	2026-09-12 14:22:06.509
cmtyh4trg0045uebkq7odforw	cmtyh4trf003vuebkp9agdobo	cmtv96wps0009ue7w3tpm099m	2026-09-12 14:22:06.509
cmtyh4trg0046uebk7qp05oxv	cmtyh4trf003vuebkp9agdobo	cmtv96wpu000aue7w2sfz6iyp	2026-09-12 14:22:06.509
cmtyh4trg0047uebkfo4izkr0	cmtyh4trf003vuebkp9agdobo	cmtv96wpw000bue7wmgzh2q5h	2026-09-12 14:22:06.509
cmtyh4trg0048uebkv9s47o8g	cmtyh4trf003vuebkp9agdobo	cmtv96wpy000cue7we3p7i6ag	2026-09-12 14:22:06.509
cmtyh4trg0049uebkihpkpsxo	cmtyh4trf003vuebkp9agdobo	cmtv96wq0000due7wp5xckmfx	2026-09-12 14:22:06.509
cmtyh4trg004auebk2xctse1z	cmtyh4trf003vuebkp9agdobo	cmtv96wq2000eue7wk21x493k	2026-09-12 14:22:06.509
cmtyh4trg004buebk8lxtrsdv	cmtyh4trf003vuebkp9agdobo	cmtv96wq4000fue7wcyy0x91s	2026-09-12 14:22:06.509
cmtyh4trg004cuebkn09i8eq8	cmtyh4trf003vuebkp9agdobo	cmtv96wq6000gue7wbqelijcv	2026-09-12 14:22:06.509
cmtyh4trg004duebkhpj3lb7d	cmtyh4trf003vuebkp9agdobo	cmtv96wq8000hue7wfen950xu	2026-09-12 14:22:06.509
cmtyh4trg004euebkuvx54qdm	cmtyh4trf003vuebkp9agdobo	cmtv96wqa000iue7wmxclcdy0	2026-09-12 14:22:06.509
cmtyh4trg004fuebkgiee4i5x	cmtyh4trf003vuebkp9agdobo	cmtv96wqc000jue7w79up3mzo	2026-09-12 14:22:06.509
cmtyh4trg004guebkjh3z6ymv	cmtyh4trf003vuebkp9agdobo	cmtv96wqe000kue7wphae12et	2026-09-12 14:22:06.509
cmtyh4trg004huebkbngrf0oe	cmtyh4trf003vuebkp9agdobo	cmtv96wqf000lue7wlsy1offg	2026-09-12 14:22:06.509
cmtyh4trg004iuebkran0qg83	cmtyh4trf003vuebkp9agdobo	cmtv96wqh000mue7wnih7aemu	2026-09-12 14:22:06.509
cmtyh4trg004juebke1divuka	cmtyh4trf003vuebkp9agdobo	cmtv96wqj000nue7wp6cln9nv	2026-09-12 14:22:06.509
cmtyh4trg004kuebkzi3jmget	cmtyh4trf003vuebkp9agdobo	cmtv96wql000oue7wlrv5wc0s	2026-09-12 14:22:06.509
cmtyh4trg004luebkpa7arrkg	cmtyh4trf003vuebkp9agdobo	cmtv96wqn000pue7wti72lfrq	2026-09-12 14:22:06.509
cmtyh4trg004muebkt1wq0xn3	cmtyh4trf003vuebkp9agdobo	cmtv96wqp000que7wjld2xg01	2026-09-12 14:22:06.509
cmtyh4trg004nuebkgq84a77m	cmtyh4trf003vuebkp9agdobo	cmtv96wqr000rue7w1weeqly3	2026-09-12 14:22:06.509
cmtyh4trg004ouebkg67icpdf	cmtyh4trf003vuebkp9agdobo	cmtv96wqt000sue7w2omspfp6	2026-09-12 14:22:06.509
cmtyh4trp004ruebkujjr4vhe	cmtyh4tro004quebkba9zxsyl	cmtv96wp70000ue7wkf5k9yvn	2026-09-12 14:22:06.518
cmtyh4trp004suebkr434v7jx	cmtyh4tro004quebkba9zxsyl	cmtv96wpi0004ue7wn0bxeer2	2026-09-12 14:22:06.518
cmtyh4trp004tuebk60f9kd5b	cmtyh4tro004quebkba9zxsyl	cmtv96wpq0008ue7wscak5zoz	2026-09-12 14:22:06.518
cmtyh4trp004uuebk10dejtxb	cmtyh4tro004quebkba9zxsyl	cmtv96wpu000aue7w2sfz6iyp	2026-09-12 14:22:06.518
cmtyh4trp004vuebk7iaj6rcx	cmtyh4tro004quebkba9zxsyl	cmtv96wpy000cue7we3p7i6ag	2026-09-12 14:22:06.518
cmtyh4trp004wuebk2peg5eqv	cmtyh4tro004quebkba9zxsyl	cmtv96wq0000due7wp5xckmfx	2026-09-12 14:22:06.518
cmtyh4trp004xuebkh58h1ga6	cmtyh4tro004quebkba9zxsyl	cmtv96wq2000eue7wk21x493k	2026-09-12 14:22:06.518
cmtyh4trp004yuebkjp82gp9k	cmtyh4tro004quebkba9zxsyl	cmtv96wq6000gue7wbqelijcv	2026-09-12 14:22:06.518
cmtyh4trr0051uebk401rhllo	cmtyh4trq0050uebkpsfpdo98	cmtv96wpy000cue7we3p7i6ag	2026-09-12 14:22:06.52
cmtyh4trr0052uebkn37iiq9y	cmtyh4trq0050uebkpsfpdo98	cmtv96wq0000due7wp5xckmfx	2026-09-12 14:22:06.52
cmtyh4trr0053uebkntgjclc2	cmtyh4trq0050uebkpsfpdo98	cmtv96wq2000eue7wk21x493k	2026-09-12 14:22:06.52
cmtyh4trr0054uebk42vic664	cmtyh4trq0050uebkpsfpdo98	cmtv96wqe000kue7wphae12et	2026-09-12 14:22:06.52
cmtyh4trr0055uebkacc0451l	cmtyh4trq0050uebkpsfpdo98	cmtv96wqf000lue7wlsy1offg	2026-09-12 14:22:06.52
cmtyh4trt0058uebkf1v0zlqg	cmtyh4trs0057uebkxup75g0i	cmtv96wp70000ue7wkf5k9yvn	2026-09-12 14:22:06.521
cmtyh4trt0059uebk5txdbalj	cmtyh4trs0057uebkxup75g0i	cmtv96wpi0004ue7wn0bxeer2	2026-09-12 14:22:06.521
cmtyh4trt005auebkcpllkul7	cmtyh4trs0057uebkxup75g0i	cmtv96wpq0008ue7wscak5zoz	2026-09-12 14:22:06.521
cmtyh4trt005buebk3rt6zvai	cmtyh4trs0057uebkxup75g0i	cmtv96wq6000gue7wbqelijcv	2026-09-12 14:22:06.521
cmu010w1p00aoue6sv36ox5oo	cmtv96wxh000yue7wbvlbpd58	cmu00xej0001quew0zl9nn5y9	2026-09-13 16:26:41.341
cmu010w1q00aque6sv925dszj	cmtv96wxh000yue7wbvlbpd58	cmu00xej3001ruew0m7dx2zxi	2026-09-13 16:26:41.342
cmu010w1r00asue6s9uvbh1ci	cmtv96wxh000yue7wbvlbpd58	cmu00xej4001suew0ptznfgkm	2026-09-13 16:26:41.343
cmu010w1s00auue6s2nsr7osu	cmtv96wxh000yue7wbvlbpd58	cmu00xej5001tuew0dsl9b2v7	2026-09-13 16:26:41.344
cmu010w1t00awue6sb3wbz8si	cmtv96wxh000yue7wbvlbpd58	cmu00xej6001uuew0gpckluas	2026-09-13 16:26:41.345
cmu010w1u00ayue6soy01hxxh	cmtv96wxh000yue7wbvlbpd58	cmu00xej7001vuew0seq3yzf8	2026-09-13 16:26:41.346
cmu010w1u00b0ue6sm4yd7qtf	cmtv96wxh000yue7wbvlbpd58	cmu00xej9001wuew0ppb6oi29	2026-09-13 16:26:41.347
cmu010w1v00b2ue6s8ewkgso3	cmtv96wxh000yue7wbvlbpd58	cmu00xeja001xuew0p0wp0e33	2026-09-13 16:26:41.348
cmu010w1w00b4ue6supnut07l	cmtv96wxh000yue7wbvlbpd58	cmu00xejc001yuew0sw7f8ux8	2026-09-13 16:26:41.349
cmu010w1x00b6ue6serp0o4fm	cmtv96wxh000yue7wbvlbpd58	cmu00xejd001zuew0flknxcp5	2026-09-13 16:26:41.35
cmu010w1y00b8ue6slubtyld9	cmtv96wxh000yue7wbvlbpd58	cmu00xejd0020uew05xm4shjt	2026-09-13 16:26:41.351
cmu010w2500baue6szdoixpxz	cmtv96wxh000yue7wbvlbpd58	cmu00xeje0021uew0h915r8qd	2026-09-13 16:26:41.357
cmu010w2700bcue6smxdksbip	cmtv96wxh000yue7wbvlbpd58	cmu00xejf0022uew0isc46tbs	2026-09-13 16:26:41.359
cmu010w2900beue6s6elfvl3o	cmtv96wxh000yue7wbvlbpd58	cmu00xejg0023uew0ztwph32y	2026-09-13 16:26:41.361
cmu010w2b00bgue6szj15xeoz	cmtv96wxh000yue7wbvlbpd58	cmu00xeji0024uew0mcbkio7j	2026-09-13 16:26:41.364
cmu010w2e00biue6stej94p6q	cmtv96wxh000yue7wbvlbpd58	cmu00xejj0025uew0fj1hqq9h	2026-09-13 16:26:41.366
cmu010w2f00bkue6s6vjdbp6k	cmtv96wxh000yue7wbvlbpd58	cmu00xejk0026uew0w794rlrq	2026-09-13 16:26:41.368
cmu010w2i00bmue6sflznogj8	cmtv96wxh000yue7wbvlbpd58	cmu00xejl0027uew0jrwv3tef	2026-09-13 16:26:41.37
cmu010w2k00boue6sjgiben26	cmtv96wxh000yue7wbvlbpd58	cmu00xejl0028uew0gd2nbkjf	2026-09-13 16:26:41.372
cmu010w2m00bque6skcdr3zjz	cmtv96wxh000yue7wbvlbpd58	cmu00xejm0029uew0ugly41ji	2026-09-13 16:26:41.374
cmu010w2n00bsue6sviqxyscx	cmtv96wxh000yue7wbvlbpd58	cmu00xejn002auew0yenkm697	2026-09-13 16:26:41.376
cmu010w2p00buue6stdfl7br1	cmtv96wxh000yue7wbvlbpd58	cmu00xejo002buew0ebpnrg99	2026-09-13 16:26:41.378
cmu010w2r00bwue6s4xegaipa	cmtv96wxh000yue7wbvlbpd58	cmu00xejp002cuew0a5gymobt	2026-09-13 16:26:41.379
cmu010w2t00byue6siimjn199	cmtv96wxh000yue7wbvlbpd58	cmu00xejq002duew0f34ts03e	2026-09-13 16:26:41.381
cmu010w2v00c0ue6sulr2r7dl	cmtv96wxh000yue7wbvlbpd58	cmu00xejq002euew0okl8kr9p	2026-09-13 16:26:41.383
cmu010w2w00c2ue6st6g2mwe9	cmtv96wxh000yue7wbvlbpd58	cmu00xejr002fuew0v6zeh3un	2026-09-13 16:26:41.384
cmu010w2x00c4ue6sxx3kivdo	cmtv96wxh000yue7wbvlbpd58	cmu00xejs002guew0beagizb6	2026-09-13 16:26:41.385
cmu010w2y00c6ue6sc4yus49j	cmtv96wxh000yue7wbvlbpd58	cmu00xejt002huew0exlvoepp	2026-09-13 16:26:41.386
cmu010w2z00c8ue6sjynggl2r	cmtv96wxh000yue7wbvlbpd58	cmu00xeju002iuew0010gx11y	2026-09-13 16:26:41.388
cmu010w3100caue6six6gfg8p	cmtv96wxh000yue7wbvlbpd58	cmu00xeju002juew01o6zdhru	2026-09-13 16:26:41.39
cmu010w3300ccue6sewlbp2gl	cmtv96wxh000yue7wbvlbpd58	cmu00xejv002kuew0ibdstxn2	2026-09-13 16:26:41.392
cmu010w3500ceue6s2afcf04o	cmtv96wxh000yue7wbvlbpd58	cmu00xejw002luew0bexzxpkr	2026-09-13 16:26:41.393
cmu010w3600cgue6sleeabu39	cmtv96wxh000yue7wbvlbpd58	cmu00xejx002muew0tnbha8ya	2026-09-13 16:26:41.395
cmu010w3700ciue6swesyeuxk	cmtv96wxh000yue7wbvlbpd58	cmu00xejx002nuew0fjyyiw8g	2026-09-13 16:26:41.396
cmu010w3800ckue6skxmzsss7	cmtv96wxh000yue7wbvlbpd58	cmu00xejy002ouew0txdcg2w7	2026-09-13 16:26:41.397
cmu010w3900cmue6srz562c54	cmtv96wxh000yue7wbvlbpd58	cmu00xejz002puew0v5mpsow0	2026-09-13 16:26:41.397
cmu010w3a00coue6s50x1road	cmtv96wxh000yue7wbvlbpd58	cmu00xek0002quew0pp8lpa9c	2026-09-13 16:26:41.398
cmu010w3b00cque6s8aplt54s	cmtv96wxh000yue7wbvlbpd58	cmu00xek1002ruew0zb67t8i8	2026-09-13 16:26:41.399
cmu010w3c00csue6szu1dfu7i	cmtv96wxh000yue7wbvlbpd58	cmu00xek1002suew0v330qlmc	2026-09-13 16:26:41.4
cmu010w3c00cuue6sb44m545c	cmtv96wxh000yue7wbvlbpd58	cmu00xek2002tuew0kd2lhn8w	2026-09-13 16:26:41.401
cmu010w3d00cwue6sgd0e5mlf	cmtv96wxh000yue7wbvlbpd58	cmu00xek3002uuew0iywdl2pp	2026-09-13 16:26:41.402
cmu010w3e00cyue6snkkjj2a0	cmtv96wxh000yue7wbvlbpd58	cmu00xekg003duew0rk8zhxa0	2026-09-13 16:26:41.403
cmu010w5200hiue6s0mhtvpa3	cmtv96wyh002mue7w8nxd6po7	cmu00xej0001quew0zl9nn5y9	2026-09-13 16:26:41.462
cmu010w5200hkue6sfzo8n2lk	cmtv96wyh002mue7w8nxd6po7	cmu00xej3001ruew0m7dx2zxi	2026-09-13 16:26:41.463
cmu010w5300hmue6sy26cb3xr	cmtv96wyh002mue7w8nxd6po7	cmu00xej4001suew0ptznfgkm	2026-09-13 16:26:41.464
cmu010w5400houe6s6qqb8z3g	cmtv96wyh002mue7w8nxd6po7	cmu00xej5001tuew0dsl9b2v7	2026-09-13 16:26:41.464
cmu010w5500hque6s6luzbk2b	cmtv96wyh002mue7w8nxd6po7	cmu00xej6001uuew0gpckluas	2026-09-13 16:26:41.465
cmu010w5600hsue6sai13pfod	cmtv96wyh002mue7w8nxd6po7	cmu00xej7001vuew0seq3yzf8	2026-09-13 16:26:41.466
cmu010w5700huue6s0jx5pktp	cmtv96wyh002mue7w8nxd6po7	cmu00xej9001wuew0ppb6oi29	2026-09-13 16:26:41.467
cmu010w5700hwue6sby75cme3	cmtv96wyh002mue7w8nxd6po7	cmu00xeja001xuew0p0wp0e33	2026-09-13 16:26:41.468
cmu010w5800hyue6sv1klcioi	cmtv96wyh002mue7w8nxd6po7	cmu00xejc001yuew0sw7f8ux8	2026-09-13 16:26:41.469
cmu010w5900i0ue6s7sv3i0n5	cmtv96wyh002mue7w8nxd6po7	cmu00xejd001zuew0flknxcp5	2026-09-13 16:26:41.469
cmu010w5a00i2ue6sgd4fmxlk	cmtv96wyh002mue7w8nxd6po7	cmu00xejd0020uew05xm4shjt	2026-09-13 16:26:41.47
cmu010w5b00i4ue6sxbawhhw7	cmtv96wyh002mue7w8nxd6po7	cmu00xeje0021uew0h915r8qd	2026-09-13 16:26:41.471
cmu010w5b00i6ue6sy603309s	cmtv96wyh002mue7w8nxd6po7	cmu00xejf0022uew0isc46tbs	2026-09-13 16:26:41.472
cmu010w5c00i8ue6su8t77xsu	cmtv96wyh002mue7w8nxd6po7	cmu00xejg0023uew0ztwph32y	2026-09-13 16:26:41.473
cmu010w5d00iaue6s5i6h1rmt	cmtv96wyh002mue7w8nxd6po7	cmu00xeji0024uew0mcbkio7j	2026-09-13 16:26:41.473
cmu010w5e00icue6s0ifwy07q	cmtv96wyh002mue7w8nxd6po7	cmu00xejj0025uew0fj1hqq9h	2026-09-13 16:26:41.474
cmu010w5f00ieue6s5l1a5nze	cmtv96wyh002mue7w8nxd6po7	cmu00xejk0026uew0w794rlrq	2026-09-13 16:26:41.475
cmu010w5f00igue6sjzumbjxc	cmtv96wyh002mue7w8nxd6po7	cmu00xejl0027uew0jrwv3tef	2026-09-13 16:26:41.476
cmu010w5g00iiue6sb6yboyvz	cmtv96wyh002mue7w8nxd6po7	cmu00xejl0028uew0gd2nbkjf	2026-09-13 16:26:41.477
cmu010w5h00ikue6s9d9tozmv	cmtv96wyh002mue7w8nxd6po7	cmu00xejm0029uew0ugly41ji	2026-09-13 16:26:41.477
cmu010w5i00imue6slvl6oc7l	cmtv96wyh002mue7w8nxd6po7	cmu00xejn002auew0yenkm697	2026-09-13 16:26:41.478
cmu010w5j00ioue6szb043m4e	cmtv96wyh002mue7w8nxd6po7	cmu00xejo002buew0ebpnrg99	2026-09-13 16:26:41.479
cmu010w5j00ique6srdx2emm5	cmtv96wyh002mue7w8nxd6po7	cmu00xejp002cuew0a5gymobt	2026-09-13 16:26:41.48
cmtzerexw0073uel2lb8dwg9l	cmtv96wxh000yue7wbvlbpd58	cmtzdx5ho0023ueeirsegmxep	2026-09-13 06:03:27.716
cmtzerexy0075uel2tcykqlfq	cmtv96wxh000yue7wbvlbpd58	cmtzdx5hp0024ueei7vyxlb4u	2026-09-13 06:03:27.718
cmtzerexy0077uel2l5zzr7ls	cmtv96wxh000yue7wbvlbpd58	cmtzdx5hq0025ueeiu2nxbyh0	2026-09-13 06:03:27.719
cmtzerexz0079uel219ezbso8	cmtv96wxh000yue7wbvlbpd58	cmtzdx5hr0026ueeiafcs5t6p	2026-09-13 06:03:27.72
cmtzerezw00bluel2254nglqy	cmtv96wyh002mue7w8nxd6po7	cmtzdx5ho0023ueeirsegmxep	2026-09-13 06:03:27.789
cmtzerezx00bnuel2guxgw4zq	cmtv96wyh002mue7w8nxd6po7	cmtzdx5hp0024ueei7vyxlb4u	2026-09-13 06:03:27.79
cmtzerezz00bpuel2yaefzc13	cmtv96wyh002mue7w8nxd6po7	cmtzdx5hq0025ueeiu2nxbyh0	2026-09-13 06:03:27.791
cmtzerf0000bruel2jnihmenj	cmtv96wyh002mue7w8nxd6po7	cmtzdx5hr0026ueeiafcs5t6p	2026-09-13 06:03:27.792
cmu010w5k00isue6sg2nth8rv	cmtv96wyh002mue7w8nxd6po7	cmu00xejq002duew0f34ts03e	2026-09-13 16:26:41.481
cmu010w5l00iuue6s3foqp913	cmtv96wyh002mue7w8nxd6po7	cmu00xejq002euew0okl8kr9p	2026-09-13 16:26:41.481
cmu010w5m00iwue6s1l0iv8vr	cmtv96wyh002mue7w8nxd6po7	cmu00xejr002fuew0v6zeh3un	2026-09-13 16:26:41.482
cmu010w5n00iyue6sidamt50i	cmtv96wyh002mue7w8nxd6po7	cmu00xejs002guew0beagizb6	2026-09-13 16:26:41.483
cmu010w5n00j0ue6saa0axxjy	cmtv96wyh002mue7w8nxd6po7	cmu00xejt002huew0exlvoepp	2026-09-13 16:26:41.484
cmu010w5o00j2ue6s2v805n2b	cmtv96wyh002mue7w8nxd6po7	cmu00xeju002iuew0010gx11y	2026-09-13 16:26:41.485
cmu010w5p00j4ue6saqbs6fel	cmtv96wyh002mue7w8nxd6po7	cmu00xeju002juew01o6zdhru	2026-09-13 16:26:41.485
cmu010w5q00j6ue6sof7htblx	cmtv96wyh002mue7w8nxd6po7	cmu00xejv002kuew0ibdstxn2	2026-09-13 16:26:41.486
cmu010w5r00j8ue6syv8gbaxw	cmtv96wyh002mue7w8nxd6po7	cmu00xejw002luew0bexzxpkr	2026-09-13 16:26:41.487
cmu010w5s00jaue6s32qfyerv	cmtv96wyh002mue7w8nxd6po7	cmu00xejx002muew0tnbha8ya	2026-09-13 16:26:41.488
cmu010w5s00jcue6s54yhtbu0	cmtv96wyh002mue7w8nxd6po7	cmu00xejx002nuew0fjyyiw8g	2026-09-13 16:26:41.489
cmu010w5t00jeue6sevtwd1ps	cmtv96wyh002mue7w8nxd6po7	cmu00xejy002ouew0txdcg2w7	2026-09-13 16:26:41.49
cmu010w5u00jgue6seod1f9z1	cmtv96wyh002mue7w8nxd6po7	cmu00xejz002puew0v5mpsow0	2026-09-13 16:26:41.49
cmu010w5v00jiue6sp4fe3kr7	cmtv96wyh002mue7w8nxd6po7	cmu00xek0002quew0pp8lpa9c	2026-09-13 16:26:41.491
cmu010w5v00jkue6sfrutim16	cmtv96wyh002mue7w8nxd6po7	cmu00xek1002ruew0zb67t8i8	2026-09-13 16:26:41.492
cmu010w5w00jmue6srnj4apo4	cmtv96wyh002mue7w8nxd6po7	cmu00xek1002suew0v330qlmc	2026-09-13 16:26:41.493
cmu010w5x00joue6sitc9bcqa	cmtv96wyh002mue7w8nxd6po7	cmu00xek2002tuew0kd2lhn8w	2026-09-13 16:26:41.494
cmu010w5y00jque6swyrlths3	cmtv96wyh002mue7w8nxd6po7	cmu00xek3002uuew0iywdl2pp	2026-09-13 16:26:41.494
cmu010w5z00jsue6sdd4zou20	cmtv96wyh002mue7w8nxd6po7	cmu00xekg003duew0rk8zhxa0	2026-09-13 16:26:41.495
cmu010w6d00koue6shdvfe9q5	cmu010w6b00kmue6svdvwxoyu	cmtv96wp70000ue7wkf5k9yvn	2026-09-13 16:26:41.509
cmu010w6e00kque6s6kox53fc	cmu010w6b00kmue6svdvwxoyu	cmtv96wpi0004ue7wn0bxeer2	2026-09-13 16:26:41.51
cmu010w6f00ksue6sn1pbp793	cmu010w6b00kmue6svdvwxoyu	cmtv96wqt000sue7w2omspfp6	2026-09-13 16:26:41.511
cmu010w6g00kuue6s5nskssib	cmu010w6b00kmue6svdvwxoyu	cmtyjfr50000mue6l0dbxe7ub	2026-09-13 16:26:41.512
cmu010w6h00kwue6sni7xllrh	cmu010w6b00kmue6svdvwxoyu	cmtymku83001mueyphlm5ha32	2026-09-13 16:26:41.513
cmu010w6i00kyue6sikhj2m4o	cmu010w6b00kmue6svdvwxoyu	cmtymku8a001nueypnj227eem	2026-09-13 16:26:41.514
cmu010w6i00l0ue6sd5jwik7b	cmu010w6b00kmue6svdvwxoyu	cmtymku8c001oueypamuta8b4	2026-09-13 16:26:41.515
cmu010w6j00l2ue6smkdauixo	cmu010w6b00kmue6svdvwxoyu	cmu00xej0001quew0zl9nn5y9	2026-09-13 16:26:41.516
cmu010w6k00l4ue6s6x2w6h5x	cmu010w6b00kmue6svdvwxoyu	cmu00xej4001suew0ptznfgkm	2026-09-13 16:26:41.517
cmu010w6l00l6ue6sq7vifeo7	cmu010w6b00kmue6svdvwxoyu	cmu00xej5001tuew0dsl9b2v7	2026-09-13 16:26:41.517
cmu010w6m00l8ue6swoh7r71l	cmu010w6b00kmue6svdvwxoyu	cmu00xej6001uuew0gpckluas	2026-09-13 16:26:41.518
cmu010w6n00laue6sncbn4xpn	cmu010w6b00kmue6svdvwxoyu	cmu00xej7001vuew0seq3yzf8	2026-09-13 16:26:41.519
cmu010w6o00lcue6seve5of5i	cmu010w6b00kmue6svdvwxoyu	cmu00xej9001wuew0ppb6oi29	2026-09-13 16:26:41.52
cmu010w6p00leue6se3a05k5e	cmu010w6b00kmue6svdvwxoyu	cmu00xeja001xuew0p0wp0e33	2026-09-13 16:26:41.521
cmu010w6q00lgue6sdnpw0u44	cmu010w6b00kmue6svdvwxoyu	cmu00xejc001yuew0sw7f8ux8	2026-09-13 16:26:41.522
cmu010w6q00liue6sb28k0d62	cmu010w6b00kmue6svdvwxoyu	cmu00xejd001zuew0flknxcp5	2026-09-13 16:26:41.523
cmu010w6s00lkue6su7ijy233	cmu010w6b00kmue6svdvwxoyu	cmu00xejd0020uew05xm4shjt	2026-09-13 16:26:41.524
cmu010w6s00lmue6s5i1paisf	cmu010w6b00kmue6svdvwxoyu	cmu00xeje0021uew0h915r8qd	2026-09-13 16:26:41.525
cmu010w6t00loue6skazbudiy	cmu010w6b00kmue6svdvwxoyu	cmu00xejf0022uew0isc46tbs	2026-09-13 16:26:41.526
cmu010w6u00lque6sr8zcl4o6	cmu010w6b00kmue6svdvwxoyu	cmu00xejg0023uew0ztwph32y	2026-09-13 16:26:41.527
cmu010w6v00lsue6syc9f8pqq	cmu010w6b00kmue6svdvwxoyu	cmu00xeji0024uew0mcbkio7j	2026-09-13 16:26:41.527
cmu010w6w00luue6sjp9egmyx	cmu010w6b00kmue6svdvwxoyu	cmu00xejj0025uew0fj1hqq9h	2026-09-13 16:26:41.528
cmu010w6x00lwue6sae5q2bka	cmu010w6b00kmue6svdvwxoyu	cmu00xejk0026uew0w794rlrq	2026-09-13 16:26:41.529
cmu010w6x00lyue6slkvivets	cmu010w6b00kmue6svdvwxoyu	cmu00xejl0027uew0jrwv3tef	2026-09-13 16:26:41.53
cmu010w6y00m0ue6s4wrxlon4	cmu010w6b00kmue6svdvwxoyu	cmu00xejl0028uew0gd2nbkjf	2026-09-13 16:26:41.531
cmu010w6z00m2ue6sbjnduw12	cmu010w6b00kmue6svdvwxoyu	cmu00xejm0029uew0ugly41ji	2026-09-13 16:26:41.532
cmu010w7000m4ue6sowfazhjy	cmu010w6b00kmue6svdvwxoyu	cmu00xejn002auew0yenkm697	2026-09-13 16:26:41.532
cmu010w7100m6ue6sv4an6dkw	cmu010w6b00kmue6svdvwxoyu	cmu00xejo002buew0ebpnrg99	2026-09-13 16:26:41.533
cmu010w7100m8ue6sqo6awizf	cmu010w6b00kmue6svdvwxoyu	cmu00xejp002cuew0a5gymobt	2026-09-13 16:26:41.534
cmu010w7200maue6scol3dc16	cmu010w6b00kmue6svdvwxoyu	cmu00xejq002duew0f34ts03e	2026-09-13 16:26:41.535
cmu010w7300mcue6s4nbodyco	cmu010w6b00kmue6svdvwxoyu	cmu00xejq002euew0okl8kr9p	2026-09-13 16:26:41.536
cmu010w7400meue6scskgd7m6	cmu010w6b00kmue6svdvwxoyu	cmu00xejr002fuew0v6zeh3un	2026-09-13 16:26:41.536
cmu010w7500mgue6sa0edoxfa	cmu010w6b00kmue6svdvwxoyu	cmu00xejs002guew0beagizb6	2026-09-13 16:26:41.537
cmu010w7600miue6sn1gtdojn	cmu010w6b00kmue6svdvwxoyu	cmu00xejt002huew0exlvoepp	2026-09-13 16:26:41.538
cmu010w7700mkue6sijvp9ob0	cmu010w6b00kmue6svdvwxoyu	cmu00xeju002iuew0010gx11y	2026-09-13 16:26:41.539
cmu010w7700mmue6s1pfnrkun	cmu010w6b00kmue6svdvwxoyu	cmu00xeju002juew01o6zdhru	2026-09-13 16:26:41.54
cmu010w7800moue6snm0qlub1	cmu010w6b00kmue6svdvwxoyu	cmu00xejv002kuew0ibdstxn2	2026-09-13 16:26:41.541
cmu010w7900mque6sv3j7e8ha	cmu010w6b00kmue6svdvwxoyu	cmu00xejw002luew0bexzxpkr	2026-09-13 16:26:41.541
cmu010w7a00msue6snfstutun	cmu010w6b00kmue6svdvwxoyu	cmu00xejx002muew0tnbha8ya	2026-09-13 16:26:41.542
cmu010w7a00muue6spfmjb34b	cmu010w6b00kmue6svdvwxoyu	cmu00xejx002nuew0fjyyiw8g	2026-09-13 16:26:41.543
cmu010w7b00mwue6sbcacv48x	cmu010w6b00kmue6svdvwxoyu	cmu00xejy002ouew0txdcg2w7	2026-09-13 16:26:41.544
cmu010w7c00myue6sgs6c9emg	cmu010w6b00kmue6svdvwxoyu	cmu00xejz002puew0v5mpsow0	2026-09-13 16:26:41.545
cmu010w7d00n0ue6so9fgvi4o	cmu010w6b00kmue6svdvwxoyu	cmu00xek0002quew0pp8lpa9c	2026-09-13 16:26:41.545
cmu010w7e00n2ue6sfi2hl2zr	cmu010w6b00kmue6svdvwxoyu	cmu00xek1002ruew0zb67t8i8	2026-09-13 16:26:41.546
cmu010w7f00n4ue6ssnwworkm	cmu010w6b00kmue6svdvwxoyu	cmu00xek1002suew0v330qlmc	2026-09-13 16:26:41.547
cmu010w7f00n6ue6s79rflaus	cmu010w6b00kmue6svdvwxoyu	cmu00xek2002tuew0kd2lhn8w	2026-09-13 16:26:41.548
cmu010w7g00n8ue6skbor97zv	cmu010w6b00kmue6svdvwxoyu	cmu00xek3002uuew0iywdl2pp	2026-09-13 16:26:41.549
cmu010w7h00naue6sqyh1zncw	cmu010w6b00kmue6svdvwxoyu	cmu00xekg003duew0rk8zhxa0	2026-09-13 16:26:41.55
cmtzca3vx003xue8db04n4y4r	cmtv96wxh000yue7wbvlbpd58	cmtyjfr4v000kue6l3miyje2n	2026-09-13 04:54:01.005
cmtzca3vz003zue8d8pulngx5	cmtv96wxh000yue7wbvlbpd58	cmtyjfr4x000lue6lymqtqwri	2026-09-13 04:54:01.008
cmtzca3w00041ue8d882al40r	cmtv96wxh000yue7wbvlbpd58	cmtyjfr50000mue6l0dbxe7ub	2026-09-13 04:54:01.009
cmtzca3w10043ue8dttess32m	cmtv96wxh000yue7wbvlbpd58	cmtyjfr53000nue6lgei3psv3	2026-09-13 04:54:01.01
cmtzca3w20045ue8dp7peufn7	cmtv96wxh000yue7wbvlbpd58	cmtyjfr55000oue6l9zxig9go	2026-09-13 04:54:01.011
cmtzca3w30047ue8dgjf6jfh5	cmtv96wxh000yue7wbvlbpd58	cmtyjfr57000pue6l4ug690s5	2026-09-13 04:54:01.012
cmtzca3w40049ue8d50vx43n3	cmtv96wxh000yue7wbvlbpd58	cmtylgo58000queqb3nv38iwo	2026-09-13 04:54:01.013
cmtzca3w5004bue8d627y9rwq	cmtv96wxh000yue7wbvlbpd58	cmtylgo5e000rueqbj1ncy6fx	2026-09-13 04:54:01.014
cmtzca3w6004due8dqo6w7i4j	cmtv96wxh000yue7wbvlbpd58	cmtylgo5g000sueqbpvbo7hvx	2026-09-13 04:54:01.015
cmtzca3w7004fue8dh5lrkebp	cmtv96wxh000yue7wbvlbpd58	cmtylgo5i000tueqbyuk6w0f8	2026-09-13 04:54:01.016
cmtzca3w8004hue8dw8obkbwa	cmtv96wxh000yue7wbvlbpd58	cmtylx3ve000uue7dmegchwnr	2026-09-13 04:54:01.017
cmtzca3w9004jue8dhlg0of9t	cmtv96wxh000yue7wbvlbpd58	cmtylx3vg000vue7dgcmytvn9	2026-09-13 04:54:01.018
cmtzca3wa004lue8diny26ty0	cmtv96wxh000yue7wbvlbpd58	cmtylx3vi000wue7da17ngg44	2026-09-13 04:54:01.019
cmtzca3wb004nue8dyj6pkf01	cmtv96wxh000yue7wbvlbpd58	cmtylx3vj000xue7dtxaphm2y	2026-09-13 04:54:01.02
cmtzca3wc004pue8dc7ydc7q0	cmtv96wxh000yue7wbvlbpd58	cmtylx3vl000yue7d39v8rvoj	2026-09-13 04:54:01.021
cmtzca3wd004rue8drvbhy0ak	cmtv96wxh000yue7wbvlbpd58	cmtylx3vm000zue7d3ftz9x3t	2026-09-13 04:54:01.022
cmtzca3we004tue8d0ynkutu7	cmtv96wxh000yue7wbvlbpd58	cmtylx3vo0010ue7djz1ulwi4	2026-09-13 04:54:01.023
cmu0xzhs400abueoyxfhk46jd	cmtv96wxh000yue7wbvlbpd58	cmu0xdt6x0008uezr3tp2imgn	2026-09-14 07:49:23.525
cmu0xzhs700adueoyumkcd29q	cmtv96wxh000yue7wbvlbpd58	cmu0xdt700009uezru47yyxo6	2026-09-14 07:49:23.527
cmu0xzhs800afueoyznwnbqec	cmtv96wxh000yue7wbvlbpd58	cmu0xdt72000auezr1l31w5fm	2026-09-14 07:49:23.528
cmu0xzhs900ahueoy834lssya	cmtv96wxh000yue7wbvlbpd58	cmu0xdt73000buezrpa5pxvpf	2026-09-14 07:49:23.529
cmu0xzhuo00hbueoyqra7mbrp	cmtv96wyh002mue7w8nxd6po7	cmu0xdt6x0008uezr3tp2imgn	2026-09-14 07:49:23.617
cmu0xzhuq00hdueoy2ji1g97y	cmtv96wyh002mue7w8nxd6po7	cmu0xdt700009uezru47yyxo6	2026-09-14 07:49:23.618
cmu0xzhuq00hfueoyegzyg1uh	cmtv96wyh002mue7w8nxd6po7	cmu0xdt72000auezr1l31w5fm	2026-09-14 07:49:23.619
cmu0xzhur00hhueoyxx7rjhq5	cmtv96wyh002mue7w8nxd6po7	cmu0xdt73000buezrpa5pxvpf	2026-09-14 07:49:23.62
cmu0xzhuu00hnueoy0sgn9anw	cmtv96wz40042ue7wl8nbr0tt	cmu0xdt6x0008uezr3tp2imgn	2026-09-14 07:49:23.622
cmu0xzhuu00hpueoyxa9t6siu	cmtv96wz40042ue7wl8nbr0tt	cmu0xdt700009uezru47yyxo6	2026-09-14 07:49:23.623
cmu0xzhuv00hrueoy4dzwxuy5	cmtv96wz40042ue7wl8nbr0tt	cmu0xdt72000auezr1l31w5fm	2026-09-14 07:49:23.624
cmu0xzhuw00htueoylyuewwh6	cmtv96wz40042ue7wl8nbr0tt	cmu0xdt73000buezrpa5pxvpf	2026-09-14 07:49:23.625
cmu0xzhw100krueoyud6phrut	cmtyh4tra0030uebk1ctq2tsa	cmtyjfr4v000kue6l3miyje2n	2026-09-14 07:49:23.665
cmu0xzhw100ktueoyrfxsskye	cmtyh4tra0030uebk1ctq2tsa	cmtyjfr4x000lue6lymqtqwri	2026-09-14 07:49:23.666
cmu0xzhw200kvueoyk57jpnl4	cmtyh4tra0030uebk1ctq2tsa	cmtyjfr50000mue6l0dbxe7ub	2026-09-14 07:49:23.667
cmu0xzhw300kxueoyf72rv6m7	cmtyh4tra0030uebk1ctq2tsa	cmtyjfr53000nue6lgei3psv3	2026-09-14 07:49:23.667
cmu0xzhw400kzueoyjmgqernq	cmtyh4tra0030uebk1ctq2tsa	cmtyjfr55000oue6l9zxig9go	2026-09-14 07:49:23.668
cmu0xzhw500l1ueoyv7jid2hq	cmtyh4tra0030uebk1ctq2tsa	cmtyjfr57000pue6l4ug690s5	2026-09-14 07:49:23.669
cmu0xzhw500l3ueoy9v9m85zp	cmtyh4tra0030uebk1ctq2tsa	cmtylgo58000queqb3nv38iwo	2026-09-14 07:49:23.67
cmu0xzhw600l5ueoyn78dky7i	cmtyh4tra0030uebk1ctq2tsa	cmtylgo5e000rueqbj1ncy6fx	2026-09-14 07:49:23.671
cmu0xzhw700l7ueoyd85wrvzv	cmtyh4tra0030uebk1ctq2tsa	cmtylgo5g000sueqbpvbo7hvx	2026-09-14 07:49:23.672
cmu0xzhw800l9ueoys7n7a38s	cmtyh4tra0030uebk1ctq2tsa	cmtylgo5i000tueqbyuk6w0f8	2026-09-14 07:49:23.672
cmu0xzhw900lbueoy8hpiqgpq	cmtyh4tra0030uebk1ctq2tsa	cmtylx3ve000uue7dmegchwnr	2026-09-14 07:49:23.673
cmu0xzhwa00ldueoyw4bm7pwl	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vg000vue7dgcmytvn9	2026-09-14 07:49:23.674
cmu0xzhwb00lfueoye3mhgedw	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vi000wue7da17ngg44	2026-09-14 07:49:23.675
cmu0xzhwc00lhueoy3xwrlcx8	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vj000xue7dtxaphm2y	2026-09-14 07:49:23.676
cmu0xzhwc00ljueoy5zwh7p3p	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vl000yue7d39v8rvoj	2026-09-14 07:49:23.677
cmu0xzhwd00llueoyjijfqypq	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vm000zue7d3ftz9x3t	2026-09-14 07:49:23.678
cmu0xzhwe00lnueoyor5l3zph	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vo0010ue7djz1ulwi4	2026-09-14 07:49:23.679
cmu0xzhwf00lpueoys2l7yd0l	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vp0011ue7dkdmw0m33	2026-09-14 07:49:23.679
cmu0xzhwg00lrueoyasjroxav	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vq0012ue7djc1f8pzp	2026-09-14 07:49:23.68
cmu0xzhwh00ltueoycnrj1jbt	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vs0013ue7d978wuw8l	2026-09-14 07:49:23.681
cmu0xzhwh00lvueoycdt5i6hg	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vt0014ue7d132kuvhl	2026-09-14 07:49:23.682
cmu0xzhwi00lxueoy4tw3857r	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vu0015ue7dpcw6eubt	2026-09-14 07:49:23.683
cmu0xzhwj00lzueoyn2q53rr1	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vw0016ue7dajokpiyl	2026-09-14 07:49:23.683
cmu0xzhwk00m1ueoy721dhp2n	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vx0017ue7dsgsp43g4	2026-09-14 07:49:23.684
cmu0xzhwl00m3ueoy28l6o8no	cmtyh4tra0030uebk1ctq2tsa	cmtylx3vy0018ue7dqkwbhgve	2026-09-14 07:49:23.685
cmu0xzhwl00m5ueoy0vmtazk8	cmtyh4tra0030uebk1ctq2tsa	cmtylx3w00019ue7dwfb55ji7	2026-09-14 07:49:23.686
cmu0xzhwm00m7ueoy3eemglqk	cmtyh4tra0030uebk1ctq2tsa	cmtylx3w1001aue7df19ww36o	2026-09-14 07:49:23.687
cmu0xzhwn00m9ueoy1xf0a144	cmtyh4tra0030uebk1ctq2tsa	cmtylx3w2001bue7dz05meqvz	2026-09-14 07:49:23.687
cmu0xzhwo00mbueoy0uo08lcs	cmtyh4tra0030uebk1ctq2tsa	cmtylx3w3001cue7dvh4o4go0	2026-09-14 07:49:23.688
cmu0xzhwp00mdueoyahj6bu48	cmtyh4tra0030uebk1ctq2tsa	cmtylx3w5001due7d3cz3it6f	2026-09-14 07:49:23.689
cmu0xzhwp00mfueoy1uepi27z	cmtyh4tra0030uebk1ctq2tsa	cmtylx3w6001eue7d96vw878b	2026-09-14 07:49:23.69
cmu0xzhwr00mhueoynkrtfbfs	cmtyh4tra0030uebk1ctq2tsa	cmtylx3w7001fue7djkhdfems	2026-09-14 07:49:23.691
cmu0xzhwr00mjueoyiifwvhjd	cmtyh4tra0030uebk1ctq2tsa	cmtylx3w8001gue7d78ky88m3	2026-09-14 07:49:23.692
cmu0xzhws00mlueoyyet4ve1s	cmtyh4tra0030uebk1ctq2tsa	cmtylx3w9001hue7drxbp3pn4	2026-09-14 07:49:23.693
cmu0xzhwt00mnueoydabi4hzp	cmtyh4tra0030uebk1ctq2tsa	cmtylx3wb001iue7dk7dyjdpr	2026-09-14 07:49:23.693
cmu0xzhwu00mpueoyewn5kxq5	cmtyh4tra0030uebk1ctq2tsa	cmtylx3wc001jue7dm3lw532r	2026-09-14 07:49:23.694
cmu0xzhwv00mrueoyanhy77j1	cmtyh4tra0030uebk1ctq2tsa	cmtylx3wd001kue7dn2heinif	2026-09-14 07:49:23.695
cmu0xzhwv00mtueoyy55bts5f	cmtyh4tra0030uebk1ctq2tsa	cmtylx3wf001lue7dqixnf5gm	2026-09-14 07:49:23.696
cmu0xzhww00mvueoy4bovibc3	cmtyh4tra0030uebk1ctq2tsa	cmtymku83001mueyphlm5ha32	2026-09-14 07:49:23.697
cmu0xzhwx00mxueoy82o69dpz	cmtyh4tra0030uebk1ctq2tsa	cmtymku8a001nueypnj227eem	2026-09-14 07:49:23.698
cmu0xzhwy00mzueoycd8x8ldx	cmtyh4tra0030uebk1ctq2tsa	cmtymku8c001oueypamuta8b4	2026-09-14 07:49:23.698
cmu0xzhwz00n1ueoyvoiazux5	cmtyh4tra0030uebk1ctq2tsa	cmtymku8d001pueypsm31kerv	2026-09-14 07:49:23.699
cmu0xzhwz00n3ueoydhovm1v6	cmtyh4tra0030uebk1ctq2tsa	cmtymvm4a001quemugn59be8f	2026-09-14 07:49:23.7
cmu0xzhx000n5ueoyp5aaq22i	cmtyh4tra0030uebk1ctq2tsa	cmtymvm4h001ruemua9x74voq	2026-09-14 07:49:23.701
cmu0xzhx100n7ueoyi2w6f0ib	cmtyh4tra0030uebk1ctq2tsa	cmtymvm4j001suemu8zgtvdxq	2026-09-14 07:49:23.702
cmu0xzhx200n9ueoy6t5rtwq4	cmtyh4tra0030uebk1ctq2tsa	cmtymvm4k001tuemuw85qj03j	2026-09-14 07:49:23.702
cmu0xzhx300nbueoyarv30j48	cmtyh4tra0030uebk1ctq2tsa	cmtynichw001uuedpfi74idyq	2026-09-14 07:49:23.703
cmu0xzhx300ndueoyiqiw1o0t	cmtyh4tra0030uebk1ctq2tsa	cmtzdx5ho0023ueeirsegmxep	2026-09-14 07:49:23.704
cmu0xzhx400nfueoynd0ijk7g	cmtyh4tra0030uebk1ctq2tsa	cmtzdx5hp0024ueei7vyxlb4u	2026-09-14 07:49:23.705
cmu0xzhx500nhueoyol7i3i38	cmtyh4tra0030uebk1ctq2tsa	cmtzdx5hq0025ueeiu2nxbyh0	2026-09-14 07:49:23.705
cmu0xzhx600njueoyotnv1syt	cmtyh4tra0030uebk1ctq2tsa	cmtzdx5hr0026ueeiafcs5t6p	2026-09-14 07:49:23.706
cmu0xzhx700nlueoyvgo9ujdx	cmtyh4tra0030uebk1ctq2tsa	cmu00xej0001quew0zl9nn5y9	2026-09-14 07:49:23.707
cmu0xzhx800nnueoy8x1y3n5e	cmtyh4tra0030uebk1ctq2tsa	cmu00xej3001ruew0m7dx2zxi	2026-09-14 07:49:23.708
cmu0xzhx800npueoyrtdmk038	cmtyh4tra0030uebk1ctq2tsa	cmu00xej4001suew0ptznfgkm	2026-09-14 07:49:23.709
cmu0xzhx900nrueoyix5gicek	cmtyh4tra0030uebk1ctq2tsa	cmu00xej5001tuew0dsl9b2v7	2026-09-14 07:49:23.71
cmu0xzhxa00ntueoyt98waggw	cmtyh4tra0030uebk1ctq2tsa	cmu00xej6001uuew0gpckluas	2026-09-14 07:49:23.711
cmu0xzhxb00nvueoysywa1a4o	cmtyh4tra0030uebk1ctq2tsa	cmu00xej7001vuew0seq3yzf8	2026-09-14 07:49:23.711
cmu0xzhxc00nxueoyx19opefg	cmtyh4tra0030uebk1ctq2tsa	cmu00xej9001wuew0ppb6oi29	2026-09-14 07:49:23.712
cmu0xzhxc00nzueoyl938jwz3	cmtyh4tra0030uebk1ctq2tsa	cmu00xeja001xuew0p0wp0e33	2026-09-14 07:49:23.713
cmu0xzhxd00o1ueoyv0kgy4j7	cmtyh4tra0030uebk1ctq2tsa	cmu00xejc001yuew0sw7f8ux8	2026-09-14 07:49:23.714
cmu0xzhxe00o3ueoyoowqmjji	cmtyh4tra0030uebk1ctq2tsa	cmu00xejd001zuew0flknxcp5	2026-09-14 07:49:23.715
cmu0xzhxf00o5ueoy7cazxswo	cmtyh4tra0030uebk1ctq2tsa	cmu00xejd0020uew05xm4shjt	2026-09-14 07:49:23.715
cmu0xzhxg00o7ueoyk8fhfevz	cmtyh4tra0030uebk1ctq2tsa	cmu00xeje0021uew0h915r8qd	2026-09-14 07:49:23.716
cmtzca3wf004vue8dv7f1r3tx	cmtv96wxh000yue7wbvlbpd58	cmtylx3vp0011ue7dkdmw0m33	2026-09-13 04:54:01.024
cmtzca3wg004xue8d5x1cehxa	cmtv96wxh000yue7wbvlbpd58	cmtylx3vq0012ue7djc1f8pzp	2026-09-13 04:54:01.025
cmtzca3wh004zue8dae9votpa	cmtv96wxh000yue7wbvlbpd58	cmtylx3vs0013ue7d978wuw8l	2026-09-13 04:54:01.026
cmtzca3wi0051ue8dygeoxp25	cmtv96wxh000yue7wbvlbpd58	cmtylx3vt0014ue7d132kuvhl	2026-09-13 04:54:01.027
cmtzca3wj0053ue8dsg9smaoe	cmtv96wxh000yue7wbvlbpd58	cmtylx3vu0015ue7dpcw6eubt	2026-09-13 04:54:01.028
cmtzca3wk0055ue8dw09ugk5d	cmtv96wxh000yue7wbvlbpd58	cmtylx3vw0016ue7dajokpiyl	2026-09-13 04:54:01.028
cmtzca3wl0057ue8duvgn6t8p	cmtv96wxh000yue7wbvlbpd58	cmtylx3vx0017ue7dsgsp43g4	2026-09-13 04:54:01.029
cmtzca3wm0059ue8diedi68u1	cmtv96wxh000yue7wbvlbpd58	cmtylx3vy0018ue7dqkwbhgve	2026-09-13 04:54:01.03
cmtzca3wn005bue8ds617n62k	cmtv96wxh000yue7wbvlbpd58	cmtylx3w00019ue7dwfb55ji7	2026-09-13 04:54:01.031
cmtzca3wo005due8drxv1sivb	cmtv96wxh000yue7wbvlbpd58	cmtylx3w1001aue7df19ww36o	2026-09-13 04:54:01.032
cmtzca3wp005fue8dvnz1rogf	cmtv96wxh000yue7wbvlbpd58	cmtylx3w2001bue7dz05meqvz	2026-09-13 04:54:01.033
cmtzca3wp005hue8dlnpc8z48	cmtv96wxh000yue7wbvlbpd58	cmtylx3w3001cue7dvh4o4go0	2026-09-13 04:54:01.034
cmtzca3wq005jue8dmihrvvbk	cmtv96wxh000yue7wbvlbpd58	cmtylx3w5001due7d3cz3it6f	2026-09-13 04:54:01.035
cmtzca3wr005lue8dumwarasg	cmtv96wxh000yue7wbvlbpd58	cmtylx3w6001eue7d96vw878b	2026-09-13 04:54:01.036
cmtzca3ws005nue8d4renc16a	cmtv96wxh000yue7wbvlbpd58	cmtylx3w7001fue7djkhdfems	2026-09-13 04:54:01.037
cmtzca3wt005pue8dhwe4pe28	cmtv96wxh000yue7wbvlbpd58	cmtylx3w8001gue7d78ky88m3	2026-09-13 04:54:01.038
cmtzca3wu005rue8d87o3b40t	cmtv96wxh000yue7wbvlbpd58	cmtylx3w9001hue7drxbp3pn4	2026-09-13 04:54:01.039
cmtzca3wv005tue8dijk5ck5h	cmtv96wxh000yue7wbvlbpd58	cmtylx3wb001iue7dk7dyjdpr	2026-09-13 04:54:01.04
cmtzca3ww005vue8dsd4iy7ga	cmtv96wxh000yue7wbvlbpd58	cmtylx3wc001jue7dm3lw532r	2026-09-13 04:54:01.041
cmtzca3wx005xue8d0m53v9as	cmtv96wxh000yue7wbvlbpd58	cmtylx3wd001kue7dn2heinif	2026-09-13 04:54:01.041
cmtzca3wy005zue8dcr1pio9n	cmtv96wxh000yue7wbvlbpd58	cmtylx3wf001lue7dqixnf5gm	2026-09-13 04:54:01.043
cmtzca3wz0061ue8d8mrblbww	cmtv96wxh000yue7wbvlbpd58	cmtymku83001mueyphlm5ha32	2026-09-13 04:54:01.043
cmtzca3x00063ue8dk6x4imwh	cmtv96wxh000yue7wbvlbpd58	cmtymku8a001nueypnj227eem	2026-09-13 04:54:01.044
cmtzca3x10065ue8d2feiyfxs	cmtv96wxh000yue7wbvlbpd58	cmtymku8c001oueypamuta8b4	2026-09-13 04:54:01.045
cmtzca3x20067ue8daoh2tgnf	cmtv96wxh000yue7wbvlbpd58	cmtymku8d001pueypsm31kerv	2026-09-13 04:54:01.046
cmtzca3x20069ue8dka5fv1pw	cmtv96wxh000yue7wbvlbpd58	cmtymvm4a001quemugn59be8f	2026-09-13 04:54:01.047
cmtzca3x3006bue8da2u64lsx	cmtv96wxh000yue7wbvlbpd58	cmtymvm4h001ruemua9x74voq	2026-09-13 04:54:01.048
cmtzca3x5006due8dmvtbde2l	cmtv96wxh000yue7wbvlbpd58	cmtymvm4j001suemu8zgtvdxq	2026-09-13 04:54:01.05
cmtzca3x6006fue8d9ocyih4n	cmtv96wxh000yue7wbvlbpd58	cmtymvm4k001tuemuw85qj03j	2026-09-13 04:54:01.051
cmtzca3x7006hue8dfgegks7i	cmtv96wxh000yue7wbvlbpd58	cmtynichw001uuedpfi74idyq	2026-09-13 04:54:01.052
cmtzca3xw0087ue8dpvfwavox	cmtv96wyh002mue7w8nxd6po7	cmtyjfr4v000kue6l3miyje2n	2026-09-13 04:54:01.076
cmtzca3xx0089ue8dbokslpbg	cmtv96wyh002mue7w8nxd6po7	cmtyjfr4x000lue6lymqtqwri	2026-09-13 04:54:01.077
cmtzca3xx008bue8dyvmvqs1m	cmtv96wyh002mue7w8nxd6po7	cmtyjfr50000mue6l0dbxe7ub	2026-09-13 04:54:01.078
cmtzca3xy008due8dry0029w6	cmtv96wyh002mue7w8nxd6po7	cmtyjfr53000nue6lgei3psv3	2026-09-13 04:54:01.079
cmtzca3xz008fue8dvo7boc1g	cmtv96wyh002mue7w8nxd6po7	cmtyjfr55000oue6l9zxig9go	2026-09-13 04:54:01.08
cmtzca3y0008hue8dh7s4r5fv	cmtv96wyh002mue7w8nxd6po7	cmtyjfr57000pue6l4ug690s5	2026-09-13 04:54:01.08
cmtzca3y1008jue8dzor2tgl2	cmtv96wyh002mue7w8nxd6po7	cmtylgo58000queqb3nv38iwo	2026-09-13 04:54:01.081
cmtzca3y1008lue8dtfjgk3ax	cmtv96wyh002mue7w8nxd6po7	cmtylgo5e000rueqbj1ncy6fx	2026-09-13 04:54:01.082
cmtzca3y2008nue8dbunss0px	cmtv96wyh002mue7w8nxd6po7	cmtylgo5g000sueqbpvbo7hvx	2026-09-13 04:54:01.083
cmtzca3y3008pue8d04gj3ka1	cmtv96wyh002mue7w8nxd6po7	cmtylgo5i000tueqbyuk6w0f8	2026-09-13 04:54:01.083
cmtzca3y4008rue8dhymoi0is	cmtv96wyh002mue7w8nxd6po7	cmtylx3ve000uue7dmegchwnr	2026-09-13 04:54:01.084
cmtzca3y5008tue8da1cwa3gx	cmtv96wyh002mue7w8nxd6po7	cmtylx3vg000vue7dgcmytvn9	2026-09-13 04:54:01.085
cmtzca3y5008vue8da15rqydw	cmtv96wyh002mue7w8nxd6po7	cmtylx3vi000wue7da17ngg44	2026-09-13 04:54:01.086
cmtzca3y6008xue8dq4xz0k5v	cmtv96wyh002mue7w8nxd6po7	cmtylx3vj000xue7dtxaphm2y	2026-09-13 04:54:01.087
cmtzca3y7008zue8dt647o7u8	cmtv96wyh002mue7w8nxd6po7	cmtylx3vl000yue7d39v8rvoj	2026-09-13 04:54:01.088
cmtzca3y80091ue8ddx96qjtf	cmtv96wyh002mue7w8nxd6po7	cmtylx3vm000zue7d3ftz9x3t	2026-09-13 04:54:01.088
cmtzca3y90093ue8dxfzhlbtm	cmtv96wyh002mue7w8nxd6po7	cmtylx3vo0010ue7djz1ulwi4	2026-09-13 04:54:01.089
cmtzca3yb0095ue8do4etlnst	cmtv96wyh002mue7w8nxd6po7	cmtylx3vp0011ue7dkdmw0m33	2026-09-13 04:54:01.092
cmtzca3ye0097ue8dznsy4enl	cmtv96wyh002mue7w8nxd6po7	cmtylx3vq0012ue7djc1f8pzp	2026-09-13 04:54:01.094
cmtzca3yf0099ue8d21wqn8r3	cmtv96wyh002mue7w8nxd6po7	cmtylx3vs0013ue7d978wuw8l	2026-09-13 04:54:01.095
cmtzca3yg009bue8d2t7f9xnh	cmtv96wyh002mue7w8nxd6po7	cmtylx3vt0014ue7d132kuvhl	2026-09-13 04:54:01.096
cmtzca3yh009due8dx248uz7a	cmtv96wyh002mue7w8nxd6po7	cmtylx3vu0015ue7dpcw6eubt	2026-09-13 04:54:01.097
cmtzca3yi009fue8dvlnv475a	cmtv96wyh002mue7w8nxd6po7	cmtylx3vw0016ue7dajokpiyl	2026-09-13 04:54:01.098
cmtzca3yj009hue8du4o6mucw	cmtv96wyh002mue7w8nxd6po7	cmtylx3vx0017ue7dsgsp43g4	2026-09-13 04:54:01.099
cmtzca3yj009jue8dpnn5odjn	cmtv96wyh002mue7w8nxd6po7	cmtylx3vy0018ue7dqkwbhgve	2026-09-13 04:54:01.1
cmtzca3yl009lue8d8wz0jrqq	cmtv96wyh002mue7w8nxd6po7	cmtylx3w00019ue7dwfb55ji7	2026-09-13 04:54:01.101
cmtzca3yl009nue8dy8xqpqpg	cmtv96wyh002mue7w8nxd6po7	cmtylx3w1001aue7df19ww36o	2026-09-13 04:54:01.102
cmtzca3ym009pue8dvageclc5	cmtv96wyh002mue7w8nxd6po7	cmtylx3w2001bue7dz05meqvz	2026-09-13 04:54:01.103
cmtzca3yn009rue8d68yjtgqh	cmtv96wyh002mue7w8nxd6po7	cmtylx3w3001cue7dvh4o4go0	2026-09-13 04:54:01.104
cmtzca3yo009tue8dischw8pe	cmtv96wyh002mue7w8nxd6po7	cmtylx3w5001due7d3cz3it6f	2026-09-13 04:54:01.105
cmtzca3yp009vue8dvf5p6ijx	cmtv96wyh002mue7w8nxd6po7	cmtylx3w6001eue7d96vw878b	2026-09-13 04:54:01.105
cmtzca3yq009xue8df2kr296e	cmtv96wyh002mue7w8nxd6po7	cmtylx3w7001fue7djkhdfems	2026-09-13 04:54:01.106
cmtzca3yr009zue8dk9ek713d	cmtv96wyh002mue7w8nxd6po7	cmtylx3w8001gue7d78ky88m3	2026-09-13 04:54:01.107
cmtzca3yr00a1ue8dxu7ad5q9	cmtv96wyh002mue7w8nxd6po7	cmtylx3w9001hue7drxbp3pn4	2026-09-13 04:54:01.108
cmtzca3ys00a3ue8djoz905jd	cmtv96wyh002mue7w8nxd6po7	cmtylx3wb001iue7dk7dyjdpr	2026-09-13 04:54:01.109
cmu0xzhxh00o9ueoyahx1q4cp	cmtyh4tra0030uebk1ctq2tsa	cmu00xejf0022uew0isc46tbs	2026-09-14 07:49:23.717
cmu0xzhxh00obueoyuhz7uxya	cmtyh4tra0030uebk1ctq2tsa	cmu00xejg0023uew0ztwph32y	2026-09-14 07:49:23.718
cmu0xzhxi00odueoy31qg5hrz	cmtyh4tra0030uebk1ctq2tsa	cmu00xeji0024uew0mcbkio7j	2026-09-14 07:49:23.719
cmu0xzhxj00ofueoydd33lwq7	cmtyh4tra0030uebk1ctq2tsa	cmu00xejj0025uew0fj1hqq9h	2026-09-14 07:49:23.719
cmu0xzhxk00ohueoycy2o7i9d	cmtyh4tra0030uebk1ctq2tsa	cmu00xejk0026uew0w794rlrq	2026-09-14 07:49:23.72
cmu0xzhxl00ojueoy2vr85rlp	cmtyh4tra0030uebk1ctq2tsa	cmu00xejl0027uew0jrwv3tef	2026-09-14 07:49:23.721
cmu0xzhxl00olueoyidof69w2	cmtyh4tra0030uebk1ctq2tsa	cmu00xejl0028uew0gd2nbkjf	2026-09-14 07:49:23.722
cmu0xzhxm00onueoyobiu3ysi	cmtyh4tra0030uebk1ctq2tsa	cmu00xejm0029uew0ugly41ji	2026-09-14 07:49:23.723
cmu0xzhxn00opueoyifsacu05	cmtyh4tra0030uebk1ctq2tsa	cmu00xejn002auew0yenkm697	2026-09-14 07:49:23.724
cmu0xzhxo00orueoyffu8j7fz	cmtyh4tra0030uebk1ctq2tsa	cmu00xejo002buew0ebpnrg99	2026-09-14 07:49:23.725
cmu0xzhxp00otueoywcentdcq	cmtyh4tra0030uebk1ctq2tsa	cmu00xejp002cuew0a5gymobt	2026-09-14 07:49:23.725
cmu0xzhxq00ovueoyl3cv6co3	cmtyh4tra0030uebk1ctq2tsa	cmu00xejq002duew0f34ts03e	2026-09-14 07:49:23.726
cmu0xzhxr00oxueoywne7o48n	cmtyh4tra0030uebk1ctq2tsa	cmu00xejq002euew0okl8kr9p	2026-09-14 07:49:23.727
cmu0xzhxr00ozueoya2adflrc	cmtyh4tra0030uebk1ctq2tsa	cmu00xejr002fuew0v6zeh3un	2026-09-14 07:49:23.728
cmu0xzhxs00p1ueoy1vdo53wu	cmtyh4tra0030uebk1ctq2tsa	cmu00xejs002guew0beagizb6	2026-09-14 07:49:23.729
cmu0xzhxt00p3ueoycopzix1c	cmtyh4tra0030uebk1ctq2tsa	cmu00xejt002huew0exlvoepp	2026-09-14 07:49:23.729
cmu0xzhxu00p5ueoyh4v47a1d	cmtyh4tra0030uebk1ctq2tsa	cmu00xeju002iuew0010gx11y	2026-09-14 07:49:23.73
cmu0xzhxv00p7ueoywjwdcmov	cmtyh4tra0030uebk1ctq2tsa	cmu00xeju002juew01o6zdhru	2026-09-14 07:49:23.731
cmu0xzhxw00p9ueoy26i0fxu1	cmtyh4tra0030uebk1ctq2tsa	cmu00xejv002kuew0ibdstxn2	2026-09-14 07:49:23.732
cmu0xzhxw00pbueoy0nh3igyh	cmtyh4tra0030uebk1ctq2tsa	cmu00xejw002luew0bexzxpkr	2026-09-14 07:49:23.733
cmu0xzhxx00pdueoy54tlub22	cmtyh4tra0030uebk1ctq2tsa	cmu00xejx002muew0tnbha8ya	2026-09-14 07:49:23.734
cmu0xzhxy00pfueoyg2215pnc	cmtyh4tra0030uebk1ctq2tsa	cmu00xejx002nuew0fjyyiw8g	2026-09-14 07:49:23.734
cmu0xzhxz00phueoy4uak542q	cmtyh4tra0030uebk1ctq2tsa	cmu00xejy002ouew0txdcg2w7	2026-09-14 07:49:23.735
cmu0xzhxz00pjueoyq6qkw83a	cmtyh4tra0030uebk1ctq2tsa	cmu00xejz002puew0v5mpsow0	2026-09-14 07:49:23.736
cmu0xzhy000plueoystsl3e8t	cmtyh4tra0030uebk1ctq2tsa	cmu00xek0002quew0pp8lpa9c	2026-09-14 07:49:23.737
cmu0xzhy100pnueoydteyyjyp	cmtyh4tra0030uebk1ctq2tsa	cmu00xek1002ruew0zb67t8i8	2026-09-14 07:49:23.737
cmu0xzhy200ppueoyjmbqq5g4	cmtyh4tra0030uebk1ctq2tsa	cmu00xek1002suew0v330qlmc	2026-09-14 07:49:23.738
cmu0xzhy300prueoy55gbj3da	cmtyh4tra0030uebk1ctq2tsa	cmu00xek2002tuew0kd2lhn8w	2026-09-14 07:49:23.739
cmu0xzhy500ptueoylp77ursw	cmtyh4tra0030uebk1ctq2tsa	cmu00xek3002uuew0iywdl2pp	2026-09-14 07:49:23.741
cmu0xzhy600pvueoyr91c55o7	cmtyh4tra0030uebk1ctq2tsa	cmu00xekg003duew0rk8zhxa0	2026-09-14 07:49:23.742
cmu0xzhy600pxueoybpohn3d9	cmtyh4tra0030uebk1ctq2tsa	cmu0xdt6x0008uezr3tp2imgn	2026-09-14 07:49:23.743
cmu0xzhy700pzueoypnyklq7p	cmtyh4tra0030uebk1ctq2tsa	cmu0xdt700009uezru47yyxo6	2026-09-14 07:49:23.744
cmu0xzhy800q1ueoyrg2hyk4j	cmtyh4tra0030uebk1ctq2tsa	cmu0xdt72000auezr1l31w5fm	2026-09-14 07:49:23.744
cmu0xzhy900q3ueoy7yari2kp	cmtyh4tra0030uebk1ctq2tsa	cmu0xdt73000buezrpa5pxvpf	2026-09-14 07:49:23.745
cmu0xzhyt00rrueoy67gtjjz6	cmtyh4trf003vuebkp9agdobo	cmtyjfr4v000kue6l3miyje2n	2026-09-14 07:49:23.765
cmu0xzhyu00rtueoy07zcqnab	cmtyh4trf003vuebkp9agdobo	cmtyjfr4x000lue6lymqtqwri	2026-09-14 07:49:23.766
cmu0xzhyv00rvueoyx5ly1xmm	cmtyh4trf003vuebkp9agdobo	cmtyjfr50000mue6l0dbxe7ub	2026-09-14 07:49:23.767
cmu0xzhyv00rxueoyx0ca994j	cmtyh4trf003vuebkp9agdobo	cmtyjfr53000nue6lgei3psv3	2026-09-14 07:49:23.768
cmu0xzhyw00rzueoy7zsrwngn	cmtyh4trf003vuebkp9agdobo	cmtyjfr55000oue6l9zxig9go	2026-09-14 07:49:23.769
cmu0xzhyx00s1ueoycamou5al	cmtyh4trf003vuebkp9agdobo	cmtyjfr57000pue6l4ug690s5	2026-09-14 07:49:23.769
cmu0xzhyy00s3ueoy3zm30aet	cmtyh4trf003vuebkp9agdobo	cmtylgo58000queqb3nv38iwo	2026-09-14 07:49:23.77
cmu0xzhyz00s5ueoy2bsz6zqr	cmtyh4trf003vuebkp9agdobo	cmtylgo5e000rueqbj1ncy6fx	2026-09-14 07:49:23.771
cmu0xzhyz00s7ueoy95vsnkmw	cmtyh4trf003vuebkp9agdobo	cmtylgo5g000sueqbpvbo7hvx	2026-09-14 07:49:23.772
cmu0xzhz000s9ueoy1oy1lx61	cmtyh4trf003vuebkp9agdobo	cmtylgo5i000tueqbyuk6w0f8	2026-09-14 07:49:23.773
cmu0xzhz100sbueoyztkzz5mt	cmtyh4trf003vuebkp9agdobo	cmtylx3ve000uue7dmegchwnr	2026-09-14 07:49:23.773
cmu0xzhz200sdueoyemh4q67o	cmtyh4trf003vuebkp9agdobo	cmtylx3vg000vue7dgcmytvn9	2026-09-14 07:49:23.774
cmu0xzhz300sfueoyyk5hpgpm	cmtyh4trf003vuebkp9agdobo	cmtylx3vi000wue7da17ngg44	2026-09-14 07:49:23.775
cmu0xzhz400shueoy6jpj7w6y	cmtyh4trf003vuebkp9agdobo	cmtylx3vj000xue7dtxaphm2y	2026-09-14 07:49:23.776
cmu0xzhz400sjueoyrp4wed10	cmtyh4trf003vuebkp9agdobo	cmtylx3vl000yue7d39v8rvoj	2026-09-14 07:49:23.777
cmu0xzhz500slueoy57rzctc2	cmtyh4trf003vuebkp9agdobo	cmtylx3vm000zue7d3ftz9x3t	2026-09-14 07:49:23.778
cmu0xzhz600snueoygvqlht72	cmtyh4trf003vuebkp9agdobo	cmtylx3vo0010ue7djz1ulwi4	2026-09-14 07:49:23.778
cmu0xzhz700spueoy6u40kueh	cmtyh4trf003vuebkp9agdobo	cmtylx3vp0011ue7dkdmw0m33	2026-09-14 07:49:23.779
cmu0xzhz700srueoyzpbnhyp3	cmtyh4trf003vuebkp9agdobo	cmtylx3vq0012ue7djc1f8pzp	2026-09-14 07:49:23.78
cmu0xzhz800stueoyi9snt0hq	cmtyh4trf003vuebkp9agdobo	cmtylx3vs0013ue7d978wuw8l	2026-09-14 07:49:23.781
cmu0xzhz900svueoylatn0d2u	cmtyh4trf003vuebkp9agdobo	cmtylx3vt0014ue7d132kuvhl	2026-09-14 07:49:23.782
cmu0xzhza00sxueoyj9epti4j	cmtyh4trf003vuebkp9agdobo	cmtylx3vu0015ue7dpcw6eubt	2026-09-14 07:49:23.782
cmu0xzhzb00szueoyubsldy4y	cmtyh4trf003vuebkp9agdobo	cmtylx3vw0016ue7dajokpiyl	2026-09-14 07:49:23.783
cmu0xzhzb00t1ueoy3sqgwgb7	cmtyh4trf003vuebkp9agdobo	cmtylx3vx0017ue7dsgsp43g4	2026-09-14 07:49:23.784
cmu0xzhzc00t3ueoyhe6tsxgp	cmtyh4trf003vuebkp9agdobo	cmtylx3vy0018ue7dqkwbhgve	2026-09-14 07:49:23.785
cmu0xzhzd00t5ueoygytnagzu	cmtyh4trf003vuebkp9agdobo	cmtylx3w00019ue7dwfb55ji7	2026-09-14 07:49:23.785
cmu0xzhze00t7ueoy3cnf6nai	cmtyh4trf003vuebkp9agdobo	cmtylx3w1001aue7df19ww36o	2026-09-14 07:49:23.786
cmu0xzhzf00t9ueoyhk74mxyo	cmtyh4trf003vuebkp9agdobo	cmtylx3w2001bue7dz05meqvz	2026-09-14 07:49:23.787
cmu0xzhzf00tbueoy5kly0pdy	cmtyh4trf003vuebkp9agdobo	cmtylx3w3001cue7dvh4o4go0	2026-09-14 07:49:23.788
cmu0xzhzg00tdueoy75cobwbn	cmtyh4trf003vuebkp9agdobo	cmtylx3w5001due7d3cz3it6f	2026-09-14 07:49:23.789
cmu0xzhzh00tfueoyl38zh9lp	cmtyh4trf003vuebkp9agdobo	cmtylx3w6001eue7d96vw878b	2026-09-14 07:49:23.789
cmu0xzhzj00thueoyxynzd1eb	cmtyh4trf003vuebkp9agdobo	cmtylx3w7001fue7djkhdfems	2026-09-14 07:49:23.791
cmu0xzhzj00tjueoy92b5uvzd	cmtyh4trf003vuebkp9agdobo	cmtylx3w8001gue7d78ky88m3	2026-09-14 07:49:23.792
cmu0xzhzk00tlueoyc4yltz8r	cmtyh4trf003vuebkp9agdobo	cmtylx3w9001hue7drxbp3pn4	2026-09-14 07:49:23.793
cmu0xzhzl00tnueoyt44rnvkt	cmtyh4trf003vuebkp9agdobo	cmtylx3wb001iue7dk7dyjdpr	2026-09-14 07:49:23.794
cmu0xzhzm00tpueoyrmp8kie3	cmtyh4trf003vuebkp9agdobo	cmtylx3wc001jue7dm3lw532r	2026-09-14 07:49:23.794
cmu0xzhzm00trueoyhxkmlxed	cmtyh4trf003vuebkp9agdobo	cmtylx3wd001kue7dn2heinif	2026-09-14 07:49:23.795
cmu0xzhzn00ttueoypfx0gnuk	cmtyh4trf003vuebkp9agdobo	cmtylx3wf001lue7dqixnf5gm	2026-09-14 07:49:23.796
cmu0xzhzo00tvueoyk99sptlh	cmtyh4trf003vuebkp9agdobo	cmtymku83001mueyphlm5ha32	2026-09-14 07:49:23.796
cmu0xzhzo00txueoy2n3ax88p	cmtyh4trf003vuebkp9agdobo	cmtymku8a001nueypnj227eem	2026-09-14 07:49:23.797
cmu0xzhzp00tzueoya1m0vblj	cmtyh4trf003vuebkp9agdobo	cmtymku8c001oueypamuta8b4	2026-09-14 07:49:23.798
cmu0xzhzq00u1ueoy9s8kus2t	cmtyh4trf003vuebkp9agdobo	cmtymku8d001pueypsm31kerv	2026-09-14 07:49:23.798
cmu0xzhzq00u3ueoy0zx11541	cmtyh4trf003vuebkp9agdobo	cmtymvm4a001quemugn59be8f	2026-09-14 07:49:23.799
cmu0xzhzr00u5ueoyh0rhj6ml	cmtyh4trf003vuebkp9agdobo	cmtymvm4h001ruemua9x74voq	2026-09-14 07:49:23.8
cmu0xzhzs00u7ueoy1wgmq7j4	cmtyh4trf003vuebkp9agdobo	cmtymvm4j001suemu8zgtvdxq	2026-09-14 07:49:23.8
cmu0xzhzs00u9ueoyz3rhxnfj	cmtyh4trf003vuebkp9agdobo	cmtymvm4k001tuemuw85qj03j	2026-09-14 07:49:23.801
cmu0xzhzt00ubueoy5k78vi32	cmtyh4trf003vuebkp9agdobo	cmtynichw001uuedpfi74idyq	2026-09-14 07:49:23.802
cmu0xzhzu00udueoy61pd030a	cmtyh4trf003vuebkp9agdobo	cmtzdx5ho0023ueeirsegmxep	2026-09-14 07:49:23.802
cmu0xzhzv00ufueoynq3rri7v	cmtyh4trf003vuebkp9agdobo	cmtzdx5hp0024ueei7vyxlb4u	2026-09-14 07:49:23.803
cmu0xzhzv00uhueoy8eiwfytv	cmtyh4trf003vuebkp9agdobo	cmtzdx5hq0025ueeiu2nxbyh0	2026-09-14 07:49:23.804
cmu0xzhzw00ujueoytp3tlnmh	cmtyh4trf003vuebkp9agdobo	cmtzdx5hr0026ueeiafcs5t6p	2026-09-14 07:49:23.804
cmu0xzhzx00ulueoyv53pmtwo	cmtyh4trf003vuebkp9agdobo	cmu00xej0001quew0zl9nn5y9	2026-09-14 07:49:23.805
cmu0xzhzx00unueoys26qdeub	cmtyh4trf003vuebkp9agdobo	cmu00xej3001ruew0m7dx2zxi	2026-09-14 07:49:23.806
cmu0xzhzy00upueoyn6tot2ly	cmtyh4trf003vuebkp9agdobo	cmu00xej4001suew0ptznfgkm	2026-09-14 07:49:23.806
cmu0xzhzz00urueoyh9gso9mg	cmtyh4trf003vuebkp9agdobo	cmu00xej5001tuew0dsl9b2v7	2026-09-14 07:49:23.807
cmtzca3yt00a5ue8dsznhwe7g	cmtv96wyh002mue7w8nxd6po7	cmtylx3wc001jue7dm3lw532r	2026-09-13 04:54:01.11
cmtzca3yu00a7ue8dvoz9sdq2	cmtv96wyh002mue7w8nxd6po7	cmtylx3wd001kue7dn2heinif	2026-09-13 04:54:01.111
cmtzca3yv00a9ue8dtesmjgr7	cmtv96wyh002mue7w8nxd6po7	cmtylx3wf001lue7dqixnf5gm	2026-09-13 04:54:01.112
cmtzca3yw00abue8d4z6m0qd7	cmtv96wyh002mue7w8nxd6po7	cmtymku83001mueyphlm5ha32	2026-09-13 04:54:01.112
cmtzca3yx00adue8deme6k0uc	cmtv96wyh002mue7w8nxd6po7	cmtymku8a001nueypnj227eem	2026-09-13 04:54:01.113
cmtzca3yx00afue8dfnxpfvsr	cmtv96wyh002mue7w8nxd6po7	cmtymku8c001oueypamuta8b4	2026-09-13 04:54:01.114
cmtzca3yy00ahue8d0j6qrvql	cmtv96wyh002mue7w8nxd6po7	cmtymku8d001pueypsm31kerv	2026-09-13 04:54:01.115
cmtzca3yz00ajue8dr5o1uh6f	cmtv96wyh002mue7w8nxd6po7	cmtymvm4a001quemugn59be8f	2026-09-13 04:54:01.115
cmtzca3z000alue8d85f12s75	cmtv96wyh002mue7w8nxd6po7	cmtymvm4h001ruemua9x74voq	2026-09-13 04:54:01.116
cmtzca3z100anue8do9l8higr	cmtv96wyh002mue7w8nxd6po7	cmtymvm4j001suemu8zgtvdxq	2026-09-13 04:54:01.117
cmtzca3z200apue8drvggq4u0	cmtv96wyh002mue7w8nxd6po7	cmtymvm4k001tuemuw85qj03j	2026-09-13 04:54:01.118
cmtzca3z200arue8dfyjyt418	cmtv96wyh002mue7w8nxd6po7	cmtynichw001uuedpfi74idyq	2026-09-13 04:54:01.119
cmtzca3za00bbue8dk5eaon2x	cmtv96wz40042ue7wl8nbr0tt	cmtyjfr50000mue6l0dbxe7ub	2026-09-13 04:54:01.126
cmtzca3zb00bdue8dxwbj2r08	cmtv96wz40042ue7wl8nbr0tt	cmtylgo58000queqb3nv38iwo	2026-09-13 04:54:01.127
cmtzca3zb00bfue8dihsigeot	cmtv96wz40042ue7wl8nbr0tt	cmtymvm4a001quemugn59be8f	2026-09-13 04:54:01.128
cmtzca3zc00bhue8dkqvwmlk3	cmtv96wz40042ue7wl8nbr0tt	cmtymvm4h001ruemua9x74voq	2026-09-13 04:54:01.129
cmtzca3zd00bjue8d1s0vz0si	cmtv96wz40042ue7wl8nbr0tt	cmtymvm4j001suemu8zgtvdxq	2026-09-13 04:54:01.129
cmtzca3zm00c7ue8drazkqrkq	cmtv96wzi004wue7w51lndipk	cmtyjfr50000mue6l0dbxe7ub	2026-09-13 04:54:01.138
cmtzca3zn00c9ue8d83i51jqw	cmtv96wzi004wue7w51lndipk	cmtymvm4a001quemugn59be8f	2026-09-13 04:54:01.139
cmtzca3zo00cbue8d9xqp3d4z	cmtv96wzi004wue7w51lndipk	cmtymvm4h001ruemua9x74voq	2026-09-13 04:54:01.14
cmu0xzi0000utueoy58unyf4i	cmtyh4trf003vuebkp9agdobo	cmu00xej6001uuew0gpckluas	2026-09-14 07:49:23.808
cmu0xzi0100uvueoyxv6cep4j	cmtyh4trf003vuebkp9agdobo	cmu00xej7001vuew0seq3yzf8	2026-09-14 07:49:23.809
cmu0xzi0100uxueoypleva623	cmtyh4trf003vuebkp9agdobo	cmu00xej9001wuew0ppb6oi29	2026-09-14 07:49:23.81
cmu0xzi0200uzueoyn2zvg0m1	cmtyh4trf003vuebkp9agdobo	cmu00xeja001xuew0p0wp0e33	2026-09-14 07:49:23.811
cmu0xzi0300v1ueoyp46ebr28	cmtyh4trf003vuebkp9agdobo	cmu00xejc001yuew0sw7f8ux8	2026-09-14 07:49:23.811
cmu0xzi0400v3ueoycvhcbqkr	cmtyh4trf003vuebkp9agdobo	cmu00xejd001zuew0flknxcp5	2026-09-14 07:49:23.812
cmu0xzi0500v5ueoyhccv35mf	cmtyh4trf003vuebkp9agdobo	cmu00xejd0020uew05xm4shjt	2026-09-14 07:49:23.813
cmu0xzi0500v7ueoyq4d527yg	cmtyh4trf003vuebkp9agdobo	cmu00xeje0021uew0h915r8qd	2026-09-14 07:49:23.814
cmu0xzi0600v9ueoysmj58678	cmtyh4trf003vuebkp9agdobo	cmu00xejf0022uew0isc46tbs	2026-09-14 07:49:23.815
cmu0xzi0700vbueoy71i39vx4	cmtyh4trf003vuebkp9agdobo	cmu00xejg0023uew0ztwph32y	2026-09-14 07:49:23.816
cmu0xzi0800vdueoy4ajxuzw8	cmtyh4trf003vuebkp9agdobo	cmu00xeji0024uew0mcbkio7j	2026-09-14 07:49:23.816
cmu0xzi0900vfueoy2t590ov6	cmtyh4trf003vuebkp9agdobo	cmu00xejj0025uew0fj1hqq9h	2026-09-14 07:49:23.817
cmu0xzi0900vhueoyg6vqjdm3	cmtyh4trf003vuebkp9agdobo	cmu00xejk0026uew0w794rlrq	2026-09-14 07:49:23.818
cmu0xzi0a00vjueoyto9r2s90	cmtyh4trf003vuebkp9agdobo	cmu00xejl0027uew0jrwv3tef	2026-09-14 07:49:23.819
cmu0xzi0b00vlueoyb0mwea3r	cmtyh4trf003vuebkp9agdobo	cmu00xejl0028uew0gd2nbkjf	2026-09-14 07:49:23.82
cmu0xzi0c00vnueoyamyj2jlb	cmtyh4trf003vuebkp9agdobo	cmu00xejm0029uew0ugly41ji	2026-09-14 07:49:23.82
cmu0xzi0d00vpueoywewwvnst	cmtyh4trf003vuebkp9agdobo	cmu00xejn002auew0yenkm697	2026-09-14 07:49:23.821
cmu0xzi0d00vrueoyqbqtylhi	cmtyh4trf003vuebkp9agdobo	cmu00xejo002buew0ebpnrg99	2026-09-14 07:49:23.822
cmu0xzi0e00vtueoyaya97ptg	cmtyh4trf003vuebkp9agdobo	cmu00xejp002cuew0a5gymobt	2026-09-14 07:49:23.823
cmu0xzi0f00vvueoyzewnis1e	cmtyh4trf003vuebkp9agdobo	cmu00xejq002duew0f34ts03e	2026-09-14 07:49:23.824
cmu0xzi0g00vxueoy6ixv5k3e	cmtyh4trf003vuebkp9agdobo	cmu00xejq002euew0okl8kr9p	2026-09-14 07:49:23.824
cmu0xzi0h00vzueoyf45ac41f	cmtyh4trf003vuebkp9agdobo	cmu00xejr002fuew0v6zeh3un	2026-09-14 07:49:23.825
cmu0xzi0i00w1ueoy9j0y26vp	cmtyh4trf003vuebkp9agdobo	cmu00xejs002guew0beagizb6	2026-09-14 07:49:23.826
cmu0xzi0i00w3ueoyq812wxww	cmtyh4trf003vuebkp9agdobo	cmu00xejt002huew0exlvoepp	2026-09-14 07:49:23.827
cmu0xzi0j00w5ueoyf9ntwqex	cmtyh4trf003vuebkp9agdobo	cmu00xeju002iuew0010gx11y	2026-09-14 07:49:23.828
cmu0xzi0k00w7ueoygtocqolf	cmtyh4trf003vuebkp9agdobo	cmu00xeju002juew01o6zdhru	2026-09-14 07:49:23.828
cmu0xzi0l00w9ueoy3jm0nq66	cmtyh4trf003vuebkp9agdobo	cmu00xejv002kuew0ibdstxn2	2026-09-14 07:49:23.829
cmu0xzi0m00wbueoyijdxa82z	cmtyh4trf003vuebkp9agdobo	cmu00xejw002luew0bexzxpkr	2026-09-14 07:49:23.83
cmu0xzi0n00wdueoypmgemx6y	cmtyh4trf003vuebkp9agdobo	cmu00xejx002muew0tnbha8ya	2026-09-14 07:49:23.831
cmu0xzi0n00wfueoy9fcsv8g3	cmtyh4trf003vuebkp9agdobo	cmu00xejx002nuew0fjyyiw8g	2026-09-14 07:49:23.832
cmu0xzi0o00whueoyu9srdl2z	cmtyh4trf003vuebkp9agdobo	cmu00xejy002ouew0txdcg2w7	2026-09-14 07:49:23.833
cmu0xzi0p00wjueoyje5rb4b4	cmtyh4trf003vuebkp9agdobo	cmu00xejz002puew0v5mpsow0	2026-09-14 07:49:23.833
cmu0xzi0q00wlueoyvabc8lxw	cmtyh4trf003vuebkp9agdobo	cmu00xek0002quew0pp8lpa9c	2026-09-14 07:49:23.834
cmu0xzi0q00wnueoyq6xj4rj2	cmtyh4trf003vuebkp9agdobo	cmu00xek1002ruew0zb67t8i8	2026-09-14 07:49:23.835
cmu0xzi0r00wpueoy4nqfzp5b	cmtyh4trf003vuebkp9agdobo	cmu00xek1002suew0v330qlmc	2026-09-14 07:49:23.836
cmu0xzi0s00wrueoylr0qq2en	cmtyh4trf003vuebkp9agdobo	cmu00xek2002tuew0kd2lhn8w	2026-09-14 07:49:23.836
cmu0xzi0t00wtueoylb1yikfm	cmtyh4trf003vuebkp9agdobo	cmu00xek3002uuew0iywdl2pp	2026-09-14 07:49:23.837
cmu0xzi0u00wvueoy8n0kcxa9	cmtyh4trf003vuebkp9agdobo	cmu00xekg003duew0rk8zhxa0	2026-09-14 07:49:23.838
cmu0xzi0u00wxueoymgiw7z2f	cmtyh4trf003vuebkp9agdobo	cmu0xdt6x0008uezr3tp2imgn	2026-09-14 07:49:23.839
cmu0xzi0v00wzueoyn0c66l1x	cmtyh4trf003vuebkp9agdobo	cmu0xdt700009uezru47yyxo6	2026-09-14 07:49:23.84
cmu0xzi0w00x1ueoyj46ghfma	cmtyh4trf003vuebkp9agdobo	cmu0xdt72000auezr1l31w5fm	2026-09-14 07:49:23.84
cmu0xzi0x00x3ueoyzxwd9bgl	cmtyh4trf003vuebkp9agdobo	cmu0xdt73000buezrpa5pxvpf	2026-09-14 07:49:23.841
cmu0xzi0z00x9ueoy2narqmw9	cmtyh4tro004quebkba9zxsyl	cmu0xdt6x0008uezr3tp2imgn	2026-09-14 07:49:23.844
cmu0xzi1000xbueoy6rbx9i7s	cmtyh4tro004quebkba9zxsyl	cmu0xdt700009uezru47yyxo6	2026-09-14 07:49:23.844
cmu0xzi1100xdueoyg7mk2oh9	cmtyh4tro004quebkba9zxsyl	cmu0xdt72000auezr1l31w5fm	2026-09-14 07:49:23.845
cmu0xzi1200xfueoymijzsgus	cmtyh4tro004quebkba9zxsyl	cmu0xdt73000buezrpa5pxvpf	2026-09-14 07:49:23.846
cmu0xzi1200xhueoy6h7sg2ew	cmtyh4tro004quebkba9zxsyl	cmtyjfr50000mue6l0dbxe7ub	2026-09-14 07:49:23.847
cmu0xzi1700xvueoycvlksjj0	cmtyh4tro004quebkba9zxsyl	cmtylgo58000queqb3nv38iwo	2026-09-14 07:49:23.852
cmu0xzi1800xxueoy5s425hzz	cmtyh4tro004quebkba9zxsyl	cmtymvm4a001quemugn59be8f	2026-09-14 07:49:23.853
cmu0xzi1900xzueoy46ad1j7e	cmtyh4tro004quebkba9zxsyl	cmtymvm4h001ruemua9x74voq	2026-09-14 07:49:23.853
cmu0xzi1a00y1ueoyzcujzlv9	cmtyh4tro004quebkba9zxsyl	cmtymvm4j001suemu8zgtvdxq	2026-09-14 07:49:23.854
cmu0xzi1f00yhueoy1qgsznle	cmtyh4trs0057uebkxup75g0i	cmtyjfr50000mue6l0dbxe7ub	2026-09-14 07:49:23.86
cmu0xzi1i00ynueoyefwqp0yk	cmtyh4trs0057uebkxup75g0i	cmtymvm4a001quemugn59be8f	2026-09-14 07:49:23.862
cmu0xzi1i00ypueoytvuoj5an	cmtyh4trs0057uebkxup75g0i	cmtymvm4h001ruemua9x74voq	2026-09-14 07:49:23.863
cmtvedny00040ueieoxvz3q16	cmtv96wyh002mue7w8nxd6po7	cmtv96wql000oue7wlrv5wc0s	2026-09-10 10:41:41.497
cmtvedny50042ueieyqc6bixw	cmtv96wyh002mue7w8nxd6po7	cmtv96wqn000pue7wti72lfrq	2026-09-10 10:41:41.501
cmtvedny60044ueie9eobeufi	cmtv96wyh002mue7w8nxd6po7	cmtv96wqp000que7wjld2xg01	2026-09-10 10:41:41.502
cmtvedny60046ueiebbt4pvlr	cmtv96wyh002mue7w8nxd6po7	cmtv96wqr000rue7w1weeqly3	2026-09-10 10:41:41.503
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, "tenantId", key, name, "isSystem", "createdAt", "updatedAt", description, "isActive") FROM stdin;
cmtv96wxh000yue7wbvlbpd58	cmtv96wxe000wue7w59ewld1m	OWNER	Owner	t	2026-09-10 08:16:28.469	2026-09-10 08:16:28.469	\N	t
cmtv96wyh002mue7w8nxd6po7	cmtv96wxe000wue7w59ewld1m	ADMIN	Admin	t	2026-09-10 08:16:28.505	2026-09-10 08:16:28.505	\N	t
cmtv96wz40042ue7wl8nbr0tt	cmtv96wxe000wue7w59ewld1m	MODERATOR	Moderator	t	2026-09-10 08:16:28.528	2026-09-10 08:16:28.528	\N	t
cmtv96wzd004kue7wx3p2sybf	cmtv96wxe000wue7w59ewld1m	EDITOR	Editor	t	2026-09-10 08:16:28.537	2026-09-10 08:16:28.537	\N	t
cmtv96wzi004wue7w51lndipk	cmtv96wxe000wue7w59ewld1m	STAFF	Staff	t	2026-09-10 08:16:28.543	2026-09-10 08:16:28.543	\N	t
cmtv96wzn0056ue7wt9iknn9p	cmtv96wxe000wue7w59ewld1m	MEMBER	Member	t	2026-09-10 08:16:28.547	2026-09-10 08:16:28.547	\N	t
cmtyh4tra0030uebk1ctq2tsa	cmtyh4tr8002yuebkqxkrgukw	OWNER	Owner	t	2026-09-12 14:22:06.503	2026-09-12 14:22:06.503	\N	t
cmtyh4trf003vuebkp9agdobo	cmtyh4tr8002yuebkqxkrgukw	ADMIN	Admin	t	2026-09-12 14:22:06.507	2026-09-12 14:22:06.507	\N	t
cmtyh4tro004quebkba9zxsyl	cmtyh4tr8002yuebkqxkrgukw	MODERATOR	Moderator	t	2026-09-12 14:22:06.517	2026-09-12 14:22:06.517	\N	t
cmtyh4trq0050uebkpsfpdo98	cmtyh4tr8002yuebkqxkrgukw	EDITOR	Editor	t	2026-09-12 14:22:06.519	2026-09-12 14:22:06.519	\N	t
cmtyh4trs0057uebkxup75g0i	cmtyh4tr8002yuebkqxkrgukw	STAFF	Staff	t	2026-09-12 14:22:06.52	2026-09-12 14:22:06.52	\N	t
cmtyh4tru005duebka82t4j6h	cmtyh4tr8002yuebkqxkrgukw	MEMBER	Member	t	2026-09-12 14:22:06.522	2026-09-12 14:22:06.522	\N	t
cmtzw37jk000hues5a1dhfiuz	cmtv96wxe000wue7w59ewld1m	ADMIN_COPY	Admin (Copy)	f	2026-09-13 14:08:31.472	2026-09-13 14:08:37.583	\N	f
cmu010w6b00kmue6svdvwxoyu	cmtv96wxe000wue7w59ewld1m	ACCOUNTANT	Accountant	t	2026-09-13 16:26:41.508	2026-09-13 16:26:41.508	\N	t
\.


--
-- Data for Name: service_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.service_requests (id, "tenantId", "requestType", "memberId", "requesterName", "requesterPhone", subject, description, "eventId", "registerType", "registerRecordId", status, "assignedToUserId", "resolutionNotes", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscriptions (id, "tenantId", "planId", status, "trialEndsAt", "currentPeriodEnd", "cancelledAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: tenant_divisions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenant_divisions (id, "tenantId", name, code, description, "order", "createdAt", "isActive", "updatedAt") FROM stdin;
cmtzny68j0007uekqyf0b6ral	cmtv96wxe000wue7w59ewld1m	Kambalakkad	KBD	\N	0	2026-09-13 10:20:39.571	t	2026-09-13 10:26:55.445
cmtzod6hs0001uev7rt50ooed	cmtv96wxe000wue7w59ewld1m	nilambur	NLM	\N	1	2026-09-13 10:32:19.745	t	2026-09-13 10:32:49.166
\.


--
-- Data for Name: tenant_family_statuses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenant_family_statuses (id, "tenantId", name, code, color, description, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cmu145jp2003ruejcyr9f6ac0	cmtv96wxe000wue7w59ewld1m	BPL	\N	emerald	\N	0	t	2026-09-14 10:42:03.638	2026-09-14 10:42:03.638
cmu145xfv003vuejc6x15kp0e	cmtv96wxe000wue7w59ewld1m	APL	\N	blue	\N	1	t	2026-09-14 10:42:21.452	2026-09-14 10:42:21.452
\.


--
-- Data for Name: tenant_feature_overrides; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenant_feature_overrides (id, "tenantId", "featureId", "isEnabled", "createdAt", "updatedAt") FROM stdin;
cmtzio7ac000zueedkl3rastn	cmtv96wxe000wue7w59ewld1m	cmtzerevg002juel2l6xwmp57	f	2026-09-13 07:52:56.292	2026-09-13 07:52:56.292
cmtzioc3o0013ueedv3fy13cy	cmtv96wxe000wue7w59ewld1m	cmtzerev7002euel2xzur6ndg	f	2026-09-13 07:53:02.532	2026-09-13 07:53:02.532
cmtziouf0001bueedv1nzjasg	cmtv96wxe000wue7w59ewld1m	cmtzerev9002fuel2ss38mzvb	f	2026-09-13 07:53:26.268	2026-09-13 07:53:26.268
cmu7197y6004juefs1ey3e7yf	cmtv96wxe000wue7w59ewld1m	cmtzerev6002duel2m7fo4762	t	2026-09-18 14:07:33.247	2026-09-18 14:07:42.684
cmu7181u3004buefsxeljv2hk	cmtv96wxe000wue7w59ewld1m	cmtzerev4002cuel2enbo2801	t	2026-09-18 14:06:38.668	2026-09-18 14:42:18.925
\.


--
-- Data for Name: tenant_memberships; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenant_memberships (id, "tenantId", "userId", "roleId", "isActive", "createdAt", "updatedAt") FROM stdin;
cmtv96x5q0059ue7wi16zpboj	cmtv96wxe000wue7w59ewld1m	cmtv96x5n0057ue7wcl3a27w0	cmtv96wxh000yue7wbvlbpd58	t	2026-09-10 08:16:28.767	2026-09-10 08:16:28.767
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenants (id, slug, name, "isActive", "createdAt", "updatedAt", description, "addressLine1", "addressLine2", "contactEmail", "contactPhone", country, "coverImageUrl", district, "divisionTerm", "hasDivisions", "houseNumberingMethod", "imamName", "khatheebName", latitude, "localBody", "localBodyType", "logoUrl", longitude, "masjidAddress", "masjidName", "masjidPhone", "pinCode", place, "presidentName", "presidentPhone", "secretaryName", "secretaryPhone", state, "treasurerName", "treasurerPhone", website, "houseNumberAllowManual", "houseNumberMinDigits", "houseNumberPrefix", "houseNumberStartAt", "houseNumberSuffix", "familyStatusTerm", "hasFamilyStatuses") FROM stdin;
cmtyh4tr8002yuebkqxkrgukw	mahalle	Mahalle	t	2026-09-12 14:22:06.501	2026-09-12 14:22:06.501	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	Category	f
cmtv96wxe000wue7w59ewld1m	demo	Kambalakkad	t	2026-09-10 08:16:28.466	2026-09-23 07:59:36.408	\N	\N	\N	\N	\N	\N	\N	\N		f	GLOBAL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Kerala	\N	\N	\N	t	1	KBD	1	\N	Category	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, "passwordHash", "fullName", "isActive", "createdAt", "updatedAt", phone) FROM stdin;
cmtv96wx6000tue7wfg2rfzuu	platform-admin@mahalle.local	$2a$12$0od696e6yV7sIrh3OYZ4hev7Z1g6aW8v8zCzT.kYvElLq.DJGAYXu	Platform Super Admin	t	2026-09-10 08:16:28.459	2026-09-10 08:16:28.459	\N
cmtv96x5n0057ue7wcl3a27w0	owner@demo.mahalle.local	$2a$12$8B.vqOiQy.uTIvtFgg1uDOeGn2WlKEhW1vWxdM3cPCc3cSW8tbeJ6	Demo Owner	t	2026-09-10 08:16:28.763	2026-09-10 08:16:28.763	\N
cmu4g44d30048uezjgje091gp	jazeelwayanad@gmail.com	$2a$12$W3iNTTewRaP7LTBU5xh7qutcNodG82nOFaEsiv/L2DGyPPWOEAEAW	ada	t	2026-09-16 18:40:11.032	2026-09-16 18:40:11.032	+919207483478
\.


--
-- Name: _MeetingAttendees _MeetingAttendees_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_MeetingAttendees"
    ADD CONSTRAINT "_MeetingAttendees_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: certificate_counters certificate_counters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificate_counters
    ADD CONSTRAINT certificate_counters_pkey PRIMARY KEY (id);


--
-- Name: committee_decisions committee_decisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_decisions
    ADD CONSTRAINT committee_decisions_pkey PRIMARY KEY (id);


--
-- Name: committee_meetings committee_meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_meetings
    ADD CONSTRAINT committee_meetings_pkey PRIMARY KEY (id);


--
-- Name: committee_members committee_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_members
    ADD CONSTRAINT committee_members_pkey PRIMARY KEY (id);


--
-- Name: death_records death_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.death_records
    ADD CONSTRAINT death_records_pkey PRIMARY KEY (id);


--
-- Name: divorce_records divorce_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divorce_records
    ADD CONSTRAINT divorce_records_pkey PRIMARY KEY (id);


--
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: families families_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.families
    ADD CONSTRAINT families_pkey PRIMARY KEY (id);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: finance_accounts finance_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_accounts
    ADD CONSTRAINT finance_accounts_pkey PRIMARY KEY (id);


--
-- Name: finance_bank_accounts finance_bank_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_bank_accounts
    ADD CONSTRAINT finance_bank_accounts_pkey PRIMARY KEY (id);


--
-- Name: finance_collection_categories finance_collection_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collection_categories
    ADD CONSTRAINT finance_collection_categories_pkey PRIMARY KEY (id);


--
-- Name: finance_collections finance_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collections
    ADD CONSTRAINT finance_collections_pkey PRIMARY KEY (id);


--
-- Name: finance_dues finance_dues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_dues
    ADD CONSTRAINT finance_dues_pkey PRIMARY KEY (id);


--
-- Name: finance_expense_categories finance_expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_expense_categories
    ADD CONSTRAINT finance_expense_categories_pkey PRIMARY KEY (id);


--
-- Name: finance_financial_years finance_financial_years_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_financial_years
    ADD CONSTRAINT finance_financial_years_pkey PRIMARY KEY (id);


--
-- Name: finance_interest_free_accounts finance_interest_free_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_interest_free_accounts
    ADD CONSTRAINT finance_interest_free_accounts_pkey PRIMARY KEY (id);


--
-- Name: finance_interest_free_transactions finance_interest_free_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_interest_free_transactions
    ADD CONSTRAINT finance_interest_free_transactions_pkey PRIMARY KEY (id);


--
-- Name: finance_journal_entries finance_journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_journal_entries
    ADD CONSTRAINT finance_journal_entries_pkey PRIMARY KEY (id);


--
-- Name: finance_journal_entry_lines finance_journal_entry_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_journal_entry_lines
    ADD CONSTRAINT finance_journal_entry_lines_pkey PRIMARY KEY (id);


--
-- Name: finance_payment_methods finance_payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_payment_methods
    ADD CONSTRAINT finance_payment_methods_pkey PRIMARY KEY (id);


--
-- Name: finance_receipts finance_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_receipts
    ADD CONSTRAINT finance_receipts_pkey PRIMARY KEY (id);


--
-- Name: finance_salary_records finance_salary_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_salary_records
    ADD CONSTRAINT finance_salary_records_pkey PRIMARY KEY (id);


--
-- Name: finance_settings finance_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_settings
    ADD CONSTRAINT finance_settings_pkey PRIMARY KEY (id);


--
-- Name: finance_tax_legal_filings finance_tax_legal_filings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_tax_legal_filings
    ADD CONSTRAINT finance_tax_legal_filings_pkey PRIMARY KEY (id);


--
-- Name: finance_vouchers finance_vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_vouchers
    ADD CONSTRAINT finance_vouchers_pkey PRIMARY KEY (id);


--
-- Name: form_assignments form_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_assignments
    ADD CONSTRAINT form_assignments_pkey PRIMARY KEY (id);


--
-- Name: form_fields form_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_fields
    ADD CONSTRAINT form_fields_pkey PRIMARY KEY (id);


--
-- Name: form_templates form_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_templates
    ADD CONSTRAINT form_templates_pkey PRIMARY KEY (id);


--
-- Name: form_versions form_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_versions
    ADD CONSTRAINT form_versions_pkey PRIMARY KEY (id);


--
-- Name: grave_records grave_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grave_records
    ADD CONSTRAINT grave_records_pkey PRIMARY KEY (id);


--
-- Name: houses houses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.houses
    ADD CONSTRAINT houses_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: madrassa_enrollments madrassa_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.madrassa_enrollments
    ADD CONSTRAINT madrassa_enrollments_pkey PRIMARY KEY (id);


--
-- Name: mahallu_release_records mahallu_release_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mahallu_release_records
    ADD CONSTRAINT mahallu_release_records_pkey PRIMARY KEY (id);


--
-- Name: marriage_records marriage_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marriage_records
    ADD CONSTRAINT marriage_records_pkey PRIMARY KEY (id);


--
-- Name: member_health_profiles member_health_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_health_profiles
    ADD CONSTRAINT member_health_profiles_pkey PRIMARY KEY (id);


--
-- Name: member_otps member_otps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_otps
    ADD CONSTRAINT member_otps_pkey PRIMARY KEY (id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- Name: onboarding_drafts onboarding_drafts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.onboarding_drafts
    ADD CONSTRAINT onboarding_drafts_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: plan_features plan_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT plan_features_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: platform_memberships platform_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_memberships
    ADD CONSTRAINT platform_memberships_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: property_records property_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_records
    ADD CONSTRAINT property_records_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: service_requests service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: tenant_divisions tenant_divisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_divisions
    ADD CONSTRAINT tenant_divisions_pkey PRIMARY KEY (id);


--
-- Name: tenant_family_statuses tenant_family_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_family_statuses
    ADD CONSTRAINT tenant_family_statuses_pkey PRIMARY KEY (id);


--
-- Name: tenant_feature_overrides tenant_feature_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_feature_overrides
    ADD CONSTRAINT tenant_feature_overrides_pkey PRIMARY KEY (id);


--
-- Name: tenant_memberships tenant_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT tenant_memberships_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: _MeetingAttendees_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_MeetingAttendees_B_index" ON public."_MeetingAttendees" USING btree ("B");


--
-- Name: announcements_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "announcements_tenantId_isActive_idx" ON public.announcements USING btree ("tenantId", "isActive");


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_actorUserId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "audit_logs_actorUserId_idx" ON public.audit_logs USING btree ("actorUserId");


--
-- Name: audit_logs_tenantId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "audit_logs_tenantId_createdAt_idx" ON public.audit_logs USING btree ("tenantId", "createdAt");


--
-- Name: certificate_counters_tenantId_registerType_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "certificate_counters_tenantId_registerType_key" ON public.certificate_counters USING btree ("tenantId", "registerType");


--
-- Name: committee_decisions_meetingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "committee_decisions_meetingId_idx" ON public.committee_decisions USING btree ("meetingId");


--
-- Name: committee_decisions_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "committee_decisions_tenantId_idx" ON public.committee_decisions USING btree ("tenantId");


--
-- Name: committee_meetings_tenantId_meetingDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "committee_meetings_tenantId_meetingDate_idx" ON public.committee_meetings USING btree ("tenantId", "meetingDate");


--
-- Name: committee_members_memberId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "committee_members_memberId_idx" ON public.committee_members USING btree ("memberId");


--
-- Name: committee_members_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "committee_members_tenantId_isActive_idx" ON public.committee_members USING btree ("tenantId", "isActive");


--
-- Name: death_records_memberId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "death_records_memberId_key" ON public.death_records USING btree ("memberId");


--
-- Name: death_records_tenantId_certificateNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "death_records_tenantId_certificateNumber_key" ON public.death_records USING btree ("tenantId", "certificateNumber");


--
-- Name: death_records_tenantId_dateOfDeath_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "death_records_tenantId_dateOfDeath_idx" ON public.death_records USING btree ("tenantId", "dateOfDeath");


--
-- Name: divorce_records_tenantId_certificateNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "divorce_records_tenantId_certificateNumber_key" ON public.divorce_records USING btree ("tenantId", "certificateNumber");


--
-- Name: divorce_records_tenantId_divorceDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "divorce_records_tenantId_divorceDate_idx" ON public.divorce_records USING btree ("tenantId", "divorceDate");


--
-- Name: event_registrations_tenantId_eventId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "event_registrations_tenantId_eventId_idx" ON public.event_registrations USING btree ("tenantId", "eventId");


--
-- Name: events_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "events_tenantId_isActive_idx" ON public.events USING btree ("tenantId", "isActive");


--
-- Name: events_tenantId_startsAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "events_tenantId_startsAt_idx" ON public.events USING btree ("tenantId", "startsAt");


--
-- Name: families_familyStatusId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "families_familyStatusId_idx" ON public.families USING btree ("familyStatusId");


--
-- Name: families_houseId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "families_houseId_idx" ON public.families USING btree ("houseId");


--
-- Name: families_tenantId_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "families_tenantId_category_idx" ON public.families USING btree ("tenantId", category);


--
-- Name: families_tenantId_familyNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "families_tenantId_familyNumber_key" ON public.families USING btree ("tenantId", "familyNumber");


--
-- Name: families_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "families_tenantId_isActive_idx" ON public.families USING btree ("tenantId", "isActive");


--
-- Name: families_tenantId_requiresCommunitySupport_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "families_tenantId_requiresCommunitySupport_idx" ON public.families USING btree ("tenantId", "requiresCommunitySupport");


--
-- Name: features_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX features_key_key ON public.features USING btree (key);


--
-- Name: finance_accounts_parentAccountId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_accounts_parentAccountId_idx" ON public.finance_accounts USING btree ("parentAccountId");


--
-- Name: finance_accounts_tenantId_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_accounts_tenantId_code_idx" ON public.finance_accounts USING btree ("tenantId", code);


--
-- Name: finance_accounts_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_accounts_tenantId_isActive_idx" ON public.finance_accounts USING btree ("tenantId", "isActive");


--
-- Name: finance_accounts_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_accounts_tenantId_name_key" ON public.finance_accounts USING btree ("tenantId", name);


--
-- Name: finance_bank_accounts_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_bank_accounts_tenantId_isActive_idx" ON public.finance_bank_accounts USING btree ("tenantId", "isActive");


--
-- Name: finance_collection_categories_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_collection_categories_tenantId_isActive_idx" ON public.finance_collection_categories USING btree ("tenantId", "isActive");


--
-- Name: finance_collection_categories_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_collection_categories_tenantId_name_key" ON public.finance_collection_categories USING btree ("tenantId", name);


--
-- Name: finance_collections_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_collections_categoryId_idx" ON public.finance_collections USING btree ("categoryId");


--
-- Name: finance_collections_familyId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_collections_familyId_idx" ON public.finance_collections USING btree ("familyId");


--
-- Name: finance_collections_journalEntryId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_collections_journalEntryId_key" ON public.finance_collections USING btree ("journalEntryId");


--
-- Name: finance_collections_memberId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_collections_memberId_idx" ON public.finance_collections USING btree ("memberId");


--
-- Name: finance_collections_receiptId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_collections_receiptId_key" ON public.finance_collections USING btree ("receiptId");


--
-- Name: finance_collections_tenantId_collectionNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_collections_tenantId_collectionNumber_key" ON public.finance_collections USING btree ("tenantId", "collectionNumber");


--
-- Name: finance_collections_tenantId_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_collections_tenantId_date_idx" ON public.finance_collections USING btree ("tenantId", date);


--
-- Name: finance_collections_tenantId_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_collections_tenantId_type_idx" ON public.finance_collections USING btree ("tenantId", type);


--
-- Name: finance_dues_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_dues_categoryId_idx" ON public.finance_dues USING btree ("categoryId");


--
-- Name: finance_dues_familyId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_dues_familyId_idx" ON public.finance_dues USING btree ("familyId");


--
-- Name: finance_dues_memberId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_dues_memberId_idx" ON public.finance_dues USING btree ("memberId");


--
-- Name: finance_dues_paidVoucherId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_dues_paidVoucherId_key" ON public.finance_dues USING btree ("paidVoucherId");


--
-- Name: finance_dues_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_dues_tenantId_status_idx" ON public.finance_dues USING btree ("tenantId", status);


--
-- Name: finance_expense_categories_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_expense_categories_tenantId_isActive_idx" ON public.finance_expense_categories USING btree ("tenantId", "isActive");


--
-- Name: finance_expense_categories_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_expense_categories_tenantId_name_key" ON public.finance_expense_categories USING btree ("tenantId", name);


--
-- Name: finance_financial_years_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_financial_years_tenantId_name_key" ON public.finance_financial_years USING btree ("tenantId", name);


--
-- Name: finance_financial_years_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_financial_years_tenantId_status_idx" ON public.finance_financial_years USING btree ("tenantId", status);


--
-- Name: finance_interest_free_accounts_tenantId_accountNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_interest_free_accounts_tenantId_accountNumber_key" ON public.finance_interest_free_accounts USING btree ("tenantId", "accountNumber");


--
-- Name: finance_interest_free_accounts_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_interest_free_accounts_tenantId_status_idx" ON public.finance_interest_free_accounts USING btree ("tenantId", status);


--
-- Name: finance_interest_free_transactions_accountId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_interest_free_transactions_accountId_idx" ON public.finance_interest_free_transactions USING btree ("accountId");


--
-- Name: finance_interest_free_transactions_tenantId_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_interest_free_transactions_tenantId_date_idx" ON public.finance_interest_free_transactions USING btree ("tenantId", date);


--
-- Name: finance_journal_entries_financialYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_journal_entries_financialYearId_idx" ON public.finance_journal_entries USING btree ("financialYearId");


--
-- Name: finance_journal_entries_tenantId_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_journal_entries_tenantId_date_idx" ON public.finance_journal_entries USING btree ("tenantId", date);


--
-- Name: finance_journal_entries_tenantId_entryNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_journal_entries_tenantId_entryNumber_key" ON public.finance_journal_entries USING btree ("tenantId", "entryNumber");


--
-- Name: finance_journal_entries_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_journal_entries_tenantId_status_idx" ON public.finance_journal_entries USING btree ("tenantId", status);


--
-- Name: finance_journal_entry_lines_accountId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_journal_entry_lines_accountId_idx" ON public.finance_journal_entry_lines USING btree ("accountId");


--
-- Name: finance_journal_entry_lines_journalEntryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_journal_entry_lines_journalEntryId_idx" ON public.finance_journal_entry_lines USING btree ("journalEntryId");


--
-- Name: finance_payment_methods_tenantId_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_payment_methods_tenantId_code_key" ON public.finance_payment_methods USING btree ("tenantId", code);


--
-- Name: finance_payment_methods_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_payment_methods_tenantId_isActive_idx" ON public.finance_payment_methods USING btree ("tenantId", "isActive");


--
-- Name: finance_receipts_tenantId_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_receipts_tenantId_date_idx" ON public.finance_receipts USING btree ("tenantId", date);


--
-- Name: finance_receipts_tenantId_receiptNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_receipts_tenantId_receiptNumber_key" ON public.finance_receipts USING btree ("tenantId", "receiptNumber");


--
-- Name: finance_receipts_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_receipts_tenantId_status_idx" ON public.finance_receipts USING btree ("tenantId", status);


--
-- Name: finance_salary_records_paidVoucherId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_salary_records_paidVoucherId_key" ON public.finance_salary_records USING btree ("paidVoucherId");


--
-- Name: finance_salary_records_tenantId_staffName_month_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_salary_records_tenantId_staffName_month_key" ON public.finance_salary_records USING btree ("tenantId", "staffName", month);


--
-- Name: finance_salary_records_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_salary_records_tenantId_status_idx" ON public.finance_salary_records USING btree ("tenantId", status);


--
-- Name: finance_settings_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_settings_tenantId_key" ON public.finance_settings USING btree ("tenantId");


--
-- Name: finance_tax_legal_filings_tenantId_dueDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_tax_legal_filings_tenantId_dueDate_idx" ON public.finance_tax_legal_filings USING btree ("tenantId", "dueDate");


--
-- Name: finance_tax_legal_filings_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_tax_legal_filings_tenantId_status_idx" ON public.finance_tax_legal_filings USING btree ("tenantId", status);


--
-- Name: finance_vouchers_accountId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_vouchers_accountId_idx" ON public.finance_vouchers USING btree ("accountId");


--
-- Name: finance_vouchers_bankAccountId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_vouchers_bankAccountId_idx" ON public.finance_vouchers USING btree ("bankAccountId");


--
-- Name: finance_vouchers_eventId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_vouchers_eventId_idx" ON public.finance_vouchers USING btree ("eventId");


--
-- Name: finance_vouchers_expenseCategoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_vouchers_expenseCategoryId_idx" ON public.finance_vouchers USING btree ("expenseCategoryId");


--
-- Name: finance_vouchers_journalEntryId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_vouchers_journalEntryId_key" ON public.finance_vouchers USING btree ("journalEntryId");


--
-- Name: finance_vouchers_tenantId_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "finance_vouchers_tenantId_date_idx" ON public.finance_vouchers USING btree ("tenantId", date);


--
-- Name: finance_vouchers_tenantId_voucherNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "finance_vouchers_tenantId_voucherNumber_key" ON public.finance_vouchers USING btree ("tenantId", "voucherNumber");


--
-- Name: form_assignments_templateId_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "form_assignments_templateId_tenantId_key" ON public.form_assignments USING btree ("templateId", "tenantId");


--
-- Name: form_fields_versionId_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "form_fields_versionId_key_key" ON public.form_fields USING btree ("versionId", key);


--
-- Name: form_fields_versionId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "form_fields_versionId_order_idx" ON public.form_fields USING btree ("versionId", "order");


--
-- Name: form_templates_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX form_templates_key_key ON public.form_templates USING btree (key);


--
-- Name: form_versions_templateId_version_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "form_versions_templateId_version_key" ON public.form_versions USING btree ("templateId", version);


--
-- Name: grave_records_deathRecordId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "grave_records_deathRecordId_key" ON public.grave_records USING btree ("deathRecordId");


--
-- Name: grave_records_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "grave_records_tenantId_idx" ON public.grave_records USING btree ("tenantId");


--
-- Name: grave_records_tenantId_plotNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "grave_records_tenantId_plotNumber_key" ON public.grave_records USING btree ("tenantId", "plotNumber");


--
-- Name: houses_divisionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "houses_divisionId_idx" ON public.houses USING btree ("divisionId");


--
-- Name: houses_tenantId_displayNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "houses_tenantId_displayNumber_key" ON public.houses USING btree ("tenantId", "displayNumber");


--
-- Name: houses_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "houses_tenantId_isActive_idx" ON public.houses USING btree ("tenantId", "isActive");


--
-- Name: invoices_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "invoices_tenantId_idx" ON public.invoices USING btree ("tenantId");


--
-- Name: madrassa_enrollments_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "madrassa_enrollments_tenantId_isActive_idx" ON public.madrassa_enrollments USING btree ("tenantId", "isActive");


--
-- Name: mahallu_release_records_tenantId_certificateNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "mahallu_release_records_tenantId_certificateNumber_key" ON public.mahallu_release_records USING btree ("tenantId", "certificateNumber");


--
-- Name: mahallu_release_records_tenantId_releaseDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "mahallu_release_records_tenantId_releaseDate_idx" ON public.mahallu_release_records USING btree ("tenantId", "releaseDate");


--
-- Name: marriage_records_tenantId_certificateNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "marriage_records_tenantId_certificateNumber_key" ON public.marriage_records USING btree ("tenantId", "certificateNumber");


--
-- Name: marriage_records_tenantId_marriageDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "marriage_records_tenantId_marriageDate_idx" ON public.marriage_records USING btree ("tenantId", "marriageDate");


--
-- Name: member_health_profiles_memberId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "member_health_profiles_memberId_key" ON public.member_health_profiles USING btree ("memberId");


--
-- Name: member_health_profiles_tenantId_hasChronicIllness_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "member_health_profiles_tenantId_hasChronicIllness_idx" ON public.member_health_profiles USING btree ("tenantId", "hasChronicIllness");


--
-- Name: member_health_profiles_tenantId_hasDisability_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "member_health_profiles_tenantId_hasDisability_idx" ON public.member_health_profiles USING btree ("tenantId", "hasDisability");


--
-- Name: member_health_profiles_tenantId_requiresCommunitySupport_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "member_health_profiles_tenantId_requiresCommunitySupport_idx" ON public.member_health_profiles USING btree ("tenantId", "requiresCommunitySupport");


--
-- Name: member_health_profiles_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "member_health_profiles_tenantId_status_idx" ON public.member_health_profiles USING btree ("tenantId", status);


--
-- Name: member_otps_memberId_consumedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "member_otps_memberId_consumedAt_idx" ON public.member_otps USING btree ("memberId", "consumedAt");


--
-- Name: members_familyId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "members_familyId_idx" ON public.members USING btree ("familyId");


--
-- Name: members_tenantId_bloodGroup_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "members_tenantId_bloodGroup_idx" ON public.members USING btree ("tenantId", "bloodGroup");


--
-- Name: members_tenantId_educationLevel_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "members_tenantId_educationLevel_idx" ON public.members USING btree ("tenantId", "educationLevel");


--
-- Name: members_tenantId_employmentStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "members_tenantId_employmentStatus_idx" ON public.members USING btree ("tenantId", "employmentStatus");


--
-- Name: members_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "members_tenantId_isActive_idx" ON public.members USING btree ("tenantId", "isActive");


--
-- Name: members_tenantId_isExpatriate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "members_tenantId_isExpatriate_idx" ON public.members USING btree ("tenantId", "isExpatriate");


--
-- Name: members_tenantId_isJobSeeker_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "members_tenantId_isJobSeeker_idx" ON public.members USING btree ("tenantId", "isJobSeeker");


--
-- Name: members_tenantId_isYatheem_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "members_tenantId_isYatheem_idx" ON public.members USING btree ("tenantId", "isYatheem");


--
-- Name: members_tenantId_movementStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "members_tenantId_movementStatus_idx" ON public.members USING btree ("tenantId", "movementStatus");


--
-- Name: members_tenantId_phone_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "members_tenantId_phone_key" ON public.members USING btree ("tenantId", phone);


--
-- Name: notification_settings_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "notification_settings_tenantId_key" ON public.notification_settings USING btree ("tenantId");


--
-- Name: onboarding_drafts_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "onboarding_drafts_userId_key" ON public.onboarding_drafts USING btree ("userId");


--
-- Name: payments_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "payments_tenantId_idx" ON public.payments USING btree ("tenantId");


--
-- Name: permissions_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX permissions_key_key ON public.permissions USING btree (key);


--
-- Name: plan_features_planId_featureId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "plan_features_planId_featureId_key" ON public.plan_features USING btree ("planId", "featureId");


--
-- Name: plans_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX plans_key_key ON public.plans USING btree (key);


--
-- Name: platform_memberships_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "platform_memberships_userId_key" ON public.platform_memberships USING btree ("userId");


--
-- Name: programs_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "programs_tenantId_isActive_idx" ON public.programs USING btree ("tenantId", "isActive");


--
-- Name: property_records_tenantId_propertyType_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "property_records_tenantId_propertyType_isActive_idx" ON public.property_records USING btree ("tenantId", "propertyType", "isActive");


--
-- Name: refresh_tokens_replacedById_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "refresh_tokens_replacedById_key" ON public.refresh_tokens USING btree ("replacedById");


--
-- Name: refresh_tokens_tokenHash_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON public.refresh_tokens USING btree ("tokenHash");


--
-- Name: refresh_tokens_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "refresh_tokens_userId_idx" ON public.refresh_tokens USING btree ("userId");


--
-- Name: role_permissions_permissionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "role_permissions_permissionId_idx" ON public.role_permissions USING btree ("permissionId");


--
-- Name: role_permissions_roleId_permissionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON public.role_permissions USING btree ("roleId", "permissionId");


--
-- Name: roles_tenantId_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "roles_tenantId_key_key" ON public.roles USING btree ("tenantId", key);


--
-- Name: service_requests_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "service_requests_tenantId_status_idx" ON public.service_requests USING btree ("tenantId", status);


--
-- Name: subscriptions_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "subscriptions_tenantId_key" ON public.subscriptions USING btree ("tenantId");


--
-- Name: tenant_divisions_tenantId_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "tenant_divisions_tenantId_code_key" ON public.tenant_divisions USING btree ("tenantId", code);


--
-- Name: tenant_divisions_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_divisions_tenantId_isActive_idx" ON public.tenant_divisions USING btree ("tenantId", "isActive");


--
-- Name: tenant_divisions_tenantId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_divisions_tenantId_order_idx" ON public.tenant_divisions USING btree ("tenantId", "order");


--
-- Name: tenant_family_statuses_tenantId_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "tenant_family_statuses_tenantId_code_key" ON public.tenant_family_statuses USING btree ("tenantId", code);


--
-- Name: tenant_family_statuses_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_family_statuses_tenantId_isActive_idx" ON public.tenant_family_statuses USING btree ("tenantId", "isActive");


--
-- Name: tenant_family_statuses_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "tenant_family_statuses_tenantId_name_key" ON public.tenant_family_statuses USING btree ("tenantId", name);


--
-- Name: tenant_family_statuses_tenantId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_family_statuses_tenantId_order_idx" ON public.tenant_family_statuses USING btree ("tenantId", "order");


--
-- Name: tenant_feature_overrides_tenantId_featureId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "tenant_feature_overrides_tenantId_featureId_key" ON public.tenant_feature_overrides USING btree ("tenantId", "featureId");


--
-- Name: tenant_memberships_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_memberships_tenantId_isActive_idx" ON public.tenant_memberships USING btree ("tenantId", "isActive");


--
-- Name: tenant_memberships_tenantId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "tenant_memberships_tenantId_userId_key" ON public.tenant_memberships USING btree ("tenantId", "userId");


--
-- Name: tenant_memberships_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_memberships_userId_idx" ON public.tenant_memberships USING btree ("userId");


--
-- Name: tenants_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenants_isActive_idx" ON public.tenants USING btree ("isActive");


--
-- Name: tenants_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tenants_slug_key ON public.tenants USING btree (slug);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: _MeetingAttendees _MeetingAttendees_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_MeetingAttendees"
    ADD CONSTRAINT "_MeetingAttendees_A_fkey" FOREIGN KEY ("A") REFERENCES public.committee_meetings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _MeetingAttendees _MeetingAttendees_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_MeetingAttendees"
    ADD CONSTRAINT "_MeetingAttendees_B_fkey" FOREIGN KEY ("B") REFERENCES public.committee_members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcements announcements_targetDivisionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT "announcements_targetDivisionId_fkey" FOREIGN KEY ("targetDivisionId") REFERENCES public.tenant_divisions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: announcements announcements_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT "announcements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_actorUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: audit_logs audit_logs_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: certificate_counters certificate_counters_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificate_counters
    ADD CONSTRAINT "certificate_counters_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: committee_decisions committee_decisions_meetingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_decisions
    ADD CONSTRAINT "committee_decisions_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES public.committee_meetings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: committee_decisions committee_decisions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_decisions
    ADD CONSTRAINT "committee_decisions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: committee_meetings committee_meetings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_meetings
    ADD CONSTRAINT "committee_meetings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: committee_members committee_members_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_members
    ADD CONSTRAINT "committee_members_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: committee_members committee_members_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_members
    ADD CONSTRAINT "committee_members_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: death_records death_records_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.death_records
    ADD CONSTRAINT "death_records_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: death_records death_records_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.death_records
    ADD CONSTRAINT "death_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: divorce_records divorce_records_husbandMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divorce_records
    ADD CONSTRAINT "divorce_records_husbandMemberId_fkey" FOREIGN KEY ("husbandMemberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: divorce_records divorce_records_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divorce_records
    ADD CONSTRAINT "divorce_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: divorce_records divorce_records_wifeMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divorce_records
    ADD CONSTRAINT "divorce_records_wifeMemberId_fkey" FOREIGN KEY ("wifeMemberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: event_registrations event_registrations_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT "event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_registrations event_registrations_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT "event_registrations_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: event_registrations event_registrations_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT "event_registrations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: events events_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "events_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: families families_familyStatusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.families
    ADD CONSTRAINT "families_familyStatusId_fkey" FOREIGN KEY ("familyStatusId") REFERENCES public.tenant_family_statuses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: families families_houseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.families
    ADD CONSTRAINT "families_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES public.houses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: families families_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.families
    ADD CONSTRAINT "families_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_accounts finance_accounts_parentAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_accounts
    ADD CONSTRAINT "finance_accounts_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES public.finance_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_accounts finance_accounts_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_accounts
    ADD CONSTRAINT "finance_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_bank_accounts finance_bank_accounts_chartAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_bank_accounts
    ADD CONSTRAINT "finance_bank_accounts_chartAccountId_fkey" FOREIGN KEY ("chartAccountId") REFERENCES public.finance_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_bank_accounts finance_bank_accounts_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_bank_accounts
    ADD CONSTRAINT "finance_bank_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_collection_categories finance_collection_categories_incomeAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collection_categories
    ADD CONSTRAINT "finance_collection_categories_incomeAccountId_fkey" FOREIGN KEY ("incomeAccountId") REFERENCES public.finance_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_collection_categories finance_collection_categories_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collection_categories
    ADD CONSTRAINT "finance_collection_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_collections finance_collections_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collections
    ADD CONSTRAINT "finance_collections_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public.finance_bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_collections finance_collections_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collections
    ADD CONSTRAINT "finance_collections_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.finance_collection_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_collections finance_collections_familyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collections
    ADD CONSTRAINT "finance_collections_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES public.families(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_collections finance_collections_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collections
    ADD CONSTRAINT "finance_collections_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.finance_journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_collections finance_collections_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collections
    ADD CONSTRAINT "finance_collections_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_collections finance_collections_paymentMethodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collections
    ADD CONSTRAINT "finance_collections_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES public.finance_payment_methods(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_collections finance_collections_receiptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collections
    ADD CONSTRAINT "finance_collections_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES public.finance_receipts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_collections finance_collections_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_collections
    ADD CONSTRAINT "finance_collections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_dues finance_dues_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_dues
    ADD CONSTRAINT "finance_dues_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.finance_collection_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_dues finance_dues_familyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_dues
    ADD CONSTRAINT "finance_dues_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES public.families(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_dues finance_dues_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_dues
    ADD CONSTRAINT "finance_dues_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_dues finance_dues_paidVoucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_dues
    ADD CONSTRAINT "finance_dues_paidVoucherId_fkey" FOREIGN KEY ("paidVoucherId") REFERENCES public.finance_vouchers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_dues finance_dues_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_dues
    ADD CONSTRAINT "finance_dues_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_expense_categories finance_expense_categories_expenseAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_expense_categories
    ADD CONSTRAINT "finance_expense_categories_expenseAccountId_fkey" FOREIGN KEY ("expenseAccountId") REFERENCES public.finance_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_expense_categories finance_expense_categories_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_expense_categories
    ADD CONSTRAINT "finance_expense_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_financial_years finance_financial_years_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_financial_years
    ADD CONSTRAINT "finance_financial_years_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_interest_free_accounts finance_interest_free_accounts_familyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_interest_free_accounts
    ADD CONSTRAINT "finance_interest_free_accounts_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES public.families(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_interest_free_accounts finance_interest_free_accounts_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_interest_free_accounts
    ADD CONSTRAINT "finance_interest_free_accounts_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_interest_free_accounts finance_interest_free_accounts_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_interest_free_accounts
    ADD CONSTRAINT "finance_interest_free_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_interest_free_transactions finance_interest_free_transactions_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_interest_free_transactions
    ADD CONSTRAINT "finance_interest_free_transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public.finance_interest_free_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_interest_free_transactions finance_interest_free_transactions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_interest_free_transactions
    ADD CONSTRAINT "finance_interest_free_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_journal_entries finance_journal_entries_financialYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_journal_entries
    ADD CONSTRAINT "finance_journal_entries_financialYearId_fkey" FOREIGN KEY ("financialYearId") REFERENCES public.finance_financial_years(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_journal_entries finance_journal_entries_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_journal_entries
    ADD CONSTRAINT "finance_journal_entries_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_journal_entry_lines finance_journal_entry_lines_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_journal_entry_lines
    ADD CONSTRAINT "finance_journal_entry_lines_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public.finance_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: finance_journal_entry_lines finance_journal_entry_lines_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_journal_entry_lines
    ADD CONSTRAINT "finance_journal_entry_lines_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.finance_journal_entries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_payment_methods finance_payment_methods_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_payment_methods
    ADD CONSTRAINT "finance_payment_methods_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_receipts finance_receipts_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_receipts
    ADD CONSTRAINT "finance_receipts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_salary_records finance_salary_records_paidVoucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_salary_records
    ADD CONSTRAINT "finance_salary_records_paidVoucherId_fkey" FOREIGN KEY ("paidVoucherId") REFERENCES public.finance_vouchers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_salary_records finance_salary_records_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_salary_records
    ADD CONSTRAINT "finance_salary_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_settings finance_settings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_settings
    ADD CONSTRAINT "finance_settings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_tax_legal_filings finance_tax_legal_filings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_tax_legal_filings
    ADD CONSTRAINT "finance_tax_legal_filings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: finance_vouchers finance_vouchers_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_vouchers
    ADD CONSTRAINT "finance_vouchers_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public.finance_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: finance_vouchers finance_vouchers_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_vouchers
    ADD CONSTRAINT "finance_vouchers_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public.finance_bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_vouchers finance_vouchers_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_vouchers
    ADD CONSTRAINT "finance_vouchers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_vouchers finance_vouchers_expenseCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_vouchers
    ADD CONSTRAINT "finance_vouchers_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES public.finance_expense_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_vouchers finance_vouchers_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_vouchers
    ADD CONSTRAINT "finance_vouchers_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.finance_journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_vouchers finance_vouchers_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_vouchers
    ADD CONSTRAINT "finance_vouchers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_vouchers finance_vouchers_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_vouchers
    ADD CONSTRAINT "finance_vouchers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: form_assignments form_assignments_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_assignments
    ADD CONSTRAINT "form_assignments_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public.form_templates(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: form_assignments form_assignments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_assignments
    ADD CONSTRAINT "form_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: form_fields form_fields_versionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_fields
    ADD CONSTRAINT "form_fields_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES public.form_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: form_versions form_versions_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_versions
    ADD CONSTRAINT "form_versions_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public.form_templates(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grave_records grave_records_deathRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grave_records
    ADD CONSTRAINT "grave_records_deathRecordId_fkey" FOREIGN KEY ("deathRecordId") REFERENCES public.death_records(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: grave_records grave_records_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grave_records
    ADD CONSTRAINT "grave_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: houses houses_divisionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.houses
    ADD CONSTRAINT "houses_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES public.tenant_divisions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: houses houses_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.houses
    ADD CONSTRAINT "houses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoices invoices_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: madrassa_enrollments madrassa_enrollments_studentMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.madrassa_enrollments
    ADD CONSTRAINT "madrassa_enrollments_studentMemberId_fkey" FOREIGN KEY ("studentMemberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: madrassa_enrollments madrassa_enrollments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.madrassa_enrollments
    ADD CONSTRAINT "madrassa_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mahallu_release_records mahallu_release_records_familyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mahallu_release_records
    ADD CONSTRAINT "mahallu_release_records_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES public.families(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mahallu_release_records mahallu_release_records_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mahallu_release_records
    ADD CONSTRAINT "mahallu_release_records_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mahallu_release_records mahallu_release_records_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mahallu_release_records
    ADD CONSTRAINT "mahallu_release_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: marriage_records marriage_records_brideMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marriage_records
    ADD CONSTRAINT "marriage_records_brideMemberId_fkey" FOREIGN KEY ("brideMemberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: marriage_records marriage_records_groomMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marriage_records
    ADD CONSTRAINT "marriage_records_groomMemberId_fkey" FOREIGN KEY ("groomMemberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: marriage_records marriage_records_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marriage_records
    ADD CONSTRAINT "marriage_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: member_health_profiles member_health_profiles_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_health_profiles
    ADD CONSTRAINT "member_health_profiles_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: member_health_profiles member_health_profiles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_health_profiles
    ADD CONSTRAINT "member_health_profiles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: member_otps member_otps_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_otps
    ADD CONSTRAINT "member_otps_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: member_otps member_otps_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_otps
    ADD CONSTRAINT "member_otps_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: members members_familyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT "members_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES public.families(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: members members_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT "members_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification_settings notification_settings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT "notification_settings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: onboarding_drafts onboarding_drafts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.onboarding_drafts
    ADD CONSTRAINT "onboarding_drafts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: plan_features plan_features_featureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT "plan_features_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES public.features(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: plan_features plan_features_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT "plan_features_planId_fkey" FOREIGN KEY ("planId") REFERENCES public.plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: platform_memberships platform_memberships_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_memberships
    ADD CONSTRAINT "platform_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: programs programs_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT "programs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: property_records property_records_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_records
    ADD CONSTRAINT "property_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_replacedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_replacedById_fkey" FOREIGN KEY ("replacedById") REFERENCES public.refresh_tokens(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: roles roles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: service_requests service_requests_assignedToUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_requests service_requests_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_requests service_requests_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_requests service_requests_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES public.plans(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: subscriptions subscriptions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "subscriptions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_divisions tenant_divisions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_divisions
    ADD CONSTRAINT "tenant_divisions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_family_statuses tenant_family_statuses_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_family_statuses
    ADD CONSTRAINT "tenant_family_statuses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_feature_overrides tenant_feature_overrides_featureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_feature_overrides
    ADD CONSTRAINT "tenant_feature_overrides_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES public.features(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_feature_overrides tenant_feature_overrides_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_feature_overrides
    ADD CONSTRAINT "tenant_feature_overrides_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_memberships tenant_memberships_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT "tenant_memberships_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tenant_memberships tenant_memberships_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT "tenant_memberships_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_memberships tenant_memberships_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT "tenant_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ULA0Me2e7tdTruribDgU6vgulAJGzf6kj79zDIdeNT9Frb4fN7AtPCMfSMMVXPP

