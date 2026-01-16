import { ShoppingCart, Server, Code2, Globe } from "lucide-react";
import Footer from "@/components/layout/footer";
import LandingHeader from "@/components/layout/landing-header";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("solutions", {
    title: "Solutions - WebsMoniter",
    description: "Industry-specific monitoring solutions for E-Commerce, SaaS, DevOps, and Agencies.",
    keywords: ["ecommerce monitoring", "saas uptime", "devops monitoring tools", "agency website monitoring"],
  });
}

export default function SolutionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <LandingHeader />

      <main className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">Solutions for Every Team</h1>
            <p className="text-xl text-gray-600">Tailored monitoring strategies for your specific needs.</p>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <SolutionCard
              icon={ShoppingCart}
              title="E-Commerce"
              description="Every minute of downtime equals lost revenue. Monitor your checkout flows, payment gateways, and product pages to ensure customers can always buy."
              list={["Checkout flow monitoring", "Payment gateway checks", "Inventory API tracking"]}
            />
            <SolutionCard
              icon={Code2}
              title="SaaS & Startups"
              description="Build trust with your users by maintaining high availability. Show off your 99.99% uptime with public status pages."
              list={["Public Status Pages", "SLA monitoring", "API reliability checks"]}
            />
            <SolutionCard
              icon={Server}
              title="DevOps & IT"
              description="Get technical insights into server performance. Monitor internal tools, cron jobs, and background workers."
              list={["Server health checks", "Cron job monitoring", "Internal network monitoring"]}
            />
            <SolutionCard
              icon={Globe}
              title="Agencies"
              description="Monitor all your client websites from a single dashboard. Get white-labeled reports to prove the value of your maintenance packages."
              list={["Client portfolio dashboard", "White-label reports", "Client access management"]}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SolutionCard({ icon: Icon, title, description, list }: { icon: any, title: string, description: string, list: string[] }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="shrink-0">
        <div className="p-4 bg-white rounded-xl shadow-sm text-indigo-600">
          <Icon className="h-8 w-8" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        <ul className="space-y-2">
          {list.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
