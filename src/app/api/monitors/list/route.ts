import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = (session.user as any).role === 'SUPER_ADMIN';

    const whereClause = isSuperAdmin ? {} : {
        OR: [
            { userId: session.user.id },
            { assignments: { some: { userId: session.user.id } } }
        ]
    };

    const monitors = await prisma.monitor.findMany({
        where: whereClause,
        include: {
            checks: {
                take: 1,
                orderBy: { timestamp: 'desc' }
            },
            incidents: {
                take: 1,
                orderBy: { startTime: 'desc' }
            },
            _count: {
                select: { incidents: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ monitors, serverTime: Date.now() });
}
