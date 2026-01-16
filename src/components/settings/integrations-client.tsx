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
            <div className="group relative bg-white rounded-xl border border-gray-200 p-6 overflow-hidden shadow-sm hover:shadow-md transition-all text-left">
                {/* Content (Dimmed) */}
                <div className="flex items-center justify-between opacity-40 grayscale pointer-events-none select-none filter blur-[1px]">
                    <div className="flex items-center gap-5">
                        {icon}
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg tracking-tight">{title}</h3>
                            <p className="text-sm text-gray-500 font-medium">{description}</p>
                        </div>
                    </div>
                    <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
                </div>

                {/* Overlay Badge */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6">
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 text-center max-w-sm transform transition-transform group-hover:scale-105 duration-300">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Premium Feature</h4>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            Upgrade to Team or Enterprise plan to unlock {title} integration.
                        </p>
                        <button className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Header / Toggle Section */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    {icon}
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg tracking-tight">{title}</h3>
                        <p className="text-sm text-gray-500 font-medium">{description}</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            {/* Expanded Content Section */}
            {enabled && (
                <div className="px-6 pb-6 pt-0 space-y-6">
                    {/* Setup Instructions Toggle */}
                    <div className="border-t border-gray-100 pt-4">
                        <button
                            onClick={() => setShowSetup(!showSetup)}
                            className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            <Info className="w-3.5 h-3.5" />
                            {showSetup ? 'Hide setup instructions' : 'Show setup instructions'}
                        </button>

                        {showSetup && (
                            <div className="mt-3 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100/50 text-sm">
                                {setupInstructions}
                            </div>
                        )}
                    </div>

                    {isWhatsApp ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+1234567890"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">API Key</label>
                                    <input
                                        type="text"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)} // Mask API key visually?
                                        placeholder="Enter CallMeBot API Key"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Test Connection</label>
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        value={testNumber}
                                        onChange={(e) => setTestNumber(e.target.value)}
                                        placeholder="Optional test number"
                                        className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={onTest}
                                        disabled={isTesting || !apiKey || (!phoneNumber && !testNumber)}
                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                    >
                                        {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                        Test
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Webhook URL</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="url"
                                        value={webhookUrl}
                                        onChange={(e) => setWebhookUrl(e.target.value)}
                                        placeholder={type === 'SLACK' ? 'https://hooks.slack.com/services/...' : 'https://discord.com/api/webhooks/...'}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 min-w-0"
                                    />
                                    <button
                                        type="button"
                                        onClick={onTest}
                                        disabled={isTesting || !webhookUrl}
                                        className="shrink-0 px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                                    >
                                        {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                        Send Test
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-100 pt-4">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 block">Alert Preference</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { label: 'Monitor Down', checked: notifyDown, onChange: setNotifyDown },
                                { label: 'Monitor Recovery', checked: notifyRecovery, onChange: setNotifyRecovery },
                                { label: 'SSL Expiration', checked: notifySSL, onChange: setNotifySSL },
                                { label: 'Slow Response', checked: notifySlow, onChange: setNotifySlow },
                            ].map((item) => (
                                <label key={item.label} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={(e) => item.onChange(e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={onSave}
                            disabled={isPending}
                            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm"
                        >
                            {isPending ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                            ) : (
                                <><CheckCircle className="w-4 h-4" /> Save Changes</>
                            )}
                        </button>
                    </div>
                </div>
            )}
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
            <li>Give it a name (e.g., "WebsMoniter Alerts")</li>
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
            <div className="grid gap-6 grid-cols-1 max-w-4xl mx-auto">
                <IntegrationCard
                    type="SLACK"
                    title="Slack"
                    description="Real-time alerts to your Slack workspace"
                    icon={
                        <div className="w-12 h-12 flex items-center justify-center bg-[#4A154B]/10 rounded-xl shrink-0">
                            <Slack className="w-6 h-6 text-[#4A154B]" />
                        </div>
                    }
                    isEnabled={permissions.includes('SLACK')}
                    userIntegration={slackIntegration as any}
                    isSuperAdmin={isSuperAdmin}
                    setupInstructions={<SlackSetupInstructions />}
                />

                <IntegrationCard
                    type="DISCORD"
                    title="Discord"
                    description="Instant notifications to Discord channels"
                    icon={
                        <div className="w-12 h-12 flex items-center justify-center bg-[#5865F2]/10 rounded-xl shrink-0">
                            <MessageCircle className="w-6 h-6 text-[#5865F2]" />
                        </div>
                    }
                    isEnabled={permissions.includes('DISCORD')}
                    userIntegration={discordIntegration as any}
                    isSuperAdmin={isSuperAdmin}
                    setupInstructions={<DiscordSetupInstructions />}
                />

                <IntegrationCard
                    type="WHATSAPP"
                    title="WhatsApp"
                    description="Direct alerts to your mobile via WhatsApp"
                    icon={
                        <div className="w-12 h-12 flex items-center justify-center bg-[#25D366]/10 rounded-xl shrink-0">
                            <Phone className="w-6 h-6 text-[#25D366]" />
                        </div>
                    }
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
