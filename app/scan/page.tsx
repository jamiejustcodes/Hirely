"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { DocumentEditor } from "@/components/workspace/DocumentEditor";
import { DiagnosticPanel } from "@/components/workspace/DiagnosticPanel";
import { ATSScanResult, SAMPLE_DATA } from "@/lib/mockData";
import { replaceBulletBlock, normalizeResumeText } from "@/lib/utils";
import { Sparkles, Key, Check, ArrowLeft, UploadCloud, X, FileText } from "lucide-react";
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
  const [customApiKey, setCustomApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ingest data from sessionStorage on load
  useEffect(() => {
    try {
      const storedText = sessionStorage.getItem("HIRELY_SCAN_TEXT");
      const storedJd = sessionStorage.getItem("HIRELY_SCAN_JD") || "";
      const storedDocName = sessionStorage.getItem("HIRELY_SCAN_DOC_NAME") || "My_Resume.pdf";
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
            particleCount: 30,
            spread: 45,
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

      if (response.ok) {
        const json = await response.json();
        const extracted = normalizeResumeText(json.extractedText || "");
        setContent(extracted);
        setScanResult(json.data);
        sessionStorage.setItem("HIRELY_SCAN_TEXT", extracted);
        sessionStorage.setItem("HIRELY_SCAN_DOC_NAME", file.name);
        sessionStorage.setItem("HIRELY_SCAN_RESULT", JSON.stringify(json.data));
      }
    } catch (err) {
      console.error("File upload scan error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Full-bullet block replacement: replaces the entire multi-line bullet with the STAR sentence
  const handleApplyImprovement = (original: string, improved: string) => {
    if (!content) return;
    const updated = replaceBulletBlock(content, original, improved);
    setContent(updated);
    sessionStorage.setItem("HIRELY_SCAN_TEXT", updated);
    bumpScore();
  };

  // 1-Click apply ALL STAR improvements across entire resume
  const handleApplyAllImprovements = () => {
    if (!content || !scanResult?.bulletImprovements?.length) return;

    let updated = content;
    scanResult.bulletImprovements.forEach((bullet) => {
      updated = replaceBulletBlock(updated, bullet.original, bullet.improved);
    });

    setContent(updated);
    sessionStorage.setItem("HIRELY_SCAN_TEXT", updated);

    if (scanResult) {
      setScanResult({
        ...scanResult,
        overallScore: Math.min(98, scanResult.overallScore + 12),
        categoryScores: {
          ...scanResult.categoryScores,
          impactAndMetrics: 95,
        },
      });
    }
  };

  const handleInsertKeyword = (keyword: string) => {
    if (!content) return;
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

  const bumpScore = () => {
    if (scanResult) {
      setScanResult({
        ...scanResult,
        overallScore: Math.min(98, scanResult.overallScore + 4),
        categoryScores: {
          ...scanResult.categoryScores,
          impactAndMetrics: Math.min(98, (scanResult.categoryScores?.impactAndMetrics || 70) + 6),
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
    <div className="h-screen w-screen bg-white text-zinc-950 flex flex-col overflow-hidden font-sans">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top Header Bar */}
      <header className="h-13 border-b border-zinc-200 bg-white px-4 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 text-xs font-medium px-2.5 py-1 rounded-md hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <div className="h-3.5 w-[1px] bg-zinc-200" />
          <span className="text-xs font-semibold text-zinc-900 tracking-tight">
            hirely<span className="text-blue-600">.ai</span> / studio
          </span>
        </div>

        <div className="flex items-center gap-2">
          {scanResult?.bulletImprovements?.length ? (
            <button
              onClick={handleApplyAllImprovements}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Apply All Rewrites</span>
            </button>
          ) : null}

          <button
            onClick={() => setNewScanModalOpen(true)}
            className="px-3 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload CV</span>
          </button>
        </div>
      </header>

      {/* Main 3-Pane Split Layout (GPTZero Style) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Pane 1: Slim Left Sidebar */}
        <WorkspaceSidebar
          onNewScan={() => setNewScanModalOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* Pane 2: Center Document Editor Canvas with Sentence Highlighting */}
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

        {/* Pane 3: Right ATS Diagnostic Assistant Panel */}
        <DiagnosticPanel
          result={scanResult}
          isLoading={isLoading}
          onRescan={() => handlePerformScan(content, jobDescription)}
          onApplyImprovement={handleApplyImprovement}
          onInsertKeyword={handleInsertKeyword}
          onApplyAllImprovements={handleApplyAllImprovements}
          onExportReport={() => {
            const blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ATS_Optimized_${documentName.replace(/\.[^/.]+$/, "")}.txt`;
            a.click();
          }}
        />
      </div>

      {/* API Key Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-xl space-y-4">
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
              Google Gemini 3.5 Flash is currently connected. You can also override with another personal API key:
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
          <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl p-6 shadow-xl space-y-4">
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
              className="p-6 rounded-xl border-2 border-dashed border-zinc-200 hover:border-blue-500 bg-zinc-50 hover:bg-blue-50/50 text-center cursor-pointer transition-colors space-y-2"
            >
              <FileText className="w-8 h-8 text-blue-600 mx-auto" />
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
              rows={5}
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
    </div>
  );
}
