"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Share2,
  Download,
  ThumbsUp,
  ThumbsDown,
  Info,
  X,
  ChevronRight,
  ChevronDown,
  Lock,
  CheckCircle2,
  RotateCw,
  Plus,
  Compass,
  FileText,
  Layers,
  ShieldCheck,
  Award,
  FileDown,
  Printer,
  FileCode,
  PlusCircle,
  FolderPlus,
} from "lucide-react";
import { ATSScanResult, ATSContentAddition } from "@/lib/mockData";
import { ScoreGauge } from "../ui/ScoreGauge";
import { exportToPrintablePDF, exportToWordDoc, exportATSAuditReport } from "@/lib/utils";

interface DiagnosticPanelProps {
  result: ATSScanResult | null;
  isLoading: boolean;
  onRescan: () => void;
  onApplyImprovement?: (original: string, improved: string) => void;
  onInsertKeyword?: (keyword: string) => void;
  onInsertAddition?: (addition: ATSContentAddition) => void;
  onExportReport?: () => void;
  onApplyAllImprovements?: () => void;
  onToggleHighlightView?: () => void;
  documentContent?: string;
  documentName?: string;
}

const SCAN_STEPS = [
  "Step 1/4: Ingesting single-column text AST...",
  "Step 2/4: Cross-referencing 500+ ATS skill ontologies...",
  "Step 3/4: Benchmarking against Top 1% candidate profiles...",
  "Step 4/4: Analyzing missing role sections & executive rewrites...",
];

