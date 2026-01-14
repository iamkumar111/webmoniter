import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Briefcase } from "lucide-react";
import ApplicationRow from "@/components/dashboard/application-row";

export default async function ApplicationsPage() {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'SUPER_ADMIN') {
        redirect('/dashboard');
    }

    const applications = await prisma.jobApplication.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                    Job Applications
                </h1>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                    {applications.length} Total
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Applicant / Role</th>
                                <th className="px-6 py-4 font-bold">Contact</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Applied On</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Briefcase className="w-10 h-10 text-gray-200" />
                                            <p className="font-medium">No job applications found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app: any) => (
                                    <ApplicationRow key={app.id} application={app} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
