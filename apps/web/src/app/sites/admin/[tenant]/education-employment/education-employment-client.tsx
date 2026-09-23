"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  PageHeader,
  Briefcase,
  GraduationCap,
  Users,
  Search,
  School,
  Plane,
  ChevronRight,
  ExternalLink,
  Phone,
  Tag
} from "@mahalle/ui";
import type { EducationEmploymentStats } from "@/lib/education-employment";
import type { Member, EducationLevel, EmploymentStatus } from "@/lib/members";

interface EducationEmploymentClientProps {
  slug: string;
  initialStats: EducationEmploymentStats | null;
  initialMembers: Member[];
  total: number;
}

type TabType = "all" | "job-seekers" | "students" | "expatriates" | "skills-bank";

export function EducationEmploymentClient({
  slug,
  initialStats,
  initialMembers
}: EducationEmploymentClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");
  const [selectedEducation, setSelectedEducation] = useState<string>("all");
  const [selectedEmployment, setSelectedEmployment] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Filter members client-side over loaded members
  const filteredMembers = useMemo(() => {
    return initialMembers.filter((m) => {
      // Search query filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = m.fullName.toLowerCase().includes(q);
        const matchJob = (m.jobTitle || m.occupation || "").toLowerCase().includes(q);
        const matchEmployer = (m.employerOrBusiness || "").toLowerCase().includes(q);
        const matchSkills = (m.skills || []).some((s) => s.toLowerCase().includes(q));
        const matchInstitution = (m.institution || "").toLowerCase().includes(q);
        const matchCountry = (m.expatriateCountry || "").toLowerCase().includes(q);
        const matchExpatRole = (m.expatriateOccupation || "").toLowerCase().includes(q);
        if (
          !matchName &&
          !matchJob &&
          !matchEmployer &&
          !matchSkills &&
          !matchInstitution &&
          !matchCountry &&
          !matchExpatRole
        ) {
          return false;
        }
      }

      // Tab filter
      if (activeTab === "job-seekers") {
        if (!m.isJobSeeker) return false;
      } else if (activeTab === "students") {
        const isStudent =
          m.employmentStatus === "STUDENT" ||
          m.educationLevel === "HIGHER_SECONDARY" ||
          m.educationLevel === "GRADUATE" ||
          m.educationLevel === "POST_GRADUATE" ||
          (m.occupation && m.occupation.toLowerCase().includes("student"));
        if (!isStudent) return false;
      } else if (activeTab === "expatriates") {
        if (!m.isExpatriate) return false;
      } else if (activeTab === "skills-bank") {
        if (!m.skills || m.skills.length === 0) return false;
        if (selectedSkill && !m.skills.includes(selectedSkill)) return false;
      }

      // Education filter dropdown
      if (selectedEducation !== "all" && m.educationLevel !== selectedEducation) {
        return false;
      }

      // Employment filter dropdown
      if (selectedEmployment !== "all" && m.employmentStatus !== selectedEmployment) {
        return false;
      }

      return true;
    });
  }, [initialMembers, search, activeTab, selectedEducation, selectedEmployment, selectedSkill]);

  const jobSeekersCount = initialStats?.jobSeekers ?? initialMembers.filter((m) => m.isJobSeeker).length;
  const employedCount =
    (initialStats?.employed ?? 0) + (initialStats?.selfEmployedOrBusiness ?? 0);
  const studentsCount =
    (initialStats?.students ?? 0) + (initialStats?.higherEducation ?? 0);
  const expatriatesCount =
    initialStats?.expatriates ?? initialMembers.filter((m) => m.isExpatriate).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Education & Employment"
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          onClick={() => {
            setActiveTab("all");
            setSelectedSkill(null);
          }}
          className={`border-border/60 cursor-pointer transition-all hover:border-primary/50 hover:shadow-xs ${
            activeTab === "all" ? "ring-2 ring-primary/40 bg-primary/5" : ""
          }`}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Employed / Business
              </p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{employedCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => {
            setActiveTab("students");
            setSelectedSkill(null);
          }}
          className={`border-border/60 cursor-pointer transition-all hover:border-emerald-500/50 hover:shadow-xs ${
            activeTab === "students" ? "ring-2 ring-emerald-500/40 bg-emerald-500/5" : ""
          }`}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Students & Higher Ed
              </p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{studentsCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => {
            setActiveTab("job-seekers");
            setSelectedSkill(null);
          }}
          className={`border-amber-500/20 bg-amber-500/5 cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-xs ${
            activeTab === "job-seekers" ? "ring-2 ring-amber-500/50 bg-amber-500/15" : ""
          }`}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Seeking Jobs
              </p>
              <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                {jobSeekersCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => {
            setActiveTab("expatriates");
            setSelectedSkill(null);
          }}
          className={`border-blue-500/20 bg-blue-500/5 cursor-pointer transition-all hover:border-blue-500/50 hover:shadow-xs ${
            activeTab === "expatriates" ? "ring-2 ring-blue-500/50 bg-blue-500/15" : ""
          }`}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Expatriates / NRIs
              </p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{expatriatesCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Skills Cloud */}
      {initialStats?.topSkills && initialStats.topSkills.length > 0 && (
        <Card className="border-border/60 bg-muted/20">
          <CardContent className="p-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
              <Tag className="h-3.5 w-3.5" />
              Skills Inventory:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedSkill(null);
                setActiveTab("skills-bank");
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedSkill === null && activeTab === "skills-bank"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              }`}
            >
              All Skills ({initialStats.topSkills.reduce((a, b) => a + b.count, 0)})
            </button>
            {initialStats.topSkills.map((s) => (
              <button
                key={s.skill}
                type="button"
                onClick={() => {
                  setSelectedSkill(s.skill === selectedSkill ? null : s.skill);
                  setActiveTab("skills-bank");
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedSkill === s.skill && activeTab === "skills-bank"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
              >
                {s.skill} <span className="text-[10px] opacity-70 ml-1">({s.count})</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation Tabs and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSelectedSkill(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              All Profiles ({initialMembers.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("job-seekers");
                setSelectedSkill(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "job-seekers"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
              }`}
            >
              <span>Job Seekers Desk</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-current font-bold">
                {jobSeekersCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("students");
                setSelectedSkill(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "students"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
              }`}
            >
              <span>Higher Ed & Students</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-current font-bold">
                {studentsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("expatriates");
                setSelectedSkill(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "expatriates"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-blue-700 dark:text-blue-400 hover:bg-blue-500/10"
              }`}
            >
              <Plane className="h-3.5 w-3.5" />
              <span>Expatriates / NRIs</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-current font-bold">
                {expatriatesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("skills-bank")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "skills-bank"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>Skills Bank</span>
              {selectedSkill && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary-foreground/20 text-current font-bold">
                  {selectedSkill}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Input
                leadingIcon={<Search />}
                placeholder="Search member, skill, job..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Member Table */}
        <Card className="border-border/60 overflow-hidden">
          {filteredMembers.length === 0 ? (
            <CardContent className="p-8">
              <EmptyState
                title="No members match this view"
                description={
                  search
                    ? `No matching records found for "${search}".`
                    : "No members found in this education or employment category."
                }
              />
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Education Level</th>
                    <th className="py-3 px-4">Employment & Occupation</th>
                    <th className="py-3 px-4">Skills & Talents</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembers.map((m) => (
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
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground">
                            {m.educationLevel ? m.educationLevel.replace("_", " ") : "Not specified"}
                          </span>
                          {m.educationDetails && (
                            <span className="text-[11px] text-muted-foreground truncate max-w-xs">
                              {m.educationDetails}
                            </span>
                          )}
                          {m.institution && (
                            <span className="text-[11px] text-muted-foreground italic flex items-center gap-1">
                              <School className="h-3 w-3" />
                              {m.institution}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {m.isJobSeeker && (
                              <Badge
                                variant="outline"
                                className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold"
                              >
                                Seeking Job
                              </Badge>
                            )}
                            {m.isExpatriate && (
                              <Badge
                                variant="outline"
                                className="border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold flex items-center gap-1"
                              >
                                <Plane className="h-2.5 w-2.5" />
                                <span>NRI {m.expatriateCountry ? `(${m.expatriateCountry})` : ""}</span>
                              </Badge>
                            )}
                            {m.employmentStatus && (
                              <span className="font-medium text-foreground text-xs">
                                {m.employmentStatus.replace("_", " ")}
                              </span>
                            )}
                          </div>
                          {(m.jobTitle || m.occupation || m.expatriateOccupation) && (
                            <span className="text-[11px] text-muted-foreground">
                              {m.jobTitle || m.occupation || m.expatriateOccupation}
                              {m.employerOrBusiness ? ` @ ${m.employerOrBusiness}` : ""}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {m.skills && m.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {m.skills.map((skill, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSelectedSkill(skill);
                                  setActiveTab("skills-bank");
                                }}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">No skills listed</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {m.phone ? (
                          <a
                            href={`tel:${m.phone}`}
                            className="font-mono text-muted-foreground hover:text-primary flex items-center gap-1 text-[11px]"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{m.phone}</span>
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/${slug}/members/${m.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground hover:bg-primary hover:text-primary-foreground text-xs font-medium transition-colors"
                        >
                          <span>View Profile</span>
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
      </div>
    </div>
  );
}
