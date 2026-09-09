"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

export function FindMahallForm() {
  const [slug, setSlug] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) return;
    const protocol = window.location.protocol;
    window.location.href = `${protocol}//${slug.trim().toLowerCase()}.${ROOT_DOMAIN}`;
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm gap-2">
      <Input
        placeholder="your-mahall"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        aria-label="Mahall subdomain"
      />
      <Button type="submit">Go to sign in</Button>
    </form>
  );
}
