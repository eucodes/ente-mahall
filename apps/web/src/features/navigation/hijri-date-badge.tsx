"use client";

import * as React from "react";
import { Calendar } from "@mahalle/ui";

export function HijriDateBadge() {
  const [dateStr, setDateStr] = React.useState<string>("");
  const [hijriStr, setHijriStr] = React.useState<string>("");

  React.useEffect(() => {
    const today = new Date();

    // Gregorian format (e.g., 12 Sep 2026)
    const greg = today.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    setDateStr(greg);

    // Hijri calculation via Intl.DateTimeFormat (Islamic civil or ummalqura calendar)
    try {
      const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      setHijriStr(hijriFormatter.format(today));
    } catch {
      // Fallback
      setHijriStr("Hijri 1448 AH");
    }
  }, []);

  if (!dateStr) return null;

  return (
    <div className="hidden lg:flex items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
      <Calendar className="h-3.5 w-3.5 text-primary" />
      <span className="font-semibold text-foreground">{hijriStr}</span>
      <span className="text-muted-foreground/60">·</span>
      <span>{dateStr}</span>
    </div>
  );
}
