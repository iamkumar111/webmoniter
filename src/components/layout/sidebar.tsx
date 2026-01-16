'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Mail,
  FileText,
  Building2,
  Puzzle,
  Briefcase,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { X } from 'lucide-react';

interface SidebarProps {
  user: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Monitors', href: '/monitors', icon: Activity },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  if (user.role === 'SUPER_ADMIN') {
    navItems.push({ name: 'Enquiries', href: '/dashboard/enquiries', icon: Mail });
    navItems.push({ name: 'Organizations', href: '/dashboard/organizations', icon: Building2 });
    navItems.push({ name: 'Page Content', href: '/dashboard/pages', icon: FileText });
  }

  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'MANAGER') {
    navItems.push({ name: 'Users', href: '/users', icon: Users });
  }

  if (user.role === 'SUPER_ADMIN') {
    navItems.push({ name: 'Applications', href: '/dashboard/applications', icon: Briefcase });
  }

  // Integrations - available to all users (access control on the page)
  navItems.push({ name: 'Integrations', href: '/settings/integrations', icon: Puzzle });

  if (user.role === 'SUPER_ADMIN') {
    navItems.push({ name: 'User Groups', href: '/dashboard/groups', icon: Users });
    navItems.push({ name: 'SEO Settings', href: '/dashboard/seo', icon: Globe });
    navItems.push({ name: 'System Settings', href: '/settings', icon: Settings });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">W</div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">WebsMoniter</span>
          </Link>
          <button className="lg:hidden p-2 text-gray-500" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
