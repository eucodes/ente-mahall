import { SetMetadata } from "@nestjs/common";

export const SKIP_CSRF_KEY = "skipCsrf";

/**
 * Marks an endpoint as exempt from CsrfGuard. Use ONLY for endpoints that
 * either establish the CSRF cookie in the first place (login, register) or
 * where a forged cross-site request cannot meaningfully harm the victim
 * (refresh/logout only ever affect the caller's own session, never another
 * user's data).
 */
export const SkipCsrf = () => SetMetadata(SKIP_CSRF_KEY, true);
