import type { ReactNode } from "react";
import { cn, Sparkles, CheckCircle2 } from "@mahalle/ui";

export interface AuthShellProps {
  panelTitle: ReactNode;
  panelDescription: ReactNode;
  panelBadge?: ReactNode;
  accent?: "primary" | "destructive";
  children: ReactNode;
}
 
export function AuthShell({ panelTitle, panelDescription, panelBadge, accent = "primary", children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-muted/20">
      {/* Left Visual Brand Panel */}
      <div
        className={cn(
          "relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex",
          accent === "destructive"
            ? "bg-gradient-to-br from-rose-950 via-slate-900 to-red-950"
            : "bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_60%)]"
        />

        {/* Brand Header */}
        <div className="relative flex items-center gap-3 text-sm font-bold tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-emerald-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-base leading-none">Ente Mahall</span>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Islamic Civic Tech OS</span>
          </div>
        </div>

        {/* Central Content */}
        <div className="relative max-w-md space-y-5">
          {panelBadge}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {panelTitle}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {panelDescription}
          </p>

          <div className="space-y-2 pt-4 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Full Member Census & Family Registry</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Certified Marriage, Death & Release Records</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Varisa Dues Tracking with WhatsApp Receipts</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Ente Mahall SaaS &middot; Built for Mosques & Communities
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2 lg:hidden mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Ente Mahall</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
