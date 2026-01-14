import { getSmtpConfig, getSystemSettings } from "@/lib/settings";
import SmtpForm from "@/components/settings/smtp-form";
import SystemSettingsForm from "@/components/settings/system-form";

export default async function SettingsPage() {
  const smtpConfig = await getSmtpConfig();
  const systemSettings = await getSystemSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Manage global system configuration</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">General Configuration</h2>
          <p className="text-sm text-gray-500 mb-6">
            Set default values for new monitors and data retention policies.
          </p>
          <SystemSettingsForm initialData={systemSettings as any} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">SMTP Configuration</h2>
          <p className="text-sm text-gray-500 mb-6">
            Configure the email server settings for sending alerts.
          </p>
          <SmtpForm initialData={smtpConfig} />
        </div>
      </div>
    </div>
  );
}
