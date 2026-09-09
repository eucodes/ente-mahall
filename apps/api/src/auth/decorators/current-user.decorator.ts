import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtAccessPayload } from '../jwt-payload.js';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): JwtAccessPayload => {
  const request = ctx.switchToHttp().getRequest<Request & { user: JwtAccessPayload }>();
  return request.user;
});
