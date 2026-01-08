import { prisma } from "@/lib/prisma";
import MonitorForm from "@/components/monitors/monitor-form";
import { notFound } from "next/navigation";
import { auth } from '@/auth';

export default async function EditMonitorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const monitor = await prisma.monitor.findUnique({
    where: { id }
  });

  if (!monitor) notFound();

  // Get User Perms for minInterval
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
    // Fallback to default group
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
      <MonitorForm monitor={monitor} minInterval={minInterval} />
    </div>
  );
}
