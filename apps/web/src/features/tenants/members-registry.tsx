"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  ConfirmDialog,
  Droplet,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  EmptyState,
  HeartHandshake,
  IdCard,
  Input,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plane,
  Printer,
  Search,
  Select,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Trash,
  Users,
  UsersRound,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { BLOOD_GROUP_LABELS, MOVEMENT_STATUS_LABELS, RELATION_TO_HEAD_LABELS } from "@/lib/member-constants";
import type { Member } from "@/lib/members";
import type { Family } from "@/lib/business-resources";
import { MemberFormDialog } from "./member-form-dialog";

export interface MembersRegistryProps {
  slug: string;
  members: Member[];
  families: Family[];
  total: number;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export function MembersRegistry({ slug, members, families, total }: MembersRegistryProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((member) => {
      if (familyFilter && member.familyId !== familyFilter) return false;
      if (!q) return true;
      return (
        member.fullName.toLowerCase().includes(q) ||
        (member.email?.toLowerCase().includes(q) ?? false) ||
        (member.phone?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [members, query, familyFilter]);

  const withFamily = members.filter((m) => m.familyId).length;
  const yatheemCount = members.filter((m) => m.isYatheem).length;
  const expatriateCount = members.filter((m) => m.isExpatriate).length;

  function openAddForm() {
    setEditingMember(null);
    setFormOpen(true);
  }

  function openEditForm(member: Member) {
    setEditingMember(member);
    setFormOpen(true);
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/members/${removeTarget.id}`);
      toast({ title: `Removed ${removeTarget.fullName}`, variant: "success" });
      setRemoveTarget(null);
      setSelected(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that member.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total members" value={total} icon={<Users />} tone="violet" />
        <StatCard label="Families" value={families.length} icon={<UsersRound />} tone="blue" />
        <StatCard
          label="On this page"
          value={`${members.length} of ${total}`}
          hint={`${withFamily} linked to a family · ${yatheemCount} yatheem · ${expatriateCount} expatriate`}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <Input
            leadingIcon={<Search />}
            placeholder="Search name, email, or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={familyFilter} onChange={(e) => setFamilyFilter(e.target.value)} className="sm:max-w-[200px]">
            <option value="">All families</option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={openAddForm}>Add member</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={members.length === 0 ? "No members yet" : "No members match your search"}
          description={members.length === 0 ? "Add the first one above." : "Try a different name, email, phone, or family."}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => (
                <TableRow key={member.id} className="cursor-pointer" onClick={() => setSelected(member)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={member.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{member.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{member.email ?? "No email"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.phone ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{member.family?.name ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.movementStatus !== "RESIDENT" && (
                        <Badge variant="outline">{MOVEMENT_STATUS_LABELS[member.movementStatus]}</Badge>
                      )}
                      {member.bloodGroup && (
                        <Badge variant="secondary" className="gap-1">
                          <Droplet className="h-3 w-3" /> {BLOOD_GROUP_LABELS[member.bloodGroup]}
                        </Badge>
                      )}
                      {member.isYatheem && (
                        <Badge variant="secondary" className="gap-1">
                          <HeartHandshake className="h-3 w-3" /> Yatheem
                        </Badge>
                      )}
                      {member.isExpatriate && (
                        <Badge variant="secondary" className="gap-1">
                          <Plane className="h-3 w-3" /> Expatriate
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(member)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(member)}>
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <MemberFormDialog slug={slug} open={formOpen} onOpenChange={setFormOpen} editingMember={editingMember} families={families} />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.fullName ?? "this member"}?`}
        description="This removes them from the member directory. This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />

      <Drawer open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DrawerContent>
          {selected && (
            <>
              <DrawerHeader>
                <div className="flex items-center gap-3">
                  <Avatar name={selected.fullName} size="lg" />
                  <div className="min-w-0">
                    <DrawerTitle className="truncate">{selected.fullName}</DrawerTitle>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selected.family && <Badge variant="secondary">{selected.family.name}</Badge>}
                      {selected.relationToHead && <Badge variant="outline">{RELATION_TO_HEAD_LABELS[selected.relationToHead]}</Badge>}
                    </div>
                  </div>
                </div>
              </DrawerHeader>
              <DrawerBody>
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selected.email ?? "No email on file"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selected.phone ?? "No phone on file"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selected.address ?? "No address on file"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Personal</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <span className="text-muted-foreground">Gender</span>
                    <span>{selected.gender ? selected.gender[0] + selected.gender.slice(1).toLowerCase() : "—"}</span>
                    <span className="text-muted-foreground">Date of birth</span>
                    <span>{formatDate(selected.dateOfBirth)}</span>
                    <span className="text-muted-foreground">Blood group</span>
                    <span>{selected.bloodGroup ? BLOOD_GROUP_LABELS[selected.bloodGroup] : "—"}</span>
                    <span className="text-muted-foreground">Marital status</span>
                    <span>{selected.maritalStatus ? selected.maritalStatus[0] + selected.maritalStatus.slice(1).toLowerCase() : "—"}</span>
                    <span className="text-muted-foreground">Occupation</span>
                    <span>{selected.occupation ?? "—"}</span>
                    <span className="text-muted-foreground">ID number</span>
                    <span>{selected.idNumber ?? "—"}</span>
                  </div>
                </div>

                {selected.movementStatus !== "RESIDENT" && (
                  <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Residency history</p>
                    <p className="text-sm font-medium">
                      {MOVEMENT_STATUS_LABELS[selected.movementStatus]}
                      {selected.movementDate ? ` since ${formatDate(selected.movementDate)}` : ""}
                    </p>
                    {selected.movementNotes && <p className="text-sm text-muted-foreground">{selected.movementNotes}</p>}
                  </div>
                )}

                {selected.isYatheem && (
                  <div className="space-y-1.5 rounded-xl border border-border bg-muted/40 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <HeartHandshake className="h-3.5 w-3.5" /> Yatheem register
                    </p>
                    <p className="text-sm">Guardian: {selected.guardianName ?? "—"}</p>
                    <p className="text-sm text-muted-foreground">{selected.guardianPhone ?? "No guardian phone on file"}</p>
                  </div>
                )}

                {selected.isExpatriate && (
                  <div className="space-y-1.5 rounded-xl border border-border bg-muted/40 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Plane className="h-3.5 w-3.5" /> Expatriate register
                    </p>
                    <p className="text-sm">{selected.expatriateCountry ?? "Country not on file"}</p>
                    <p className="text-sm text-muted-foreground">{selected.expatriateOccupation ?? "Occupation not on file"}</p>
                    <p className="text-sm text-muted-foreground">{selected.expatriateContact ?? "No contact on file"}</p>
                  </div>
                )}

                <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-md">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-xl"
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80">
                      Mahalle member card
                    </span>
                    <IdCard className="h-5 w-5 opacity-80" />
                  </div>
                  <p className="relative mt-3 text-lg font-bold">{selected.fullName}</p>
                  <p className="relative text-xs text-primary-foreground/80">{selected.family?.name ?? "No family on file"}</p>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toast({ title: "Coming soon", description: "Printable ID cards aren't available yet." })}
                >
                  <Printer className="h-4 w-4" /> Print ID
                </Button>
                <Button className="flex-1" onClick={() => openEditForm(selected)}>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
