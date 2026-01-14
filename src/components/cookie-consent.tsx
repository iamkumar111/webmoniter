"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem("cookie-consent", "essential-only");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-6 z-50 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl">
        <div className="text-gray-600 flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">We use cookies</h3>
          <p className="text-sm leading-relaxed">
            We use cookies to help this site function, understand service usage, and support marketing efforts. 
            Visit <Link href="/legal/cookie" className="text-indigo-600 hover:underline">Manage Cookies</Link> to change preferences anytime. 
            View our <Link href="/legal/cookie" className="text-indigo-600 hover:underline">Cookie Policy</Link> for more info.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <Link 
            href="/legal/cookie"
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Manage Cookies
          </Link>
          <button
            onClick={handleRejectNonEssential}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reject non-essential
          </button>
          <button
            onClick={handleAcceptAll}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
