"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn
} from "@mahalle/ui";
import { apiClient } from "@/lib/api-client";
import type {
  PlatformAdmin,
  PlatformAnnouncement,
  PlatformEvent,
  PlatformFamily,
  PlatformMember,
  PlatformProgram
} from "@/lib/platform";

import { ROOT_DOMAIN } from "@/lib/env";
import { ArrowUpRight, ExternalLink, Button } from "@mahalle/ui";

const SECTIONS = ["members", "families", "events", "announcements", "programs", "admins"] as const;
type Section = (typeof SECTIONS)[number];

interface TenantOperationsViewerProps {
  tenantId: string;
  tenantSlug?: string;
}

export function TenantOperationsViewer({ tenantId, tenantSlug }: TenantOperationsViewerProps) {
  const [activeSection, setActiveSection] = useState<Section>("members");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 15;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const url =
      activeSection === "admins"
        ? `/platform/tenants/${tenantId}/admins`
        : `/platform/tenants/${tenantId}/${activeSection}?page=${page}&pageSize=${pageSize}`;

    apiClient
      .get<Record<string, any>>(url)
      .then((res) => {
        if (activeSection === "admins") {
          setItems(res.admins ?? []);
          setTotal(res.admins?.length ?? 0);
        } else {
          setItems(res[activeSection] ?? []);
          setTotal(res.meta?.total ?? 0);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load operational data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [tenantId, activeSection, page]);

  function handleSectionChange(sec: Section) {
    setActiveSection(sec);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      {tenantSlug && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border/80 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div>
            <p className="text-xs font-bold text-foreground">Direct Administrative Console Access</p>
            <p className="text-[11px] text-muted-foreground">
              Unrestricted platform access to all operational modules on the Mahalle admin console.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`http://admin.${ROOT_DOMAIN}/${tenantSlug}/members`, "_blank")}
              className="text-xs gap-1 h-8"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Members</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`http://admin.${ROOT_DOMAIN}/${tenantSlug}/finance`, "_blank")}
              className="text-xs gap-1 h-8"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Finance</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`http://admin.${ROOT_DOMAIN}/${tenantSlug}/registers/marriage`, "_blank")}
              className="text-xs gap-1 h-8"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Registers</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`http://admin.${ROOT_DOMAIN}/${tenantSlug}/events`, "_blank")}
              className="text-xs gap-1 h-8"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Events</span>
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => window.open(`http://admin.${ROOT_DOMAIN}/${tenantSlug}`, "_blank")}
              className="text-xs gap-1 font-bold h-8"
            >
              <ArrowUpRight className="h-3 w-3" />
              <span>Launch Admin Console</span>
            </Button>
          </div>
        </div>
      )}

      {/* Subnav Pills */}
      <nav className="flex flex-wrap gap-1.5 border-b border-border pb-3">
        {SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSectionChange(s)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors cursor-pointer",
              s === activeSection
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {s}
          </button>
        ))}
      </nav>

      {/* Loading state */}
      {isLoading ? (
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-2">
            <Spinner className="h-6 w-6 text-primary" />
            <span className="text-xs text-muted-foreground">Loading {activeSection}…</span>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="py-8 text-center text-xs text-destructive">
            {error}
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="py-4 border-b border-border/60 flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold capitalize">
              {activeSection} ({total})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <EmptyState title={`No ${activeSection} found in this Mahalle`} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                {activeSection === "members" && (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Full Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Associated Family</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(items as PlatformMember[]).map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-semibold text-xs text-foreground">
                            {m.fullName}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {m.phone ?? "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {m.family?.name ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeSection === "families" && (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Family Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Primary Phone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(items as PlatformFamily[]).map((f) => (
                        <TableRow key={f.id}>
                          <TableCell className="font-semibold text-xs text-foreground">
                            {f.name}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {f.address ?? "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {f.phone ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeSection === "events" && (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Event Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Starts At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(items as PlatformEvent[]).map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="font-semibold text-xs text-foreground">
                            {e.title}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {e.location ?? "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(e.startsAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeSection === "announcements" && (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Title</TableHead>
                        <TableHead>Status / Published</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(items as PlatformAnnouncement[]).map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-semibold text-xs text-foreground">
                            {a.title}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {a.publishedAt ? new Date(a.publishedAt).toLocaleString() : "Draft"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeSection === "programs" && (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Program Name</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(items as PlatformProgram[]).map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-semibold text-xs text-foreground">
                            {p.name}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {p.description ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeSection === "admins" && (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Admin Full Name</TableHead>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Assigned Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(items as PlatformAdmin[]).map((adm) => (
                        <TableRow key={adm.id}>
                          <TableCell className="font-semibold text-xs text-foreground">
                            {adm.user.fullName}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {adm.user.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              {adm.role.name}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </CardContent>

          {activeSection !== "admins" && total > pageSize && (
            <div className="p-3 border-t border-border/60">
              <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                hrefForPage={() => "#"}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
