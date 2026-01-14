import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Globe, ShieldCheck, Activity, AlertTriangle, Edit } from "lucide-react";
import { format } from "date-fns";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import MonitorChart from "@/components/monitors/monitor-chart";
import EngineStatus from "@/components/dashboard/engine-status";
import AutoRefresh from "@/components/layout/auto-refresh";
import CheckNowButton from "@/components/monitors/check-now-button";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const monitor = await prisma.monitor.findUnique({
    where: { id },
    select: { name: true }
  });

  if (!monitor) {
    return {
      title: "Monitor Not Found - WebMoniter"
    };
  }

  return {
    title: `${monitor.name} - Monitor Status | WebMoniter`,
    description: `Real-time uptime status and performance metrics for ${monitor.name}.`,
  };
}

export default async function MonitorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const monitor = await prisma.monitor.findUnique({
    where: { id },
  }) as any;

  // Fetch SSL cert separately to avoid type issues if relation is missing in generated client
  const sslCertificate = await prisma.sslCertificate.findUnique({
    where: { monitorId: id }
  });

  if (monitor) monitor.sslCertificate = sslCertificate;

  if (!monitor) notFound();

  // Fetch checks for chart
  const checks = await prisma.check.findMany({
    where: { monitorId: id },
    orderBy: { timestamp: 'desc' },
    take: 50,
  });

  const chartData = checks.map(c => ({
    time: format(c.timestamp, 'HH:mm'),
    latency: c.responseTime,
  })).reverse();

  // Fetch recent incidents
  const incidents = await prisma.incident.findMany({
    where: { monitorId: id },
    orderBy: { startTime: 'desc' },
    take: 5
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <AutoRefresh intervalMs={30000} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/monitors" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{monitor.name}</h1>
            <a href={monitor.url} target="_blank" rel="noreferrer" className="text-sm text-green-600 hover:underline flex items-center gap-1">
              {monitor.url} <Globe className="w-3 h-3" />
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <CheckNowButton monitorId={monitor.id} />
          <Link
            href={`/monitors/${monitor.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Monitor
          </Link>
        </div>
      </div>

      <Suspense fallback={<div className="h-16 bg-white rounded-xl animate-pulse" />}>
        <EngineStatus />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Main Status Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800">Response Time (Last 50 checks)</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">{monitor.status}</span>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <MonitorChart data={chartData} />
            </div>
          </div>

          {/* Recent Checks Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Recent Checks</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Latency</th>
                    <th className="px-6 py-3">Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {checks.slice(0, 10).map((check) => (
                    <tr key={check.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                        {format(check.timestamp, 'MMM d, HH:mm:ss')}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${check.status === 'UP' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {check.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono">{check.responseTime}ms</td>
                      <td className="px-6 py-3">{check.statusCode || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* SSL Info */}
          {monitor.type === 'HTTPS' && monitor.sslCertificate && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                SSL Certificate
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Issuer</div>
                  <div className="text-sm font-medium text-gray-900">{monitor.sslCertificate.issuer}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Valid Until</div>
                  <div className="text-sm font-medium text-gray-900">
                    {monitor.sslCertificate.validUntil ? format(monitor.sslCertificate.validUntil, 'PP') : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Days Remaining</div>
                  <div className={`text-xl font-bold ${(monitor.sslCertificate.daysRemaining || 0) < 14 ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {monitor.sslCertificate.daysRemaining} days
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Incidents */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Recent Incidents
            </h3>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="border-l-2 border-red-500 pl-3">
                  <div className="text-sm font-medium text-gray-900">
                    {incident.type} - {incident.status}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(incident.startTime, 'MMM d, HH:mm')}
                    {incident.duration && ` • ${incident.duration}s`}
                  </div>
                </div>
              ))}
              {incidents.length === 0 && (
                <p className="text-sm text-gray-500">No incidents reported.</p>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Configuration
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <dt className="text-gray-500 font-medium tracking-tight">Status</dt>
                <dd className="font-bold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${monitor.status === 'UP' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {monitor.status}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500">Last Check</dt>
                <dd className="font-medium text-gray-900">
                  {monitor.lastCheck ? format(new Date(monitor.lastCheck), 'HH:mm:ss') : 'Never'}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500">Next Check</dt>
                <dd className="font-medium text-gray-900 text-indigo-600">
                  {monitor.nextCheck ? format(new Date(monitor.nextCheck), 'HH:mm:ss') : 'Scheduled'}
                </dd>
              </div>
              <div className="pt-2 border-t border-gray-50 mt-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Check Interval</dt>
                  <dd className="font-medium">{monitor.interval} mins</dd>
                </div>
                <div className="flex justify-between mt-2">
                  <dt className="text-gray-500">Timeout</dt>
                  <dd className="font-medium">{monitor.timeout}s</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
