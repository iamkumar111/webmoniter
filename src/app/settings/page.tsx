import { getSmtpConfig, getSystemSettings } from "@/lib/settings";
import SmtpForm from "@/components/settings/smtp-form";
import SystemSettingsForm from "@/components/settings/system-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Rocket, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const isSuperAdmin = (session.user as any).role === 'SUPER_ADMIN';

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <Rocket className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Lost in Space?</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          You don't have permission to access these system settings. This area is restricted to Mission Control (Super Admins).
        </p>
        <Link
          href="/dashboard"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

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
