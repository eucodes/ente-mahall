"use client";

import type { Member } from "@/lib/members";
import { MemberReportTable } from "./member-report-table";

export function ExpatriateReport({ members, total }: { members: Member[]; total: number }) {
  return (
    <MemberReportTable
      members={members}
      total={total}
      statLabel="Expatriate members"
      emptyTitle="No expatriate members recorded"
      emptyDescription="Mark a member as expatriate from the Members page to see them here."
      columns={[
        { header: "Country", render: (m) => m.expatriateCountry ?? "—" },
        { header: "Occupation abroad", render: (m) => m.expatriateOccupation ?? "—" },
        { header: "Contact abroad", render: (m) => m.expatriateContact ?? "—" }
      ]}
    />
  );
}
