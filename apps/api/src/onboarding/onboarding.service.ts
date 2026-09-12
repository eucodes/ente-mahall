import { Injectable } from "@nestjs/common";
import type { OnboardingDraft } from "@mahalle/database";
import { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import type { UpdateOnboardingDraftDto } from "./dto/update-onboarding-draft.dto";

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  /** Creates an empty draft on first visit so /onboarding always has real server state to resume from. */
  async getOrCreate(userId: string): Promise<OnboardingDraft> {
    const existing = await this.prisma.onboardingDraft.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.onboardingDraft.create({ data: { userId } });
  }

  async update(userId: string, dto: UpdateOnboardingDraftDto): Promise<OnboardingDraft> {
    const existing = await this.getOrCreate(userId);
    const mergedData: Prisma.InputJsonValue | undefined = dto.data
      ? ({ ...(existing.data as Record<string, unknown>), ...dto.data } as Prisma.InputJsonValue)
      : undefined;

    return this.prisma.onboardingDraft.update({
      where: { userId },
      data: {
        currentStep: dto.currentStep ?? existing.currentStep,
        status: "IN_PROGRESS",
        ...(mergedData ? { data: mergedData } : {})
      }
    });
  }

  /** Called once a Tenant has actually been created — nothing is left to resume. */
  async clear(userId: string): Promise<void> {
    await this.prisma.onboardingDraft.deleteMany({ where: { userId } });
  }
}
