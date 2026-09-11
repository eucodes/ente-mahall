import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";

export interface MemberAccessTokenPayload {
  sub: string; // Member id
  tenantId: string;
  type: "member";
}

/**
 * Members authenticate with phone + OTP, not email/password, so they're a
 * separate identity space from User — this issues their own access tokens
 * rather than reusing TokenService/AccessTokenPayload. There's no refresh
 * token: without a real SMS provider wired up yet, re-authenticating is
 * cheap (just request a fresh OTP), so the access token's own TTL is the
 * whole session lifetime for now.
 */
@Injectable()
export class MemberTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  private get accessTtl(): string {
    return process.env.MEMBER_ACCESS_TTL ?? "7d";
  }

  get accessTtlMs(): number {
    return ms(this.accessTtl as ms.StringValue);
  }

  signAccessToken(memberId: string, tenantId: string): string {
    const payload: MemberAccessTokenPayload = { sub: memberId, tenantId, type: "member" };
    return this.jwt.sign(payload, {
      secret: this.config.getOrThrow<string>("jwt.accessSecret"),
      expiresIn: this.accessTtl
    });
  }

  verifyAccessToken(token: string): MemberAccessTokenPayload {
    const payload = this.jwt.verify<MemberAccessTokenPayload>(token, {
      secret: this.config.getOrThrow<string>("jwt.accessSecret")
    });
    if (payload.type !== "member") {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
