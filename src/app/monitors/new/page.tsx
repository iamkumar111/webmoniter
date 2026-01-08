
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
      userGroup: { select: { features: true } }
    }
  });

  let minInterval = 5;
  if (user?.userGroup?.features) {
    const features = user.userGroup.features as any;
    if (typeof features.minInterval === 'number') {
      minInterval = features.minInterval;
    }
  } else {
    // Check default group if no group assigned
    const defaultGroup = await prisma.userGroup.findFirst({ where: { isDefault: true } });
    if (defaultGroup?.features) {
      const features = defaultGroup.features as any;
      if (typeof features.minInterval === 'number') {
        minInterval = features.minInterval;
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <MonitorForm minInterval={minInterval} />
    </div>
  );
}
