import Footer from "@/components/layout/footer";
import LandingHeader from "@/components/layout/landing-header";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
   return generatePageMetadata("pricing", {
      title: "Pricing - WebMoniter",
      description: "Simple, transparent pricing for website monitoring. Start for free or scale with our Pro and Enterprise plans.",
      keywords: ["website monitoring pricing", "free uptime monitor", "ssl monitoring cost", "server monitoring plans"],
   });
}

export default function PricingPage() {
   return (
      <div className="flex flex-col min-h-screen bg-white font-sans">
         <LandingHeader />

         <main className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">Simple, Transparent Pricing</h1>
                  <p className="text-xl text-gray-600">Choose the plan that fits your monitoring needs.</p>
               </div>

               <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                  {/* Free Plan */}
                  <div className="flex flex-col p-6 bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden hover:shadow-lg transition-shadow">
                     <h3 className="text-xl font-bold text-gray-900">Free Plan</h3>
                     <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-extrabold text-gray-900">$0</span>
                        <span className="ml-1 text-gray-500">/ month</span>
                     </div>
                     <p className="mt-4 text-gray-900 font-medium">For hobbyists, developers, and side projects</p>
                     <p className="mt-2 text-gray-500 text-sm">Perfect for individuals who want basic uptime monitoring without any cost.</p>

                     <div className="mt-6 border-t border-gray-100 pt-4">
                        <p className="text-sm font-semibold text-gray-900 mb-3">What you get:</p>
                        <ul className="space-y-3">
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>5 Website Monitors</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>15-minute uptime checks</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>Email alerts</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>Basic uptime statistics</span>
                           </li>
                        </ul>
                     </div>

                     <div className="mt-8 pt-6 border-t border-gray-100">
                        <button
                           disabled
                           className="w-full py-2 px-4 bg-gray-100 text-gray-400 font-bold rounded-lg text-center cursor-not-allowed mb-3"
                        >
                           Get Started
                        </button>
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                           <p className="text-xs text-yellow-800 text-center font-medium">
                              🚧 Due to extremely high traffic, new free sign-ups are temporarily disabled.
                              We’re working on scaling our systems and securing funding to reopen access soon.
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Pro Plan */}
                  <div className="flex flex-col p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden transform md:scale-105 z-10">
                     <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                     <h3 className="text-xl font-bold text-white">🔵 Pro Plan</h3>
                     <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-extrabold text-white">$29</span>
                        <span className="ml-1 text-gray-400">/ month</span>
                     </div>
                     <p className="mt-4 text-white font-medium">For serious businesses, startups, and growing teams</p>
                     <p className="mt-2 text-gray-400 text-sm">Designed for production websites that need fast monitoring and instant alerts.</p>

                     <div className="mt-6 border-t border-gray-800 pt-4">
                        <p className="text-sm font-semibold text-white mb-3">What you get:</p>
                        <ul className="space-y-3">
                           <li className="flex items-start gap-3 text-sm text-gray-300">
                              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                              <span>500 Website Monitors</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-300">
                              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                              <span>1-minute uptime checks</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-300">
                              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                              <span>Email alerts</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-300">
                              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                              <span>SMS alerts</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-300">
                              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                              <span>SSL certificate expiry monitoring</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-300">
                              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                              <span>Advanced monitoring insights</span>
                           </li>
                        </ul>
                     </div>

                     <div className="mt-8 pt-6 border-t border-gray-800">
                        <button
                           disabled
                           className="w-full py-2 px-4 bg-gray-800 text-gray-500 font-bold rounded-lg text-center cursor-not-allowed mb-3 border border-gray-700"
                        >
                           Invite Only
                        </button>
                        <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3">
                           <p className="text-xs text-indigo-300 text-center font-medium">
                              🔒 Pro plan registration is currently closed.
                              Access will be reopened soon through invitations.
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Enterprise Plan */}
                  <div className="flex flex-col p-6 bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden hover:shadow-lg transition-shadow">
                     <h3 className="text-xl font-bold text-gray-900">🟣 Enterprise Plan</h3>
                     <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-extrabold text-gray-900">Custom Pricing</span>
                     </div>
                     <p className="mt-4 text-gray-900 font-medium">For large organizations and mission-critical systems</p>
                     <p className="mt-2 text-gray-500 text-sm">Tailored solutions for enterprises that require scale, security, and dedicated support.</p>

                     <div className="mt-6 border-t border-gray-100 pt-4">
                        <p className="text-sm font-semibold text-gray-900 mb-3">Enterprise features:</p>
                        <ul className="space-y-3">
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>Unlimited or custom monitor limits</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>Custom check intervals</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>Dedicated alerting channels</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>SLA & compliance support</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>Priority support</span>
                           </li>
                           <li className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span>Custom integrations</span>
                           </li>
                        </ul>
                     </div>

                     <div className="mt-8 pt-6 border-t border-gray-100 mt-auto">
                        <Link
                           href="/contact"
                           className="w-full inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700"
                        >
                           Contact Sales
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
}
