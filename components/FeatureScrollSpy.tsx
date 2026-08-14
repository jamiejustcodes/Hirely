"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Cpu,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { SpotlightCard } from "./SpotlightCard";
import { ScoreGauge } from "./ui/ScoreGauge";

interface FeatureScrollSpyProps {
  onTryDemo?: () => void;
}

const SECTIONS = [
  { id: "keywords", label: "Keyword Extraction" },
  { id: "star-rewriter", label: "STAR Bullet Rewriter" },
  { id: "undetectability", label: "Undetectable Parsability" },
  { id: "match-score", label: "Match Score Engine" },
];

export function FeatureScrollSpy({ onTryDemo }: FeatureScrollSpyProps) {
  const [activeSection, setActiveSection] = useState<string>("keywords");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="features"
      className="bg-white text-zinc-950 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-b border-zinc-200/80 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-blue-600 text-xs font-mono shadow-2xs">
            <Cpu className="w-3.5 h-3.5" />
            DEEP ATS CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight text-zinc-950 leading-[1.15]">
            Engineered to reverse-engineer recruiter screening bots.
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-sans">
            75% of resumes are discarded before human review. Hirely analyzes your candidacy across 5 objective vectors to ensure you land in the top 1% interview pool.
          </p>
        </motion.div>

        {/* 25% Sticky Sidebar / 75% Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
          {/* Sticky Left Navigation (25%) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-28 space-y-2">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-1">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 px-2">
                Features Index
              </span>
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className="w-full text-left py-2.5 px-3 rounded-xl flex items-center gap-3 transition-all duration-300 group relative"
                  >
                    <div className="w-2 h-2 flex items-center justify-center">
                      <span
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-zinc-950 scale-100 opacity-100 shadow-xs"
                            : "bg-zinc-300 scale-50 opacity-0 group-hover:opacity-50"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-sans transition-all duration-300 ${
                        isActive
                          ? "font-bold text-zinc-950 translate-x-0.5"
                          : "font-medium text-zinc-500 group-hover:text-zinc-800"
                      }`}
                    >
                      {section.label}
                    </span>
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-zinc-100">
                <button
                  onClick={onTryDemo}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Try Live Scanner
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area (75%) */}
          <div className="lg:col-span-9 space-y-16">
            {/* Feature 1: Keyword Extraction */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard
                id="keywords"
                className="scroll-mt-32 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                    Keyword & Skill Density Heatmap
                  </h3>
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                    ATS parsers score candidates based on exact phrase frequency and synonym equivalence. Hirely extracts both hard skills and soft traits, exposing missing terms instantly.
                  </p>
                  <div className="space-y-2 pt-2 text-xs font-mono text-zinc-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Exact frequency counts vs target job description</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 font-mono text-xs shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 text-zinc-500">
                    <span>KEYWORD MATCH MATRIX</span>
                    <span className="text-emerald-600 font-bold">12/14 Matched</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-between shadow-2xs">
                    <span className="text-zinc-800 font-semibold">TypeScript & React</span>
                    <span className="text-emerald-600 font-bold">4x Found (Optimal)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-between shadow-2xs">
                    <span className="text-zinc-800 font-semibold">PostgreSQL / Redis</span>
                    <span className="text-emerald-600 font-bold">2x Found</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between">
                    <span className="text-rose-800 font-semibold">Kafka / Event Architecture</span>
                    <span className="text-rose-600 font-bold">Missing (Critical)</span>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Feature 2: STAR Bullet Rewriter */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard
                id="star-rewriter"
                className="scroll-mt-32 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="order-2 md:order-1 space-y-3">
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                    <span className="text-[10px] font-mono text-rose-700 font-bold">BEFORE (Score: 58)</span>
                    <p className="text-zinc-600 line-through text-[11px] leading-relaxed">
                      &ldquo;Helped improve page load times by optimizing bundle sizes and implementing lazy loading.&rdquo;
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between font-mono text-[10px] text-emerald-700 font-bold">
                      <span>AFTER (Score: 96) — Google XYZ</span>
                      <span className="text-emerald-700 font-bold">+38 Pts</span>
                    </div>
                    <p className="text-zinc-950 text-xs leading-relaxed font-medium">
                      &ldquo;Engineered bundle-splitting in Next.js, slashing LCP by <strong className="text-emerald-700 underline">42% (3.2s → 1.85s)</strong> and lifting checkout conversion by <strong className="text-emerald-700 underline">$1.4M annually</strong>.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="order-1 md:order-2 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                    STAR Method Bullet Point Rewriter
                  </h3>
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                    Passive bullets get skipped. Hirely rewrites your experience using the <strong>Google XYZ framework</strong>: <em>Accomplished [X], as measured by [Y], by doing [Z]</em>.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Injected quantifiable latency, scale & revenue metrics</span>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Feature 3: Undetectable Parsability */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard
                id="undetectability"
                className="scroll-mt-32 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                    Undetectable in every way
                  </h3>
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                    Suite of parsing safeguards to pass through Workday, Taleo, and Greenhouse without a trace.
                  </p>
                  <div className="space-y-2 text-xs font-mono text-zinc-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>0 bot flags, 0 invisible tables, 0 parsing corruption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Clean single-column AST text hierarchy</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs font-mono shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 text-zinc-500">
                    <span>ATS PARSE RELIABILITY</span>
                    <span className="text-emerald-600 font-bold">100% CLEAN AST</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                      <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Multi-Column Design
                      </span>
                      <p className="text-zinc-600 text-[10px]">
                        Scrambles reading dates into corrupted tokens in Taleo.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Single-Column Flow
                      </span>
                      <p className="text-zinc-700 text-[10px]">
                        100% linear semantic parse rate across all major engines.
                      </p>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Feature 4: Match Score Engine */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard
                id="match-score"
                className="scroll-mt-32 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                  <ScoreGauge score={94} size={150} />
                  <div className="w-full grid grid-cols-2 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-lg bg-white border border-zinc-200/80 shadow-2xs">
                      <span className="text-zinc-400 block text-[10px]">Hard Skills</span>
                      <span className="text-emerald-600 font-bold">96 / 100</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-zinc-200/80 shadow-2xs">
                      <span className="text-zinc-400 block text-[10px]">Formatting</span>
                      <span className="text-blue-600 font-bold">98 / 100</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                    5-Vector ATS Match Score Engine
                  </h3>
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                    Hirely provides an objective candidate scorecard across 5 critical dimensions: Keyword Alignment, Hard Skill Density, Quantified STAR Metrics, Layout Parsability, and Role Context.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={onTryDemo}
                      className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <span>Test Your Resume Score</span>
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
