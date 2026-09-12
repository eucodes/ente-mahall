"use client";

import { useMemo, useState } from "react";
import { Badge, Droplet, Select, StatCard } from "@mahalle/ui";
import { BLOOD_GROUP_LABELS, type BloodGroup } from "@/lib/member-constants";
import type { Member } from "@/lib/members";
import { MemberReportTable } from "./member-report-table";

const GROUPS = Object.keys(BLOOD_GROUP_LABELS) as BloodGroup[];

export function BloodGroupReport({ members, total }: { members: Member[]; total: number }) {
  const [groupFilter, setGroupFilter] = useState<BloodGroup | "">("");

  const counts = useMemo(() => {
    const map = new Map<BloodGroup, number>();
    for (const member of members) {
      if (!member.bloodGroup) continue;
      map.set(member.bloodGroup, (map.get(member.bloodGroup) ?? 0) + 1);
    }
    return map;
  }, [members]);

  const filtered = groupFilter ? members.filter((m) => m.bloodGroup === groupFilter) : members;
  const unrecorded = members.filter((m) => !m.bloodGroup).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        {GROUPS.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setGroupFilter((current) => (current === group ? "" : group))}
            className={`rounded-xl border p-3 text-left transition-colors ${
              groupFilter === group ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="gap-1">
                <Droplet className="h-3 w-3" /> {BLOOD_GROUP_LABELS[group]}
              </Badge>
              <span className="text-lg font-bold tabular-nums">{counts.get(group) ?? 0}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Members with a blood group on file" value={total - unrecorded} tone="violet" />
        <StatCard label="Not recorded" value={unrecorded} hint="Out of members shown on this page" />
      </div>

      <div className="flex items-center gap-2">
        <Select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value as BloodGroup | "")} className="max-w-[180px]">
          <option value="">All blood groups</option>
          {GROUPS.map((group) => (
            <option key={group} value={group}>
              {BLOOD_GROUP_LABELS[group]}
            </option>
          ))}
        </Select>
      </div>

      <MemberReportTable
        members={filtered.filter((m) => m.bloodGroup)}
        total={filtered.filter((m) => m.bloodGroup).length}
        statLabel="Shown below"
        emptyTitle="No members with a blood group on file"
        emptyDescription="Add a blood group from the Members page to see them here."
        columns={[
          { header: "Blood group", render: (m) => (m.bloodGroup ? BLOOD_GROUP_LABELS[m.bloodGroup] : "—") },
          { header: "Phone", render: (m) => m.phone ?? "—" }
        ]}
      />
    </div>
  );
}
