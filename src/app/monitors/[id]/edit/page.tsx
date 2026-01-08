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
      role: true,
      userGroup: { select: { features: true, slug: true } }
    }
  });

  let minInterval = 1;

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  if (!isSuperAdmin) {
    if (user?.userGroup?.features) {
      const features = user.userGroup.features as any;

      if (user.userGroup.slug === 'free') {
        minInterval = 5;
      } else {
        // For Pro, Enterprise, etc. (or Custom), allow 1 minute default if not specified.
        if (typeof features.minInterval === 'number') {
          minInterval = features.minInterval;
        } else {
          minInterval = 1;
        }
      }
    } else {
      // Fallback to default group if unassigned
      const defaultGroup = await prisma.userGroup.findFirst({ where: { isDefault: true } });
      if (defaultGroup?.slug === 'free') {
        minInterval = 5;
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <MonitorForm monitor={monitor} minInterval={minInterval} />
    </div>
  );
}
