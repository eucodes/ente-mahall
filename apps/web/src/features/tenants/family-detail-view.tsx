"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useBreadcrumb } from "@/features/navigation/admin-shell";
import {
  Avatar,
  Button,
  ChevronDown,
  ChevronRight,
  Crown,
  DetailGrid,
  DetailItem,
  Droplet,
  DropdownMenu,
  EmptyState,
  Eye,
  EyeOff,
  FileText,
  HeartHandshake,
  Home,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Plane,
  Plus,
  Receipt,
  StickyNote,
  Tabs,
  UserCheck,
  UserPlus,
  Users,
  cn,
  useToast
} from "@mahalle/ui";
import { BLOOD_GROUP_LABELS, MOVEMENT_STATUS_LABELS, RELATION_TO_HEAD_LABELS } from "@/lib/member-constants";
import type { Family } from "@/lib/business-resources";
import type { Member } from "@/lib/members";
import type { House } from "@/lib/houses";
import { FamilyFormDialog } from "./family-form-dialog";
import { MemberFormDialog } from "./member-form-dialog";
import { AddExistingMemberDialog } from "./add-existing-member-dialog";
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

export interface FamilyDetailViewProps {
  slug: string;
  family: Family;
  members: Member[];
  houses: House[];
  allFamilies: Family[];
  hasFamilyStatuses?: boolean;
}

const FAMILY_TABS = ["members", "contributions", "details"] as const;

// Family statuses store a named palette colour (see FamilyStatusFormDialog), not a hex value.
const STATUS_TONE: Record<string, RecordChipTone> = {
  emerald: "emerald",
  blue: "sky",
  amber: "amber",
  purple: "violet",
  rose: "rose"
};

const notRecorded = <span className="font-normal text-muted-foreground/70">Not recorded</span>;