export function DiagnosticPanel({
  result,
  isLoading,
  onRescan,
  onApplyImprovement,
  onInsertKeyword,
  onInsertAddition,
  onExportReport,
  onApplyAllImprovements,
  onToggleHighlightView,
  documentContent = "",
  documentName = "My_Resume.pdf",
}: DiagnosticPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "basic" | "benchmark" | "keywords" | "rewrites" | "additions" | "format"
  >("basic");
  const [showNotice1, setShowNotice1] = useState(true);
  const [showNotice2, setShowNotice2] = useState(true);
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [thumbsGiven, setThumbsGiven] = useState<"up" | "down" | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Cycle through scanning step messages while loading
  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % SCAN_STEPS.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <aside className="w-full lg:w-[460px] border-l border-zinc-200 bg-white flex flex-col items-center justify-center p-8 text-center space-y-5 flex-shrink-0">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-3 border-zinc-200 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-semibold text-zinc-900 font-sans">
            Hirely ATS Diagnostic in Progress...
          </h4>
          <p className="text-xs font-mono text-blue-700 bg-blue-50 px-3 py-1 rounded-full inline-block border border-blue-100 animate-pulse">
            {SCAN_STEPS[stepIndex]}
          </p>
        </div>
        <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
          Simulating Workday, Taleo, and Greenhouse filters with Gemini AI.
        </p>
      </aside>
    );
  }

  if (!result) {
    return (
      <aside className="w-full lg:w-[460px] border-l border-zinc-200 bg-white flex flex-col items-center justify-center p-8 text-center text-zinc-400 text-xs flex-shrink-0">
        No scan results available.
      </aside>
    );
  }

  const benchmark = result.industryBenchmark;
  const missingKeywords = result.keywords?.missing || [];
  const bulletImprovements = result.bulletImprovements || [];
  const recommendedAdditions = result.recommendedAdditions || [];

  const handleExportPDF = () => {
    setExportMenuOpen(false);
    exportToPrintablePDF(documentContent, documentName);
  };

  const handleExportDOCX = () => {
    setExportMenuOpen(false);
    exportToWordDoc(documentContent, documentName);
  };

  const handleExportTXT = () => {
    setExportMenuOpen(false);
    const blob = new Blob([documentContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ATS_Optimized_${documentName.replace(/\.[^/.]+$/, "")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportReportCard = () => {
    setExportMenuOpen(false);
    if (result) {
      exportATSAuditReport(result, documentName);
    }
  };

  return (
    <aside className="w-full lg:w-[460px] border-l border-zinc-200 bg-white flex flex-col justify-between flex-shrink-0 overflow-hidden font-sans select-none">
      {/* 1. Top Tab Bar */}
      <div className="border-b border-zinc-200 bg-white px-2 flex items-center gap-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab("basic")}
          className={`py-3 px-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "basic"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin-slow" />
          <span>Basic Scan</span>
        </button>

        <button
          onClick={() => setActiveTab("additions")}
          className={`py-3 px-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "additions"
              ? "border-purple-600 text-purple-600 font-semibold"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-purple-600" />
          <span>Role Gaps</span>
          {recommendedAdditions.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
              {recommendedAdditions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("rewrites")}
          className={`py-3 px-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "rewrites"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-sky-500" />
          <span>Rewrites</span>
          {bulletImprovements.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
              {bulletImprovements.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("keywords")}
          className={`py-3 px-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "keywords"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Keywords</span>
          {missingKeywords.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
              {missingKeywords.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("benchmark")}
          className={`py-3 px-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "benchmark"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-blue-500" />
          <span>Benchmark</span>
        </button>

        <button
          onClick={() => setActiveTab("format")}
          className={`py-3 px-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "format"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Format</span>
        </button>
      </div>

      {/* Main Body Content */}
      <div className="flex-1 p-4 lg:p-5 overflow-y-auto space-y-4">
        {/* Subheader: Title, Feedback & Share/Export Dropdown */}
        <div className="flex items-center justify-between pb-1 relative">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900">
              {activeTab === "basic" && "Basic Scan"}
              {activeTab === "additions" && "Role Gaps & Suggested Additions"}
              {activeTab === "rewrites" && "Executive Bullet Rewrites"}
              {activeTab === "keywords" && "ATS Keyword Match"}
              {activeTab === "benchmark" && "Top 1% Role Benchmark"}
              {activeTab === "format" && "Format & Parsability Audit"}
            </h3>
            <div className="flex items-center gap-1 text-zinc-400">
              <button
                onClick={() => setThumbsGiven(thumbsGiven === "up" ? null : "up")}
                className={`p-1 rounded hover:text-zinc-700 ${thumbsGiven === "up" ? "text-blue-600" : ""}`}
                title="Helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThumbsGiven(thumbsGiven === "down" ? null : "down")}
                className={`p-1 rounded hover:text-zinc-700 ${thumbsGiven === "down" ? "text-rose-600" : ""}`}
                title="Needs Improvement"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Hirely Studio link copied to clipboard!");
              }}
              className="px-2.5 py-1 rounded-md border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <Share2 className="w-3 h-3 text-zinc-500" />
              <span>Share</span>
            </button>

            {/* Multi-Format Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl py-1.5 z-40 text-xs font-sans animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold text-zinc-400 uppercase">
                    Download Resume
                  </div>
                  <button
                    onClick={handleExportPDF}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50/60 text-zinc-800 flex items-center gap-2 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Clean ATS PDF / Print</p>
                      <span className="text-[10px] text-zinc-400">Single-column layout</span>
                    </div>
                  </button>

                  <button
                    onClick={handleExportDOCX}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50/60 text-zinc-800 flex items-center gap-2 transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Word Document (.doc)</p>
                      <span className="text-[10px] text-zinc-400">Standard Microsoft Word</span>
                    </div>
                  </button>

                  <button
                    onClick={handleExportTXT}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50/60 text-zinc-800 flex items-center gap-2 transition-colors"
                  >
                    <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                    <div>
                      <p className="font-semibold">Plain Text (.txt)</p>
                      <span className="text-[10px] text-zinc-400">Raw normalized string</span>
                    </div>
                  </button>

                  <div className="border-t border-zinc-100 my-1" />

                  <button
                    onClick={handleExportReportCard}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50/60 text-zinc-800 flex items-center gap-2 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-purple-900">ATS Audit Report Card</p>
                      <span className="text-[10px] text-zinc-400">Printable score summary</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TAB 1: BASIC SCAN */}
        {activeTab === "basic" && (
          <div className="space-y-4">
            {/* Notice Banner 1 */}
            {showNotice1 && benchmark && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-950 text-xs space-y-1.5 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Detected Profession: {benchmark.detectedProfession}</span>
                  </div>
                  <button
                    onClick={() => setShowNotice1(false)}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-zinc-600 pl-6 leading-relaxed">
                  We benchmarked this draft against top 1% standard resumes from {benchmark.detectedProfession} applicants.
                </p>
              </div>
            )}

            {/* Role Additions Alert */}
            {recommendedAdditions.length > 0 && (
              <div
                onClick={() => setActiveTab("additions")}
                className="p-3 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-50 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-purple-950">
                      Missing {recommendedAdditions[0].title}
                    </p>
                    <span className="text-[11px] text-purple-700">
                      Click to review & insert missing role sections (+{recommendedAdditions.reduce((acc, a) => acc + (a.impactPoints || 10), 0)} pts)
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
              </div>
            )}

            {/* Main Score Assessment Card */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <ScoreGauge score={result.overallScore} size={76} strokeWidth={5} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-700">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    </div>
                    <span className="font-semibold text-zinc-900">Hirely ATS Assessment</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-mono border border-blue-200">
                      Live AI Engine
                    </span>
                  </div>
                  <h4 className="text-xs text-zinc-800 leading-snug">
                    We are <strong>highly confident</strong> this resume is{" "}
                    <span className="text-zinc-950 font-semibold underline decoration-blue-600 decoration-2 underline-offset-2">
                      {result.overallScore >= 80 ? "ATS Ready" : "Partially Optimized"}
                    </span>{" "}
                    <Info className="w-3 h-3 inline text-zinc-400" />
                  </h4>
                </div>
              </div>

              {/* Chance Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-zinc-500 block">
                  Chance this entire resume is...
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-2.5 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-700 font-medium flex items-center gap-1.5 shadow-2xs hover:border-blue-300 transition-colors">
                    <span>Top 1%</span>
                    <span className="font-semibold text-blue-700">
                      {benchmark?.industryPercentile ? `${benchmark.industryPercentile}%` : "18%"}
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </div>

                  <div className="px-2.5 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-700 font-medium flex items-center gap-1.5 shadow-2xs hover:border-blue-300 transition-colors">
                    <span>Interview Ready</span>
                    <span className="font-semibold text-blue-700">
                      {result.overallScore}%
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </div>

                  <div className="px-2.5 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-700 font-medium flex items-center gap-1.5 shadow-2xs hover:border-blue-300 transition-colors">
                    <span>Needs Tuning</span>
                    <span className="font-semibold text-zinc-900">
                      {Math.max(0, 100 - result.overallScore)}%
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sentence Highlighting Action Box */}
            <div
              onClick={() => setActiveTab("rewrites")}
              className="p-3 rounded-xl border border-zinc-200 bg-white hover:bg-blue-50/40 hover:border-blue-200 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2.5 text-xs text-zinc-800 font-medium">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>
                  {bulletImprovements.length > 0
                    ? `See sentence highlighting (${bulletImprovements.length} remaining)`
                    : "Sentence highlighting (All resolved!)"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Ways to improve this draft section */}
            <div className="space-y-2 pt-1">
              <span className="text-xs text-zinc-500 font-medium block">
                Ways to improve this draft
              </span>

              {/* Action Row: Missing Additions */}
              {recommendedAdditions.length > 0 && (
                <div
                  onClick={() => setActiveTab("additions")}
                  className="p-3 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="text-xs text-purple-950 font-medium">
                    Add missing role sections ({recommendedAdditions.length} recommended)
                  </span>
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                    +{recommendedAdditions[0].impactPoints}
                  </span>
                </div>
              )}

              {/* Action Row 1: Bullet Rewrites */}
              {bulletImprovements.length > 0 ? (
                <div
                  onClick={() => setActiveTab("rewrites")}
                  className="p-3 rounded-xl border border-zinc-200 bg-white hover:bg-blue-50/40 hover:border-blue-200 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="text-xs text-zinc-800 font-medium">
                    Upgrade action verbs & clarity ({bulletImprovements.length} bullets)
                  </span>
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs text-emerald-800 font-medium shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    All executive rewrites applied
                  </span>
                </div>
              )}

              {/* Action Row 2: Keyword Gaps */}
              {missingKeywords.length > 0 ? (
                <div
                  onClick={() => setActiveTab("keywords")}
                  className="p-3 rounded-xl border border-zinc-200 bg-white hover:bg-blue-50/40 hover:border-blue-200 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="text-xs text-zinc-800 font-medium">
                    Correct keyword gaps ({missingKeywords.length} missing)
                  </span>
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs text-emerald-800 font-medium shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    All target keywords incorporated
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ROLE GAPS & RECOMMENDED ADDITIONS */}
        {activeTab === "additions" && (
          <div className="space-y-3">
            {recommendedAdditions.length === 0 ? (
              <div className="p-6 rounded-xl border border-zinc-200 bg-white text-center space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-semibold text-zinc-900">
                  All Essential Role Content Present!
                </h5>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Your CV includes all essential technical tools, core competency clusters, and section structures standard for {benchmark?.detectedProfession || "this role"}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <span className="text-xs font-semibold text-zinc-900 block">
                      Missing Content & Sections ({recommendedAdditions.length})
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Standard industry sections missing from your draft
                    </span>
                  </div>
                </div>

                {recommendedAdditions.map((addition, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-purple-100 bg-white space-y-2.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[10px] uppercase tracking-wider border border-purple-200">
                        {addition.category === "missing_tools"
                          ? "Technical Tools Gap"
                          : addition.category === "missing_section"
                          ? "Missing Section"
                          : addition.category === "missing_scope"
                          ? "Responsibility Gap"
                          : "Certification Gap"}
                      </span>
                      <span className="text-purple-700 font-bold text-[11px]">
                        +{addition.impactPoints || 12} pts
                      </span>
                    </div>

                    <div>
                      <h5 className="font-semibold text-zinc-900 text-xs">
                        {addition.title}
                      </h5>
                      <p className="text-[11px] text-zinc-600 leading-relaxed mt-0.5">
                        {addition.whyNeeded}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1 font-mono text-[11px] text-zinc-800">
                      <span className="text-[10px] font-bold text-zinc-500 block uppercase">
                        Suggested Content:
                      </span>
                      <div className="font-bold text-zinc-900">{addition.suggestedHeading}</div>
                      <div className="whitespace-pre-line text-zinc-700 font-sans text-xs">
                        {addition.suggestedContent}
                      </div>
                    </div>

                    <button
                      onClick={() => onInsertAddition?.(addition)}
                      className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert into CV (+{addition.impactPoints || 12} pts)</span>
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* TAB 3: EXECUTIVE BULLET REWRITES */}
        {activeTab === "rewrites" && (
          <div className="space-y-3">
            {bulletImprovements.length === 0 ? (
              <div className="p-6 rounded-xl border border-zinc-200 bg-white text-center space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-semibold text-zinc-900">
                  All Rewrites Applied!
                </h5>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  All weak experience bullets have been updated with executive action verbs and streamlined structure.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-zinc-900">
                    Executive Action Rewrites ({bulletImprovements.length})
                  </span>
                  <button
                    onClick={onApplyAllImprovements}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-2xs"
                  >
                    Apply All Rewrites
                  </button>
                </div>

                {bulletImprovements.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-2 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between font-medium text-zinc-900">
                      <span>{bullet.section}</span>
                      <span className="text-blue-700 font-semibold text-[11px]">
                        +{bullet.scoreAfter - bullet.scoreBefore} pts
                      </span>
                    </div>

                    <div className="p-2 rounded bg-rose-50/70 text-zinc-700 text-[11px]">
                      <span className="text-[10px] text-rose-700 font-semibold block">
                        ORIGINAL (PASSIVE)
                      </span>
                      {bullet.original}
                    </div>

                    <div className="p-2.5 rounded bg-blue-50/80 border border-blue-100 text-zinc-900 text-xs">
                      <span className="text-[10px] text-blue-700 font-semibold block mb-0.5">
                        EXECUTIVE REWRITE
                      </span>
                      {bullet.improved}
                    </div>

                    <p className="text-[11px] text-zinc-500 italic">
                      {bullet.explanation}
                    </p>

                    <button
                      onClick={() => onApplyImprovement?.(bullet.original, bullet.improved)}
                      className="w-full py-1.5 rounded-lg border border-zinc-200 hover:bg-blue-50/50 hover:border-blue-200 text-zinc-800 font-medium text-xs transition-colors"
                    >
                      Apply to Document
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* TAB 4: KEYWORDS */}
        {activeTab === "keywords" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-rose-700 block">
                Missing Keywords ({missingKeywords.length})
              </span>
              {missingKeywords.length === 0 ? (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  <p className="text-xs font-semibold text-emerald-900">
                    All Critical Keywords Added!
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Your skills section matches target ATS keywords.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {missingKeywords.map((kw, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl border border-zinc-200 bg-white flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="font-medium text-zinc-900">{kw.name}</span>
                      </div>
                      <button
                        onClick={() => onInsertKeyword?.(kw.name)}
                        className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200">
              <span className="text-xs font-semibold text-blue-700 block">
                Detected Matching Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords?.found?.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 text-xs flex items-center gap-1.5"
                  >
                    <span>{kw.name}</span>
                    <span className="text-[10px] text-blue-600 font-mono">
                      {kw.count}x
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INDUSTRY BENCHMARK */}
        {activeTab === "benchmark" && (
          <div className="space-y-4">
            {benchmark ? (
              <>
                <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Industry Benchmark
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                      {benchmark.seniorityLevel}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-zinc-900">
                    {benchmark.detectedProfession}
                  </h4>

                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-600">Peer Percentile Rank:</span>
                      <span className="text-blue-600 font-semibold">
                        Top {100 - benchmark.industryPercentile}% of Applicants
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${benchmark.industryPercentile}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Top Tier Standards */}
                <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2 shadow-2xs">
                  <span className="text-xs font-semibold text-zinc-900 block">
                    Top 1% Standard Requirements for this Role
                  </span>
                  <ul className="space-y-2 text-xs text-zinc-700">
                    {benchmark.topTierStandards?.map((std, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{std}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Comparison Matrix */}
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500 font-medium block">
                    Candidate vs Top 1% Standard Matrix
                  </span>
                  {benchmark.candidateComparison?.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 bg-white space-y-1.5 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-900">
                          {comp.dimension}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                            comp.status === "exceeds"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : comp.status === "meets"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {comp.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600">
                        <strong>Your CV:</strong> {comp.candidateStatus}
                      </p>
                      <p className="text-[11px] text-zinc-800">
                        <strong>Top 1% Standard:</strong> {comp.topTierStandard}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-xs text-zinc-400">
                Benchmark data will load on next scan.
              </div>
            )}
          </div>
        )}

        {/* TAB 6: FORMAT AUDIT */}
        {activeTab === "format" && (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-900 block">
              Single-Column Parsability Report
            </span>

            {result.formatAudit?.issues?.map((issue, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-1 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    {issue.title}
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

      {/* 3. Bottom Sticky Bar */}
      <div className="p-3.5 border-t border-zinc-200 bg-white flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
            Text up-to-date
          </span>
          <p className="text-[11px] text-zinc-500">
            All edits sync with single-column AST
          </p>
        </div>

        <button
          onClick={onRescan}
          className="px-3.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <RotateCw className="w-3 h-3 text-blue-600" />
          <span>Re-scan ATS</span>
        </button>
      </div>
    </aside>
  );
}
