import { getPlatformRolesMatrix, getAllUsers } from "@/lib/platform";
import { RolesPermissionsView } from "@/features/platform/roles-permissions-view";

export default async function PlatformRolesPage() {
  const [matrix, allUsers] = await Promise.all([
    getPlatformRolesMatrix(),
    getAllUsers()
  ]);

  if (!matrix) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Failed to load platform roles matrix.
      </div>
    );
  }

  return <RolesPermissionsView matrix={matrix} allUsers={allUsers} />;
}
