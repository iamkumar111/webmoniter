/**
 * High-Performance Notification Queue
 * 
 * This module provides a non-blocking notification queue that allows the monitoring
 * engine to continue processing without waiting for notifications to be sent.
 */

interface NotificationJob {
    type: 'email' | 'slack' | 'discord' | 'whatsapp';
    handler: () => Promise<void>;
    retries: number;
}

class NotificationQueue {
    private queue: NotificationJob[] = [];
    private isProcessing = false;
    private concurrencyLimit = 10; // Max parallel notifications
    private activeWorkers = 0;

    enqueue(job: NotificationJob) {
        this.queue.push(job);
        this.process();
    }

    private async process() {
        if (this.isProcessing || this.queue.length === 0) return;
        this.isProcessing = true;

        while (this.queue.length > 0 && this.activeWorkers < this.concurrencyLimit) {
            const job = this.queue.shift();
            if (!job) continue;

            this.activeWorkers++;
            this.executeJob(job).finally(() => {
                this.activeWorkers--;
                if (this.queue.length > 0) this.process();
            });
        }

        this.isProcessing = false;
    }

    private async executeJob(job: NotificationJob) {
        try {
            await job.handler();
        } catch (error) {
            console.error(`Notification failed (${job.type}):`, error);
            if (job.retries > 0) {
                // Re-queue with reduced retries
                this.queue.push({ ...job, retries: job.retries - 1 });
            }
        }
    }

    getQueueSize() {
        return this.queue.length;
    }
}

// Singleton instance
export const notificationQueue = new NotificationQueue();

// Helper to enqueue email notifications (fire-and-forget)
export function queueEmailNotification(handler: () => Promise<void>) {
    notificationQueue.enqueue({ type: 'email', handler, retries: 2 });
}

// Helper to enqueue integration notifications (fire-and-forget)
export function queueIntegrationNotification(type: 'slack' | 'discord' | 'whatsapp', handler: () => Promise<void>) {
    notificationQueue.enqueue({ type, handler, retries: 1 });
}
