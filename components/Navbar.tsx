"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ScanText, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenScanner?: () => void;
}

export function Navbar({ onOpenScanner }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-4",
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-zinc-200/80 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Top Left Logo (White on Hero, Dark when scrolled) */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
              scrolled
                ? "bg-zinc-950 text-white"
                : "bg-white text-blue-600 shadow-md ring-1 ring-white/50"
            )}
          >
            <ScanText className="w-4 h-4" />
          </div>
          <span
            className={cn(
              "text-xl font-bold tracking-tight font-sans lowercase transition-colors duration-300",
              scrolled ? "text-zinc-950" : "text-white drop-shadow-sm"
            )}
          >
            hirely<span className={scrolled ? "text-blue-600" : "text-blue-300"}>.ai</span>
          </span>
        </a>

        {/* Center Pill Navigation */}
        <nav
          className={cn(
            "hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full backdrop-blur-xl transition-all duration-300 shadow-sm border",
            scrolled
              ? "bg-white/90 border-zinc-200 text-zinc-600"
              : "bg-white/15 border-white/25 text-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          )}
        >
          <a
            href="#hero"
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full transition-colors",
              scrolled
                ? "hover:text-zinc-950 hover:bg-zinc-100/60"
                : "hover:text-white hover:bg-white/15"
            )}
          >
            Scanner
          </a>
          <a
            href="#workflow"
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full transition-colors",
              scrolled
                ? "hover:text-zinc-950 hover:bg-zinc-100/60"
                : "hover:text-white hover:bg-white/15"
            )}
          >
            How it Works
          </a>
          <a
            href="#features"
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full transition-colors",
              scrolled
                ? "hover:text-zinc-950 hover:bg-zinc-100/60"
                : "hover:text-white hover:bg-white/15"
            )}
          >
            Features
          </a>
          <a
            href="#testimonials"
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full transition-colors",
              scrolled
                ? "hover:text-zinc-950 hover:bg-zinc-100/60"
                : "hover:text-white hover:bg-white/15"
            )}
          >
            Stories
          </a>
          <a
            href="#faq"
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full transition-colors",
              scrolled
                ? "hover:text-zinc-950 hover:bg-zinc-100/60"
                : "hover:text-white hover:bg-white/15"
            )}
          >
            FAQ
          </a>
        </nav>

        {/* Top Right Button (Crisp White Button on Hero, Dark when scrolled) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenScanner}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md",
              scrolled
                ? "bg-zinc-950 hover:bg-zinc-800 text-white"
                : "bg-white hover:bg-white/95 text-zinc-950 shadow-[0_4px_15px_rgba(0,0,0,0.12)]"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Launch Free Scanner</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={cn(
            "md:hidden p-2 rounded-lg border shadow-sm transition-colors",
            scrolled
              ? "bg-white border-zinc-200 text-zinc-700"
              : "bg-white/20 backdrop-blur-md border-white/30 text-white"
          )}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-xl space-y-2 text-zinc-900">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-700 hover:text-zinc-950 px-3 py-2 rounded-lg hover:bg-zinc-50"
          >
            Scanner
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-700 hover:text-zinc-950 px-3 py-2 rounded-lg hover:bg-zinc-50"
          >
            How it Works
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-700 hover:text-zinc-950 px-3 py-2 rounded-lg hover:bg-zinc-50"
          >
            Features
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-700 hover:text-zinc-950 px-3 py-2 rounded-lg hover:bg-zinc-50"
          >
            Stories
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-700 hover:text-zinc-950 px-3 py-2 rounded-lg hover:bg-zinc-50"
          >
            FAQ
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenScanner?.();
            }}
            className="w-full py-2.5 rounded-xl bg-zinc-950 text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Launch Free Scanner</span>
          </button>
        </div>
      )}
    </header>
  );
}
