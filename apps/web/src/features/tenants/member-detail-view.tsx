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
  CreditCard,
  Droplet,
  HeartHandshake,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Plane,
  RefreshCw,
  ShieldCheck,
  User,
  Users,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  School,
  Briefcase,
  GraduationCap,
  Heart,
  Activity,
  ExternalLink
} from "@mahalle/ui";
import {
  BLOOD_GROUP_LABELS,
  MOVEMENT_STATUS_LABELS,
  RELATION_TO_HEAD_LABELS
} from "@/lib/member-constants";
import type { Member } from "@/lib/members";
import type { Family } from "@/lib/business-resources";
import { MemberFormDialog } from "./member-form-dialog";
import { apiClient } from "@/lib/api-client";

export interface MemberDetailViewProps {
  slug: string;
  member: Member;
  familyMembers: Member[];
  families: Family[];
}

function calculateAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const diff = Date.now() - birth.getTime();
  const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  return age >= 0 ? age : null;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function maskId(idNumber: string | null, isRevealed: boolean): string {
  if (!idNumber) return "—";
  if (isRevealed) return idNumber;
  if (idNumber.length <= 4) return idNumber;
  return `${idNumber.slice(0, 4)}••••••${idNumber.slice(-2)}`;
}

interface MemberPaymentRecord {
  id: string;
  receiptNumber?: string | null;
  date: string;
  amount: string | number;
  paymentMethod?: string | null;
  description?: string | null;
  category?: { name: string } | null;
}

