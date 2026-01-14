import { cookies } from "next/headers";
import { auth } from "@/auth";

export async function getCurrentOrgId() {
  const session = await auth();
  if (!session?.user) return null;

  if ((session.user as any).role === 'SUPER_ADMIN') {
    const cookieStore = await cookies();
    const orgCookie = cookieStore.get('super-admin-org');
    return orgCookie?.value || null; // null means "All Organizations" or root view
  }

  return (session.user as any).organizationId || null;
}
