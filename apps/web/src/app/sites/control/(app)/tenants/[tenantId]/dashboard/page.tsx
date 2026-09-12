import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PageHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import {
  getPlatformSession,
  getPlatformTenant,
  getTenantAdmins,
  getTenantAnnouncements,
  getTenantEvents,
  getTenantFamilies,
  getTenantMembers,
  getTenantPrograms
} from "@/lib/platform";

const PAGE_SIZE = 20;
const SECTIONS = ["members", "families", "events", "announcements", "programs", "admins"] as const;
type Section = (typeof SECTIONS)[number];

function isSection(value: string | undefined): value is Section {
  return !!value && (SECTIONS as readonly string[]).includes(value);
}

export default async function PlatformTenantDashboardPage({
  params,
  searchParams
}: {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<{ section?: string; page?: string }>;
}) {
  const { tenantId } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const tenant = await getPlatformTenant(tenantId);
  if (!tenant) {
    notFound();
  }

  const { section: sectionParam, page: pageParam } = await searchParams;
  const section: Section = isSection(sectionParam) ? sectionParam : "members";
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const hrefFor = (s: Section, p = 1) => `/tenants/${tenantId}/dashboard?section=${s}&page=${p}`;

  return (
    <>
      <PageHeader
        title={`${tenant.name} — dashboard`}
        description="The same operational data this Mahalle's own admins see, viewed from the control plane."
        actions={<Badge variant={tenant.isActive ? "success" : "outline"}>{tenant.isActive ? "Active" : "Suspended"}</Badge>}
      />

      <div className="mb-6 flex items-center justify-between">
        <Link href={`/tenants/${tenantId}`} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; Back to Mahalle settings
        </Link>
      </div>

      <nav className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {SECTIONS.map((s) => (
          <Link
            key={s}
            href={hrefFor(s)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              s === section ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {s}
          </Link>
        ))}
      </nav>

      {section === "members" && <MembersSection tenantId={tenantId} page={page} hrefFor={hrefFor} />}
      {section === "families" && <FamiliesSection tenantId={tenantId} page={page} hrefFor={hrefFor} />}
      {section === "events" && <EventsSection tenantId={tenantId} page={page} hrefFor={hrefFor} />}
      {section === "announcements" && <AnnouncementsSection tenantId={tenantId} page={page} hrefFor={hrefFor} />}
      {section === "programs" && <ProgramsSection tenantId={tenantId} page={page} hrefFor={hrefFor} />}
      {section === "admins" && <AdminsSection tenantId={tenantId} />}
    </>
  );
}

type HrefFor = (s: Section, p?: number) => string;

async function MembersSection({ tenantId, page, hrefFor }: { tenantId: string; page: number; hrefFor: HrefFor }) {
  const result = await getTenantMembers(tenantId, page, PAGE_SIZE);
  if (!result) return <FailedToLoad />;
  return (
    <SectionCard title={`${result.total} member${result.total === 1 ? "" : "s"}`}>
      {result.items.length === 0 ? (
        <EmptyState title="No members yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Family</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.items.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{m.phone ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{m.family?.name ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Pagination page={page} pageSize={PAGE_SIZE} total={result.total} hrefForPage={(p) => hrefFor("members", p)} />
    </SectionCard>
  );
}

async function FamiliesSection({ tenantId, page, hrefFor }: { tenantId: string; page: number; hrefFor: HrefFor }) {
  const result = await getTenantFamilies(tenantId, page, PAGE_SIZE);
  if (!result) return <FailedToLoad />;
  return (
    <SectionCard title={`${result.total} famil${result.total === 1 ? "y" : "ies"}`}>
      {result.items.length === 0 ? (
        <EmptyState title="No families yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.items.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.name}</TableCell>
                <TableCell className="text-muted-foreground">{f.address ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{f.phone ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Pagination page={page} pageSize={PAGE_SIZE} total={result.total} hrefForPage={(p) => hrefFor("families", p)} />
    </SectionCard>
  );
}

async function EventsSection({ tenantId, page, hrefFor }: { tenantId: string; page: number; hrefFor: HrefFor }) {
  const result = await getTenantEvents(tenantId, page, PAGE_SIZE);
  if (!result) return <FailedToLoad />;
  return (
    <SectionCard title={`${result.total} event${result.total === 1 ? "" : "s"}`}>
      {result.items.length === 0 ? (
        <EmptyState title="No events yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Starts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.items.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.title}</TableCell>
                <TableCell className="text-muted-foreground">{e.location ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(e.startsAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Pagination page={page} pageSize={PAGE_SIZE} total={result.total} hrefForPage={(p) => hrefFor("events", p)} />
    </SectionCard>
  );
}

async function AnnouncementsSection({ tenantId, page, hrefFor }: { tenantId: string; page: number; hrefFor: HrefFor }) {
  const result = await getTenantAnnouncements(tenantId, page, PAGE_SIZE);
  if (!result) return <FailedToLoad />;
  return (
    <SectionCard title={`${result.total} announcement${result.total === 1 ? "" : "s"}`}>
      {result.items.length === 0 ? (
        <EmptyState title="No announcements yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Published</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.items.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {a.publishedAt ? new Date(a.publishedAt).toLocaleString() : "Draft"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Pagination page={page} pageSize={PAGE_SIZE} total={result.total} hrefForPage={(p) => hrefFor("announcements", p)} />
    </SectionCard>
  );
}

async function ProgramsSection({ tenantId, page, hrefFor }: { tenantId: string; page: number; hrefFor: HrefFor }) {
  const result = await getTenantPrograms(tenantId, page, PAGE_SIZE);
  if (!result) return <FailedToLoad />;
  return (
    <SectionCard title={`${result.total} program${result.total === 1 ? "" : "s"}`}>
      {result.items.length === 0 ? (
        <EmptyState title="No programs yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.description ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Pagination page={page} pageSize={PAGE_SIZE} total={result.total} hrefForPage={(p) => hrefFor("programs", p)} />
    </SectionCard>
  );
}

async function AdminsSection({ tenantId }: { tenantId: string }) {
  const admins = await getTenantAdmins(tenantId);
  if (!admins) return <FailedToLoad />;
  return (
    <SectionCard title={`${admins.length} administrator${admins.length === 1 ? "" : "s"}`}>
      {admins.length === 0 ? (
        <EmptyState title="No administrators" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.user.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{a.user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{a.role.name}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SectionCard>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function FailedToLoad() {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-muted-foreground">Couldn&apos;t load this section.</CardContent>
    </Card>
  );
}
