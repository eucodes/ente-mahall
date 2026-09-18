export interface SystemFeatureDefinition {
  key: string;
  name: string;
  description: string;
  category: string;
  isEnabledGlobally: boolean;
}

export const SYSTEM_FEATURES: SystemFeatureDefinition[] = [
  // Core & Directory
  {
    key: "members",
    name: "Members Directory",
    description: "Official census, demographic registry, and individual profiles of all Mahallu residents.",
    category: "Core & Directory",
    isEnabledGlobally: true
  },
  {
    key: "families",
    name: "Families Registry",
    description: "Household units, dwelling allocations, and household genealogy trees.",
    category: "Core & Directory",
    isEnabledGlobally: true
  },
  {
    key: "divisions",
    name: "Wards & Divisions",
    description: "Jurisdictional area divisions, ward assignments, and localized clustering.",
    category: "Core & Directory",
    isEnabledGlobally: true
  },

  // Finance & Accounting
  {
    key: "finance",
    name: "Finance & Collections",
    description: "Operational collections, monthly subscriptions, dues tracking, and payment receipts.",
    category: "Finance & Accounts",
    isEnabledGlobally: true
  },
  {
    key: "accounting",
    name: "Professional Accounting",
    description: "Double-entry general ledger, chart of accounts, cash & bank books, trial balance, and financial statements.",
    category: "Finance & Accounts",
    isEnabledGlobally: true
  },

  // Official Registers
  {
    key: "marriage-register",
    name: "Marriage (Nikah) Register",
    description: "Official Islamic marriage records, counter certificates, and register logs.",
    category: "Official Registers",
    isEnabledGlobally: true
  },
  {
    key: "death-register",
    name: "Death (Mayyith) Register",
    description: "Death registrations, burial records, and certified register exports.",
    category: "Official Registers",
    isEnabledGlobally: true
  },
  {
    key: "divorce-register",
    name: "Divorce (Talaq) Register",
    description: "Official divorce record tracking and certified archival documentation.",
    category: "Official Registers",
    isEnabledGlobally: true
  },
  {
    key: "release-register",
    name: "Mahallu Release (NOC)",
    description: "Official clearance and No Objection Certificates for members moving to other jurisdictions.",
    category: "Official Registers",
    isEnabledGlobally: true
  },
  {
    key: "grave-register",
    name: "Grave Allocation (Kabarsthan)",
    description: "Cemetery lot numbering, burial slot allotments, and Kabarsthan management.",
    category: "Official Registers",
    isEnabledGlobally: true
  },
  {
    key: "madrassa",
    name: "Madrassa & Dars",
    description: "Madrassa student enrollments, academic rosters, and teacher records.",
    category: "Official Registers",
    isEnabledGlobally: true
  },
  {
    key: "property-register",
    name: "Waqf & Property Register",
    description: "Masjid assets, endowment land, commercial properties, and tenant agreements.",
    category: "Official Registers",
    isEnabledGlobally: true
  },

  // Community & Governance
  {
    key: "committee",
    name: "Executive Committee",
    description: "Committee office bearers, portfolio designations, and official meeting minutes.",
    category: "Community & Governance",
    isEnabledGlobally: true
  },
  {
    key: "services",
    name: "Welfare & Community Aid",
    description: "Zakat distribution, medical aid, education scholarships, and relief schemes.",
    category: "Community & Governance",
    isEnabledGlobally: true
  },
  {
    key: "events",
    name: "Events & Calendar",
    description: "Islamic events, community gatherings, and program scheduling.",
    category: "Community & Governance",
    isEnabledGlobally: true
  },
  {
    key: "announcements",
    name: "Announcements & Circulars",
    description: "Noticeboard updates, public broadcasts, and targeted member alerts.",
    category: "Community & Governance",
    isEnabledGlobally: true
  },
  {
    key: "programs",
    name: "Programs & Activities",
    description: "Community enrichment workshops, educational initiatives, and special programs.",
    category: "Community & Governance",
    isEnabledGlobally: true
  },

  // Digital & Outreach
  {
    key: "website",
    name: "Public Website & CMS",
    description: "Public-facing website, custom domain management, and online visibility.",
    category: "Digital & Outreach",
    isEnabledGlobally: true
  },
  {
    key: "reports",
    name: "Demographic Reports",
    description: "Blood donor directories, expatriate censuses, and yatheem welfare analytics.",
    category: "Digital & Outreach",
    isEnabledGlobally: true
  },
  {
    key: "notifications",
    name: "Broadcast Notifications",
    description: "Automated SMS, WhatsApp, and push broadcast delivery for announcements.",
    category: "Digital & Outreach",
    isEnabledGlobally: true
  }
];
