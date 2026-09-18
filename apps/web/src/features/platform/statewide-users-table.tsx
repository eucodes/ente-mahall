"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Search,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@mahalle/ui";
import type { StatewideUser } from "@/lib/platform";

interface StatewideUsersTableProps {
  users: StatewideUser[];
}

export function StatewideUsersTable({ users }: StatewideUsersTableProps) {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const matchEmail = u.email.toLowerCase().includes(q);
    const matchName = u.fullName.toLowerCase().includes(q);
    const matchPhone = u.phone?.toLowerCase().includes(q);
    const matchTenant = u.tenants.some((t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));
    return matchEmail || matchName || matchPhone || matchTenant;
  });

  return (
    <div className="space-y-4">
      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, phone, or Mahalle…"
            className="pl-9 text-xs"
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Showing {filtered.length} of {users.length} accounts
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No users found"
          description="No accounts match your current search query."
        />
      ) : (
        <div className="rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>User Identity</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Platform Role</TableHead>
                <TableHead>Mahalle Memberships</TableHead>
                <TableHead>Active Sessions</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-xs text-foreground">{user.fullName}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{user.email}</p>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {user.phone ?? "—"}
                  </TableCell>

                  <TableCell>
                    {user.platformRole ? (
                      <Badge variant="destructive" className="text-[10px] uppercase font-mono">
                        {user.platformRole}
                      </Badge>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {user.tenants.length === 0 ? (
                      <span className="text-[11px] text-muted-foreground">None</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {user.tenants.map((t) => (
                          <Link
                            key={t.id}
                            href={`/tenants/${t.id}`}
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-foreground hover:bg-muted hover:text-primary transition-colors"
                          >
                            <span>{t.name}</span>
                            <span className="text-muted-foreground">({t.roleName || t.role || t.roleKey})</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-xs">
                    <Badge variant={user.activeSessionsCount > 0 ? "outline" : "secondary"} className="text-[10px]">
                      {user.activeSessionsCount} active
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>

                  <TableCell className="text-right">
                    <Link
                      href={`/users/${user.id}/sessions`}
                      className="rounded-lg border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors inline-block"
                    >
                      Sessions
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
