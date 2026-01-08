import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export async function generatePageMetadata(slug: string, fallback: Partial<Metadata> = {}): Promise<Metadata> {
    // Fetch Global SEO Settings (cached usually)
    const settings = await prisma.globalSEOSettings.findUnique({
        where: { id: "default" }
    });

    // Fetch Page Content
    const page = await prisma.pageContent.findUnique({
        where: { slug }
    });

    const separator = settings?.titleSeparator || "|";
    const suffix = settings?.titleSuffix || settings?.siteName || "websmonitor";
    const siteName = settings?.siteName || "websmonitor";

    if (!page) {
        // Even if page not found in PageContent, we might want to apply global suffixes if fallback title is string
        // But fallback is usually a Metadata object.
        // Let's just return fallback merged with global defaults if possible, but for now stick to simple return.
        return {
            ...fallback,
            title: fallback.title ? {
                default: fallback.title as string, // Assuming string for simple case
                template: `%s ${separator} ${suffix}`
            } : undefined,
            openGraph: {
                ...fallback.openGraph,
                siteName: siteName,
                images: settings?.defaultOgImage ? [{ url: settings.defaultOgImage }] : fallback.openGraph?.images
            }
        };
    }

    const title = page.metaTitle || page.title;
    const description = page.metaDescription || settings?.defaultDescription || fallback.description;

    let keywords = fallback.keywords;
    if (page.keywords) {
        keywords = page.keywords.split(',').map((k: string) => k.trim());
    } else if (settings?.defaultKeywords) {
        keywords = settings.defaultKeywords.split(',').map((k: string) => k.trim());
    }

    const ogImage = page.ogImage || settings?.defaultOgImage;
    const ogImages = ogImage ? [{ url: ogImage }] : fallback.openGraph?.images;

    return {
        title: {
            default: title,
            template: `%s ${separator} ${suffix}`
        },
        description: description,
        keywords: keywords,
        openGraph: {
            title: page.ogTitle || title,
            description: page.ogDescription || description || undefined,
            images: ogImages,
            type: "website",
            siteName: siteName,
        },
        twitter: {
            card: "summary_large_image",
            title: page.ogTitle || title,
            description: page.ogDescription || description || undefined,
            images: ogImages,
        },
        other: {
            // Inject Structured Data if present
            ...(page.structuredData ? {
                "script:ld+json": JSON.stringify(page.structuredData)
            } : {})
        }
    };
}
