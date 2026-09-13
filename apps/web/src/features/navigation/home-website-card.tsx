"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Globe,
  ExternalLink,
  Check
} from "@mahalle/ui";

export function HomeWebsiteCard({
  slug,
  publicUrl
}: {
  slug: string;
  publicUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Mahall Public Website</h3>
              <p className="text-xs text-muted-foreground">Community portal & prayer times</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 font-bold text-xs gap-1.5 px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </Badge>
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-muted/40 p-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Public Website URL
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-foreground truncate select-all">
            {publicUrl}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-border/60">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCopy}
          className="rounded-xl text-xs font-semibold h-9 px-3"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <span>Copy Link</span>
          )}
        </Button>

        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5"
          >
            <span>View Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </a>

        <Link href={`/${slug}/website`}>
          <Button
            size="sm"
            className="rounded-xl text-xs font-semibold h-9 px-3 bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Customize
          </Button>
        </Link>
      </div>
    </Card>
  );
}
