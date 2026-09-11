import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import { SkipCsrf } from "../common/decorators/skip-csrf.decorator";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { clearAuthCookies, setAuthCookies } from "./cookies";
import { REFRESH_TOKEN_COOKIE } from "./auth.constants";
import { requireAppScope, scopedCookieName } from "./app-scope";
import type { SafeUser } from "../users/users.service";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

  @Post("register")
  @SkipCsrf()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.authService.register(dto, requestContext(req));
    setAuthCookies(res, this.config, tokens, requireAppScope(req));
    return { user };
  }

  @Post("login")
  @SkipCsrf()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.authService.login(dto, requestContext(req));
    setAuthCookies(res, this.config, tokens, requireAppScope(req));
    return { user };
  }

  @Post("refresh")
  @SkipCsrf()
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const app = requireAppScope(req);
    const presented = (req.cookies as Record<string, string> | undefined)?.[
      scopedCookieName(REFRESH_TOKEN_COOKIE, app)
    ];
    if (!presented) {
      throw new UnauthorizedException("No refresh token presented");
    }
    const tokens = await this.authService.refresh(presented, requestContext(req));
    setAuthCookies(res, this.config, tokens, app);
    return { success: true };
  }

  @Post("logout")
  @SkipCsrf()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: SafeUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const app = requireAppScope(req);
    const presented = (req.cookies as Record<string, string> | undefined)?.[
      scopedCookieName(REFRESH_TOKEN_COOKIE, app)
    ];
    await this.authService.logout(presented, user.id, requestContext(req));
    clearAuthCookies(res, this.config, app);
    return { success: true };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: SafeUser) {
    return { user };
  }
}
