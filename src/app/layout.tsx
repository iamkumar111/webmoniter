import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import AnalyticsProvider from "@/components/analytics-provider";
import CookieConsent from "@/components/cookie-consent";
import { Toaster } from "sonner";
import { getPublicSystemSettings } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "WebsMoniter - Free Uptime Monitoring & Status Pages",
    template: "%s | WebsMoniter"
  },
  description: "Get 5 Professional Monitors FREE – No Credit Card Required! Advanced SSL, Cron, Keyword, Uptime & API Monitoring + Instant Alerts (Email, SMS, Slack & 10+ channels). Start in 30 Seconds and Never Lose Visitors to Downtime Again!",
  keywords: ["uptime monitor", "free website monitoring", "status page", "ping monitor", "ssl monitoring", "WebsMoniter", "free moniter", "website down check", "server monitoring", "api monitoring"],
  authors: [{ name: "WebsMoniter Team" }],
  creator: "WebsMoniter",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://websmoniter.online",
    title: "WebsMoniter - Free Uptime Monitoring",
    description: "Get 5 Professional Monitors FREE – No Credit Card Required! Advanced SSL, Cron, Keyword, Uptime & API Monitoring + Instant Alerts (Email, SMS, Slack & 10+ channels). Start in 30 Seconds and Never Lose Visitors to Downtime Again!",
    siteName: "WebsMoniter",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WebsMoniter Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebsMoniter - Free Uptime Monitoring",
    description: "Get 5 Professional Monitors FREE – No Credit Card Required! Advanced SSL, Cron, Keyword, Uptime & API Monitoring + Instant Alerts (Email, SMS, Slack & 10+ channels). Start in 30 Seconds and Never Lose Visitors to Downtime Again!",
    images: ["/og-image.png"],
  },
  metadataBase: new URL('https://websmoniter.online'),
  other: {
    "google-site-verification": "verification_token", // Placeholder
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSystemSettings();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AnalyticsProvider gaId={settings?.googleAnalyticsId} />
        <Providers>
          {children}
        </Providers>
        <CookieConsent />
        <Toaster position="top-right" richColors />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "WebsMoniter",
              "url": "https://websmoniter.online",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://websmoniter.online/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