function MemberPaymentHistoryCard({ slug, memberId }: { slug: string; memberId: string }) {
  const [records, setRecords] = useState<MemberPaymentRecord[]>([]);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ collections: MemberPaymentRecord[]; total: number }>(
        `/tenants/${slug}/finance/collections?memberId=${memberId}&page=1&pageSize=20`
      );
      const cols = res?.collections ?? [];
      setRecords(cols);
      setTotalPaid(cols.reduce((sum, c) => sum + Number(c.amount), 0));
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, [slug, memberId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
      <CardHeader className="border-b border-border/60 px-6 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span>Contribution History</span>
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
      {loaded && totalPaid > 0 && (
        <div className="px-6 py-3 border-b border-border/60 bg-muted/20">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Contributed</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{totalPaid.toLocaleString("en-IN")}</p>
        </div>
      )}
      <CardContent className="p-0">
        {loading && !loaded ? (
          <p className="px-6 py-4 text-xs text-muted-foreground">Loading contribution history...</p>
        ) : records.length === 0 ? (
          <p className="px-6 py-4 text-xs text-muted-foreground italic">No contributions recorded for this member yet.</p>
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

export function MemberDetailView({ slug, member, familyMembers, families }: MemberDetailViewProps) {
  const router = useRouter();
  const [showId, setShowId] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { setDetailTitle } = useBreadcrumb();

  useEffect(() => {
    setDetailTitle(member.fullName);
    return () => setDetailTitle(null);
  }, [member.fullName, setDetailTitle]);

  const age = calculateAge(member.dateOfBirth);
  const otherFamilyMembers = familyMembers.filter((m) => m.id !== member.id);
  const linkedFamily = families.find((f) => f.id === member.familyId);
  const familyName = linkedFamily?.name || member.family?.name;
  const familyId = linkedFamily?.id || member.family?.id;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* 1. Header with Back Navigation & Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/${slug}/members`)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs group"
            title="Back to Members"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Member Profile
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {member.phone && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`https://wa.me/${member.phone?.replace(/[^0-9]/g, "")}`, "_blank")}
              className="rounded-xl text-xs font-semibold h-9 px-3.5 gap-1.5 border-border/80"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="primary"
            onClick={() => setFormOpen(true)}
            className="rounded-xl text-xs font-semibold h-9 px-4 gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit Member</span>
          </Button>
        </div>
      </div>

      {/* 2. Hero Profile Card - Minimal & Clean */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <Avatar name={member.fullName} size="lg" className="ring-2 ring-border/60" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground">
                    {member.fullName}
                  </h2>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {member.relationToHead
                      ? (RELATION_TO_HEAD_LABELS[member.relationToHead] ?? member.relationToHead)
                      : "Member"}
                  </span>
                  <Badge variant={member.movementStatus === "RESIDENT" ? "secondary" : "outline"} className="text-xs">
                    {MOVEMENT_STATUS_LABELS[member.movementStatus] ?? member.movementStatus}
                  </Badge>
                  {member.bloodGroup && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <Droplet className="h-3 w-3" />
                      {BLOOD_GROUP_LABELS[member.bloodGroup]}
                    </span>
                  )}
                  {member.isExpatriate && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <Plane className="h-3 w-3" />
                      NRI ({member.expatriateCountry || "Abroad"})
                    </span>
                  )}
                  {member.isYatheem && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                      <HeartHandshake className="h-3 w-3" />
                      Yatheem
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  {age !== null && <span>{age} years old</span>}
                  {familyName && familyId && (
                    <>
                      <span>•</span>
                      <Link
                        href={`/${slug}/families/${familyId}`}
                        className="text-foreground hover:underline font-medium flex items-center gap-1"
                      >
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{familyName} Household</span>
                      </Link>
                    </>
                  )}
                  {linkedFamily?.house && (
                    <>
                      <span>•</span>
                      <span>House #{linkedFamily.house.displayNumber}</span>
                    </>
                  )}
                  {member.phone && (
                    <>
                      <span>•</span>
                      <span className="font-mono">{member.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-muted-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              #MEM-{member.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Main Grid: 8 Cols (Details & Education/Work) + 4 Cols (Household & Welfare) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Personal & Demographics */}
          <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/60 px-6 py-4">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Personal & Demographics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="block text-xs text-muted-foreground">Full Name</span>
                  <span className="font-medium text-foreground">{member.fullName}</span>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">Gender</span>
                  <span className="font-medium text-foreground">
                    {member.gender ? `${member.gender[0]}${member.gender.slice(1).toLowerCase()}` : "—"}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">Date of Birth / Age</span>
                  <span className="font-medium text-foreground">
                    {formatDate(member.dateOfBirth)} {age !== null ? `(${age} yrs)` : ""}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">Marital Status</span>
                  <span className="font-medium text-foreground">
                    {member.maritalStatus ? `${member.maritalStatus[0]}${member.maritalStatus.slice(1).toLowerCase()}` : "—"}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">Blood Group</span>
                  <span className="font-medium text-foreground">
                    {member.bloodGroup ? BLOOD_GROUP_LABELS[member.bloodGroup] : "—"}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">National ID (Aadhaar)</span>
                  <div className="flex items-center gap-2 font-mono font-medium text-foreground">
                    <span>{maskId(member.idNumber, showId)}</span>
                    {member.idNumber && (
                      <button
                        type="button"
                        onClick={() => setShowId(!showId)}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        title={showId ? "Hide ID" : "Show ID"}
                      >
                        {showId ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">Phone Number</span>
                  <span className="font-medium text-foreground font-mono">
                    {member.phone || "—"}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">Email Address</span>
                  <span className="font-medium text-foreground">
                    {member.email || "—"}
                  </span>
                </div>

                {member.address && (
                  <div className="sm:col-span-2">
                    <span className="block text-xs text-muted-foreground">Residential Address</span>
                    <span className="font-medium text-foreground leading-snug">{member.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Education & Employment */}
          <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/60 px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>Education & Employment</span>
              </CardTitle>
              {member.isJobSeeker && (
                <Badge variant="outline" className="text-xs border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold">
                  Job Seeker
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="block text-xs text-muted-foreground">Occupation / Role</span>
                  <span className="font-medium text-foreground">
                    {member.jobTitle || member.occupation || "—"}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">Employer / Workplace</span>
                  <span className="font-medium text-foreground">
                    {member.employerOrBusiness || "—"}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">Employment Status</span>
                  <span className="font-medium text-foreground">
                    {member.employmentStatus ? member.employmentStatus.replace("_", " ") : "—"}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-muted-foreground">Highest Education</span>
                  <span className="font-medium text-foreground">
                    {member.educationLevel ? member.educationLevel.replace("_", " ") : "—"}
                  </span>
                </div>

                {member.institution && (
                  <div className="sm:col-span-2">
                    <span className="block text-xs text-muted-foreground">Institution / College</span>
                    <span className="font-medium text-foreground">{member.institution}</span>
                  </div>
                )}

                {member.educationDetails && (
                  <div className="sm:col-span-2">
                    <span className="block text-xs text-muted-foreground">Education Details</span>
                    <span className="font-medium text-foreground">{member.educationDetails}</span>
                  </div>
                )}
              </div>

              {/* Education History List (if any) */}
              {member.educationHistory && member.educationHistory.length > 0 && (
                <div className="pt-3 border-t border-border/60 space-y-2">
                  <span className="block text-xs text-muted-foreground font-semibold">
                    Education History ({member.educationHistory.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {member.educationHistory.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-0.5">
                        <div className="flex items-center justify-between font-semibold text-foreground">
                          <span>{item.degree || item.level || "Qualification"}</span>
                          {item.year && <span className="text-muted-foreground font-mono font-normal">{item.year}</span>}
                        </div>
                        {item.institution && <p className="text-muted-foreground">{item.institution}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Bank */}
              {member.skills && member.skills.length > 0 && (
                <div className="pt-3 border-t border-border/60 space-y-2">
                  <span className="block text-xs text-muted-foreground font-semibold">
                    Skills & Competencies ({member.skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground border border-border/40"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Health & Welfare Profile (if recorded) */}
          {(member.healthProfile || member.isYatheem || member.isExpatriate) && (
            <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
              <CardHeader className="border-b border-border/60 px-6 py-4">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <span>Welfare & Health Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <span className="block text-xs text-muted-foreground">Residency Movement</span>
                    <span className="font-medium text-foreground">
                      {MOVEMENT_STATUS_LABELS[member.movementStatus] ?? member.movementStatus}
                      {member.movementDate && ` (since ${formatDate(member.movementDate)})`}
                    </span>
                  </div>

                  {member.isExpatriate && (
                    <div>
                      <span className="block text-xs text-muted-foreground">Expatriate Country</span>
                      <span className="font-medium text-foreground">
                        {member.expatriateCountry || "Overseas"}
                      </span>
                    </div>
                  )}

                  {member.isYatheem && (
                    <div>
                      <span className="block text-xs text-muted-foreground">Yatheem Support</span>
                      <span className="font-medium text-amber-700 dark:text-amber-300">Enrolled</span>
                    </div>
                  )}

                  {member.healthProfile && (
                    <>
                      <div>
                        <span className="block text-xs text-muted-foreground">Health Condition</span>
                        <span className="font-medium text-foreground">
                          {member.healthProfile.status === "HAS_CONDITION"
                            ? "Reported Medical Condition"
                            : member.healthProfile.status === "NOT_DISCLOSED"
                            ? "Not Disclosed"
                            : "No Known Condition"}
                        </span>
                      </div>

                      {member.healthProfile.hasDisability && (
                        <div>
                          <span className="block text-xs text-muted-foreground">Disability Details</span>
                          <span className="font-medium text-foreground">
                            {member.healthProfile.disabilityType || "Disability"}
                            {member.healthProfile.disabilityPercentage ? ` (${member.healthProfile.disabilityPercentage}%)` : ""}
                          </span>
                        </div>
                      )}

                      {member.healthProfile.requiresCommunitySupport && (
                        <div>
                          <span className="block text-xs text-muted-foreground">Community Support Status</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            {member.healthProfile.supportStatus || "Active"}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (4 cols): Household & Family Members */}
        <div className="lg:col-span-4 space-y-6">
          {/* Linked Household Card */}
          <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/60 px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Household Unit</span>
              </CardTitle>
              {familyId && (
                <Link
                  href={`/${slug}/families/${familyId}`}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  <span>View Family</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {familyName ? (
                <>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Family Name</span>
                    <p className="font-semibold text-foreground text-sm">
                      {familyName} Household
                    </p>
                  </div>

                  {linkedFamily?.house && (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Assigned House</span>
                      <p className="font-medium text-foreground text-sm">
                        House #{linkedFamily.house.displayNumber}
                      </p>
                    </div>
                  )}

                  {otherFamilyMembers.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-border/60">
                      <span className="text-xs text-muted-foreground font-semibold block">
                        Family Members ({otherFamilyMembers.length})
                      </span>
                      <div className="divide-y divide-border/40">
                        {otherFamilyMembers.map((fm) => {
                          const fmAge = calculateAge(fm.dateOfBirth);
                          return (
                            <Link
                              key={fm.id}
                              href={`/${slug}/members/${fm.id}`}
                              className="flex items-center justify-between py-2.5 group hover:bg-muted/30 -mx-2 px-2 rounded-2xl transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Avatar name={fm.fullName} size="sm" />
                                <div className="truncate">
                                  <span className="font-medium text-xs text-foreground group-hover:underline truncate block">
                                    {fm.fullName}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">
                                    {fm.relationToHead
                                      ? (RELATION_TO_HEAD_LABELS[fm.relationToHead] ?? fm.relationToHead)
                                      : "Member"}
                                    {fmAge !== null ? ` • ${fmAge} yrs` : ""}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">No household linked to this member.</p>
              )}
            </CardContent>
          </Card>

          {/* Member Contribution / Payment History */}
          <MemberPaymentHistoryCard slug={slug} memberId={member.id} />

          {/* Movement / Additional Notes */}
          {member.movementNotes && (
            <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
              <CardHeader className="border-b border-border/60 px-6 py-4">
                <CardTitle className="text-sm font-bold text-foreground">Administrative Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {member.movementNotes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Member Dialog */}
      <MemberFormDialog
        slug={slug}
        open={formOpen}
        onOpenChange={setFormOpen}
        editingMember={member}
        families={families}
      />
    </div>
  );
}
