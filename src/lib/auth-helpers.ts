import { User, Monitor, Role, MonitorAssignment } from "@prisma/client";

// Helper type that includes assignments
type MonitorWithAssignments = Monitor & {
  assignments?: MonitorAssignment[];
};

export function canAccessMonitor(user: User, monitor: MonitorWithAssignments): boolean {
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;

  // Owners or assigned users (MANAGER, USER, VIEWER)
  return monitor.userId === user.id ||
    (monitor.assignments?.some(a => a.userId === user.id) ?? false);
}

export function canManageUser(currentUser: User, targetUserRole: Role): boolean {
  if (currentUser.role === 'SUPER_ADMIN') return true;

  // Admin can manage Managers and Viewers
  if (currentUser.role === 'ADMIN' && (targetUserRole === 'MANAGER' || targetUserRole === 'VIEWER' || targetUserRole === 'USER')) {
    return true;
  }

  // Managers can only manage VIEWERS they created (logic to be enforced in actions)
  if ((currentUser.role === 'MANAGER' || currentUser.role === 'USER') && targetUserRole === 'VIEWER') {
    return true;
  }

  return false;
}

export function canCreateUserRole(currentUser: User, roleToCreate: Role): boolean {
  if (currentUser.role === 'SUPER_ADMIN') return true; // Can create anyone

  // Admin can create Managers and Viewers
  if (currentUser.role === 'ADMIN' && (roleToCreate === 'MANAGER' || roleToCreate === 'VIEWER' || roleToCreate === 'USER')) {
    return true;
  }

  if ((currentUser.role === 'MANAGER' || currentUser.role === 'USER') && roleToCreate === 'VIEWER') return true;
  return false;
}
