import type { ReactNode } from "react";
import { cn, Sparkles } from "@mahalle/ui";

export interface AuthShellProps {
  panelTitle: ReactNode;
  panelDescription: ReactNode;
  panelBadge?: ReactNode;
  accent?: "primary" | "destructive";
  children: ReactNode;
}

export function AuthShell({ panelTitle, panelDescription, panelBadge, accent = "primary", children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div
        className={cn(
          "relative hidden flex-col justify-between overflow-hidden px-12 py-12 text-primary-foreground lg:flex",
          accent === "destructive" ? "bg-destructive" : "bg-primary"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgb(255_255_255_/_0.16),transparent_55%)]"
        />
        <div className="relative flex items-center gap-2 text-sm font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15">
            <Sparkles className="h-4 w-4" />
          </div>
          Mahalle
        </div>
        <div className="relative max-w-md space-y-4">
          {panelBadge}
          <h2 className="text-3xl font-semibold tracking-tight text-balance">{panelTitle}</h2>
          <p className="text-sm text-primary-foreground/80">{panelDescription}</p>
        </div>
        <p className="relative text-xs text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Mahalle &middot; multi-tenant Mahalle management platform
        </p>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Mahalle</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
