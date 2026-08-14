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

interface FeatureScrollSpyProps {}

const SECTIONS = [
  { id: "keywords", label: "Keyword Extraction" },
  { id: "star-rewriter", label: "STAR Bullet Rewriter" },
  { id: "undetectability", label: "Undetectable Parsability" },
  { id: "match-score", label: "Match Score Engine" },
];

export function FeatureScrollSpy({}: FeatureScrollSpyProps = {}) {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-sky-600 text-xs font-sans font-medium shadow-2xs">
            <Cpu className="w-3.5 h-3.5" />
            Deep ATS Capabilities
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
              <span className="block text-xs font-sans font-semibold text-zinc-400 mb-3 px-2">
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
                            ? "bg-sky-500 scale-100 opacity-100 shadow-xs"
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
                <a
                  href="#hero"
                  className="w-full py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-100" />
                  Try Scanner
                </a>
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
                className="scroll-mt-32 p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Text */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                      Keyword & Skill Density Heatmap
                    </h3>
                    <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                      ATS parsers score candidates based on exact phrase frequency and synonym equivalence. Hirely extracts both hard skills and soft traits, exposing missing terms instantly.
                    </p>
                    <div className="space-y-2 pt-2 text-sm font-sans text-zinc-600">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Exact frequency counts vs target job description</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: White Widget Box */}
                  <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 font-sans text-xs shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200/70">
                      <div>
                        <span className="text-xs font-semibold text-zinc-900 block">Keyword Match Matrix</span>
                        <span className="text-[11px] text-zinc-500 font-normal">Scored against job requirements</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/60">
                        12 / 14 Matched
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/80 flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          <span className="text-zinc-800 font-medium text-xs">TypeScript & React</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
                          4x Found (Optimal)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/80 flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          <span className="text-zinc-800 font-medium text-xs">PostgreSQL / Redis</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
                          2x Found
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-200/70 flex items-center justify-between shadow-2xs hover:border-rose-300 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                          <span className="text-rose-900 font-medium text-xs">Kafka & Event Architecture</span>
                        </div>
                        <span className="text-xs font-semibold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-md border border-rose-200/60">
                          Missing — Priority
                        </span>
                      </div>
                    </div>
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
                className="scroll-mt-32 p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Text Content */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                      STAR Method Bullet Point Rewriter
                    </h3>
                    <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                      Passive bullets get skipped. Hirely rewrites your experience using the <strong>Google XYZ framework</strong>: <em>Accomplished [X], as measured by [Y], by doing [Z]</em>.
                    </p>
                    <div className="flex items-center gap-2.5 text-sm font-sans text-zinc-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Injected quantifiable latency, scale & revenue metrics</span>
                    </div>
                  </div>

                  {/* Right Column: White Comparison Cards Widget */}
                  <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 font-sans text-xs shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200/70">
                      <div>
                        <span className="text-xs font-semibold text-zinc-900 block">STAR Method Optimization</span>
                        <span className="text-[11px] text-zinc-500 font-normal">Google XYZ framework</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/60">
                        +38 Pts
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                            Original Bullet
                          </span>
                          <span className="text-[11px] font-medium text-zinc-500 bg-white border border-zinc-200/70 px-2 py-0.5 rounded-md">
                            Score: 58
                          </span>
                        </div>
                        <p className="text-zinc-500 text-xs leading-relaxed font-normal">
                          &ldquo;Helped improve page load times by optimizing bundle sizes and implementing lazy loading.&rdquo;
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            STAR Optimized
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            Score: 96
                          </span>
                        </div>
                        <p className="text-zinc-800 text-xs leading-relaxed font-normal">
                          &ldquo;Engineered bundle-splitting in Next.js, slashing LCP by <strong className="font-semibold text-zinc-950 underline decoration-zinc-300">42% (3.2s → 1.85s)</strong> and lifting checkout conversion by <strong className="font-semibold text-zinc-950 underline decoration-zinc-300">$1.4M annually</strong>.&rdquo;
                        </p>
                      </div>
                    </div>
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
                className="scroll-mt-32 p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Text */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                      Undetectable in every way
                    </h3>
                    <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                      Suite of parsing safeguards to pass through Workday, Taleo, and Greenhouse without a trace.
                    </p>
                    <div className="space-y-2 text-sm font-sans text-zinc-600">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>0 bot flags, 0 invisible tables, 0 parsing corruption</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Clean single-column AST text hierarchy</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: White ATS Reliability Box */}
                  <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 font-sans text-xs shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200/70">
                      <div>
                        <span className="text-xs font-semibold text-zinc-900 block">ATS Parse Reliability</span>
                        <span className="text-[11px] text-zinc-500 font-normal">Tested across enterprise engines</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/60">
                        100% Clean AST
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1.5 shadow-2xs">
                        <span className="text-xs text-zinc-800 font-semibold flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-500" /> Multi-Column
                        </span>
                        <p className="text-zinc-500 text-xs leading-relaxed">
                          Scrambles reading dates into corrupted tokens in Taleo.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1.5 shadow-2xs">
                        <span className="text-xs text-zinc-800 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Single-Column
                        </span>
                        <p className="text-zinc-500 text-xs leading-relaxed">
                          100% linear semantic parse rate across all major engines.
                        </p>
                      </div>
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
                className="scroll-mt-32 p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Text Content */}
                  <div className="lg:col-span-6 space-y-4">
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
                      <a
                        href="#hero"
                        className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors inline-flex items-center gap-2 shadow-md shadow-sky-500/20"
                      >
                        <span>Scan Your Resume</span>
                        <Sparkles className="w-3.5 h-3.5 text-sky-100" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column: White Score Gauge & Cards */}
                  <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <ScoreGauge score={94} size={150} />
                    <div className="w-full grid grid-cols-2 gap-2.5 text-center text-xs font-sans">
                      <div className="p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200/80 shadow-2xs">
                        <span className="text-zinc-500 block text-xs font-medium">Hard Skills</span>
                        <span className="text-emerald-700 font-semibold text-sm">96 / 100</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200/80 shadow-2xs">
                        <span className="text-zinc-500 block text-xs font-medium">Formatting</span>
                        <span className="text-sky-700 font-semibold text-sm">98 / 100</span>
                      </div>
                    </div>
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
