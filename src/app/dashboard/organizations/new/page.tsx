import OrganizationForm from "@/components/organizations/organization-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewOrganizationPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  return <OrganizationForm />;
}
