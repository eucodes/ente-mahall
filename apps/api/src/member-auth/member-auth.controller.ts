import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import type { Member } from "@mahalle/database";
import { SkipCsrf } from "../common/decorators/skip-csrf.decorator";
import { requireAppScope } from "../auth/app-scope";
import { TenantsService } from "../tenants/tenants.service";
import { OtpService } from "./otp.service";
import { MemberTokenService } from "./member-token.service";
import { RequestOtpDto } from "./dto/request-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { setMemberAuthCookie, clearMemberAuthCookie } from "./member-cookies";
import { MemberAuthGuard } from "./guards/member-auth.guard";
import { CurrentMember } from "./decorators/current-member.decorator";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

function publicMember(member: Member) {
  return { id: member.id, fullName: member.fullName, phone: member.phone, email: member.email };
}

/** Phone + OTP login for a Mahalle's own members — a separate identity space from admin/platform Users (see MemberTokenService). */
@Controller("tenants/:slug/member-auth")
export class MemberAuthController {
  constructor(
    private readonly otpService: OtpService,
    private readonly tenantsService: TenantsService,
    private readonly memberTokenService: MemberTokenService,
    private readonly config: ConfigService
  ) {}

  @Post("otp/request")
  @SkipCsrf()
  @Throttle({ default: { limit: 3, ttl: 5 * 60_000 } })
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Param("slug") slug: string, @Body() dto: RequestOtpDto, @Req() req: Request) {
    const tenant = await this.tenantsService.findActiveBySlugOrThrow(slug);
    await this.otpService.requestOtp(tenant.id, dto.phone, requestContext(req));
    // Always the same response, whether or not the phone belongs to a member.
    return { success: true };
  }

  @Post("otp/verify")
  @SkipCsrf()
  @Throttle({ default: { limit: 10, ttl: 5 * 60_000 } })
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Param("slug") slug: string,
    @Body() dto: VerifyOtpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const tenant = await this.tenantsService.findActiveBySlugOrThrow(slug);
    const member = await this.otpService.verifyOtp(tenant.id, dto.phone, dto.code, requestContext(req));
    const accessToken = this.memberTokenService.signAccessToken(member.id, tenant.id);
    setMemberAuthCookie(res, this.config, accessToken, requireAppScope(req), this.memberTokenService.accessTtlMs);
    return { member: publicMember(member) };
  }

  @Get("me")
  @UseGuards(MemberAuthGuard)
  me(@CurrentMember() member: Member) {
    return { member: publicMember(member) };
  }

  @Post("logout")
  @SkipCsrf()
  @UseGuards(MemberAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    clearMemberAuthCookie(res, this.config, requireAppScope(req));
    return { success: true };
  }
}
