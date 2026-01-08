import { Activity, ShieldCheck, Zap, Mail, BarChart3, Clock } from "lucide-react";
import Footer from "@/components/layout/footer";
import LandingHeader from "@/components/layout/landing-header";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("features", {
    title: "Features - websmonitor",
    description: "Explore the powerful features of websmonitor: Uptime Monitoring, SSL Tracking, Real-time Alerts, and more.",
    keywords: ["uptime monitoring features", "ssl monitoring", "website status checks", "server monitoring tools"],
  });
}

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <LandingHeader />

      <main className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">Powerful Features</h1>
            <p className="text-xl text-gray-600">Everything you need to keep your services running smoothly.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Activity}
              title="Uptime Monitoring"
              description="We check your website every minute from multiple locations worldwide to ensure high availability."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="SSL Certificate Monitoring"
              description="Get proactive alerts before your SSL certificates expire to prevent security warnings for users."
            />
            <FeatureCard
              icon={Zap}
              title="Response Time Tracking"
              description="Monitor API and page load performance. Identify slow endpoints before they affect user experience."
            />
            <FeatureCard
              icon={Mail}
              title="Multi-channel Alerts"
              description="Receive notifications via Email, SMS, Slack, Discord, and Webhooks instantly when downtime occurs."
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="Visualize uptime, response times, and incident history with beautiful, shareable status pages."
            />
            <FeatureCard
              icon={Clock}
              title="Incident Management"
              description="Track incidents from start to finish. Log root causes and share updates with your team."
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow hover:border-indigo-100 group">
      <div className="p-3 bg-indigo-50 rounded-xl w-fit mb-4 group-hover:bg-indigo-100 transition-colors">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
