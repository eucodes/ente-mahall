import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ListChecks,
  Megaphone,
  PageHeader,
  ShieldCheck,
  UsersRound,
  Users
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";

const SECTIONS = [
  { title: "Members", description: "The Mahalle's member directory.", href: "members", icon: Users },
  { title: "Families", description: "Household units within the Mahalle.", href: "families", icon: UsersRound },
  { title: "Events", description: "Scheduled Mahalle events.", href: "events", icon: Calendar },
  {
    title: "Announcements",
    description: "Public notices from the Mahalle.",
    href: "announcements",
    icon: Megaphone
  },
  { title: "Programs", description: "Ongoing Mahalle initiatives.", href: "programs", icon: ListChecks }
] as const;

export default async function TenantAdminHomePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  return (
    <>
      <PageHeader title={membership.tenant.name} description={`Your role: ${membership.role.name}`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={`/${slug}/${section.href}`} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <section.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Manage <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Link href={`/${slug}/admins`} className="group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Administrators</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add, re-role, or remove the people who help run this Mahalle.
              </p>
            </CardHeader>
            <CardContent>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Manage <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}