export function FamilyDetailView({ slug, family, members, houses, allFamilies, hasFamilyStatuses = false }: FamilyDetailViewProps) {
  const { toast } = useToast();
  const [tab, setTab] = useRecordTab(FAMILY_TABS, "members");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [editFamilyOpen, setEditFamilyOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addExistingOpen, setAddExistingOpen] = useState(false);
  const { setDetailTitle } = useBreadcrumb();

  useEffect(() => {
    setDetailTitle(family.name);
    return () => setDetailTitle(null);
  }, [family.name, setDetailTitle]);

  const house = houses.find((h) => h.id === family.houseId) ?? null;
  const division = house?.division ?? null;
  const head = members.find((m) => m.relationToHead === "HEAD") ?? null;
  const spouse = members.find((m) => m.relationToHead === "SPOUSE") ?? null;
  const dependents = members.filter((m) => m.id !== head?.id && m.id !== spouse?.id);
  const primaryPhone = family.phone || head?.phone || null;

  const composition = useMemo(() => {
    let adults = 0;
    let minors = 0;
    let unknownAge = 0;
    for (const m of members) {
      const age = calculateAge(m.dateOfBirth);
      if (age === null) unknownAge += 1;
      else if (age >= 18) adults += 1;
      else minors += 1;
    }
    return {
      adults,
      minors,
      unknownAge,
      abroad: members.filter((m) => m.isExpatriate).length,
      yatheem: members.filter((m) => m.isYatheem).length,
      residents: members.filter((m) => m.movementStatus === "RESIDENT").length
    };
  }, [members]);

  const addMemberItems = [
    { label: "Add new member", icon: <UserPlus className="h-3.5 w-3.5" />, onClick: () => setAddMemberOpen(true) },
    { label: "Add existing member", icon: <UserCheck className="h-3.5 w-3.5" />, onClick: () => setAddExistingOpen(true) }
  ];

  const meta: RecordMetaItem[] = [
    { key: "members", icon: <Users />, label: "Members", value: `${members.length} ${members.length === 1 ? "person" : "people"}` },
    { key: "house", icon: <Home />, label: "House", value: family.house ? `#${family.house.displayNumber}` : notRecorded },
    division
      ? {
          key: "division",
          icon: <MapPin />,
          label: "Ward",
          value: `${division.name}${division.code ? ` (${division.code})` : ""}`
        }
      : { key: "address", icon: <MapPin />, label: "Address", value: family.address ?? notRecorded },
    { key: "phone", icon: <Phone />, label: "Contact", value: primaryPhone ?? notRecorded }
  ];

  let tabContent: ReactNode;
  if (tab === "contributions") {
    tabContent = <ContributionHistory slug={slug} kind="family" id={family.id} />;
  } else if (tab === "details") {
    tabContent = (
      <>
        <RecordPanel title="Household details" icon={<Home />}>
          <DetailGrid>
            <DetailItem label="Family name">{family.name}</DetailItem>
            <DetailItem label="Family number" mono>
              {family.familyNumber}
            </DetailItem>
            <DetailItem label="House">
              {family.house ? `#${family.house.displayNumber}${house?.name ? ` · ${house.name}` : ""}` : null}
            </DetailItem>
            <DetailItem label="Ward / division">
              {division ? `${division.name}${division.code ? ` (${division.code})` : ""}` : null}
            </DetailItem>
            {hasFamilyStatuses && <DetailItem label="Status">{family.familyStatus?.name}</DetailItem>}
            <DetailItem label="Record">{family.isActive ? "Active" : "Inactive"}</DetailItem>
            <DetailItem label="Address" wide>
              {family.address}
            </DetailItem>
            <DetailItem label="Registered on">{formatDate(family.createdAt)}</DetailItem>
            <DetailItem label="Last updated">{formatDate(family.updatedAt)}</DetailItem>
          </DetailGrid>
        </RecordPanel>

        <RecordPanel title="Contact" icon={<Phone />}>
          <DetailGrid>
            <DetailItem label="Primary phone">
              {primaryPhone ? (
                <a href={telHref(primaryPhone)} className="font-mono hover:underline">
                  {primaryPhone}
                </a>
              ) : null}
            </DetailItem>
            <DetailItem label="Emergency contact">
              {family.emergencyContactName
                ? `${family.emergencyContactName}${family.emergencyContactPhone ? ` · ${family.emergencyContactPhone}` : ""}`
                : family.emergencyContactPhone}
            </DetailItem>
          </DetailGrid>
          {!family.phone && head?.phone && (
            <p className="mt-4 text-xs text-muted-foreground">No household phone is recorded, so the head of family&apos;s number is shown.</p>
          )}
        </RecordPanel>

        <RecordPanel title="Community support" icon={<HeartHandshake />}>
          {family.requiresCommunitySupport ? (
            <DetailGrid>
              <DetailItem label="Status">{humanize(family.supportStatus)}</DetailItem>
              <DetailItem label="Category">{family.supportCategory}</DetailItem>
              {family.supportNotes && (
                <DetailItem label="Notes" wide>
                  {family.supportNotes}
                </DetailItem>
              )}
            </DetailGrid>
          ) : (
            <p className="text-sm text-muted-foreground">This household isn&apos;t marked as needing community support.</p>
          )}
        </RecordPanel>
      </>
    );
  } else if (members.length === 0) {
    tabContent = (
      <RecordPanel title="Members" icon={<Users />}>
        <EmptyState
          className="py-10"
          icon={
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
          }
          title="No members in this household yet"
          description="Register a new person, or move someone who's already in the member directory into this family."
          action={
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Button size="sm" onClick={() => setAddMemberOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Add new member
              </Button>
              <Button size="sm" variant="outline" onClick={() => setAddExistingOpen(true)}>
                <UserCheck className="h-4 w-4" />
                Add existing member
              </Button>
            </div>
          }
        />
      </RecordPanel>
    );
  } else {
    tabContent = (
      <>
        <RecordPanel title="Household structure" icon={<Crown />}>
          <div className="grid gap-3 sm:grid-cols-2">
            <HouseholdRoleCard slug={slug} role="Head of family" member={head} highlight emptyLabel="No head of family designated" />
            <HouseholdRoleCard slug={slug} role="Spouse" member={spouse} emptyLabel="No spouse recorded" />
          </div>
          {dependents.length > 0 && (
            <div className="mt-5">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Children & dependents · {dependents.length}
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {dependents.map((dependent) => {
                  const age = calculateAge(dependent.dateOfBirth);
                  return (
                    <Link
                      key={dependent.id}
                      href={`/${slug}/members/${dependent.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/50"
                    >
                      <Avatar name={dependent.fullName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{dependent.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {dependent.relationToHead ? RELATION_TO_HEAD_LABELS[dependent.relationToHead] : "Dependent"}
                          {age !== null ? ` · ${age} yrs` : ""}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </RecordPanel>

        <RecordPanel title={`All members · ${members.length}`} icon={<Users />} flush>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5 font-semibold">Member</th>
                  <th className="px-3 py-2.5 font-semibold">Age · gender</th>
                  <th className="px-3 py-2.5 font-semibold">Blood</th>
                  <th className="px-3 py-2.5 font-semibold">Phone</th>
                  <th className="px-3 py-2.5 font-semibold">ID number</th>
                  <th className="px-5 py-2.5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {members.map((m) => {
                  const age = calculateAge(m.dateOfBirth);
                  const revealed = Boolean(revealedIds[m.id]);
                  const ageGender = [age !== null ? `${age} yrs` : null, humanize(m.gender)].filter(Boolean).join(" · ");
                  return (
                    <tr key={m.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.fullName} />
                          <div className="min-w-0">
                            <Link href={`/${slug}/members/${m.id}`} className="block truncate font-medium text-foreground hover:underline">
                              {m.fullName}
                            </Link>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                              <span>{m.relationToHead ? RELATION_TO_HEAD_LABELS[m.relationToHead] : "Member"}</span>
                              {m.isExpatriate && (
                                <RecordChip tone="sky" icon={<Plane />}>
                                  NRI
                                </RecordChip>
                              )}
                              {m.isYatheem && <RecordChip tone="amber">Yatheem</RecordChip>}
                              {m.movementStatus !== "RESIDENT" && (
                                <RecordChip tone="muted">{MOVEMENT_STATUS_LABELS[m.movementStatus] ?? humanize(m.movementStatus)}</RecordChip>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{ageGender || "—"}</td>
                      <td className="px-3 py-3">
                        {m.bloodGroup ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            <Droplet className="h-3 w-3" />
                            {BLOOD_GROUP_LABELS[m.bloodGroup]}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-foreground">
                        {m.phone ?? <span className="font-sans text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 py-3">
                        {m.idNumber ? (
                          <span className="inline-flex items-center gap-1 font-mono text-xs">
                            {maskId(m.idNumber, revealed)}
                            <button
                              type="button"
                              onClick={() => setRevealedIds((prev) => ({ ...prev, [m.id]: !prev[m.id] }))}
                              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label={revealed ? `Hide ID number for ${m.fullName}` : `Show ID number for ${m.fullName}`}
                            >
                              {revealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {m.phone && (
                            <Button asChild variant="ghost" size="icon-sm">
                              <a href={whatsappHref(m.phone)} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${m.fullName}`}>
                                <MessageCircle className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button asChild variant="ghost" size="icon-sm">
                            <Link href={`/${slug}/members/${m.id}`} aria-label={`Open ${m.fullName}`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </RecordPanel>
      </>
    );
  }

  const aside = (
    <>
      <RecordPanel title="Composition" icon={<Users />}>
        <div className="grid grid-cols-2 gap-2.5">
          <CompositionTile label="Adults" value={composition.adults} />
          <CompositionTile label="Minors" value={composition.minors} />
          <CompositionTile label="Residents" value={composition.residents} />
          <CompositionTile label="Abroad" value={composition.abroad} />
        </div>
        {composition.unknownAge > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            {composition.unknownAge} member{composition.unknownAge === 1 ? " has" : "s have"} no date of birth, so{" "}
            {composition.unknownAge === 1 ? "isn't" : "aren't"} counted as adult or minor.
          </p>
        )}
      </RecordPanel>

      <RecordPanel
        title="Notes"
        icon={<StickyNote />}
        action={
          <Button variant="ghost" size="sm" onClick={() => setEditFamilyOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            {family.notes ? "Edit" : "Add"}
          </Button>
        }
      >
        {family.notes ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{family.notes}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No notes for this household yet.</p>
        )}
      </RecordPanel>
    </>
  );

  return (
    <div className="max-w-6xl space-y-5">
      <RecordBackLink href={`/${slug}/families`} label="Families" />

      <RecordHeader
        media={
          <div className="rounded-2xl bg-card p-1 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/15 text-primary sm:h-24 sm:w-24">
              <Home className="h-9 w-9 sm:h-10 sm:w-10" />
            </div>
          </div>
        }
        title={family.name}
        reference={family.familyNumber ?? `FAM-${family.id.slice(0, 6).toUpperCase()}`}
        subtitle={
          head ? (
            <>
              Head of family:{" "}
              <Link href={`/${slug}/members/${head.id}`} className="font-medium text-foreground hover:underline">
                {head.fullName}
              </Link>
            </>
          ) : (
            "No head of family designated"
          )
        }
        chips={
          <>
            {!family.isActive && <RecordChip tone="muted">Inactive</RecordChip>}
            {hasFamilyStatuses && family.familyStatus && (
              <RecordChip tone={STATUS_TONE[family.familyStatus.color ?? ""] ?? "neutral"}>{family.familyStatus.name}</RecordChip>
            )}
            {family.requiresCommunitySupport && (
              <RecordChip tone="emerald" icon={<HeartHandshake />}>
                Community support{family.supportStatus ? ` · ${humanize(family.supportStatus)}` : ""}
              </RecordChip>
            )}
            {composition.yatheem > 0 && (
              <RecordChip tone="amber" icon={<HeartHandshake />}>
                {composition.yatheem} Yatheem
              </RecordChip>
            )}
            {composition.abroad > 0 && (
              <RecordChip tone="sky" icon={<Plane />}>
                {composition.abroad} abroad
              </RecordChip>
            )}
          </>
        }
        actions={
          <>
            {primaryPhone && (
              <Button asChild variant="outline" size="sm">
                <a href={whatsappHref(primaryPhone)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  WhatsApp
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "Coming soon", description: "Household certificates aren't available yet." })}
            >
              <FileText className="h-4 w-4" />
              Certificate
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditFamilyOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu
              align="right"
              items={addMemberItems}
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Add member
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              }
            />
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
                { id: "members", label: "Members", icon: <Users className="h-4 w-4" />, count: members.length },
                { id: "contributions", label: "Contributions", icon: <Receipt className="h-4 w-4" /> },
                { id: "details", label: "Details", icon: <FileText className="h-4 w-4" /> }
              ]}
            />
            {tabContent}
          </>
        }
        aside={aside}
      />

      <FamilyFormDialog
        slug={slug}
        open={editFamilyOpen}
        onOpenChange={setEditFamilyOpen}
        editingFamily={family}
        houses={houses}
        members={members}
      />
      <MemberFormDialog
        slug={slug}
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        editingMember={null}
        families={allFamilies}
        defaultFamilyId={family.id}
      />
      <AddExistingMemberDialog
        slug={slug}
        family={family}
        open={addExistingOpen}
        onOpenChange={setAddExistingOpen}
        currentMemberIds={members.map((m) => m.id)}
      />
    </div>
  );
}

function HouseholdRoleCard({
  slug,
  role,
  member,
  highlight = false,
  emptyLabel
}: {
  slug: string;
  role: string;
  member: Member | null;
  highlight?: boolean;
  emptyLabel: string;
}) {
  if (!member) {
    return (
      <div className="flex min-h-[88px] items-center justify-center rounded-xl border border-dashed border-border/80 p-4 text-center text-xs text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }
  const age = calculateAge(member.dateOfBirth);
  const details = [age !== null ? `${age} yrs` : null, member.occupation, member.phone].filter(Boolean).join(" · ");
  return (
    <Link
      href={`/${slug}/members/${member.id}`}
      className={cn(
        "group flex items-center gap-3 rounded-xl border p-4 transition-colors",
        highlight ? "border-primary/25 bg-primary/[0.06] hover:bg-primary/10" : "border-border/70 bg-card hover:bg-muted/40"
      )}
    >
      <Avatar name={member.fullName} size="lg" />
      <div className="min-w-0 flex-1">
        <p className={cn("text-[11px] font-semibold uppercase tracking-wider", highlight ? "text-primary" : "text-muted-foreground")}>{role}</p>
        <p className="truncate text-sm font-semibold text-foreground">{member.fullName}</p>
        <p className="truncate text-xs text-muted-foreground">{details || "No details recorded"}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function CompositionTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">{value}</p>
    </div>
  );
}
