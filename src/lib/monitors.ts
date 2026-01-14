import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getCurrentOrgId } from "./org-helper";
import { unstable_noStore as noStore } from 'next/cache';

export async function getMonitors() {
  noStore();
  const session = await auth();
  if (!session?.user) return [];

  const userRole = (session.user as any).role;
  const orgId = await getCurrentOrgId();

  const where: any = {};

  if (userRole === 'SUPER_ADMIN') {
    if (orgId) {
      where.organizationId = orgId;
    }
    // else: All monitors (global view)
  } else if (userRole === 'ADMIN') {
    where.organizationId = (session.user as any).organizationId;
  } else if (userRole === 'MANAGER' || userRole === 'USER') {
    // MANAGER sees their own monitors
    where.userId = session.user.id;
  } else if (userRole === 'VIEWER') {
    // VIEWER sees assigned monitors
    where.assignments = {
      some: {
        userId: session.user.id
      }
    };
  }

  const monitors = await prisma.monitor.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      checks: {
        take: 1,
        orderBy: { timestamp: "desc" },
      },
      incidents: {
        take: 1,
        orderBy: { startTime: "desc" },
      },
    },
  });

  return monitors;
}

export async function getMonitorById(id: string) {
  noStore();
  const session = await auth();
  if (!session?.user) return null;

  const monitor = await prisma.monitor.findUnique({
    where: { id },
    include: {
      checks: {
        take: 50,
        orderBy: {
          timestamp: "desc",
        },
      },
      incidents: {
        take: 10,
        orderBy: {
          startTime: "desc",
        },
      },
      alertLogs: {
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      },
      assignments: true,
    },
  });

  if (!monitor) return null;

  // Check access permissions
  const userRole = (session.user as any).role;
  if (userRole === 'SUPER_ADMIN') return monitor;

  if (userRole === 'ADMIN') {
    if (monitor.organizationId !== (session.user as any).organizationId) return null;
  } else if (userRole === 'MANAGER' || userRole === 'USER') {
    if (monitor.userId !== session.user.id) return null;
  } else if (userRole === 'VIEWER') {
    const isAssigned = monitor.assignments.some(a => a.userId === session?.user?.id);
    if (!isAssigned) return null;
  }

  return monitor;
}
