"use client";

import { usePathname } from "next/navigation";
import { RequireRole } from "@/lib/auth/require-role";

// Note: middleware rewrites admin.example.com/* to /admin/* server-side only.
// Client-side navigation (usePathname, router.push, <Link>) always sees the
// real browser path — "/login", not "/admin/login" — since the rewrite is
// invisible to the client.
export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") return <>{children}</>;

  return (
    <RequireRole roles={["SUPER_ADMIN"]} redirectTo="/login">
      {children}
    </RequireRole>
  );
}
