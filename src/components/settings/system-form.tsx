"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateSystemSettings } from "@/lib/actions";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const SystemSettingsSchema = z.object({
  defaultInterval: z.coerce.number().min(1, "Minimum 1 minute"),
  defaultTimeout: z.coerce.number().min(5, "Minimum 5 seconds"),
  defaultFailureThreshold: z.coerce.number().min(1, "Minimum 1 check"),
  defaultRecoveryThreshold: z.coerce.number().min(1, "Minimum 1 check"),
  retentionCheckHistory: z.coerce.number().min(1, "Minimum 1 day"),
  retentionAlertLog: z.coerce.number().min(1, "Minimum 1 day"),
  retentionIncidentLog: z.coerce.number().min(1, "Minimum 1 day"),
  googleAnalyticsId: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialGithub: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialFacebook: z.string().optional(),
  defaultAlertCooldown: z.coerce.number().min(1, "Minimum 1 minute"),
});

type SystemSettingsFormValues = z.infer<typeof SystemSettingsSchema>;

interface SystemSettingsFormProps {
  initialData?: SystemSettingsFormValues | null;
}

export default function SystemSettingsForm({ initialData }: SystemSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(SystemSettingsSchema) as any,
    defaultValues: initialData || {
      defaultInterval: 5,
      defaultTimeout: 30,
      defaultFailureThreshold: 1,
      defaultRecoveryThreshold: 1,
      retentionCheckHistory: 90,
      retentionAlertLog: 90,
      retentionIncidentLog: 90,
      googleAnalyticsId: "",
      socialTwitter: "",
      socialGithub: "",
      socialLinkedin: "",
      socialFacebook: "",
      defaultAlertCooldown: 5,
    },
  });

  const onSubmit = (data: SystemSettingsFormValues) => {
    startTransition(async () => {
      try {
        await updateSystemSettings(data);
        toast.success("System settings saved successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to save system settings");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Default Monitor Settings</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Default Interval (minutes)</label>
            <input
              {...register("defaultInterval")}
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.defaultInterval && <p className="text-sm text-red-500">{errors.defaultInterval.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Default Timeout (seconds)</label>
            <input
              {...register("defaultTimeout")}
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.defaultTimeout && <p className="text-sm text-red-500">{errors.defaultTimeout.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Failure Threshold (checks)</label>
            <input
              {...register("defaultFailureThreshold")}
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.defaultFailureThreshold && <p className="text-sm text-red-500">{errors.defaultFailureThreshold.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Recovery Threshold (checks)</label>
            <input
              {...register("defaultRecoveryThreshold")}
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.defaultRecoveryThreshold && <p className="text-sm text-red-500">{errors.defaultRecoveryThreshold.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Data Retention Policy</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Check History (days)</label>
            <input
              {...register("retentionCheckHistory")}
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.retentionCheckHistory && <p className="text-sm text-red-500">{errors.retentionCheckHistory.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Alert Logs (days)</label>
            <input
              {...register("retentionAlertLog")}
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.retentionAlertLog && <p className="text-sm text-red-500">{errors.retentionAlertLog.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Incident Logs (days)</label>
            <input
              {...register("retentionIncidentLog")}
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.retentionIncidentLog && <p className="text-sm text-red-500">{errors.retentionIncidentLog.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Default Alert Cooldown (min)</label>
            <input
              {...register("defaultAlertCooldown")}
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="5"
            />
            {errors.defaultAlertCooldown && <p className="text-sm text-red-500">{errors.defaultAlertCooldown.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Analytics</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Google Analytics / GTM ID</label>
            <input
              {...register("googleAnalyticsId")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="G-XXXXXXXXXX or GTM-XXXXXX"
            />
            <p className="text-xs text-gray-500">Enter your measurement ID to enable Google Analytics.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Social Media Links (Footer)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Twitter (X)</label>
            <input
              {...register("socialTwitter")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://twitter.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">GitHub</label>
            <input
              {...register("socialGithub")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">LinkedIn</label>
            <input
              {...register("socialLinkedin")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Facebook</label>
            <input
              {...register("socialFacebook")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Defaults
            </>
          )}
        </button>
      </div>
    </form>
  );
}
