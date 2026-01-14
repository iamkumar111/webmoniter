"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Blur Mask - Only covers the 24px gap above the header */}
      <div
        className={`fixed top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent backdrop-blur-md pointer-events-none z-[48] transition-opacity duration-500 ${isScrolled ? "opacity-100" : "opacity-0"
          }`}
      ></div>

      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-16 flex items-center px-6 md:px-10 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl z-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500">
        <div className="container mx-auto flex items-center justify-between">
          <Link className="flex items-center gap-2 group" href="/">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 transform group-hover:scale-105">W</div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">WebMoniter</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors relative group" href="/features">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors relative group" href="/solutions">
              Solutions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors relative group" href="/pricing">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors relative group" href="/about">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors relative group" href="/contact">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors" href="/login">
              Login
            </Link>
            <Link
              className="text-sm font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              href="/login"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg md:hidden flex flex-col p-4 space-y-4 animate-in slide-in-from-top-5">
            <Link className="text-base font-semibold text-gray-700 hover:text-indigo-600 py-2 border-b border-gray-50" href="/features" onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link className="text-base font-semibold text-gray-700 hover:text-indigo-600 py-2 border-b border-gray-50" href="/solutions" onClick={() => setIsMenuOpen(false)}>
              Solutions
            </Link>
            <Link className="text-base font-semibold text-gray-700 hover:text-indigo-600 py-2 border-b border-gray-50" href="/pricing" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </Link>
            <Link className="text-base font-semibold text-gray-700 hover:text-indigo-600 py-2 border-b border-gray-50" href="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link className="text-base font-semibold text-gray-700 hover:text-indigo-600 py-2 border-b border-gray-50" href="/contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="flex flex-col gap-3 pt-2">
              <Link className="text-center w-full py-2.5 rounded-lg border border-gray-200 font-semibold text-gray-900 hover:bg-gray-50" href="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link className="text-center w-full py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700" href="/login" onClick={() => setIsMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
