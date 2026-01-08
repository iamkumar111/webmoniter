'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { MonitorStatus, Role, UserStatus } from "@prisma/client";
import { OrganizationSchema, MonitorSchema, UserSchema, SmtpSchema, SystemSettingsSchema } from "@/lib/schemas";
import { canAccessMonitor, canManageUser, canCreateUserRole } from "@/lib/auth-helpers";

// --- Monitor Actions ---

// --- User Actions ---

export async function registerUser(data: { name: string; email: string; password: string }) {
  const { name, email, password } = data;

  // Validate basic inputs
  const RegisterSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
  });

  RegisterSchema.parse(data);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Assign default "Free" group or create if it doesn't exist
  let freeGroup = await prisma.userGroup.findFirst({
    where: { isDefault: true }
  });

  if (!freeGroup) {
    // Check if a group named "Free" exists but not marked default
    freeGroup = await prisma.userGroup.findUnique({ where: { slug: 'free' } });

    if (!freeGroup) {
      // Create the Free group with the specified restrictions
      // 5 Monitors Max, 5-minute interval min, No integrations
      freeGroup = await prisma.userGroup.create({
        data: {
          name: "Free",
          slug: "free",
          features: {
            maxMonitors: 5,
            minInterval: 5,
            integrations: []
          },
          isDefault: true
        }
      });
    }
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER', // Standard user
      status: 'ACTIVE',
      organizationId: null, // No organization initially
      userGroupId: freeGroup.id,
    }
  });

  // Direct them to login (or in a real app, sign them in via next-auth signIn helper)
  // Since this is a server action, we can't easily sign them in on the client side without returning a success state to the client
  // and having the client validation. For now, redirect to login.
  redirect("/login?registered=true");
}

// --- Monitor Actions ---

export async function createMonitor(data: z.infer<typeof MonitorSchema>) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validated = MonitorSchema.parse(data);
  const user = await prisma.user.findUnique({
    where: { id: session.user.id! },
    include: { userGroup: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Enforce Plan Limits
  if (user.role !== 'SUPER_ADMIN') {
    let features: any = user.userGroup?.features || {};
    let slug = user.userGroup?.slug;

    // Fallback to default group if no group assigned
    if (!user.userGroup) {
      const defaultGroup = await prisma.userGroup.findFirst({ where: { isDefault: true } });
      if (defaultGroup) {
        features = defaultGroup.features;
        slug = defaultGroup.slug;
      }
    }

    // Ensure Free plan has strict defaults if DB is missing them
    if (slug === 'free') {
      if (features.maxMonitors === undefined) features.maxMonitors = 5;
      if (features.minInterval === undefined) features.minInterval = 5;
    }

    // 1. Max Monitors Limit
    if (features.maxMonitors) {
      const monitorCount = await prisma.monitor.count({
        where: { userId: user.id }
      });

      if (monitorCount >= features.maxMonitors) {
        return { error: `Your plan is limited to ${features.maxMonitors} monitors. Please upgrade to add more.` };
      }
    }

    // 2. Minimum Interval Limit
    if (features.minInterval && validated.interval < features.minInterval) {
      return { error: `Your plan requires a minimum check interval of ${features.minInterval} minutes.` };
    }
  }

  const monitor = await prisma.monitor.create({
    data: {
      ...validated,
      userId: session.user.id!,
      organizationId: user?.organizationId,
      status: MonitorStatus.UP,
      headers: {},
      verifySSL: validated.verifySSL ?? true,
      alertOnDown: validated.alertOnDown ?? true,
      alertOnRecovery: validated.alertOnRecovery ?? true,
      alertOnSSL: validated.alertOnSSL ?? true,
      alertOnSlow: validated.alertOnSlow ?? true,
    },
  });

  // Trigger immediate check in background
  try {
    const { runMonitorCheck } = await import("@/lib/monitoring-engine");
    await runMonitorCheck(monitor.id);
  } catch (err) {
    console.error("Initial check failed:", err);
  }

  revalidatePath("/monitors");
  redirect("/monitors");
}

export async function updateMonitor(id: string, data: z.infer<typeof MonitorSchema>) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const monitor = await prisma.monitor.findUnique({
    where: { id },
    include: { assignments: true }
  });

  if (!monitor) throw new Error("Monitor not found");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { userGroup: true }
  });

  if (!user) throw new Error("Unauthorized");

  if (!canAccessMonitor(user, monitor)) {
    throw new Error("Unauthorized");
  }

  const validated = MonitorSchema.parse(data);

  // Enforce Plan Limits on Update
  if (user.role !== 'SUPER_ADMIN') {
    let features: any = user.userGroup?.features || {};
    let slug = user.userGroup?.slug;

    // Fallback to default group if no group assigned
    if (!user.userGroup) {
      const defaultGroup = await prisma.userGroup.findFirst({ where: { isDefault: true } });
      if (defaultGroup) {
        features = defaultGroup.features;
        slug = defaultGroup.slug;
      }
    }

    // Ensure Free plan has strict defaults for minInterval checking
    if (slug === 'free') {
      if (features.minInterval === undefined) features.minInterval = 5;
    }

    // Minimum Interval Limit
    if (features.minInterval && validated.interval < features.minInterval) {
      return { error: `Your plan requires a minimum check interval of ${features.minInterval} minutes.` };
    }
  }

  await prisma.monitor.update({
    where: { id },
    data: {
      ...validated,
      verifySSL: validated.verifySSL ?? true,
      alertOnDown: validated.alertOnDown ?? true,
      alertOnRecovery: validated.alertOnRecovery ?? true,
      alertOnSSL: validated.alertOnSSL ?? true,
      alertOnSlow: validated.alertOnSlow ?? true,
    },
  });

  // Trigger immediate check
  try {
    const { runMonitorCheck } = await import("@/lib/monitoring-engine");
    await runMonitorCheck(id);
  } catch (err) {
    console.error("Update check failed:", err);
  }

  revalidatePath("/monitors");
  revalidatePath(`/monitors/${id}`);
  redirect(`/monitors/${id}`);
}

