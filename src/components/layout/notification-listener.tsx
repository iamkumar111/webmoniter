'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NotificationListener() {
    const lastIncidentKey = useRef<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Only run on dashboard/monitor pages to save resources
        const isMonitoringPage = pathname.startsWith('/dashboard') || pathname.startsWith('/monitors');
        if (!isMonitoringPage) return;

        const checkNewIncidents = async () => {
            // Trigger a silent refresh of the current page data
            router.refresh();

            if (!('Notification' in window) || Notification.permission !== 'granted') return;

            try {
                const response = await fetch('/api/notifications/check');
                const data = await response.json();

                if (data.newIncident) {
                    const key = `${data.newIncident.id}-${data.newIncident.status}`;

                    if (key !== lastIncidentKey.current) {
                        lastIncidentKey.current = key;

                        const monitorName = data.newIncident.monitor?.name || 'Unknown Monitor';
                        const isRecovery = data.newIncident.status === 'RESOLVED';
                        const title = isRecovery ? 'Monitor RECOVERED' : 'Monitor DOWN';
                        const body = isRecovery
                            ? `Monitor "${monitorName}" is back UP!`
                            : `Monitor "${monitorName}" is DOWN!\nError: ${data.newIncident.errorDetails || 'Connection failed'}`;

                        const notification = new Notification(title, {
                            body,
                            icon: '/favicon.svg', // Assumes exists, fallback handled by browser
                            tag: 'monitor-alert',
                            requireInteraction: !isRecovery // Keep "Down" alerts visible
                        });

                        notification.onclick = () => {
                            window.focus();
                            window.location.href = `/monitors/${data.newIncident.monitorId}`;
                        };

                        // Play a subtle alert sound 
                        try {
                            const audioUrl = isRecovery
                                ? 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3' // Success sound
                                : 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'; // Alert sound
                            const audio = new Audio(audioUrl);
                            audio.play();
                        } catch (e) { }
                    }
                }
            } catch (error) {
                console.error('Error checking for notifications:', error);
            }
        };

        // Check every 30 seconds
        const interval = setInterval(checkNewIncidents, 30000);
        checkNewIncidents(); // Initial check

        return () => clearInterval(interval);
    }, [pathname]);

    return null;
}
