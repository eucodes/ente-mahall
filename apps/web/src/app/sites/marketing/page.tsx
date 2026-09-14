import Link from "next/link";
import {
  ArrowRight,
  Badge,
  Building,
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Droplet,
  FileText,
  HeartHandshake,
  Landmark,
  Layers,
  MapPin,
  Megaphone,
  Plane,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Users,
  Wallet
} from "@mahalle/ui";
import { adminHost, ROOT_DOMAIN, tenantHost } from "@/lib/env";
import { getSession } from "@/lib/session";
import { getMyTenants } from "@/lib/tenants";
import { LogoutButton } from "@/features/auth/logout-button";

const PILLARS = [
  {
    icon: UsersRound,
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    title: "Census & Family Registry",
    description: "Centralized household registry, family hierarchy, blood donor directory, and expatriate (Pravasi) tracking."
  },
  {
    icon: FileText,
    color: "text-teal-600 bg-teal-500/10 border-teal-500/20",
    title: "Official Registers & Certificates",
    description: "Legally formatted records for Nikah (Marriage), Mayyith (Death), and Mahallu Release NOC with printable stamps."
  },
  {
    icon: Wallet,
    color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    title: "Financial Treasury & Dues",
    description: "Track monthly Varisa dues, print payment vouchers, share receipts directly to WhatsApp, and audit day books."
  },
  {
    icon: Landmark,
    color: "text-sky-600 bg-sky-500/10 border-sky-500/20",
    title: "Committee & Governance",
    description: "Manage committee terms, meeting agendas, official resolutions, decisions, and administrative roles."
  },
  {
    icon: HeartHandshake,
    color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    title: "Citizen Services & Aid",
    description: "Online member self-service for marriage certificates, transfer NOCs, welfare assistance, and dispute mediation."
  },
  {
    icon: ShieldCheck,
    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    title: "100% Tenant Isolation",
    description: "Every Mahalle operates in an isolated workspace with fine-grained RBAC and comprehensive audit logging."
  }
];

