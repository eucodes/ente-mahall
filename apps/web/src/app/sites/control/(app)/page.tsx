import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Building,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PageHeader,
  ScrollText,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getAllTenants, getPlatformSession } from "@/lib/platform";

export default async function ControlPlaneHomePage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();

  if (!platformSession) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState
            title="Access denied"
            description={`${user.email} does not have a PlatformMembership. This is a completely separate authorization system from tenant roles — being an OWNER or ADMIN of any Mahalle grants no access here.`}
          />
        </CardContent>
      </Card>
    );
  }

  const tenants = await getAllTenants();
  const activeCount = tenants.filter((t) => t.isActive).length;
  const totalMembers = tenants.reduce((sum, t) => sum + t.memberCount, 0);

  return (
    <>
      <PageHeader
        title="Platform overview"
        description={`Signed in as ${user.email} · ${platformSession.role}`}
      />

      <Alert variant="warning" className="mb-6">
        <AlertTitle>Highest-privilege application</AlertTitle>
        <AlertDescription>
          MFA, step-up auth, and stricter session policies for sensitive actions (delete
          tenant, grant Super Admin, billing changes, data export, impersonation) are
          designed in [docs/security.md] but not yet enforced.
        </AlertDescription>
      </Alert>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Mahalles" value={tenants.length} icon={<Building className="h-5 w-5" />} />
        <StatCard label="Active" value={activeCount} hint={`${tenants.length - activeCount} inactive`} />
        <StatCard label="Total members" value={totalMembers} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>All Mahalles</CardTitle>
          <Button asChild size="sm" variant="outline">
            <Link href="/audit-logs">
              <ScrollText className="h-4 w-4" /> View audit logs
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {tenants.length === 0 ? (
            <EmptyState title="No Mahalles yet" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell className="text-muted-foreground">{tenant.slug}</TableCell>
                    <TableCell>{tenant.memberCount}</TableCell>
                    <TableCell>
                      <Badge variant={tenant.isActive ? "success" : "outline"}>
                        {tenant.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
