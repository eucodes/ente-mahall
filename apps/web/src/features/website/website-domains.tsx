"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Globe,
  RefreshCw,
  Plus,
  Pencil,
  Copy,
  Check
} from "@mahalle/ui";

interface WebsiteDomainsProps {
  slug: string;
  tenantName: string;
}

interface DomainItem {
  id: string;
  domain: string;
  subdomainPrefix?: string;
  type: "subdomain" | "custom";
  status: "ACTIVE" | "PENDING";
  subtitle: string;
}

export function WebsiteDomains({ slug, tenantName }: WebsiteDomainsProps) {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [domains, setDomains] = useState<DomainItem[]>([
    {
      id: "default-subdomain",
      domain: `${slug}.eucodes.tech`,
      subdomainPrefix: slug,
      type: "subdomain",
      status: "ACTIVE",
      subtitle: "Mahalle subdomain"
    }
  ]);

  // Modal states
  const [editSubdomainModalOpen, setEditSubdomainModalOpen] = useState(false);
  const [subdomainInput, setSubdomainInput] = useState(slug);

  const [addCustomModalOpen, setAddCustomModalOpen] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // 1. Open Subdomain Edit Modal
  const handleOpenEditSubdomain = (item: DomainItem) => {
    setSubdomainInput(item.subdomainPrefix || currentSlug);
    setEditSubdomainModalOpen(true);
  };

  // 2. Save Subdomain
  const handleSaveSubdomain = () => {
    const trimmed = subdomainInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!trimmed) return;

    setCurrentSlug(trimmed);
    setDomains((prev) =>
      prev.map((d) =>
        d.type === "subdomain"
          ? {
            ...d,
            domain: `${trimmed}.eucodes.tech`,
            subdomainPrefix: trimmed
          }
          : d
      )
    );
    setEditSubdomainModalOpen(false);
  };

  // 3. Save Custom Domain
  const handleAddCustomDomain = () => {
    const trimmed = customDomainInput.trim().toLowerCase();
    if (!trimmed) return;

    setDomains((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        domain: trimmed,
        type: "custom",
        status: "ACTIVE",
        subtitle: "Custom domain"
      }
    ]);
    setCustomDomainInput("");
    setAddCustomModalOpen(false);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Globe className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Domains
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-3.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setAddCustomModalOpen(true)}
            className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-4"
          >
            <Plus className="h-4 w-4" />
            <span>Add Domain</span>
          </Button>
        </div>
      </div>

      {/* Main Domains Container Card */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
        <CardContent className="p-0 divide-y divide-border/60">
          {domains.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-muted/20 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-sm text-foreground font-mono">{item.domain}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (item.type === "subdomain") {
                      handleOpenEditSubdomain(item);
                    } else {
                      setAddCustomModalOpen(true);
                    }
                  }}
                  className="rounded-xl text-xs font-semibold gap-1.5 h-8 px-3.5"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit</span>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 1. Subdomain Edit Modal (Matching User Image 2: "Subdomain" [input][.eucodes.tech]) */}
      <Dialog open={editSubdomainModalOpen} onOpenChange={setEditSubdomainModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Subdomain
            </DialogTitle>
          </DialogHeader>

          <div className="py-3 space-y-3">
            {/* Input with fixed .eucodes.tech addon */}
            <div className="flex items-center rounded-xl border border-border/80 bg-background overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
              <input
                type="text"
                value={subdomainInput}
                onChange={(e) => setSubdomainInput(e.target.value)}
                placeholder="subdomain"
                className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden font-mono"
              />
              <span className="bg-muted/50 border-l border-border/70 px-3.5 py-2.5 text-sm text-muted-foreground font-mono select-none">
                .eucodes.tech
              </span>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditSubdomainModalOpen(false)}
              className="rounded-xl text-xs font-semibold h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={!subdomainInput.trim()}
              onClick={handleSaveSubdomain}
              className="rounded-xl text-xs font-semibold h-9 px-5"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Connect Custom Domain Modal (Opened by "+ Add Domain" button) */}
      <Dialog open={addCustomModalOpen} onOpenChange={setAddCustomModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Connect Custom Domain
            </DialogTitle>
          </DialogHeader>

          <div className="py-3 space-y-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Domain Name
              </label>
              <input
                type="text"
                placeholder="e.g. www.kambalakkadmosque.com"
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2 text-xs">
              <span className="font-bold text-foreground block">DNS Setup (CNAME Record)</span>
              <div className="flex items-center justify-between bg-card p-2 rounded-xl border border-border/50">
                <span className="text-muted-foreground font-mono text-xs">Target: cname.eucodes.tech</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("cname.eucodes.tech", "cname")}
                  className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                  title="Copy"
                >
                  {copiedKey === "cname" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-muted-foreground leading-relaxed text-xs">
                Add this CNAME record in your registrar DNS control panel. SSL certificate will activate automatically upon propagation.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddCustomModalOpen(false)}
              className="rounded-xl text-xs font-semibold h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={!customDomainInput.trim()}
              onClick={handleAddCustomDomain}
              className="rounded-xl text-xs font-semibold h-9 px-5"
            >
              Save Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
