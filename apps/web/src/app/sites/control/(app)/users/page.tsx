import { getAllUsers, getAllTenants } from "@/lib/platform";
import { UsersManagementView } from "@/features/platform/users-management-view";

export default async function PlatformUsersPage() {
  const [users, tenants] = await Promise.all([
    getAllUsers(),
    getAllTenants()
  ]);

  return <UsersManagementView initialUsers={users} tenants={tenants} />;
}
