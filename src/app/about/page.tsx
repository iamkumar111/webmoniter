import Footer from "@/components/layout/footer";
import LandingHeader from "@/components/layout/landing-header";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
   return generatePageMetadata("about", {
      title: "About Us - WebsMonitor",
      description: "Learn about the team behind WebsMonitor and our mission to make the internet more reliable.",
      keywords: ["about WebsMonitor", "company mission", "uptime monitoring team"],
   });
}

export default function AboutPage() {
   return (
      <div className="flex flex-col min-h-screen bg-white font-sans">
         <LandingHeader />

         <main className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
               <div className="text-center mb-16">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">About WebsMonitor</h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                     We are on a mission to make the internet more reliable.
                  </p>
               </div>

               <div className="prose prose-lg mx-auto text-gray-600">
                  <p className="mb-6">
                     Founded in 2026, WebsMonitor started with a simple idea: website downtime shouldn&apos;t be a mystery.
                     We built a platform that not only tells you <em>when</em> your site is down, but <em>why</em>.
                  </p>
                  <p className="mb-6">
                     Today, thousands of developers, startups, and enterprises trust us to keep a watchful eye on their digital assets.
                     Our global network of monitoring nodes ensures that we see what your users see, no matter where they are.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Our Values</h2>
                  <div className="grid sm:grid-cols-2 gap-8 not-prose">
                     <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Transparency</h3>
                        <p className="text-sm">We believe in open status communication. That&apos;s why we offer public status pages for everyone.</p>
                     </div>
                     <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Reliability</h3>
                        <p className="text-sm">We monitor our own monitors. Redundancy is built into every layer of our stack.</p>
                     </div>
                     <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Simplicity</h3>
                        <p className="text-sm">Powerful tools shouldn&apos;t be complicated. We obsess over UX to make monitoring easy.</p>
                     </div>
                     <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Speed</h3>
                        <p className="text-sm">In downtime, every second counts. Our alerting pipeline is optimized for zero latency.</p>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
}
