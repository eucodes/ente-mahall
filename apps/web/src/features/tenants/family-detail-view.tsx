"use client";

import { useState, useEffect, useCallback } from "react";
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
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  DropdownMenu,
  ExternalLink,
  CreditCard,
  UserPlus,
  UserCheck,
  RefreshCw,
  useToast
} from "@mahalle/ui";
import { BLOOD_GROUP_LABELS, RELATION_TO_HEAD_LABELS } from "@/lib/member-constants";
import type { Family } from "@/lib/business-resources";
import type { Member } from "@/lib/members";
import type { House } from "@/lib/houses";
import { FamilyFormDialog } from "./family-form-dialog";
import { MemberFormDialog } from "./member-form-dialog";
import { AddExistingMemberDialog } from "./add-existing-member-dialog";
import { apiClient } from "@/lib/api-client";

interface PaymentRecord {
  id: string;
  receiptNumber?: string | null;
  date: string;
  amount: string | number;
  paymentMethod?: string | null;
  description?: string | null;
  category?: { name: string } | null;
}

function PaymentHistoryCard({ slug, familyId }: { slug: string; familyId: string }) {
  const [data, setData] = useState<{ totalPaid: string; outstandingAmount: string; collections: PaymentRecord[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ totalPaid: string; outstandingAmount: string; collections: PaymentRecord[] }>(
        `/tenants/${slug}/finance/collections/family/${familyId}`
      );
      setData(res ?? null);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [slug, familyId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const records = data?.collections ?? [];

  return (
    <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
      <CardHeader className="border-b border-border/60 px-6 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span>Payment History</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchRecords}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          title="Refresh"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      {data && (
        <div className="grid grid-cols-2 gap-3 px-6 py-3 border-b border-border/60 bg-muted/20">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Paid</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{Number(data.totalPaid).toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Outstanding Dues</p>
            <p className={`text-sm font-bold ${Number(data.outstandingAmount) > 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
              ₹{Number(data.outstandingAmount).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}
      <CardContent className="p-0">
        {loading && !data ? (
          <p className="px-6 py-4 text-xs text-muted-foreground">Loading payment history...</p>
        ) : records.length === 0 ? (
          <p className="px-6 py-4 text-xs text-muted-foreground italic">No collections recorded for this household yet.</p>
        ) : (
          <div className="divide-y divide-border/60">
            {records.map((rec) => (
              <div key={rec.id} className="flex items-center justify-between px-6 py-3 gap-4 hover:bg-muted/20 transition-colors">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {rec.category?.name || "Collection"}
                    {rec.description && (
                      <span className="font-normal text-muted-foreground ml-1">— {rec.description}</span>
                    )}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {rec.receiptNumber ? `#${rec.receiptNumber}` : rec.id.slice(0, 8).toUpperCase()}
                    {" · "}
                    {new Date(rec.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    {rec.paymentMethod && ` · ${rec.paymentMethod}`}
                  </span>
                </div>
                <span className="shrink-0 font-bold text-sm text-foreground">
                  ₹{Number(rec.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export interface FamilyDetailViewProps {
  slug: string;
  family: Family;
  members: Member[];
  houses: House[];
  allFamilies: Family[];
  hasFamilyStatuses?: boolean;
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

export function FamilyDetailView({ slug, family, members, houses, allFamilies, hasFamilyStatuses = false }: FamilyDetailViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showIdMap, setShowIdMap] = useState<Record<string, boolean>>({});
  const [editFamilyOpen, setEditFamilyOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addExistingMemberOpen, setAddExistingMemberOpen] = useState(false);
  const { setDetailTitle } = useBreadcrumb();

  useEffect(() => {
    setDetailTitle(`${family.name} Household`);
    return () => setDetailTitle(null);
  }, [family.name, setDetailTitle]);

  const linkedHouse = houses.find((h) => h.id === family.houseId) || (family.house ? houses.find((h) => h.id === family.house?.id) : null);
  const divisionName = linkedHouse?.division?.name;
  const divisionCode = linkedHouse?.division?.code;

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
    <div className="space-y-6 max-w-6xl">
      {/* 1. Header with Back Navigation & Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/${slug}/families`)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs group"
            title="Back to Families"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Family Profile
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({
                title: "Registry Certificate",
                description: `Family Certificate generated for ${family.name} Household.`
              })
            }
            className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 border-border/80"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Print</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditFamilyOpen(true)}
            className="rounded-xl text-xs font-semibold h-9 px-3.5 gap-1.5 border-border/80"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Edit Family</span>
          </Button>

          <DropdownMenu
            align="right"
            trigger={
              <Button
                size="sm"
                variant="primary"
                className="rounded-xl text-xs font-semibold h-9 px-3.5 gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Member</span>
                <ChevronDown className="h-3 w-3 opacity-70 ml-0.5" />
              </Button>
            }
            items={[
              {
                label: "Add New Member",
                icon: <UserPlus className="h-3.5 w-3.5 text-emerald-600" />,
                onClick: () => setAddMemberOpen(true),
              },
              {
                label: "Add Existing Member",
                icon: <UserCheck className="h-3.5 w-3.5 text-sky-600" />,
                onClick: () => setAddExistingMemberOpen(true),
              },
            ]}
          />
        </div>
      </div>

      {/* 2. Hero Household Card - Clean & Minimal */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground">
                    {family.name} Household
                  </h2>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {members.length} {members.length === 1 ? "Resident" : "Residents"} ({adultsCount} Adults, {minorsCount} Minors)
                  </span>
                  {hasYatheem && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                      <HeartHandshake className="h-3 w-3" />
                      Yatheem Support
                    </span>
                  )}
                  {expatriatesCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                      <Plane className="h-3 w-3" />
                      {expatriatesCount} NRI Member{expatriatesCount > 1 ? "s" : ""}
                    </span>
                  )}
                  {family.requiresCommunitySupport && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      Community Aid ({family.supportStatus || "Active"})
                    </span>
                  )}
                  {hasFamilyStatuses && family.familyStatus && (
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: family.familyStatus.color ? `${family.familyStatus.color}20` : undefined,
                        color: family.familyStatus.color ?? undefined,
                        border: family.familyStatus.color ? `1px solid ${family.familyStatus.color}50` : "1px solid var(--border)"
                      }}
                    >
                      {family.familyStatus.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  {headMember && <span>Head: {headMember.fullName}</span>}
                  {family.house && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-foreground">House #{family.house.displayNumber}</span>
                    </>
                  )}
                  {divisionName && (
                    <>
                      <span>•</span>
                      <span>Ward: {divisionName} {divisionCode ? `(${divisionCode})` : ""}</span>
                    </>
                  )}
                  {(family.phone || headMember?.phone) && (
                    <>
                      <span>•</span>
                      <span className="font-mono">{family.phone || headMember?.phone}</span>
                    </>
                  )}
                  {family.address && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-[240px] sm:max-w-md">{family.address}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-muted-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              #FAM-{family.familyNumber ?? family.id.slice(0, 6).toUpperCase()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Main Grid: 8 Cols (Members Roster & Structure) + 4 Cols (Household Details & Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Roster & Household Hierarchy */}
        <div className="lg:col-span-8 space-y-6">
          {/* Members Roster Card */}
          <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/60 px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Family Members ({members.length})</span>
              </CardTitle>
              <DropdownMenu
                align="right"
                trigger={
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs font-semibold h-8 px-3 gap-1 cursor-pointer border-border/80"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Member</span>
                    <ChevronDown className="h-2.5 w-2.5 opacity-60 ml-0.5" />
                  </Button>
                }
                items={[
                  {
                    label: "Add New Member",
                    icon: <UserPlus className="h-3.5 w-3.5 text-emerald-600" />,
                    onClick: () => setAddMemberOpen(true),
                  },
                  {
                    label: "Add Existing Member",
                    icon: <UserCheck className="h-3.5 w-3.5 text-sky-600" />,
                    onClick: () => setAddExistingMemberOpen(true),
                  },
                ]}
              />
            </CardHeader>
            <CardContent className="p-0">
              {members.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground space-y-3">
                  <p>No members registered in this family yet.</p>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setAddMemberOpen(true)}
                      className="rounded-xl text-xs font-semibold h-8 px-3 gap-1.5"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Add New Member</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAddExistingMemberOpen(true)}
                      className="rounded-xl text-xs font-semibold h-8 px-3 gap-1.5 border-border/80"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Add Existing Member</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {members.map((m) => {
                    const memberAge = calculateAge(m.dateOfBirth);
                    const isRevealed = !!showIdMap[m.id];

                    return (
                      <div
                        key={m.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          <Avatar name={m.fullName} size="md" />
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                href={`/${slug}/members/${m.id}`}
                                className="font-semibold text-sm text-foreground hover:underline truncate"
                              >
                                {m.fullName}
                              </Link>
                              <span className="rounded-full bg-muted px-2 py-0.2 text-[11px] font-medium text-foreground">
                                {m.relationToHead
                                  ? (RELATION_TO_HEAD_LABELS[m.relationToHead] ?? m.relationToHead)
                                  : "Member"}
                              </span>
                              {m.bloodGroup && (
                                <span className="text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-0.5">
                                  <Droplet className="h-3 w-3" />
                                  {BLOOD_GROUP_LABELS[m.bloodGroup]}
                                </span>
                              )}
                              {m.isExpatriate && (
                                <span className="text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-0.5">
                                  <Plane className="h-3 w-3" />
                                  NRI
                                </span>
                              )}
                              {m.isYatheem && (
                                <span className="text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-0.5">
                                  <HeartHandshake className="h-3 w-3" />
                                  Yatheem
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                              {memberAge !== null && <span>{memberAge} yrs</span>}
                              {m.gender && (
                                <>
                                  <span>•</span>
                                  <span>{m.gender[0] + m.gender.slice(1).toLowerCase()}</span>
                                </>
                              )}
                              {m.occupation && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[160px]">{m.occupation}</span>
                                </>
                              )}
                              {m.phone && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono">{m.phone}</span>
                                </>
                              )}
                              {m.idNumber && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono inline-flex items-center gap-1">
                                    ID: {maskId(m.idNumber, isRevealed)}
                                    <button
                                      type="button"
                                      onClick={() => toggleRevealId(m.id)}
                                      className="p-0.5 text-muted-foreground hover:text-foreground"
                                      title={isRevealed ? "Hide ID" : "Show ID"}
                                    >
                                      {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                    </button>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {m.phone && (
                            <a
                              href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl text-muted-foreground hover:text-emerald-600 hover:bg-muted/40 transition-colors"
                              title="WhatsApp"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </a>
                          )}
                          <Link
                            href={`/${slug}/members/${m.id}`}
                            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                            title="View Profile"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Household Hierarchy / Structure */}
          <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/60 px-6 py-4">
              <CardTitle className="text-sm font-bold text-foreground">
                Household Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Head Card */}
                {headMember ? (
                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                      Head of Family
                    </span>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/${slug}/members/${headMember.id}`}
                        className="font-bold text-sm text-foreground hover:underline"
                      >
                        {headMember.fullName}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {calculateAge(headMember.dateOfBirth) !== null ? `${calculateAge(headMember.dateOfBirth)} yrs` : ""}
                      </span>
                    </div>
                    {headMember.occupation && (
                      <p className="text-xs text-muted-foreground truncate">{headMember.occupation}</p>
                    )}
                    {headMember.phone && (
                      <p className="text-xs font-mono text-muted-foreground">{headMember.phone}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-dashed border-border/70 text-xs text-muted-foreground flex items-center justify-center">
                    No Head of Family designated
                  </div>
                )}

                {/* Spouse Card */}
                {spouseMember ? (
                  <div className="p-4 rounded-2xl border border-border/70 bg-card space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                      Spouse / Co-Head
                    </span>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/${slug}/members/${spouseMember.id}`}
                        className="font-bold text-sm text-foreground hover:underline"
                      >
                        {spouseMember.fullName}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {calculateAge(spouseMember.dateOfBirth) !== null ? `${calculateAge(spouseMember.dateOfBirth)} yrs` : ""}
                      </span>
                    </div>
                    {spouseMember.occupation && (
                      <p className="text-xs text-muted-foreground truncate">{spouseMember.occupation}</p>
                    )}
                    {spouseMember.phone && (
                      <p className="text-xs font-mono text-muted-foreground">{spouseMember.phone}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-dashed border-border/70 text-xs text-muted-foreground flex items-center justify-center">
                    No spouse recorded on file
                  </div>
                )}
              </div>

              {/* Children & Dependents */}
              {childrenAndDependents.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground block">
                    Children & Dependents ({childrenAndDependents.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {childrenAndDependents.map((child) => (
                      <Link
                        key={child.id}
                        href={`/${slug}/members/${child.id}`}
                        className="p-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-foreground truncate block">{child.fullName}</span>
                          <span className="text-muted-foreground text-[11px]">
                            {child.relationToHead ? (RELATION_TO_HEAD_LABELS[child.relationToHead] ?? child.relationToHead) : "Dependent"}
                            {calculateAge(child.dateOfBirth) !== null ? ` • ${calculateAge(child.dateOfBirth)} yrs` : ""}
                          </span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Household Info, Notes & Treasury */}
        <div className="lg:col-span-4 space-y-6">
          {/* Household Details Card */}
          <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/60 px-6 py-4">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span>Household Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-sm">
              <div>
                <span className="block text-xs text-muted-foreground">Assigned House</span>
                <span className="font-semibold text-foreground">
                  {family.house ? `House #${family.house.displayNumber}` : "Not assigned"}
                </span>
              </div>

              {divisionName && (
                <div>
                  <span className="block text-xs text-muted-foreground">Ward / Sub-division</span>
                  <span className="font-medium text-foreground">
                    {divisionName} {divisionCode ? `(${divisionCode})` : ""}
                  </span>
                </div>
              )}

              <div>
                <span className="block text-xs text-muted-foreground">Household Head</span>
                <span className="font-semibold text-foreground">
                  {headMember?.fullName ?? "Unassigned"}
                </span>
              </div>

              <div>
                <span className="block text-xs text-muted-foreground">Primary Contact</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-foreground">
                    {family.phone || headMember?.phone || "—"}
                  </span>
                  {(family.phone || headMember?.phone) && (
                    <a
                      href={`https://wa.me/${(family.phone || headMember?.phone || "").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity"
                      title="WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {family.address && (
                <div>
                  <span className="block text-xs text-muted-foreground">Physical Address</span>
                  <span className="font-medium text-foreground leading-snug">
                    {family.address}
                  </span>
                </div>
              )}

              {family.requiresCommunitySupport && (
                <div className="pt-2 border-t border-border/60">
                  <span className="block text-xs text-muted-foreground">Community Support Status</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {family.supportStatus || "Active"} {family.supportCategory ? `· ${family.supportCategory}` : ""}
                  </span>
                  {family.supportNotes && (
                    <p className="text-xs text-muted-foreground mt-0.5">{family.supportNotes}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History Card */}
          <PaymentHistoryCard slug={slug} familyId={family.id} />
          <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/60 px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground">Administrative Notes</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditFamilyOpen(true)}
                className="h-7 px-2 text-xs font-semibold gap-1"
              >
                <Pencil className="h-3 w-3" />
                <span>{family.notes ? "Edit" : "Add"}</span>
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {family.notes ? (
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{family.notes}&rdquo;
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic">No notes recorded for this household.</p>
              )}
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

      {/* Add New Member Dialog */}
      <MemberFormDialog
        slug={slug}
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        editingMember={null}
        families={allFamilies}
        defaultFamilyId={family.id}
      />

      {/* Add Existing Member Dialog */}
      <AddExistingMemberDialog
        slug={slug}
        family={family}
        open={addExistingMemberOpen}
        onOpenChange={setAddExistingMemberOpen}
        currentMemberIds={members.map((m) => m.id)}
      />
    </div>
  );
}
