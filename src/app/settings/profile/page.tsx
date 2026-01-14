import ChangePasswordForm from "@/components/settings/change-password-form";
import { Key, Shield } from "lucide-react";

export default function ProfileSettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile Settings</h1>
                <p className="text-gray-500 mt-2 font-medium">Manage your personal account security and preferences.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-5">
                {/* Left Column: Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-indigo-50/40 border border-indigo-100/80 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            Security Tip
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium mb-4">
                            Use a strong, unique password with at least 8 characters, including numbers and special symbols to keep your account secure.
                        </p>
                        <div className="space-y-3 border-t border-indigo-100/50 pt-4">
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Requirements</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                    Minimum 8 characters
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                    Must match confirmation
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Right Column: Form */}
                <div className="md:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
                            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Update your account password regularly for better security.</p>
                        </div>
                        <div className="p-8">
                            <ChangePasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
