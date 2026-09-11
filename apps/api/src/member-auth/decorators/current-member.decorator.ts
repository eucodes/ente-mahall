import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { RequestWithMember } from "../guards/member-auth.guard";

/** The Member attached by MemberAuthGuard — only valid on routes guarded by it. */
export const CurrentMember = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<RequestWithMember>();
  return req.member;
});
