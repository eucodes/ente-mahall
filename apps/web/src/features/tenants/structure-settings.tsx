"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  ChevronDown,
  ChevronUp,
  EmptyState,
  Home,
  Input,
  MapPin,
  Pencil,
  Plus,
  SettingsRow,
  SettingsSection,
  StatCard,
  Switch,
  cn,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Division, FamilyStatus, Structure, StructureSummary } from "@/lib/structure";
import { DivisionFormDialog } from "./division-form-dialog";
import { FamilyStatusFormDialog } from "./family-status-form-dialog";

export interface StructureSettingsProps {
  slug: string;
  structure: Structure;
  divisions: Division[];
  familyStatuses?: FamilyStatus[];
  summary: StructureSummary | null;
}

function initialNumberingPerDivision(structure: Structure): boolean {
  if (structure.houseNumberingMethod === "PER_DIVISION") return true;
  if (structure.houseNumberingMethod === "GLOBAL") return false;
  return !structure.houseNumberPrefix;
}

function statusBadgeStyle(color?: string | null) {
  switch (color) {
    case "emerald":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
    case "blue":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
    case "amber":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
    case "purple":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
    case "rose":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800";
  }
}

export function StructureSettings({ slug, structure, divisions, familyStatuses = [], summary }: StructureSettingsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [hasDivisions, setHasDivisions] = useState(structure.hasDivisions);
  const [divisionTerm, setDivisionTerm] = useState(structure.divisionTerm ?? "Division");
  const [isNumberingPerDivision, setIsNumberingPerDivision] = useState(() => initialNumberingPerDivision(structure));
  const [houseNumberPrefix, setHouseNumberPrefix] = useState(structure.houseNumberPrefix ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const [hasFamilyStatuses, setHasFamilyStatuses] = useState(structure.hasFamilyStatuses ?? false);
  const [familyStatusTerm, setFamilyStatusTerm] = useState(structure.familyStatusTerm ?? "Category");
  const [isSavingStatusSettings, setIsSavingStatusSettings] = useState(false);
  const [statusFormOpen, setStatusFormOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<FamilyStatus | null>(null);
  const [busyStatusId, setBusyStatusId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Lists and stats follow the saved structure, so toggling a switch doesn't reveal a list before it's saved.
  const savedLabel = structure.divisionTerm || "Division";
  const savedStatusLabel = structure.familyStatusTerm || "Category";
  const draftLabel = (divisionTerm.trim() || "division").toLowerCase();

  const sortedActive = divisions.filter((d) => d.isActive).sort((a, b) => a.order - b.order);
  const inactiveDivisions = divisions.filter((d) => !d.isActive);
  const sortedActiveStatuses = familyStatuses.filter((s) => s.isActive).sort((a, b) => a.order - b.order);
  const inactiveStatuses = familyStatuses.filter((s) => !s.isActive);

  const organizationDirty =
    hasDivisions !== structure.hasDivisions ||
    divisionTerm !== (structure.divisionTerm ?? "Division") ||
    isNumberingPerDivision !== initialNumberingPerDivision(structure) ||
    houseNumberPrefix !== (structure.houseNumberPrefix ?? "");
  const statusDirty =
    hasFamilyStatuses !== (structure.hasFamilyStatuses ?? false) || familyStatusTerm !== (structure.familyStatusTerm ?? "Category");

  async function handleSaveSettings() {
    setIsSaving(true);
    try {
      await apiClient.patch(`/tenants/${slug}/structure`, {
        hasDivisions,
        divisionTerm: hasDivisions ? divisionTerm.trim() : "",
        houseNumberingMethod: hasDivisions ? (isNumberingPerDivision ? "PER_DIVISION" : "GLOBAL") : "GLOBAL",
        houseNumberPrefix: hasDivisions
          ? !isNumberingPerDivision && houseNumberPrefix.trim()
            ? houseNumberPrefix.trim().toUpperCase()
            : null
          : houseNumberPrefix.trim()
            ? houseNumberPrefix.trim().toUpperCase()
            : null
      });
      toast({ title: "Structure settings saved", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't save structure settings.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleActive(division: Division) {
    setBusyId(division.id);
    try {
      const action = division.isActive ? "deactivate" : "reactivate";
      await apiClient.patch(`/tenants/${slug}/structure/divisions/${division.id}/${action}`, {});
      toast({ title: division.isActive ? `${division.name} deactivated` : `${division.name} reactivated`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't update that entry.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(division: Division, direction: -1 | 1) {
    const index = sortedActive.findIndex((d) => d.id === division.id);
    if (!sortedActive[index + direction]) return;
    const reordered = [...sortedActive];
    [reordered[index], reordered[index + direction]] = [reordered[index + direction], reordered[index]];
    setBusyId(division.id);
    try {
      await apiClient.post(`/tenants/${slug}/structure/divisions/reorder`, { orderedIds: reordered.map((d) => d.id) });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't reorder.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveStatusSettings() {
    setIsSavingStatusSettings(true);
    try {
      await apiClient.patch(`/tenants/${slug}/structure`, {
        hasFamilyStatuses,
        familyStatusTerm: hasFamilyStatuses ? familyStatusTerm.trim() : "Category"
      });
      toast({ title: "Family category settings saved", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't save family category settings.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsSavingStatusSettings(false);
    }
  }

  async function handleToggleStatusActive(status: FamilyStatus) {
    setBusyStatusId(status.id);
    try {
      const action = status.isActive ? "deactivate" : "reactivate";
      await apiClient.patch(`/tenants/${slug}/structure/family-statuses/${status.id}/${action}`, {});
      toast({ title: status.isActive ? `${status.name} deactivated` : `${status.name} reactivated`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't update status.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusyStatusId(null);
    }
  }

  async function handleMoveStatus(status: FamilyStatus, direction: -1 | 1) {
    const index = sortedActiveStatuses.findIndex((s) => s.id === status.id);
    if (!sortedActiveStatuses[index + direction]) return;
    const reordered = [...sortedActiveStatuses];
    [reordered[index], reordered[index + direction]] = [reordered[index + direction], reordered[index]];
    setBusyStatusId(status.id);
    try {
      await apiClient.post(`/tenants/${slug}/structure/family-statuses/reorder`, { orderedIds: reordered.map((s) => s.id) });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't reorder categories.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusyStatusId(null);
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      {summary && (
        <div className={cn("grid gap-3", structure.hasDivisions ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
          {structure.hasDivisions && (
            <StatCard label={`${savedLabel}s`} value={summary.totalDivisions} tone="violet" icon={<MapPin />} />
          )}
          <StatCard
            label="Houses"
            value={summary.totalHouses}
            tone="blue"
            icon={<Home />}
            hint={`${summary.activeHouses} active · ${summary.inactiveHouses} inactive`}
          />
          {structure.hasDivisions ? (
            <StatCard
              label="Unassigned houses"
              value={summary.unassignedHouses}
              tone="amber"
              hint={`Not placed in a ${savedLabel.toLowerCase()}`}
            />
          ) : (
            <StatCard label="Active houses" value={summary.activeHouses} tone="green" icon={<Home />} />
          )}
        </div>
      )}

      <SettingsSection
        title="Organization"
        description="How families and houses are grouped throughout the app. You can change this at any time."
        footerHint={organizationDirty ? "You have unsaved changes." : undefined}
        footer={
          <Button size="sm" onClick={() => void handleSaveSettings()} isLoading={isSaving} disabled={!organizationDirty}>
            Save
          </Button>
        }
      >
        <SettingsRow label="Divisions" description="Split the Mahallu into wards, areas, or zones.">
          <Switch checked={hasDivisions} onCheckedChange={setHasDivisions} aria-label="Split the Mahallu into divisions" />
        </SettingsRow>

        {hasDivisions && (
          <SettingsRow
            label="What do you call them?"
            description="Used everywhere in the app, e.g. Ward, Area, Zone, or Mohalla."
            htmlFor="settings-division-term"
          >
            <Input
              id="settings-division-term"
              className="md:max-w-xs"
              placeholder="e.g. Ward"
              value={divisionTerm}
              onChange={(e) => setDivisionTerm(e.target.value)}
            />
          </SettingsRow>
        )}

        {hasDivisions && (
          <SettingsRow label="House numbering" description={`Whether each ${draftLabel} uses its own code, or one code covers the whole Mahallu.`}>
            <div role="radiogroup" aria-label="House numbering" className="grid w-full gap-2 md:max-w-sm">
              <NumberingOption
                selected={isNumberingPerDivision}
                onSelect={() => setIsNumberingPerDivision(true)}
                title={`Separate code per ${draftLabel}`}
                example={`Each ${draftLabel} sets its own code, e.g. KBD01, KBD02`}
              />
              <NumberingOption
                selected={!isNumberingPerDivision}
                onSelect={() => setIsNumberingPerDivision(false)}
                title="One code for the whole Mahallu"
                example="The same code everywhere, e.g. MH01, MH02"
              />
            </div>
          </SettingsRow>
        )}

        {(!hasDivisions || !isNumberingPerDivision) && (
          <SettingsRow label="House number prefix" description="The code placed before every house number." htmlFor="house-number-prefix">
            <Input
              id="house-number-prefix"
              className="font-mono uppercase md:max-w-[180px]"
              placeholder="e.g. MH"
              value={houseNumberPrefix}
              onChange={(e) => setHouseNumberPrefix(e.target.value.toUpperCase())}
            />
          </SettingsRow>
        )}
      </SettingsSection>

      {structure.hasDivisions && (
        <SettingsSection
          title={`${savedLabel}s`}
          description={`Add, rename, reorder, or deactivate the ${savedLabel.toLowerCase()}s this Mahallu is split into.`}
          actions={
            <Button
              size="sm"
              onClick={() => {
                setEditingDivision(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add {savedLabel.toLowerCase()}
            </Button>
          }
          flush
        >
          {divisions.length === 0 ? (
            <EmptyState title={`No ${savedLabel.toLowerCase()}s yet`} description={`Add the first ${savedLabel.toLowerCase()} to start grouping houses.`} />
          ) : (
            <ul className="divide-y divide-border/60">
              {[...sortedActive, ...inactiveDivisions].map((division) => {
                const activeIndex = sortedActive.findIndex((d) => d.id === division.id);
                return (
                  <ListRow
                    key={division.id}
                    busy={busyId === division.id}
                    isActive={division.isActive}
                    canMoveUp={activeIndex > 0}
                    canMoveDown={activeIndex !== -1 && activeIndex < sortedActive.length - 1}
                    onMoveUp={() => void handleMove(division, -1)}
                    onMoveDown={() => void handleMove(division, 1)}
                    onEdit={() => {
                      setEditingDivision(division);
                      setFormOpen(true);
                    }}
                    onToggleActive={() => void handleToggleActive(division)}
                    name={division.name}
                    code={division.code}
                    description={division.description}
                  />
                );
              })}
            </ul>
          )}
        </SettingsSection>
      )}

      <SettingsSection
        title="Family categories"
        description="Classify households into tiers or groups, e.g. Category A, Category B, Welfare, or Zakat eligible."
        footerHint={statusDirty ? "You have unsaved changes." : undefined}
        footer={
          <Button size="sm" onClick={() => void handleSaveStatusSettings()} isLoading={isSavingStatusSettings} disabled={!statusDirty}>
            Save
          </Button>
        }
      >
        <SettingsRow
          label="Use family categories"
          description="When on, categories appear when adding or editing a family, and in the family registry."
        >
          <Switch checked={hasFamilyStatuses} onCheckedChange={setHasFamilyStatuses} aria-label="Use family categories" />
        </SettingsRow>
        {hasFamilyStatuses && (
          <SettingsRow label="What do you call them?" description="e.g. Category, Status, Slab, or Class." htmlFor="status-term">
            <Input
              id="status-term"
              className="md:max-w-xs"
              placeholder="e.g. Category"
              value={familyStatusTerm}
              onChange={(e) => setFamilyStatusTerm(e.target.value)}
            />
          </SettingsRow>
        )}
      </SettingsSection>

      {structure.hasFamilyStatuses && (
        <SettingsSection
          title={`${savedStatusLabel} list`}
          description={`The ${savedStatusLabel.toLowerCase()} values a household can be given.`}
          actions={
            <Button
              size="sm"
              onClick={() => {
                setEditingStatus(null);
                setStatusFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add {savedStatusLabel.toLowerCase()}
            </Button>
          }
          flush
        >
          {familyStatuses.length === 0 ? (
            <EmptyState
              title={`No ${savedStatusLabel.toLowerCase()}s yet`}
              description={`Add your first ${savedStatusLabel.toLowerCase()} to start classifying households.`}
            />
          ) : (
            <ul className="divide-y divide-border/60">
              {[...sortedActiveStatuses, ...inactiveStatuses].map((status) => {
                const activeIndex = sortedActiveStatuses.findIndex((s) => s.id === status.id);
                return (
                  <ListRow
                    key={status.id}
                    busy={busyStatusId === status.id}
                    isActive={status.isActive}
                    canMoveUp={activeIndex > 0}
                    canMoveDown={activeIndex !== -1 && activeIndex < sortedActiveStatuses.length - 1}
                    onMoveUp={() => void handleMoveStatus(status, -1)}
                    onMoveDown={() => void handleMoveStatus(status, 1)}
                    onEdit={() => {
                      setEditingStatus(status);
                      setStatusFormOpen(true);
                    }}
                    onToggleActive={() => void handleToggleStatusActive(status)}
                    name={
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                          statusBadgeStyle(status.color)
                        )}
                      >
                        {status.name}
                      </span>
                    }
                    code={status.code}
                    description={status.description}
                  />
                );
              })}
            </ul>
          )}
        </SettingsSection>
      )}

      <DivisionFormDialog
        slug={slug}
        open={formOpen}
        onOpenChange={setFormOpen}
        editingDivision={editingDivision}
        divisionTerm={savedLabel}
      />
      <FamilyStatusFormDialog
        slug={slug}
        open={statusFormOpen}
        onOpenChange={setStatusFormOpen}
        editingStatus={editingStatus}
        statusTerm={savedStatusLabel}
      />
    </div>
  );
}

function NumberingOption({
  selected,
  onSelect,
  title,
  example
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  example: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:bg-muted/40"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-primary" : "border-input"
        )}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{example}</span>
      </span>
    </button>
  );
}

function ListRow({
  name,
  code,
  description,
  isActive,
  busy,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onToggleActive
}: {
  name: React.ReactNode;
  code: string | null;
  description: string | null;
  isActive: boolean;
  busy: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
}) {
  const label = typeof name === "string" ? name : "entry";
  return (
    <li className="flex items-center gap-3 px-4 py-3 sm:px-6">
      <div className="flex w-7 shrink-0 flex-col items-center">
        {isActive && (
          <>
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp || busy}
              aria-label={`Move ${label} up`}
              className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown || busy}
              aria-label={`Move ${label} down`}
              className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("truncate text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>{name}</span>
          {code && (
            <code className="rounded-md border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground">
              {code}
            </code>
          )}
          {!isActive && <Badge variant="outline">Inactive</Badge>}
        </div>
        {description && <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label={`Edit ${label}`}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" isLoading={busy} onClick={onToggleActive}>
          {isActive ? "Deactivate" : "Reactivate"}
        </Button>
      </div>
    </li>
  );
}
