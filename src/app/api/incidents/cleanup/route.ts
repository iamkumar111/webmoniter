import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// POST: Clean up stale incidents (resolve OPEN incidents for monitors that are UP)
export async function POST() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all monitors that are UP but have OPEN incidents
    const staleIncidents = await prisma.incident.findMany({
        where: {
            status: 'OPEN',
            monitor: {
                status: 'UP'
            }
        },
        include: {
            monitor: { select: { name: true, status: true } }
        }
    });

    // Resolve each stale incident
    const results = [];
    for (const incident of staleIncidents) {
        const duration = Math.floor((Date.now() - incident.startTime.getTime()) / 1000);

        await prisma.incident.update({
            where: { id: incident.id },
            data: {
                status: 'RESOLVED',
                endTime: new Date(),
                duration,
            }
        });

        results.push({
            incidentId: incident.id,
            monitorName: incident.monitor.name,
            wasOpenFor: `${Math.floor(duration / 60)} minutes`,
        });
    }

    return NextResponse.json({
        message: `Cleaned up ${results.length} stale incidents`,
        resolved: results,
        serverTime: Date.now()
    });
}
