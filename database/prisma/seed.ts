import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { PERMISSIONS } from "@mahalle/types";

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

  console.log("Seed complete.");
  console.log(`  Control Admin: ${platformAdminEmail} / ChangeMe123!`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
