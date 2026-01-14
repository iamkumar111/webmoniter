import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FileText, Edit } from "lucide-react";
import Link from "next/link";

export default async function PagesListPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  const pages = await prisma.pageContent.findMany({
    orderBy: { slug: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          Page Content
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Page Title</th>
                <th className="px-6 py-3 font-semibold">Slug</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {page.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/pages/${page.slug}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
