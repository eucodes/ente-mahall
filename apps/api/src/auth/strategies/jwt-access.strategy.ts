import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";
import { appScopeFromRequest, scopedCookieName } from "../app-scope";
import { ACCESS_TOKEN_COOKIE } from "../auth.constants";
import type { AccessTokenPayload } from "../token.service";

/** Reads the access token from the app-scoped HttpOnly cookie (web) or an Authorization: Bearer header (future Flutter apps). */
function extractFromCookieOrHeader(req: Request): string | null {
  const app = appScopeFromRequest(req);
  const fromCookie = app
    ? (req.cookies as Record<string, string> | undefined)?.[scopedCookieName(ACCESS_TOKEN_COOKIE, app)]
    : undefined;
  if (fromCookie) return fromCookie;
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: extractFromCookieOrHeader,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("jwt.accessSecret")
    });
  }

  async validate(payload: AccessTokenPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    return this.usersService.toSafeUser(user);
  }
}
