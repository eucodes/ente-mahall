import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Tenant } from "@mahalle/database";

/** Use only on a route guarded by TenantContextGuard — otherwise undefined. */
export const CurrentTenant = createParamDecorator((_data: unknown, ctx: ExecutionContext): Tenant => {
  const request = ctx.switchToHttp().getRequest();
  return request.tenant;
});
