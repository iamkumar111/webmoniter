'use client';

import { useState, useTransition } from 'react';
import { Shield, Loader2, Save, Slack, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { updateIntegrationSettings } from '@/lib/actions';

interface IntegrationAdminProps {
    settings: {
        slackEnabled: boolean;
        discordEnabled: boolean;
        whatsappEnabled: boolean;
    } | null;
}

export default function IntegrationAdmin({ settings }: IntegrationAdminProps) {
    const [isPending, startTransition] = useTransition();
    const [slackEnabled, setSlackEnabled] = useState(settings?.slackEnabled ?? false);
    const [discordEnabled, setDiscordEnabled] = useState(settings?.discordEnabled ?? false);
    const [whatsappEnabled, setWhatsappEnabled] = useState(settings?.whatsappEnabled ?? false);

    const onSave = () => {
        startTransition(async () => {
            try {
                await updateIntegrationSettings({
                    slackEnabled,
                    discordEnabled,
                    whatsappEnabled,
                });
                toast.success('Integration settings updated');
            } catch (error) {
                console.error(error);
                toast.error('Failed to update integration settings');
            }
        });
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl border border-indigo-100 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Global Integration Access</h3>
                    <p className="text-sm text-gray-500">Control which integrations are available to users</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3">
                        <Slack className="w-5 h-5 text-[#4A154B]" />
                        <span className="font-medium text-gray-700">Slack</span>
                    </div>
                    <input
                        type="checkbox"
                        checked={slackEnabled}
                        onChange={(e) => setSlackEnabled(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                </label>

                <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-[#5865F2]" />
                        <span className="font-medium text-gray-700">Discord</span>
                    </div>
                    <input
                        type="checkbox"
                        checked={discordEnabled}
                        onChange={(e) => setDiscordEnabled(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                </label>

                <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#25D366]" />
                        <span className="font-medium text-gray-700">WhatsApp</span>
                    </div>
                    <input
                        type="checkbox"
                        checked={whatsappEnabled}
                        onChange={(e) => setWhatsappEnabled(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                </label>
            </div>

            <button
                onClick={onSave}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
                {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                    <><Save className="w-4 h-4" /> Save Access Settings</>
                )}
            </button>
        </div>
    );
}
