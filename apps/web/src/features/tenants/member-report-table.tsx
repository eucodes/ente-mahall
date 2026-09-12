"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Avatar, EmptyState, Input, Search, StatCard, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mahalle/ui";
import type { Member } from "@/lib/members";

export interface MemberReportColumn {
  header: string;
  render: (member: Member) => ReactNode;
}

export interface MemberReportTableProps {
  members: Member[];
  total: number;
  statLabel: string;
  columns: MemberReportColumn[];
  emptyTitle: string;
  emptyDescription: string;
}

export function MemberReportTable({ members, total, statLabel, columns, emptyTitle, emptyDescription }: MemberReportTableProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (member) => member.fullName.toLowerCase().includes(q) || (member.phone?.toLowerCase().includes(q) ?? false)
    );
  }, [members, query]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={statLabel} value={total} tone="violet" />
      </div>

      <Input
        leadingIcon={<Search />}
        placeholder="Search name or phone…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="sm:max-w-xs"
      />

      {filtered.length === 0 ? (
        <EmptyState title={members.length === 0 ? emptyTitle : "No matches"} description={members.length === 0 ? emptyDescription : "Try a different name or phone."} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                {columns.map((column) => (
                  <TableHead key={column.header}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={member.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{member.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{member.family?.name ?? "No family"}</p>
                      </div>
                    </div>
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.header} className="text-muted-foreground">
                      {column.render(member)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
