"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Key } from "lucide-react";
import { updatePassword } from "@/lib/actions";

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;

export default function ChangePasswordForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordValues>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: ChangePasswordValues) => {
        setError("");
        setSuccess("");
        startTransition(async () => {
            try {
                await updatePassword(data.currentPassword, data.newPassword);
                setSuccess("Password updated successfully!");
                reset();
            } catch (err: any) {
                setError(err.message || "Failed to update password");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100 italic">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md border border-green-100 font-medium">
                    {success}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        {...register("currentPassword")}
                        type="password"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                        placeholder="••••••••"
                    />
                </div>
                {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        {...register("newPassword")}
                        type="password"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                        placeholder="••••••••"
                    />
                </div>
                {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
                <p className="text-[11px] text-gray-400 mt-1">Must be at least 8 characters long.</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        {...register("confirmPassword")}
                        type="password"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                        placeholder="••••••••"
                    />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:shadow-none"
                >
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span>Update Password</span>
                </button>
            </div>
        </form>
    );
}
