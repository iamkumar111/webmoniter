import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import IntegrationsClient from '@/components/settings/integrations-client';
import IntegrationAdmin from '@/components/settings/integration-admin';
import { Puzzle, ShieldX } from 'lucide-react';
import { getUserPermissions } from '@/lib/permissions';

export default async function IntegrationsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const isSuperAdmin = userRole === 'SUPER_ADMIN';

    // VIEWER role cannot access integrations
    if (userRole === 'VIEWER') {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-4 bg-red-100 rounded-full mb-4">
                        <ShieldX className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 max-w-md">
                        Integrations are not available for Viewer accounts.
                        Please contact your administrator to upgrade your account.
                    </p>
                </div>
            </div>
        );
    }

    // Get permissions
    const permissions = await getUserPermissions(userId);

    // Get global integration settings
    const integrationSettings = await prisma.integrationSettings.findUnique({
        where: { id: 'default' }
    });

    // Get user's integration settings
    const userIntegrations = await prisma.userIntegration.findMany({
        where: { userId }
    });

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg shadow-indigo-100">
                            <Puzzle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Integrations</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100">
                                    {permissions.groupName} Plan
                                </span>
                                <span className="text-sm text-gray-500 font-medium">
                                    Active Monitoring Alerts
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-600 leading-relaxed">
                        Connect your monitoring alerts to external services.
                        Stay notified wherever you are with real-time updates through Slack, Discord, and WhatsApp.
                        <span className="block mt-2 text-xs font-medium text-gray-400">
                            Your plan currently supports: {permissions.integrations.join(', ') || 'None'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Super Admin: Global Access Control */}
            {isSuperAdmin && (
                <IntegrationAdmin settings={integrationSettings} />
            )}

            {/* User Integration Cards */}
            <IntegrationsClient
                integrationSettings={integrationSettings}
                userIntegrations={userIntegrations}
                isSuperAdmin={isSuperAdmin}
                permissions={permissions.integrations}
            />
        </div>
    );
}
