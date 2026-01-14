import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PageContentForm from "@/components/dashboard/page-content-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  const { slug } = await params;

  const page = await prisma.pageContent.findUnique({
    where: { slug },
  });

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pages" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Edit {page.title}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <PageContentForm page={page} />
      </div>
    </div>
  );
}
