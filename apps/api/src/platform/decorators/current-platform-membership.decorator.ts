import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { PlatformMembership } from "@mahalle/database";

/** Use only on a route guarded by PlatformContextGuard — otherwise undefined. */
export const CurrentPlatformMembership = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PlatformMembership => {
    const request = ctx.switchToHttp().getRequest();
    return request.platformMembership;
  }
);