export async function deleteMonitor(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const monitor = await prisma.monitor.findUnique({
    where: { id },
    include: { assignments: true }
  });

  if (!monitor) throw new Error("Monitor not found");

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  // Only owners or admins can delete
  if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN' && monitor.userId !== user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.monitor.delete({ where: { id } });
  revalidatePath("/monitors");
  redirect("/monitors");
}

export async function toggleMonitorPause(id: string, currentStatus: MonitorStatus) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const monitor = await prisma.monitor.findUnique({
    where: { id },
    include: { assignments: true }
  });

  if (!monitor) throw new Error("Monitor not found");

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!canAccessMonitor(user!, monitor)) {
    throw new Error("Unauthorized");
  }

  const newStatus = currentStatus === MonitorStatus.PAUSED ? MonitorStatus.UP : MonitorStatus.PAUSED;

  await prisma.monitor.update({
    where: { id },
    data: { status: newStatus }
  });

  revalidatePath("/monitors");
  revalidatePath(`/monitors/${id}`);
}

export async function runManualCheck(monitorId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId },
    include: { assignments: true }
  });

  if (!monitor) throw new Error("Monitor not found");

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!canAccessMonitor(user!, monitor)) {
    throw new Error("Unauthorized");
  }

  const { runMonitorCheck } = await import("@/lib/monitoring-engine");
  await runMonitorCheck(monitorId);

  revalidatePath(`/monitors/${monitorId}`);
}

