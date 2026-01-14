import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getSmtpConfig() {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") return null;

  return prisma.smtpConfig.findUnique({
    where: { id: "default" },
  });
}

export async function getSystemSettings() {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") return null;

  return prisma.systemSettings.findUnique({
    where: { id: "default" },
  });
}

export async function getPublicSystemSettings() {
  return prisma.systemSettings.findUnique({
    where: { id: "default" },
    select: {
      googleAnalyticsId: true,
      socialTwitter: true,
      socialGithub: true,
      socialLinkedin: true,
      socialFacebook: true,
    }
  });
}

export async function getPageContent(slug: string) {
  return prisma.pageContent.findUnique({
    where: { slug },
  });
}
