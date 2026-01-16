'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface Incident {
    id: string;
    status: string;
    errorDetails?: string;
    monitorId: string;
    monitor?: { name: string };
}

export default function NotificationListener() {
    const shownIncidentKeys = useRef<Set<string>>(new Set());
    const lastCheckTime = useRef<number>(Date.now());
    const pathname = usePathname();
    const router = useRouter();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Log on mount
    useEffect(() => {
        console.log('[NOTIFICATION] Component mounted. Pathname:', pathname);
        return () => {
            console.log('[NOTIFICATION] Component unmounting');
        };
    }, [pathname]);

    const showNotification = useCallback((incident: Incident) => {
        const key = `${incident.id}-${incident.status}`;

        // Skip if already shown
        if (shownIncidentKeys.current.has(key)) {
            console.log('[NOTIFICATION] Skipping already shown incident:', key);
            return;
        }
        shownIncidentKeys.current.add(key);

        const monitorName = incident.monitor?.name || 'Unknown Monitor';
        const isRecovery = incident.status === 'RESOLVED';
        const title = isRecovery ? '✅ Monitor UP' : '🔴 Monitor DOWN';

        // Extract error code from errorDetails (e.g., "Expected status code 200, but got 404" -> "404")
        let errorInfo = incident.errorDetails || 'Connection failed';
        const statusCodeMatch = errorInfo.match(/got (\d+)/);
        if (statusCodeMatch) {
            errorInfo = `Error Code ${statusCodeMatch[1]}`;
        }

        const body = isRecovery
            ? `Monitor "${monitorName}" is back UP!`
            : `Monitor "${monitorName}" is DOWN!\n${errorInfo}`;

        console.log(`[NOTIFICATION] 🔔 Showing notification for ${monitorName}: ${incident.status}`);

        // Show native notification
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                const notification = new Notification(title, {
                    body,
                    icon: '/favicon.svg',
                    tag: `monitor-alert-${incident.id}-${incident.status}`,
                    requireInteraction: !isRecovery
                });

                notification.onclick = () => {
                    window.focus();
                    window.location.href = `/monitors/${incident.monitorId}`;
                };

                console.log('[NOTIFICATION] ✅ Notification shown successfully');
            } catch (e) {
                console.error('[NOTIFICATION] ❌ Failed to show notification:', e);
            }
        } else {
            console.warn('[NOTIFICATION] ⚠️ Cannot show notification - permission:', Notification.permission);
        }

        // Play sound
        try {
            const audioUrl = isRecovery
                ? 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'
                : 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
            const audio = new Audio(audioUrl);
            audio.volume = 0.5;
            audio.play().catch(() => { });
        } catch (e) { }
    }, []);

    useEffect(() => {
        console.log('[NOTIFICATION] useEffect triggered. Pathname:', pathname);

        const isMonitoringPage = pathname.startsWith('/dashboard') || pathname.startsWith('/monitors');
        console.log('[NOTIFICATION] Is monitoring page?', isMonitoringPage);

        if (!isMonitoringPage) {
            console.log('[NOTIFICATION] Not on monitoring page, skipping polling setup');
            return;
        }

        // Request permission if not granted yet
        if ('Notification' in window) {
            console.log('[NOTIFICATION] Current permission:', Notification.permission);
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(p => {
                    console.log('[NOTIFICATION] Permission result:', p);
                });
            }
        }

        // Check for new incidents
        const checkIncidents = async () => {
            console.log('[NOTIFICATION] 🔍 Checking for new incidents...');

            if (!('Notification' in window) || Notification.permission !== 'granted') {
                console.log('[NOTIFICATION] ⚠️ Notification permission not granted, skipping check');
                return;
            }

            try {
                console.log('[NOTIFICATION] Fetching /api/notifications/check...');
                const response = await fetch('/api/notifications/check', {
                    cache: 'no-store',
                    credentials: 'include'
                });

                console.log('[NOTIFICATION] Response status:', response.status);

                if (!response.ok) {
                    console.error('[NOTIFICATION] ❌ API returned error:', response.status);
                    return;
                }

                const data = await response.json();
                console.log('[NOTIFICATION] API response:', data);

                if (data.serverTime) {
                    lastCheckTime.current = data.serverTime;
                }

                if (data.newIncident) {
                    console.log('[NOTIFICATION] 🚨 New incident detected:', data.newIncident);
                    showNotification(data.newIncident);
                } else {
                    console.log('[NOTIFICATION] No new incidents');
                }
            } catch (error) {
                console.error('[NOTIFICATION] ❌ Error checking for notifications:', error);
            }
        };

        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Set up polling - every 5 seconds for faster detection
        console.log('[NOTIFICATION] 🕐 Setting up polling interval (5 seconds)');
        intervalRef.current = setInterval(checkIncidents, 5000);

        // Initial check immediately
        console.log('[NOTIFICATION] 🚀 Running initial check...');
        checkIncidents();

        return () => {
            console.log('[NOTIFICATION] Cleaning up interval');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [pathname, showNotification]);

    // Visual indicator that component is active (hidden but useful for debugging)
    return (
        <div
            id="notification-listener-active"
            style={{ display: 'none' }}
            data-pathname={pathname}
            data-timestamp={Date.now()}
        />
    );
}