export async function assignMonitor(monitorId: string, userId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const monitor = await prisma.monitor.findUnique({ where: { id: monitorId } });
  if (!monitor) throw new Error("Monitor not found");

  // Only owner or admin can assign
  if (monitor.userId !== session.user.id && (session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN') {
    throw new Error("Unauthorized");
  }

  await prisma.monitorAssignment.create({
    data: {
      monitorId,
      userId,
      assignedBy: session.user.id!,
    }
  });

  revalidatePath("/monitors");
  revalidatePath("/users");
}

export async function unassignMonitor(monitorId: string, userId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Check permissions similar to assign
  const monitor = await prisma.monitor.findUnique({ where: { id: monitorId } });
  if (!monitor) throw new Error("Monitor not found");

  if (monitor.userId !== session.user.id && (session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN') {
    throw new Error("Unauthorized");
  }

  await prisma.monitorAssignment.delete({
    where: {
      monitorId_userId: { monitorId, userId }
    }
  });

  revalidatePath("/monitors");
  revalidatePath("/users");
}

export async function createUser(data: z.infer<typeof UserSchema> & { password?: string; organizationId?: string; userGroupId?: string }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!currentUser) throw new Error("Unauthorized");

  const validated = UserSchema.parse(data);

  if (!canCreateUserRole(currentUser, validated.role)) {
    throw new Error("You do not have permission to create a user with this role");
  }

  // Default password if not provided
  const passwordToHash = data.password || "websmonitor123!";
  const hashedPassword = await bcrypt.hash(passwordToHash, 10);

  // Determine Organization ID
  let organizationId = validated.organizationId;

  if (!organizationId || organizationId === "NEW") {
    // If Super Admin creates an ADMIN, start a new Organization if a name was provided or if we should auto-generate
    if (currentUser.role === 'SUPER_ADMIN' && validated.role === 'ADMIN') {
      const orgName = validated.newOrgName || `${validated.name}'s Organization`;
      const newOrg = await prisma.organization.create({
        data: { name: orgName, status: "ACTIVE" }
      });
      organizationId = newOrg.id;
    } else {
      // Inherit from creator
      organizationId = currentUser.organizationId || undefined;
    }
  }

  // Determine User Group
  let userGroupId = validated.userGroupId;
  if (!userGroupId) {
    const defaultGroup = await prisma.userGroup.findFirst({ where: { isDefault: true } });
    userGroupId = defaultGroup?.id;
  }

  await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: validated.role,
      status: validated.status,
      createdBy: currentUser.id,
      organizationId: organizationId || null,
      userGroupId: userGroupId || null
    }
  });

  // Log action
  await prisma.auditLog.create({
    data: {
      userId: currentUser.id,
      action: "CREATE_USER",
      details: { email: validated.email, role: validated.role, userGroupId }
    }
  });

  revalidatePath("/users");
}

export async function updateUser(id: string, data: z.infer<typeof UserSchema>) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!currentUser) throw new Error("Unauthorized");

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) throw new Error("User not found");

  if (!canManageUser(currentUser, targetUser.role) && currentUser.id !== id) {
    if (currentUser.role !== 'SUPER_ADMIN') throw new Error("Unauthorized");
  }

  const validated = UserSchema.parse(data);
  const updateData: any = {
    name: validated.name,
    email: validated.email,
    role: validated.role,
    status: validated.status,
    organizationId: validated.organizationId || null,
  };

  if (validated.userGroupId) {
    updateData.userGroupId = validated.userGroupId;
  }

  if (validated.password) {
    updateData.password = await bcrypt.hash(validated.password, 10);
  }

  await prisma.user.update({
    where: { id },
    data: updateData
  });

  await prisma.auditLog.create({
    data: {
      userId: currentUser.id,
      action: "UPDATE_USER",
      target: id,
      details: { changes: updateData }
    }
  });

  revalidatePath("/users");
}

export async function deleteUser(id: string, transferToUserId?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') throw new Error("Unauthorized");

  if (transferToUserId) {
    // Transfer monitors
    await prisma.monitor.updateMany({
      where: { userId: id },
      data: { userId: transferToUserId }
    });
  } else {
    // Delete monitors owned by user? Or orphan them?
    // Prisma cascade delete on User -> Monitor will handle it if configured
    // Check schema: User -> Monitor usually has onDelete: Cascade if configured, otherwise fails
    // My schema doesn't explicitly specify onDelete for user->monitors relation in User model,
    // but Monitor model has `user User @relation(...)`. Default is usually Restrict.
    // Let's assume we want to delete them if no transfer.
    await prisma.monitor.deleteMany({
      where: { userId: id }
    });
  }

  await prisma.user.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: currentUser.id,
      action: "DELETE_USER",
      target: id,
      details: { transferTo: transferToUserId }
    }
  });

  revalidatePath("/users");
}

