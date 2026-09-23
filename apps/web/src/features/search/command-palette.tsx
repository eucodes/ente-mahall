"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@mahalle/ui";
import {
  Search,
  Users,
  UsersRound,
  FileText,
  Wallet,
  Calendar,
  Megaphone,
  Landmark,
  ShieldCheck,
  Plus,
  Home,
  MapPin,
  HeartHandshake,
  Scale,
  Settings,
  Globe,
  CreditCard
} from "@mahalle/ui";
import { apiClient } from "@/lib/api-client";

interface SearchResults {
  members: { id: string; fullName: string; phone: string | null }[];
  families: { id: string; name: string }[];
  houses: { id: string; displayNumber: string }[];
  events: { id: string; title: string; startsAt: string }[];
}

export function CommandPalette({ slug }: { slug: string }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults>({ members: [], families: [], houses: [], events: [] });
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // Keyboard shortcut: Cmd + K or Ctrl + K
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search API fetch with debounce
  React.useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults({ members: [], families: [], houses: [], events: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      apiClient
        .get<SearchResults>(`/tenants/${slug}/search?q=${encodeURIComponent(q)}`)
        .then((res) => {
          setResults(res);
          setLoading(false);
        })
        .catch(() => {
          setResults({ members: [], families: [], houses: [], events: [] });
          setLoading(false);
        });
    }, 200);

    return () => clearTimeout(timer);
  }, [query, slug]);

  function navigate(path: string) {
    setOpen(false);
    setQuery("");
    router.push(path);
  }

  const staticNavigation = [
    { label: "Overview / Dashboard", href: `/${slug}`, icon: <Home className="h-4 w-4" /> },
    { label: "Members Directory", href: `/${slug}/members`, icon: <Users className="h-4 w-4" /> },
    { label: "Families Registry", href: `/${slug}/families`, icon: <UsersRound className="h-4 w-4" /> },
    { label: "Houses Directory", href: `/${slug}/houses`, icon: <Home className="h-4 w-4" /> },
    { label: "Education & Employment", href: `/${slug}/education-employment`, icon: <Users className="h-4 w-4" /> },
    { label: "Health & Support", href: `/${slug}/health-support`, icon: <HeartHandshake className="h-4 w-4" /> },
    { label: "Programs & Relief", href: `/${slug}/programs`, icon: <HeartHandshake className="h-4 w-4" /> },

    // Registers
    { label: "Marriage Register (Nikah)", href: `/${slug}/registers/marriage`, icon: <FileText className="h-4 w-4" /> },
    { label: "Death Register (Mayyith)", href: `/${slug}/registers/death`, icon: <FileText className="h-4 w-4" /> },
    { label: "Divorce Register (Talaq)", href: `/${slug}/registers/divorce`, icon: <FileText className="h-4 w-4" /> },
    { label: "Mahallu Release (NOC)", href: `/${slug}/registers/release`, icon: <FileText className="h-4 w-4" /> },
    { label: "Grave Register (Kabarsthan)", href: `/${slug}/registers/grave`, icon: <FileText className="h-4 w-4" /> },
    { label: "Madrassa & Dars", href: `/${slug}/registers/madrassa`, icon: <FileText className="h-4 w-4" /> },
    { label: "Waqf & Property", href: `/${slug}/registers/property`, icon: <FileText className="h-4 w-4" /> },

    // Finance
    { label: "Finance Overview", href: `/${slug}/finance`, icon: <Wallet className="h-4 w-4" /> },
    { label: "Collections", href: `/${slug}/finance/collections`, icon: <Wallet className="h-4 w-4" /> },
    { label: "Payments", href: `/${slug}/finance/payments`, icon: <Wallet className="h-4 w-4" /> },
    { label: "Finance Reports", href: `/${slug}/finance/reports`, icon: <Wallet className="h-4 w-4" /> },

    // Accountant
    { label: "Accountant Overview", href: `/${slug}/accountant`, icon: <Scale className="h-4 w-4" /> },
    { label: "Manual Journals", href: `/${slug}/accountant/manual-journals`, icon: <Scale className="h-4 w-4" /> },
    { label: "Bulk Update", href: `/${slug}/accountant/bulk-update`, icon: <Scale className="h-4 w-4" /> },
    { label: "Chart of Accounts", href: `/${slug}/accountant/chart-of-accounts`, icon: <Scale className="h-4 w-4" /> },
    { label: "Reports Center", href: `/${slug}/accountant/reports`, icon: <Scale className="h-4 w-4" /> },
    { label: "General Ledger", href: `/${slug}/accountant/ledger`, icon: <Scale className="h-4 w-4" /> },
    { label: "Cash Book", href: `/${slug}/accountant/cash-book`, icon: <Scale className="h-4 w-4" /> },
    { label: "Bank Book", href: `/${slug}/accountant/bank-book`, icon: <Scale className="h-4 w-4" /> },
    { label: "Trial Balance", href: `/${slug}/accountant/trial-balance`, icon: <Scale className="h-4 w-4" /> },
    { label: "Receipt & Payment", href: `/${slug}/accountant/receipt-payment`, icon: <Scale className="h-4 w-4" /> },
    { label: "Income & Expenditure", href: `/${slug}/accountant/income-expenditure`, icon: <Scale className="h-4 w-4" /> },
    { label: "Balance Sheet", href: `/${slug}/accountant/balance-sheet`, icon: <Scale className="h-4 w-4" /> },
    { label: "Financial Year", href: `/${slug}/accountant/financial-year`, icon: <Scale className="h-4 w-4" /> },
    { label: "Taxes & Legal Filings", href: `/${slug}/accountant/taxes-legal`, icon: <Scale className="h-4 w-4" /> },

    // Committee & Community
    { label: "Committee Office Bearers", href: `/${slug}/committee`, icon: <Landmark className="h-4 w-4" /> },
    { label: "Committee & Meetings", href: `/${slug}/committee/meetings`, icon: <Landmark className="h-4 w-4" /> },
    { label: "Service Requests", href: `/${slug}/services`, icon: <HeartHandshake className="h-4 w-4" /> },
    { label: "Events & Notices", href: `/${slug}/events`, icon: <Calendar className="h-4 w-4" /> },
    { label: "Announcements", href: `/${slug}/announcements`, icon: <Megaphone className="h-4 w-4" /> },
    { label: "Activity Stream", href: `/${slug}/settings/activity`, icon: <FileText className="h-4 w-4" /> },

    // Reports
    { label: "Reports Hub", href: `/${slug}/reports`, icon: <FileText className="h-4 w-4" /> },
    { label: "Blood Directory", href: `/${slug}/reports/blood-groups`, icon: <Users className="h-4 w-4" /> },
    { label: "Pravasi / Expatriate", href: `/${slug}/reports/expatriate`, icon: <Users className="h-4 w-4" /> },
    { label: "Yatheem & Widows", href: `/${slug}/reports/yatheem`, icon: <Users className="h-4 w-4" /> },

    // Access, Platform & Settings
    { label: "Access & Roles", href: `/${slug}/settings/admins`, icon: <ShieldCheck className="h-4 w-4" /> },
    { label: "Public Website", href: `/${slug}/website`, icon: <Globe className="h-4 w-4" /> },
    { label: "Billing & Plans", href: `/${slug}/billing`, icon: <CreditCard className="h-4 w-4" /> },
    { label: "Settings", href: `/${slug}/settings`, icon: <Settings className="h-4 w-4" /> }
  ];

  const filteredNav = query
    ? staticNavigation.filter((n) => n.label.toLowerCase().includes(query.toLowerCase()))
    : staticNavigation.slice(0, 5);

  const hasLiveResults =
    results.members.length > 0 ||
    results.families.length > 0 ||
    results.houses.length > 0 ||
    results.events.length > 0;

  return (
    <>
      {/* Trigger Button inside Topbar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex h-9 w-36 sm:w-52 md:w-64 shrink-0 items-center justify-between rounded-xl border border-border/80 bg-muted/40 px-3 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-muted/70 hover:text-foreground"
      >
        <span className="flex items-center gap-2 truncate">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
          <span className="truncate">Search or jump to...</span>
        </span>
        <kbd className="pointer-events-none hidden rounded bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border sm:inline-block shadow-2xs shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden rounded-2xl shadow-2xl">
          <div className="flex items-center border-b border-border/80 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members, families, registers, or jump to page..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {loading && (
              <span className="text-xs text-muted-foreground animate-pulse mr-2">Searching...</span>
            )}
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div className="max-h-96 overflow-y-auto p-2 scrollbar-thin">
            {/* Live Member Results */}
            {results.members.length > 0 && (
              <div className="mb-3">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Members
                </p>
                {results.members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => navigate(`/${slug}/members`)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-muted text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span className="font-semibold text-foreground">{m.fullName}</span>
                    </div>
                    {m.phone && <span className="text-[11px] text-muted-foreground">{m.phone}</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Live Family Results */}
            {results.families.length > 0 && (
              <div className="mb-3">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Families
                </p>
                {results.families.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => navigate(`/${slug}/families`)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs hover:bg-muted text-left transition-colors"
                  >
                    <UsersRound className="h-3.5 w-3.5 text-sky-600" />
                    <span className="font-semibold text-foreground">{f.name}</span>
                    <span className="text-[11px] text-muted-foreground">Family</span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Navigation Links */}
            <div>
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {query ? "Matching Pages" : "Quick Jump"}
              </p>
              {filteredNav.map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs hover:bg-muted text-left transition-colors text-muted-foreground hover:text-foreground"
                >
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span className="font-medium text-foreground">{item.label}</span>
                </button>
              ))}
            </div>

            {!hasLiveResults && query.length >= 2 && !loading && filteredNav.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/80 bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
            <span>Navigation shortcut</span>
            <div className="flex items-center gap-2">
              <span>Press <kbd className="rounded bg-card px-1 border border-border text-[10px]">Enter</kbd> to select</span>
              <span><kbd className="rounded bg-card px-1 border border-border text-[10px]">ESC</kbd> to dismiss</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
