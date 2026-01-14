import { z } from "zod";

export const GlobalSEOSettingsSchema = z.object({
    siteName: z.string().min(1, "Site Name is required"),
    titleSeparator: z.string().min(1, "Separator is required"),
    titleSuffix: z.string().optional(),
    defaultKeywords: z.string().optional(),
    defaultDescription: z.string().optional(),
    defaultOgImage: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    robotsTxt: z.string().optional(),
    sitemapEnabled: z.boolean(),
    knowledgeGraph: z.string().optional(), // We'll handle JSON as string in form
});
