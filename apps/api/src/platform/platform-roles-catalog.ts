export interface PlatformPermissionItem {
  key: string;
  name: string;
  description: string;
}

export interface PlatformPermissionCategory {
  category: string;
  permissions: PlatformPermissionItem[];
}

export const PLATFORM_PERMISSION_CATEGORIES: PlatformPermissionCategory[] = [
  {
    category: "Fleet & Mahalles",
    permissions: [
      { key: "platform.tenants.view", name: "View Mahalles", description: "Browse all Mahalles and view their profiles and stats" },
      { key: "platform.tenants.provision", name: "Provision Mahalle", description: "Deploy and configure fresh Mahalle workspaces" },
      { key: "platform.tenants.update", name: "Configure Mahalle", description: "Modify settings, subscriptions, and active status" },
      { key: "platform.tenants.delete", name: "Delete Mahalle", description: "Permanently delete Mahalles and associated data" },
      { key: "platform.tenants.support", name: "Support Mode", description: "Access tenant spaces with audited reason logging" }
    ]
  },
  {
    category: "User Directory & Access",
    permissions: [
      { key: "platform.users.view", name: "View Directory", description: "View statewide user accounts and Mahalle assignments" },
      { key: "platform.users.create", name: "Create User", description: "Provision new platform operators and tenant users" },
      { key: "platform.users.update", name: "Update Profile", description: "Change user names, contact emails, and phone numbers" },
      { key: "platform.users.roles", name: "Platform Role Grant", description: "Promote or demote users to platform roles" },
      { key: "platform.users.reset_password", name: "Reset Password", description: "Directly reset user passwords" },
      { key: "platform.users.terminate_sessions", name: "Terminate Sessions", description: "Force disconnect user login sessions" },
      { key: "platform.users.delete", name: "Delete Users", description: "Permanently remove users from the platform" }
    ]
  },
  {
    category: "Feature Flags & Catalogue",
    permissions: [
      { key: "platform.features.view", name: "View Features", description: "Inspect system canonical features and tenant overrides" },
      { key: "platform.features.manage", name: "Toggle Features", description: "Enable or disable feature modules globally or per tenant" }
    ]
  },
  {
    category: "Plans & Billing",
    permissions: [
      { key: "platform.plans.view", name: "View Plans", description: "Browse subscription tiers, pricing, and active quotas" },
      { key: "platform.plans.manage", name: "Manage Plans", description: "Create, modify, and retire subscription plans" },
      { key: "platform.billing.invoices", name: "Manage Invoices", description: "Issue invoices and record fleet subscription payments" }
    ]
  },
  {
    category: "Audit & Security",
    permissions: [
      { key: "platform.audit.view", name: "Audit Stream", description: "Inspect immutable system audit log records" },
      { key: "platform.telemetry.view", name: "System Telemetry", description: "Monitor database connections, redis cache, and server uptime" }
    ]
  },
  {
    category: "System Settings",
    permissions: [
      { key: "platform.settings.view", name: "View Settings", description: "Read platform global policies and configuration" },
      { key: "platform.settings.manage", name: "Update Settings", description: "Modify platform configuration, timeout, and defaults" }
    ]
  }
];

export const DEFAULT_PLATFORM_ROLE_PERMISSIONS: Record<string, string[] | "*"> = {
  SUPER_ADMIN: "*",
  PLATFORM_STAFF: [
    "platform.tenants.view",
    "platform.tenants.provision",
    "platform.tenants.update",
    "platform.tenants.support",
    "platform.users.view",
    "platform.users.create",
    "platform.users.update",
    "platform.features.view",
    "platform.features.manage",
    "platform.plans.view",
    "platform.billing.invoices",
    "platform.audit.view",
    "platform.telemetry.view",
    "platform.settings.view"
  ],
  PLATFORM_SUPPORT: [
    "platform.tenants.view",
    "platform.tenants.support",
    "platform.users.view",
    "platform.features.view",
    "platform.audit.view",
    "platform.telemetry.view"
  ]
};
