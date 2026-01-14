import { prisma } from './src/lib/prisma';

async function checkMonitors() {
    const monitors = await prisma.monitor.findMany({
        select: {
            id: true,
            name: true,
            status: true,
            lastCheck: true,
            nextCheck: true,
            interval: true
        }
    });

    console.log('Current Time:', new Date().toISOString());
    console.log('Monitors in Database:');
    console.table(monitors);

    const dueCount = await prisma.monitor.count({
        where: {
            status: { not: 'PAUSED' },
            OR: [
                { nextCheck: { lte: new Date() } },
                { nextCheck: null }
            ]
        }
    });

    console.log(`Monitors due for check: ${dueCount}`);

    process.exit(0);
}

checkMonitors();
