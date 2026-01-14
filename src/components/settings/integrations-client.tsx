'use client';

import { useState, useTransition } from 'react';
import { Slack, MessageCircle, Phone, Lock, Loader2, Send, CheckCircle, AlertTriangle, ExternalLink, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
    saveUserIntegration,
    testSlackWebhook,
    testDiscordWebhook,
    testWhatsAppMessage
} from '@/lib/actions';

type IntegrationType = 'SLACK' | 'DISCORD' | 'WHATSAPP';

interface IntegrationCardProps {
    type: IntegrationType;
    title: string;
    description: string;
    icon: React.ReactNode;
    isEnabled: boolean;
    userIntegration?: {
        webhookUrl?: string | null;
        phoneNumber?: string | null;
        apiKey?: string | null;
        isEnabled: boolean;
        notifyDown: boolean;
        notifyRecovery: boolean;
        notifySSL: boolean;
        notifySlow: boolean;
    } | null;
    isSuperAdmin: boolean;
    isWhatsApp?: boolean;
    setupInstructions: React.ReactNode;
}

function IntegrationCard({
    type,
    title,
    description,
    icon,
    isEnabled,
    userIntegration,
    isSuperAdmin,
    isWhatsApp = false,
    setupInstructions
}: IntegrationCardProps) {
    const [isPending, startTransition] = useTransition();
    const [isTesting, setIsTesting] = useState(false);
    const [showSetup, setShowSetup] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState(userIntegration?.webhookUrl || '');
    const [phoneNumber, setPhoneNumber] = useState(userIntegration?.phoneNumber || '');
    const [apiKey, setApiKey] = useState(userIntegration?.apiKey || '');
    const [testNumber, setTestNumber] = useState('');
    const [enabled, setEnabled] = useState(userIntegration?.isEnabled ?? true);
    const [notifyDown, setNotifyDown] = useState(userIntegration?.notifyDown ?? true);
    const [notifyRecovery, setNotifyRecovery] = useState(userIntegration?.notifyRecovery ?? true);
    const [notifySSL, setNotifySSL] = useState(userIntegration?.notifySSL ?? true);
    const [notifySlow, setNotifySlow] = useState(userIntegration?.notifySlow ?? false);

    const onSave = () => {
        startTransition(async () => {
            try {
                await saveUserIntegration({
                    type,
                    webhookUrl: isWhatsApp ? undefined : webhookUrl,
                    phoneNumber: isWhatsApp ? phoneNumber : undefined,
                    isEnabled: enabled,
                    notifyDown,
                    notifyRecovery,
                    notifySSL,
                    notifySlow,
                });
                toast.success(`${title} integration saved successfully`);
            } catch (error) {
                console.error(error);
                toast.error(`Failed to save ${title} integration`);
            }
        });
    };

    const onTest = async () => {
        setIsTesting(true);
        try {
            let result;
            if (type === 'SLACK') {
                if (!webhookUrl) {
                    toast.error('Please enter a Slack webhook URL first');
                    setIsTesting(false);
                    return;
                }
                result = await testSlackWebhook(webhookUrl);
            } else if (type === 'DISCORD') {
                if (!webhookUrl) {
                    toast.error('Please enter a Discord webhook URL first');
                    setIsTesting(false);
                    return;
                }
                result = await testDiscordWebhook(webhookUrl);
            } else if (type === 'WHATSAPP') {
                const targetNumber = testNumber || phoneNumber;
                if (!targetNumber || !apiKey) {
                    toast.error('Please enter phone number and API key first');
                    setIsTesting(false);
                    return;
                }
                result = await testWhatsAppMessage(targetNumber, apiKey);
            }
            if (result?.success) {
                toast.success('Test message sent successfully! Check your ' + title);
            } else {
                toast.error(`Test failed: ${result?.error || 'Unknown error'}`);
            }
        } catch (error) {
            toast.error('Failed to send test message');
        } finally {
            setIsTesting(false);
        }
    };

    // Show locked state if not enabled globally and user is not super admin
    if (!isEnabled && !isSuperAdmin) {
        return (
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 opacity-75">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-gray-100/80 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                    <div className="text-center p-6">
                        <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-600 mb-1">Premium Feature</p>
                        <p className="text-xs text-gray-500">Available only in Team and Enterprise plans.</p>
                        <button className="mt-3 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all">
                            Upgrade Now
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">{icon}</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            {/* Setup Instructions Toggle */}
            <button
                onClick={() => setShowSetup(!showSetup)}
                className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-700 mb-4"
            >
                <Info className="w-3.5 h-3.5" />
                {showSetup ? 'Hide setup instructions' : 'Show setup instructions'}
            </button>

            {showSetup && (
                <div className="mb-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    {setupInstructions}
                </div>
            )}

            {isWhatsApp ? (
                <div className="space-y-3 mb-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Your Phone Number (with country code)</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+917976327138"
                            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">CallMeBot API Key</label>
                        <input
                            type="text"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Your API key from CallMeBot"
                            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Test Number (optional)</label>
                        <div className="mt-1 flex gap-2">
                            <input
                                type="tel"
                                value={testNumber}
                                onChange={(e) => setTestNumber(e.target.value)}
                                placeholder="Leave empty to use your number"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={onTest}
                                disabled={isTesting || !apiKey || (!phoneNumber && !testNumber)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                            >
                                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Test
                            </button>
                        </div>
                        <p className="mt-1 text-[10px] text-gray-400">Send a test message to verify your setup</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3 mb-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Webhook URL</label>
                        <div className="mt-1 flex gap-2">
                            <input
                                type="url"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                placeholder={type === 'SLACK' ? 'https://hooks.slack.com/services/...' : 'https://discord.com/api/webhooks/...'}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={onTest}
                                disabled={isTesting || !webhookUrl}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                            >
                                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Test
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">Notification Types</p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Monitor Down', checked: notifyDown, onChange: setNotifyDown },
                        { label: 'Monitor Recovery', checked: notifyRecovery, onChange: setNotifyRecovery },
                        { label: 'SSL Expiring', checked: notifySSL, onChange: setNotifySSL },
                        { label: 'Slow Response', checked: notifySlow, onChange: setNotifySlow },
                    ].map((item) => (
                        <label key={item.label} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={(e) => item.onChange(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            {item.label}
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={onSave}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
                {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                    <><CheckCircle className="w-4 h-4" /> Save Integration</>
                )}
            </button>
        </div>
    );
}

// Setup instruction components
const SlackSetupInstructions = () => (
    <div className="text-xs text-gray-600 space-y-2">
        <p className="font-semibold text-gray-800">How to get your Slack Webhook URL:</p>
        <ol className="list-decimal list-inside space-y-1">
            <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1">api.slack.com/apps <ExternalLink className="w-3 h-3" /></a></li>
            <li>Click "Create New App" → "From scratch"</li>
            <li>Name your app and select your workspace</li>
            <li>Go to "Incoming Webhooks" in the sidebar</li>
            <li>Toggle "Activate Incoming Webhooks" to On</li>
            <li>Click "Add New Webhook to Workspace"</li>
            <li>Select a channel and authorize</li>
            <li>Copy the Webhook URL and paste it above</li>
        </ol>
    </div>
);

const DiscordSetupInstructions = () => (
    <div className="text-xs text-gray-600 space-y-2">
        <p className="font-semibold text-gray-800">How to get your Discord Webhook URL:</p>
        <ol className="list-decimal list-inside space-y-1">
            <li>Open Discord and go to your server</li>
            <li>Right-click the channel → "Edit Channel"</li>
            <li>Go to "Integrations" → "Webhooks"</li>
            <li>Click "New Webhook"</li>
            <li>Give it a name (e.g., "WebMoniter Alerts")</li>
            <li>Click "Copy Webhook URL"</li>
            <li>Paste the URL above</li>
        </ol>
    </div>
);

const WhatsAppSetupInstructions = () => (
    <div className="text-xs text-gray-600 space-y-2">
        <p className="font-semibold text-gray-800">How to set up WhatsApp notifications (using CallMeBot):</p>
        <div className="p-2 bg-amber-50 border border-amber-200 rounded mb-2">
            <p className="text-amber-700 font-medium">⚠️ One-time activation required</p>
        </div>
        <ol className="list-decimal list-inside space-y-1">
            <li>Save this number to your contacts: <strong>+34 621 331 709</strong></li>
            <li>Open WhatsApp and send this exact message to that number:
                <code className="block bg-gray-100 p-2 rounded mt-1 text-gray-800">I allow callmebot to send me messages</code>
            </li>
            <li>Wait for the reply with your API Key (may take a few minutes)</li>
            <li>Enter your phone number and API key above</li>
            <li>Click "Test" to verify it works</li>
        </ol>
        <p className="mt-2 text-gray-500">Note: This uses the free CallMeBot service. Messages are limited to personal use.</p>
    </div>
);

interface IntegrationsClientProps {
    integrationSettings: {
        slackEnabled: boolean;
        discordEnabled: boolean;
        whatsappEnabled: boolean;
    } | null;
    userIntegrations: Array<{
        type: string;
        webhookUrl?: string | null;
        phoneNumber?: string | null;
        isEnabled: boolean;
        notifyDown: boolean;
        notifyRecovery: boolean;
        notifySSL: boolean;
        notifySlow: boolean;
    }>;
    isSuperAdmin: boolean;
    permissions: string[];
}

export default function IntegrationsClient({
    integrationSettings,
    userIntegrations,
    isSuperAdmin,
    permissions
}: IntegrationsClientProps) {
    const slackIntegration = userIntegrations.find(i => i.type === 'SLACK');
    const discordIntegration = userIntegrations.find(i => i.type === 'DISCORD');
    const whatsappIntegration = userIntegrations.find(i => i.type === 'WHATSAPP');

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <IntegrationCard
                    type="SLACK"
                    title="Slack"
                    description="Send alerts to Slack channels"
                    icon={<Slack className="w-5 h-5 text-[#4A154B]" />}
                    isEnabled={permissions.includes('SLACK')}
                    userIntegration={slackIntegration as any}
                    isSuperAdmin={isSuperAdmin}
                    setupInstructions={<SlackSetupInstructions />}
                />

                <IntegrationCard
                    type="DISCORD"
                    title="Discord"
                    description="Send alerts to Discord channels"
                    icon={<MessageCircle className="w-5 h-5 text-[#5865F2]" />}
                    isEnabled={permissions.includes('DISCORD')}
                    userIntegration={discordIntegration as any}
                    isSuperAdmin={isSuperAdmin}
                    setupInstructions={<DiscordSetupInstructions />}
                />

                <IntegrationCard
                    type="WHATSAPP"
                    title="WhatsApp"
                    description="Receive alerts via WhatsApp"
                    icon={<Phone className="w-5 h-5 text-[#25D366]" />}
                    isEnabled={permissions.includes('WHATSAPP')}
                    userIntegration={whatsappIntegration as any}
                    isSuperAdmin={isSuperAdmin}
                    isWhatsApp
                    setupInstructions={<WhatsAppSetupInstructions />}
                />
            </div>
        </div>
    );
}
