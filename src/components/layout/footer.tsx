import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook } from "lucide-react";
import { getPublicSystemSettings } from "@/lib/settings";

export default async function Footer() {
  const settings = await getPublicSystemSettings();

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link className="flex items-center gap-2 mb-4" href="/">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">W</div>
              <span className="font-bold text-xl text-gray-900">websmonitor</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              Ensuring the reliability of the internet, one monitor at a time.
              Join thousands of developers who trust us.
            </p>
            <div className="flex gap-4">
              {settings?.socialTwitter && (
                <Link href={settings.socialTwitter} className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                  <Twitter className="w-4 h-4" />
                </Link>
              )}
              {settings?.socialGithub && (
                <Link href={settings.socialGithub} className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                  <Github className="w-4 h-4" />
                </Link>
              )}
              {settings?.socialLinkedin && (
                <Link href={settings.socialLinkedin} className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </Link>
              )}
              {settings?.socialFacebook && (
                <Link href={settings.socialFacebook} className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                  <Facebook className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</Link></li>
              <li><Link href="/solutions" className="text-gray-600 hover:text-indigo-600 transition-colors">Solutions</Link></li>
              <li><Link href="/changelog" className="text-gray-600 hover:text-indigo-600 transition-colors">Changelog</Link></li>
              <li><Link href="/docs" className="text-gray-600 hover:text-indigo-600 transition-colors">Docs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-indigo-600 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Blog</Link></li>
              <li><Link href="/partners" className="text-gray-600 hover:text-indigo-600 transition-colors">Partners</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/legal/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/cookie" className="text-gray-600 hover:text-indigo-600 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/legal/gdpr" className="text-gray-600 hover:text-indigo-600 transition-colors">GDPR</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 websmonitor Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
