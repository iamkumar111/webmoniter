import { Bell, Menu } from 'lucide-react';
import OrgSelector from './org-selector';
import UserNav from './user-nav';
import NotificationToggle from './notification-toggle';

export default function Header({
  user,
  organizations = [],
  currentOrgId = null,
  onMenuOpen
}: {
  user: any,
  organizations?: any[],
  currentOrgId?: string | null,
  onMenuOpen?: () => void
}) {
  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onMenuOpen}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-1">
          Welcome, {user.name || user.email}
        </h2>
        {isSuperAdmin && (
          <div className="ml-4 pl-4 border-l border-gray-200">
            <OrgSelector organizations={organizations} currentOrgId={currentOrgId} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 md:gap-4">
          <NotificationToggle />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
