import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TenantsModule } from "../tenants/tenants.module";
import { MembersModule } from "../members/members.module";
import { MemberAuthController } from "./member-auth.controller";
import { OtpService } from "./otp.service";
import { MemberTokenService } from "./member-token.service";
import { MemberAuthGuard } from "./guards/member-auth.guard";

@Module({
  imports: [TenantsModule, MembersModule, JwtModule.register({})],
  controllers: [MemberAuthController],
  providers: [OtpService, MemberTokenService, MemberAuthGuard]
})
export class MemberAuthModule {}
