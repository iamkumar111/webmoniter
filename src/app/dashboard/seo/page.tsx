import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getGlobalSEOSettings } from "@/lib/actions";
import GlobalSEOForm from "@/components/dashboard/global-seo-form";

export default async function SEOSettingsPage() {
    const session = await auth();
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    const settings = await getGlobalSEOSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Global SEO Settings</h1>
                <p className="text-gray-500">Manage site-wide metadata, robots.txt, and sitemap configuration.</p>
            </div>
            <GlobalSEOForm initialSettings={settings} />
        </div>
    );
}
