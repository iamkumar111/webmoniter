import Link from "next/link";
import Footer from "@/components/layout/footer";
import LandingHeader from "@/components/layout/landing-header";
import { Handshake, Award, TrendingUp, Users, ArrowRight, CheckCircle2, Globe, Rocket, ShieldCheck } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata("partners", {
        title: "Partner Program - websmonitor",
        description: "Join the websmonitor Partner Program. Earn revenue, get priority support, and access co-marketing opportunities.",
        keywords: ["websmonitor partners", "affiliate program", "reseller monitoring", "agency partnership"],
    });
}

export default function PartnersPage() {
    const benefits = [
        {
            title: "Revenue Share",
            icon: TrendingUp,
            description: "Earn a generous commission for every customer you refer to websmonitor.",
        },
        {
            title: "Priority Support",
            icon: Award,
            description: "Get direct access to our engineering team and dedicated partner support.",
        },
        {
            title: "Co-Marketing",
            icon: Handshake,
            description: "Collaborate on webinars, case studies, and content to reach a wider audience.",
        },
        {
            title: "Partner Portal",
            icon: Users,
            description: "Access exclusive tools, resources, and analytics in our dedicated partner dashboard.",
        },
    ];

    const partners = [
        { name: "Railway", role: "Infrastructure Partner", desc: "Providing seamless deployment for our global monitoring nodes." },
        { name: "Supabase", role: "Database Partner", desc: "Powering our real-time notification engine with extreme reliability." },
        { name: "Resend", role: "Email Partner", desc: "Ensuring 100% deliverability for all critical alert emails." },
        { name: "Coolify", role: "Self-Hosting Partner", desc: "Helping developers monitor their self-hosted infrastructure at scale." },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <LandingHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white overflow-hidden relative">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-sm mb-6">
                                    <Rocket className="w-4 h-4" />
                                    Partner Program v2.0
                                </div>
                                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-[1.05] tracking-tight">Grow your business with websmonitor.</h1>
                                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">Join our partner ecosystem and help your clients maintain 99.99% uptime while building a new recurring revenue stream.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/contact" className="inline-flex h-16 items-center justify-center rounded-full bg-indigo-600 px-10 text-lg font-bold text-white shadow-2xl transition-all hover:bg-indigo-700 hover:shadow-indigo-200 transform hover:-translate-y-1">
                                        Apply to Partner
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                    <Link href="/docs" className="inline-flex h-16 items-center justify-center rounded-full border border-gray-200 bg-white px-10 text-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                        View FAQ
                                    </Link>
                                </div>
                            </div>

                            {/* Visual Element */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-[3rem] rotate-3 transform scale-105 opacity-40 blur-2xl"></div>
                                <div className="relative bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl">
                                    <div className="space-y-8">
                                        {partners.map((partner, i) => (
                                            <div key={i} className="flex items-center gap-6 group">
                                                <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover:-rotate-3 transition-transform">
                                                    {partner.name[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-extrabold text-gray-900 text-lg">{partner.name}</h4>
                                                        <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider">Certified</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 font-medium">Official {partner.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Partners Showcase Section */}
                <section className="py-24 bg-gray-50 border-y border-gray-100">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Our Ecosystem</h2>
                            <h3 className="text-4xl font-bold text-gray-900">Partnering with Industry Leaders</h3>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2">
                            {partners.map((partner, index) => (
                                <div key={index} className="flex gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div className="shrink-0 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                                        <Globe className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{partner.name}</h4>
                                        <p className="text-gray-600 leading-relaxed mb-4">{partner.desc}</p>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                                            Integration Active
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-32 bg-white">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-24">
                            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Why Partner with us?</h2>
                            <p className="text-xl text-gray-600 leading-relaxed">We provide a premium toolkit for agencies and startups to scale their monitoring offerings.</p>
                        </div>
                        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex flex-col items-center text-center group">
                                    <div className="w-24 h-24 bg-white shadow-2xl rounded-[2rem] flex items-center justify-center text-indigo-600 mb-10 transform group-hover:scale-110 transition-transform border border-gray-50">
                                        <benefit.icon className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                                    <p className="text-gray-600 leading-relaxed font-medium">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                        <div className="bg-gray-900 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>

                            <div className="relative z-10 max-w-4xl mx-auto">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 font-bold text-sm mb-10">
                                    <ShieldCheck className="w-4 h-4" />
                                    Trusted by 500+ Active Partners
                                </div>
                                <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tight leading-[1.1]">Transform how you offer monitoring services.</h2>
                                <p className="text-gray-400 text-2xl mb-14 font-medium">Join the network and start building today.</p>
                                <Link href="/contact" className="inline-flex h-20 items-center justify-center rounded-full bg-indigo-600 px-16 text-2xl font-black text-white shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 hover:bg-indigo-500">
                                    Join the Program
                                    <ArrowRight className="ml-4 w-8 h-8" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
