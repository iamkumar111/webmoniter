import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface RecentActivityProps {
  logs: any[];
}

export default function RecentActivity({ logs }: RecentActivityProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-sm text-center py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="px-6 py-3 flex items-start gap-3">
            <div className={`mt-0.5 ${log.status === "UP" ? "text-green-500" : "text-red-500"}`}>
              {log.status === "UP" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {log.monitor.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={log.status === "UP" ? "text-green-600" : "text-red-600"}>
                  {log.status === "UP" ? "Up" : "Down"}
                </span>
                <span>•</span>
                <span>{log.responseTime}ms</span>
                {log.statusCode && (
                  <>
                    <span>•</span>
                    <span>HTTP {log.statusCode}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(log.timestamp), "HH:mm")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
