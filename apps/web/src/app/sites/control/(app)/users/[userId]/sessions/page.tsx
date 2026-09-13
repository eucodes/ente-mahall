import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getPlatformSession, getPlatformUsers, getUserSessions } from "@/lib/platform";
import { UserSessionsTable } from "@/features/platform/user-sessions-table";

export default async function PlatformUserSessionsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const [users, sessions] = await Promise.all([getPlatformUsers(), getUserSessions(userId)]);
  const target = users.find((u) => u.user.id === userId);

  return (
    <>
      <PageHeader
        title={target ? `${target.user.fullName}'s sessions` : "Sessions"}
        description="Every recorded sign-in for this platform user."
      />

      <div className="mb-6">
        <Link href="/users" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; All platform users
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <UserSessionsTable sessions={sessions} />
        </CardContent>
      </Card>
    </>
  );
}
