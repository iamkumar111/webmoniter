import Link from "next/link";
import { CheckCircle2, XCircle, Pause, MoreVertical, Edit, Trash2, Play } from "lucide-react";
import { format } from "date-fns";
import { MonitorStatus } from "@prisma/client";

interface MonitorListProps {
  monitors: any[];
}

export default function MonitorList({ monitors }: MonitorListProps) {
  if (monitors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No monitors yet</h3>
        <p className="text-gray-500 mb-6">Get started by creating your first monitor</p>
        <Link
          href="/monitors/new"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Add Monitor
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Your Monitors</h2>
      </div>
      <div className="divide-y">
        {monitors.map((monitor) => (
          <div key={monitor.id} className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4">
            <div className="flex items-center gap-4">
              <StatusBadge status={monitor.status} />
              <div className="min-w-0">
                <Link href={`/monitors/${monitor.id}`} className="font-medium text-gray-900 hover:text-green-600 truncate block">
                  {monitor.name}
                </Link>
                <p className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-md">{monitor.url}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 text-sm text-gray-500 border-t sm:border-t-0 pt-3 sm:pt-0">
              <div className="flex items-center gap-4">
                {monitor.checks[0] && (
                  <span className="font-mono bg-gray-50 px-2 py-1 rounded">{monitor.checks[0].responseTime}ms</span>
                )}
                <span className="hidden xs:inline">{format(new Date(monitor.updatedAt), "MMM d, HH:mm")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/monitors/${monitor.id}/edit`}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href={`/monitors/${monitor.id}`}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="View Details"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: MonitorStatus }) {
  const styles = {
    UP: "bg-green-100 text-green-700",
    DOWN: "bg-red-100 text-red-700",
    DEGRADED: "bg-yellow-100 text-yellow-700",
    PAUSED: "bg-gray-100 text-gray-700",
  };

  const icons = {
    UP: <CheckCircle2 className="w-3 h-3" />,
    DOWN: <XCircle className="w-3 h-3" />,
    DEGRADED: <Pause className="w-3 h-3" />,
    PAUSED: <Pause className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.PAUSED}`}>
      {icons[status] || icons.PAUSED}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