// --- Settings Actions ---

export async function updateSmtpConfig(data: z.infer<typeof SmtpSchema>) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const validated = SmtpSchema.parse(data);

  await prisma.smtpConfig.upsert({
    where: { id: "default" },
    update: validated,
    create: { id: "default", ...validated }
  });

  revalidatePath("/settings");
}

export async function testSmtpConfig(data: z.infer<typeof SmtpSchema>, to: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const validated = SmtpSchema.parse(data);
  const { sendTestEmail } = await import("@/lib/email");
  return await sendTestEmail(validated, to);
}


export async function updateSystemSettings(data: z.infer<typeof SystemSettingsSchema>) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const validated = SystemSettingsSchema.parse(data);

  await prisma.systemSettings.upsert({
    where: { id: "default" },
    update: validated,
    create: { id: "default", ...validated }
  });

  revalidatePath("/settings");
}

// --- Enquiry Actions ---

export async function submitEnquiry(data: { firstName: string; lastName: string; email: string; message: string }) {
  await prisma.enquiry.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      message: data.message,
    }
  });

  // Try to send email
  try {
    const { sendMail } = await import("@/lib/email");
    await sendMail({
      to: "support@websmonitor.online",
      subject: `New Enquiry from ${data.firstName} ${data.lastName}`,
      text: `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nMessage: ${data.message}`,
      html: `<p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
             <p><strong>Email:</strong> ${data.email}</p>
             <p><strong>Message:</strong> ${data.message}</p>`
    });
  } catch (error) {
    console.error("Failed to send enquiry email, saved to DB instead:", error);
  }

  return { success: true };
}

export async function updateEnquiryStatus(id: string, status: string, adminComment: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  await prisma.enquiry.update({
    where: { id },
    data: { status, adminComment }
  });

  revalidatePath("/dashboard/enquiries");
}

// --- Organization Actions ---

export async function setSuperAdminOrg(orgId: string | null) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const cookieStore = await cookies();
  if (orgId) {
    cookieStore.set("super-admin-org", orgId);
  } else {
    cookieStore.delete("super-admin-org");
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function createOrganization(data: z.infer<typeof OrganizationSchema>) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const validated = OrganizationSchema.parse(data);

  const org = await prisma.organization.create({
    data: validated,
  });

  revalidatePath("/dashboard/organizations");
  revalidatePath("/users"); // Update user form dropdown

  return org;
}

export async function updateOrganization(id: string, data: z.infer<typeof OrganizationSchema>) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const validated = OrganizationSchema.parse(data);

  await prisma.organization.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/dashboard/organizations");
}

export async function fetchOrganizations() {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") return [];

  return prisma.organization.findMany({
    orderBy: { name: "asc" },
  });
}

// --- Page Content Actions ---

export async function updatePageContent(slug: string, content: any, seoData?: any) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const updateData: any = { data: content };

  if (seoData) {
    if (seoData.metaTitle !== undefined) updateData.metaTitle = seoData.metaTitle;
    if (seoData.metaDescription !== undefined) updateData.metaDescription = seoData.metaDescription;
    if (seoData.keywords !== undefined) updateData.keywords = seoData.keywords;
    if (seoData.ogTitle !== undefined) updateData.ogTitle = seoData.ogTitle;
    if (seoData.ogDescription !== undefined) updateData.ogDescription = seoData.ogDescription;
    if (seoData.ogImage !== undefined) updateData.ogImage = seoData.ogImage;
    if (seoData.structuredData !== undefined) updateData.structuredData = seoData.structuredData;
  }

  await prisma.pageContent.update({
    where: { slug },
    data: updateData,
  });

  revalidatePath("/");
  revalidatePath(`/${slug}`);
}

