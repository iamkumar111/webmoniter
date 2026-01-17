"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserSchema } from "@/lib/schemas";
import { createUser, updateUser, fetchOrganizations, createOrganization, getUserGroupsList } from "@/lib/actions";
import { Loader2, Save, X } from "lucide-react";

type UserFormValues = z.infer<typeof UserSchema> & {
  organizationId?: string;
  newOrgName?: string;
};

interface UserFormProps {
  user?: any; // If provided, it's edit mode
  currentUser: any;
  onClose: () => void;
}

export default function UserForm({ user, currentUser, onClose }: UserFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  useEffect(() => {
    if (currentUser.role === 'SUPER_ADMIN') {
      startTransition(async () => {
        const orgs = await fetchOrganizations();
        setOrganizations(orgs);
        const groups = await getUserGroupsList();
        setUserGroups(groups);
      });
    }
  }, [currentUser.role]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      organizationId: user.organizationId || "",
      userGroupId: user.userGroupId || "",
    } : {
      name: "",
      email: "",
      role: currentUser.role === 'MANAGER' ? 'VIEWER' : currentUser.role === 'ADMIN' ? 'MANAGER' : 'ADMIN',
      status: 'ACTIVE',
      organizationId: "",
      userGroupId: "",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    setError("");
    startTransition(async () => {
      try {
        let finalOrgId = data.organizationId;

        // If creating new org inline
        if (isCreatingOrg && data.newOrgName) {
          // We need to call createOrganization manually here because it returns the ID we need
          // createOrganization in actions.ts now returns the object
          const newOrg = await createOrganization({ name: data.newOrgName, status: "ACTIVE" });
          finalOrgId = newOrg.id;
        } else if (data.organizationId === "NEW") {
          throw new Error("Please enter a name for the new organization");
        }

        const userData = { ...data, organizationId: finalOrgId };

        if (user) {
          await updateUser(user.id, userData);
        } else {
          await createUser(userData);
        }
        onClose();
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      }
    });
  };


  const allowedRoles = currentUser.role === 'SUPER_ADMIN'
    ? ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER', 'VIEWER']
    : currentUser.role === 'ADMIN'
      ? ['MANAGER', 'USER', 'VIEWER']
      : ['VIEWER'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="font-bold text-gray-900">{user ? "Edit User" : "Create New User"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                {...register("name")}
                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {!user && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Initial Password</label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                <p className="text-xs text-gray-500">Must be at least 8 characters</p>
              </div>
            )}

            {user && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
            )}

            {currentUser.role === 'SUPER_ADMIN' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Organization</label>
                {!isCreatingOrg ? (
                  <select
                    {...register("organizationId")}
                    onChange={(e) => {
                      if (e.target.value === "NEW") {
                        setIsCreatingOrg(true);
                        setValue("organizationId", "NEW");
                      } else {
                        setIsCreatingOrg(false);
                        setValue("organizationId", e.target.value);
                      }
                    }}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Select Organization (or Create New for Admin)</option>
                    {organizations.map((org: any) => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                    <option value="NEW" className="font-semibold text-indigo-600">+ Create New Organization</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      {...register("newOrgName")}
                      placeholder="Enter new organization name"
                      className="flex-1 h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => { setIsCreatingOrg(false); setValue("organizationId", ""); }}
                      className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {organizations.length === 0 && !isCreatingOrg && (
                  <p className="text-xs text-gray-500">No organizations found. You can create one now.</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  {...register("role")}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {allowedRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register("status")}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
              </div>
            </div>

            {currentUser.role === 'SUPER_ADMIN' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">User Plan / Group</label>
                <select
                  {...register("userGroupId")}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select Group (Default: Free)</option>
                  {userGroups.map((group: any) => (
                    <option key={group.id} value={group.id}>
                      {group.name} {group.isDefault ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">Determines integration limits and available features.</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-70"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {user ? "Save Changes" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
