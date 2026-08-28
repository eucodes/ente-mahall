import { createHash, randomBytes } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { JwtAccessPayload } from './jwt-payload.js';

const REFRESH_TOKEN_BYTES = 48;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(mahallSlug: string, email: string, password: string) {
    const mahall = await this.prisma.mahall.findUnique({ where: { slug: mahallSlug } });
    if (!mahall) throw new UnauthorizedException('Invalid credentials');

    const user = await this.prisma.user.findUnique({
      where: { mahallId_email: { mahallId: mahall.id, email } },
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, mahall.id, user.role);
  }

  async refresh(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate: revoke the used token and issue a fresh pair.
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(stored.user.id, stored.user.mahallId, stored.user.role);
  }

  async logout(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issueTokens(userId: string, mahallId: string, role: JwtAccessPayload['role']) {
    const payload: JwtAccessPayload = { sub: userId, mahallId, role };
    const accessToken = await this.jwt.signAsync(payload);

    const refreshToken = randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
    const refreshTtlMs = this.parseTtlMs(this.config.getOrThrow<string>('JWT_REFRESH_TTL'));

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + refreshTtlMs),
      },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    // Refresh tokens are high-entropy random values, not user passwords — a fast
    // deterministic hash is fine here and lets us look them up by equality.
    return createHash('sha256').update(token).digest('hex');
  }

  private parseTtlMs(ttl: string): number {
    const match = /^(\d+)([smhd])$/.exec(ttl);
    if (!match) throw new Error(`Invalid TTL format: ${ttl}`);
    const value = Number(match[1]);
    const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2] as 's' | 'm' | 'h' | 'd'];
    return value * unitMs;
  }
}
