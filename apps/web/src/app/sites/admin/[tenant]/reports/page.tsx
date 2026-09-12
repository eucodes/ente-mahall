import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, PageHeader, StatCard } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getReportsSummary } from "@/lib/reports-summary";

interface ReportLink {
  title: string;
  description: string;
  href: string;
}

interface ReportGroup {
  label: string;
  reports: ReportLink[];
}

function reportGroups(base: string): ReportGroup[] {
  return [
    {
      label: "People",
      reports: [
        { title: "Yatheem register", description: "Members recorded as yatheem (orphans).", href: `${base}/reports/yatheem` },
        { title: "Expatriate register", description: "Members living or working abroad.", href: `${base}/reports/expatriate` },
        { title: "Blood group report", description: "Members grouped by blood group.", href: `${base}/reports/blood-groups` }
      ]
    },
    {
      label: "Registers",
      reports: [
        { title: "Death register", description: "Official death records and certificates.", href: `${base}/registers/death` },
        { title: "Marriage register", description: "Nikah records and certificates.", href: `${base}/registers/marriage` },
        { title: "Divorce register", description: "Divorce records and certificates.", href: `${base}/registers/divorce` },
        { title: "Mahallu release register", description: "Members released from membership.", href: `${base}/registers/release` },
        { title: "Grave register", description: "Burial plot allocation.", href: `${base}/registers/grave` },
        { title: "Madrassa / Dars register", description: "Religious-education enrollment.", href: `${base}/registers/madrassa` },
        { title: "Property register", description: "Waqf, owned, and rented property.", href: `${base}/registers/property` }
      ]
    },
    {
      label: "Finance",
      reports: [
        { title: "Cash book", description: "Every cash movement with a running balance.", href: `${base}/finance/cash-book` },
        { title: "Finance overview", description: "Income, expense, and net position by account.", href: `${base}/finance` },
        { title: "Dues", description: "Amounts owed by members.", href: `${base}/finance/dues` },
        { title: "Salary", description: "Staff salary obligations.", href: `${base}/finance/salary` }
      ]
    },
    {
      label: "Committee & Services",
      reports: [
        { title: "Committee roster", description: "Current committee posts.", href: `${base}/committee` },
        { title: "Committee meetings", description: "Meetings, minutes, and decisions.", href: `${base}/committee/meetings` },
        { title: "Service requests", description: "Member requests and their status.", href: `${base}/services` }
      ]
    }
  ];
}

export default async function ReportsHubPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const summary = await getReportsSummary(slug);
  const base = `/${slug}`;

  return (
    <>
      <PageHeader title="Reports" description="A directory of every report across the Mahallu's records." />

      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Members" value={summary.members ?? "—"} tone="violet" />
          <StatCard label="Families" value={summary.families ?? "—"} tone="blue" />
          <StatCard label="Upcoming events" value={summary.upcomingEvents ?? "—"} tone="green" />
          <StatCard label="Open service requests" value={summary.pendingServiceRequests ?? "—"} />
          <StatCard label="Dues on file" value={summary.dues ?? "—"} />
        </div>

        {reportGroups(base).map((group) => (
          <div key={group.label} className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{group.label}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.reports.map((report) => (
                <Link
                  key={report.href}
                  href={report.href}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{report.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{report.description}</p>
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
