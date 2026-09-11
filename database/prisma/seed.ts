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
