import { join } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import configuration from "./config/configuration";
import { validateEnv } from "./config/env.validation";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { RedisModule } from "./common/redis/redis.module";
import { AuditModule } from "./audit/audit.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { MembershipsModule } from "./memberships/memberships.module";
import { TenantsModule } from "./tenants/tenants.module";
import { PlatformModule } from "./platform/platform.module";
import { MembersModule } from "./members/members.module";
import { MemberAuthModule } from "./member-auth/member-auth.module";
import { FamiliesModule } from "./families/families.module";
import { EventsModule } from "./events/events.module";
import { AnnouncementsModule } from "./announcements/announcements.module";
import { ProgramsModule } from "./programs/programs.module";
import { CsrfGuard } from "./common/guards/csrf.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // apps/api runs with its own directory as cwd, but the shared .env
      // lives at the monorepo root (single env file for both apps).
      envFilePath: join(process.cwd(), "../../.env"),
      load: [configuration],
      validate: validateEnv
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 100 }]
    }),
    DatabaseModule,
    RedisModule,
    AuditModule,
    HealthModule,
    UsersModule,
    AuthModule,
    PermissionsModule,
    MembershipsModule,
    TenantsModule,
    PlatformModule,
    MembersModule,
    MemberAuthModule,
    FamiliesModule,
    EventsModule,
    AnnouncementsModule,
    ProgramsModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: CsrfGuard }
  ]
})
export class AppModule {}
