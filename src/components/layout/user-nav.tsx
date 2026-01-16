"use client";

import { useState } from "react";
import { User, LogOut, Key, Settings as SettingsIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserNavProps {
    user: {
        name?: string | null;
        email?: string | null;
        role?: string;
    };
}

export default function UserNav({ user }: UserNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="flex items-center gap-3 pl-4 border-l border-gray-200 group">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                    <User className="w-6 h-6" />
                </div>
                <div className="text-sm text-left hidden sm:block">
                    <p className="font-semibold text-gray-900 leading-tight">{user.name || 'User'}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">{user.role}</p>
                </div>
            </button>

            {/* Dropdown Menu */}
            <div
                className={cn(
                    "absolute right-0 top-full pt-2 w-56 transition-all duration-200 z-50",
                    isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
                )}
            >
                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-1.5">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    </div>

                    <div className="p-1.5">
                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group"
                        >
                            <Key className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                            <span>Change Password</span>
                        </Link>

                        {user.role === 'SUPER_ADMIN' && (
                            <Link
                                href="/settings"
                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                                <SettingsIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                <span>Settings</span>
                            </Link>
                        )}
                    </div>

                    <div className="border-t border-gray-50 p-1.5">
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
