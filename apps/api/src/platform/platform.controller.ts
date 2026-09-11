import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import type { PlatformMembership } from "@mahalle/database";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "./guards/platform-context.guard";
import { CurrentPlatformMembership } from "./decorators/current-platform-membership.decorator";
import { PlatformService } from "./platform.service";
import { ListAuditLogsDto } from "./dto/list-audit-logs.dto";

@Controller("platform")
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  /** Whether the current user has control-plane access at all, and what role. Mirrors /tenants/:slug/me's pattern. */
  @Get("me")
  @UseGuards(JwtAuthGuard, PlatformContextGuard)
  me(@CurrentPlatformMembership() membership: PlatformMembership) {
    return { role: membership.role };
  }

  @Get("tenants")
  @UseGuards(JwtAuthGuard, PlatformContextGuard)
  async tenants() {
    const tenants = await this.platformService.listAllTenants();
    return { tenants };
  }

  @Get("audit-logs")
  @UseGuards(JwtAuthGuard, PlatformContextGuard)
  async auditLogs(@Query() query: ListAuditLogsDto) {
    const { entries, total } = await this.platformService.listAuditLogs(query);
    return {
      entries,
      meta: { page: query.page, pageSize: query.pageSize, total }
    };
  }
}
