"use client";

import type { Member } from "@/lib/members";
import { MemberReportTable } from "./member-report-table";

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("en-IN") : "—";
}

export function YatheemReport({ members, total }: { members: Member[]; total: number }) {
  return (
    <MemberReportTable
      members={members}
      total={total}
      statLabel="Yatheem members"
      emptyTitle="No yatheem members recorded"
      emptyDescription="Mark a member as yatheem from the Members page to see them here."
      columns={[
        { header: "Guardian", render: (m) => m.guardianName ?? "—" },
        { header: "Guardian phone", render: (m) => m.guardianPhone ?? "—" },
        { header: "Date of birth", render: (m) => formatDate(m.dateOfBirth) }
      ]}
    />
  );
}
