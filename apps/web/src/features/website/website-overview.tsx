"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Globe,
  Lock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Calendar,
  Users,
  Menu,
  MoreHorizontal,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  CheckCircle2
} from "@mahalle/ui";

interface WebsiteOverviewProps {
  slug: string;
  tenantName: string;
  masjidName?: string | null;
}

export function WebsiteOverview({ slug, tenantName, masjidName }: WebsiteOverviewProps) {
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [sitePassword, setSitePassword] = useState("");
  const [savedPassword, setSavedPassword] = useState(false);

  const publicUrl = `https://${slug}.eucodes.tech`;
  const displayName = masjidName || tenantName || "Ente Mahall";

  const handleSavePassword = () => {
    setSavedPassword(true);
    setTimeout(() => {
      setPasswordModalOpen(false);
      setSavedPassword(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Main Overview Frame (Matching Reference Image) */}
      <Card className="rounded-3xl border-border/80 shadow-xs overflow-hidden bg-card">
        <CardContent className="p-6 space-y-6">
          {/* 1. Top Previews: Desktop Canvas & Mobile Canvas Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Desktop Preview (8 Cols on large screens) */}
            <div className="lg:col-span-8 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-6 flex flex-col justify-between min-h-[340px] relative overflow-hidden">
              {/* Floating Navbar Preview */}
              <div className="w-full rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-md flex items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2 pl-2">
                  <div className="h-6 w-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">
                    EM
                  </div>
                  <span className="font-extrabold text-xs tracking-tight text-foreground uppercase truncate max-w-[140px]">
                    {displayName}
                  </span>
                </div>

                {/* Navbar Pills */}
                <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-2xs">
                    Home
                  </span>
                  <span className="px-2 py-1 hover:text-foreground hidden sm:inline">Schedules</span>
                  <span className="px-2 py-1 hover:text-foreground hidden sm:inline">Announcements</span>
                  <span className="px-2 py-1 text-muted-foreground/80">... More</span>
                </div>
              </div>

              {/* Center Canvas with Radial Guidelines & Image Placeholder */}
              <div className="relative my-4 flex-1 rounded-xl bg-gradient-to-b from-muted/60 via-muted/30 to-muted/70 border border-border/50 flex flex-col items-center justify-center min-h-[200px] overflow-hidden">
                {/* Pagination Badge top-right */}
                <div className="absolute top-2.5 right-2.5 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-mono text-white/90 z-10">
                  1 / 1
                </div>

                {/* Left & Right Subtle Navigation Arrows */}
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/25 backdrop-blur-xs text-foreground/80">
                  <ChevronLeft className="h-4 w-4" />
                </div>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/25 backdrop-blur-xs text-foreground/80">
                  <ChevronRight className="h-4 w-4" />
                </div>

                {/* Radial Image Placeholder Circle */}
                <div className="relative flex items-center justify-center">
                  <div className="h-28 w-28 rounded-full border border-border/40 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full border border-border/60 flex items-center justify-center bg-background/50 shadow-xs">
                      <ImageIcon className="h-7 w-7 text-muted-foreground/60" />
                    </div>
                  </div>
                </div>

                {/* Bottom Pagination Dot */}
                <div className="absolute bottom-2.5 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            </div>

            {/* Mobile Preview (4 Cols on large screens) */}
            <div className="lg:col-span-4 rounded-2xl border border-border/70 bg-muted/20 p-4 flex flex-col justify-between min-h-[340px] relative overflow-hidden">
              {/* Mobile Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-md bg-emerald-600 flex items-center justify-center text-white text-[9px] font-black">
                    EM
                  </div>
                  <span className="font-extrabold text-[11px] tracking-tight text-foreground uppercase truncate max-w-[120px]">
                    {displayName}
                  </span>
                </div>
                <Menu className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Mobile Hero Canvas */}
              <div className="relative my-3 flex-1 rounded-xl bg-gradient-to-b from-muted/60 via-muted/30 to-muted/70 border border-border/50 flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
                {/* Center circle */}
                <div className="h-16 w-16 rounded-full border border-border/40 flex items-center justify-center">
                  <div className="h-11 w-11 rounded-full border border-border/60 flex items-center justify-center bg-background/50 shadow-xs">
                    <ImageIcon className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                </div>
                {/* Bottom dot */}
                <div className="absolute bottom-2 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Mobile Bottom Circular Widget Icons */}
              <div className="flex items-center justify-center gap-8 pt-2 pb-1 border-t border-border/50">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground font-mono">5</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-xs">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground font-mono">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Middle Row: Password Protected Toggle & Edit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">
                Password protected
              </span>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${isPasswordProtected ? "bg-emerald-600" : "bg-muted"
                  }`}
                role="switch"
                aria-checked={isPasswordProtected}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isPasswordProtected ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setPasswordModalOpen(true)}
              className="rounded-xl text-xs font-semibold h-8 px-3.5 self-start sm:self-auto"
            >
              Edit password
            </Button>
          </div>

          {/* 3. Bottom Row: Active Theme, Domain, View Website, Launch & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Theme 1</span>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  Current theme
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <Globe className="h-3.5 w-3.5" />
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-foreground"
                >
                  {slug}.eucodes.tech
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="md"
                  variant="outline"
                  className="rounded-xl text-xs font-semibold h-9 px-4"
                >
                  View website
                </Button>
              </a>

              <Link href={`/${slug}/website/theme`}>
                <Button
                  size="md"
                  variant="primary"
                  className="rounded-xl text-xs font-semibold h-9 px-4"
                >
                  Launch
                </Button>
              </Link>

              <Button
                size="md"
                variant="outline"
                className="rounded-xl h-9 w-9 p-0 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Password Modal */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Configure Website Access Password
            </DialogTitle>
          </DialogHeader>

          <div className="py-3 space-y-3 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              When password protection is enabled, visitors will be prompted to enter this passcode before accessing your public portal.
            </p>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Access Password</label>
              <input
                type="password"
                placeholder="Enter new site passcode"
                value={sitePassword}
                onChange={(e) => setSitePassword(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {savedPassword && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Password updated successfully!</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
            <Button
              size="md"
              variant="outline"
              onClick={() => setPasswordModalOpen(false)}
              className="rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={handleSavePassword}
              className="rounded-xl text-xs font-semibold"
            >
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
