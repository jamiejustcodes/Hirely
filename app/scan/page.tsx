"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { DocumentEditor } from "@/components/workspace/DocumentEditor";
import { DiagnosticPanel } from "@/components/workspace/DiagnosticPanel";
import { ATSScanResult, ATSContentAddition, SAMPLE_DATA } from "@/lib/mockData";
import { replaceBulletBlock, normalizeResumeText } from "@/lib/utils";
import {
  Sparkles,
  Key,
  Check,
  ArrowLeft,
  UploadCloud,
  X,
  FileText,
  Briefcase,
  Undo2,
  ChevronDown,
  RotateCw,
  LayoutTemplate,
  PieChart,
  ShieldAlert,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ScanWorkspacePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [documentName, setDocumentName] = useState("Uploaded_Resume.pdf");
  const [scanResult, setScanResult] = useState<ATSScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newScanModalOpen, setNewScanModalOpen] = useState(false);
  const [rateLimitModalOpen, setRateLimitModalOpen] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");
  const [jobDrawerOpen, setJobDrawerOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [mobileTab, setMobileTab] = useState<"editor" | "diagnostic">("editor");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Undo History Stack
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [undoToast, setUndoToast] = useState<{ visible: boolean; message: string } | null>(null);

  // Ingest data from sessionStorage on load
  useEffect(() => {
    try {
      const storedText = sessionStorage.getItem("HIRELY_SCAN_TEXT");
      const storedJd = sessionStorage.getItem("HIRELY_SCAN_JD") || "";
      const storedDocName = sessionStorage.getItem("HIRELY_SCAN_DOC_NAME") || "Alex_Morgan_Resume.pdf";
      const storedResult = sessionStorage.getItem("HIRELY_SCAN_RESULT");

      if (storedText) {
        const cleanText = normalizeResumeText(storedText);
        setContent(cleanText);
        setDocumentName(storedDocName);
        setJobDescription(storedJd);

        if (storedResult) {
          try {
            setScanResult(JSON.parse(storedResult));
          } catch (e) {
            handlePerformScan(cleanText, storedJd);
          }
        } else {
          handlePerformScan(cleanText, storedJd);
        }
      } else {
        // Default sample candidate
        const sample = SAMPLE_DATA.softwareEngineer;
        setContent(sample.resumeText);
        setJobDescription(sample.jobDescription);
        setDocumentName("Alex_Morgan_Software_Engineer_Resume.pdf");
        setScanResult(sample.mockResult);
      }
    } catch (err) {
      console.error("Error reading session storage:", err);
      const sample = SAMPLE_DATA.softwareEngineer;
      setContent(sample.resumeText);
      setScanResult(sample.mockResult);
    }
  }, []);

  const pushToHistory = (previousContent: string) => {
    setHistoryStack((prev) => [...prev.slice(-10), previousContent]);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setContent(previous);
    sessionStorage.setItem("HIRELY_SCAN_TEXT", previous);
    setUndoToast(null);
  };

  const handlePerformScan = async (textToScan: string, jdToScan: string) => {
    if (!textToScan || textToScan.trim().length < 15) return;
    setIsLoading(true);

    try {
      let savedKey = "";
      if (typeof window !== "undefined") {
        savedKey = localStorage.getItem("HIRELY_GEMINI_API_KEY") || "";
      }

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: textToScan,
          jobDescription: jdToScan,
          apiKey: savedKey,
          documentName: documentName,
        }),
      });

      if (response.status === 429) {
        const json = await response.json();
        setRateLimitMessage(json.error || "Daily limit of 3 scans per day per IP reached.");
        setRateLimitModalOpen(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Scan request failed");
      }

      const json = await response.json();
      setScanResult(json.data);
      if (json.extractedText) {
        const clean = normalizeResumeText(json.extractedText);
        setContent(clean);
        sessionStorage.setItem("HIRELY_SCAN_TEXT", clean);
      }
      sessionStorage.setItem("HIRELY_SCAN_RESULT", JSON.stringify(json.data));

      if (json.data?.overallScore >= 80) {
        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } catch (error) {
      console.error("Scan error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    setDocumentName(file.name);
    setNewScanModalOpen(false);
    setIsLoading(true);

    try {
      let savedKey = "";
      if (typeof window !== "undefined") {
        savedKey = localStorage.getItem("HIRELY_GEMINI_API_KEY") || "";
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);
      if (savedKey) formData.append("apiKey", savedKey);

      const response = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      if (response.status === 429) {
        const json = await response.json();
        setRateLimitMessage(json.error || "Daily limit of 3 scans per day per IP reached.");
        setRateLimitModalOpen(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        alert(json.error || "Could not parse text from this file. Please ensure it is a valid text-based PDF / Word document or paste text directly.");
        setIsLoading(false);
        return;
      }

      const json = await response.json();
      const extracted = normalizeResumeText(json.extractedText || "");
      setContent(extracted);
      setScanResult(json.data);
      sessionStorage.setItem("HIRELY_SCAN_TEXT", extracted);
      sessionStorage.setItem("HIRELY_SCAN_DOC_NAME", file.name);
      sessionStorage.setItem("HIRELY_SCAN_RESULT", JSON.stringify(json.data));
      setUndoToast({ visible: true, message: `Successfully analyzed "${file.name}"` });
      setTimeout(() => setUndoToast(null), 4000);
    } catch (err: any) {
      console.error("File upload scan error:", err);
      alert(err?.message || "An unexpected error occurred while scanning your resume file.");
    } finally {
      setIsLoading(false);
    }
  };

  // Full-bullet block replacement & immediate suggestion removal with Undo
  const handleApplyImprovement = (original: string, improved: string) => {
    if (!content) return;
    pushToHistory(content);

    const updated = replaceBulletBlock(content, original, improved);
    setContent(updated);
    sessionStorage.setItem("HIRELY_SCAN_TEXT", updated);

    // Show interactive undo toast
    setUndoToast({ visible: true, message: "STAR rewrite applied to document" });
    setTimeout(() => setUndoToast(null), 5000);

    if (scanResult) {
      const cleanOrig = original.replace(/^["'•\-* ]+/, "").trim().toLowerCase();
      const remaining = (scanResult.bulletImprovements || []).filter((b) => {
        const cleanB = b.original.replace(/^["'•\-* ]+/, "").trim().toLowerCase();
        return (
          b.original !== original &&
          !cleanB.includes(cleanOrig.slice(0, 20)) &&
          !cleanOrig.includes(cleanB.slice(0, 20))
        );
      });

      setScanResult({
        ...scanResult,
        overallScore: Math.min(99, scanResult.overallScore + 4),
        bulletImprovements: remaining,
        categoryScores: {
          ...scanResult.categoryScores,
          impactAndMetrics: Math.min(99, (scanResult.categoryScores?.impactAndMetrics || 70) + 6),
        },
      });
    }
  };

  // 1-Click apply ALL STAR improvements across entire resume
  const handleApplyAllImprovements = () => {
    if (!content || !scanResult?.bulletImprovements?.length) return;
    pushToHistory(content);

    let updated = content;
    scanResult.bulletImprovements.forEach((bullet) => {
      updated = replaceBulletBlock(updated, bullet.original, bullet.improved);
    });

    setContent(updated);
    sessionStorage.setItem("HIRELY_SCAN_TEXT", updated);

    setUndoToast({ visible: true, message: "All STAR rewrites applied to document" });
    setTimeout(() => setUndoToast(null), 6000);

    if (scanResult) {
      setScanResult({
        ...scanResult,
        overallScore: Math.min(99, scanResult.overallScore + 12),
        bulletImprovements: [],
        categoryScores: {
          ...scanResult.categoryScores,
          impactAndMetrics: 98,
        },
      });
    }
  };

  const handleInsertKeyword = (keyword: string) => {
    if (!content) return;
    pushToHistory(content);

    const skillsKeywords = ["TECHNICAL SKILLS:", "SKILLS:", "Skills:", "Technical Skills:"];
    let updated = content;
    let foundHeading = false;

    for (const heading of skillsKeywords) {
      if (content.includes(heading)) {
        updated = content.replace(heading, `${heading} ${keyword},`);
        foundHeading = true;
        break;
      }
    }

    if (!foundHeading) {
      updated = `${content}\n\n• Core Competencies: ${keyword}`;
    }

    setContent(updated);
    sessionStorage.setItem("HIRELY_SCAN_TEXT", updated);

    setUndoToast({ visible: true, message: `Added keyword: "${keyword}"` });
    setTimeout(() => setUndoToast(null), 4000);

    if (scanResult) {
      setScanResult({
        ...scanResult,
        overallScore: Math.min(99, scanResult.overallScore + 2),
        keywords: {
          ...scanResult.keywords,
          missing: scanResult.keywords.missing.filter((k) => k.name !== keyword),
          found: [
            ...(scanResult.keywords.found || []),
            { name: keyword, count: 1, category: "hard" },
          ],
        },
      });
    }
  };

  const handleInsertAddition = (addition: ATSContentAddition) => {
    if (!content) return;
    pushToHistory(content);

    const formattedBlock = `\n\n${addition.suggestedHeading.toUpperCase()}\n${addition.suggestedContent}`;
    const updated = `${content.trim()}${formattedBlock}`;

    setContent(updated);
    sessionStorage.setItem("HIRELY_SCAN_TEXT", updated);

    setUndoToast({
      visible: true,
      message: `Added "${addition.suggestedHeading}" section to CV`,
    });
    setTimeout(() => setUndoToast(null), 5000);

    if (scanResult) {
      const remaining = (scanResult.recommendedAdditions || []).filter(
        (a) => a.title !== addition.title
      );
      setScanResult({
        ...scanResult,
        overallScore: Math.min(99, scanResult.overallScore + (addition.impactPoints || 12)),
        recommendedAdditions: remaining,
        categoryScores: {
          ...scanResult.categoryScores,
          hardSkills: Math.min(99, (scanResult.categoryScores?.hardSkills || 75) + 6),
          keywordMatch: Math.min(99, (scanResult.categoryScores?.keywordMatch || 75) + 6),
        },
      });
    }
  };

  const handleSaveApiKey = () => {
    if (customApiKey.trim()) {
      localStorage.setItem("HIRELY_GEMINI_API_KEY", customApiKey.trim());
      setApiKeySaved(true);
      setTimeout(() => {
        setApiKeySaved(false);
        setSettingsOpen(false);
        handlePerformScan(content, jobDescription);
      }, 1000);
    }
  };

  return (
    <div className="h-[100dvh] w-screen bg-white text-zinc-950 flex flex-col overflow-hidden font-sans">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top Header Bar */}
      <header className="h-12 sm:h-13 border-b border-zinc-200 bg-white px-3 sm:px-4 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 text-xs font-medium px-2 py-1 rounded-md hover:bg-zinc-100 transition-colors flex-shrink-0"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Home</span>
          </Link>
          <div className="h-3.5 w-[1px] bg-zinc-200 flex-shrink-0" />
          <Link href="/" className="flex items-center gap-1.5 min-w-0">
            <img
              src="/hirelynav.png"
              alt="Hirely"
              className="h-4 sm:h-5 w-auto object-contain brightness-0 flex-shrink-0"
            />
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 font-normal truncate">/ studio</span>
          </Link>
        </div>

        {/* Right Header Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Target Role Drawer Toggle */}
          <button
            onClick={() => setJobDrawerOpen(!jobDrawerOpen)}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-colors border shadow-2xs ${
              jobDrawerOpen
                ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
            title="Target Job Description context"
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="hidden sm:inline">Target Role</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${jobDrawerOpen ? "rotate-180" : ""}`} />
          </button>

          {scanResult?.bulletImprovements?.length ? (
            <button
              onClick={handleApplyAllImprovements}
              className="px-2.5 sm:px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden xs:inline">Apply All</span>
              <span className="xs:hidden">All</span>
              <span>({scanResult.bulletImprovements.length})</span>
            </button>
          ) : null}

          <button
            onClick={() => setNewScanModalOpen(true)}
            className="px-2.5 sm:px-3 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-colors shadow-2xs"
            title="Upload new CV"
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="hidden xs:inline">Upload CV</span>
            <span className="xs:hidden">Upload</span>
          </button>

          {/* Mobile Settings Key Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="lg:hidden p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-950 transition-colors shadow-2xs"
            title="API Key Settings"
          >
            <Key className="w-3.5 h-3.5 text-zinc-600" />
          </button>
        </div>
      </header>

      {/* Dedicated Mobile Segment Tab Bar (Full-Width Switcher on < lg) */}
      <div className="flex lg:hidden items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-1.5 z-20 flex-shrink-0">
        <div className="w-full grid grid-cols-2 p-0.5 rounded-xl bg-zinc-200/70 border border-zinc-200 text-xs">
          <button
            onClick={() => setMobileTab("editor")}
            className={`py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === "editor"
                ? "bg-white text-zinc-950 shadow-xs font-bold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate">Document View</span>
          </button>
          <button
            onClick={() => setMobileTab("diagnostic")}
            className={`py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === "diagnostic"
                ? "bg-white text-zinc-950 shadow-xs font-bold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <PieChart className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate">ATS Score ({scanResult?.overallScore || 80}%)</span>
          </button>
        </div>
      </div>

      {/* In-Workspace Collapsible Target Job Description Drawer */}
      {jobDrawerOpen && (
        <div className="border-b border-zinc-200 bg-white px-4 sm:px-6 py-4 shadow-sm z-20 animate-fadeIn">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-zinc-900 font-sans uppercase">
                  Target Job Description & Role Context
                </h4>
              </div>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">
                Paste job post to re-score ATS keywords
              </span>
            </div>

            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job posting to compare exact ATS keywords, tech stack requirements, and seniority..."
              className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 resize-none font-sans"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-1 gap-2">
              <span className="text-[11px] text-zinc-500">
                {jobDescription.length ? `${jobDescription.split(/\s+/).filter(Boolean).length} words in target job` : "Using standard industry benchmark role baseline"}
              </span>
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setJobDrawerOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setJobDrawerOpen(false);
                    sessionStorage.setItem("HIRELY_SCAN_JD", jobDescription);
                    handlePerformScan(content, jobDescription);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Update & Re-scan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main 3-Pane Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Pane 1: Slim Left Sidebar (Hidden on mobile) */}
        <WorkspaceSidebar
          onNewScan={() => setNewScanModalOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* Pane 2: Center Document Editor (Hidden on mobile when diagnostic tab is active) */}
        <div className={`flex-1 flex flex-col ${mobileTab === "diagnostic" ? "hidden lg:flex" : "flex"}`}>
          <DocumentEditor
            content={content}
            onChangeContent={(newText) => {
              setContent(newText);
              sessionStorage.setItem("HIRELY_SCAN_TEXT", newText);
            }}
            bulletImprovements={scanResult?.bulletImprovements || []}
            documentName={documentName}
            onApplyImprovement={handleApplyImprovement}
          />
        </div>

        {/* Pane 3: Right ATS Diagnostic Assistant Panel (Hidden on mobile when editor tab is active) */}
        <div className={`w-full lg:w-[460px] flex-shrink-0 flex flex-col ${mobileTab === "editor" ? "hidden lg:flex" : "flex"}`}>
          <DiagnosticPanel
            result={scanResult}
            isLoading={isLoading}
            onRescan={() => handlePerformScan(content, jobDescription)}
            onApplyImprovement={handleApplyImprovement}
            onInsertKeyword={handleInsertKeyword}
            onInsertAddition={handleInsertAddition}
            onApplyAllImprovements={handleApplyAllImprovements}
            documentContent={content}
            documentName={documentName}
          />
        </div>
      </div>

      {/* Interactive Undo Toast Notification */}
      {undoToast && (
        <div className="fixed bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 bg-zinc-950 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs border border-zinc-800 animate-fadeIn max-w-[92vw]">
          <span className="font-medium truncate">{undoToast.message}</span>
          <button
            onClick={handleUndo}
            className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold flex items-center gap-1 transition-colors text-[11px] flex-shrink-0"
          >
            <Undo2 className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* API Key Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-[92vw] sm:max-w-md max-h-[85vh] overflow-y-auto bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                Gemini API Key
              </h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Google Gemini 2.5 Flash is currently connected. You can also override with another personal API key:
            </p>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs focus:outline-none focus:border-blue-600"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleSaveApiKey}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {apiKeySaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{apiKeySaved ? "Saved!" : "Save & Re-Scan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Scan Upload Modal */}
      {newScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-[92vw] sm:max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                Upload or Paste Resume / CV
              </h3>
              <button
                onClick={() => setNewScanModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 sm:p-6 rounded-xl border-2 border-dashed border-zinc-200 hover:border-blue-500 bg-zinc-50 hover:bg-blue-50/50 text-center cursor-pointer transition-colors space-y-2"
            >
              <FileText className="w-7 sm:w-8 h-7 sm:h-8 text-blue-600 mx-auto" />
              <div>
                <p className="text-xs font-semibold text-zinc-900">
                  Click to select a PDF, DOCX, or TXT file
                </p>
                <p className="text-[11px] text-zinc-500">
                  Direct in-memory text extraction & Gemini ATS analysis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <div className="flex-1 h-[1px] bg-zinc-200" />
              <span className="text-[10px]">OR PASTE TEXT</span>
              <div className="flex-1 h-[1px] bg-zinc-200" />
            </div>

            <textarea
              rows={4}
              placeholder="Paste resume text here..."
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs focus:outline-none focus:border-blue-600 resize-none font-sans"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setNewScanModalOpen(false);
                  handlePerformScan(content, jobDescription);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
              >
                Scan Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Limit Exceeded Modal (3 Scans/Day) */}
      {rateLimitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-[92vw] sm:max-w-md max-h-[85vh] overflow-y-auto bg-white border border-rose-100 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                </div>
                <h3 className="font-semibold text-sm text-zinc-900">
                  Daily Scan Limit Reached
                </h3>
              </div>
              <button
                onClick={() => setRateLimitModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-zinc-700 space-y-1 leading-relaxed">
              <p className="font-medium text-rose-950">
                Free Quota: 3 scans per day per IP
              </p>
              <p className="text-[11px] text-zinc-600">
                {rateLimitMessage || "Your IP address has submitted the maximum of 3 free resume scans for today to ensure server stability."}
              </p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-zinc-700 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-blue-900 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                Unlock Unlimited Free Scans:
              </p>
              <p className="text-[11px] text-zinc-600">
                You can plug in your own free Google Gemini API key (with 1,500 free requests/day) to bypass all IP limits permanently.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setRateLimitModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setRateLimitModalOpen(false);
                  setSettingsOpen(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Key className="w-3 h-3" />
                <span>Add Free API Key</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
