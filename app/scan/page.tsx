"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { DocumentEditor } from "@/components/workspace/DocumentEditor";
import { DiagnosticPanel } from "@/components/workspace/DiagnosticPanel";
import { ATSScanResult, SAMPLE_DATA, ATSBulletImprovement } from "@/lib/mockData";
import { Sparkles, Key, Check, ArrowLeft, UploadCloud, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function ScanWorkspacePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [documentName, setDocumentName] = useState("Marcus_Vance_Staff_Engineer_Resume.pdf");
  const [scanResult, setScanResult] = useState<ATSScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newScanModalOpen, setNewScanModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Ingest data from sessionStorage on load
  useEffect(() => {
    try {
      const storedText = sessionStorage.getItem("HIRELY_SCAN_TEXT");
      const storedJd = sessionStorage.getItem("HIRELY_SCAN_JD") || "";
      const storedDocName = sessionStorage.getItem("HIRELY_SCAN_DOC_NAME") || "My_Resume.pdf";
      const storedResult = sessionStorage.getItem("HIRELY_SCAN_RESULT");

      if (storedText) {
        setContent(storedText);
        setDocumentName(storedDocName);
        setJobDescription(storedJd);

        if (storedResult) {
          try {
            setScanResult(JSON.parse(storedResult));
          } catch (e) {
            handlePerformScan(storedText, storedJd);
          }
        } else {
          handlePerformScan(storedText, storedJd);
        }
      } else {
        // Default sample candidate
        const sample = SAMPLE_DATA.softwareEngineer;
        setContent(sample.resumeText);
        setJobDescription(sample.jobDescription);
        setDocumentName("Marcus_Vance_Staff_Engineer_Resume.pdf");
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
    if (!textToScan.trim()) return;
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
        }),
      });

      if (!response.ok) {
        throw new Error("Scan request failed");
      }

      const json = await response.json();
      setScanResult(json.data);
      sessionStorage.setItem("HIRELY_SCAN_RESULT", JSON.stringify(json.data));

      if (json.data?.overallScore >= 80) {
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } catch (error) {
      console.error("Scan error:", error);
      setScanResult(SAMPLE_DATA.softwareEngineer.mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyImprovement = (original: string, improved: string) => {
    if (!content) return;
    const updated = content.replace(original, improved);
    setContent(updated);
    sessionStorage.setItem("HIRELY_SCAN_TEXT", updated);

    // Optimistically bump score
    if (scanResult) {
      setScanResult({
        ...scanResult,
        overallScore: Math.min(99, scanResult.overallScore + 3),
      });
    }
  };

  const handleInsertKeyword = (keyword: string) => {
    if (!content) return;
    const skillsHeading = "TECHNICAL SKILLS:";
    let updated = content;

    if (content.includes(skillsHeading)) {
      updated = content.replace(
        skillsHeading,
        `${skillsHeading} ${keyword},`
      );
    } else {
      updated = `${content}\n\n• Key Competency: ${keyword}`;
    }

    setContent(updated);
    sessionStorage.setItem("HIRELY_SCAN_TEXT", updated);

    if (scanResult) {
      setScanResult({
        ...scanResult,
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

  const handleSaveApiKey = () => {
    if (customApiKey.trim()) {
      localStorage.setItem("HIRELY_GEMINI_API_KEY", customApiKey.trim());
      setApiKeySaved(true);
      setTimeout(() => {
        setApiKeySaved(false);
        setSettingsOpen(false);
        handlePerformScan(content, jobDescription);
      }, 1200);
    }
  };

  return (
    <div className="h-screen w-screen bg-white text-zinc-950 flex flex-col overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-zinc-200 bg-white px-4 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-200" />
          <span className="text-sm font-bold tracking-tight text-zinc-950 lowercase">
            hirely<span className="text-blue-600">.ai</span> / studio
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewScanModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Scan</span>
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                Google Gemini API Key
              </h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Hirely provides a free engine by default. You can also connect your own free key from Google AI Studio.
            </p>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:border-blue-600"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                Upload New Resume / CV
              </h3>
              <button
                onClick={() => setNewScanModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={6}
              placeholder="Paste new resume text here..."
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 resize-none font-sans"
            />
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  const sample = SAMPLE_DATA.productManager;
                  setContent(sample.resumeText);
                  setJobDescription(sample.jobDescription);
                  setDocumentName("Elena_Rostova_Lead_PM_Resume.pdf");
                  setNewScanModalOpen(false);
                  handlePerformScan(sample.resumeText, sample.jobDescription);
                }}
                className="text-xs text-blue-600 hover:underline font-mono"
              >
                Load PM Sample CV
              </button>
              <button
                onClick={() => {
                  setNewScanModalOpen(false);
                  handlePerformScan(content, jobDescription);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Start Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
