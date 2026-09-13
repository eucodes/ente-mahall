"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Layers,
  MapPin,
  Plus,
  Settings,
  UsersRound,
  Home,
  ChevronRight,
  Search
} from "@mahalle/ui";
import type { Structure, Division, StructureSummary } from "@/lib/structure";
import type { Family } from "@/lib/business-resources";
import type { House } from "@/lib/houses";
import { AddFamilyDialog } from "./add-family-dialog";

export interface DivisionsRegistryProps {
  slug: string;
  structure: Structure;
  divisions: Division[];
  families: Family[];
  houses: House[];
  summary: StructureSummary | null;
}

export function DivisionsRegistry({
  slug,
  structure,
  divisions,
  families,
  houses,
  summary
}: DivisionsRegistryProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [addFamilyOpen, setAddFamilyOpen] = useState(false);
  const [selectedDivisionForFamily, setSelectedDivisionForFamily] = useState<string | undefined>(undefined);

  const term = structure.divisionTerm || "Division";

  // Calculate stats per division
  const divisionStats = divisions.map((div) => {
    const divFamilies = families.filter((f) => {
      if (f.house?.divisionId === div.id) return true;
      if (f.notes?.toLowerCase().includes(`ward: ${div.name.toLowerCase()}`)) return true;
      if (f.notes?.toLowerCase().includes(`division: ${div.name.toLowerCase()}`)) return true;
      return false;
    });

    const divHouses = houses.filter((h) => h.divisionId === div.id);

    return {
      division: div,
      familyCount: divFamilies.length,
      houseCount: divHouses.length
    };
  });

  const totalAssignedFamilies = divisionStats.reduce((sum, d) => sum + d.familyCount, 0);
  const unassignedFamiliesCount = Math.max(0, families.length - totalAssignedFamilies);

  const filtered = divisionStats.filter(({ division }) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      division.name.toLowerCase().includes(q) ||
      (division.code && division.code.toLowerCase().includes(q)) ||
      (division.description && division.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {term}s 
            </h1>
            <Badge variant="secondary" className="font-semibold text-xs">
              {divisions.length} {term}s
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Geographical zones, residential sectors, and administrative divisions across the Mahallu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/${slug}/settings/structure`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Manage Structure</span>
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={() => {
              setSelectedDivisionForFamily(undefined);
              setAddFamilyOpen(true);
            }}
            className="gap-1.5 text-xs shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Family</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total {term}s
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold text-foreground">{divisions.length}</span>
              <Layers className="h-5 w-5 text-primary opacity-80" />
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Active administrative sectors
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Households in {term}s
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold text-foreground">{totalAssignedFamilies}</span>
              <UsersRound className="h-5 w-5 text-emerald-600 dark:text-emerald-400 opacity-80" />
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Assigned family households
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Physical Dwellings
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold text-foreground">
                {summary ? summary.totalHouses : houses.length}
              </span>
              <Home className="h-5 w-5 text-blue-600 dark:text-blue-400 opacity-80" />
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Registered building dwellings
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Unassigned Units
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold text-foreground">{unassignedFamiliesCount}</span>
              <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400 opacity-80" />
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              General / Central jurisdiction
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border bg-card shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={`Search ${term.toLowerCase()}s by name, code...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-muted/30"
          />
        </div>
        <span className="text-xs text-muted-foreground pr-2 font-medium">
          Showing {filtered.length} of {divisions.length} {term.toLowerCase()}s
        </span>
      </div>

      {/* Divisions Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-border text-center flex flex-col items-center justify-center gap-2.5 bg-card">
          <Layers className="h-8 w-8 text-muted-foreground opacity-40" />
          <p className="font-semibold text-foreground">No {term.toLowerCase()}s found</p>
          <p className="text-xs text-muted-foreground max-w-sm">
            {searchQuery
              ? `No ${term.toLowerCase()} matched "${searchQuery}". Try a different search.`
              : `You have not added any ${term.toLowerCase()}s yet. Define your Mahallu wards in structure settings.`}
          </p>
          <Link href={`/${slug}/settings/structure`} className="mt-2">
            <Button size="sm" variant="outline" className="text-xs">
              Configure {term}s in Settings
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ division, familyCount, houseCount }) => (
            <div
              key={division.id}
              onClick={() => router.push(`/${slug}/divisions/${division.id}`)}
              className="p-5 rounded-2xl border border-border bg-card shadow-xs hover:shadow-md hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                        {division.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {division.code && (
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground border border-border">
                            {division.code}
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          Order #{division.order + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      division.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {division.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {division.description && (
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                    {division.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-foreground font-semibold">
                    <UsersRound className="h-3.5 w-3.5 text-primary" />
                    <span>{familyCount}</span>
                    <span className="text-muted-foreground font-normal">Families</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-foreground font-semibold">
                    <Home className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{houseCount}</span>
                    <span className="text-muted-foreground font-normal">Houses</span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-primary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  <span>View Families</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Family Dialog with pre-selected division if triggered */}
      <AddFamilyDialog
        slug={slug}
        open={addFamilyOpen}
        onOpenChange={setAddFamilyOpen}
        houses={houses}
        defaultDivisionId={selectedDivisionForFamily}
      />
    </div>
  );
}
