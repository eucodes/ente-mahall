"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  Input,
  Layers,
  MapPin,
  Phone,
  Plus,
  Search,
  Settings,
  UsersRound,
  User,
  Home,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  School,
  Building,
  Droplet
} from "@mahalle/ui";
import type { Division, Structure } from "@/lib/structure";
import type { Family } from "@/lib/business-resources";
import type { House } from "@/lib/houses";
import type { Member } from "@/lib/members";
import { AddFamilyDialog } from "./add-family-dialog";
import { AssignFamilyDialog } from "./assign-family-dialog";

export interface DivisionDetailViewProps {
  slug: string;
  division: Division;
  structure: Structure;
  families: Family[];
  houses: House[];
  members?: Member[];
}

const BLOOD_GROUP_LABELS: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-"
};

const RELATION_TO_HEAD_LABELS: Record<string, string> = {
  HEAD: "Head",
  SPOUSE: "Spouse",
  SON: "Son",
  DAUGHTER: "Daughter",
  PARENT: "Parent",
  SIBLING: "Sibling",
  OTHER: "Other"
};

function calculateAge(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const diff = Date.now() - birth.getTime();
  const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  return age >= 0 ? age : null;
}

export function DivisionDetailView({
  slug,
  division,
  structure,
  families,
  houses,
  members = []
}: DivisionDetailViewProps) {
  const router = useRouter();
  const [activeRosterTab, setActiveRosterTab] = useState<"families" | "members">("families");
  const [searchQuery, setSearchQuery] = useState("");
  const [addFamilyOpen, setAddFamilyOpen] = useState(false);
  const [assignFamilyOpen, setAssignFamilyOpen] = useState(false);

  const term = structure.divisionTerm || "Division";

  const filteredFamilies = families.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      (f.familyNumber && f.familyNumber.toLowerCase().includes(q)) ||
      (f.house?.displayNumber && f.house.displayNumber.toLowerCase().includes(q)) ||
      (f.phone && f.phone.includes(q)) ||
      (f.address && f.address.toLowerCase().includes(q))
    );
  });

  const filteredMembers = members.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) ||
      (m.occupation && m.occupation.toLowerCase().includes(q)) ||
      (m.phone && m.phone.includes(q)) ||
      (m.family?.name && m.family.name.toLowerCase().includes(q)) ||
      (m.bloodGroup && m.bloodGroup.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href={`/${slug}/divisions`}
            className="hover:text-foreground flex items-center gap-1 font-medium transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>{term}s</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground truncate max-w-[220px]">{division.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/${slug}/settings/structure`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Manage Structure</span>
            </Button>
          </Link>

          {/* Add Family Dropdown: Option to Add New or Select Existing */}
          <DropdownMenu
            align="right"
            trigger={
              <Button size="sm" className="gap-1.5 text-xs shadow-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Family to this {term}</span>
                <ChevronDown className="h-3 w-3 ml-0.5 opacity-80" />
              </Button>
            }
            items={[
              {
                label: "Register New Family",
                icon: <Plus className="h-4 w-4 text-primary" />,
                onClick: () => setAddFamilyOpen(true)
              },
              {
                label: "Select Existing Family",
                icon: <UsersRound className="h-4 w-4 text-primary" />,
                onClick: () => setAssignFamilyOpen(true)
              }
            ]}
          />
        </div>
      </div>

      {/* Hero Division Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <Layers className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{division.name}</h1>
                {division.code && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                    {division.code}
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    division.isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {division.isActive ? "Active Sector" : "Inactive"}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-1.5 max-w-2xl">
                {division.description || `Designated ${term.toLowerCase()} jurisdiction within the Mahallu registry.`}
              </p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-border">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
              #{division.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-[11px] text-muted-foreground">{term} Jurisdiction Area</span>
          </div>
        </div>

        {/* Metric Bar: Families, Members, Houses, Cadastral */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Families
            </span>
            <span className="text-xl font-bold text-foreground mt-0.5">{families.length}</span>
            <span className="text-[11px] text-muted-foreground">Registered households</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Members
            </span>
            <span className="text-xl font-bold text-foreground mt-0.5">{members.length}</span>
            <span className="text-[11px] text-muted-foreground">Residents in {division.name}</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Registered Dwellings
            </span>
            <span className="text-xl font-bold text-primary mt-0.5">{houses.length}</span>
            <span className="text-[11px] text-muted-foreground">Physical structures</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Cadastral Status
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              Active Jurisdiction
            </span>
            <span className="text-[11px] text-muted-foreground">Sector #{division.order + 1}</span>
          </div>
        </div>
      </div>

      {/* Main Roster Card: Families & Members Tabs */}
      <Card className="shadow-xs">
        <CardHeader className="p-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveRosterTab("families")}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeRosterTab === "families"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <UsersRound className="h-3.5 w-3.5" />
              <span>Families ({families.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRosterTab("members")}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeRosterTab === "members"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Members ({members.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={
                activeRosterTab === "families"
                  ? "Search family name, house..."
                  : "Search member, occupation, phone..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-muted/30"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* TAB 1: FAMILIES */}
          {activeRosterTab === "families" && (
            <div>
              {families.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-2.5">
                  <UsersRound className="h-10 w-10 text-muted-foreground opacity-30" />
                  <p className="font-semibold text-foreground">No families in this {term.toLowerCase()} yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Register a new household directly into this {term.toLowerCase()}, or select an existing family to assign to this area.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => setAddFamilyOpen(true)}
                      className="text-xs gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Register New Family</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAssignFamilyOpen(true)}
                      className="text-xs gap-1.5"
                    >
                      <UsersRound className="h-3.5 w-3.5" />
                      <span>Select Existing Family</span>
                    </Button>
                  </div>
                </div>
              ) : filteredFamilies.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No families match your search &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredFamilies.map((family) => (
                    <div
                      key={family.id}
                      className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {family.name[0]?.toUpperCase() ?? "F"}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/${slug}/families/${family.id}`}
                              className="font-bold text-foreground hover:text-primary transition-colors text-sm truncate"
                            >
                              {family.name}
                            </Link>
                            {family.familyNumber && (
                              <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                                {family.familyNumber}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                            {family.house ? (
                              <span className="flex items-center gap-1 text-primary font-medium">
                                <Home className="h-3 w-3" />
                                House #{family.house.displayNumber}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                General Jurisdiction
                              </span>
                            )}
                            {family.address && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[280px]">{family.address}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                        {family.phone && (
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${family.phone}`}
                              className="font-mono text-xs text-foreground hover:text-primary transition-colors"
                            >
                              {family.phone}
                            </a>
                            <a
                              href={`https://wa.me/${family.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-primary hover:bg-primary/10 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        )}

                        <Link href={`/${slug}/families/${family.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary hover:text-primary">
                            <span>Open Record</span>
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEMBERS */}
          {activeRosterTab === "members" && (
            <div>
              {members.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-2.5">
                  <User className="h-10 w-10 text-muted-foreground opacity-30" />
                  <p className="font-semibold text-foreground">No members found in this {term.toLowerCase()}</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Members will automatically show here when families are added or assigned to {division.name}.
                  </p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No members match your search &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredMembers.map((member) => {
                    const memberAge = calculateAge(member.dateOfBirth);
                    const isStudent =
                      (member.occupation && member.occupation.toLowerCase().includes("student")) ||
                      (member.movementNotes && member.movementNotes.toLowerCase().includes("[student]"));

                    return (
                      <div
                        key={member.id}
                        className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <Avatar name={member.fullName} size="md" />

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/${slug}/members/${member.id}`}
                                className="font-bold text-foreground hover:text-primary transition-colors text-sm truncate"
                              >
                                {member.fullName}
                              </Link>
                              {member.relationToHead && (
                                <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-muted text-foreground border border-border">
                                  {RELATION_TO_HEAD_LABELS[member.relationToHead] ?? member.relationToHead}
                                </span>
                              )}
                              {member.bloodGroup && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded">
                                  <Droplet className="h-2.5 w-2.5" />
                                  {BLOOD_GROUP_LABELS[member.bloodGroup] ?? member.bloodGroup}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                              {member.family && (
                                <Link
                                  href={`/${slug}/families/${member.family.id}`}
                                  className="text-primary hover:underline font-medium"
                                >
                                  {member.family.name}
                                </Link>
                              )}
                              {memberAge !== null && (
                                <>
                                  <span>•</span>
                                  <span>{memberAge} yrs</span>
                                </>
                              )}
                              {member.occupation && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-foreground">
                                    {isStudent ? (
                                      <>
                                        <School className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                                          {member.occupation.replace(/^student\s*(•|:|-)?\s*/i, "") || "Student"}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <Building className="h-3 w-3 text-muted-foreground" />
                                        <span>{member.occupation}</span>
                                      </>
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                          {member.phone && (
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${member.phone}`}
                                className="font-mono text-xs text-foreground hover:text-primary transition-colors"
                              >
                                {member.phone}
                              </a>
                              <a
                                href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded text-primary hover:bg-primary/10 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          )}

                          <Link href={`/${slug}/members/${member.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary hover:text-primary">
                              <span>Open Record</span>
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Family Dialog pre-populated with this division */}
      <AddFamilyDialog
        slug={slug}
        open={addFamilyOpen}
        onOpenChange={setAddFamilyOpen}
        houses={houses}
        defaultDivisionId={division.id}
      />

      {/* Assign Existing Family Dialog */}
      <AssignFamilyDialog
        slug={slug}
        open={assignFamilyOpen}
        onOpenChange={setAssignFamilyOpen}
        division={division}
        term={term}
        divisionCode={division.code ?? undefined}
      />
    </div>
  );
}
