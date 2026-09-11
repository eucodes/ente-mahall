import { redirect } from "next/navigation";
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
    <>
      <PageHeader title="Audit logs" description="Every security-relevant event, platform-wide." />
      <Card>
        <CardHeader>
          <CardTitle>{total} entr{total === 1 ? "y" : "ies"}</CardTitle>
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
    </>
  );
}
