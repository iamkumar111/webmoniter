"use client";


import { useState, useTransition } from "react";
import { updateGlobalSEOSettings } from "@/lib/actions";
import { Loader2, Save, Globe, FileText, Share2, HelpCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { GLOBAL_PRESET } from "@/lib/seo-presets";

export default function GlobalSEOForm({ initialSettings }: { initialSettings: any }) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        siteName: initialSettings?.siteName || "websmonitor",
        titleSeparator: initialSettings?.titleSeparator || "|",
        titleSuffix: initialSettings?.titleSuffix || "websmonitor",
        defaultKeywords: initialSettings?.defaultKeywords || "",
        defaultDescription: initialSettings?.defaultDescription || "",
        defaultOgImage: initialSettings?.defaultOgImage || "",
        robotsTxt: initialSettings?.robotsTxt || "User-agent: *\nAllow: /",
        sitemapEnabled: initialSettings?.sitemapEnabled ?? true,
        knowledgeGraph: initialSettings?.knowledgeGraph ? JSON.stringify(initialSettings.knowledgeGraph, null, 2) : "",
    });

    const handleChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleAutoGenerate = () => {
        setFormData(prev => ({
            ...prev,
            defaultKeywords: GLOBAL_PRESET.defaultKeywords,
            defaultDescription: GLOBAL_PRESET.defaultDescription,
            robotsTxt: GLOBAL_PRESET.robotsTxt,
            knowledgeGraph: JSON.stringify(GLOBAL_PRESET.knowledgeGraph, null, 2)
        }));
        toast.success("Applied global SEO best practices");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                await updateGlobalSEOSettings(formData);
                toast.success("Global SEO settings updated");
            } catch (error: any) {
                toast.error(error.message || "Failed to update settings");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-900">General SEO Settings</h2>
                    </div>
                    <button
                        type="button"
                        onClick={handleAutoGenerate}
                        className="flex items-center gap-2 text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors"
                    >
                        <Sparkles className="w-3 h-3" />
                        Auto-Generate Defaults
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Site Name</label>
                        <input
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.siteName}
                            onChange={(e) => handleChange("siteName", e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Used in schema markup and OG tags.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Title Separator</label>
                        <select
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.titleSeparator}
                            onChange={(e) => handleChange("titleSeparator", e.target.value)}
                        >
                            <option value="|">|</option>
                            <option value="-">-</option>
                            <option value="–">–</option>
                            <option value="—">—</option>
                            <option value="»">»</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Title Suffix</label>
                        <input
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.titleSuffix}
                            onChange={(e) => handleChange("titleSuffix", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Default Social Image URL</label>
                        <input
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.defaultOgImage}
                            onChange={(e) => handleChange("defaultOgImage", e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Default Meta Description</label>
                    <textarea
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                        value={formData.defaultDescription}
                        onChange={(e) => handleChange("defaultDescription", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Default Keywords</label>
                    <input
                        className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.defaultKeywords}
                        onChange={(e) => handleChange("defaultKeywords", e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b pb-4 mb-4">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Crawling & Indexing</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="sitemapEnabled"
                            checked={formData.sitemapEnabled}
                            onChange={(e) => handleChange("sitemapEnabled", e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sitemapEnabled" className="text-sm font-medium text-gray-700">Enable Sitemap (sitemap.xml)</label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">robots.txt Content</label>
                        <textarea
                            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] font-mono text-sm"
                            value={formData.robotsTxt}
                            onChange={(e) => handleChange("robotsTxt", e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Edit raw robots.txt content.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b pb-4 mb-4">
                    <Share2 className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Knowledge Graph (AEO)</h2>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Global Organization Schema (JSON)</label>
                    <textarea
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] font-mono text-xs"
                        value={formData.knowledgeGraph}
                        onChange={(e) => handleChange("knowledgeGraph", e.target.value)}
                        placeholder="{ '@context': 'https://schema.org', ... }"
                    />
                    <p className="text-xs text-gray-500">Define your organization identity for Google Knowledge Graph.</p>
                </div>
            </div>

            <div className="flex justify-end pt-4 sticky bottom-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-70 shadow-xl"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save SEO Settings
                </button>
            </div>
        </form>
    );
}
