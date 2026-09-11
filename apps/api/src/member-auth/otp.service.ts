import { randomInt, createHash } from "node:crypto";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import type { Member } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { MembersService } from "../members/members.service";
import { AuditService } from "../audit/audit.service";
import { OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_TTL_SECONDS } from "./member-auth.constants";

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function generateCode(): string {
  return randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, "0");
}

/**
 * Phone + OTP login for Mahalle members. No SMS provider is wired up yet —
 * the code is logged server-side (and never returned to the client) so the
 * full login flow can be exercised in dev. Swapping in a real SMS gateway
 * later only touches the `Logger.log` call below.
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly membersService: MembersService,
    private readonly audit: AuditService
  ) {}

  /**
   * Always succeeds from the caller's point of view, whether or not the
   * phone belongs to a member — the response must not leak which phone
   * numbers are registered.
   */
  async requestOtp(tenantId: string, phone: string, context: { ipAddress?: string; userAgent?: string }): Promise<void> {
    const member = await this.membersService.findByPhone(tenantId, phone);
    if (!member) {
      this.logger.warn(`OTP requested for unknown phone ${phone} in tenant ${tenantId} — not sent.`);
      return;
    }

    const code = generateCode();
    await this.prisma.memberOtp.create({
      data: {
        tenantId,
        memberId: member.id,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + OTP_TTL_SECONDS * 1000)
      }
    });

    // Stand-in for a real SMS gateway (see class docstring).
    this.logger.log(`OTP for ${member.fullName} (${phone}) in tenant ${tenantId}: ${code} — expires in ${OTP_TTL_SECONDS / 60}m`);

    await this.audit.record({
      tenantId,
      action: "member.otp.request",
      targetType: "Member",
      targetId: member.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  /** Verifies the presented code and consumes it — a code can only ever be used once. */
  async verifyOtp(
    tenantId: string,
    phone: string,
    code: string,
    context: { ipAddress?: string; userAgent?: string }
  ): Promise<Member> {
    const member = await this.membersService.findByPhone(tenantId, phone);
    if (!member) {
      throw new UnauthorizedException("Invalid phone number or code");
    }

    const otp = await this.prisma.memberOtp.findFirst({
      where: { memberId: member.id, tenantId, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" }
    });

    if (!otp || otp.attempts >= OTP_MAX_ATTEMPTS) {
      throw new UnauthorizedException("Invalid phone number or code");
    }

    if (otp.codeHash !== hashCode(code)) {
      await this.prisma.memberOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      throw new UnauthorizedException("Invalid phone number or code");
    }

    await this.prisma.memberOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });

    await this.audit.record({
      tenantId,
      action: "member.login",
      targetType: "Member",
      targetId: member.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return member;
  }
}
