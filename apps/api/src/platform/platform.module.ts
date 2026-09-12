import { Module } from "@nestjs/common";
import { MembersModule } from "../members/members.module";
import { FamiliesModule } from "../families/families.module";
import { EventsModule } from "../events/events.module";
import { AnnouncementsModule } from "../announcements/announcements.module";
import { ProgramsModule } from "../programs/programs.module";
import { TenantsModule } from "../tenants/tenants.module";
import { PlatformController } from "./platform.controller";
import { PlatformTenantAccessController } from "./platform-tenant-access.controller";
import { PlatformService } from "./platform.service";
import { PlatformContextGuard } from "./guards/platform-context.guard";

@Module({
  imports: [MembersModule, FamiliesModule, EventsModule, AnnouncementsModule, ProgramsModule, TenantsModule],
  controllers: [PlatformController, PlatformTenantAccessController],
  providers: [PlatformService, PlatformContextGuard]
})
export class PlatformModule {}
