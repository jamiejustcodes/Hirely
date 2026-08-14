"use client";

import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Layers,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCw,
  Share2,
  Download,
  Plus,
  Zap,
} from "lucide-react";
import { ATSScanResult, ATSBulletImprovement } from "@/lib/mockData";
import { ScoreGauge } from "../ui/ScoreGauge";

interface DiagnosticPanelProps {
  result: ATSScanResult | null;
  isLoading: boolean;
  onRescan: () => void;
  onApplyImprovement?: (original: string, improved: string) => void;
  onInsertKeyword?: (keyword: string) => void;
  onExportReport?: () => void;
}

export function DiagnosticPanel({
  result,
  isLoading,
  onRescan,
  onApplyImprovement,
  onInsertKeyword,
  onExportReport,
}: DiagnosticPanelProps) {
  const [activeTab, setActiveTab] = useState<"score" | "keywords" | "rewrites" | "format">("score");
  const [showSentenceHighlights, setShowSentenceHighlights] = useState(true);

  if (isLoading) {
    return (
      <aside className="w-96 lg:w-[420px] border-l border-zinc-200 bg-white flex flex-col items-center justify-center p-8 text-center space-y-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-full border-3 border-zinc-200 border-t-blue-600 animate-spin" />
        <h4 className="text-sm font-bold text-zinc-950 font-sans">
          Auditing CV against ATS Models...
        </h4>
        <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
          Evaluating keyword frequency, single-column reading trees, and calculating Google XYZ metrics.
        </p>
      </aside>
    );
  }

  if (!result) {
    return (
      <aside className="w-96 lg:w-[420px] border-l border-zinc-200 bg-white flex flex-col items-center justify-center p-8 text-center text-zinc-400 text-xs flex-shrink-0">
        No scan results available.
      </aside>
    );
  }

  return (
    <aside className="w-96 lg:w-[440px] border-l border-zinc-200 bg-zinc-50/50 flex flex-col justify-between flex-shrink-0 overflow-hidden">
      {/* Top Header Tabs (GPTZero Style) */}
      <div className="px-4 border-b border-zinc-200 bg-white flex items-center gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("score")}
          className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "score"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Basic Scan
        </button>

        <button
          onClick={() => setActiveTab("keywords")}
          className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "keywords"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Keywords
          {result.keywords?.missing?.length ? (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
              {result.keywords.missing.length}
            </span>
          ) : null}
        </button>

        <button
          onClick={() => setActiveTab("rewrites")}
          className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "rewrites"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          STAR Rewriter
        </button>

        <button
          onClick={() => setActiveTab("format")}
          className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "format"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Format
        </button>
      </div>

      {/* Main Assistant Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {/* Top Share / Export Bar */}
        <div className="flex items-center justify-between text-xs pb-1">
          <span className="font-bold text-zinc-950 font-sans">
            ATS Diagnostic Assessment
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportReport}
              className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 flex items-center gap-1 font-mono text-[11px]"
            >
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>

        {/* TAB 1: SCORE & OVERVIEW */}
        {activeTab === "score" && (
          <div className="space-y-5">
            {/* Main Score Box (GPTZero Classification Card) */}
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <ScoreGauge score={result.overallScore} size={110} />
                </div>
                <div className="space-y-1 text-left">
                  <div className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 font-mono">
                    {result.grade}
                  </div>
                  <h4 className="text-sm font-bold text-zinc-950 font-sans leading-tight">
                    Recruiter Screening Match
                  </h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Estimated 88% probability of passing initial Workday & Taleo filters.
                  </p>
                </div>
              </div>

              {/* Vector Probability Pills */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 text-center font-mono text-[10px]">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span className="text-zinc-400 block">Keywords</span>
                  <span className="text-emerald-700 font-bold text-xs">
                    {result.categoryScores?.keywordMatch || 84}%
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span className="text-zinc-400 block">Hard Skills</span>
                  <span className="text-blue-700 font-bold text-xs">
                    {result.categoryScores?.hardSkills || 88}%
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span className="text-zinc-400 block">Format</span>
                  <span className="text-purple-700 font-bold text-xs">
                    {result.categoryScores?.formatting || 95}%
                  </span>
                </div>
              </div>
            </div>

            {/* Ways to Improve This CV (GPTZero Accordion Style) */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block px-1">
                Ways to Improve This CV
              </span>

              {/* Action 1: Replace Weak Bullets with STAR */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900 font-sans flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Inject Quantified STAR Metrics
                  </span>
                  <span className="text-[10px] text-blue-600 font-mono font-semibold">
                    {result.bulletImprovements?.length} Ready
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Transform passive phrases into Google XYZ formulas with latency & revenue metrics.
                </p>
                <button
                  onClick={() => setActiveTab("rewrites")}
                  className="w-full py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Review STAR Rewrites</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </button>
              </div>

              {/* Action 2: Keyword Gaps */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900 font-sans flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    Missing Critical Keywords
                  </span>
                  <span className="text-[10px] text-rose-600 font-mono font-bold">
                    {result.keywords?.missing?.length} Missing
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Add target competencies to bypass ATS automated keyword thresholds.
                </p>
                <button
                  onClick={() => setActiveTab("keywords")}
                  className="w-full py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Inspect Keyword Matrix</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KEYWORDS */}
        {activeTab === "keywords" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 block">
                Missing Keywords (Click to Insert into CV)
              </span>
              <div className="space-y-2">
                {result.keywords?.missing?.map((kw, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white border border-rose-200 flex items-center justify-between gap-2 text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="font-semibold text-zinc-900">{kw.name}</span>
                    </div>
                    <button
                      onClick={() => onInsertKeyword?.(kw.name)}
                      className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center gap-1 transition-colors"
                      title="Insert keyword into resume text"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">
                Verified Detected Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords?.found?.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-1 shadow-2xs"
                  >
                    <span>{kw.name}</span>
                    <span className="text-[9px] px-1 bg-emerald-100 rounded text-emerald-800 font-bold">
                      {kw.count}x
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STAR REWRITES */}
        {activeTab === "rewrites" && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 block">
              Quantified STAR Improvements
            </span>

            <div className="space-y-3">
              {result.bulletImprovements?.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-100">
                    <span className="font-bold text-zinc-900 font-sans">
                      {bullet.section}
                    </span>
                    <span className="text-emerald-700 font-bold font-mono text-[10px]">
                      +{bullet.scoreAfter - bullet.scoreBefore} pts
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-[11px] text-zinc-700">
                    <span className="text-[9px] font-mono font-bold text-rose-700 block mb-0.5">
                      ORIGINAL
                    </span>
                    {bullet.original}
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-zinc-950 font-medium">
                    <span className="text-[9px] font-mono font-bold text-emerald-700 block mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> STAR OPTIMIZED
                    </span>
                    {bullet.improved}
                  </div>

                  <button
                    onClick={() => onApplyImprovement?.(bullet.original, bullet.improved)}
                    className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Apply to Document</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FORMAT AUDIT */}
        {activeTab === "format" && (
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
              ATS Single-Column Health Audit
            </span>

            {result.formatAudit?.issues?.map((issue, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-zinc-200 space-y-1.5 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                    {issue.severity === "high" ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    ) : issue.severity === "medium" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    {issue.title}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                    {issue.severity}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  {issue.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar (GPTZero Style) */}
      <div className="p-4 border-t border-zinc-200 bg-white flex items-center justify-between gap-3">
        <div className="text-[11px] text-zinc-500 font-mono">
          <span>Gemini 2.5 Flash</span>
        </div>
        <button
          onClick={onRescan}
          disabled={isLoading}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Re-scan CV</span>
        </button>
      </div>
    </aside>
  );
}
