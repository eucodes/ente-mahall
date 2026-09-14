"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useBreadcrumb } from "@/features/navigation/admin-shell";
import {
  Avatar,
  Briefcase,
  Button,
  Cake,
  ChevronRight,
  DetailGrid,
  DetailItem,
  Droplet,
  EmptyState,
  Eye,
  EyeOff,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Home,
  IdCard,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Plane,
  Receipt,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Tabs,
  User,
  Users
} from "@mahalle/ui";
import {
  BLOOD_GROUP_LABELS,
  MOVEMENT_STATUS_LABELS,
  RELATION_TO_HEAD_LABELS,
  type MovementStatus
} from "@/lib/member-constants";
import type { HealthConditionStatus, Member } from "@/lib/members";
import type { Family } from "@/lib/business-resources";
import { MemberFormDialog } from "./member-form-dialog";
import { ContributionHistory } from "./contribution-history";
import {
  RecordBackLink,
  RecordChip,
  RecordHeader,
  RecordLayout,
  RecordPanel,
  type RecordChipTone,
  type RecordMetaItem
} from "./record-layout";
import { calculateAge, formatDate, humanize, maskId, telHref, whatsappHref } from "./record-utils";
import { useRecordTab } from "./use-record-tab";

export interface MemberDetailViewProps {
  slug: string;
  member: Member;
  familyMembers: Member[];
  families: Family[];
}

const MEMBER_TABS = ["overview", "work", "health", "contributions"] as const;

const MOVEMENT_TONE: Record<MovementStatus, RecordChipTone> = {
  RESIDENT: "emerald",
  MIGRATED: "amber",
  MOVED_OUT: "amber",
  DECEASED: "muted"
};

const HEALTH_STATUS_LABELS: Record<HealthConditionStatus, string> = {
  NO_KNOWN_CONDITION: "No known condition",
  HAS_CONDITION: "Has a medical condition",
  NOT_DISCLOSED: "Not disclosed"
};

const notRecorded = <span className="font-normal text-muted-foreground/70">Not recorded</span>;

function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}

function PhoneLink({ phone }: { phone: string | null | undefined }) {
  if (!phone) return null;
  return (
    <a href={telHref(phone)} className="font-mono hover:underline">
      {phone}
    </a>
  );
}

