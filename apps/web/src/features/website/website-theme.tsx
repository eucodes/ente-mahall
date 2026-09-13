"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Check,
  RotateCcw,
  FileText,
  ImageIcon,
  ChevronLeft,
  ChevronRight
} from "@mahalle/ui";

interface WebsiteThemeProps {
  slug: string;
  tenantName: string;
}

interface ColorOption {
  id: string;
  name: string;
  colorClass: string;
  borderClass?: string;
  isLight?: boolean;
}

const PRIMARY_COLORS: ColorOption[] = [
  { id: "black", name: "Pitch Black", colorClass: "bg-zinc-950" },
  { id: "white", name: "Pure White", colorClass: "bg-white", borderClass: "border border-zinc-200", isLight: true },
  { id: "blue", name: "Ocean Blue", colorClass: "bg-blue-600" },
  { id: "red", name: "Coral Red", colorClass: "bg-rose-600" },
  { id: "emerald", name: "Mahall Emerald", colorClass: "bg-emerald-600" }
];

const SECONDARY_COLORS: ColorOption[] = [
  { id: "black", name: "Pitch Black", colorClass: "bg-zinc-950" },
  { id: "white", name: "Pure White", colorClass: "bg-white", borderClass: "border border-zinc-200", isLight: true },
  { id: "blue", name: "Ocean Blue", colorClass: "bg-blue-600" },
  { id: "red", name: "Coral Red", colorClass: "bg-rose-600" },
  { id: "emerald", name: "Mahall Emerald", colorClass: "bg-emerald-600" }
];

const ACCENT_COLORS: ColorOption[] = [
  { id: "black", name: "Pitch Black", colorClass: "bg-zinc-950" },
  { id: "white", name: "Pure White", colorClass: "bg-white", borderClass: "border border-zinc-200", isLight: true },
  { id: "blue", name: "Ocean Blue", colorClass: "bg-blue-600" },
  { id: "amber", name: "Warm Amber", colorClass: "bg-amber-500" },
  { id: "emerald", name: "Mahall Emerald", colorClass: "bg-emerald-600" }
];

const BG_COLORS: ColorOption[] = [
  { id: "black", name: "Pitch Black", colorClass: "bg-zinc-950" },
  { id: "white", name: "Pure White", colorClass: "bg-white", borderClass: "border border-zinc-200", isLight: true },
  { id: "blue", name: "Soft Blue", colorClass: "bg-blue-500" },
  { id: "red", name: "Soft Red", colorClass: "bg-rose-500" },
  { id: "emerald", name: "Soft Emerald", colorClass: "bg-emerald-500" }
];