// --- Profile / Security Actions ---

export async function updatePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CHANGE_PASSWORD",
      details: { timestamp: new Date() }
    }
  });

  return { success: true };
}

// --- Integration Actions ---

export async function updateIntegrationSettings(data: {
  slackEnabled: boolean;
  discordEnabled: boolean;
  whatsappEnabled: boolean;
}) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  await prisma.integrationSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data }
  });

  revalidatePath("/settings/integrations");
}

export async function saveUserIntegration(data: {
  type: "SLACK" | "DISCORD" | "WHATSAPP";
  webhookUrl?: string;
  phoneNumber?: string;
  apiKey?: string;
  isEnabled: boolean;
  notifyDown: boolean;
  notifyRecovery: boolean;
  notifySSL: boolean;
  notifySlow: boolean;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Block VIEWER role
  if ((session.user as any).role === "VIEWER") {
    throw new Error("Viewer accounts cannot configure integrations");
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  // Check plan permissions (Super Admin bypasses)
  if (userRole !== "SUPER_ADMIN") {
    const { getUserPermissions } = await import("@/lib/permissions");
    const permissions = await getUserPermissions(userId);
    if (!permissions.integrations.includes(data.type)) {
      throw new Error(`Your ${permissions.groupName} plan does not include ${data.type} integration. Please upgrade your plan.`);
    }
  }

  await prisma.userIntegration.upsert({
    where: {
      userId_type: {
        userId,
        type: data.type
      }
    },
    update: {
      webhookUrl: data.webhookUrl,
      phoneNumber: data.phoneNumber,
      apiKey: data.apiKey,
      isEnabled: data.isEnabled,
      notifyDown: data.notifyDown,
      notifyRecovery: data.notifyRecovery,
      notifySSL: data.notifySSL,
      notifySlow: data.notifySlow,
    },
    create: {
      userId,
      type: data.type,
      webhookUrl: data.webhookUrl,
      phoneNumber: data.phoneNumber,
      apiKey: data.apiKey,
      isEnabled: data.isEnabled,
      notifyDown: data.notifyDown,
      notifyRecovery: data.notifyRecovery,
      notifySSL: data.notifySSL,
      notifySlow: data.notifySlow,
    }
  });

  revalidatePath("/settings/integrations");
}

export async function testSlackWebhook(webhookUrl: string) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: "🧪 *websmonitor Test Message*\n\nYour Slack integration is working correctly! (websmonitor.online)",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "🧪 *websmonitor Test Message*\n\nYour Slack integration is working correctly! You will receive alerts here when your monitors go down or recover. (websmonitor.online)"
            }
          }
        ]
      })
    });

    if (response.ok) {
      return { success: true };
    } else {
      const text = await response.text();
      return { success: false, error: text || 'Failed to send message' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function testDiscordWebhook(webhookUrl: string) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: "🧪 **websmonitor Test Message**",
        embeds: [{
          title: "Integration Test Successful",
          description: "Your Discord integration is working correctly! You will receive alerts here when your monitors go down or recover.",
          color: 5763719, // Green color
          footer: {
            text: "websmonitor Uptime Monitoring"
          },
          timestamp: new Date().toISOString()
        }]
      })
    });

    if (response.ok || response.status === 204) {
      return { success: true };
    } else {
      const text = await response.text();
      return { success: false, error: text || 'Failed to send message' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function testWhatsAppMessage(phoneNumber: string, apiKey: string) {
  // Using CallMeBot free WhatsApp API
  // Users must first activate by sending "I allow callmebot to send me messages" to +34 621 331 709
  try {
    const message = encodeURIComponent("🧪 websmonitor Test Message\n\nYour WhatsApp integration is working correctly! You will receive alerts here when your monitors go down or recover.");
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phoneNumber)}&text=${message}&apikey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    const text = await response.text();

    if (response.ok && !text.toLowerCase().includes('error')) {
      return { success: true };
    } else {
      return { success: false, error: text || 'Failed to send message. Make sure you have activated CallMeBot.' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Global SEO Actions ---

import { GlobalSEOSettingsSchema } from "@/lib/schemas-seo";

export async function updateGlobalSEOSettings(data: z.infer<typeof GlobalSEOSettingsSchema>) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const validated = GlobalSEOSettingsSchema.parse(data);
  let knowledgeGraphJson = null;

  if (validated.knowledgeGraph) {
    try {
      knowledgeGraphJson = JSON.parse(validated.knowledgeGraph);
    } catch (e) {
      throw new Error("Invalid Knowledge Graph JSON");
    }
  }

  await prisma.globalSEOSettings.upsert({
    where: { id: "default" },
    update: {
      siteName: validated.siteName,
      titleSeparator: validated.titleSeparator,
      titleSuffix: validated.titleSuffix || "",
      defaultKeywords: validated.defaultKeywords,
      defaultDescription: validated.defaultDescription,
      defaultOgImage: validated.defaultOgImage,
      robotsTxt: validated.robotsTxt,
      sitemapEnabled: validated.sitemapEnabled,
      knowledgeGraph: knowledgeGraphJson || undefined,
    },
    create: {
      id: "default",
      siteName: validated.siteName,
      titleSeparator: validated.titleSeparator,
      titleSuffix: validated.titleSuffix || "",
      defaultKeywords: validated.defaultKeywords,
      defaultDescription: validated.defaultDescription,
      defaultOgImage: validated.defaultOgImage,
      robotsTxt: validated.robotsTxt,
      sitemapEnabled: validated.sitemapEnabled,
      knowledgeGraph: knowledgeGraphJson || undefined,
    }
  });

  revalidatePath("/");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");
}

export async function getGlobalSEOSettings() {
  const settings = await prisma.globalSEOSettings.findUnique({
    where: { id: "default" }
  });
  return settings;
}

// --- User Group Actions ---

import { UserGroupSchema } from "@/lib/schemas";

export async function getUserGroups() {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  return await prisma.userGroup.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { users: true } } }
  });
}

