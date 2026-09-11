import { Injectable } from "@nestjs/common";
import type { Role, Tenant, TenantMembership } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";

export type MembershipWithRole = TenantMembership & { role: Role };
export type MembershipWithTenantAndRole = TenantMembership & { tenant: Tenant; role: Role };

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The core tenant-isolation lookup: is there an ACTIVE membership linking
   * this user to this tenant? Every tenant-scoped request resolves through
   * this — never through a tenant id supplied by the client alone.
   */
  findActiveMembership(tenantId: string, userId: string): Promise<MembershipWithRole | null> {
    return this.prisma.tenantMembership.findFirst({
      where: { tenantId, userId, isActive: true },
      include: { role: true }
    });
  }

  listActiveForUser(userId: string): Promise<MembershipWithTenantAndRole[]> {
    return this.prisma.tenantMembership.findMany({
      where: { userId, isActive: true, tenant: { isActive: true } },
      include: { tenant: true, role: true },
      orderBy: { createdAt: "asc" }
    });
  }

  listForTenant(tenantId: string) {
    return this.prisma.tenantMembership.findMany({
      where: { tenantId, isActive: true },
      include: { user: true, role: true },
      orderBy: { createdAt: "asc" }
    });
  }

  findByIdForTenant(tenantId: string, membershipId: string): Promise<MembershipWithRole | null> {
    return this.prisma.tenantMembership.findFirst({
      where: { id: membershipId, tenantId, isActive: true },
      include: { role: true }
    });
  }

  /** How many active OWNER memberships this tenant has — used to stop the last owner being demoted/removed. */
  async countActiveOwners(tenantId: string): Promise<number> {
    return this.prisma.tenantMembership.count({
      where: { tenantId, isActive: true, role: { key: "OWNER" } }
    });
  }
}
