import Footer from "@/components/layout/footer";
import LandingHeader from "@/components/layout/landing-header";
import { Badge } from "@/components/ui/badge";
import { Coffee, Heart, Globe, Zap, Mail } from "lucide-react";
import JobListings from "@/components/careers/job-listings";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata("careers", {
        title: "Careers - websmonitor",
        description: "Join websmonitor to build the future of website monitoring. We are hiring remote engineers, designers, and customer success leads.",
        keywords: ["websmonitor careers", "remote engineering jobs", "startup jobs", "site reliability engineer jobs"],
    });
}

export default function CareersPage() {
    const values = [
        { title: "Transparency", icon: Globe, description: "We believe in radical transparency, both internally and with our users." },
        { title: "Velocity", icon: Zap, description: "We move fast, ship daily, and iterate constantly to keep our customers ahead." },
        { title: "Well-being", icon: Heart, description: "We prioritize mental health and work-life balance above all else." },
        { title: "Great Coffee", icon: Coffee, description: "Well, we just really like good coffee (and good tea, too!)." },
    ];

    const jobs = [
        {
            title: "Full Stack Engineer",
            team: "Engineering",
            location: "Remote / London",
            type: "Full-time",
        },
        {
            title: "Site Reliability Engineer",
            team: "Infrastructure",
            location: "Remote / New York",
            type: "Full-time",
        },
        {
            title: "Product Designer",
            team: "Product",
            location: "Remote",
            type: "Full-time",
        },
        {
            title: "Customer Success Lead",
            team: "Customer Success",
            location: "Remote / Singapore",
            type: "Full-time",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <LandingHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gray-50 border-b border-gray-100">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto text-center">
                        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 mb-6 border-none px-4 py-1">We're Hiring!</Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">Join us in building the future of monitoring.</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">We're a distributed team of engineers, designers, and thinkers working to keep the web online for everyone.</p>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                            <p className="text-gray-600">The core principles that guide our work every day.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-4">
                            {values.map((value, index) => (
                                <div key={index} className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                        <value.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Jobs Section */}
                <section className="py-24 bg-gray-50">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
                                <p className="text-gray-600">Find your next challenge and help us scale.</p>
                            </div>
                            <div className="flex gap-4">
                                <Badge variant="outline" className="bg-white">All Departments</Badge>
                                <Badge variant="outline" className="bg-white">Remote Only</Badge>
                            </div>
                        </div>

                        <JobListings jobs={jobs} />

                        <div className="mt-16 p-8 bg-white rounded-[2rem] border border-dashed border-gray-300 text-center shadow-sm">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <p className="text-gray-600 font-medium mb-1">Don't see a position that fits?</p>
                            <h4 className="text-xl font-bold text-gray-900 mb-6">We're always looking for talented people.</h4>
                            <Link href="mailto:careers@websmonitor.online" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all inline-block">
                                Send an Open Application
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
