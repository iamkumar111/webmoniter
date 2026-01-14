import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import UserList from "@/components/users/user-list";

export default async function UsersPage() {
  const session = await auth();
  const currentUser = session?.user;

  if (!currentUser || ((currentUser as any).role !== 'SUPER_ADMIN' && (currentUser as any).role !== 'ADMIN' && (currentUser as any).role !== 'MANAGER')) {
    redirect('/dashboard');
  }

  // Fetch users based on role
  // Super Admin sees all
  // Admin sees only their Organization (excluding Super Admins)
  // Manager sees only users they created
  const where: any = {};

  if ((currentUser as any).role === 'MANAGER') {
    where.createdBy = currentUser.id;
  } else if ((currentUser as any).role === 'ADMIN') {
    const orgId = (currentUser as any).organizationId;
    if (orgId) {
      where.organizationId = orgId;
      where.role = { not: 'SUPER_ADMIN' };
    } else {
      // Fallback if Admin has no Org ID (legacy), show createdBy
      where.createdBy = currentUser.id;
    }
  }
  // Super Admin sees all (no where clause needed)

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { monitors: true, assignedMonitors: true }
      },
      createdById: {
        select: { name: true }
      },
      organization: {
        select: { name: true }
      },
      userGroup: {
        select: { id: true, name: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          User Management
        </h1>
        {/* Add User Button handled in UserList or here? Better in UserList to control Modal state */}
      </div>

      <UserList users={users} currentUser={currentUser} />
    </div>
  );
}
