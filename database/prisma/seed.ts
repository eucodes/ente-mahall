import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, TenantRole } from "@mahalle/types";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding permission catalogue...");
  const allPermissions = [];
  for (const key of PERMISSIONS) {
    const p = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, category: key.split(".")[0] ?? "general" }
    });
    allPermissions.push(p);
  }

  console.log("Seeding platform super admin (Control Admin)...");
  const platformAdminEmail = "platform-admin@mahalle.local";
  const hashFn = (bcrypt as any).hash ?? (bcrypt as any).default?.hash ?? bcrypt;
  const platformAdmin = await prisma.user.upsert({
    where: { email: platformAdminEmail },
    update: {},
    create: {
      email: platformAdminEmail,
      fullName: "Platform Super Admin",
      passwordHash: await hashFn("ChangeMe123!", 12)
    }
  });
  await prisma.platformMembership.upsert({
    where: { userId: platformAdmin.id },
    update: {},
    create: { userId: platformAdmin.id, role: "SUPER_ADMIN" }
  });

  console.log("Seeding demo tenant (demo.mahalle.test)...");
  let demoTenant = await prisma.tenant.findUnique({ where: { slug: "demo" } });
  if (!demoTenant) {
    demoTenant = await prisma.tenant.create({
      data: {
        name: "Demo Mahallu",
        slug: "demo",
        description: "Standard demonstration Mahallu with default accounts and records",
        contactEmail: "owner@demo.mahalle.local",
        contactPhone: "+91 9876543210",
        state: "Kerala",
        district: "Wayanad",
        place: "Kalpetta",
        masjidName: "Masjid Al-Noor",
        isActive: true
      }
    });
  }

  // Ensure roles exist for demo tenant
  const roleByKey = new Map<string, string>();
  for (const [key, permissionKeys] of Object.entries(DEFAULT_ROLE_PERMISSIONS) as [
    TenantRole,
    readonly string[] | "*"
  ][]) {
    let role = await prisma.role.findFirst({
      where: { tenantId: demoTenant.id, key }
    });
    if (!role) {
      role = await prisma.role.create({
        data: {
          tenantId: demoTenant.id,
          key,
          name: key.charAt(0) + key.slice(1).toLowerCase(),
          isSystem: true
        }
      });

      const grantedKeys = permissionKeys === "*" ? allPermissions.map((p) => p.key) : permissionKeys;
      const grantedPermissions = allPermissions.filter((p) => grantedKeys.includes(p.key));
      if (grantedPermissions.length > 0) {
        await prisma.rolePermission.createMany({
          data: grantedPermissions.map((p) => ({ roleId: role.id, permissionId: p.id }))
        });
      }
    }
    roleByKey.set(key, role.id);
  }

  console.log("Seeding demo tenant owner (owner@demo.mahalle.local)...");
  const demoOwnerEmail = "owner@demo.mahalle.local";
  const demoOwner = await prisma.user.upsert({
    where: { email: demoOwnerEmail },
    update: {},
    create: {
      email: demoOwnerEmail,
      fullName: "Demo Mahall Owner",
      phone: "+91 9876543210",
      passwordHash: await hashFn("ChangeMe123!", 12),
      isActive: true
    }
  });

  const ownerRoleId = roleByKey.get(TenantRole.OWNER);
  if (ownerRoleId) {
    await prisma.tenantMembership.upsert({
      where: {
        tenantId_userId: {
          tenantId: demoTenant.id,
          userId: demoOwner.id
        }
      },
      update: { roleId: ownerRoleId, isActive: true },
      create: {
        tenantId: demoTenant.id,
        userId: demoOwner.id,
        roleId: ownerRoleId,
        isActive: true
      }
    });
  }

  console.log("Seed complete.");
  console.log(`  Control Admin: ${platformAdminEmail} / ChangeMe123!`);
  console.log(`  Demo Mahall Owner: ${demoOwnerEmail} / ChangeMe123!`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
