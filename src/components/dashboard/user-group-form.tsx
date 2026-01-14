
"use client";

import { useState, useTransition } from "react";
import { createUserGroup, updateUserGroup } from "@/lib/actions";
import { Loader2, Save, X, Info } from "lucide-react";
import { toast } from "sonner";
import { IntegrationType } from "@prisma/client";

interface UserGroupFormProps {
    group?: any;
    onClose: () => void;
}

const SUPPORTED_INTEGRATIONS = ["SLACK", "DISCORD", "WHATSAPP"];

export default function UserGroupForm({ group, onClose }: UserGroupFormProps) {
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState(group?.name || "");
    const [permissions, setPermissions] = useState<string[]>(
        (group?.features as any)?.integrations || []
    );

    const handlePermissionToggle = (integration: string) => {
        setPermissions(prev =>
            prev.includes(integration)
                ? prev.filter(p => p !== integration)
                : [...prev, integration]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                if (group) {
                    await updateUserGroup(group.id, { name, permissions });
                    toast.success("Group updated successfully");
                } else {
                    await createUserGroup({ name, permissions });
                    toast.success("Group created successfully");
                }
                onClose();
            } catch (error: any) {
                toast.error(error.message || "Operation failed");
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{group ? "Edit User Group" : "New User Group"}</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Integrations</label>
                        <div className="space-y-2 border p-3 rounded-md bg-gray-50">
                            {SUPPORTED_INTEGRATIONS.map((integration) => (
                                <label key={integration} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={permissions.includes(integration)}
                                        onChange={() => handlePermissionToggle(integration)}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="capitalize">{integration.toLowerCase()}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
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
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center gap-2 disabled:opacity-50"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
