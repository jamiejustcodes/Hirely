"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Edit3,
  Eye,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { ATSBulletImprovement } from "@/lib/mockData";

interface DocumentEditorProps {
  content: string;
  onChangeContent: (newContent: string) => void;
  bulletImprovements?: ATSBulletImprovement[];
  documentName?: string;
  onSelectBullet?: (bullet: ATSBulletImprovement) => void;
  onApplyImprovement?: (original: string, improved: string) => void;
}

export function DocumentEditor({
  content,
  onChangeContent,
  bulletImprovements = [],
  documentName = "Marcus_Vance_Resume.pdf",
  onSelectBullet,
  onApplyImprovement,
}: DocumentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePopover, setActivePopover] = useState<{
    original: string;
    improved: string;
    scoreBefore: number;
    scoreAfter: number;
    explanation: string;
  } | null>(null);

  const wordsCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charsCount = content.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render interactive sentence highlighting
  const renderHighlightedContent = () => {
    if (!content) {
      return (
        <div className="text-zinc-400 italic py-8 text-center">
          No resume content loaded. Paste or upload your CV to start scanning.
        </div>
      );
    }

    const lines = content.split("\n");

    return (
      <div className="space-y-3 font-sans text-sm sm:text-base leading-relaxed text-zinc-800">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) {
            return <div key={lineIdx} className="h-3" />;
          }

          // Check if this line contains a match with a bullet improvement
          const matchingImprovement = bulletImprovements.find(
            (b) =>
              line.toLowerCase().includes(b.original.toLowerCase().slice(0, 30)) ||
              b.original.toLowerCase().includes(line.toLowerCase().slice(0, 30))
          );

          if (matchingImprovement) {
            return (
              <div key={lineIdx} className="relative group/line">
                <span
                  onClick={() => {
                    setActivePopover(matchingImprovement);
                    onSelectBullet?.(matchingImprovement);
                  }}
                  className="bg-rose-100/90 text-rose-950 px-1 py-0.5 rounded cursor-pointer border-b-2 border-rose-400 hover:bg-rose-200 transition-colors inline-block"
                  title="Click to see STAR quantified rewrite"
                >
                  {line}
                </span>

                {/* Floating 1-Click Improvement Popover */}
                {activePopover?.original === matchingImprovement.original && (
                  <div className="my-3 p-4 rounded-xl bg-white border border-zinc-200 shadow-xl space-y-3 animate-fadeIn z-30 max-w-lg">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                      <span className="font-bold text-blue-600 flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-3.5 h-3.5" /> STAR QUANTIFIED REWRITE
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        +{matchingImprovement.scoreAfter - matchingImprovement.scoreBefore} pts
                      </span>
                    </div>

                    <p className="text-xs text-zinc-900 leading-relaxed font-medium">
                      &ldquo;{matchingImprovement.improved}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setActivePopover(null)}
                        className="text-xs text-zinc-400 hover:text-zinc-600 font-mono"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => {
                          onApplyImprovement?.(
                            matchingImprovement.original,
                            matchingImprovement.improved
                          );
                          setActivePopover(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <span>Apply to Document</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Check if line contains strong quantifiable metrics (Google XYZ)
          const isStrongMetric =
            line.includes("%") ||
            line.includes("$") ||
            line.includes("engineered") ||
            line.includes("spearheaded") ||
            line.includes("increased");

          if (isStrongMetric && line.startsWith("-") || line.startsWith("•")) {
            return (
              <div key={lineIdx}>
                <span className="bg-emerald-50/90 text-emerald-950 px-1 py-0.5 rounded border-b border-emerald-300">
                  {line}
                </span>
              </div>
            );
          }

          return <p key={lineIdx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Document Canvas Top Header */}
      <div className="px-6 py-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-zinc-900 font-sans truncate max-w-sm">
            {documentName}
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            ATS Parsed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isEditing
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Show Highlights</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-zinc-600" />
                <span>Edit Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Document Content Canvas */}
      <div className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-4xl w-full mx-auto">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => onChangeContent(e.target.value)}
            className="w-full h-full min-h-[500px] text-sm sm:text-base font-sans text-zinc-900 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none leading-relaxed"
            placeholder="Edit your resume text..."
          />
        ) : (
          renderHighlightedContent()
        )}
      </div>

      {/* Bottom Utility Bar (GPTZero Style) */}
      <div className="px-6 py-2.5 border-t border-zinc-200 bg-zinc-50/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-4">
          <span>{wordsCount} words</span>
          <span>•</span>
          <span>{charsCount} characters</span>
          <span>•</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Single-Column Clean
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400">Click highlighted text for instant STAR rewrites</span>
        </div>
      </div>
    </div>
  );
}
