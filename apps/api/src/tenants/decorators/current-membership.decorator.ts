import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { MembershipWithRole } from "../../memberships/memberships.service";

/** Use only on a route guarded by TenantContextGuard — otherwise undefined. */
export const CurrentMembership = createParamDecorator((_data: unknown, ctx: ExecutionContext): MembershipWithRole => {
  const request = ctx.switchToHttp().getRequest();
  return request.membership;
});
