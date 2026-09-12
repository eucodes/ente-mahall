import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * Issues sequential certificate numbers, shared by every register that
 * prints an official certificate (Death, Marriage, Divorce, Mahallu
 * Release). Backed by a per-tenant, per-register counter row updated inside
 * a transaction — never `count() + 1`, which races under concurrent
 * issuance and could hand out the same certificate number twice.
 */
@Injectable()
export class CertificateService {
  constructor(private readonly prisma: PrismaService) {}

  async nextNumber(tenantId: string, registerType: string, prefix: string): Promise<string> {
    const counter = await this.prisma.$transaction(async (tx) => {
      return tx.certificateCounter.upsert({
        where: { tenantId_registerType: { tenantId, registerType } },
        create: { tenantId, registerType, lastNumber: 1 },
        update: { lastNumber: { increment: 1 } }
      });
    });
    return `${prefix}-${String(counter.lastNumber).padStart(5, "0")}`;
  }
}
