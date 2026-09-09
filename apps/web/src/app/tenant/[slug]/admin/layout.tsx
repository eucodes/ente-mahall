import { RequireRole } from "@/lib/auth/require-role";

export default function TenantAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={["MAHALL_ADMIN", "STAFF"]} redirectTo="/login">
      {children}
    </RequireRole>
  );
}
