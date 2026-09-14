"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Select,
  FormField,
  Avatar,
  Badge,
  Spinner,
  Search,
  UserCheck,
  AlertCircle,
  UserPlus,
  Users,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import {
  RELATION_TO_HEAD_LABELS,
  BLOOD_GROUP_LABELS,
  type RelationToHead
} from "@/lib/member-constants";
import type { Member } from "@/lib/members";

export interface AddExistingMemberDialogProps {
  slug: string;
  family: { id: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMemberIds?: string[];
}

export function AddExistingMemberDialog({
  slug,
  family,
  open,
  onOpenChange,
  currentMemberIds = []
}: AddExistingMemberDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [relationToHead, setRelationToHead] = useState<RelationToHead>("OTHER");
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tenant members when dialog opens
  useEffect(() => {
    if (!open) return;

    setError(null);
    setSelectedMemberId("");
    setSearchQuery("");
    setRelationToHead("OTHER");
    setIsLoading(true);

    apiClient
      .get<{ members: Member[]; meta?: { total: number } }>(
        `/tenants/${slug}/members?page=1&pageSize=100`
      )
      .then(async (res) => {
        let loaded = res.members || [];
        const total = res.meta?.total ?? loaded.length;
        if (total > 100) {
          const totalPages = Math.ceil(total / 100);
          const pageRequests = [];
          for (let p = 2; p <= Math.min(totalPages, 5); p++) {
            pageRequests.push(
              apiClient.get<{ members: Member[] }>(
                `/tenants/${slug}/members?page=${p}&pageSize=100`
              )
            );
          }
          const results = await Promise.allSettled(pageRequests);
          results.forEach((r) => {
            if (r.status === "fulfilled" && r.value.members) {
              loaded = loaded.concat(r.value.members);
            }
          });
        }
        setAllMembers(loaded);
      })
      .catch((err) => {
        const msg =
          err instanceof ApiError
            ? err.message
            : "Failed to load members directory.";
        setError(msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [open, slug]);

  // Filter out members already in this family
  const availableMembers = useMemo(() => {
    const currentSet = new Set(currentMemberIds);
    return allMembers.filter(
      (m) => m.familyId !== family.id && !currentSet.has(m.id)
    );
  }, [allMembers, family.id, currentMemberIds]);

  // Filter by search query
  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return availableMembers.slice(0, 30);
    return availableMembers
      .filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          (m.phone && m.phone.toLowerCase().includes(q)) ||
          (m.idNumber && m.idNumber.toLowerCase().includes(q)) ||
          m.id.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [availableMembers, searchQuery]);

  const selectedMember = useMemo(() => {
    return allMembers.find((m) => m.id === selectedMemberId) || null;
  }, [allMembers, selectedMemberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) {
      setError("Please select a member to add to this family.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.patch(`/tenants/${slug}/members/${selectedMemberId}`, {
        familyId: family.id,
        relationToHead
      });

      toast({
        title: "Member Added",
        description: `${selectedMember?.fullName || "Member"} was successfully linked to ${family.name}.`
      });

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Failed to attach member to family.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Add Existing Member
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Attach an existing Mahallu member to the{" "}
                <span className="font-semibold text-foreground">
                  {family.name}
                </span>{" "}
                family
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Search Existing Member */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Select Mahallu Member <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, phone, or member ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-2xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-border/90 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-2xs"
              />
            </div>

            {/* List of members */}
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-2 max-h-52 overflow-y-auto divide-y divide-border/40">
              {isLoading ? (
                <div className="flex items-center justify-center py-6 gap-2 text-xs text-muted-foreground">
                  <Spinner className="h-4 w-4" />
                  <span>Loading directory members...</span>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  {searchQuery
                    ? "No available members match your search."
                    : "No unlinked members found."}
                </div>
              ) : (
                filteredMembers.map((m) => {
                  const isSelected = selectedMemberId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setError(null);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                          : "hover:bg-background/80 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar
                          name={m.fullName}
                          size="sm"
                          className="h-8 w-8 text-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate">
                              {m.fullName}
                            </span>
                            {m.bloodGroup && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                {BLOOD_GROUP_LABELS[m.bloodGroup] || m.bloodGroup}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                            {m.phone && <span>{m.phone}</span>}
                            {m.family?.name && (
                              <span className="truncate">
                                Currently: {m.family.name}
                              </span>
                            )}
                            {!m.familyId && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                Unassigned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 ml-2">
                          <UserCheck className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Member Preview & Relationship Selection */}
          {selectedMember && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  Selected Member
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  #{selectedMember.id.slice(0, 6).toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Avatar
                  name={selectedMember.fullName}
                  size="md"
                  className="h-9 w-9 text-xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {selectedMember.fullName}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {selectedMember.gender || "Gender unspecified"}
                    {selectedMember.phone ? ` • ${selectedMember.phone}` : ""}
                  </p>
                </div>
              </div>

              {selectedMember.family && (
                <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Moving from <strong>{selectedMember.family.name}</strong> to{" "}
                    <strong>{family.name}</strong>.
                  </span>
                </div>
              )}

              {/* Relationship Field */}
              <div className="pt-1">
                <FormField
                  label="Relation to Family Head"
                  required
                  id="relationToHead"
                >
                  <Select
                    id="relationToHead"
                    value={relationToHead}
                    onChange={(e) =>
                      setRelationToHead(e.target.value as RelationToHead)
                    }
                    className="h-10 text-xs rounded-xl"
                  >
                    {Object.entries(RELATION_TO_HEAD_LABELS).map(
                      ([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      )
                    )}
                  </Select>
                </FormField>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!selectedMemberId || isSubmitting}
              className="rounded-xl text-xs h-9 px-4 gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="h-3.5 w-3.5" />
                  <span>Linking...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Add to Family</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
