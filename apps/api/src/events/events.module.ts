import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { EventRegistrationsController } from "./event-registrations.controller";
import { EventRegistrationsService } from "./event-registrations.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [EventsController, EventRegistrationsController],
  providers: [EventsService, EventRegistrationsService],
  exports: [EventsService]
})
export class EventsModule {}
