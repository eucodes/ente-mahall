import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { PermissionsService } from "../permissions/permissions.service";

const LIMIT = 5;

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: PermissionsService
  ) {}

  /**
   * Gated per result type by the same permissions the underlying pages
   * require (members.view, families.view, ...) — a search box is not a way
   * around the permission checks those pages already enforce.
   */
  async search(tenantId: string, roleId: string, q: string) {
    const [canMembers, canFamilies, canHouses, canEvents] = await Promise.all([
      this.permissions.roleHasPermission(roleId, "members.view"),
      this.permissions.roleHasPermission(roleId, "families.view"),
      this.permissions.roleHasPermission(roleId, "houses.view"),
      this.permissions.roleHasPermission(roleId, "events.view")
    ]);

    const [members, families, houses, events] = await Promise.all([
      canMembers
        ? this.prisma.member.findMany({
            where: { tenantId, isActive: true, OR: [{ fullName: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] },
            take: LIMIT,
            select: { id: true, fullName: true, phone: true }
          })
        : [],
      canFamilies
        ? this.prisma.family.findMany({
            where: { tenantId, isActive: true, name: { contains: q, mode: "insensitive" } },
            take: LIMIT,
            select: { id: true, name: true }
          })
        : [],
      canHouses
        ? this.prisma.house.findMany({
            where: { tenantId, isActive: true, displayNumber: { contains: q, mode: "insensitive" } },
            take: LIMIT,
            select: { id: true, displayNumber: true }
          })
        : [],
      canEvents
        ? this.prisma.event.findMany({
            where: { tenantId, isActive: true, title: { contains: q, mode: "insensitive" } },
            take: LIMIT,
            select: { id: true, title: true, startsAt: true }
          })
        : []
    ]);
    return { members, families, houses, events };
  }
}
