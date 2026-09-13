import { Inject, Injectable, Logger } from "@nestjs/common";
import type Redis from "ioredis";
import { REDIS_CLIENT } from "../common/redis/redis.constants";
import { LOGIN_LOCKOUT_WINDOW_SECONDS, LOGIN_MAX_ATTEMPTS } from "./auth.constants";

/**
 * Tracks failed login attempts per-email in Redis so a brute-force attempt is
 * throttled even across restarts of the API process. This is deliberately
 * separate from the global request-rate limiter (@nestjs/throttler), which
 * only protects per-IP — an attacker rotating IPs would otherwise bypass it.
 */
@Injectable()
export class LoginLockoutService {
  private readonly logger = new Logger(LoginLockoutService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private key(email: string): string {
    return `login:lockout:${email.trim().toLowerCase()}`;
  }

  async isLocked(email: string): Promise<boolean> {
    try {
      const attempts = await this.redis.get(this.key(email));
      return attempts !== null && parseInt(attempts, 10) >= LOGIN_MAX_ATTEMPTS;
    } catch (err) {
      this.logger.warn(`Redis unavailable for lockout check: ${(err as Error).message}`);
      return false;
    }
  }

  async recordFailure(email: string): Promise<void> {
    try {
      const key = this.key(email);
      const attempts = await this.redis.incr(key);
      if (attempts === 1) {
        await this.redis.expire(key, LOGIN_LOCKOUT_WINDOW_SECONDS);
      }
    } catch (err) {
      this.logger.warn(`Redis record failure failed: ${(err as Error).message}`);
    }
  }

  async reset(email: string): Promise<void> {
    try {
      await this.redis.del(this.key(email));
    } catch (err) {
      this.logger.warn(`Redis lockout reset failed: ${(err as Error).message}`);
    }
  }
}
