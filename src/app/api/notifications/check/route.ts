import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = (session.user as any).role === 'SUPER_ADMIN';

    // Check for 'since' parameter (used when catching up after tab becomes visible)
    const { searchParams } = new URL(request.url);
    const sinceParam = searchParams.get('since');

    // If 'since' is provided, use it; otherwise default to 2 minutes ago
    const sinceTime = sinceParam
        ? new Date(parseInt(sinceParam))
        : new Date(Date.now() - 2 * 60 * 1000);

    // Build monitor filter - SUPER_ADMIN sees all, others see their own
    const monitorFilter = isSuperAdmin ? {} : {
        monitor: {
            OR: [
                { userId: session.user.id },
                { assignments: { some: { userId: session.user.id } } }
            ]
        }
    };

    // When catching up (since param provided), return multiple incidents
    // Otherwise return just the most recent one
    if (sinceParam) {
        const incidents = await prisma.incident.findMany({
            where: {
                updatedAt: { gte: sinceTime },
                ...monitorFilter
            },
            include: {
                monitor: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'asc' // Oldest first so notifications appear in order
            },
            take: 10 // Limit to prevent notification spam
        });

        return NextResponse.json({ incidents, serverTime: Date.now() });
    }

    // Normal polling - return single most recent incident
    const incident = await prisma.incident.findFirst({
        where: {
            updatedAt: { gte: sinceTime },
            ...monitorFilter
        },
        include: {
            monitor: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    return NextResponse.json({ newIncident: incident, serverTime: Date.now() });
}
