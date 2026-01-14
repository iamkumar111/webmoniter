import { getMonitors } from "@/lib/monitors";
import Link from "next/link";
import { Activity, Plus, Search, Filter, Clock, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import AutoRefresh from "@/components/layout/auto-refresh";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MonitorsPage() {
  const monitors = await getMonitors();

  return (
    <div className="space-y-6">
      <AutoRefresh intervalMs={30000} />
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
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
              {monitors.map((monitor) => (
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
                    {monitor.incidents && monitor.incidents.length > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {format(new Date(monitor.incidents[0].startTime), 'MMM d, HH:mm')}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {monitor.incidents[0].status === 'OPEN' ? 'Still ongoing' : 'Resolved'}
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
                    <Link href={`/monitors/${monitor.id}`} className="text-green-600 hover:text-green-700 font-medium font-bold">Details</Link>
                  </td>
                </tr>
              ))}
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
