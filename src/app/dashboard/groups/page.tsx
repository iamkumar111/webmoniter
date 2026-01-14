
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserGroups, seedUserGroups } from "@/lib/actions";
import GroupList from "@/components/dashboard/group-list";

export default async function UserGroupsPage() {
    const session = await auth();
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    // Ensure defaults exist
    await seedUserGroups();
    const groups = await getUserGroups();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Groups & Plans</h1>
                    <p className="text-gray-500">Manage feature access and integration permissions for different user tiers.</p>
                </div>
            </div>
            <GroupList initialGroups={groups} />
        </div>
    );
}
