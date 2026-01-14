import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getCurrentOrgId } from "./org-helper";

async function getMonitorFilter(session: any) {
  const userRole = session.user.role;
  const orgId = await getCurrentOrgId();

  const filter: any = {};

  if (userRole === 'SUPER_ADMIN') {
    if (orgId) {
      filter.organizationId = orgId;
    }
  } else if (userRole === 'ADMIN') {
    filter.organizationId = session.user.organizationId;
  } else if (userRole === 'MANAGER' || userRole === 'USER') {
    filter.userId = session.user.id;
  } else if (userRole === 'VIEWER') {
    filter.assignments = {
      some: {
        userId: session.user.id
      }
    };
  }

  return filter;
}

export async function getRecentLogs(limit: number = 10) {
  const session = await auth();
  if (!session?.user) return [];

  const monitorFilter = await getMonitorFilter(session);

  const logs = await prisma.check.findMany({
    where: {
      monitor: monitorFilter,
    },
    take: limit,
    orderBy: {
      timestamp: "desc",
    },
    include: {
      monitor: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  });

  return logs;
}

export async function getAlertLogs(limit: number = 20) {
  const session = await auth();
  if (!session?.user) return [];

  const monitorFilter = await getMonitorFilter(session);

  const logs = await prisma.alertLog.findMany({
    where: {
      monitor: monitorFilter,
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      monitor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return logs;
}

export async function getIncidents(limit: number = 10) {
  const session = await auth();
  if (!session?.user) return [];

  const monitorFilter = await getMonitorFilter(session);

  const incidents = await prisma.incident.findMany({
    where: {
      monitor: monitorFilter,
    },
    take: limit,
    orderBy: {
      startTime: "desc",
    },
    include: {
      monitor: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  });

  return incidents;
}
