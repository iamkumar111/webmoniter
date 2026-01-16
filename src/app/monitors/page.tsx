import { getMonitors } from "@/lib/monitors";
import Link from "next/link";
import { Activity, Plus, Search, Filter } from "lucide-react";
import RealTimeMonitorList from "@/components/monitors/real-time-list";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MonitorsPage() {
  const monitors = await getMonitors();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-600" />
          Monitors
        </h1>
        <Link
          href="/monitors/new"
          className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Monitor
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search monitors..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <RealTimeMonitorList initialMonitors={monitors} />
    </div>
  );
}
