import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
