import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import { unstable_cache } from "next/cache";

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

export const getPageContent = unstable_cache(
  async (slug: string) => {
    return prisma.pageContent.findUnique({
      where: { slug },
    });
  },
  ['page-content'],
  { revalidate: 3600, tags: ['content'] }
);
