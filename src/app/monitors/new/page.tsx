
import MonitorForm from "@/components/monitors/monitor-form";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/lib/permissions';

export default async function NewMonitorPage() {
  const session = await auth();
  const permissions = await getUserPermissions(session?.user?.id!);

  // Calculate minInterval, handling potential undefined 'features' or 'minInterval' props
  // getUserPermissions returns 'features' inside permissions object? No wait, let's check getUserPermissions in src/lib/permissions.ts
  // Checking permissions logic again in action... 
  // It returns { groupName, groupSlug, integrations: [...] }
  // It seems I need to fetch the raw feature set or update getUserPermissions to return minInterval.

  // Let's just fetch it directly to be safe and quick
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id! },
    select: {
      role: true,
      userGroup: { select: { features: true, slug: true } }
    }
  });

  let minInterval = 1;

  // Rule: Default account 'Free' has 5 min restriction.
  // Others (Pro, Enterprise, Custom) and Super Admin have 1 min.
  // We check the slug 'free' specifically as per user request.

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isFreePlan = user?.userGroup?.slug === 'free' || (!user?.userGroup && !isSuperAdmin);

  if (!isSuperAdmin) {
    if (user?.userGroup?.features) {
      const features = user.userGroup.features as any;
      // If plan explicitly sets a limit, use it.
      // But if the user says "Pro" should be able to, we assume Pro plan has minInterval 1.
      // If the DB says minInterval 5 for Pro, we should probably respect DB?
      // The user request says "Rule one deafult account is Free So only minimum 5 min interval is applied to Free users only."
      // This implies checking for "Free" and applying 5, otherwise apply 1.

      if (user.userGroup.slug === 'free') {
        minInterval = 5;
      } else {
        // For Pro, Enterprise, etc. (or Custom), allow 1 minute.
        // We can still respect the DB if it is MORE restrictive (e.g. 10 mins), 
        // but if the DB is missing keys, we default to 1.
        if (typeof features.minInterval === 'number') {
          minInterval = features.minInterval;
        } else {
          minInterval = 1;
        }
      }
    } else {
      // No group features found.
      // Check if default group is Free
      const defaultGroup = await prisma.userGroup.findFirst({ where: { isDefault: true } });
      if (defaultGroup?.slug === 'free') {
        minInterval = 5;
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <MonitorForm minInterval={minInterval} />
    </div>
  );
}
