# Feature Synchronization Rule: Admin Panel & Control Panel

## Golden Rule of Platform Feature Parity
Whenever a feature, module, operational capability, or data entity is added, updated, or modified in the **Tenant Admin Panel** (`admin.mahalle.test:3000` / `apps/web/src/app/sites/admin`), **it must immediately be mirrored and made accessible in the Superadmin Control Panel** (`control.mahalle.test:3000` / `apps/web/src/features/platform/tenant-command-center.tsx`).

---

### Invariants & Requirements

1. **Unrestricted Operational Access for Superadmins**:
   - Platform Superadmins (`PlatformMembership` with role `SUPER_ADMIN` or `PLATFORM_STAFF`) possess root platform authority.
   - Any operational action a Mahalle Admin can perform (managing members, families, houses, finance vouchers, dues, nikah registers, death registers, aid services, events, etc.) can also be performed or inspected by a Superadmin in the Control Panel without any "Support Mode" gate or hindrance.
   - The backend `TenantContextGuard` and `PermissionGuard` automatically elevate Superadmins, allowing all tenant-scoped endpoints to execute smoothly.

2. **Feature Flag Precedence & Enforceability**:
   - Every module (e.g. `marriage-register`, `death-register`, `finance`, `events`, `announcements`, `programs`, `services`, `madrassa`, etc.) is guarded by platform feature flags.
   - If a feature is disabled globally or overridden to `disabled` for a specific Mahalle:
     1. **Backend Enforceability**: The API controller rejects all requests for that feature with `403 Forbidden` (`FeatureGuard` / `@RequireFeature`).
     2. **Frontend Enforceability**: The navigation sidebar (`AdminShell`) hides all related sub-navigation links for that Mahalle.
     3. **Control Panel Toggles**: Superadmins can toggle any feature flag ON or OFF in real-time from the Mahalle's Feature Flags tab in the Control Panel.

3. **Checklist When Introducing Any New Admin Feature**:
   - [ ] Add the feature key to `Feature` catalogue (in `seed.ts` and database).
   - [ ] Apply `@RequireFeature("<feature-key>")` and `FeatureGuard` to the API controllers.
   - [ ] Add corresponding navigation item in `apps/web/src/features/navigation/admin-shell.tsx` wrapped with `!isFeatureDisabled("<feature-key>")`.
   - [ ] Update `TenantOperationsViewer` (`apps/web/src/features/platform/tenant-operations-viewer.tsx`) to expose the new operational capability to Superadmins.
   - [ ] Ensure `PlatformTenantAccessController` or direct tenant routes allow Superadmin mutations.

