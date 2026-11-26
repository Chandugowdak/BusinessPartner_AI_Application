export const FEATURE_PERMISSIONS = [
  { key: "home", label: "Home", description: "Workspace overview and dashboard" },
  { key: "jobs", label: "Jobs", description: "Browse business and career opportunities" },
  { key: "findPartners", label: "Find partners", description: "Discover and connect with members" },
  { key: "connections", label: "Connections", description: "Manage connections and conversations" },
  { key: "requests", label: "Requests", description: "Review incoming and sent requests" },
  { key: "emailHistory", label: "Email history", description: "View sent email activity" },
  { key: "emailConfiguration", label: "Email configuration", description: "Manage templates and email settings" },
  { key: "emailScheduler", label: "Email scheduler", description: "Manage automated email schedules" },
];

export const FEATURE_PATHS = {
  home: "/home",
  jobs: "/jobs",
  findPartners: "/find-partners",
  connections: "/connections",
  requests: "/requests",
  emailHistory: "/email/history",
  emailConfiguration: "/email/configuration",
  emailScheduler: "/email/scheduler",
};

export const hasFeaturePermission = (user, feature) =>
  user?.accountRole === "admin" || user?.permissions?.[feature] === true;

export const getFirstAvailableFeature = (user) =>
  FEATURE_PERMISSIONS.find(({ key }) => hasFeaturePermission(user, key))?.key || null;

export const getDefaultFeaturePath = (user) =>
  FEATURE_PATHS[getFirstAvailableFeature(user)] || "/profile";
