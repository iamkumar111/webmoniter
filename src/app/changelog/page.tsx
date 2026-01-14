import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/footer";
import LandingHeader from "@/components/layout/landing-header";
import { CheckCircle2, Star, Zap, Bug, Rocket } from "lucide-react";

export default function ChangelogPage() {
    const updates = [
        {
            version: "2.4.0",
            date: "January 10, 2026",
            title: "Enhanced Notification Channels",
            description: "We've added support for WhatsApp (via CallMeBot) and improved our Slack and Discord integrations.",
            changes: [
                { type: "New", text: "WhatsApp notification integration", icon: Zap },
                { type: "New", text: "Custom webhook payloads for advanced users", icon: Zap },
                { type: "Improved", text: "Notification retry logic for unstable connections", icon: Star },
                { type: "Fixed", text: "Minor UI glitch in integration settings", icon: Bug },
            ],
        },
        {
            version: "2.3.5",
            date: "December 20, 2025",
            title: "Performance Optimizations",
            description: "Significant improvements to dashboard load times and real-time data synchronization.",
            changes: [
                { type: "Improved", text: "Dashboard data fetching speed by 40%", icon: Star },
                { type: "Improved", text: "Real-time socket connection stability", icon: Star },
                { type: "Fixed", text: "Edge case where monitors occasionally showed 'Unknown' status", icon: Bug },
            ],
        },
        {
            version: "2.3.0",
            date: "December 5, 2025",
            title: "SSL Expiry Monitoring",
            description: "Never let an SSL certificate expire again with our new proactive monitoring and alerting system.",
            changes: [
                { type: "New", text: "SSL certificate validity tracking", icon: Rocket },
                { type: "New", text: "Configurable alerts for 30, 14, and 7 days before expiry", icon: Zap },
                { type: "Improved", text: "New 'Security' tab in monitor details", icon: Star },
            ],
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <LandingHeader />

            <main className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
                <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">Changelog</h1>
                        <p className="text-xl text-gray-600">Product updates, new features, and improvements.</p>
                    </div>

                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                        {updates.map((update, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                {/* Dot */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-600 text-white shadow md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shrink-0 z-10">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>

                                {/* Content */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <time className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{update.date}</time>
                                        <Badge variant="outline" className="bg-white text-gray-700 border-gray-200 font-mono">v{update.version}</Badge>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{update.title}</h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">{update.description}</p>

                                    <ul className="space-y-3">
                                        {update.changes.map((change, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className={`mt-1 p-1 rounded-md bg-white shadow-sm ${change.type === 'New' ? 'text-green-600' :
                                                        change.type === 'Improved' ? 'text-blue-600' : 'text-orange-600'
                                                    }`}>
                                                    <change.icon className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-bold text-sm mr-2">{change.type}:</span>
                                                    <span className="text-sm text-gray-700">{change.text}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
