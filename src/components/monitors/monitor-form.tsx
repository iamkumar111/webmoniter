'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createMonitor, updateMonitor, deleteMonitor } from '@/lib/actions';
import { Monitor, MonitorType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Save, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import DOMPurify from 'isomorphic-dompurify';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
  type: z.enum(["HTTP", "HTTPS", "PING"]),
  interval: z.coerce.number().min(1),
  timeout: z.coerce.number().min(5).max(60),
  recipients: z.string().optional(),
  verifySSL: z.boolean(),
  alertOnDown: z.boolean(),
  alertOnRecovery: z.boolean(),
  alertOnSSL: z.boolean(),
  alertOnSlow: z.boolean(),
  method: z.string(),
  expectedStatusCode: z.coerce.number(),
  responseThreshold: z.coerce.number().min(100),
  alertCooldown: z.coerce.number().min(1).default(5),
});

type FormData = z.infer<typeof formSchema>;

export default function MonitorForm({ monitor, minInterval = 1 }: { monitor?: Monitor; minInterval?: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: monitor?.name || '',
      url: monitor?.url || '',
      type: (monitor?.type as any) || 'HTTPS',
      interval: monitor?.interval || 5,
      timeout: monitor?.timeout || 30,
      recipients: monitor?.recipients || '',
      verifySSL: monitor?.verifySSL ?? true,
      alertOnDown: monitor?.alertOnDown ?? true,
      alertOnRecovery: monitor?.alertOnRecovery ?? true,
      alertOnSSL: monitor?.alertOnSSL ?? true,
      alertOnSlow: monitor?.alertOnSlow ?? true,
      method: monitor?.method || 'GET',
      expectedStatusCode: monitor?.expectedStatusCode || 200,
      responseThreshold: (monitor as any)?.responseThreshold || 6000,
      alertCooldown: (monitor as any)?.alertCooldown || 5,
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    // Sanitize inputs (BUG-007)
    const sanitizedData = {
      ...data,
      name: DOMPurify.sanitize(data.name),
    };

    try {
      let result;
      if (monitor) {
        result = await updateMonitor(monitor.id, sanitizedData);
      } else {
        result = await createMonitor(sanitizedData);
      }

      if (result && typeof result === 'object' && 'error' in result) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
    } catch (error: any) {
      // NEXT_REDIRECT is expected - Next.js uses thrown errors for redirects
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        throw error; // Re-throw to allow the redirect to happen
      }

      console.error('Monitor save error:', error);
      const errorMessage = error?.message || 'Something went wrong. Please check your inputs.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this monitor? This action cannot be undone.')) return;
    setLoading(true);
    try {
      if (monitor) {
        await deleteMonitor(monitor.id);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete monitor');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/monitors" className="flex items-center text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Monitors
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {monitor ? 'Edit Monitor' : 'Create New Monitor'}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Friendly Name</label>
            <input
              {...form.register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Marketing Site"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">URL / IP Address</label>
            <input
              {...form.register('url')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://example.com"
            />
            {form.formState.errors.url && (
              <p className="text-xs text-red-500">{form.formState.errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Monitor Type</label>
            <select
              {...form.register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="HTTP">HTTP</option>
              <option value="HTTPS">HTTPS</option>
              <option value="PING">Ping (TCP)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Check Interval (minutes)</label>
            <select
              {...form.register('interval', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {[1, 2, 5, 10, 15, 30, 60].filter(m => m >= minInterval).map(m => (
                <option key={m} value={m}>
                  {m} minutes
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Request Timeout (seconds)</label>
            <input
              type="number"
              {...form.register('timeout', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Alert Cooldown (minutes)</label>
            <input
              type="number"
              {...form.register('alertCooldown', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Degraded Threshold (ms)</label>
            <input
              type="number"
              {...form.register('responseThreshold', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="6000"
            />
            <p className="text-[10px] text-gray-500">Mark as DEGRADED if response takes longer than this.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Alert Recipients (comma separated)</label>
            <input
              {...form.register('recipients')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="alert@example.com, tech@example.com"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="verifySSL"
                {...form.register('verifySSL')}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="verifySSL" className="text-sm text-gray-700">Verify SSL Certificate</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="alertOnDown"
                {...form.register('alertOnDown')}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="alertOnDown" className="text-sm text-gray-700">Alert when Down</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="alertOnRecovery"
                {...form.register('alertOnRecovery')}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="alertOnRecovery" className="text-sm text-gray-700">Alert when Recovered</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="alertOnSSL"
                {...form.register('alertOnSSL')}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="alertOnSSL" className="text-sm text-gray-700">Alert on SSL Expiry</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {monitor && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center px-4 py-2 border border-red-200 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Monitor
          </button>
        )}
        <div className={monitor ? "" : "ml-auto"}>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {monitor ? 'Update Monitor' : 'Create Monitor'}
          </button>
        </div>
      </div>
    </form>
  );
}
