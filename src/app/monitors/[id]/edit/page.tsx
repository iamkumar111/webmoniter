import { prisma } from "@/lib/prisma";
import MonitorForm from "@/components/monitors/monitor-form";
import { notFound } from "next/navigation";

export default async function EditMonitorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const monitor = await prisma.monitor.findUnique({
    where: { id }
  });

  if (!monitor) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <MonitorForm monitor={monitor} />
    </div>
  );
}
