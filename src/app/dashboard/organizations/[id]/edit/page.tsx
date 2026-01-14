import OrganizationForm from "@/components/organizations/organization-form";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function EditOrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  const { id } = await params;

  const organization = await prisma.organization.findUnique({
    where: { id },
  });

  if (!organization) {
    redirect('/dashboard/organizations');
  }

  return <OrganizationForm organization={organization} />;
}
