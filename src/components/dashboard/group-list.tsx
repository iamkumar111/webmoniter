"use client";

import { useState } from "react";
import { Plus, Users, Shield, Check, X as XIcon } from "lucide-react";
import UserGroupForm from "./user-group-form";

export default function GroupList({ initialGroups }: { initialGroups: any[] }) {
    const [groups, setGroups] = useState(initialGroups);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<any | null>(null);

    const handleEdit = (group: any) => {
        setEditingGroup(group);
        setIsFormOpen(true);
    };

    const handleNew = () => {
        setEditingGroup(null);
        setIsFormOpen(true);
    };

    return (
        <div>
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleNew}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Create New Group
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {groups.map((group) => {
                    const features = group.features as any;
                    const integrations = features?.integrations || [];

                    return (
                        <div key={group.id} className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative">
                            {group.isDefault && (
                                <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                    DEFAULT
                                </span>
                            )}

                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${group.slug === 'free' ? 'bg-gray-100 text-gray-600' :
                                        group.slug === 'pro' ? 'bg-blue-100 text-blue-600' :
                                            group.slug === 'enterprise' ? 'bg-purple-100 text-purple-600' :
                                                'bg-orange-100 text-orange-600'
                                    }`}>
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold">{group.name}</h3>
                            </div>

                            <div className="space-y-3 mb-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase">Integrations</p>
                                <ul className="space-y-1">
                                    {['SLACK', 'DISCORD', 'WHATSAPP'].map(int => (
                                        <li key={int} className="flex items-center gap-2 text-sm">
                                            {integrations.includes(int) ? (
                                                <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <XIcon className="w-4 h-4 text-gray-300" />
                                            )}
                                            <span className={integrations.includes(int) ? 'text-gray-700' : 'text-gray-400'}>
                                                {int.charAt(0) + int.slice(1).toLowerCase()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center justify-between mt-4 text-xs text-gray-500 border-t pt-3">
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{group._count.users} Users</span>
                                </div>
                                <button
                                    onClick={() => handleEdit(group)}
                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Edit Settings
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isFormOpen && (
                <UserGroupForm
                    group={editingGroup}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
