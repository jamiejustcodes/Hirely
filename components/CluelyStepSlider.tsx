"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Command,
  CheckCircle2,
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  FileCode2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "./SpotlightCard";
import { ScoreGauge } from "./ui/ScoreGauge";

interface StepData {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
}

const STEPS: StepData[] = [
  {
    id: 1,
    badge: "STEP 1: INGESTION",
    title: "Hirely reads & analyzes your resume",
    subtitle: "Picks up the exact context of your role in real time.",
    description:
      "Scans hard technical proficiencies, soft skills, and keyword frequencies against target job requirements.",
  },
  {
    id: 2,
    badge: "STEP 2: STAR REWRITE",
    title: "Assists you with AI in the moment",
    subtitle: "Hit ⌘ + Enter and transform passive bullets into quantified results.",
    description:
      "Automatically applies Google's XYZ formula (Accomplished [X] as measured by [Y] by doing [Z]).",
  },
  {
    id: 3,
    badge: "STEP 3: 100% PARSE RATE",
    title: "Undetectable in every way",
    subtitle: "Guaranteed single-column ATS parsability across enterprise platforms.",
    description:
      "Simulates Workday, Taleo, and Greenhouse reading orders to guarantee zero corrupted text frames.",
  },
];

export function CluelyStepSlider() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const STEP_DURATION_MS = 5000;
  const TICK_INTERVAL_MS = 50;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((step) => (step + 1) % STEPS.length);
          return 0;
        }
        return prev + (TICK_INTERVAL_MS / STEP_DURATION_MS) * 100;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused, activeStep]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
  };

  return (
    <section
      id="workflow"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#fafafa] text-zinc-950 relative overflow-hidden border-t border-b border-zinc-200/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200 text-blue-600 text-xs font-mono shadow-xs">
            <Cpu className="w-3.5 h-3.5" />
            HOW HIRELY WORKS
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight text-zinc-950 leading-[1.15]">
            Meeting AI that helps you pass screening before recruiters review.
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg font-sans leading-relaxed">
            Built from the ground up to reverse-engineer recruiter filters, score candidacy in real-time, and rewrite your bullets with executive polish.
          </p>
        </motion.div>

        {/* 3 Interactive Step Tab Selectors with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(idx)}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xs ${
                  isActive
                    ? "bg-white border-zinc-300 shadow-md ring-1 ring-blue-500/20"
                    : "bg-white/60 border-zinc-200 hover:border-zinc-300 hover:bg-white"
                }`}
              >
                {/* Top Progress Bar */}
                <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden absolute top-0 left-0 right-0">
                  <div
                    className="bg-blue-600 h-full transition-all duration-75 ease-linear"
                    style={{
                      width: isActive ? `${progress}%` : idx < activeStep ? "100%" : "0%",
                    }}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase">
                    {step.badge}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-950 font-sans leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                    {step.subtitle}
                  </p>
                </div>

                <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                  {isActive ? (
                    <span className="text-blue-600 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Active Demonstration
                    </span>
                  ) : (
                    <span>Click to inspect &rarr;</span>
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Active Step Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="p-6 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                    Real-time keyword & frequency ingestion
                  </h3>
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                    Hirely parses both hard technical proficiencies and soft leadership competencies, instantly exposing critical missing keywords before you apply.
                  </p>
                  <div className="space-y-2 pt-2 text-xs font-mono text-zinc-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Exact frequency counts vs target job description</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Categorization by Hard Skills, Tools, and Frameworks</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 font-mono text-xs shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 text-zinc-500">
                    <span>KEYWORD EXTRACTION MATRIX</span>
                    <span className="text-emerald-600 font-bold">12/14 Matched</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-between shadow-2xs">
                    <span className="text-zinc-800 font-semibold">TypeScript & Next.js</span>
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
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                    One-Click STAR Method Bullet Rewriter
                  </h3>
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                    Passive bullet points kill ATS ranking. Hirely automatically rewrites your experience using the <strong>Google XYZ framework</strong>: <em>Accomplished [X], as measured by [Y], by doing [Z]</em>.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Injected quantified revenue, latency, and scale benchmarks</span>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                    <span className="text-[10px] font-mono text-rose-700 font-bold">BEFORE (Score: 58)</span>
                    <p className="text-zinc-600 line-through">
                      &ldquo;Helped improve page load times by optimizing bundle sizes.&rdquo;
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-emerald-700 font-bold">
                      <span>AFTER (Score: 96) — Google XYZ</span>
                      <span className="text-emerald-700 font-bold">+38 Pts</span>
                    </div>
                    <p className="text-zinc-900 font-medium leading-relaxed">
                      &ldquo;Engineered bundle-splitting in Next.js, slashing LCP by <strong className="text-emerald-700 underline">42% (3.2s → 1.85s)</strong> and lifting checkout conversion by <strong className="text-emerald-700 underline">$1.4M annually</strong>.&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                    100% Undetectable & Compliant ATS Parse
                  </h3>
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                    Unlike broken two-column designs that choke older enterprise ATS platforms, Hirely formats your resume for clean, single-column semantic parsing across Taleo, Workday, and Greenhouse.
                  </p>
                  <div className="space-y-1.5 text-xs font-mono text-zinc-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>0 bot flags, 0 invisible tables, 0 parsing corruption</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 flex justify-center p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <ScoreGauge score={97} size={160} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
