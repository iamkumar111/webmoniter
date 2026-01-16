import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// POST: Create a test incident to debug notifications
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'down'; // 'down' or 'up'

    // Get the first monitor
    const monitor = await prisma.monitor.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (!monitor) {
        return NextResponse.json({ error: "No monitors found" }, { status: 404 });
    }

    let incident;

    if (type === 'down') {
        // Create a new DOWN incident
        incident = await prisma.incident.create({
            data: {
                monitorId: monitor.id,
                type: 'DOWN',
                status: 'OPEN',
                errorDetails: 'TEST INCIDENT - Debug notification trigger',
                startTime: new Date(),
            },
            include: {
                monitor: { select: { name: true } }
            }
        });
    } else {
        // Find an open incident and resolve it
        const openIncident = await prisma.incident.findFirst({
            where: { monitorId: monitor.id, status: 'OPEN' },
            orderBy: { startTime: 'desc' }
        });

        if (openIncident) {
            incident = await prisma.incident.update({
                where: { id: openIncident.id },
                data: {
                    status: 'RESOLVED',
                    endTime: new Date(),
                    duration: Math.floor((Date.now() - openIncident.startTime.getTime()) / 1000)
                },
                include: {
                    monitor: { select: { name: true } }
                }
            });
        } else {
            return NextResponse.json({ error: "No open incident to resolve" }, { status: 404 });
        }
    }

    return NextResponse.json({
        success: true,
        message: `Created ${type.toUpperCase()} test incident`,
        incident: {
            id: incident.id,
            status: incident.status,
            monitorId: incident.monitorId,
            monitorName: incident.monitor?.name,
            updatedAt: incident.updatedAt,
        },
        instructions: "Check your browser console for [NOTIFICATION] logs. The notification should appear within 10 seconds."
    });
}

// GET: Check what /api/notifications/check would return right now
export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    // Get all recent incidents
    const recentIncidents = await prisma.incident.findMany({
        where: {
            updatedAt: { gte: twoMinutesAgo }
        },
        include: {
            monitor: { select: { name: true, userId: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
    });

    // Get what the notification check API would return for this user
    const isSuperAdmin = (session.user as any).role === 'SUPER_ADMIN';

    const monitorFilter = isSuperAdmin ? {} : {
        monitor: {
            OR: [
                { userId: session.user.id },
                { assignments: { some: { userId: session.user.id } } }
            ]
        }
    };

    const filteredIncidents = await prisma.incident.findMany({
        where: {
            updatedAt: { gte: twoMinutesAgo },
            ...monitorFilter
        },
        include: {
            monitor: { select: { name: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
    });

    return NextResponse.json({
        userId: session.user.id,
        userRole: (session.user as any).role,
        isSuperAdmin,
        currentTime: new Date().toISOString(),
        twoMinutesAgo: twoMinutesAgo.toISOString(),
        allRecentIncidents: recentIncidents.length,
        filteredForUser: filteredIncidents.length,
        incidents: filteredIncidents.map(i => ({
            id: i.id,
            status: i.status,
            monitorName: i.monitor?.name,
            updatedAt: i.updatedAt,
            timeSinceUpdate: `${Math.floor((Date.now() - i.updatedAt.getTime()) / 1000)}s ago`
        }))
    });
}
