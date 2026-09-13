import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getHouse } from "@/lib/houses";
import { getFamilies } from "@/lib/business-resources";
import { getMembers } from "@/lib/members";
import { getStructure } from "@/lib/structure";
import { RELATION_TO_HEAD_LABELS } from "@/lib/member-constants";
import { EditHouseButton } from "@/features/tenants/edit-house-button";

export default async function HouseDetailPage({ params }: { params: Promise<{ tenant: string; houseId: string }> }) {
  const { tenant: slug, houseId } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [house, structureData] = await Promise.all([
    getHouse(slug, houseId),
    getStructure(slug)
  ]);
  if (!house) notFound();

  const divisions = structureData?.divisions ?? [];
  const familiesResult = await getFamilies(slug, 1, 50, { houseId });
  const families = familiesResult?.items ?? [];

  // Members belong to a Family, not directly to a House — this house's
  // members are the union of every linked family's members. Families per
  // house are realistically few, so one lookup per family stays cheap.
  const membersByFamily = await Promise.all(
    families.map(async (family) => ({
      family,
      members: (await getMembers(slug, 1, 100, { familyId: family.id }))?.members ?? []
    }))
  );
  const totalMembers = membersByFamily.reduce((sum, entry) => sum + entry.members.length, 0);

  return (
    <>
      <PageHeader
        title={`House #${house.displayNumber}`}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {house.division && <Badge variant="outline">{house.division.name}</Badge>}
            <Badge variant={house.isActive ? "secondary" : "outline"}>{house.isActive ? "Active" : "Inactive"}</Badge>
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href={`/${slug}/houses`} className="text-sm font-medium text-primary hover:underline">
              ← All houses
            </Link>
            <EditHouseButton slug={slug} house={house} divisions={divisions} />
          </div>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>House Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">House number</p>
              <p className="mt-1 font-medium">{house.displayNumber}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">House name</p>
              <p className="mt-1">{house.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Division</p>
              <p className="mt-1">{house.division?.name ?? "This Mahallu does not use subdivisions."}</p>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</p>
              <p className="mt-1">{house.address ?? "—"}</p>
            </div>
            {house.notes && (
              <div className="col-span-2 sm:col-span-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-wrap">{house.notes}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Created</p>
              <p className="mt-1">{new Date(house.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last updated</p>
              <p className="mt-1">{new Date(house.updatedAt).toLocaleDateString("en-IN")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {families.length === 0 ? (
              <EmptyState title="No family has been linked to this house yet." />
            ) : (
              <ul className="divide-y divide-border">
                {families.map((family) => (
                  <li key={family.id} className="flex items-center justify-between px-6 py-3 text-sm">
                    <div>
                      <Link href={`/${slug}/families/${family.id}`} className="font-medium text-primary hover:underline">
                        {family.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{family.familyNumber ?? "—"}</p>
                    </div>
                    <Badge variant={family.isActive ? "secondary" : "outline"}>{family.isActive ? "Active" : "Inactive"}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members ({totalMembers})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {totalMembers === 0 ? (
              <EmptyState
                title="No members have been registered for this house yet."
                action={
                  families.length === 0 ? undefined : (
                    <Link href={`/${slug}/members`} className="text-sm font-medium text-primary hover:underline">
                      Add one from the Members Directory →
                    </Link>
                  )
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {membersByFamily.flatMap(({ family, members }) =>
                  members.map((member) => (
                    <li key={member.id} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                      <div>
                        <p className="font-medium">{member.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.relationToHead ? RELATION_TO_HEAD_LABELS[member.relationToHead] : "—"}
                          {families.length > 1 ? ` · ${family.name}` : ""}
                        </p>
                      </div>
                      <Badge variant={member.movementStatus === "RESIDENT" ? "secondary" : "outline"}>
                        {member.movementStatus}
                      </Badge>
                    </li>
                  ))
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EmptyState title="No history to show yet." description="Changes to this house will appear here." />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
