import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getAuditLogs, getPlatformSession } from "@/lib/platform";

const PAGE_SIZE = 25;

export default async function AuditLogsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { entries, total } = await getAuditLogs(page, PAGE_SIZE);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Audit logs</h1>
        <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; Platform overview
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Every security-relevant event, platform-wide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.length === 0 ? (
            <EmptyState title="No audit log entries yet" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Mahalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.action}</Badge>
                      </TableCell>
                      <TableCell>{entry.actor?.email ?? <span className="text-muted-foreground">system</span>}</TableCell>
                      <TableCell>{entry.tenant?.name ?? <span className="text-muted-foreground">&mdash;</span>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination page={page} pageSize={PAGE_SIZE} total={total} hrefForPage={(p) => `/audit-logs?page=${p}`} />
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
