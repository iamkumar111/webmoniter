"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/app-shell";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <AppShell user={session!.user}>
      {children}
    </AppShell>
  );
}
