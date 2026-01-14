import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getOrganizations() {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") return [];

  return prisma.organization.findMany({
    orderBy: { name: "asc" },
  });
}
