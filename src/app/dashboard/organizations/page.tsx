import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Building2, Plus, Edit2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function OrganizationsPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  const organizations = await prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { users: true, monitors: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-600" />
          Organizations
        </h1>
        <Link
          href="/dashboard/organizations/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Organization
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Users</th>
              <th className="px-6 py-3 font-semibold">Monitors</th>
              <th className="px-6 py-3 font-semibold">Created At</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {organizations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No organizations found.
                </td>
              </tr>
            ) : (
              organizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{org.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${org.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{org._count.users}</td>
                  <td className="px-6 py-4 text-gray-600">{org._count.monitors}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {format(new Date(org.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/dashboard/organizations/${org.id}/edit`} className="text-gray-400 hover:text-indigo-600 inline-block">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
