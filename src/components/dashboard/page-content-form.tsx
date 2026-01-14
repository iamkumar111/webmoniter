"use client";

import { useState, useTransition } from "react";
import { updatePageContent } from "@/lib/actions";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { SEO_PRESETS } from "@/lib/seo-presets";
import { Sparkles } from "lucide-react";

export default function PageContentForm({ page }: { page: any }) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  // Page Content Data
  const [contentData, setContentData] = useState<Record<string, string>>(page.data as Record<string, string>);

  // SEO Data
  const [seoData, setSeoData] = useState({
    metaTitle: page.metaTitle || '',
    metaDescription: page.metaDescription || '',
    keywords: page.keywords || '',
    ogTitle: page.ogTitle || '',
    ogDescription: page.ogDescription || '',
    ogImage: page.ogImage || '',
    structuredData: JSON.stringify(page.structuredData || {}, null, 2),
  });

  const handleContentChange = (key: string, value: string) => {
    setContentData(prev => ({ ...prev, [key]: value }));
  };

  const handleSeoChange = (key: string, value: string) => {
    setSeoData(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateResearch = () => {
    const preset = SEO_PRESETS[page.slug];
    if (preset) {
      setSeoData({
        metaTitle: preset.metaTitle,
        metaDescription: preset.metaDescription,
        keywords: preset.keywords,
        ogTitle: preset.ogTitle,
        ogDescription: preset.ogDescription,
        ogImage: seoData.ogImage, // Keep existing if any, hard to preset images
        structuredData: JSON.stringify(preset.structuredData, null, 2)
      });
      toast.success("Applied best practices for " + page.slug);
    } else {
      toast.info("No specific research found for this custom page.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        let parsedStructuredData = null;
        try {
          if (seoData.structuredData && seoData.structuredData !== '{}') {
            parsedStructuredData = JSON.parse(seoData.structuredData);
          }
        } catch (e) {
          toast.error("Invalid JSON in Structured Data");
          return;
        }

        await updatePageContent(page.slug, contentData, {
          ...seoData,
          structuredData: parsedStructuredData
        });
        toast.success("Content & SEO updated successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update content");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200 justify-between items-center">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'content'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Page Content
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'seo'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            SEO & Metadata
          </button>
        </div>

        {activeTab === 'seo' && (
          <button
            type="button"
            onClick={handleGenerateResearch}
            className="flex items-center gap-2 text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors mb-1"
          >
            <Sparkles className="w-3 h-3" />
            Auto-Generate Research
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'content' && (
          <div className="grid gap-6">
            <h3 className="text-lg font-medium text-gray-900">Dynamic Page Content</h3>
            <p className="text-sm text-gray-500 mb-4">Edit the text content displayed on the page. Keys mapped to the UI.</p>
            {Object.keys(contentData).length === 0 && (
              <p className="text-gray-500 italic">No dynamic content fields configured for this page.</p>
            )}
            {Object.entries(contentData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                {value.length > 80 ? (
                  <textarea
                    value={value}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="grid gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Metadata</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Meta Title</label>
                    <input
                      type="text"
                      value={seoData.metaTitle}
                      onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
                      placeholder="Page Title (50-60 chars)"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">Length: {seoData.metaTitle.length}/60 chars</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Meta Description</label>
                    <textarea
                      value={seoData.metaDescription}
                      onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                      placeholder="Brief summary for search results (150-160 chars)"
                      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                    />
                    <p className="text-xs text-gray-500">Length: {seoData.metaDescription.length}/160 chars</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Keywords</label>
                    <input
                      type="text"
                      value={seoData.keywords}
                      onChange={(e) => handleSeoChange('keywords', e.target.value)}
                      placeholder="comma, separated, keywords"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">OpenGraph (Social)</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">OG Title</label>
                    <input
                      type="text"
                      value={seoData.ogTitle}
                      onChange={(e) => handleSeoChange('ogTitle', e.target.value)}
                      placeholder="Social Share Title"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">OG Description</label>
                    <textarea
                      value={seoData.ogDescription}
                      onChange={(e) => handleSeoChange('ogDescription', e.target.value)}
                      placeholder="Social Share Description"
                      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">OG Image URL</label>
                    <input
                      type="text"
                      value={seoData.ogImage}
                      onChange={(e) => handleSeoChange('ogImage', e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Structured Data (JSON-LD)</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Schema Markup JSON</label>
                  <textarea
                    value={seoData.structuredData}
                    onChange={(e) => handleSeoChange('structuredData', e.target.value)}
                    placeholder="{ '@context': 'https://schema.org', ... }"
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] font-mono text-xs"
                  />
                  <p className="text-xs text-gray-500">Paste valid JSON-LD structure here. This will be injected into the page.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-white p-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-70 shadow-lg"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