export function MemberDetailView({ slug, member, familyMembers, families }: MemberDetailViewProps) {
  const [tab, setTab] = useRecordTab(MEMBER_TABS, "overview");
  const [formOpen, setFormOpen] = useState(false);
  const [showId, setShowId] = useState(false);
  const { setDetailTitle } = useBreadcrumb();

  useEffect(() => {
    setDetailTitle(member.fullName);
    return () => setDetailTitle(null);
  }, [member.fullName, setDetailTitle]);

  const age = calculateAge(member.dateOfBirth);
  const linkedFamily = families.find((f) => f.id === member.familyId) ?? null;
  const familyId = linkedFamily?.id ?? member.family?.id ?? null;
  const familyName = linkedFamily?.name ?? member.family?.name ?? null;
  const householdPeers = familyMembers.filter((m) => m.id !== member.id);
  const relation = member.relationToHead ? RELATION_TO_HEAD_LABELS[member.relationToHead] : null;
  const movementLabel = MOVEMENT_STATUS_LABELS[member.movementStatus] ?? humanize(member.movementStatus);
  const health = member.healthProfile ?? null;
  const educationHistory = member.educationHistory ?? [];
  const skills = member.skills ?? [];
  const dateOfBirth = formatDate(member.dateOfBirth);

  const meta: RecordMetaItem[] = [
    { key: "age", icon: <Cake />, label: "Age", value: age !== null ? `${age} years` : notRecorded },
    { key: "phone", icon: <Phone />, label: "Phone", value: member.phone ?? notRecorded },
    { key: "email", icon: <Mail />, label: "Email", value: member.email ?? notRecorded },
    {
      key: "household",
      icon: <Home />,
      label: "Household",
      value:
        familyId && familyName ? (
          <Link href={`/${slug}/families/${familyId}`} className="hover:underline">
            {familyName}
          </Link>
        ) : (
          <span className="font-normal text-muted-foreground/70">Not linked</span>
        )
    }
  ];

  let tabContent: ReactNode;
  if (tab === "work") {
    tabContent = (
      <>
        <RecordPanel title="Employment" icon={<Briefcase />}>
          <DetailGrid>
            <DetailItem label="Employment status">{humanize(member.employmentStatus)}</DetailItem>
            <DetailItem label="Job title / occupation">{member.jobTitle || member.occupation}</DetailItem>
            <DetailItem label="Employer or business" wide>
              {member.employerOrBusiness}
            </DetailItem>
          </DetailGrid>
        </RecordPanel>

        <RecordPanel title="Education" icon={<GraduationCap />}>
          <DetailGrid>
            <DetailItem label="Highest education">{humanize(member.educationLevel)}</DetailItem>
            <DetailItem label="Institution">{member.institution}</DetailItem>
            {member.educationDetails && (
              <DetailItem label="Details" wide>
                {member.educationDetails}
              </DetailItem>
            )}
          </DetailGrid>

          {educationHistory.length > 0 && (
            <div className="mt-6 border-t border-border/60 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">History</p>
              <ol className="space-y-4 border-l border-border pl-5">
                {educationHistory.map((item, index) => (
                  <li key={item.id ?? index} className="relative">
                    <span
                      className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary"
                      aria-hidden
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {item.degree || humanize(item.level) || "Qualification"}
                      </p>
                      {item.year && <span className="font-mono text-xs text-muted-foreground">{item.year}</span>}
                    </div>
                    {item.institution && <p className="text-xs text-muted-foreground">{item.institution}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </RecordPanel>

        <RecordPanel title="Skills" icon={<Sparkles />}>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <RecordChip key={skill}>{skill}</RecordChip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills recorded.</p>
          )}
        </RecordPanel>
      </>
    );
  } else if (tab === "health") {
    tabContent = (
      <>
        <RecordPanel title="Residency" icon={<Home />}>
          <DetailGrid>
            <DetailItem label="Status">{movementLabel}</DetailItem>
            <DetailItem label="Since">{formatDate(member.movementDate)}</DetailItem>
          </DetailGrid>
        </RecordPanel>

        {health ? (
          <>
            <RecordPanel title="Health" icon={<HeartPulse />}>
              <DetailGrid>
                <DetailItem label="Condition">{HEALTH_STATUS_LABELS[health.status]}</DetailItem>
                <DetailItem label="Disability">
                  {health.hasDisability
                    ? [humanize(health.disabilityType) ?? "Yes", health.disabilityPercentage ? `${health.disabilityPercentage}%` : null]
                        .filter(Boolean)
                        .join(" · ")
                    : "None recorded"}
                </DetailItem>
                {health.hasDisability && (
                  <DetailItem label="Disability certificate">
                    {health.disabilityCertificate ? (health.disabilityCertificateNo ?? "Yes") : "No"}
                  </DetailItem>
                )}
                <DetailItem label="Chronic illness">
                  {health.hasChronicIllness
                    ? health.chronicConditions.length > 0
                      ? health.chronicConditions.join(", ")
                      : "Yes"
                    : "None recorded"}
                </DetailItem>
                {health.chronicDetails && (
                  <DetailItem label="Illness details" wide>
                    {health.chronicDetails}
                  </DetailItem>
                )}
                <DetailItem label="Ongoing treatment">{yesNo(health.treatmentRequired)}</DetailItem>
                <DetailItem label="Regular medication">{yesNo(health.regularMedicationRequired)}</DetailItem>
                {health.requiresMentalHealthSupport && (
                  <DetailItem label="Mental health support">{health.mentalHealthSupportType ?? "Required"}</DetailItem>
                )}
              </DetailGrid>
            </RecordPanel>

            {(health.requiresAssistance || health.primaryCaregiverName || health.emergencyContactName) && (
              <RecordPanel title="Care & emergency contact" icon={<ShieldCheck />}>
                <DetailGrid>
                  {health.requiresAssistance && (
                    <DetailItem label="Assistance needed" wide>
                      {health.assistanceTypes.length > 0 ? health.assistanceTypes.map((type) => humanize(type)).join(", ") : "Yes"}
                    </DetailItem>
                  )}
                  <DetailItem label="Primary caregiver">
                    {health.primaryCaregiverName
                      ? `${health.primaryCaregiverName}${health.caregiverRelationship ? ` (${health.caregiverRelationship})` : ""}`
                      : null}
                  </DetailItem>
                  <DetailItem label="Emergency contact">
                    {health.emergencyContactName
                      ? `${health.emergencyContactName}${health.emergencyContactPhone ? ` · ${health.emergencyContactPhone}` : ""}`
                      : null}
                  </DetailItem>
                </DetailGrid>
              </RecordPanel>
            )}

            <RecordPanel title="Community support" icon={<HeartHandshake />}>
              {health.requiresCommunitySupport ? (
                <DetailGrid>
                  <DetailItem label="Status">{humanize(health.supportStatus)}</DetailItem>
                  <DetailItem label="Category">{health.supportCategory}</DetailItem>
                  <DetailItem label="Last support">{formatDate(health.lastSupportDate)}</DetailItem>
                  {health.supportNotes && (
                    <DetailItem label="Notes" wide>
                      {health.supportNotes}
                    </DetailItem>
                  )}
                </DetailGrid>
              ) : (
                <p className="text-sm text-muted-foreground">This member isn&apos;t marked as receiving community support.</p>
              )}
            </RecordPanel>
          </>
        ) : (
          <RecordPanel title="Health" icon={<HeartPulse />}>
            <EmptyState
              className="py-8"
              title="No health details recorded"
              description="Nothing about health, disability, or community support has been recorded for this member."
              action={
                <Button size="sm" variant="outline" className="mt-2" onClick={() => setFormOpen(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit member
                </Button>
              }
            />
          </RecordPanel>
        )}
      </>
    );
  } else if (tab === "contributions") {
    tabContent = <ContributionHistory slug={slug} kind="member" id={member.id} />;
  } else {
    tabContent = (
      <>
        <RecordPanel title="Personal details" icon={<User />}>
          <DetailGrid>
            <DetailItem label="Full name">{member.fullName}</DetailItem>
            <DetailItem label="Relation to head">{relation}</DetailItem>
            <DetailItem label="Gender">{humanize(member.gender)}</DetailItem>
            <DetailItem label="Date of birth">
              {dateOfBirth ? `${dateOfBirth}${age !== null ? ` · ${age} yrs` : ""}` : null}
            </DetailItem>
            <DetailItem label="Marital status">{humanize(member.maritalStatus)}</DetailItem>
            <DetailItem label="Blood group">{member.bloodGroup ? BLOOD_GROUP_LABELS[member.bloodGroup] : null}</DetailItem>
            <DetailItem label="National ID" icon={<IdCard />}>
              {member.idNumber ? (
                <span className="inline-flex items-center gap-1.5 font-mono">
                  {maskId(member.idNumber, showId)}
                  <button
                    type="button"
                    onClick={() => setShowId((v) => !v)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={showId ? "Hide ID number" : "Show ID number"}
                  >
                    {showId ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </span>
              ) : null}
            </DetailItem>
          </DetailGrid>
        </RecordPanel>

        <RecordPanel title="Contact" icon={<Phone />}>
          <DetailGrid>
            <DetailItem label="Phone">
              <PhoneLink phone={member.phone} />
            </DetailItem>
            <DetailItem label="Email">
              {member.email ? (
                <a href={`mailto:${member.email}`} className="hover:underline">
                  {member.email}
                </a>
              ) : null}
            </DetailItem>
            <DetailItem label="Residential address" wide>
              {member.address}
            </DetailItem>
          </DetailGrid>
        </RecordPanel>

        {member.isYatheem && (
          <RecordPanel title="Guardian" icon={<ShieldCheck />}>
            <DetailGrid>
              <DetailItem label="Guardian name">{member.guardianName}</DetailItem>
              <DetailItem label="Guardian phone">
                <PhoneLink phone={member.guardianPhone} />
              </DetailItem>
            </DetailGrid>
          </RecordPanel>
        )}

        {member.isExpatriate && (
          <RecordPanel title="Living abroad" icon={<Plane />}>
            <DetailGrid>
              <DetailItem label="Country">{member.expatriateCountry}</DetailItem>
              <DetailItem label="Occupation abroad">{member.expatriateOccupation}</DetailItem>
              <DetailItem label="Contact abroad" wide>
                {member.expatriateContact}
              </DetailItem>
            </DetailGrid>
          </RecordPanel>
        )}
      </>
    );
  }

  const aside = (
    <>
      <RecordPanel
        title="Household"
        icon={<Users />}
        flush
        action={
          familyId ? (
            <Link href={`/${slug}/families/${familyId}`} className="text-xs font-semibold text-primary hover:underline">
              View family
            </Link>
          ) : undefined
        }
      >
        {familyId && familyName ? (
          <>
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Home className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{familyName}</p>
                <p className="text-xs text-muted-foreground">
                  {linkedFamily?.house ? `House #${linkedFamily.house.displayNumber}` : "No house assigned"} ·{" "}
                  {Math.max(familyMembers.length, 1)} member{Math.max(familyMembers.length, 1) === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            {householdPeers.length > 0 ? (
              <ul className="divide-y divide-border/60 border-t border-border/60">
                {householdPeers.map((peer) => {
                  const peerAge = calculateAge(peer.dateOfBirth);
                  return (
                    <li key={peer.id}>
                      <Link
                        href={`/${slug}/members/${peer.id}`}
                        className="group flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-muted/40"
                      >
                        <Avatar name={peer.fullName} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{peer.fullName}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {peer.relationToHead ? RELATION_TO_HEAD_LABELS[peer.relationToHead] : "Member"}
                            {peerAge !== null ? ` · ${peerAge} yrs` : ""}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="border-t border-border/60 px-5 py-4 text-xs text-muted-foreground">No other members in this household.</p>
            )}
          </>
        ) : (
          <div className="px-5 py-6 text-center">
            <p className="text-sm text-muted-foreground">Not linked to a household.</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => setFormOpen(true)}>
              Link a family
            </Button>
          </div>
        )}
      </RecordPanel>

      {member.movementNotes && (
        <RecordPanel title="Notes" icon={<StickyNote />}>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{member.movementNotes}</p>
        </RecordPanel>
      )}
    </>
  );

  return (
    <div className="max-w-6xl space-y-5">
      <RecordBackLink href={`/${slug}/members`} label="Members" />

      <RecordHeader
        media={
          <div className="rounded-full bg-card p-1 shadow-sm">
            <Avatar name={member.fullName} size="lg" className="h-20 w-20 text-2xl sm:h-24 sm:w-24" />
          </div>
        }
        title={member.fullName}
        reference={`MEM-${member.id.slice(0, 8).toUpperCase()}`}
        subtitle={
          <>
            {relation ?? "Member"}
            {linkedFamily?.house ? ` · House #${linkedFamily.house.displayNumber}` : ""}
          </>
        }
        chips={
          <>
            <RecordChip tone={MOVEMENT_TONE[member.movementStatus]}>{movementLabel}</RecordChip>
            {member.bloodGroup && (
              <RecordChip tone="rose" icon={<Droplet />}>
                {BLOOD_GROUP_LABELS[member.bloodGroup]}
              </RecordChip>
            )}
            {member.isExpatriate && (
              <RecordChip tone="sky" icon={<Plane />}>
                NRI{member.expatriateCountry ? ` · ${member.expatriateCountry}` : ""}
              </RecordChip>
            )}
            {member.isYatheem && (
              <RecordChip tone="amber" icon={<HeartHandshake />}>
                Yatheem
              </RecordChip>
            )}
            {member.isJobSeeker && (
              <RecordChip tone="violet" icon={<Briefcase />}>
                Job seeker
              </RecordChip>
            )}
          </>
        }
        actions={
          <>
            {member.phone && (
              <>
                <Button asChild variant="outline" size="sm">
                  <a href={telHref(member.phone)}>
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={whatsappHref(member.phone)} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    WhatsApp
                  </a>
                </Button>
              </>
            )}
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit member
            </Button>
          </>
        }
        meta={meta}
      />

      <RecordLayout
        main={
          <>
            <Tabs
              variant="underline"
              activeTab={tab}
              onChange={setTab}
              tabs={[
                { id: "overview", label: "Overview", icon: <User className="h-4 w-4" /> },
                { id: "work", label: "Education & work", icon: <GraduationCap className="h-4 w-4" /> },
                { id: "health", label: "Health & welfare", icon: <HeartPulse className="h-4 w-4" /> },
                { id: "contributions", label: "Contributions", icon: <Receipt className="h-4 w-4" /> }
              ]}
            />
            {tabContent}
          </>
        }
        aside={aside}
      />

      <MemberFormDialog slug={slug} open={formOpen} onOpenChange={setFormOpen} editingMember={member} families={families} />
    </div>
  );
}
