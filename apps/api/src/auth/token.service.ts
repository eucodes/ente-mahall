import { randomBytes, createHash } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import { PrismaService } from "../database/prisma.service";

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenTtlMs: number;
  refreshTokenTtlMs: number;
}

/**
 * Refresh tokens are high-entropy random strings, never stored in plaintext —
 * only a SHA-256 hash. Unlike a password, a 256-bit random token has no
 * brute-forceable structure, so a fast hash (not bcrypt) is the right and
 * standard choice here: it lets us look the token up by hash efficiently.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  private get accessTtlMs(): number {
    return ms(this.config.getOrThrow<string>("jwt.accessTtl") as ms.StringValue);
  }

  private get refreshTtlMs(): number {
    return ms(this.config.getOrThrow<string>("jwt.refreshTtl") as ms.StringValue);
  }

  signAccessToken(payload: AccessTokenPayload): string {
    return this.jwt.sign(payload, {
      secret: this.config.getOrThrow<string>("jwt.accessSecret"),
      expiresIn: this.config.getOrThrow<string>("jwt.accessTtl")
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.jwt.verify<AccessTokenPayload>(token, {
      secret: this.config.getOrThrow<string>("jwt.accessSecret")
    });
  }

  /** Issues a fresh access + refresh token pair and persists the refresh token's hash. */
  async issueTokens(
    userId: string,
    email: string,
    context: { ipAddress?: string; userAgent?: string }
  ): Promise<IssuedTokens> {
    const accessToken = this.signAccessToken({ sub: userId, email });
    const refreshToken = randomBytes(64).toString("hex");

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + this.refreshTtlMs),
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      }
    });

    return {
      accessToken,
      refreshToken,
      accessTokenTtlMs: this.accessTtlMs,
      refreshTokenTtlMs: this.refreshTtlMs
    };
  }

  /**
   * Validates a presented refresh token, revokes it, and issues a new
   * access/refresh pair in its place (rotation). If a token that was already
   * rotated (or revoked) is presented again — a strong signal of theft — the
   * entire chain is revoked so the legitimate session is also forced to
   * re-authenticate rather than silently trusting the stolen copy.
   */
  async rotateRefreshToken(
    presentedToken: string,
    context: { ipAddress?: string; userAgent?: string }
  ): Promise<IssuedTokens> {
    const tokenHash = hashToken(presentedToken);
    const existing = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!existing) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (existing.revokedAt || existing.expiresAt < new Date()) {
      await this.revokeAllForUser(existing.userId);
      throw new UnauthorizedException("Refresh token is no longer valid");
    }

    if (!existing.user.isActive) {
      throw new UnauthorizedException("Account is inactive");
    }

    const next = await this.issueTokens(existing.userId, existing.user.email, context);
    const newRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(next.refreshToken) }
    });

    await this.prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date(), replacedById: newRecord?.id }
    });

    return next;
  }

  async revokeRefreshToken(presentedToken: string): Promise<void> {
    const tokenHash = hashToken(presentedToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }
}
