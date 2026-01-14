import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, BarChart3, Star, Quote, Activity, Server, Globe } from "lucide-react";
import Footer from "@/components/layout/footer";
import LandingHeader from "@/components/layout/landing-header";
import { getPageContent } from "@/lib/settings";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("home", {
    title: "WebMoniter - Free Uptime Monitoring & Status Pages",
    description: "The world's leading free uptime monitoring service. Monitor websites, SSL certificates, and APIs in real-time. Get instant alerts via Email, Slack, and SMS.",
    keywords: ["uptime monitor", "free website monitoring", "status page", "ping monitor", "ssl monitoring"],
  });
}

export default async function LandingPage() {
  const content = await getPageContent("home");
  const data = (content?.data as any) || {};

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <LandingHeader />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="w-full pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 bg-white overflow-hidden relative">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-200/40 rounded-full blur-[80px] md:blur-[100px] opacity-70 animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-200/40 rounded-full blur-[80px] md:blur-[100px] opacity-70 animate-pulse-slow delay-1000"></div>
          </div>

          <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="flex flex-col space-y-8 text-center lg:text-left animate-fade-in-up">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 w-fit mx-auto lg:mx-0">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    <span className="text-sm font-semibold text-indigo-700">{data.badgeText || "New Generation Monitoring"}</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                    {data.heroTitle || "Monitor Your Digital World"}
                  </h1>
                  <p className="mx-auto lg:mx-0 max-w-[600px] text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
                    {data.heroSubtitle || "Ensure 99.99% uptime with our advanced monitoring solution. Real-time alerts, SSL tracking, and detailed analytics in one dashboard."}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-base font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 transform hover:-translate-y-1"
                    href="/login"
                  >
                    {data.heroButtonStart || "Start Monitoring Now"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-base font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 hover:border-gray-300"
                    href="/features"
                  >
                    {data.heroButtonExplore || "Explore Features"}
                  </Link>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-8 text-gray-600 text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span>No Credit Card Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span>14-Day Free Trial</span>
                  </div>
                </div>
              </div>

              {/* RELEVANT 3D VISUALIZATION: Floating Dashboard UI */}
              <div className="relative w-full h-[400px] md:h-[500px] perspective-1000 flex items-center justify-center lg:justify-end lg:pr-[5%]">
                <div className="relative w-full max-w-md aspect-square animate-float preserve-3d">

                  {/* Main Dashboard Card */}
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-gray-200 transform rotate-y-[-12deg] rotate-x-[10deg] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="ml-4 h-6 w-32 bg-gray-200 rounded-md opacity-50"></div>
                    </div>
                    {/* Body */}
                    <div className="p-6 flex-1 space-y-6">
                      {/* Graph Area */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-4 w-24 bg-gray-100 rounded"></div>
                          <div className="h-4 w-12 bg-green-100 text-green-600 text-xs font-bold rounded flex items-center justify-center">99.99%</div>
                        </div>
                        <div className="h-24 bg-gray-50 rounded-lg flex items-end justify-between p-2 gap-1">
                          {[40, 60, 45, 70, 80, 65, 50, 75, 90, 60].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-500/20 rounded-t-sm" style={{ height: `${h}%` }}>
                              <div className="w-full bg-indigo-500 rounded-t-sm h-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Server List */}
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              {i === 1 ? <Globe className="w-4 h-4 text-blue-500" /> : i === 2 ? <Server className="w-4 h-4 text-purple-500" /> : <Activity className="w-4 h-4 text-green-500" />}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="h-2 w-20 bg-gray-200 rounded"></div>
                              <div className="h-1.5 w-12 bg-gray-100 rounded"></div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements for 3D Depth */}
                  <div className="absolute -right-6 top-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 transform translate-z-20 animate-bounce-slow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold">STATUS</div>
                        <div className="text-sm font-bold text-gray-900">Operational</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -left-8 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-gray-100 transform translate-z-30 animate-pulse-slow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <Activity className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold">RESPONSE</div>
                        <div className="text-sm font-bold text-gray-900">24ms</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-white border-b border-gray-100">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Reliability by the Numbers</h2>
              <p className="mt-4 text-lg text-gray-600">Our platform processes billions of requests to ensure your services stay online, everywhere, all the time.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
              <div className="p-4">
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">{data.statsMonitors || "5M+"}</div>
                <div className="text-gray-900 font-bold text-lg">Monitors Created</div>
              </div>
              <div className="p-4">
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">{data.statsNotifications || "10B+"}</div>
                <div className="text-gray-900 font-bold text-lg">Notifications Sent</div>
              </div>
              <div className="p-4">
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">{data.statsUptime || "99.9%"}</div>
                <div className="text-gray-900 font-bold text-lg">Service Uptime</div>
              </div>
              <div className="p-4">
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">{data.statsSupport || "24/7"}</div>
                <div className="text-gray-900 font-bold text-lg">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Why WebMoniter?</h2>
              <p className="mt-4 text-lg text-gray-600">We provide the most reliable monitoring service with a focus on simplicity and accuracy.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Alerts</h3>
                <p className="text-gray-600">Get notified via Email, SMS, or Slack the second your website goes down. Be the first to know.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">SSL Monitoring</h3>
                <p className="text-gray-600">Prevent expired certificates with proactive alerts. We check your SSL validity automatically.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Network</h3>
                <p className="text-gray-600">Monitoring from multiple locations worldwide ensures your site is accessible to everyone.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-white border-t border-gray-100">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 mb-6">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="text-sm font-semibold text-orange-700">Trusted by 5,000+ Developers</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">What our users say</h2>
              <p className="text-xl text-gray-600">Don't just take our word for it. Here's what teams like yours are saying about WebMoniter.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 rounded-2xl p-8 relative">
                <Quote className="absolute top-8 right-8 w-10 h-10 text-indigo-100" />
                <div className="flex gap-1 text-orange-400 mb-6">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed relative z-10">
                  "WebMoniter saved us during our Black Friday sale. The instant alerts let us fix a database issue before customers noticed. It's an absolute lifesaver."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg">SJ</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Sarah Jenkins</h4>
                    <p className="text-sm text-gray-500">CTO at TechFlow</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gray-50 rounded-2xl p-8 relative transform md:-translate-y-4 shadow-lg border-2 border-indigo-50">
                <Quote className="absolute top-8 right-8 w-10 h-10 text-indigo-100" />
                <div className="flex gap-1 text-orange-400 mb-6">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed relative z-10">
                  "The SSL expiry monitoring is something I didn't know I needed until I used it. No more embarrassing security warnings for our clients. Worth every penny."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 text-lg">MT</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Mike Thompson</h4>
                    <p className="text-sm text-gray-500">Lead Dev at StartUp Inc.</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gray-50 rounded-2xl p-8 relative">
                <Quote className="absolute top-8 right-8 w-10 h-10 text-indigo-100" />
                <div className="flex gap-1 text-orange-400 mb-6">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed relative z-10">
                  "Simple, effective, and affordable. Most tools are bloated with features we don't need. WebMoniter focuses on what matters: keeping us online."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600 text-lg">ER</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Emily Rodriguez</h4>
                    <p className="text-sm text-gray-500">Founder, E-Com Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WebMoniter",
              "url": "https://webmoniter.io",
              "logo": "https://webmoniter.io/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-0123-456",
                "contactType": "customer support"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "WebMoniter",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free website monitoring service to check uptime and SSL certificates.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "5000"
              }
            }
          ])
        }}
      />

      <Footer />
    </div>
  );
}
