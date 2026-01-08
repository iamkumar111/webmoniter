import Link from "next/link";
import Footer from "@/components/layout/footer";
import LandingHeader from "@/components/layout/landing-header";
import { Book, Shield, Bell, Code, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata("docs", {
        title: "Documentation - WebsMonitor",
        description: "Learn how to set up site monitoring, SSL alerts, and status pages with WebsMonitor documentation.",
        keywords: ["WebsMonitor docs", "uptime robot api", "monitoring documentation", "setup guide"],
    });
}

export default function DocsPage() {
    const sections = [
        {
            title: "Getting Started",
            icon: Book,
            description: "Quickly set up your monitoring environment and start receiving alerts.",
            content: [
                { label: "Installation Guide", desc: "No installation required! Just sign up and add your first URL." },
                { label: "Dashboard Navigation", desc: "Understand your uptime stats, response times, and incident history at a glance." },
                { label: "Organizing Monitors", desc: "Use tags and folders to group your services by project or environment." },
            ],
        },
        {
            title: "Monitoring Types",
            icon: Shield,
            description: "UptimeRobot supports various check types to ensure full coverage.",
            content: [
                { label: "HTTP(S) Checks", desc: "Basic uptime checks with support for custom headers and status codes." },
                { label: "SSL Monitoring", desc: "Get notified before your certificates expire. We track validity and chain issues." },
                { label: "Keyword Checks", desc: "Verify that specific text is present (or absent) on your page content." },
                { label: "Port & Ping", desc: "Monitor raw network services like SMTP, SSH, or custom TCP/UDP ports." },
            ],
        },
        {
            title: "Alerting & Integrations",
            icon: Bell,
            description: "Never miss an incident with our wide range of notification channels.",
            content: [
                { label: "Slack & Discord", desc: "Send real-time alerts directly to your team's communication channels." },
                { label: "WhatsApp (CallMeBot)", desc: "Receive critical downtime notifications on your mobile device via WhatsApp." },
                { label: "Email & SMS", desc: "Reliable fallback alerts delivered directly to your inbox or phone." },
                { label: "Webhook Payloads", desc: "Trigger automated scripts or third-party workflows when a monitor goes down." },
            ],
        },
        {
            title: "API Reference",
            icon: Code,
            description: "Fully automate your monitoring setup with our developer-friendly API.",
            content: [
                { label: "Authentication", desc: "Secure your requests using API keys with scoped permissions." },
                { label: "Monitor Management", desc: "Programmatically create, update, or delete monitors and maintenance windows." },
                { label: "Report Data", desc: "Fetch historical uptime and latency data for your own internal dashboards." },
            ],
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <LandingHeader />

            <main className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
                <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">Documentation</h1>
                        <p className="text-xl text-gray-600">Master the art of monitoring and ensure 99.99% reliability.</p>
                    </div>

                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
                        {sections.map((section, index) => (
                            <div key={index} className="flex flex-col p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-indigo-100 shadow-xl">
                                        <section.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-gray-900">{section.title}</h3>
                                </div>
                                <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                                    {section.description}
                                </p>
                                <ul className="space-y-6 flex-1">
                                    {section.content.map((item, i) => (
                                        <li key={i} className="group/item">
                                            <div className="mb-1 text-lg font-bold text-gray-900 flex items-center gap-2 group-hover/item:text-indigo-600 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                                {item.label}
                                            </div>
                                            <p className="text-gray-500 text-base leading-snug ml-3.5">
                                                {item.desc}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-10 pt-8 border-t border-gray-200">
                                    <Link href="/contact" className="text-indigo-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                                        Explore deeper <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 p-12 bg-gray-900 rounded-[3rem] text-center text-white overflow-hidden relative shadow-2xl">
                        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-extrabold mb-6">Can't find what you're looking for?</h2>
                            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto font-medium">Our technical support engineers are available around the clock to assist you with complex setups.</p>
                            <Link href="/contact" className="inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-gray-900 shadow-xl hover:scale-105 active:scale-95 transition-all">
                                Speak with an Expert
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
