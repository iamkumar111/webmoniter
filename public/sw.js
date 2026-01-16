// WebMoniter Service Worker for Push Notifications
// This service worker enables notifications even when the tab is not focused

const CACHE_NAME = 'webmoniter-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('[SW] Service Worker installed');
    self.skipWaiting(); // Activate immediately
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker activated');
    event.waitUntil(clients.claim()); // Take control of all pages immediately
});

// Listen for messages from the main page
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PING') {
        // Just acknowledging keeps the worker alive
        return;
    }

    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, icon, tag, url, requireInteraction } = event.data;

        self.registration.showNotification(title, {
            body,
            icon: icon || '/favicon.svg',
            tag: tag || 'webmoniter-alert',
            requireInteraction: requireInteraction || false,
            badge: '/favicon.svg',
            vibrate: [200, 100, 200],
            data: { url }
        });
    }

    if (event.data && event.data.type === 'CHECK_INCIDENTS') {
        // Perform background check for incidents
        checkForIncidents(event.data.since);
    }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url || '/monitors';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Try to focus an existing window
            for (const client of clientList) {
                if (client.url.includes('/monitors') || client.url.includes('/dashboard')) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            // If no existing window, open a new one
            return clients.openWindow(url);
        })
    );
});

// Background sync for checking incidents
async function checkForIncidents(since) {
    try {
        const response = await fetch(`/api/notifications/check?since=${since || Date.now() - 120000}`);
        const data = await response.json();

        if (data.incidents && data.incidents.length > 0) {
            for (const incident of data.incidents) {
                const isRecovery = incident.status === 'RESOLVED';
                const monitorName = incident.monitor?.name || 'Unknown Monitor';

                self.registration.showNotification(
                    isRecovery ? '✅ Monitor RECOVERED' : '🔴 Monitor DOWN',
                    {
                        body: isRecovery
                            ? `Monitor "${monitorName}" is back UP!`
                            : `Monitor "${monitorName}" is DOWN!\n${incident.errorDetails || 'Connection failed'}`,
                        icon: '/favicon.svg',
                        tag: `incident-${incident.id}`,
                        requireInteraction: !isRecovery,
                        data: { url: `/monitors/${incident.monitorId}` }
                    }
                );
            }
        }

        if (data.newIncident) {
            const incident = data.newIncident;
            const isRecovery = incident.status === 'RESOLVED';
            const monitorName = incident.monitor?.name || 'Unknown Monitor';

            self.registration.showNotification(
                isRecovery ? '✅ Monitor RECOVERED' : '🔴 Monitor DOWN',
                {
                    body: isRecovery
                        ? `Monitor "${monitorName}" is back UP!`
                        : `Monitor "${monitorName}" is DOWN!\n${incident.errorDetails || 'Connection failed'}`,
                    icon: '/favicon.svg',
                    tag: `incident-${incident.id}`,
                    requireInteraction: !isRecovery,
                    data: { url: `/monitors/${incident.monitorId}` }
                }
            );
        }
    } catch (error) {
        console.error('[SW] Error checking incidents:', error);
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'check-monitors') {
        event.waitUntil(checkForIncidents());
    }
});
