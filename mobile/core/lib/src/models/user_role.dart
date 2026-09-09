// Mirrors the Prisma `UserRole` enum in apps/backend/prisma/schema.prisma.
enum UserRole { superAdmin, mahallAdmin, staff, member }

UserRole userRoleFromJson(String value) => switch (value) {
      'SUPER_ADMIN' => UserRole.superAdmin,
      'MAHALL_ADMIN' => UserRole.mahallAdmin,
      'STAFF' => UserRole.staff,
      'MEMBER' => UserRole.member,
      _ => throw ArgumentError('Unknown UserRole: $value'),
    };
