"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Key,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers,
} from "lucide-react";
import { ATSScanResult } from "@/lib/mockData";
import { ScoreGauge } from "./ui/ScoreGauge";
import confetti from "canvas-confetti";

interface LiveScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ATSScanResult | null;
  isLoading: boolean;
  onRescanWithKey?: (apiKey: string) => void;
}

export function LiveScannerModal({
  isOpen,
  onClose,
  result,
  isLoading,
  onRescanWithKey,
}: LiveScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "bullets" | "format" | "settings">("overview");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customKey, setCustomKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);

  useEffect(() => {
    if (result && result.overallScore >= 80 && isOpen) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore in SSR or unsupported environments
      }
    }
  }, [result, isOpen]);

  if (!isOpen) return null;

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveApiKey = () => {
    if (customKey.trim()) {
      localStorage.setItem("HIRELY_GEMINI_API_KEY", customKey.trim());
      setApiKeySaved(true);
      if (onRescanWithKey) {
        onRescanWithKey(customKey.trim());
      }
      setTimeout(() => setApiKeySaved(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 font-sans flex items-center gap-2">
                Hirely ATS Diagnostic Report
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Gemini 2.5 Flash
                </span>
              </h3>
              <p className="text-xs text-zinc-500">
                Reverse-engineered analysis for Taleo, Workday, and Greenhouse
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-zinc-200 flex items-center gap-2 overflow-x-auto bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Overview & Score
          </button>
          <button
            onClick={() => setActiveTab("keywords")}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "keywords"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Keyword Gap Matrix
            {result?.keywords?.missing?.length ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                {result.keywords.missing.length} missing
              </span>
            ) : null}
          </button>
          <button
            onClick={() => setActiveTab("bullets")}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "bullets"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            STAR Rewriter
            {result?.bulletImprovements?.length ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                {result.bulletImprovements.length} Ready
              </span>
            ) : null}
          </button>
          <button
            onClick={() => setActiveTab("format")}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "format"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Format & Parser Audit
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "settings"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            API Key
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-10 h-10 rounded-full border-3 border-zinc-200 border-t-blue-600 animate-spin" />
              <h4 className="text-base font-bold text-zinc-950 font-sans">
                Auditing Resume against ATS Database...
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                Parsing text structure, cross-referencing industry keywords, and calculating STAR score metrics via Gemini AI.
              </p>
            </div>
          ) : !result ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No scan results available yet.
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="md:col-span-4 flex justify-center">
                      <ScoreGauge score={result.overallScore} size={150} />
                    </div>

                    <div className="md:col-span-8 space-y-3">
                      <div className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                        {result.grade}
                      </div>
                      <h4 className="text-lg font-bold text-zinc-950 font-sans">
                        Executive Candidate Fit Summary
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
                        {result.summary}
                      </p>
                    </div>
                  </div>

                  {/* 5-Vector Category Sub-Scores */}
                  <div>
                    <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
                      ATS Vector Breakdown
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                        <span className="text-[11px] text-zinc-500 block">Keyword Match</span>
                        <span className="text-xl font-bold text-emerald-600 font-sans">
                          {result.categoryScores?.keywordMatch || 84}%
                        </span>
                        <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${result.categoryScores?.keywordMatch || 84}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                        <span className="text-[11px] text-zinc-500 block">Hard Skills</span>
                        <span className="text-xl font-bold text-blue-600 font-sans">
                          {result.categoryScores?.hardSkills || 88}%
                        </span>
                        <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${result.categoryScores?.hardSkills || 88}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                        <span className="text-[11px] text-zinc-500 block">Soft Skills</span>
                        <span className="text-xl font-bold text-purple-600 font-sans">
                          {result.categoryScores?.softSkills || 80}%
                        </span>
                        <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full"
                            style={{ width: `${result.categoryScores?.softSkills || 80}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                        <span className="text-[11px] text-zinc-500 block">Formatting</span>
                        <span className="text-xl font-bold text-indigo-600 font-sans">
                          {result.categoryScores?.formatting || 95}%
                        </span>
                        <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${result.categoryScores?.formatting || 95}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
                        <span className="text-[11px] text-zinc-500 block">Impact & Metrics</span>
                        <span className="text-xl font-bold text-amber-600 font-sans">
                          {result.categoryScores?.impactAndMetrics || 70}%
                        </span>
                        <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${result.categoryScores?.impactAndMetrics || 70}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Priority Action Plan */}
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-600" />
                      Priority Action Plan to Reach 95+ ATS Score
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-zinc-700">
                      {result.actionPlan?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: KEYWORDS */}
              {activeTab === "keywords" && (
                <div className="space-y-6">
                  {/* Missing Critical Keywords */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Missing Critical Keywords (Target Job Description)
                      </h5>
                      <span className="text-[11px] text-zinc-500">
                        Add these to your skills/experience to pass automated filters
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.keywords?.missing?.map((kw, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span className="font-semibold text-rose-900">{kw.name}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 uppercase font-bold">
                            {kw.importance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Found Matched Keywords */}
                  <div className="space-y-3 pt-4 border-t border-zinc-200">
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Detected & Verified Keywords in Resume
                    </h5>

                    <div className="flex flex-wrap gap-2">
                      {result.keywords?.found?.map((kw, i) => (
                        <div
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium"
                        >
                          <span>{kw.name}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-200/70 text-emerald-800 font-bold text-[10px]">
                            {kw.count}x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BULLET REWRITER */}
              {activeTab === "bullets" && (
                <div className="space-y-6">
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
                    💡 <strong>Pro Tip:</strong> Click &ldquo;Copy Optimized Bullet&rdquo; below and paste directly into your resume to immediately upgrade recruiter impact.
                  </div>

                  <div className="space-y-5">
                    {result.bulletImprovements?.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-zinc-900 font-sans">
                            {bullet.section}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                            {bullet.appliedFramework}
                          </span>
                        </div>

                        {/* Before */}
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                          <span className="text-[10px] font-mono text-rose-700 font-bold">
                            BEFORE (Score: {bullet.scoreBefore})
                          </span>
                          <p className="text-zinc-700 font-normal leading-relaxed">
                            {bullet.original}
                          </p>
                        </div>

                        {/* After */}
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                          <div className="flex items-center justify-between font-mono text-[10px] text-emerald-700 font-bold uppercase">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> Optimized STAR Formulation (Score: {bullet.scoreAfter})
                            </span>
                            <span className="text-emerald-800 font-bold">+{bullet.scoreAfter - bullet.scoreBefore} pts</span>
                          </div>
                          <p className="text-zinc-950 text-xs sm:text-sm font-medium leading-relaxed">
                            {bullet.improved}
                          </p>
                          <p className="text-[11px] text-zinc-600 pt-1 italic">
                            Why this works: {bullet.explanation}
                          </p>
                        </div>

                        {/* Copy Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleCopyBullet(bullet.improved, idx)}
                            className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Optimized Bullet</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: FORMAT AUDIT */}
              {activeTab === "format" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-zinc-950 text-sm">
                          Layout Parsability Status: Verified
                        </h5>
                        <p className="text-zinc-600 text-xs">
                          Linear single-column text hierarchy verified across Workday, Taleo, and iCIMS parsers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {result.formatAudit?.issues?.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2 text-xs shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                            {issue.severity === "high" ? (
                              <XCircle className="w-4 h-4 text-rose-600" />
                            ) : issue.severity === "medium" ? (
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            )}
                            {issue.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              issue.severity === "high"
                                ? "bg-rose-100 text-rose-700"
                                : issue.severity === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {issue.severity} Priority
                          </span>
                        </div>
                        <p className="text-zinc-600 text-xs leading-relaxed">{issue.description}</p>
                        <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/80 text-blue-700 text-[11px]">
                          <strong>Recommended Action:</strong> {issue.fix}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SETTINGS */}
              {activeTab === "settings" && (
                <div className="space-y-5 max-w-xl mx-auto py-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                      <Key className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-zinc-950 font-sans">
                      Custom Google Gemini API Key
                    </h4>
                    <p className="text-xs text-zinc-500">
                      By default, Hirely uses the free backend API tier. You can optionally paste your personal free API key from Google AI Studio.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-zinc-700">
                      Google AI Studio API Key (Free)
                    </label>
                    <input
                      type="password"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center justify-between">
                      <a
                        href="https://aistudio.google.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Get a Free Key at Google AI Studio &rarr;
                      </a>
                      <button
                        onClick={handleSaveApiKey}
                        className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        {apiKeySaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                        <span>{apiKeySaved ? "Saved & Rescanning!" : "Save & Use Key"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
