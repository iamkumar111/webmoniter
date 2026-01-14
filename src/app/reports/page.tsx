import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { format } from "date-fns";
import { Download, FileText, BarChart } from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user) return null;
  
  // Fetch high-level stats for report
  const stats = await prisma.monitor.aggregate({
    _count: { _all: true },
  });

  const monitorStats = await prisma.monitor.findMany({
    select: {
      id: true,
      name: true,
      url: true,
      type: true,
      status: true,
      checks: {
        take: 100,
        orderBy: { timestamp: 'desc' },
        select: { responseTime: true, status: true }
      }
    }
  });
  
  // Fetch SSL info separately to avoid type errors with generated client
  const sslCertificates = await prisma.sslCertificate.findMany();
  const sslMap = new Map(sslCertificates.map(c => [c.monitorId, c]));

  // Calculate averages per monitor
  const reportData = monitorStats.map(m => {
    const totalResponse = m.checks.reduce((acc, c) => acc + c.responseTime, 0);
    const avgResponse = m.checks.length > 0 ? Math.round(totalResponse / m.checks.length) : 0;
    const uptimeChecks = m.checks.filter(c => c.status === 'UP').length;
    const uptime = m.checks.length > 0 ? Math.round((uptimeChecks / m.checks.length) * 100) : 0;
    const sslCert = sslMap.get((m as any).id); // cast to any if needed to get id, though findMany returns id by default? Wait, I didn't select id.

    return {
      name: m.name,
      url: m.url,
      type: m.type,
      status: m.status,
      avgResponse,
      uptime,
      sslDays: sslCert?.daysRemaining ?? 'N/A'
    };
  });

  // Simple CSV generation logic (Client side usually better, but server rendered for download link)
  const csvHeader = "Name,URL,Type,Status,Avg Response (ms),Uptime (Last 100),SSL Days\n";
  const csvRows = reportData.map(r => 
    `"${r.name}","${r.url}",${r.type},${r.status},${r.avgResponse},${r.uptime}%,${r.sslDays}`
  ).join("\n");
  const csvContent = csvHeader + csvRows;
  
  // Data URI for simple download (Limited size, but works for MVP)
  const csvDataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart className="w-6 h-6 text-green-600" />
          System Reports
        </h1>
        <a 
          href={csvDataUri} 
          download={`uptime-report-${format(new Date(), 'yyyy-MM-dd')}.csv`}
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Monitor Performance Summary</h2>
          <p className="text-sm text-gray-500">Based on last 100 checks</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Monitor</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Uptime</th>
                <th className="px-6 py-3 font-semibold">Avg Response</th>
                <th className="px-6 py-3 font-semibold">SSL Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {reportData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 text-gray-600">{row.type}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${row.uptime >= 99 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.uptime}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{row.avgResponse}ms</td>
                  <td className="px-6 py-4">
                    {row.sslDays !== 'N/A' ? (
                      <span className={`${Number(row.sslDays) < 14 ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                        {row.sslDays} days
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
