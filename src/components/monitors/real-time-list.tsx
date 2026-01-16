'use client';

import Link from "next/link";
import { Clock, Calendar, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Monitor {
    id: string;
    name: string;
    url: string;
    status: string;
    lastCheck: string | null;
    nextCheck: string | null;
    interval: number;
    checks: { responseTime: number }[];
    incidents: { startTime: string; status: string }[];
}

export default function RealTimeMonitorList({ initialMonitors }: { initialMonitors: any[] }) {
    const [monitors, setMonitors] = useState<Monitor[]>(initialMonitors);
    const [cleaning, setCleaning] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fast polling for real-time updates (every 2 seconds)
        const fetchMonitors = async () => {
            try {
                const res = await fetch('/api/monitors/list', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.monitors) {
                        setMonitors(data.monitors);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch monitors", error);
            }
        };

        const interval = setInterval(fetchMonitors, 2000);
        return () => clearInterval(interval);
    }, []);

    const cleanupStaleIncidents = async () => {
        setCleaning(true);
        try {
            const res = await fetch('/api/incidents/cleanup', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || 'Cleanup complete');
            } else {
                toast.error(data.error || 'Cleanup failed');
            }
        } catch (error) {
            toast.error('Cleanup request failed');
        } finally {
            setCleaning(false);
        }
    };

    // Check if there are stale incidents (OPEN incidents on UP monitors)
    const hasStaleIncidents = monitors.some(
        m => m.status === 'UP' && m.incidents?.length > 0 && m.incidents[0].status === 'OPEN'
    );

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {hasStaleIncidents && (
                <div className="p-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                    <span className="text-sm text-amber-800">
                        ⚠️ Some monitors have stale incidents (marked OPEN but monitor is UP)
                    </span>
                    <button
                        onClick={cleanupStaleIncidents}
                        disabled={cleaning}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-semibold hover:bg-amber-700 disabled:opacity-50"
                    >
                        <Trash2 className="w-3 h-3" />
                        {cleaning ? 'Cleaning...' : 'Fix Stale Incidents'}
                    </button>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Monitor</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                            <th className="px-6 py-3 font-semibold">Last Check</th>
                            <th className="px-6 py-3 font-semibold">Next Check</th>
                            <th className="px-6 py-3 font-semibold">Recent Incident</th>
                            <th className="px-6 py-3 font-semibold">Response</th>
                            <th className="px-6 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {monitors.map((monitor) => {
                            const incident = monitor.incidents?.[0];
                            const isResolved = incident?.status === 'RESOLVED';

                            return (
                                <tr key={monitor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{monitor.name}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{monitor.url}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={monitor.status} />
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-gray-400" />
                                            {monitor.lastCheck ? format(new Date(monitor.lastCheck), 'HH:mm:ss') : 'Never'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-indigo-600 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3 text-indigo-400" />
                                            {monitor.nextCheck ? format(new Date(monitor.nextCheck), 'HH:mm:ss') : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {incident ? (
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "font-medium flex items-center gap-1",
                                                    isResolved ? "text-green-600" : "text-red-600"
                                                )}>
                                                    {isResolved ? (
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    ) : (
                                                        <AlertCircle className="w-3 h-3" />
                                                    )}
                                                    {format(new Date(incident.startTime), 'MMM d, HH:mm')}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px]",
                                                    isResolved ? "text-green-500" : "text-red-400"
                                                )}>
                                                    {isResolved ? 'Resolved' : 'Still ongoing'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">No incidents</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono font-medium text-gray-900">
                                        {monitor.status === 'PAUSED' ? '-' : `${monitor.checks?.[0]?.responseTime || '-'}ms`}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button
                                            onClick={() => router.push(`/monitors/${monitor.id}`)}
                                            className="text-green-600 hover:text-green-700 font-medium font-bold"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {monitors.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    No monitors found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        UP: "bg-green-50 text-green-700 border-green-200",
        DOWN: "bg-red-50 text-red-700 border-red-200",
        DEGRADED: "bg-yellow-50 text-yellow-700 border-yellow-200",
        PAUSED: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", styles[status] || styles.PAUSED)}>
            {status}
        </span>
    );
}

