import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the most recent incident that was either created (down) or updated (resolved) 
    // in the last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const incident = await prisma.incident.findFirst({
        where: {
            updatedAt: { gte: twoMinutesAgo },
            monitor: {
                OR: [
                    { userId: session.user.id },
                    { assignments: { some: { userId: session.user.id } } }
                ]
            }
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

    return NextResponse.json({ newIncident: incident });
}
