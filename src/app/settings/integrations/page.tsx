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
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <Puzzle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full w-fit mt-1">
                            {permissions.groupName} Plan
                        </span>
                    </div>
                </div>
                <p className="text-gray-600">
                    Connect your monitoring alerts to external services.
                    <span className="ml-1 text-sm text-gray-500">(Your plan allows: {permissions.integrations.join(', ') || 'None'})</span>
                </p>
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
