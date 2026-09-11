import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { appScopeFromRequest, scopedCookieName } from "../../auth/app-scope";
import { CSRF_COOKIE, CSRF_HEADER } from "../../auth/auth.constants";
import { SKIP_CSRF_KEY } from "../decorators/skip-csrf.decorator";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Double-submit-cookie CSRF protection. Session identity here lives in an
 * HttpOnly cookie the browser attaches automatically to any cross-site form
 * or fetch — which is exactly what makes CSRF possible. The `csrf_token`
 * cookie is readable by our own frontend's JS (not HttpOnly) but a
 * cross-origin attacker page cannot read it due to the same-origin policy,
 * so it can echo the auth cookie but not the matching header.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest<Request>();
    if (SAFE_METHODS.has(request.method)) return true;

    const app = appScopeFromRequest(request);
    const cookieToken = app
      ? (request.cookies as Record<string, string> | undefined)?.[scopedCookieName(CSRF_COOKIE, app)]
      : undefined;
    const headerToken = request.headers[CSRF_HEADER];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      throw new ForbiddenException("Missing or invalid CSRF token");
    }

    return true;
  }
}
