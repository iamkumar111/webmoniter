import { z } from "zod";

export const MonitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  type: z.enum(["HTTP", "HTTPS", "PING"]),
  interval: z.coerce.number().min(1),
  timeout: z.coerce.number().min(5).max(60),
  method: z.string().default("GET"),
  expectedStatusCode: z.coerce.number().default(200),
  verifySSL: z.boolean().optional(),
  alertOnDown: z.boolean().optional(),
  alertOnRecovery: z.boolean().optional(),
  alertOnSSL: z.boolean().optional(),
  alertOnSlow: z.boolean().optional(),
  alertCooldown: z.coerce.number().min(1).default(5),
  responseThreshold: z.coerce.number().min(100).default(6000),
  recipients: z.string().optional(),
});

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "USER", "VIEWER"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  organizationId: z.string().optional(),
  newOrgName: z.string().optional(),
  userGroupId: z.string().optional(),
});

export const SmtpSchema = z.object({
  host: z.string().min(1),
  port: z.coerce.number(),
  user: z.string().min(1),
  pass: z.string().min(1),
  fromEmail: z.string().email(),
  fromName: z.string().min(1),
});

export const SystemSettingsSchema = z.object({
  defaultInterval: z.coerce.number().min(1),
  defaultTimeout: z.coerce.number().min(5),
  defaultFailureThreshold: z.coerce.number().min(1),
  defaultRecoveryThreshold: z.coerce.number().min(1),
  defaultAlertCooldown: z.coerce.number().min(1).default(5),
  retentionCheckHistory: z.coerce.number().min(1),
  retentionAlertLog: z.coerce.number().min(1),
  retentionIncidentLog: z.coerce.number().min(1),
  googleAnalyticsId: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialGithub: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialFacebook: z.string().optional(),
});

export const OrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const UserGroupSchema = z.object({
  name: z.string().min(1, "Group Name is required"),
  permissions: z.array(z.string()).optional(), // Helper for form
});
