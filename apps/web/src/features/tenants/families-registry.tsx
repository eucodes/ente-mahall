"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Home,
  IdCard,
  Input,
  MapPin,
  Pencil,
  Phone,
  Printer,
  Search,
  StatCard,
  Trash,
  Users,
  UsersRound,
  cn,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Family } from "@/lib/business-resources";
import type { Member } from "@/lib/members";
import type { House } from "@/lib/houses";
import { FamilyFormDialog } from "./family-form-dialog";

export interface FamiliesRegistryProps {
  slug: string;
  families: Family[];
  members: Member[];
  houses: House[];
  total: number;
}

export function FamiliesRegistry({ slug, families, members, houses, total }: FamiliesRegistryProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(families[0]?.id ?? null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Family | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const membersByFamily = useMemo(() => {
    const map = new Map<string, Member[]>();
    for (const member of members) {
      if (!member.familyId) continue;
      const list = map.get(member.familyId) ?? [];
      list.push(member);
      map.set(member.familyId, list);
    }
    return map;
  }, [members]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return families;
    return families.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.address?.toLowerCase().includes(q) ?? false) ||
        (f.phone?.toLowerCase().includes(q) ?? false)
    );
  }, [families, query]);

  const selected = families.find((f) => f.id === selectedId) ?? null;
  const selectedMembers = selected ? (membersByFamily.get(selected.id) ?? []) : [];
  const withoutFamily = members.filter((m) => !m.familyId).length;

  function openAddForm() {
    setEditingFamily(null);
    setFormOpen(true);
  }

  function openEditForm(family: Family) {
    setEditingFamily(family);
    setFormOpen(true);
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/families/${removeTarget.id}`);
      toast({ title: `Removed ${removeTarget.name}`, variant: "success" });
      if (selectedId === removeTarget.id) setSelectedId(null);
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that family.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total families" value={total} icon={<UsersRound />} tone="blue" />
        <StatCard label="On this page" value={families.length} icon={<Home />} tone="green" />
        <StatCard label="Members without a family" value={withoutFamily} hint="Out of members shown on the Members page" />
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col gap-3 lg:col-span-5">
          <div className="flex items-center gap-2">
            <Input
              leadingIcon={<Search />}
              placeholder="Search families…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={openAddForm}>Add family</Button>
          </div>

          {filtered.length === 0 ? (
            <Card className="p-0">
              <EmptyState
                title={families.length === 0 ? "No families yet" : "No families match your search"}
                description={families.length === 0 ? "Add the first one above." : "Try a different name, address, or phone."}
              />
            </Card>
          ) : (
            <ul className="space-y-2">
              {filtered.map((family) => {
                const count = membersByFamily.get(family.id)?.length ?? 0;
                const active = family.id === selectedId;
                return (
                  <li key={family.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(family.id)}
                      className={cn(
                        "relative flex w-full flex-col gap-1 overflow-hidden rounded-xl border p-4 text-left shadow-xs transition-colors",
                        active ? "border-primary/30 bg-card shadow-md" : "border-border bg-card hover:bg-muted/40"
                      )}
                    >
                      {active && <span className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden />}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Home className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{family.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{family.address ?? "No address on file"}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0 gap-1">
                          <Users className="h-3 w-3" /> {count}
                        </Badge>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="lg:col-span-7">
          {!selected ? (
            <Card className="p-0">
              <EmptyState title="Select a family" description="Choose a family from the list to see its details." />
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              <Card className="p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {selectedMembers.length} member{selectedMembers.length === 1 ? "" : "s"}
                    </Badge>
                    <h2 className="text-xl font-bold tracking-tight text-primary">{selected.name}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {selected.address ?? "No address on file"}
                    </p>
                    {selected.phone && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" /> {selected.phone}
                      </p>
                    )}
                    {selected.house && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Home className="h-4 w-4" /> House {selected.house.displayNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast({ title: "Coming soon", description: "Certificate generation isn't available yet." })}
                    >
                      <Printer className="h-4 w-4" /> Certificate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditForm(selected)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(selected)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Household members
                </p>
                {selectedMembers.length === 0 ? (
                  <EmptyState
                    title="No members linked yet"
                    description="Link members to this family from the Members page."
                  />
                ) : (
                  <ul className="divide-y divide-border">
                    {selectedMembers.map((member) => (
                      <li key={member.id} className="flex items-center gap-3 py-2.5">
                        <Avatar name={member.fullName} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{member.fullName}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {member.phone ?? member.email ?? "No contact on file"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
                <IdCard className="h-4 w-4 shrink-0" />
                Fields like ration card number and household genealogy aren&apos;t tracked yet.
              </div>
            </div>
          )}
        </div>
      </div>

      <FamilyFormDialog slug={slug} open={formOpen} onOpenChange={setFormOpen} editingFamily={editingFamily} houses={houses} />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.name ?? "this family"}?`}
        description="Members linked to this family keep their own record, but lose the family link. This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