export function WebsiteTheme({ slug, tenantName }: WebsiteThemeProps) {
  const [primaryColor, setPrimaryColor] = useState("emerald");
  const [secondaryColor, setSecondaryColor] = useState("emerald");
  const [accentColor, setAccentColor] = useState("amber");
  const [bgColor, setBgColor] = useState("white");

  const [headerLogoName, setHeaderLogoName] = useState<string | null>(null);
  const [footerLogoName, setFooterLogoName] = useState<string | null>(null);
  const [ogImageName, setOgImageName] = useState<string | null>(null);

  const resetToDefaults = () => {
    setPrimaryColor("emerald");
    setSecondaryColor("emerald");
    setAccentColor("amber");
    setBgColor("white");
  };

  const getPrimaryClass = () => {
    if (primaryColor === "black") return "bg-zinc-950 text-white";
    if (primaryColor === "white") return "bg-white text-zinc-900 border border-zinc-200";
    if (primaryColor === "blue") return "bg-blue-600 text-white";
    if (primaryColor === "red") return "bg-rose-600 text-white";
    return "bg-emerald-600 text-white";
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Theme Preview (Inspired by Image 1) */}
      <Card className="rounded-3xl border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/60 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Live Theme Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
            {/* Top Preview Floating Navbar */}
            <div className="w-full max-w-2xl rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 pl-2">
                <div className="h-6 w-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">
                  EM
                </div>
                <span className="font-extrabold text-xs tracking-tight text-foreground uppercase">
                  {tenantName || "Ente Mahall"}
                </span>
              </div>

              {/* Navigation Tabs Pill */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <span className={`px-2.5 py-1 rounded-lg font-bold text-xs shadow-2xs ${getPrimaryClass()}`}>
                  Home
                </span>
                <span className="px-2 py-1 hover:text-foreground">Schedules</span>
                <span className="px-2 py-1 hover:text-foreground">Announcements</span>
                <span className="px-2 py-1 hover:text-foreground">Committee</span>
                <span className="px-2 py-1 hover:text-foreground">Downloads</span>
                <span className="px-2 py-1 hover:text-foreground">Wall</span>
              </div>
            </div>

            {/* Hero Image / Canvas Preview Area */}
            <div className="relative mt-5 w-full max-w-3xl rounded-2xl bg-gradient-to-b from-muted/60 via-muted/40 to-muted/80 border border-border/60 min-h-[220px] flex flex-col items-center justify-center overflow-hidden">
              {/* Pagination badge top right */}
              <div className="absolute top-3 right-3 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-mono text-white/90">
                1 / 1
              </div>

              {/* Left & Right subtle arrows */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs text-foreground/80">
                <ChevronLeft className="h-4 w-4" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs text-foreground/80">
                <ChevronRight className="h-4 w-4" />
              </div>

              {/* Radial Center Placeholder */}
              <div className="relative flex items-center justify-center">
                <div className="h-28 w-28 rounded-full border border-border/40 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full border border-border/60 flex items-center justify-center bg-background/50 shadow-xs">
                    <ImageIcon className="h-7 w-7 text-muted-foreground/60" />
                  </div>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-3 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-white" />
                <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Color Palette (Matching Image 1 Structure) */}
      <Card className="rounded-3xl border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Color Palette</CardTitle>
          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to defaults</span>
          </button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Primary */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-foreground block">Primary</span>
              <div className="flex items-center gap-2 flex-wrap">
                {PRIMARY_COLORS.map((c) => {
                  const isSelected = primaryColor === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPrimaryColor(c.id)}
                      title={c.name}
                      className={`relative h-7 w-7 rounded-full transition-transform hover:scale-105 flex items-center justify-center ${c.colorClass} ${c.borderClass || ""} ${
                        isSelected ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-background" : ""
                      }`}
                    >
                      {isSelected && (
                        <Check className={`h-3.5 w-3.5 ${c.isLight ? "text-zinc-900" : "text-white"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-foreground block">Secondary</span>
              <div className="flex items-center gap-2 flex-wrap">
                {SECONDARY_COLORS.map((c) => {
                  const isSelected = secondaryColor === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSecondaryColor(c.id)}
                      title={c.name}
                      className={`relative h-7 w-7 rounded-full transition-transform hover:scale-105 flex items-center justify-center ${c.colorClass} ${c.borderClass || ""} ${
                        isSelected ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-background" : ""
                      }`}
                    >
                      {isSelected && (
                        <Check className={`h-3.5 w-3.5 ${c.isLight ? "text-zinc-900" : "text-white"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-foreground block">Accent</span>
              <div className="flex items-center gap-2 flex-wrap">
                {ACCENT_COLORS.map((c) => {
                  const isSelected = accentColor === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAccentColor(c.id)}
                      title={c.name}
                      className={`relative h-7 w-7 rounded-full transition-transform hover:scale-105 flex items-center justify-center ${c.colorClass} ${c.borderClass || ""} ${
                        isSelected ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-background" : ""
                      }`}
                    >
                      {isSelected && (
                        <Check className={`h-3.5 w-3.5 ${c.isLight ? "text-zinc-900" : "text-white"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-foreground block">Background</span>
              <div className="flex items-center gap-2 flex-wrap">
                {BG_COLORS.map((c) => {
                  const isSelected = bgColor === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setBgColor(c.id)}
                      title={c.name}
                      className={`relative h-7 w-7 rounded-full transition-transform hover:scale-105 flex items-center justify-center ${c.colorClass} ${c.borderClass || ""} ${
                        isSelected ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-background" : ""
                      }`}
                    >
                      {isSelected && (
                        <Check className={`h-3.5 w-3.5 ${c.isLight ? "text-zinc-900" : "text-white"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Branding & Media (Matching Image 1 Structure) */}
      <Card className="rounded-3xl border-border/80 shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Branding & Media</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Header logo */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">Header logo</span>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-foreground truncate">
                      {headerLogoName || "No file selected"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      Selected file
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHeaderLogoName("masjid-header-logo.png")}
                  className="rounded-xl text-xs font-semibold px-3 h-8 shrink-0"
                >
                  Choose
                </Button>
              </div>
            </div>

            {/* Footer logo */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">Footer logo</span>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-foreground truncate">
                      {footerLogoName || "No file selected"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      Selected file
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFooterLogoName("masjid-footer-logo.png")}
                  className="rounded-xl text-xs font-semibold px-3 h-8 shrink-0"
                >
                  Choose
                </Button>
              </div>
            </div>

            {/* OG Image (Social preview) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">OG Image (Social preview)</span>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-foreground truncate">
                      {ogImageName || "No file selected"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      Selected file
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOgImageName("social-og-banner.jpg")}
                  className="rounded-xl text-xs font-semibold px-3 h-8 shrink-0"
                >
                  Choose
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
