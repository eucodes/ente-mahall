import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { RequestContext } from "../platform/platform.service";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";

export interface FeatureSummary {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string | null;
  isEnabledGlobally: boolean;
  createdAt: Date;
  overrideCount: number;
}

export interface TenantFeatureStatus {
  featureId: string;
  key: string;
  name: string;
  category: string | null;
  isEnabledGlobally: boolean;
  /** false only when the Mahalle has an active Plan that doesn't include this feature. */
  planEntitled: boolean;
  /** null = no override for this Mahalle, inheriting the platform default. */
  override: boolean | null;
  /** The actual effective state after applying platform restriction, plan entitlement, then override (Section Q's precedence). */
  effective: boolean;
}

@Injectable()
export class FeaturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async listFeatures(): Promise<FeatureSummary[]> {
    const features = await this.prisma.feature.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
      include: { _count: { select: { overrides: true } } }
    });
    return features.map((f) => ({
      id: f.id,
      key: f.key,
      name: f.name,
      description: f.description,
      category: f.category,
      isEnabledGlobally: f.isEnabledGlobally,
      createdAt: f.createdAt,
      overrideCount: f._count.overrides
    }));
  }

  async createFeature(dto: CreateFeatureDto, actorUserId: string, context: RequestContext): Promise<FeatureSummary> {
    const existing = await this.prisma.feature.findUnique({ where: { key: dto.key } });
    if (existing) {
      throw new ConflictException("A feature with this key already exists");
    }

    const feature = await this.prisma.feature.create({
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        isEnabledGlobally: dto.isEnabledGlobally ?? true
      }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.feature.create",
      targetType: "Feature",
      targetId: feature.id,
      metadata: { key: feature.key, name: feature.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { ...feature, overrideCount: 0 };
  }

  private async findFeatureOrThrow(featureId: string) {
    const feature = await this.prisma.feature.findUnique({ where: { id: featureId } });
    if (!feature) {
      throw new NotFoundException("Feature not found");
    }
    return feature;
  }

  async updateFeature(
    featureId: string,
    dto: UpdateFeatureDto,
    actorUserId: string,
    context: RequestContext
  ): Promise<FeatureSummary> {
    const existing = await this.findFeatureOrThrow(featureId);
    const feature = await this.prisma.feature.update({
      where: { id: featureId },
      data: dto,
      include: { _count: { select: { overrides: true } } }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action:
        typeof dto.isEnabledGlobally === "boolean" && dto.isEnabledGlobally !== existing.isEnabledGlobally
          ? dto.isEnabledGlobally
            ? "platform.feature.enable"
            : "platform.feature.disable"
          : "platform.feature.update",
      targetType: "Feature",
      targetId: featureId,
      metadata: { key: existing.key, changes: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      id: feature.id,
      key: feature.key,
      name: feature.name,
      description: feature.description,
      category: feature.category,
      isEnabledGlobally: feature.isEnabledGlobally,
      createdAt: feature.createdAt,
      overrideCount: feature._count.overrides
    };
  }

  async deleteFeature(featureId: string, actorUserId: string, context: RequestContext): Promise<void> {
    const feature = await this.findFeatureOrThrow(featureId);
    await this.prisma.feature.delete({ where: { id: featureId } });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.feature.delete",
      targetType: "Feature",
      targetId: featureId,
      metadata: { key: feature.key, name: feature.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  /**
   * The Mahalle's plan-entitled feature ids, or null if it has no active
   * subscription — meaning nothing is restricted at the plan layer (a
   * Mahalle without a Plan on record is unrestricted here, not entitled to
   * nothing, so existing tenants aren't retroactively broken by Phase 7
   * introducing Plans).
   */
  private async getPlanEntitledFeatureIds(tenantId: string): Promise<Set<string> | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: { include: { features: true } } }
    });
    if (!subscription) return null;
    return new Set(subscription.plan.features.map((pf) => pf.featureId));
  }

  /** Every feature's effective state for one Mahalle — Section J's "Feature configuration". */
  async getTenantFeatures(tenantId: string): Promise<TenantFeatureStatus[]> {
    const [features, overrides, planEntitledIds] = await Promise.all([
      this.prisma.feature.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
      this.prisma.tenantFeatureOverride.findMany({ where: { tenantId } }),
      this.getPlanEntitledFeatureIds(tenantId)
    ]);
    const overrideByFeature = new Map(overrides.map((o) => [o.featureId, o.isEnabled]));

    return features.map((f) => {
      const override = overrideByFeature.get(f.id) ?? null;
      const planEntitled = planEntitledIds === null || planEntitledIds.has(f.id);
      return {
        featureId: f.id,
        key: f.key,
        name: f.name,
        category: f.category,
        isEnabledGlobally: f.isEnabledGlobally,
        planEntitled,
        override,
        effective: f.isEnabledGlobally && planEntitled && (override ?? true)
      };
    });
  }

  /**
   * Sets or clears one Mahalle's exception to a feature's platform default.
   * Refuses to turn a feature ON for a Mahalle when the platform has
   * disabled it globally — Section Q's core rule, enforced here rather than
   * only in the UI.
   */
  async setTenantOverride(
    tenantId: string,
    featureId: string,
    isEnabled: boolean | null | undefined,
    actorUserId: string,
    context: RequestContext
  ): Promise<TenantFeatureStatus> {
    const [tenant, feature] = await Promise.all([
      this.prisma.tenant.findUnique({ where: { id: tenantId } }),
      this.findFeatureOrThrow(featureId)
    ]);
    if (!tenant) {
      throw new NotFoundException("Mahalle not found");
    }

    const planEntitledIds = await this.getPlanEntitledFeatureIds(tenantId);
    const planEntitled = planEntitledIds === null || planEntitledIds.has(featureId);

    if (isEnabled === true && !feature.isEnabledGlobally) {
      throw new BadRequestException("The platform has disabled this feature globally — it can't be enabled for one Mahalle");
    }
    if (isEnabled === true && !planEntitled) {
      throw new BadRequestException("This Mahalle's plan doesn't include this feature — it can't be forced on");
    }

    if (isEnabled === null || isEnabled === undefined) {
      await this.prisma.tenantFeatureOverride.deleteMany({ where: { tenantId, featureId } });
    } else {
      await this.prisma.tenantFeatureOverride.upsert({
        where: { tenantId_featureId: { tenantId, featureId } },
        create: { tenantId, featureId, isEnabled },
        update: { isEnabled }
      });
    }

    await this.audit.record({
      actorUserId,
      tenantId,
      action: "platform.feature.override",
      targetType: "Feature",
      targetId: featureId,
      metadata: { key: feature.key, isEnabled: isEnabled ?? null },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      featureId: feature.id,
      key: feature.key,
      name: feature.name,
      category: feature.category,
      isEnabledGlobally: feature.isEnabledGlobally,
      planEntitled,
      override: isEnabled ?? null,
      effective: feature.isEnabledGlobally && planEntitled && (isEnabled ?? true)
    };
  }
}
