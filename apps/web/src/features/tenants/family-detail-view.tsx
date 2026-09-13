"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBreadcrumb } from "@/features/navigation/admin-shell";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Droplet,
  HeartHandshake,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Plane,
  Plus,
  Printer,
  ShieldCheck,
  User,
  Users,
  UsersRound,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  GitFork,
  ExternalLink,
  School,
  useToast
} from "@mahalle/ui";
import { BLOOD_GROUP_LABELS, RELATION_TO_HEAD_LABELS } from "@/lib/member-constants";
import type { Family } from "@/lib/business-resources";
import type { Member } from "@/lib/members";
import type { House } from "@/lib/houses";
import { FamilyFormDialog } from "./family-form-dialog";
import { MemberFormDialog } from "./member-form-dialog";

export interface FamilyDetailViewProps {
  slug: string;
  family: Family;
  members: Member[];
  houses: House[];
  allFamilies: Family[];
}

function calculateAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const diff = Date.now() - birth.getTime();
  const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  return age >= 0 ? age : null;
}

function maskId(idNumber: string | null, isRevealed: boolean): string {
  if (!idNumber) return "—";
  if (isRevealed) return idNumber;
  if (idNumber.length <= 4) return idNumber;
  return `${idNumber.slice(0, 4)}••••••${idNumber.slice(-2)}`;
}

