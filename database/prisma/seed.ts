import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_ROLE_PERMISSIONS, PERMISSIONS, TenantRole } from "@mahalle/types";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding permission catalogue...");
  for (const key of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, category: key.split(".")[0] ?? "general" }
    });
  }
  const allPermissions = await prisma.permission.findMany();

  console.log("Seeding platform super admin...");
  const platformAdminEmail = "platform-admin@mahalle.local";
  const platformAdmin = await prisma.user.upsert({
    where: { email: platformAdminEmail },
    update: {},
    create: {
      email: platformAdminEmail,
      fullName: "Platform Super Admin",
      passwordHash: await bcrypt.hash("ChangeMe123!", 12)
    }
  });
  await prisma.platformMembership.upsert({
    where: { userId: platformAdmin.id },
    update: {},
    create: { userId: platformAdmin.id, role: "SUPER_ADMIN" }
  });

  console.log("Seeding feature catalogue...");
  const featureCatalogue: { key: string; name: string; category: string; isEnabledGlobally?: boolean }[] = [
    { key: "family-management", name: "Family Management", category: "Core" },
    { key: "finance", name: "Finance", category: "Core" },
    { key: "committee", name: "Committee", category: "Core" },
    { key: "events", name: "Events", category: "Core" },
    { key: "announcements", name: "Announcements", category: "Communication" },
    { key: "programs", name: "Programs", category: "Core" },
    { key: "services", name: "Services & Aid", category: "Core" },
    { key: "forms", name: "Forms", category: "Core" },
    { key: "marriage-register", name: "Marriage Register", category: "Registers" },
    { key: "death-register", name: "Death Register", category: "Registers" },
    { key: "divorce-register", name: "Divorce Register", category: "Registers" },
    { key: "grave-register", name: "Grave Register", category: "Registers" },
    { key: "property-register", name: "Property Register", category: "Registers" },
    { key: "release-register", name: "Mahallu Release Register", category: "Registers" },
    { key: "madrassa", name: "Madrassa", category: "Registers", isEnabledGlobally: false },
    { key: "sms", name: "SMS Notifications", category: "Communication", isEnabledGlobally: false }
  ];
  for (const f of featureCatalogue) {
    await prisma.feature.upsert({
      where: { key: f.key },
      update: {},
      create: { key: f.key, name: f.name, category: f.category, isEnabledGlobally: f.isEnabledGlobally ?? true }
    });
  }

  console.log("Seeding plans...");
  const coreFeatureKeys = ["family-management", "finance", "committee", "events", "announcements", "programs", "services", "forms"];
  const registerFeatureKeys = [
    "marriage-register",
    "death-register",
    "divorce-register",
    "grave-register",
    "property-register",
    "release-register"
  ];
  const planCatalogue = [
    {
      key: "starter",
      name: "Starter",
      priceMinor: 0,
      billingPeriod: "MONTHLY" as const,
      userLimit: 3,
      memberLimit: 200,
      supportLevel: "Community",
      featureKeys: coreFeatureKeys
    },
    {
      key: "growth",
      name: "Growth",
      priceMinor: 99900,
      billingPeriod: "MONTHLY" as const,
      userLimit: 10,
      memberLimit: 2000,
      supportLevel: "Priority",
      featureKeys: [...coreFeatureKeys, ...registerFeatureKeys]
    },
    {
      key: "enterprise",
      name: "Enterprise",
      priceMinor: null,
      billingPeriod: "YEARLY" as const,
      userLimit: null,
      memberLimit: null,
      supportLevel: "Dedicated",
      featureKeys: [...coreFeatureKeys, ...registerFeatureKeys, "madrassa", "sms"]
    }
  ];
  for (const p of planCatalogue) {
    const plan = await prisma.plan.upsert({
      where: { key: p.key },
      update: {},
      create: {
        key: p.key,
        name: p.name,
        priceMinor: p.priceMinor,
        billingPeriod: p.billingPeriod,
        userLimit: p.userLimit,
        memberLimit: p.memberLimit,
        supportLevel: p.supportLevel
      }
    });
    const features = await prisma.feature.findMany({ where: { key: { in: p.featureKeys } } });
    for (const feature of features) {
      await prisma.planFeature.upsert({
        where: { planId_featureId: { planId: plan.id, featureId: feature.id } },
        update: {},
        create: { planId: plan.id, featureId: feature.id }
      });
    }
  }

  console.log("Seeding demo tenant...");
  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: {},
    create: { slug: "demo", name: "Demo Mahalle" }
  });

  for (const [key, permissionKeys] of Object.entries(DEFAULT_ROLE_PERMISSIONS) as [TenantRole, readonly string[] | "*"][]) {
    const role = await prisma.role.upsert({
      where: { tenantId_key: { tenantId: tenant.id, key } },
      update: {},
      create: { tenantId: tenant.id, key, name: key.charAt(0) + key.slice(1).toLowerCase() }
    });

    const grantedKeys = permissionKeys === "*" ? allPermissions.map((p) => p.key) : permissionKeys;
    const grantedPermissions = allPermissions.filter((p) => grantedKeys.includes(p.key));

    for (const permission of grantedPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id }
      });
    }
  }

  console.log("Seeding demo tenant owner...");
  const ownerEmail = "owner@demo.mahalle.local";
  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      fullName: "Demo Owner",
      passwordHash: await bcrypt.hash("ChangeMe123!", 12)
    }
  });
  const ownerRole = await prisma.role.findUniqueOrThrow({
    where: { tenantId_key: { tenantId: tenant.id, key: TenantRole.OWNER } }
  });
  await prisma.tenantMembership.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: owner.id } },
    update: {},
    create: { tenantId: tenant.id, userId: owner.id, roleId: ownerRole.id }
  });

  console.log("Seeding demo tenant finance setup...");
  const fy = await prisma.financialYear.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: "FY 2026-27" } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "FY 2026-27",
      startDate: new Date("2026-04-01T00:00:00Z"),
      endDate: new Date("2027-03-31T23:59:59Z"),
      status: "OPEN",
      isCurrent: true
    }
  });

  const paymentMethods = [
    { code: "CASH", name: "Cash", type: "CASH", displayOrder: 1 },
    { code: "UPI", name: "UPI / QR Code", type: "UPI", requiresReference: true, displayOrder: 2 },
    { code: "BANK_TRANSFER", name: "Bank Transfer (NEFT/RTGS/IMPS)", type: "BANK_TRANSFER", requiresReference: true, requiresBankDetails: true, displayOrder: 3 },
    { code: "CHEQUE", name: "Cheque", type: "CHEQUE", requiresReference: true, requiresChequeNumber: true, displayOrder: 4 },
    { code: "OTHER", name: "Other", type: "OTHER", displayOrder: 5 }
  ];
  for (const pm of paymentMethods) {
    await prisma.financePaymentMethod.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code: pm.code } },
      update: {},
      create: { ...pm, tenantId: tenant.id }
    });
  }

  // Root Chart of Accounts
  const rootAccounts = [
    { code: "1000", name: "Assets", type: "ASSET" as const, isSystem: true },
    { code: "2000", name: "Liabilities", type: "LIABILITY" as const, isSystem: true },
    { code: "3000", name: "Equity & Funds", type: "EQUITY" as const, isSystem: true },
    { code: "4000", name: "Income", type: "INCOME" as const, isSystem: true },
    { code: "5000", name: "Expenses", type: "EXPENSE" as const, isSystem: true }
  ];
  const accountMap: Record<string, string> = {};
  for (const ra of rootAccounts) {
    const acc = await prisma.account.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: ra.name } },
      update: { code: ra.code, type: ra.type },
      create: { tenantId: tenant.id, code: ra.code, name: ra.name, type: ra.type, isSystem: ra.isSystem }
    });
    accountMap[ra.code] = acc.id;
  }

  // Sub-accounts
  const subAccounts = [
    { code: "1100", name: "Cash on Hand", type: "ASSET" as const, parentCode: "1000" },
    { code: "1200", name: "Federal Bank Main Account", type: "ASSET" as const, parentCode: "1000" },
    { code: "2100", name: "Accounts Payable", type: "LIABILITY" as const, parentCode: "2000" },
    { code: "3100", name: "Mahallu General Fund", type: "EQUITY" as const, parentCode: "3000" },
    { code: "4100", name: "Monthly Mahallu Collections", type: "INCOME" as const, parentCode: "4000" },
    { code: "4200", name: "Friday / Juma Collections", type: "INCOME" as const, parentCode: "4000" },
    { code: "4300", name: "General Donations & Offerings", type: "INCOME" as const, parentCode: "4000" },
    { code: "4400", name: "Zakat & Fitra Funds", type: "INCOME" as const, parentCode: "4000" },
    { code: "5100", name: "Staff Salary & Wages", type: "EXPENSE" as const, parentCode: "5000" },
    { code: "5200", name: "Electricity & Utility Bills", type: "EXPENSE" as const, parentCode: "5000" },
    { code: "5300", name: "Masjid & Building Maintenance", type: "EXPENSE" as const, parentCode: "5000" },
    { code: "5400", name: "Programs & Religious Events", type: "EXPENSE" as const, parentCode: "5000" },
    { code: "5500", name: "Office & Administrative Expenses", type: "EXPENSE" as const, parentCode: "5000" }
  ];
  for (const sa of subAccounts) {
    const acc = await prisma.account.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: sa.name } },
      update: { code: sa.code, type: sa.type, parentAccountId: accountMap[sa.parentCode] },
      create: {
        tenantId: tenant.id,
        code: sa.code,
        name: sa.name,
        type: sa.type,
        parentAccountId: accountMap[sa.parentCode]
      }
    });
    accountMap[sa.code] = acc.id;
  }

  // Bank Account
  const bankAcc = await prisma.financeBankAccount.create({
    data: {
      tenantId: tenant.id,
      accountName: "Main Operating Account",
      bankName: "Federal Bank",
      branch: "Wayanad Main Branch",
      accountNumber: "102938475612",
      ifsc: "FDRL0001234",
      accountType: "SAVINGS",
      openingBalance: 50000,
      currentBalance: 50000,
      chartAccountId: accountMap["1200"]
    }
  }).catch(() => null);

  // Collection Categories
  const collectionCats = [
    { name: "Monthly Mahallu Collection", code: "MONTHLY", incomeCode: "4100", order: 1 },
    { name: "Friday / Juma Collection", code: "FRIDAY", incomeCode: "4200", order: 2 },
    { name: "General Donation", code: "DONATION", incomeCode: "4300", order: 3 },
    { name: "Zakat", code: "ZAKAT", incomeCode: "4400", order: 4 },
    { name: "Fitra", code: "FITRA", incomeCode: "4400", order: 5 },
    { name: "Nercha & Offerings", code: "NERCHA", incomeCode: "4300", order: 6 },
    { name: "Program Collection", code: "PROGRAM", incomeCode: "4300", order: 7 },
    { name: "Other Inflow", code: "OTHER", incomeCode: "4300", order: 8 }
  ];
  for (const cc of collectionCats) {
    await prisma.collectionCategory.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: cc.name } },
      update: { code: cc.code, incomeAccountId: accountMap[cc.incomeCode], displayOrder: cc.order },
      create: {
        tenantId: tenant.id,
        name: cc.name,
        code: cc.code,
        incomeAccountId: accountMap[cc.incomeCode],
        displayOrder: cc.order
      }
    });
  }

  // Expense Categories
  const expenseCats = [
    { name: "Staff Salaries", code: "SALARY", expenseCode: "5100", order: 1 },
    { name: "Electricity Bills", code: "ELECTRICITY", expenseCode: "5200", order: 2 },
    { name: "Water & Utilities", code: "WATER", expenseCode: "5200", order: 3 },
    { name: "Masjid Maintenance", code: "MAINTENANCE", expenseCode: "5300", order: 4 },
    { name: "Program & Events", code: "PROGRAM", expenseCode: "5400", order: 5 },
    { name: "Office Stationery & Supplies", code: "OFFICE", expenseCode: "5500", order: 6 }
  ];
  for (const ec of expenseCats) {
    await prisma.expenseCategory.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: ec.name } },
      update: { code: ec.code, expenseAccountId: accountMap[ec.expenseCode], displayOrder: ec.order },
      create: {
        tenantId: tenant.id,
        name: ec.name,
        code: ec.code,
        expenseAccountId: accountMap[ec.expenseCode],
        displayOrder: ec.order
      }
    });
  }

  // Finance Settings
  await prisma.financeSettings.upsert({
    where: { tenantId: tenant.id },
    update: {
      defaultCashAccountId: accountMap["1100"],
      defaultBankAccountId: accountMap["1200"],
      defaultSalaryExpenseAccountId: accountMap["5100"],
      defaultCollectionIncomeAccountId: accountMap["4100"],
      defaultDonationIncomeAccountId: accountMap["4300"],
      defaultGeneralExpenseAccountId: accountMap["5500"]
    },
    create: {
      tenantId: tenant.id,
      currency: "INR",
      financialYearStartMonth: 4,
      financialYearStartDay: 1,
      defaultCashAccountId: accountMap["1100"],
      defaultBankAccountId: accountMap["1200"],
      defaultSalaryExpenseAccountId: accountMap["5100"],
      defaultCollectionIncomeAccountId: accountMap["4100"],
      defaultDonationIncomeAccountId: accountMap["4300"],
      defaultGeneralExpenseAccountId: accountMap["5500"]
    }
  });

  console.log("Seed complete.");
  console.log(`  Platform admin: ${platformAdminEmail} / ChangeMe123!`);
  console.log(`  Demo tenant owner: ${ownerEmail} / ChangeMe123! (tenant slug: demo)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
