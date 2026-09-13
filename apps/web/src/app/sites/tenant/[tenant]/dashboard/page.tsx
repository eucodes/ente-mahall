import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CheckCircle2,
  EmptyState,
  FileText,
  HeartHandshake,
  MapPin,
  Megaphone,
  Sparkles,
  Users,
  Wallet,
  Clock
} from "@mahalle/ui";
import { getMemberSession } from "@/lib/member-session";
import { getPublicTenant } from "@/lib/tenants";
import { getAnnouncements, getEvents } from "@/lib/business-resources";

export default async function TenantDashboardPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const [member, tenant] = await Promise.all([
    getMemberSession(slug),
    getPublicTenant(slug)
  ]);

  if (!member) {
    redirect("/login");
  }

  const [announcementsResult, eventsResult] = await Promise.all([
    getAnnouncements(slug, 1, 4).catch(() => null),
    getEvents(slug, 1, 4).catch(() => null)
  ]);

  const announcements = announcementsResult?.items ?? [];
  const events = eventsResult?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" />
                Verified Resident
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300">{tenant?.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Assalamu Alaikum, {member.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Welcome to your digital Mahall self-service portal. Manage your certificates, contributions, and community updates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 font-bold text-lg border border-white/10">
              {member.fullName.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Member Profile & Dues Matrix */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Member Profile Details */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Member Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Full Name</span>
              <span className="font-semibold text-foreground text-sm">{member.fullName}</span>
            </div>
            {member.phone && (
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Mobile Number</span>
                <span className="font-medium text-foreground">{member.phone}</span>
              </div>
            )}
            {member.email && (
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Email Address</span>
                <span className="font-medium text-foreground">{member.email}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Membership Status</span>
              <Badge variant="success">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Available Citizen Services */}
        <Card className="rounded-2xl border-border/80 shadow-xs md:col-span-2">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              Citizen Services & Certificates
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-4">
              Apply online for official certificates or welfare assistance directly from the Mahall Committee.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border/70 p-3.5 bg-muted/30 hover:bg-muted/60 transition-colors flex flex-col justify-between">
                <div>
                  <span className="font-semibold text-xs text-foreground block">Marriage (Nikah) NOC</span>
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Certificate of marriage eligibility or registration.
                  </span>
                </div>
                <Button size="sm" variant="secondary" className="mt-3 w-full text-xs rounded-lg font-semibold">
                  Apply Online
                </Button>
              </div>

              <div className="rounded-xl border border-border/70 p-3.5 bg-muted/30 hover:bg-muted/60 transition-colors flex flex-col justify-between">
                <div>
                  <span className="font-semibold text-xs text-foreground block">Mahallu Release (NOC)</span>
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Transfer or release clearance for marriage or relocation.
                  </span>
                </div>
                <Button size="sm" variant="secondary" className="mt-3 w-full text-xs rounded-lg font-semibold">
                  Apply Online
                </Button>
              </div>

              <div className="rounded-xl border border-border/70 p-3.5 bg-muted/30 hover:bg-muted/60 transition-colors flex flex-col justify-between">
                <div>
                  <span className="font-semibold text-xs text-foreground block">Welfare & Aid Request</span>
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Medical, education, or pension assistance applications.
                  </span>
                </div>
                <Button size="sm" variant="secondary" className="mt-3 w-full text-xs rounded-lg font-semibold">
                  Request Aid
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements & Upcoming Events */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Announcements */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="flex-row items-center justify-between border-b border-border/60 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-violet-600" />
              Friday Notices & Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {announcements.length === 0 ? (
              <EmptyState title="No active announcements" description="Check back after the upcoming Juma sermon." />
            ) : (
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="rounded-xl border border-border/70 p-3.5 bg-card">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground">{a.title}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : "Latest"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {a.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Community Events */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="flex-row items-center justify-between border-b border-border/60 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              Community Events & Milad
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {events.length === 0 ? (
              <EmptyState title="No upcoming events" description="No upcoming programs scheduled at the moment." />
            ) : (
              <div className="space-y-3">
                {events.map((e) => (
                  <div key={e.id} className="flex items-start gap-3 rounded-xl border border-border/70 p-3 bg-card">
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-500/10 text-[10px] font-bold uppercase leading-none text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <span>{new Date(e.startsAt).toLocaleDateString(undefined, { month: "short" })}</span>
                      <span className="text-sm mt-0.5">{new Date(e.startsAt).getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground">{e.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {e.location ?? "Central Masjid"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