export default async function MarketingHomePage() {
  const user = await getSession();
  const tenants = user ? await getMyTenants() : [];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground leading-tight">Ente Mahall</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">Mahalle SaaS</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="transition-colors hover:text-foreground">Core Modules</a>
            <a href="#security" className="transition-colors hover:text-foreground">Architecture</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href={`http://demo.${ROOT_DOMAIN}`} className="transition-colors hover:text-primary flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
              Live Demo
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
                <Button asChild size="sm" variant="secondary" className="rounded-xl">
                  <a href={`http://${adminHost()}`}>Admin Hub</a>
                </Button>
                <LogoutButton redirectTo="/" />
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="rounded-xl font-semibold">
                  <a href={`http://${adminHost()}/login`}>Admin Log in</a>
                </Button>
                <Button asChild size="sm" className="rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">
                  <a href={`http://${adminHost()}/onboarding`}>Get Started</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/80 pt-20 pb-24 md:pt-28 md:pb-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/14%),transparent_70%)]"
        />
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Islamic Civic Technology for Mosques & Communities</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl text-balance">
            The Modern Operating System for <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Mahalles & Mosques</span>
          </h1>

          <p className="max-w-2xl text-balance text-base sm:text-lg text-muted-foreground leading-relaxed">
            Eliminate chaotic spreadsheets and manual register books. Unify member censuses, certified marriage & death records, monthly Varisa dues, and committee governance in one secure, multi-tenant platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
              <a href={`http://${adminHost()}/onboarding`}>
                Start Onboarding Free <ArrowRight className="h-4 w-4 ml-1.5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold bg-card shadow-2xs">
              <a href={`http://demo.${ROOT_DOMAIN}`}>
                Explore Demo Mahalle
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Complete Database Isolation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Certified Printable Records
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Citizen OTP Portal
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Core Modules Grid */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <Badge variant="secondary" className="rounded-lg font-bold text-[11px] uppercase tracking-wider">
            All-in-One Civic Suite
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything Required to Run a Mahalle
          </h2>
          <p className="text-sm text-muted-foreground">
            Built specifically for Mahall secretaries, presidents, cashiers, and community members.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <Card key={p.title} className="rounded-2xl border-border/80 shadow-xs hover:border-primary/40 hover:shadow-md transition-all">
              <CardContent className="flex flex-col gap-3.5 p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${p.color}`}>
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">{p.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Security & Multi-Tenancy Architecture */}
      <section id="security" className="border-t border-border/80 bg-muted/20 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <Badge variant="success" className="font-bold text-xs uppercase tracking-wider">
                Enterprise Trust
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Strict Multi-Tenant Isolation by Design
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Community records are sacred and private. Ente Mahall enforces cryptographic session scoping and database-level tenant filters on every single query.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs text-foreground font-medium">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Subdomain isolation: Each Mahalle runs on its own host (`slug.{ROOT_DOMAIN}`)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dual Identity: Admins use credentials; Citizens log in with secure Phone + OTP</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Immutable audit logs: Every certificate issuance and due deletion is logged</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-lg space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-bold text-foreground font-sans">Tenant Isolation Verification</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  ENFORCED
                </span>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="text-primary font-bold">SELECT</span> * FROM &ldquo;members&rdquo;</p>
                <p><span className="text-primary font-bold">WHERE</span> &ldquo;tenantId&rdquo; = :currentMahalleId</p>
                <p><span className="text-slate-400 dark:text-slate-500">{"// Zero cross-tenant leakage guaranteed"}</span></p>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-sans">
                <span>PostgreSQL + Prisma Engine</span>
                <span>Tier-1 Latency &lt; 20ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Pricing Section */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center space-y-3 pb-12">
          <Badge variant="secondary" className="rounded-lg font-bold text-[11px] uppercase tracking-wider">
            Fair Pricing
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Built for Mahalles of Every Size
          </h2>
          <p className="text-sm text-muted-foreground">
            Affordable civic technology with zero hidden fees.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {/* Community Free */}
          <Card className="rounded-2xl border-border/80 p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <Badge variant="outline" className="text-xs">Community Starter</Badge>
              <div>
                <span className="text-3xl font-extrabold text-foreground">Free</span>
                <span className="text-xs text-muted-foreground"> / forever</span>
              </div>
              <p className="text-xs text-muted-foreground">Perfect for smaller Mahalles starting their digital census.</p>
              <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Up to 250 Members</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Census & Family Registry</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Marriage & Death Registers</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Public Community Portal</li>
              </ul>
            </div>
            <Button asChild variant="outline" className="mt-6 w-full rounded-xl font-semibold">
              <a href={`http://${adminHost()}/onboarding`}>Get Started Free</a>
            </Button>
          </Card>

          {/* Managed Cloud */}
          <Card className="rounded-2xl border-emerald-600/50 p-6 flex flex-col justify-between shadow-md bg-gradient-to-b from-card to-emerald-500/5 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                Popular
              </span>
            </div>
            <div className="space-y-4">
              <Badge variant="default" className="text-xs">Enterprise Mahall</Badge>
              <div>
                <span className="text-3xl font-extrabold text-foreground">₹999</span>
                <span className="text-xs text-muted-foreground"> / month</span>
              </div>
              <p className="text-xs text-muted-foreground">Comprehensive suite for active Mahalles and Juma Masjids.</p>
              <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Unlimited Members & Families</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Dues Tracking & WhatsApp Receipts</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Printable Certificates with QR Verification</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Citizen OTP Portal & Online Requests</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Staff Payroll & Cash Book Accounts</li>
              </ul>
            </div>
            <Button asChild className="mt-6 w-full rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">
              <a href={`http://${adminHost()}/onboarding`}>Start 30-Day Free Trial</a>
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold text-foreground">Ente Mahall SaaS</span>
            <span>· &copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <a href={`http://${adminHost()}/login`} className="hover:text-foreground transition-colors">
              Admin Portal
            </a>
            <a href={`http://demo.${ROOT_DOMAIN}`} className="hover:text-foreground transition-colors">
              Live Demo
            </a>
            <a href={`http://control.${ROOT_DOMAIN}`} className="hover:text-foreground transition-colors">
              Super-Admin Control Plane
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
