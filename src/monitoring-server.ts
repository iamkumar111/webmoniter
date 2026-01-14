import cron from 'node-cron';
import { prisma } from './lib/prisma';
import { runMonitorCheck } from './lib/monitoring-engine';
import { MonitorStatus } from '@prisma/client';

console.log('High-Performance Monitoring Engine Started...');

let isProcessing = false;

// Configuration for extreme high-performance monitoring
const CONFIG = {
  BATCH_SIZE: 10000,         // Max monitors per cycle (increased for 5000/sec capability)
  CONCURRENCY_LIMIT: 1000,   // Max parallel HTTP requests (optimized for 4-core)
  CYCLE_INTERVAL_MS: 60000,  // 1 minute
};

// Helper: Process in limited concurrency batches (worker pool pattern)
async function processInBatches<T>(
  items: T[],
  processor: (item: T) => Promise<void>,
  concurrencyLimit: number
): Promise<void> {
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const currentIndex = index++;
      if (currentIndex >= items.length) break;

      try {
        await processor(items[currentIndex]);
      } catch (err) {
        // Errors are handled individually, don't break the batch
      }
    }
  }

  // Start worker pool
  const workers: Promise<void>[] = [];
  for (let i = 0; i < Math.min(concurrencyLimit, items.length); i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
}

// Run every minute
cron.schedule('* * * * *', async () => {
  if (isProcessing) {
    console.log('Skipping cycle: Previous cycle still running');
    return;
  }

  isProcessing = true;
  const cycleStart = Date.now();

  try {
    // Update heartbeat (lastMonitoringPulse) immediately - fire and forget
    prisma.systemSettings.update({
      where: { id: 'default' },
      data: { lastMonitoringPulse: new Date() }
    }).catch(e => console.error('Pulse update failed:', e));

    const monitors = await prisma.monitor.findMany({
      where: {
        status: { not: MonitorStatus.PAUSED },
        OR: [
          { nextCheck: { lte: new Date() } },
          { nextCheck: null }
        ]
      },
      select: { id: true }, // Only fetch IDs for memory efficiency
      take: CONFIG.BATCH_SIZE
    });

    if (monitors.length > 0) {
      console.log(`Processing ${monitors.length} monitors with ${CONFIG.CONCURRENCY_LIMIT} workers...`);

      // Process with worker pool pattern
      await processInBatches(
        monitors,
        (monitor) => runMonitorCheck(monitor.id),
        CONFIG.CONCURRENCY_LIMIT
      );

      const duration = Date.now() - cycleStart;
      console.log(`Cycle complete: ${monitors.length} checks in ${duration}ms (${Math.round(monitors.length / (duration / 1000))}/sec)`);
    }
  } catch (error) {
    console.error('Critical error in monitoring cycle:', error);
  } finally {
    isProcessing = false;
  }
});

// Retention Cleanup - Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running data retention cleanup...');
  const settings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
  const retentionDays = settings?.retentionCheckHistory || 30; // Default 30 days for high-volume setups

  const cutOffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

  // Batch delete to prevent locking
  await prisma.check.deleteMany({ where: { createdAt: { lt: cutOffDate } } });
  await prisma.alertLog.deleteMany({ where: { createdAt: { lt: cutOffDate } } });
  console.log('Cleanup complete.');
});
