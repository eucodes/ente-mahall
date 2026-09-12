"use client";

import { useState } from "react";
import { Button, Card, CardContent, Check } from "@mahalle/ui";
import { ROOT_DOMAIN } from "@/lib/env";

export interface CompleteStepProps {
  slug: string;
  onGoToDashboard: () => void;
}

export function CompleteStep({ slug, onGoToDashboard }: CompleteStepProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${slug}.${ROOT_DOMAIN}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`http://${publicUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied by the browser — the URL is already visible on screen either way.
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">Your Mahallu is ready! 🎉</h2>
          <p className="text-sm text-muted-foreground">Your Mahallu workspace has been successfully created.</p>
        </div>
        <div className="w-full space-y-2 rounded-md bg-muted px-4 py-3 text-sm">
          <p className="font-medium">{publicUrl}</p>
          <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy URL"}
          </button>
        </div>
        <Button size="lg" className="w-full" onClick={onGoToDashboard}>
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
