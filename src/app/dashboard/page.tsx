import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getMonitors } from "@/lib/monitors";
import { getRecentLogs } from "@/lib/logs";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import MonitorList from "@/components/dashboard/monitor-list";
import RecentActivity from "@/components/dashboard/recent-activity";
import EngineStatus from "@/components/dashboard/engine-status";
import AutoRefresh from "@/components/layout/auto-refresh";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const monitors = await getMonitors();
  const recentLogs = await getRecentLogs();

  const upCount = monitors.filter(m => m.status === "UP").length;
  const downCount = monitors.filter(m => m.status === "DOWN").length;
  const pausedCount = monitors.filter(m => m.status === "PAUSED").length;

  return (
    <div className="space-y-6">
      <AutoRefresh intervalMs={30000} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Overview of your monitoring status</p>
        </div>
        <Link
          href="/monitors/new"
          className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 hover:shadow-green-200 active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Monitor
        </Link>
      </div>

      <Suspense fallback={<div className="h-16 bg-gray-50 rounded-xl animate-pulse mb-6" />}>
        <EngineStatus />
      </Suspense>

      <DashboardStats
        total={monitors.length}
        up={upCount}
        down={downCount}
        paused={pausedCount}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-96 bg-white rounded-lg animate-pulse" />}>
            <MonitorList monitors={monitors} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div className="h-96 bg-white rounded-lg animate-pulse" />}>
            <RecentActivity logs={recentLogs} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