export async function getUserGroupsList() {
  // For dropdowns (lighter fetch)
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return prisma.userGroup.findMany({
    select: { id: true, name: true, isDefault: true }
  });
}

export async function createUserGroup(data: z.infer<typeof UserGroupSchema>) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const validated = UserGroupSchema.parse(data);
  const slug = validated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  await prisma.userGroup.create({
    data: {
      name: validated.name,
      slug: slug,
      features: { integrations: validated.permissions || [] },
      isDefault: false
    }
  });

  revalidatePath("/dashboard/groups");
}

export async function updateUserGroup(id: string, data: z.infer<typeof UserGroupSchema>) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const validated = UserGroupSchema.parse(data);
  const slug = validated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  await prisma.userGroup.update({
    where: { id },
    data: {
      name: validated.name,
      slug: slug,
      features: { integrations: validated.permissions || [] }
    }
  });

  revalidatePath("/dashboard/groups");
  revalidatePath("/settings/integrations");
  revalidatePath("/", "layout"); // Force refresh of layout which generally might hold state or sidebars
}

export async function seedUserGroups() {
  // Only run if empty
  const count = await prisma.userGroup.count();
  if (count > 0) return;

  const defaults = [
    { name: "Free", permissions: [] }, // Free has no premium integrations
    { name: "Pro", permissions: ["SLACK", "DISCORD"] },
    { name: "Enterprise", permissions: ["SLACK", "DISCORD", "WHATSAPP"] },
    { name: "Custom", permissions: ["SLACK", "DISCORD", "WHATSAPP"] }
  ];

  for (const group of defaults) {
    await prisma.userGroup.create({
      data: {
        name: group.name,
        slug: group.name.toLowerCase(),
        features: { integrations: group.permissions },
        isDefault: group.name === "Free"
      }
    });
  }
}
