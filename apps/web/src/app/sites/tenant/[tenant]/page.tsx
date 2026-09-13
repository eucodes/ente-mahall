import Link from "next/link";
import {
  ArrowRight,
  Avatar,
  Badge,
  Building,
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CheckCircle2,
  Clock,
  EmptyState,
  FileText,
  HeartHandshake,
  Landmark,
  MapPin,
  Megaphone,
  Sparkles,
  UsersRound,
  Users,
  Wallet
} from "@mahalle/ui";
import { getMemberSession } from "@/lib/member-session";
import { getPublicTenant } from "@/lib/tenants";
import { getAnnouncements, getEvents } from "@/lib/business-resources";
import { HijriDateBadge } from "@/features/navigation/hijri-date-badge";

const PRAYER_SCHEDULE = [
  { name: "Fajr", azan: "05:15 AM", iqamah: "05:35 AM" },
  { name: "Dhuhr", azan: "12:30 PM", iqamah: "12:50 PM" },
  { name: "Asr", azan: "04:45 PM", iqamah: "05:00 PM" },
  { name: "Maghrib", azan: "06:30 PM", iqamah: "06:35 PM" },
  { name: "Isha", azan: "08:00 PM", iqamah: "08:15 PM" },
  { name: "Juma", azan: "12:45 PM", iqamah: "01:15 PM", special: true }
];

export default async function TenantPublicSitePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const [tenant, member, announcementsResult, eventsResult] = await Promise.all([
    getPublicTenant(slug),
    getMemberSession(slug),
    getAnnouncements(slug, 1, 4).catch(() => null),
    getEvents(slug, 1, 4).catch(() => null)
  ]);

  const announcements = announcementsResult?.items ?? [];
  const events = eventsResult?.items ?? [];
  const mahalleName = tenant?.name ?? `${slug.toUpperCase()} Mahalle`;
  const mosqueName = tenant?.masjidName ?? "Central Juma Masjid";

  return (
    <div className="space-y-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified Mahalle Jurisdiction
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs font-medium text-slate-300">{mosqueName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {mahalleName}
            </h1>

            <p className="max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              Official public portal for community members and residents. View daily prayer timings, mosque announcements, upcoming programs, and citizen services.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {member ? (
                <Button asChild size="lg" className="rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs">
                  <Link href="/dashboard">
                    Go to Member Dashboard <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs">
                  <Link href="/login">
                    Member Login (Phone + OTP) <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="shrink-0 hidden md:block">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 border border-white/10 text-emerald-400 font-bold text-3xl shadow-inner">
              <Sparkles className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
      </div>

      {/* Daily Prayer Timetable Widget */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              Daily Prayer Times (Awqat al-Salah)
            </h2>
            <p className="text-xs text-muted-foreground">Congregational prayer times at {mosqueName}</p>
          </div>
          <div className="flex items-center gap-2">
            <HijriDateBadge />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PRAYER_SCHEDULE.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-4 text-center transition-all ${
                p.special
                  ? "border-emerald-600/40 bg-gradient-to-b from-emerald-500/10 to-transparent shadow-xs"
                  : "border-border/80 bg-card shadow-2xs"
              }`}
            >
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">{p.name}</span>
              <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{p.iqamah}</p>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">Azan: {p.azan}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Services Quick Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-600" />
            Citizen Member Services
          </h2>
          <p className="text-xs text-muted-foreground">Certified applications available for verified residents</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-border/80 shadow-xs hover:border-primary/40 transition-all">
            <CardContent className="p-5 space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Marriage (Nikah) NOC</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Official certificate of marriage eligibility and registration record.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-xs hover:border-primary/40 transition-all">
            <CardContent className="p-5 space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
                <Landmark className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Mahallu Release (Pokku)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clearance certificate for marriage or relocation to another Mahall.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-xs hover:border-primary/40 transition-all">
            <CardContent className="p-5 space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Wallet className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Monthly Varisa & Dues</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                View household subscription status and download verified payment receipts.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-xs hover:border-primary/40 transition-all">
            <CardContent className="p-5 space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Welfare & Aid Relief</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submit applications for medical assistance, orphan support, and scholarships.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Public Announcements & Events */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Friday Notices & Announcements */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="flex-row items-center justify-between border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-violet-600" />
              Friday Notices & Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {announcements.length === 0 ? (
              <EmptyState title="No announcements published" description="Check back following the next Friday congregation." />
            ) : (
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="rounded-xl border border-border/70 p-4 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-foreground">{a.title}</h4>
                      <Badge variant="outline" className="text-[10px]">
                        {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : "Latest"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {a.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Community Programs */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="flex-row items-center justify-between border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              Upcoming Programs & Milad
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {events.length === 0 ? (
              <EmptyState title="No upcoming events scheduled" description="Programs will be announced as they are scheduled." />
            ) : (
              <div className="space-y-3">
                {events.map((e) => (
                  <div key={e.id} className="flex items-start gap-3 rounded-xl border border-border/70 p-3.5 bg-muted/20">
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-500/10 text-[10px] font-bold uppercase leading-none text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <span>{new Date(e.startsAt).toLocaleDateString(undefined, { month: "short" })}</span>
                      <span className="text-sm mt-0.5">{new Date(e.startsAt).getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground">{e.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {e.location ?? mosqueName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Member Area Callout Card */}
      <Card className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-50/50 via-card to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-foreground">Are you a registered member of this Mahalle?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Sign in with your mobile number to view your family card, check monthly Varisa dues, request certified documents, and manage your household census.
            </p>
          </div>
          {member ? (
            <Button asChild size="lg" className="rounded-xl font-bold shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">
              <Link href="/dashboard">Open My Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="rounded-xl font-bold shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">
              <Link href="/login">Citizen OTP Login</Link>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
