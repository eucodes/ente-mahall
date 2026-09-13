import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { Tenant } from "@mahalle/database";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { SafeUser } from "../users/users.service";
import { TenantsService } from "./tenants.service";
import { MembershipsService, type MembershipWithRole } from "../memberships/memberships.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { TenantContextGuard } from "./guards/tenant-context.guard";
import { CurrentTenant } from "./decorators/current-tenant.decorator";
import { CurrentMembership } from "./decorators/current-membership.decorator";

import { FeaturesService } from "../features/features.service";

function publicTenant(tenant: Tenant) {
  return {
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    description: tenant.description,
    isActive: tenant.isActive,
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
    country: tenant.country,
    logoUrl: tenant.logoUrl,
    masjidName: tenant.masjidName,
    hasDivisions: tenant.hasDivisions
  };
}

function membershipRole(membership: MembershipWithRole) {
  return { key: membership.role.key, name: membership.role.name };
}

@Controller("tenants")
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly membershipsService: MembershipsService,
    private readonly featuresService: FeaturesService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateTenantDto, @CurrentUser() user: SafeUser, @Req() req: Request) {
    const { tenant, membership } = await this.tenantsService.createTenant(user.id, dto, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    return { tenant: publicTenant(tenant), role: membershipRole(membership) };
  }

  /** Every Mahalle the current user is an active member of. */
  @Get("mine")
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: SafeUser) {
    const memberships = await this.membershipsService.listActiveForUser(user.id);
    return {
      memberships: memberships.map((m) => ({
        tenant: publicTenant(m.tenant),
        role: { key: m.role.key, name: m.role.name }
      }))
    };
  }

  /** Public tenant lookup for the tenant's own site — no auth, minimal fields only. */
  @Get(":slug")
  async findBySlug(@Param("slug") slug: string) {
    const tenant = await this.tenantsService.findActiveBySlugOrThrow(slug);
    return { tenant: publicTenant(tenant) };
  }

  /** The current user's membership in this specific tenant — the real isolation check. */
  @Get(":slug/me")
  @UseGuards(JwtAuthGuard, TenantContextGuard)
  @HttpCode(HttpStatus.OK)
  me(@CurrentTenant() tenant: Tenant, @CurrentMembership() membership: MembershipWithRole) {
    return { tenant: publicTenant(tenant), role: membershipRole(membership) };
  }

  /** The effective feature flags for this Mahalle. */
  @Get(":slug/features")
  @UseGuards(JwtAuthGuard, TenantContextGuard)
  async features(@CurrentTenant() tenant: Tenant) {
    const features = await this.featuresService.getTenantFeatures(tenant.id);
    return { features };
  }
}
