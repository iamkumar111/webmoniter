"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OrganizationSchema } from "@/lib/schemas";
import { createOrganization, updateOrganization } from "@/lib/actions";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrganizationFormValues = z.infer<typeof OrganizationSchema>;

interface OrganizationFormProps {
  organization?: any;
}

export default function OrganizationForm({ organization }: OrganizationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(OrganizationSchema) as any,
    defaultValues: organization ? {
      name: organization.name,
      email: organization.email || "",
      status: organization.status,
    } : {
      name: "",
      email: "",
      status: "ACTIVE",
    },
  });

  const onSubmit = (data: OrganizationFormValues) => {
    setError("");
    startTransition(async () => {
      try {
        if (organization) {
          await updateOrganization(organization.id, data);
        } else {
          await createOrganization(data);
        }
        router.push("/dashboard/organizations");
        router.refresh();
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/organizations" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {organization ? "Edit Organization" : "Create Organization"}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Organization Name</label>
            <input
              {...register("name")}
              className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Acme Corp"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Contact Email (Optional)</label>
            <input
              {...register("email")}
              type="email"
              className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@acme.com"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
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

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-70"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {organization ? "Save Changes" : "Create Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
