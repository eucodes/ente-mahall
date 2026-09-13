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
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Plane,
  ShieldCheck,
  User,
  Users,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  School,
  Home,
  useToast
} from "@mahalle/ui";
import { BLOOD_GROUP_LABELS, MOVEMENT_STATUS_LABELS, RELATION_TO_HEAD_LABELS } from "@/lib/member-constants";
import type { Member } from "@/lib/members";
import type { Family } from "@/lib/business-resources";
import { MemberFormDialog } from "./member-form-dialog";

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

export function MemberDetailView({ slug, member, familyMembers, families }: MemberDetailViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showId, setShowId] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { setDetailTitle } = useBreadcrumb();

  useEffect(() => {
    setDetailTitle(member.fullName);
    return () => setDetailTitle(null);
  }, [member.fullName, setDetailTitle]);

  const age = calculateAge(member.dateOfBirth);
  const otherFamilyMembers = familyMembers.filter((m) => m.id !== member.id);

  // Student vs Adult detection
  const isStudent =
    (member.occupation && member.occupation.toLowerCase().includes("student")) ||
    (member.movementNotes && member.movementNotes.toLowerCase().includes("[student]"));

  let studentInstitution = "";
  let studentPreviousEducation = "";
  let adultOccupation = member.occupation ?? "";
  let adultQualifications = "";

  if (isStudent && member.occupation) {
    if (member.occupation.includes("•")) {
      const parts = member.occupation.split("•")[1]?.trim() ?? "";
      if (parts.includes("(Prev:")) {
        const [inst, prevPart] = parts.split("(Prev:");
        studentInstitution = inst.trim();
        studentPreviousEducation = prevPart.replace(")", "").trim();
      } else {
        studentInstitution = parts;
      }
    } else {
      studentInstitution = member.occupation.replace(/student:?/i, "").trim();
    }
  } else if (!isStudent && member.occupation) {
    if (member.occupation.includes("• Qualifications:")) {
      const [occ, qual] = member.occupation.split("• Qualifications:");
      adultOccupation = occ.trim();
      adultQualifications = qual.trim();
    }
  }

  // Parse student previous education items e.g. "SSLC (2022), Plus Two (2024)"
  const parsedPrevEducations = studentPreviousEducation
    ? studentPreviousEducation
        .split(",")
        .map((item) => {
          const trimmed = item.trim();
          const match = trimmed.match(/^(.*?)(?:\s*\((.*?)\))?$/);
          return {
            title: match?.[1]?.trim() || trimmed,
            year: match?.[2]?.trim() || null
          };
        })
        .filter((item) => item.title.length > 0)
    : [];

  // Parse adult qualifications
  const parsedQualifications = adultQualifications
    ? adultQualifications
        .split(",")
        .map((q) => q.trim())
        .filter(Boolean)
    : [];

  // Check if address matches family address
  const linkedFamily = families.find((f) => f.id === member.familyId);
  const isFamilyAddress = Boolean(linkedFamily?.address && member.address && member.address === linkedFamily.address);

  return (
    <div className="space-y-5">
      {/* Top Page Header with Back Navigation (Matching Reference Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/${slug}/members`)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs group"
            title="Back to Members Directory"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Member Profile
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFormOpen(true)}
            className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 border-border/80 text-foreground"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Edit Member</span>
          </Button>

          {member.phone && (
            <Button
              size="sm"
              onClick={() => window.open(`https://wa.me/${member.phone?.replace(/[^0-9]/g, "")}`, "_blank")}
              className="rounded-xl text-xs font-bold h-9 px-3.5 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </Button>
          )}
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <Avatar name={member.fullName} size="lg" className="ring-4 ring-primary/10 shadow-sm" />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{member.fullName}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Resident
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1.5">
                <span>
                  {member.relationToHead
                    ? (RELATION_TO_HEAD_LABELS[member.relationToHead] ?? member.relationToHead)
                    : "Resident"}
                </span>
                {member.family && (
                  <>
                    <span>•</span>
                    <Link
                      href={`/${slug}/families/${member.family.id}`}
                      className="text-primary hover:underline font-medium flex items-center gap-1"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>{member.family.name} Household</span>
                    </Link>
                  </>
                )}
                {age !== null && (
                  <>
                    <span>•</span>
                    <span>{age} years old</span>
                  </>
                )}
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge variant={member.movementStatus === "RESIDENT" ? "secondary" : "outline"} className="text-xs">
                  {MOVEMENT_STATUS_LABELS[member.movementStatus] ?? member.movementStatus}
                </Badge>
                {member.bloodGroup && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium">
                    <Droplet className="h-3 w-3" />
                    Blood: {BLOOD_GROUP_LABELS[member.bloodGroup]}
                  </span>
                )}
                {member.isYatheem && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
                    <HeartHandshake className="h-3 w-3" />
                    Yatheem Register
                  </span>
                )}
                {member.isExpatriate && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                    <Plane className="h-3 w-3" />
                    NRI / Expatriate ({member.expatriateCountry ?? "Overseas"})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-border">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
              #MEM-{member.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-[11px] text-muted-foreground">Registered Member</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Household Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Personal, Demographic, ID, Contact, Notes, Financials */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Demographic & Personal Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>Personal & Demographics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</span>
                <span className="font-semibold text-foreground text-sm">{member.fullName}</span>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Gender</span>
                <span className="font-medium text-foreground text-sm">
                  {member.gender ? `${member.gender[0]}${member.gender.slice(1).toLowerCase()}` : "Not specified"}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Date of Birth / Age</span>
                <span className="font-medium text-foreground text-sm">
                  {formatDate(member.dateOfBirth)} {age !== null ? `(${age} yrs)` : ""}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Marital Status</span>
                <span className="font-medium text-foreground text-sm">
                  {member.maritalStatus ? `${member.maritalStatus[0]}${member.maritalStatus.slice(1).toLowerCase()}` : "—"}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Blood Group</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-1">
                  <Droplet className="h-3.5 w-3.5" />
                  {member.bloodGroup ? BLOOD_GROUP_LABELS[member.bloodGroup] : "Not recorded"}
                </span>
              </div>

              {isStudent ? (
                <>
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <School className="h-3.5 w-3.5" />
                      Profile Type
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">Student</span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1 sm:col-span-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Current Institution</span>
                    <span className="font-medium text-foreground text-sm">{studentInstitution || "Not specified"}</span>
                  </div>

                  {parsedPrevEducations.length > 0 ? (
                    <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-2 sm:col-span-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Previous Education</span>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedPrevEducations.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-500/20"
                          >
                            <School className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{item.title}</span>
                            {item.year && (
                              <span className="font-mono text-[10px] font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-200">
                                {item.year}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : studentPreviousEducation ? (
                    <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1 sm:col-span-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Previous Education</span>
                      <span className="font-medium text-foreground text-sm">{studentPreviousEducation}</span>
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Profile Type</span>
                    <span className="font-medium text-foreground text-sm">Adult</span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1 sm:col-span-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Occupation</span>
                    <span className="font-medium text-foreground text-sm">{adultOccupation || "Residential / Home"}</span>
                  </div>

                  {parsedQualifications.length > 0 ? (
                    <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-2 sm:col-span-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Educational Qualifications</span>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedQualifications.map((qual, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-medium border border-border"
                          >
                            <span>{qual}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : adultQualifications ? (
                    <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1 sm:col-span-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Educational Qualifications</span>
                      <span className="font-medium text-foreground text-sm">{adultQualifications}</span>
                    </div>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>

          {/* Government Identification Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Government Identification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    National ID / Aadhaar
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-foreground">
                      {member.idNumber
                        ? showId
                          ? member.idNumber
                          : `${member.idNumber.slice(0, 4)}••••••${member.idNumber.slice(-2)}`
                        : "No ID Number Recorded"}
                    </span>
                    {member.idNumber && (
                      <button
                        type="button"
                        onClick={() => setShowId(!showId)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title={showId ? "Mask ID" : "Reveal ID"}
                      >
                        {showId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  Identity on File
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Residential Address Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Contact & Residential Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Mobile Phone</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-foreground">{member.phone ?? "Not provided"}</span>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${member.phone}`}
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors p-1"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate">{member.email ?? "Not provided"}</span>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Residential Address</span>
                  {isFamilyAddress && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      <Home className="h-3 w-3" />
                      Household Address
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {member.address ?? "No address recorded on file."}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Movement & Residency Record Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>Residency & Movement Record</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                <div className="flex items-center gap-2.5">
                  <Badge variant={member.movementStatus === "RESIDENT" ? "secondary" : "outline"} className="text-xs">
                    {MOVEMENT_STATUS_LABELS[member.movementStatus] ?? member.movementStatus}
                  </Badge>
                  <span className="text-muted-foreground">Status since: {formatDate(member.movementDate)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormOpen(true)}
                  className="h-7 text-xs px-2.5"
                >
                  Update Status
                </Button>
              </div>

              {member.movementNotes && (
                <div className="p-3 rounded-lg bg-secondary/40 border border-border/60 flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Movement & Administrative Note
                  </span>
                  <p className="text-xs text-foreground italic">&ldquo;{member.movementNotes}&rdquo;</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financials & Contributions Section Placeholder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Contributions, Donations & Dues</span>
                <Badge variant="outline" className="text-xs font-normal">Active Ledger</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <div className="p-6 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center gap-2">
                <p className="font-semibold text-foreground">Financial Ledger Active</p>
                <p className="max-w-md text-muted-foreground">
                  Individual and household contributions, donation receipts, and annual dues reconciliation are tracked with the Mahallu Finance module.
                </p>
                <Link
                  href={`/${slug}/finance/dues`}
                  className="mt-2 text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Open Treasury & Dues Portal</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Family Unit Card & Welfare Register Cards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Linked Family Unit Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Household Unit</span>
                </div>
                {member.family && (
                  <Link
                    href={`/${slug}/families/${member.family.id}`}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-0.5"
                  >
                    <span>View Family</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {member.family ? (
                <>
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex flex-col gap-1">
                    <span className="text-sm font-bold text-foreground">{member.family.name} Household</span>
                    <span className="text-xs text-muted-foreground">
                      Relation: {member.relationToHead ? RELATION_TO_HEAD_LABELS[member.relationToHead] : "Family Member"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Other Family Members ({otherFamilyMembers.length})
                    </span>

                    {otherFamilyMembers.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No other members registered in this family.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {otherFamilyMembers.map((fm) => (
                          <Link
                            key={fm.id}
                            href={`/${slug}/members/${fm.id}`}
                            className="p-2.5 rounded-lg bg-muted/40 hover:bg-muted border border-border/60 flex items-center justify-between transition-colors group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Avatar name={fm.fullName} size="sm" />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold text-foreground group-hover:text-primary truncate">
                                  {fm.fullName}
                                </span>
                                <span className="text-[11px] text-muted-foreground truncate">
                                  {fm.relationToHead ? RELATION_TO_HEAD_LABELS[fm.relationToHead] : "Member"}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground flex flex-col gap-2">
                  <p>Not currently linked to a family household.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormOpen(true)}
                    className="h-8 text-xs"
                  >
                    Link to Family
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Welfare & Special Registers Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                <span>Welfare & NRI Registry</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {member.isYatheem && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      Yatheem Support Register
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Enrolled
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Guardian: {member.guardianName ?? "Not specified"}
                  </span>
                  {member.guardianPhone && (
                    <span className="text-xs font-mono text-muted-foreground">
                      Tel: {member.guardianPhone}
                    </span>
                  )}
                </div>
              )}

              {member.isExpatriate && (
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                      Expatriate / NRI Register
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {member.expatriateCountry ?? "Overseas"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Occupation: {member.expatriateOccupation ?? "Overseas Professional"}
                  </span>
                  {member.expatriateContact && (
                    <span className="text-xs text-muted-foreground">
                      Contact: {member.expatriateContact}
                    </span>
                  )}
                </div>
              )}

              {!member.isYatheem && !member.isExpatriate && (
                <p className="text-xs text-muted-foreground italic p-2">
                  No special welfare or expatriate classifications recorded for this member.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Member Modal */}
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
