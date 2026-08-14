"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  Briefcase,
  X,
  Zap,
} from "lucide-react";
import { SAMPLE_DATA } from "@/lib/mockData";

interface VibeInputBoxProps {
  onScan: (resumeText: string, jobDesc: string, file: File | null) => void;
  isLoading?: boolean;
}

export function VibeInputBox({ onScan, isLoading = false }: VibeInputBoxProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showJobInput, setShowJobInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  const loadSample = (type: "softwareEngineer" | "productManager") => {
    const sample = SAMPLE_DATA[type];
    setResumeText(sample.resumeText);
    setJobDescription(sample.jobDescription);
    setSelectedFile(null);
    setShowJobInput(true);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resumeText.trim() && !selectedFile) {
      loadSample("softwareEngineer");
      return;
    }
    onScan(resumeText, jobDescription, selectedFile);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative group">
      {/* Subtle outer glow on hover */}
      <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-blue-500/15 opacity-50 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 pointer-events-none" />

      {/* Main Crisp White Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative z-10 bg-white text-zinc-900 rounded-2xl p-5 border transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.05)] ${
          dragOver
            ? "border-blue-500 ring-4 ring-blue-500/15 bg-blue-50/40"
            : "border-zinc-200/90 hover:border-zinc-300"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Top Presets & Active File */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-zinc-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap font-sans">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Try sample roles:
            </span>
            <button
              type="button"
              onClick={() => loadSample("softwareEngineer")}
              className="px-3 py-1 rounded-full bg-zinc-100/80 hover:bg-zinc-200/70 border border-zinc-200/60 text-zinc-700 font-sans text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs hover:border-zinc-300"
            >
              <Zap className="w-3 h-3 text-sky-500" />
              Senior Full-Stack Engineer
            </button>
            <button
              type="button"
              onClick={() => loadSample("productManager")}
              className="px-3 py-1 rounded-full bg-zinc-100/80 hover:bg-zinc-200/70 border border-zinc-200/60 text-zinc-700 font-sans text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs hover:border-zinc-300"
            >
              <Briefcase className="w-3 h-3 text-indigo-500" />
              Lead Product Manager
            </button>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 font-sans text-xs font-medium">
              <FileText className="w-3.5 h-3.5" />
              <span className="max-w-[150px] truncate">{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="hover:text-rose-600 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Text Input Areas */}
        <div className="space-y-3">
          <div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here or drag & drop a PDF / DOCX file..."
              rows={4}
              className="w-full text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>

          {/* Job Description Drawer */}
          {showJobInput && (
            <div className="pt-3 border-t border-dashed border-zinc-200 animate-fadeIn">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-sans font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                  Target Job Description (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowJobInput(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 font-sans"
                >
                  Hide
                </button>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job posting to compare exact ATS keywords and hard requirements..."
                rows={3}
                className="w-full text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 bg-zinc-50 p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-blue-500 resize-none font-sans"
              />
            </div>
          )}
        </div>

        {/* Bottom Utility Bar */}
        <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Attach PDF / DOCX</span>
            </button>

            {!showJobInput && (
              <button
                type="button"
                onClick={() => setShowJobInput(true)}
                className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>+ Add Job Post</span>
              </button>
            )}
          </div>

          {/* Action Trigger Button (Cyan Blue matching background) */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-semibold tracking-wide shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Auditing ATS...</span>
              </>
            ) : (
              <>
                <span>Scan Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
