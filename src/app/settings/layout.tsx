import { auth } from '@/auth';
import AppShell from '@/components/layout/app-shell';
import { redirect } from 'next/navigation';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <AppShell user={session.user} activePage="settings">
      {children}
    </AppShell>
  );
}
