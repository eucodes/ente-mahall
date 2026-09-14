"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  Input,
  PageHeader,
  Heart,
  Lock,
  Search,
  ChevronRight,
  ExternalLink,
  Phone,
  Activity,
  ShieldAlert,
  Users,
  Home,
  useToast
} from "@mahalle/ui";
import type { HealthSupportStats } from "@/lib/health-support";
import type { Member } from "@/lib/members";
import type { Family } from "@/lib/business-resources";

interface HealthSupportClientProps {
  slug: string;
  initialStats: HealthSupportStats | null;
  initialMembers: Member[];
  initialFamilies: Family[];
  totalMembers: number;
}

type TabType = "welfare" | "chronic" | "disability" | "assistance" | "families";

export function HealthSupportClient({
  slug,
  initialStats,
  initialMembers,
  initialFamilies
}: HealthSupportClientProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("welfare");
  const [search, setSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  // Filter members client-side
  const filteredMembers = useMemo(() => {
    return initialMembers.filter((m) => {
      const hp = m.healthProfile;

      // Text search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = m.fullName.toLowerCase().includes(q);
        const matchConditions = (hp?.chronicConditions || []).some((c) => c.toLowerCase().includes(q));
        const matchDisability = (hp?.disabilityType || "").toLowerCase().includes(q);
        const matchNotes = (hp?.supportNotes || hp?.chronicDetails || "").toLowerCase().includes(q);
        const matchCategory = (hp?.supportCategory || "").toLowerCase().includes(q);
        if (!matchName && !matchConditions && !matchDisability && !matchNotes && !matchCategory) {
          return false;
        }
      }

      // Condition filter
      if (selectedCondition) {
        if (!hp?.chronicConditions || !hp.chronicConditions.includes(selectedCondition)) {
          return false;
        }
      }

      // Tab filter
      if (activeTab === "welfare") {
        return Boolean(hp?.requiresCommunitySupport);
      } else if (activeTab === "chronic") {
        return Boolean(hp?.hasChronicIllness || (hp?.chronicConditions && hp.chronicConditions.length > 0));
      } else if (activeTab === "disability") {
        return Boolean(hp?.hasDisability);
      } else if (activeTab === "assistance") {
        return Boolean(hp?.requiresAssistance || hp?.primaryCaregiverName);
      }

      return true;
    });
  }, [initialMembers, search, activeTab, selectedCondition]);

  // Filter families client-side
  const filteredFamilies = useMemo(() => {
    return initialFamilies.filter((f) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchCat = (f.supportCategory || "").toLowerCase().includes(q);
        const matchNotes = (f.supportNotes || "").toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchNotes) return false;
      }
      return Boolean(f.requiresCommunitySupport);
    });
  }, [initialFamilies, search]);

  const chronicCount = initialStats?.hasChronicIllness ?? initialMembers.filter((m) => m.healthProfile?.hasChronicIllness).length;
  const medicineCount = initialStats?.requiresRegularMedication ?? initialMembers.filter((m) => m.healthProfile?.regularMedicationRequired).length;
  const disabilityCount = initialStats?.hasDisability ?? initialMembers.filter((m) => m.healthProfile?.hasDisability).length;
  const assistanceCount = initialStats?.requiresAssistance ?? initialMembers.filter((m) => m.healthProfile?.requiresAssistance).length;
  const activeWelfareTotal =
    (initialStats?.activeWelfareMembers ?? 0) + (initialStats?.activeWelfareFamilies ?? 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Health & Support Register"
        description="Confidential healthcare registry, chronic condition care, disability assistance, and community welfare aid."
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-400">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Chronic Illness
              </p>
              <h3 className="text-lg font-bold text-rose-800 dark:text-rose-300 mt-0.5">{chronicCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Medicine Aid
              </p>
              <h3 className="text-lg font-bold text-rose-800 dark:text-rose-300 mt-0.5">{medicineCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Disability Aid
              </p>
              <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mt-0.5">{disabilityCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-700 dark:text-purple-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                Care Assistance
              </p>
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mt-0.5">{assistanceCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5 col-span-2 lg:col-span-1">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Active Welfare
              </p>
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                {activeWelfareTotal}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Chronic Conditions Filter Cloud */}
      {initialStats?.topChronicConditions && initialStats.topChronicConditions.length > 0 && (
        <Card className="border-border/60 bg-muted/20">
          <CardContent className="p-3.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
              <Activity className="h-3.5 w-3.5" />
              Reported Conditions:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedCondition(null);
                setActiveTab("chronic");
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedCondition === null && activeTab === "chronic"
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-background text-foreground border-border hover:border-rose-500/50"
              }`}
            >
              All Conditions
            </button>
            {initialStats.topChronicConditions.map((c) => (
              <button
                key={c.condition}
                type="button"
                onClick={() => {
                  setSelectedCondition(c.condition === selectedCondition ? null : c.condition);
                  setActiveTab("chronic");
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedCondition === c.condition && activeTab === "chronic"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-background text-foreground border-border hover:border-rose-500/50"
                }`}
              >
                {c.condition} <span className="text-[10px] opacity-70 ml-1">({c.count})</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation Tabs and Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("welfare");
                setSelectedCondition(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "welfare"
                  ? "bg-emerald-600 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Active Welfare Aid</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("chronic");
                setSelectedCondition(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "chronic"
                  ? "bg-rose-600 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Chronic Illness & Medicine</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("disability");
                setSelectedCondition(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "disability"
                  ? "bg-amber-600 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Disability Register</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-current font-bold">
                {disabilityCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("assistance");
                setSelectedCondition(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "assistance"
                  ? "bg-purple-600 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Care & Bedridden</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("families");
                setSelectedCondition(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "families"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Welfare Households ({initialFamilies.filter((f) => f.requiresCommunitySupport).length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Input
              leadingIcon={<Search />}
              placeholder="Search health or welfare cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* Tab 5: Welfare Households */}
        {activeTab === "families" ? (
          <Card className="border-border/60 overflow-hidden">
            {filteredFamilies.length === 0 ? (
              <CardContent className="p-8">
                <EmptyState
                  title="No welfare households found"
                  description={
                    search
                      ? `No families match "${search}".`
                      : "No families currently marked as requiring community welfare support."
                  }
                />
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-[11px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Family / Household</th>
                      <th className="py-3 px-4">Welfare Category</th>
                      <th className="py-3 px-4">Support Status</th>
                      <th className="py-3 px-4">Emergency Contact</th>
                      <th className="py-3 px-4">Case Notes</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredFamilies.map((f) => (
                      <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">
                          <Link
                            href={`/${slug}/families/${f.id}`}
                            className="font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            <span>{f.name}</span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          </Link>
                          {f.house?.displayNumber && (
                            <span className="text-[11px] text-muted-foreground">
                              House #{f.house.displayNumber}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-semibold text-foreground">
                          {f.supportCategory || "General Welfare Aid"}
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              f.supportStatus === "ACTIVE"
                                ? "destructive"
                                : f.supportStatus === "MONITORING"
                                ? "outline"
                                : "secondary"
                            }
                            className="text-[10px] font-bold"
                          >
                            {f.supportStatus || "ACTIVE"}
                          </Badge>
                        </td>

                        <td className="py-3 px-4">
                          {f.emergencyContactPhone ? (
                            <div className="flex flex-col gap-0.5 text-[11px]">
                              <span className="font-medium text-foreground">
                                {f.emergencyContactName || "Emergency Contact"}
                              </span>
                              <a
                                href={`tel:${f.emergencyContactPhone}`}
                                className="font-mono text-primary hover:underline flex items-center gap-1"
                              >
                                <Phone className="h-3 w-3" />
                                <span>{f.emergencyContactPhone}</span>
                              </a>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-[11px]">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-muted-foreground text-[11px] max-w-xs truncate">
                          {f.supportNotes || "—"}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/${slug}/families/${f.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground hover:bg-primary hover:text-primary-foreground text-xs font-medium transition-colors"
                          >
                            <span>Open Record</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ) : (
          /* Members Table for Welfare, Chronic, Disability, Assistance tabs */
          <Card className="border-border/60 overflow-hidden">
            {filteredMembers.length === 0 ? (
              <CardContent className="p-8">
                <EmptyState
                  title="No healthcare or support records found"
                  description={
                    search
                      ? `No records match "${search}".`
                      : "No members currently recorded in this healthcare or support category."
                  }
                />
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-[11px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Member</th>
                      <th className="py-3 px-4">Condition / Diagnosis</th>
                      <th className="py-3 px-4">Support & Medicine</th>
                      <th className="py-3 px-4">Care & Emergency</th>
                      <th className="py-3 px-4">Welfare Case Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMembers.map((m) => {
                      const hp = m.healthProfile;
                      return (
                        <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground">
                            <Link
                              href={`/${slug}/members/${m.id}`}
                              className="font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                              <span>{m.fullName}</span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            </Link>
                            <span className="text-[11px] text-muted-foreground">
                              {m.gender} • {m.relationToHead || "Member"}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              {hp?.hasDisability && (
                                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                                  <ShieldAlert className="h-3 w-3" />
                                  {hp.disabilityType ? hp.disabilityType.replace("_", " ") : "Disability"}
                                  {hp.disabilityPercentage && ` (${hp.disabilityPercentage}%)`}
                                </span>
                              )}

                              {hp?.chronicConditions && hp.chronicConditions.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {hp.chronicConditions.map((c, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-[10px] font-medium"
                                    >
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              ) : !hp?.hasDisability ? (
                                <span className="text-muted-foreground italic text-[11px]">
                                  No condition recorded
                                </span>
                              ) : null}

                              {hp?.chronicDetails && (
                                <span className="text-[11px] text-muted-foreground truncate max-w-xs">
                                  {hp.chronicDetails}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              {hp?.regularMedicationRequired && (
                                <Badge
                                  variant="outline"
                                  className="border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 text-[10px] font-bold w-fit"
                                >
                                  Regular Medication Aid
                                </Badge>
                              )}
                              {hp?.requiresAssistance && (
                                <span className="text-[11px] text-muted-foreground">
                                  Assistance: {hp.assistanceTypes?.join(", ") || "General care"}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-0.5 text-[11px]">
                              {hp?.primaryCaregiverName && (
                                <span className="text-foreground">
                                  Caregiver: <strong>{hp.primaryCaregiverName}</strong> ({hp.caregiverRelationship || "Family"})
                                </span>
                              )}
                              {hp?.emergencyContactPhone ? (
                                <a
                                  href={`tel:${hp.emergencyContactPhone}`}
                                  className="font-mono text-primary hover:underline flex items-center gap-1"
                                >
                                  <Phone className="h-3 w-3" />
                                  <span>{hp.emergencyContactPhone}</span>
                                </a>
                              ) : m.phone ? (
                                <a
                                  href={`tel:${m.phone}`}
                                  className="font-mono text-muted-foreground hover:text-primary flex items-center gap-1"
                                >
                                  <Phone className="h-3 w-3" />
                                  <span>{m.phone}</span>
                                </a>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            {hp?.requiresCommunitySupport ? (
                              <div className="flex flex-col gap-0.5">
                                <Badge
                                  variant={
                                    hp.supportStatus === "ACTIVE"
                                      ? "destructive"
                                      : hp.supportStatus === "MONITORING"
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className="text-[10px] font-bold w-fit"
                                >
                                  {hp.supportStatus || "ACTIVE"}
                                </Badge>
                                <span className="text-[11px] font-medium text-foreground">
                                  {hp.supportCategory || "General Aid"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-[11px]">Not Enrolled</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/${slug}/members/${m.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground hover:bg-primary hover:text-primary-foreground text-xs font-medium transition-colors"
                            >
                              <span>View Details</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
