'use client';

import { useEffect, useRef, useState } from 'react';

export function useServiceWorker() {
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        const registerSW = async () => {
            try {
                // Register the service worker
                const reg = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('[SW] Service Worker registered:', reg.scope);
                setRegistration(reg);

                // Wait for the service worker to be ready
                await navigator.serviceWorker.ready;
                setIsReady(true);
                console.log('[SW] Service Worker is ready');

            } catch (error) {
                console.error('[SW] Service Worker registration failed:', error);
            }
        };

        registerSW();
    }, []);

    // Function to keep the Service Worker awake/active
    useEffect(() => {
        if (!registration?.active) return;

        const pingInterval = setInterval(() => {
            if (registration.active) {
                try {
                    registration.active.postMessage({ type: 'PING' });
                } catch (e) {
                    console.log('[SW] Ping failed, worker might be restarting');
                }
            }
        }, 20000); // Ping every 20s to prevent sleep

        return () => clearInterval(pingInterval);
    }, [registration]);

    // Function to send a notification via the service worker
    const showNotification = (options: {
        title: string;
        body: string;
        icon?: string;
        tag?: string;
        url?: string;
        requireInteraction?: boolean;
    }) => {
        // More robust check
        const worker = registration?.active || navigator.serviceWorker.controller;

        if (!worker) {
            console.warn('[SW] Service Worker nor Controller active, cannot show notification via SW');
            return false;
        }

        try {
            worker.postMessage({
                type: 'SHOW_NOTIFICATION',
                ...options
            });
            return true;
        } catch (error) {
            console.error('[SW] Failed to post message to SW:', error);
            return false;
        }
    };

    // Function to trigger a background check for incidents
    const checkIncidents = (since?: number) => {
        const worker = registration?.active || navigator.serviceWorker.controller;

        if (!worker) {
            return false;
        }

        try {
            worker.postMessage({
                type: 'CHECK_INCIDENTS',
                since: since || Date.now() - 120000
            });
            return true;
        } catch (error) {
            return false;
        }
    };

    return { registration, isReady, showNotification, checkIncidents };
}
