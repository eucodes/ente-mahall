"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Search } from "@mahalle/ui";
import { apiClient } from "@/lib/api-client";

interface SearchResults {
  members: { id: string; fullName: string; phone: string | null }[];
  families: { id: string; name: string }[];
  houses: { id: string; displayNumber: string }[];
  events: { id: string; title: string; startsAt: string }[];
}

const EMPTY: SearchResults = { members: [], families: [], houses: [], events: [] };

export function TopbarSearch({ slug }: { slug: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(EMPTY);
      return;
    }
    const timeout = setTimeout(() => {
      apiClient
        .get<SearchResults>(`/tenants/${slug}/search?q=${encodeURIComponent(q)}`)
        .then((data) => setResults(data))
        .catch(() => setResults(EMPTY));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query, slug]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = results.members.length + results.families.length + results.houses.length + results.events.length > 0;

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <Input
        leadingIcon={<Search />}
        placeholder="Search members, families…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && query.trim().length >= 2 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {!hasResults ? (
            <p className="p-3 text-sm text-muted-foreground">No matches.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1 text-sm">
              {results.members.map((m) => (
                <button key={m.id} className="block w-full px-3 py-2 text-left hover:bg-muted" onClick={() => go(`/${slug}/members`)}>
                  <span className="font-medium">{m.fullName}</span>
                  {m.phone && <span className="ml-2 text-xs text-muted-foreground">{m.phone}</span>}
                </button>
              ))}
              {results.families.map((f) => (
                <button key={f.id} className="block w-full px-3 py-2 text-left hover:bg-muted" onClick={() => go(`/${slug}/families`)}>
                  {f.name} <span className="text-xs text-muted-foreground">Family</span>
                </button>
              ))}
              {results.houses.map((h) => (
                <button key={h.id} className="block w-full px-3 py-2 text-left hover:bg-muted" onClick={() => go(`/${slug}/families`)}>
                  House {h.displayNumber}
                </button>
              ))}
              {results.events.map((e) => (
                <button key={e.id} className="block w-full px-3 py-2 text-left hover:bg-muted" onClick={() => go(`/${slug}/events/${e.id}`)}>
                  {e.title} <span className="text-xs text-muted-foreground">Event</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
