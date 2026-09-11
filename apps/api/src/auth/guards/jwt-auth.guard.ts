import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** Apply to any endpoint that requires a signed-in user. Does not check tenant/platform authorization — see later phases. */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt-access") {}
