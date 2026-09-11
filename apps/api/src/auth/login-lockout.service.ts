import { Inject, Injectable } from "@nestjs/common";
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
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private key(email: string): string {
    return `login:lockout:${email.trim().toLowerCase()}`;
  }

  async isLocked(email: string): Promise<boolean> {
    const attempts = await this.redis.get(this.key(email));
    return attempts !== null && parseInt(attempts, 10) >= LOGIN_MAX_ATTEMPTS;
  }

  async recordFailure(email: string): Promise<void> {
    const key = this.key(email);
    const attempts = await this.redis.incr(key);
    if (attempts === 1) {
      await this.redis.expire(key, LOGIN_LOCKOUT_WINDOW_SECONDS);
    }
  }

  async reset(email: string): Promise<void> {
    await this.redis.del(this.key(email));
  }
}
