'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, ArrowUp, ArrowDown, Bug } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationToggle({ isSuperAdmin = false }: { isSuperAdmin?: boolean }) {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            toast.error('This browser does not support desktop notifications');
            return;
        }

        const result = await Notification.requestPermission();
        setPermission(result);
    };

    const testNotification = (type: 'up' | 'down') => {
        console.log(`[TEST] Triggering ${type.toUpperCase()} notification...`);

        if (!('Notification' in window)) {
            console.error('[TEST] Notification API not supported');
            toast.error('Notifications not supported');
            return;
        }

        if (Notification.permission !== 'granted') {
            console.error('[TEST] Permission not granted:', Notification.permission);
            toast.error('Notification permission not granted');
            return;
        }

        try {
            const title = type === 'up' ? '✅ TEST: Monitor RECOVERED' : '🔴 TEST: Monitor DOWN';
            const body = type === 'up'
                ? 'Test Monitor is back UP! (This is a test notification)'
                : 'Test Monitor is DOWN! Error: Test failure (This is a test notification)';

            console.log('[TEST] Creating notification:', { title, body });

            const notification = new Notification(title, {
                body,
                icon: '/favicon.svg',
                tag: `test-notification-${Date.now()}`,
                requireInteraction: type === 'down'
            });

            notification.onclick = () => {
                console.log('[TEST] Notification clicked');
                window.focus();
            };

            notification.onerror = (error) => {
                console.error('[TEST] Notification error:', error);
            };

            notification.onshow = () => {
                console.log('[TEST] Notification shown successfully');
            };

            console.log('[TEST] Notification created:', notification);
            toast.success(`Test ${type.toUpperCase()} notification sent!`);

            // Also play sound
            const audioUrl = type === 'up'
                ? 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'
                : 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
            const audio = new Audio(audioUrl);
            audio.volume = 0.5;
            audio.play().catch(e => console.log('[TEST] Audio play failed:', e));

        } catch (error) {
            console.error('[TEST] Failed to create notification:', error);
            toast.error('Failed to create notification - check console');
        }
    };

    const createRealIncident = async (type: 'down' | 'up') => {
        console.log(`[DEBUG] Creating REAL ${type.toUpperCase()} incident in database...`);
        toast.info(`Creating ${type} incident...`);

        try {
            const res = await fetch(`/api/debug?type=${type}`, { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                console.log('[DEBUG] Incident created:', data);
                toast.success(`Real ${type.toUpperCase()} incident created! Watch console for [NOTIFICATION] logs in ~10 seconds.`);

                // Also check what the notification API sees
                const checkRes = await fetch('/api/debug');
                const checkData = await checkRes.json();
                console.log('[DEBUG] Current notification API state:', checkData);
            } else {
                console.error('[DEBUG] Failed to create incident:', data);
                toast.error(data.error || 'Failed to create incident');
            }
        } catch (error) {
            console.error('[DEBUG] Error creating incident:', error);
            toast.error('Failed to create incident');
        }
    };

    if (permission === 'granted') {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 animate-pulse transition-all">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Monitored</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 hidden md:flex">
                    <Bell className="w-4 h-4" />
                    <span className="text-xs font-semibold">Browser Alerts Active</span>
                </div>
                {/* Test Notification Buttons - SUPER_ADMIN only */}
                {isSuperAdmin && (
                    <>
                        <button
                            onClick={() => testNotification('down')}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-md border border-red-200 hover:bg-red-100 transition-colors text-xs font-semibold"
                            title="Send a test DOWN notification (UI only)"
                        >
                            <ArrowDown className="w-3 h-3" />
                            Test
                        </button>
                        <button
                            onClick={() => testNotification('up')}
                            className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-200 hover:bg-emerald-100 transition-colors text-xs font-semibold"
                            title="Send a test UP notification (UI only)"
                        >
                            <ArrowUp className="w-3 h-3" />
                            Test
                        </button>
                        <button
                            onClick={() => createRealIncident('down')}
                            className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-md border border-purple-200 hover:bg-purple-100 transition-colors text-xs font-semibold"
                            title="Create a REAL incident in database to test full notification pipeline"
                        >
                            <Bug className="w-3 h-3" />
                            Real
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={requestPermission}
            className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors hidden md:flex"
            title="Enable browser notifications for down alerts"
        >
            <BellOff className="w-4 h-4" />
            <span className="text-xs font-semibold">Enable Browser Alerts</span>
        </button>
    );
}
