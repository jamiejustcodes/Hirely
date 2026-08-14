"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Edit3,
  Eye,
  ArrowRight,
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

  // Helper to render interactive sentence highlighting (GPTZero Style)
  const renderHighlightedContent = () => {
    if (!content) {
      return (
        <div className="text-zinc-400 italic py-12 text-center text-xs">
          No resume content loaded. Upload a PDF or paste your CV to start scanning.
        </div>
      );
    }

    const lines = content.split("\n");

    return (
      <div className="space-y-3 font-sans text-sm leading-relaxed text-zinc-900">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) {
            return <div key={lineIdx} className="h-2" />;
          }

          // Check if this line matches an improvement
          const matchingImprovement = bulletImprovements.find((b) => {
            const cleanOriginal = b.original.replace(/^["'•\-* ]+/, "").trim().slice(0, 25).toLowerCase();
            return line.toLowerCase().includes(cleanOriginal) || cleanOriginal.includes(line.toLowerCase().trim().slice(0, 25));
          });

          if (matchingImprovement) {
            return (
              <div key={lineIdx} className="relative group/line">
                <span
                  onClick={() => {
                    setActivePopover(matchingImprovement);
                    onSelectBullet?.(matchingImprovement);
                  }}
                  className="bg-[#ffebee] text-zinc-900 px-1 py-0.5 rounded cursor-pointer border-b-2 border-[#ef5350] hover:bg-[#ffcdd2] transition-colors inline"
                  title="Click to view STAR rewrite"
                >
                  {line}
                </span>

                {/* Floating 1-Click Improvement Popover */}
                {activePopover?.original === matchingImprovement.original && (
                  <div className="my-2 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xl space-y-2.5 max-w-lg z-30">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-zinc-100">
                      <span className="font-semibold text-[#1b806a] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> STAR Quantified Rewrite
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[10px]">
                        +{matchingImprovement.scoreAfter - matchingImprovement.scoreBefore} pts
                      </span>
                    </div>

                    <p className="text-xs text-zinc-900 leading-relaxed font-medium">
                      &ldquo;{matchingImprovement.improved}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setActivePopover(null)}
                        className="text-xs text-zinc-500 hover:text-zinc-700"
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
                        className="px-3 py-1 rounded-lg bg-[#1b806a] hover:bg-[#156956] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <span>Apply to Document</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Check if line contains strong quantifiable metrics
          const isStrongMetric =
            (line.includes("%") || line.includes("$") || line.includes("engineered") || line.includes("spearheaded") || line.includes("accelerated")) &&
            (line.trim().startsWith("-") || line.trim().startsWith("•") || line.trim().startsWith("*"));

          if (isStrongMetric) {
            return (
              <div key={lineIdx}>
                <span className="bg-[#e8f5e9] text-zinc-900 px-1 py-0.5 rounded border-b border-[#81c784] inline">
                  {line}
                </span>
              </div>
            );
          }

          return <p key={lineIdx} className="text-zinc-800">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] overflow-hidden">
      {/* Top Header Bar */}
      <div className="px-5 py-2.5 border-b border-zinc-200 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-600" />
          <h2 className="text-xs font-semibold text-zinc-900 truncate max-w-sm">
            {documentName}
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium border border-zinc-200">
            ATS Parsed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isEditing
                ? "bg-zinc-100 border-zinc-300 text-zinc-900"
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {isEditing ? (
              <>
                <Eye className="w-3 h-3 text-zinc-600" />
                <span>Highlights</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3 h-3 text-zinc-600" />
                <span>Edit Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Center White Paper Document Canvas */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-xl border border-zinc-200 shadow-2xs min-h-[600px]">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => onChangeContent(e.target.value)}
              className="w-full h-full min-h-[500px] text-sm font-sans text-zinc-900 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none leading-relaxed"
              placeholder="Paste or edit resume text..."
            />
          ) : (
            renderHighlightedContent()
          )}
        </div>
      </div>

      {/* Bottom Utility Bar */}
      <div className="px-5 py-2 border-t border-zinc-200 bg-white flex items-center justify-between text-xs text-zinc-500 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span>{wordsCount} words</span>
          <span>•</span>
          <span>{charsCount} characters</span>
        </div>
        <div className="text-[11px] text-zinc-400">
          Click pink highlighted lines to see instant STAR rewrites
        </div>
      </div>
    </div>
  );
}
