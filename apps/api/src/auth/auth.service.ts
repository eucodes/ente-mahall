import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { AuditService } from "../audit/audit.service";
import { LoginLockoutService } from "./login-lockout.service";
import { TokenService, type IssuedTokens } from "./token.service";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";

const BCRYPT_COST = 12;

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly lockoutService: LoginLockoutService,
    private readonly auditService: AuditService
  ) {}

  async register(dto: RegisterDto, context: RequestContext) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      // Deliberately vague — do not reveal that this email is already registered.
      throw new ConflictException("Unable to register with the provided details");
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phone: dto.phone
    });

    await this.auditService.record({
      actorUserId: user.id,
      action: "auth.register",
      targetType: "User",
      targetId: user.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    const tokens = await this.tokenService.issueTokens(user.id, user.email, context);
    return { user: this.usersService.toSafeUser(user), tokens };
  }

  async login(dto: LoginDto, context: RequestContext) {
    if (await this.lockoutService.isLocked(dto.email)) {
      await this.auditService.record({
        action: "auth.login.locked",
        metadata: { email: dto.email },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });
      throw new UnauthorizedException("Too many failed attempts. Try again later.");
    }

    const user = await this.usersService.findByEmail(dto.email);
    const passwordMatches = user ? await bcrypt.compare(dto.password, user.passwordHash) : false;

    if (!user || !passwordMatches || !user.isActive) {
      await this.lockoutService.recordFailure(dto.email);
      await this.auditService.record({
        actorUserId: user?.id,
        action: "auth.login.failed",
        metadata: { email: dto.email },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });
      throw new UnauthorizedException("Invalid email or password");
    }

    await this.lockoutService.reset(dto.email);
    await this.auditService.record({
      actorUserId: user.id,
      action: "auth.login.success",
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    const tokens = await this.tokenService.issueTokens(user.id, user.email, context);
    return { user: this.usersService.toSafeUser(user), tokens };
  }

  async refresh(refreshToken: string, context: RequestContext): Promise<IssuedTokens> {
    return this.tokenService.rotateRefreshToken(refreshToken, context);
  }

  async logout(refreshToken: string | undefined, actorUserId: string | undefined, context: RequestContext) {
    if (refreshToken) {
      await this.tokenService.revokeRefreshToken(refreshToken);
    }
    await this.auditService.record({
      actorUserId,
      action: "auth.logout",
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
