"use client";

import { useState, useTransition } from "react";
import { Edit2, Trash2, UserPlus } from "lucide-react";
import UserForm from "./user-form";
import { deleteUser } from "@/lib/actions";
import { format } from "date-fns";

export default function UserList({ users, currentUser }: { users: any[], currentUser: any }) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      startTransition(async () => {
        await deleteUser(userId);
      });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                {currentUser.role === 'SUPER_ADMIN' && (
                  <>
                    <th className="px-6 py-3 font-semibold">Organization</th>
                    <th className="px-6 py-3 font-semibold">Plan</th>
                  </>
                )}
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Monitors</th>
                <th className="px-6 py-3 font-semibold">Created By</th>
                <th className="px-6 py-3 font-semibold">Joined</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.name || 'No Name'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'MANAGER' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  {currentUser.role === 'SUPER_ADMIN' && (
                    <>
                      <td className="px-6 py-4 text-gray-600">
                        {user.organization?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          {user.userGroup?.name || 'Free (Default)'}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user._count.monitors}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {user.createdById?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.id !== currentUser.id && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete"
                        disabled={isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <UserForm
          user={selectedUser}
          currentUser={currentUser}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
}
