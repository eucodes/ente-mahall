"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Search,
  UsersRound,
  Home,
  Check,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Division } from "@/lib/structure";
import type { Family } from "@/lib/business-resources";

export interface AssignFamilyDialogProps {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  division: Division;
  term: string;
  divisionCode?: string;
}

export function AssignFamilyDialog({
  slug,
  open,
  onOpenChange,
  division,
  term,
  divisionCode
}: AssignFamilyDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [families, setFamilies] = useState<Family[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [houseNumberInput, setHouseNumberInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePrefix = divisionCode || division.code || "";

  useEffect(() => {
    if (open) {
      setError(null);
      setSelectedFamilyId(null);
      setHouseNumberInput("");
      setSearchQuery("");
      setIsLoading(true);

      apiClient
        .get<{ families: Family[]; total: number }>(`/tenants/${slug}/families?status=all&pageSize=100`)
        .then((res) => {
          setFamilies(res.families ?? []);
        })
        .catch(() => {
          setError("Failed to load existing families.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, slug]);

  const selectedFamily = families.find((f) => f.id === selectedFamilyId);

  const filteredFamilies = families.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      (f.familyNumber && f.familyNumber.toLowerCase().includes(q)) ||
      (f.phone && f.phone.includes(q)) ||
      (f.address && f.address.toLowerCase().includes(q)) ||
      (f.house?.displayNumber && f.house.displayNumber.toLowerCase().includes(q))
    );
  });

  const handleAssign = async () => {
    if (!selectedFamily) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const rawNum = houseNumberInput.trim();
      const finalHouseNumber =
        activePrefix && rawNum && !rawNum.toUpperCase().startsWith(activePrefix.toUpperCase())
          ? `${activePrefix}${rawNum}`
          : rawNum;

      // 1. If the family already has a house, update that house's division
      if (selectedFamily.houseId) {
        await apiClient.patch(`/tenants/${slug}/houses/${selectedFamily.houseId}`, {
          divisionId: division.id,
          ...(finalHouseNumber ? { displayNumber: finalHouseNumber } : {})
        });
      } else if (finalHouseNumber) {
        // 2. Family has no house, create one in this division and link it
        try {
          const houseRes = await apiClient.post<{ house: { id: string } }>(`/tenants/${slug}/houses`, {
            displayNumber: finalHouseNumber,
            divisionId: division.id,
            address: selectedFamily.address || undefined
          });
          if (houseRes?.house?.id) {
            await apiClient.patch(`/tenants/${slug}/families/${selectedFamily.id}`, {
              houseId: houseRes.house.id
            });
          }
        } catch {
          // ignore if house already exists or restricted
        }
      }

      // 3. Update family notes to record the assigned division jurisdiction
      const existingNotes = selectedFamily.notes || "";
      let updatedNotes = existingNotes;
      if (/Ward:\s*[^|]+/i.test(updatedNotes)) {
        updatedNotes = updatedNotes.replace(/Ward:\s*[^|]+/i, `Ward: ${division.name}`);
      } else if (/Division:\s*[^|]+/i.test(updatedNotes)) {
        updatedNotes = updatedNotes.replace(/Division:\s*[^|]+/i, `Ward: ${division.name}`);
      } else {
        updatedNotes = [existingNotes, `Ward: ${division.name}`].filter(Boolean).join(" | ");
      }

      await apiClient.patch(`/tenants/${slug}/families/${selectedFamily.id}`, {
        notes: updatedNotes || undefined
      });

      toast({
        title: "Family Assigned",
        description: `${selectedFamily.name} has been assigned to ${division.name}.`,
        variant: "success"
      });

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to assign family to this division.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-primary" />
            <span>Assign Existing Family to {division.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <p className="text-xs text-muted-foreground">
            Select an existing registered household from the Mahallu to assign or relocate to{" "}
            <strong>{division.name}</strong> {term.toLowerCase()}.
          </p>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search family name, door no, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs bg-muted/30"
            />
          </div>

          {/* Families List */}
          <div className="border border-border rounded-xl max-h-56 overflow-y-auto divide-y divide-border bg-background">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-muted-foreground">Loading families...</div>
            ) : filteredFamilies.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                {searchQuery ? `No families match "${searchQuery}".` : "No existing families found."}
              </div>
            ) : (
              filteredFamilies.map((fam) => {
                const isSelected = fam.id === selectedFamilyId;
                const currentWardNote = fam.notes?.match(/Ward:\s*([^|]+)/i)?.[1]?.trim();
                const isAlreadyHere = fam.house?.divisionId === division.id || currentWardNote === division.name;

                return (
                  <button
                    key={fam.id}
                    type="button"
                    onClick={() => {
                      setSelectedFamilyId(fam.id);
                      if (fam.house?.displayNumber) {
                        setHouseNumberInput(
                          fam.house.displayNumber.startsWith(activePrefix)
                            ? fam.house.displayNumber.slice(activePrefix.length)
                            : fam.house.displayNumber
                        );
                      }
                    }}
                    className={`w-full p-3 text-left transition-colors flex items-center justify-between gap-3 ${
                      isSelected ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground truncate">{fam.name}</span>
                        {fam.familyNumber && (
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded border border-border">
                            {fam.familyNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                        {fam.house ? (
                          <span className="flex items-center gap-1">
                            <Home className="h-3 w-3 text-primary" />
                            House #{fam.house.displayNumber}
                          </span>
                        ) : (
                          <span>Unassigned House</span>
                        )}
                        {currentWardNote && (
                          <>
                            <span>•</span>
                            <span className="text-muted-foreground">Ward: {currentWardNote}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isAlreadyHere && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          In {division.name}
                        </span>
                      )}
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Selected Family Details & Optional House Number */}
          {selectedFamily && (
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 space-y-3 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Selected: {selectedFamily.name}</span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {selectedFamily.familyNumber || ""}
                </span>
              </div>

              <FormField
                label={`Door / House Number in ${division.name}`}
                htmlFor="assign-house-num"
                hint={
                  activePrefix
                    ? `Prefixed with ${activePrefix} for ${division.name}`
                    : "Enter house door number for this division"
                }
              >
                <div className="flex rounded-md border border-input bg-background shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-ring">
                  {activePrefix ? (
                    <div className="bg-muted px-3 py-2 text-xs font-mono font-bold text-foreground border-r border-border flex items-center select-none flex-shrink-0">
                      {activePrefix}
                    </div>
                  ) : null}
                  <input
                    id="assign-house-num"
                    className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground min-w-0"
                    placeholder={activePrefix ? "01" : "e.g. 12/450-A"}
                    value={houseNumberInput}
                    onChange={(e) => setHouseNumberInput(e.target.value)}
                  />
                </div>
              </FormField>
            </div>
          )}
        </div>

        <DialogFooter className="pt-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selectedFamilyId}
            isLoading={isSubmitting}
            onClick={handleAssign}
          >
            Assign to {division.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
