import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@mahalle/ui";
import { ROOT_DOMAIN } from "@/lib/env";
import { getSession } from "@/lib/session";
import { getAllTenants, getPlatformSession } from "@/lib/platform";
import { LogoutButton } from "@/features/auth/logout-button";

export default async function ControlPlaneHomePage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();

  if (!platformSession) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
        <div className="flex items-center justify-between">
          <Badge variant="destructive">control.{ROOT_DOMAIN} &middot; platform control plane</Badge>
          <LogoutButton redirectTo="/login" />
        </div>
        <EmptyState
          title="Access denied"
          description={`${user.email} does not have a PlatformMembership. This is a completely separate authorization system from tenant roles — being an OWNER or ADMIN of any Mahalle grants no access here.`}
        />
      </main>
    );
  }

  const tenants = await getAllTenants();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <Badge variant="destructive">control.{ROOT_DOMAIN} &middot; platform control plane</Badge>
        <LogoutButton redirectTo="/login" />
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Platform overview</h1>
        <span className="text-sm text-muted-foreground">Signed in as {user.email} &middot; {platformSession.role}</span>
      </div>
      <Alert variant="warning">
        <AlertTitle>Highest-privilege application</AlertTitle>
        <AlertDescription>
          MFA, step-up auth, and stricter session policies for sensitive actions (delete
          tenant, grant Super Admin, billing changes, data export, impersonation) are
          designed in [docs/security.md] but not yet enforced.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>All Mahalles ({tenants.length})</CardTitle>
          <Button asChild size="sm" variant="outline">
            <Link href="/audit-logs">View audit logs</Link>
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
    </main>
  );
}
