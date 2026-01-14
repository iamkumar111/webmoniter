
import { prisma } from "@/lib/prisma";

export async function hasPermission(userId: string, permission: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            userGroup: {
                select: { features: true }
            }
        }
    });

    if (!user || !user.userGroup) {
        // Fallback to "Free" permissions if no group assigned or user not found
        // But typically all users should have a group.
        // If no group, we check if global default group exists.
        const defaultGroup = await prisma.userGroup.findFirst({
            where: { isDefault: true }
        });

        if (!defaultGroup) return false; // Fail safe

        const features = defaultGroup.features as any;
        if (!features || !features.integrations) return false;
        return features.integrations.includes(permission);
    }

    const features = user.userGroup.features as any;
    if (!features || !features.integrations) return false;

    return features.integrations.includes(permission);
}

export async function getUserPermissions(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            userGroup: {
                select: { features: true, name: true, slug: true }
            }
        }
    });

    if (!user?.userGroup) {
        const defaultGroup = await prisma.userGroup.findFirst({
            where: { isDefault: true }
        });
        return {
            groupName: defaultGroup?.name || "Free",
            groupSlug: defaultGroup?.slug || "free",
            integrations: (defaultGroup?.features as any)?.integrations || []
        };
    }

    return {
        groupName: user.userGroup.name,
        groupSlug: user.userGroup.slug,
        integrations: (user.userGroup.features as any)?.integrations || []
    };
}
