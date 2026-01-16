import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://websmoniter.online';

    // Fetch Global SEO Settings
    const settings = await prisma.globalSEOSettings.findUnique({
        where: { id: "default" }
    });

    if (settings && settings.sitemapEnabled === false) {
        return [];
    }

    // Static routes
    const staticRoutes = [
        '',
        '/pricing',
        '/features',
        '/solutions',
        '/about',
        '/contact',
        '/careers',
        '/partners',
        '/docs',
        '/changelog',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
    })) as MetadataRoute.Sitemap;

    // Fetch dynamic content pages if any (though currently our structured pages are mostly static code with dynamic content injection)
    // However, if we had truly dynamic pages driven by slugs (like blog posts), we would add them here.
    // For now, let's keep it robust for future expansion.
    // Example: const blogs = await prisma.blog.findMany(); ...

    // Just to ensure our "PageContent" driven pages are tracked (though they map to static routes currently)
    // We update their lastModified based on the DB.
    const dbPages = await prisma.pageContent.findMany({
        select: { slug: true, updatedAt: true }
    });

    // Map DB pages to update static routes if they exist, or add new ones
    const dynamicRoutes = dbPages.map(page => ({
        url: `${baseUrl}/${page.slug === 'home' ? '' : page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: 'weekly' as 'weekly' | 'daily' | 'always' | 'hourly' | 'monthly' | 'yearly' | 'never',
        priority: page.slug === 'home' ? 1 : 0.9,
    }));

    // Merge: prefer dynamic override if exists
    const finalRoutes = [...staticRoutes];

    dynamicRoutes.forEach(dyn => {
        const existingIndex = finalRoutes.findIndex(r => r.url === dyn.url);
        if (existingIndex !== -1) {
            finalRoutes[existingIndex] = dyn;
        } else {
            // Only add if it's a known valid route structure, or if we supported /pages/[slug] generally.
            // Currently /pages/[slug] is admin only? No, LandingPage uses getPageContent('home').
            // Let's assume most public pages align with static routes.
        }
    });

    return finalRoutes;
}
