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
  description: "The world's leading free uptime monitoring service. Monitor websites, SSL certificates, and APIs in real-time. Get instant alerts via Email, Slack, and SMS.",
  keywords: ["uptime monitor", "free website monitoring", "status page", "ping monitor", "ssl monitoring", "WebsMoniter", "free moniter", "website down check", "server monitoring", "api monitoring"],
  authors: [{ name: "WebsMoniter Team" }],
  creator: "WebsMoniter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://websmoniter.online",
    title: "WebsMoniter - Free Uptime Monitoring",
    description: "Monitor your websites uptime and performance for free. Get instant alerts and detailed status pages.",
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
    description: "Monitor your websites uptime and performance for free. Get instant alerts and detailed status pages.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL('https://websmoniter.online'),
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
      </body>
    </html>
  );
}