export function FamilyDetailView({ slug, family, members, houses, allFamilies }: FamilyDetailViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showIdMap, setShowIdMap] = useState<Record<string, boolean>>({});
  const [editFamilyOpen, setEditFamilyOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const { setDetailTitle } = useBreadcrumb();

  useEffect(() => {
    setDetailTitle(`${family.name} Household`);
    return () => setDetailTitle(null);
  }, [family.name, setDetailTitle]);

  const headMember = members.find((m) => m.relationToHead === "HEAD") ?? members[0];
  const spouseMember = members.find((m) => m.relationToHead === "SPOUSE");
  const childrenAndDependents = members.filter(
    (m) => m.id !== headMember?.id && m.id !== spouseMember?.id
  );

  const adultsCount = members.filter((m) => {
    const age = calculateAge(m.dateOfBirth);
    return age === null || age >= 18;
  }).length;
  const minorsCount = members.length - adultsCount;

  const hasYatheem = members.some((m) => m.isYatheem);
  const expatriatesCount = members.filter((m) => m.isExpatriate).length;

  const toggleRevealId = (memberId: string) => {
    setShowIdMap((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  return (
    <div className="space-y-5">
      {/* Top Page Header with Back Navigation (Matching Reference Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/${slug}/families`)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs group"
            title="Back to Families Registry"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Family Profile
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({
                title: "Registry Certificate",
                description: `Official Mahalle Family Certificate generated for ${family.name} Household.`
              })
            }
            className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 border-border/80 text-foreground"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Print Certificate</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditFamilyOpen(true)}
            className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 border-border/80 text-foreground"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Edit Family</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setAddMemberOpen(true)}
            className="rounded-xl text-xs font-bold h-9 px-3.5 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {/* Hero Household Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md flex-shrink-0">
              <UsersRound className="h-7 w-7" />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{family.name} Household</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Household
                </span>
                {hasYatheem && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-500/20">
                    <HeartHandshake className="h-3 w-3" />
                    Welfare Support Enrolled
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {family.address ?? "No address recorded on file"}
                </span>
                {family.house && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-primary">House #{family.house.displayNumber}</span>
                  </>
                )}
                <span>•</span>
                <span>Head: {headMember?.fullName ?? "Unassigned"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-border">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
              #FAM-{family.familyNumber ?? family.id.slice(0, 6).toUpperCase()}
            </span>
            <span className="text-[11px] text-muted-foreground">Mahallu Household Registry</span>
          </div>
        </div>

        {/* Quick Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Residents</span>
            <span className="text-lg font-bold text-foreground mt-0.5">{members.length}</span>
            <span className="text-[11px] text-muted-foreground">{adultsCount} Adults, {minorsCount} Minors</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">House Allocation</span>
            <span className="text-lg font-bold text-primary mt-0.5">
              {family.house ? `House ${family.house.displayNumber}` : "Unallocated"}
            </span>
            <span className="text-[11px] text-muted-foreground">{family.house ? "Registered Dwelling" : "General Jurisdiction"}</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Primary Contact</span>
            <span className="text-sm font-bold font-mono text-foreground mt-1 truncate">
              {family.phone || headMember?.phone || "No phone"}
            </span>
            <span className="text-[11px] text-muted-foreground">Direct Telemetry</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Welfare Status</span>
            <span className="text-sm font-bold text-foreground mt-1">
              {hasYatheem ? "Yatheem Support" : expatriatesCount > 0 ? `${expatriatesCount} NRI Member${expatriatesCount > 1 ? "s" : ""}` : "Regular Resident"}
            </span>
            <span className="text-[11px] text-muted-foreground">Active Classification</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Members Roster, Tree, Financials, and Household Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Members Roster & Genealogy Tree */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Family Members Roster Card */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Family Members ({members.length})</span>
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddMemberOpen(true)}
                className="gap-1 h-8 text-xs"
              >
                <Plus className="h-3 w-3" />
                <span>Add Member</span>
              </Button>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center gap-2">
                  <Users className="h-8 w-8 text-muted-foreground opacity-40" />
                  <p className="font-semibold text-foreground">No members registered in this family yet</p>
                  <p className="text-xs text-muted-foreground">Click &quot;Add Member&quot; to link the first family resident.</p>
                  <Button size="sm" onClick={() => setAddMemberOpen(true)} className="mt-2 text-xs">
                    Add Family Member
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {members.map((member) => {
                    const memberAge = calculateAge(member.dateOfBirth);
                    const isRevealed = !!showIdMap[member.id];
                    const isStudent =
                      (member.occupation && member.occupation.toLowerCase().includes("student")) ||
                      (member.movementNotes && member.movementNotes.toLowerCase().includes("[student]"));
                    return (
                      <div
                        key={member.id}
                        className="p-4 rounded-xl border border-border/80 bg-muted/30 hover:bg-muted/60 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <Avatar name={member.fullName} size="md" />
                              <div className="flex flex-col min-w-0">
                                <Link
                                  href={`/${slug}/members/${member.id}`}
                                  className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate"
                                >
                                  {member.fullName}
                                </Link>
                                <span className="text-xs text-muted-foreground">
                                  {member.relationToHead
                                    ? (RELATION_TO_HEAD_LABELS[member.relationToHead] ?? member.relationToHead)
                                    : "Member"}{" "}
                                  {memberAge !== null ? `• ${memberAge} yrs` : ""}
                                </span>
                              </div>
                            </div>

                            <span className="px-2 py-0.5 rounded-full bg-muted text-foreground text-[10px] font-semibold border border-border flex-shrink-0">
                              {member.relationToHead === "HEAD" ? "Head" : "Resident"}
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-border/60 flex flex-col gap-1 text-xs text-muted-foreground">
                            <div className="flex items-center justify-between">
                              {isStudent ? (
                                <>
                                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                    <School className="h-3 w-3" />
                                    <span>Education:</span>
                                  </span>
                                  <span className="text-foreground font-medium truncate max-w-[170px]" title={member.occupation ?? "Student"}>
                                    {member.occupation?.replace(/^student\s*(•|:|-)?\s*/i, "") || "Student"}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span>Occupation:</span>
                                  <span className="text-foreground font-medium truncate max-w-[170px]" title={member.occupation ?? "—"}>
                                    {member.occupation ?? "—"}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <span>Contact:</span>
                              <span className="text-foreground font-mono">{member.phone ?? "—"}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span>National ID:</span>
                              <div className="flex items-center gap-1 font-mono text-foreground">
                                <span>{maskId(member.idNumber, isRevealed)}</span>
                                {member.idNumber && (
                                  <button
                                    type="button"
                                    onClick={() => toggleRevealId(member.id)}
                                    className="p-0.5 hover:text-primary text-muted-foreground transition-colors"
                                    title={isRevealed ? "Hide ID" : "Reveal ID"}
                                  >
                                    {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {member.isYatheem && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
                                Yatheem
                              </span>
                            )}
                            {member.isExpatriate && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                                NRI
                              </span>
                            )}
                            {member.bloodGroup && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-semibold">
                                {BLOOD_GROUP_LABELS[member.bloodGroup]}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/${slug}/members/${member.id}`}
                            className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5"
                          >
                            <span>Full Profile</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Household Genealogy & Relationship Tree Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GitFork className="h-4 w-4 text-primary" />
                <span>Household Genealogy & Dependency Tree</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center w-full py-2">
                {/* Generation 1: Head & Spouse */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full z-10">
                  {/* Head Node */}
                  {headMember ? (
                    <div className="w-full md:w-72 p-4 rounded-xl bg-card border-2 border-primary shadow-sm hover:shadow-md transition-all">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                        Head of Household
                      </div>
                      <div className="flex items-start gap-3">
                        <Avatar name={headMember.fullName} size="md" className="ring-2 ring-primary/20" />
                        <div className="flex flex-col min-w-0">
                          <Link href={`/${slug}/members/${headMember.id}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate">
                            {headMember.fullName}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {calculateAge(headMember.dateOfBirth) !== null ? `${calculateAge(headMember.dateOfBirth)} yrs • ` : ""}
                            {headMember.occupation ?? "Head"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between text-xs">
                        <span className="font-mono text-muted-foreground">{headMember.phone ?? "—"}</span>
                        <Link href={`/${slug}/members/${headMember.id}`} className="text-primary hover:underline font-semibold text-xs">
                          Profile →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                      No head designated
                    </div>
                  )}

                  {/* Spouse Node */}
                  {spouseMember && (
                    <div className="w-full md:w-72 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Spouse / Co-Head
                      </div>
                      <div className="flex items-start gap-3">
                        <Avatar name={spouseMember.fullName} size="md" className="ring-1 ring-border" />
                        <div className="flex flex-col min-w-0">
                          <Link href={`/${slug}/members/${spouseMember.id}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate">
                            {spouseMember.fullName}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {calculateAge(spouseMember.dateOfBirth) !== null ? `${calculateAge(spouseMember.dateOfBirth)} yrs • ` : ""}
                            {spouseMember.occupation ?? "Spouse"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between text-xs">
                        <span className="font-mono text-muted-foreground">{spouseMember.phone ?? "—"}</span>
                        <Link href={`/${slug}/members/${spouseMember.id}`} className="text-primary hover:underline font-semibold text-xs">
                          Profile →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Branch Stem */}
                {childrenAndDependents.length > 0 && (
                  <div className="relative w-full flex flex-col items-center my-3">
                    <div className="w-0.5 h-6 bg-primary/40" />
                    <div className="w-3/4 max-w-lg h-0.5 bg-primary/40 relative">
                      <div className="absolute left-0 top-0 w-0.5 h-4 bg-primary/40" />
                      <div className="absolute right-0 top-0 w-0.5 h-4 bg-primary/40" />
                    </div>
                  </div>
                )}

                {/* Generation 2: Dependents */}
                {childrenAndDependents.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-2 z-10">
                    {childrenAndDependents.map((child) => {
                      const childAge = calculateAge(child.dateOfBirth);
                      return (
                        <div
                          key={child.id}
                          className="p-3.5 rounded-xl bg-card border border-border shadow-xs hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <Avatar name={child.fullName} size="sm" />
                              <div className="flex flex-col min-w-0">
                                <Link href={`/${slug}/members/${child.id}`} className="text-xs font-bold text-foreground hover:text-primary transition-colors truncate">
                                  {child.fullName}
                                </Link>
                                <span className="text-[11px] text-muted-foreground">
                                  {child.relationToHead ? (RELATION_TO_HEAD_LABELS[child.relationToHead] ?? child.relationToHead) : "Dependent"}{" "}
                                  {childAge !== null ? `(${childAge} yrs)` : ""}
                                </span>
                              </div>
                            </div>
                            <Link href={`/${slug}/members/${child.id}`} className="text-primary hover:underline text-xs font-semibold">
                              View →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Family Contributions, Donations & Dues Section Placeholder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Family Contributions, Donations & Varisa Dues</span>
                <Badge variant="outline" className="text-xs font-normal">Financial Ledger</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <div className="p-6 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center gap-2">
                <p className="font-semibold text-foreground">Household Financials & Donation Records</p>
                <p className="max-w-md text-muted-foreground">
                  Monthly Varisa, mosque maintenance fees, festival collections, and donation receipts for this household are maintained in the Treasury module.
                </p>
                <Link
                  href={`/${slug}/finance/dues`}
                  className="mt-2 text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Reconcile Household Dues</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Household Info, Notes & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Household Contact & Location Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <span>Household Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                <span className="text-muted-foreground">Assigned House</span>
                <span className="font-semibold text-primary">
                  {family.house ? `House #${family.house.displayNumber}` : "Not assigned"}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                <span className="text-muted-foreground">Household Head</span>
                <span className="font-semibold text-foreground">{headMember?.fullName ?? "Unassigned"}</span>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                <span className="text-muted-foreground">Contact Phone</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground font-medium">
                    {family.phone || headMember?.phone || "—"}
                  </span>
                  {(family.phone || headMember?.phone) && (
                    <a
                      href={`https://wa.me/${(family.phone || headMember?.phone || "").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                      title="Chat on WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 flex flex-col gap-1">
                <span className="text-muted-foreground">Full Physical Address</span>
                <span className="text-foreground font-medium">
                  {family.address ?? "No address recorded on file"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Mahallu Administrative Notes Card */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Mahallu Notes & Records</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditFamilyOpen(true)}
                className="h-7 px-2 text-xs font-semibold gap-1"
              >
                <Pencil className="h-3 w-3" />
                <span>{family.notes ? "Edit Note" : "Add Note"}</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border text-xs text-foreground min-h-[90px] flex flex-col justify-between">
                {family.notes ? (
                  <p className="italic text-foreground">&ldquo;{family.notes}&rdquo;</p>
                ) : (
                  <p className="text-muted-foreground italic">No administrative notes recorded for this household yet.</p>
                )}
                <div className="text-[11px] text-muted-foreground pt-2 flex items-center justify-between border-t border-border/50 mt-2">
                  <span>Mahallu Committee Record</span>
                  <span className="font-mono text-[10px]">#MH-{family.id.slice(0, 6).toUpperCase()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Family Dialog */}
      <FamilyFormDialog
        slug={slug}
        open={editFamilyOpen}
        onOpenChange={setEditFamilyOpen}
        editingFamily={family}
        houses={houses}
        members={members}
      />

      {/* Add Member Dialog */}
      <MemberFormDialog
        slug={slug}
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        editingMember={null}
        families={allFamilies}
      />
    </div>
  );
}
