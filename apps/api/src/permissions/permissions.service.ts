import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PERMISSIONS, type Permission } from "@mahalle/types";
import { PrismaService } from "../database/prisma.service";

/**
 * Owns the platform-wide Permission catalogue. The catalogue is
 * infrastructure, not tenant data — it must exist before any tenant can be
 * created, so it's bootstrapped idempotently on every API startup rather
 * than depending on someone remembering to run the fixture seed script.
 */
@Injectable()
export class PermissionsService implements OnModuleInit {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.ensureCatalogueSeeded();
  }

  async ensureCatalogueSeeded(): Promise<void> {
    for (const key of PERMISSIONS) {
      await this.prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key, category: key.split(".")[0] ?? "general" }
      });
    }
    this.logger.log(`Permission catalogue ensured (${PERMISSIONS.length} permissions).`);
  }

  findAll() {
    return this.prisma.permission.findMany();
  }

  /** The real permission check: does this specific role carry this specific permission, right now? */
  async roleHasPermission(roleId: string, permission: Permission): Promise<boolean> {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) return false;
    const key = role.key?.toUpperCase();
    if (key === "OWNER" || key === "ADMIN") return true;

    const grant = await this.prisma.rolePermission.findFirst({
      where: { roleId, permission: { key: permission } }
    });
    return grant !== null;
  }
}
