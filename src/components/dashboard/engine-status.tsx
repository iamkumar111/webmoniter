import { prisma } from "@/lib/prisma";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@/auth";

export default async function EngineStatus() {
    const session = await auth();
    if ((session?.user as any)?.role !== 'SUPER_ADMIN') return null;

    const settings = await prisma.systemSettings.findUnique({
        where: { id: "default" },
        select: { lastMonitoringPulse: true }
    });

    const lastPulse = settings?.lastMonitoringPulse;
    const isHealthy = lastPulse && (new Date().getTime() - lastPulse.getTime()) < 3 * 60 * 1000;

    if (!lastPulse) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800 mb-6">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="text-sm font-medium">
                    Monitoring Engine has never started. Please run <code className="bg-amber-100 px-1.5 py-0.5 rounded font-bold">npm run monitor</code> in a separate terminal.
                </div>
            </div>
        );
    }

    if (!isHealthy) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 mb-6">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="flex-1 text-sm font-medium">
                    Monitoring Engine is <span className="font-bold">Down</span>. Last active: {formatDistanceToNow(lastPulse)} ago.
                    <p className="text-xs opacity-75 mt-0.5">Restart it with <code className="bg-red-100 px-1 py-0.5 rounded">npm run monitor</code></p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-800 mb-6">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-sm font-medium flex items-center gap-2">
                Monitoring Engine is <span className="font-bold">Active</span>
                <span className="text-xs opacity-75 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Updated {formatDistanceToNow(lastPulse)} ago
                </span>
            </div>
        </div>
    );
}
