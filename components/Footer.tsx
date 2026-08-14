"use client";

import React from "react";
import { Sparkles, Shield, ArrowUp } from "lucide-react";

interface FooterProps {}

export function Footer({}: FooterProps = {}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-white border-t border-zinc-200 text-zinc-600 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Pre-footer Call to Action Card (Cluely Style) */}
        <div className="rounded-3xl p-8 sm:p-12 bg-[#fafafa] border border-zinc-200/90 text-center space-y-6 max-w-4xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-4xl font-sans font-bold text-zinc-950 tracking-tight">
              Ready to beat the ATS before human review?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto font-sans leading-relaxed">
              Scan your resume in 5 seconds. Get instant keyword gap analysis and AI-optimized STAR bullet rewrites for free.
            </p>
          </div>
          <div>
            <button
              onClick={scrollToTop}
              className="px-6 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow transition-all duration-200 inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Start Free ATS Scan</span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-8 border-t border-zinc-200/60 text-xs">
          <div className="col-span-2 space-y-3">
            <a href="#" className="flex items-center gap-2">
              <img
                src="/hirelynav.png"
                alt="Hirely"
                className="h-6 w-auto object-contain brightness-0"
              />
            </a>
            <p className="text-zinc-500 max-w-sm leading-relaxed">
              Undetectable ATS optimization and reverse-engineering suite powered by Google Gemini 2.5 Flash.
            </p>
            <div className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero data retention. In-memory real-time parsing.</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-mono font-bold text-zinc-950 uppercase tracking-wider text-[10px]">
              ATS Systems
            </span>
            <ul className="space-y-1 text-zinc-600 font-mono text-[11px]">
              <li><a href="#integrations" className="hover:text-zinc-950 transition-colors">Workday</a></li>
              <li><a href="#integrations" className="hover:text-zinc-950 transition-colors">Taleo</a></li>
              <li><a href="#integrations" className="hover:text-zinc-950 transition-colors">Greenhouse</a></li>
              <li><a href="#integrations" className="hover:text-zinc-950 transition-colors">Ashby & Lever</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-mono font-bold text-zinc-950 uppercase tracking-wider text-[10px]">
              Features
            </span>
            <ul className="space-y-1 text-zinc-600 font-mono text-[11px]">
              <li><a href="#workflow" className="hover:text-zinc-950 transition-colors">How it Works</a></li>
              <li><a href="#features" className="hover:text-zinc-950 transition-colors">Keyword Matrix</a></li>
              <li><a href="#features" className="hover:text-zinc-950 transition-colors">STAR Rewriter</a></li>
              <li><a href="#features" className="hover:text-zinc-950 transition-colors">Score Gauge</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-mono font-bold text-zinc-950 uppercase tracking-wider text-[10px]">
              Resources
            </span>
            <ul className="space-y-1 text-zinc-600 font-mono text-[11px]">
              <li><a href="#faq" className="hover:text-zinc-950 transition-colors">ATS FAQ</a></li>
              <li><a href="#testimonials" className="hover:text-zinc-950 transition-colors">Stories</a></li>
              <li>
                <button onClick={scrollToTop} className="hover:text-zinc-950 transition-colors flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" /> Back to Top
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-zinc-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} Hirely AI. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">100% Free Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
