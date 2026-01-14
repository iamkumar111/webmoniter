'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationToggle() {
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

    if (permission === 'granted') {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 hidden md:flex">
                    <Bell className="w-4 h-4" />
                    <span className="text-xs font-semibold">Browser Alerts Active</span>
                </div>
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
