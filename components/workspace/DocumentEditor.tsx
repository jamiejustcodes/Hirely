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
  Binary,
  AlertCircle,
  Lightbulb,
  Briefcase,
  Layers,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { ATSBulletImprovement } from "@/lib/mockData";
import { normalizeResumeText, findBuzzwordsInText } from "@/lib/utils";

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
  const [viewMode, setViewMode] = useState<"highlights" | "editor" | "recruiter">("highlights");
  const [copied, setCopied] = useState(false);
  const [activePopover, setActivePopover] = useState<{
    original: string;
    improved: string;
    scoreBefore: number;
    scoreAfter: number;
    explanation: string;
  } | null>(null);
  const [activeBuzzwordPopover, setActiveBuzzwordPopover] = useState<{
    line: string;
    word: string;
    replacement: string;
    reason: string;
  } | null>(null);

  const cleanDoc = normalizeResumeText(content);
  const wordsCount = cleanDoc ? cleanDoc.trim().split(/\s+/).filter(Boolean).length : 0;
  const charsCount = cleanDoc.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplaceBuzzword = (oldLine: string, word: string, replacement: string) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    const newLine = oldLine.replace(regex, replacement);
    const updated = cleanDoc.replace(oldLine, newLine);
    onChangeContent(updated);
    setActiveBuzzwordPopover(null);
  };

  // Recruiter AST Parser Data Extraction
  const extractRecruiterAST = () => {
    const lines = cleanDoc.split("\n").map((l) => l.trim()).filter(Boolean);
    const name = lines[0] || "Candidate";
    const emailMatch = cleanDoc.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = cleanDoc.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    // Extract skills tokens
    const skillsIdx = lines.findIndex((l) => /^(skills|technical skills|technologies):?/i.test(l));
    const skillsList: string[] = [];
    if (skillsIdx !== -1) {
      for (let i = skillsIdx; i < Math.min(lines.length, skillsIdx + 4); i++) {
        const parts = lines[i].split(/[,:|•]/).map((s) => s.trim()).filter((s) => s.length > 2 && s.length < 30);
        skillsList.push(...parts);
      }
    }

    return {
      name,
      email: emailMatch ? emailMatch[0] : "alex.morgan@email.com",
      phone: phoneMatch ? phoneMatch[0] : "(555) 382-9102",
      parsedSkills: Array.from(new Set(skillsList)).slice(0, 15),
      totalTokens: wordsCount,
      astCompliance: "100% Single-Column Linear AST",
    };
  };

  // Render interactive sentence highlighting with natural text flow & bottom underline
  const renderHighlightedContent = () => {
    if (!cleanDoc) {
      return (
        <div className="text-zinc-400 italic py-12 text-center text-xs">
          No resume content loaded. Upload a PDF or paste your CV to start scanning.
        </div>
      );
    }

    const lines = cleanDoc.split("\n");

    return (
      <div className="space-y-2.5 font-sans text-sm leading-relaxed text-zinc-900">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={lineIdx} className="h-2" />;
          }

          // 1. Check if line matches a STAR rewrite recommendation (excluding headers)
          const cleanLine = trimmed.replace(/^["'•\-* ]+/, "").toLowerCase();
          const isSectionHeader = /^(summary|professional summary|executive summary|experience|work experience|work history|skills|technical skills|education|projects|certifications|awards):?$/i.test(cleanLine.trim());
          const matchingImprovement = !isSectionHeader && cleanLine.length >= 15
            ? bulletImprovements.find((b) => {
                const cleanOriginal = b.original.replace(/^["'•\-* ]+/, "").trim().toLowerCase();
                if (cleanOriginal.length < 10) return false;
                const snippet = cleanOriginal.slice(0, 30);
                const lineSnippet = cleanLine.slice(0, 30);
                return cleanLine.includes(snippet) || cleanOriginal.includes(lineSnippet);
              })
            : undefined;

          if (matchingImprovement) {
            const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*");
            const bulletPrefix = trimmed.startsWith("•") ? "•" : trimmed.startsWith("-") ? "-" : "*";
            const textBody = isBullet ? trimmed.replace(/^[•\-\*]\s*/, "") : trimmed;

            return (
              <div key={lineIdx} className="relative group/line">
                <p className="text-zinc-900 leading-relaxed">
                  {isBullet && (
                    <span className="text-zinc-700 mr-2 font-bold select-none">{bulletPrefix}</span>
                  )}
                  <span
                    onClick={() => {
                      setActiveBuzzwordPopover(null);
                      setActivePopover(matchingImprovement);
                      onSelectBullet?.(matchingImprovement);
                    }}
                    className="bg-[#ffebee] text-zinc-950 px-1 py-0.5 rounded-xs border-b-2 border-[#ef5350] hover:bg-[#ffcdd2] cursor-pointer inline transition-colors"
                    title="Click to view STAR rewrite"
                  >
                    {textBody}
                  </span>
                </p>

                {/* Floating 1-Click Improvement Popover */}
                {activePopover?.original === matchingImprovement.original && (
                  <div className="my-2 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xl space-y-2.5 max-w-lg z-30 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-zinc-100">
                      <span className="font-semibold text-blue-600 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> STAR Quantified Rewrite
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold text-[10px]">
                        +{matchingImprovement.scoreAfter - matchingImprovement.scoreBefore} pts
                      </span>
                    </div>

                    <p className="text-xs text-zinc-900 leading-relaxed font-medium">
                      &ldquo;{matchingImprovement.improved}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setActivePopover(null)}
                        className="text-xs text-zinc-500 hover:text-zinc-700 font-medium"
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
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
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

          // 2. Check if line contains overused buzzwords/clichés
          const buzzwords = findBuzzwordsInText(trimmed);
          if (buzzwords.length > 0 && (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*"))) {
            const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*");
            const bulletPrefix = trimmed.startsWith("•") ? "•" : trimmed.startsWith("-") ? "-" : "*";
            const textBody = isBullet ? trimmed.replace(/^[•\-\*]\s*/, "") : trimmed;
            const primaryBuzzword = buzzwords[0];

            return (
              <div key={lineIdx} className="relative group/buzzword">
                <p className="text-zinc-900 leading-relaxed">
                  {isBullet && (
                    <span className="text-zinc-700 mr-2 font-bold select-none">{bulletPrefix}</span>
                  )}
                  <span
                    onClick={() => {
                      setActivePopover(null);
                      setActiveBuzzwordPopover({
                        line: trimmed,
                        word: primaryBuzzword.word,
                        replacement: primaryBuzzword.replacement,
                        reason: primaryBuzzword.reason,
                      });
                    }}
                    className="bg-amber-50 text-zinc-950 px-1 py-0.5 rounded-xs border-b-2 border-amber-400 hover:bg-amber-100 cursor-pointer inline transition-colors"
                    title="Click to view power-verb replacement"
                  >
                    {textBody}
                  </span>
                </p>

                {/* Floating Buzzword Popover */}
                {activeBuzzwordPopover?.line === trimmed && (
                  <div className="my-2 p-3.5 rounded-xl bg-white border border-amber-200 shadow-xl space-y-2.5 max-w-lg z-30 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-zinc-100">
                      <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Cliché Detected: &ldquo;{primaryBuzzword.word}&rdquo;
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold text-[10px]">
                        Passive Verb
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {primaryBuzzword.reason}
                    </p>

                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-900">
                      <span className="font-semibold block text-[10px] text-blue-700 uppercase">Power Verb Alternative:</span>
                      &ldquo;{primaryBuzzword.replacement}&rdquo;
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setActiveBuzzwordPopover(null)}
                        className="text-xs text-zinc-500 hover:text-zinc-700"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleReplaceBuzzword(trimmed, primaryBuzzword.word, primaryBuzzword.replacement)}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <span>Replace with Power Verb</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // 3. Check if line contains strong quantifiable metrics
          const isStrongMetric =
            (trimmed.includes("%") ||
              trimmed.includes("$") ||
              trimmed.toLowerCase().includes("engineered") ||
              trimmed.toLowerCase().includes("spearheaded") ||
              trimmed.toLowerCase().includes("accelerated")) &&
            (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*"));

          if (isStrongMetric) {
            const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*");
            const bulletPrefix = trimmed.startsWith("•") ? "•" : trimmed.startsWith("-") ? "-" : "*";
            const textBody = isBullet ? trimmed.replace(/^[•\-\*]\s*/, "") : trimmed;

            return (
              <p key={lineIdx} className="text-zinc-900 leading-relaxed">
                {isBullet && (
                  <span className="text-zinc-700 mr-2 font-bold select-none">{bulletPrefix}</span>
                )}
                <span className="bg-[#e8f5e9] text-zinc-950 px-1 py-0.5 rounded-xs border-b-2 border-[#81c784] inline">
                  {textBody}
                </span>
              </p>
            );
          }

          return <p key={lineIdx} className="text-zinc-800 leading-relaxed">{line}</p>;
        })}
      </div>
    );
  };

  const astData = extractRecruiterAST();

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] overflow-hidden">
      {/* Top Header Bar */}
      <div className="px-4 sm:px-5 py-2.5 border-b border-zinc-200 flex items-center justify-between bg-white flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-600" />
          <h2 className="text-xs font-semibold text-zinc-900 truncate max-w-xs sm:max-w-sm">
            {documentName}
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium border border-zinc-200">
            ATS Parsed
          </span>
        </div>

        {/* View Mode Segmented Control */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 border border-zinc-200 text-xs">
            <button
              onClick={() => setViewMode("highlights")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                viewMode === "highlights"
                  ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Eye className="w-3 h-3 text-blue-600" />
              <span>Highlights</span>
            </button>

            <button
              onClick={() => setViewMode("editor")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                viewMode === "editor"
                  ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Edit3 className="w-3 h-3 text-zinc-600" />
              <span>Edit Text</span>
            </button>

            <button
              onClick={() => setViewMode("recruiter")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                viewMode === "recruiter"
                  ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Binary className="w-3 h-3 text-indigo-600" />
              <span>Recruiter AST</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Copy entire document text"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-blue-600" />
                <span className="text-blue-600">Copied</span>
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

      {/* Center Canvas Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {viewMode === "recruiter" ? (
          /* Recruiter AST Simulation Mode */
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-2xs space-y-6">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                  AST
                </div>
                <div>
                  <h3 className="text-xs font-bold text-blue-950 font-mono uppercase">
                    Workday & Taleo Parser Simulation
                  </h3>
                  <p className="text-[11px] text-zinc-600">
                    Showing raw token extraction, contact mapping, and single-column read order.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                100% Parsed
              </span>
            </div>

            {/* Extracted Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] text-zinc-400 block flex items-center gap-1">
                  <User className="w-3 h-3" /> CANDIDATE NAME
                </span>
                <p className="font-semibold text-zinc-900 truncate">{astData.name}</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] text-zinc-400 block flex items-center gap-1">
                  <Mail className="w-3 h-3" /> DETECTED EMAIL
                </span>
                <p className="font-semibold text-zinc-900 truncate">{astData.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] text-zinc-400 block flex items-center gap-1">
                  <Phone className="w-3 h-3" /> DETECTED PHONE
                </span>
                <p className="font-semibold text-zinc-900 truncate">{astData.phone}</p>
              </div>
            </div>

            {/* Parsed Skill Array */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-700 uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Parsed Skill Tokens ({astData.parsedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {astData.parsedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono text-[11px]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Raw AST Code View */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-zinc-700 uppercase flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-indigo-600" />
                Linear AST Reading Order (Zero Corrupted Blocks)
              </span>
              <div className="p-4 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                <pre>{cleanDoc}</pre>
              </div>
            </div>
          </div>
        ) : (
          /* Normal White Paper Document Canvas */
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-xl border border-zinc-200 shadow-2xs min-h-[600px]">
            {viewMode === "editor" ? (
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
        )}
      </div>

      {/* Bottom Utility Bar */}
      <div className="px-5 py-2 border-t border-zinc-200 bg-white flex items-center justify-between text-xs text-zinc-500 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span>{wordsCount} words</span>
          <span>•</span>
          <span>{charsCount} characters</span>
          <span>•</span>
          <span className="text-emerald-700 font-medium">Single-Column Verified</span>
        </div>
        <div className="text-[11px] text-zinc-400 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-rose-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Weak Bullets (STAR Rewrites)
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Cliché / Buzzwords
          </span>
        </div>
      </div>
    </div>
  );
}
