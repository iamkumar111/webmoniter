"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import NotificationListener from "@/components/layout/notification-listener";

interface AppShellProps {
    children: React.ReactNode;
    user: any;
}

export default function AppShell({ children, user }: AppShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                user={user}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <NotificationListener />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    user={user}
                    onMenuOpen={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
